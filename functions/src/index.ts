/**
 * Import required modules and functions.
 */
import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";
import * as nodemailer from "nodemailer";
import * as logger from "firebase-functions/logger";

// Initialize Firebase Admin only once
if (!admin.apps.length) {
  admin.initializeApp();
}

/**
 * Retrieve Mailgun SMTP credentials from Firebase Functions config.
 * Make sure to set these with:
 * firebase functions:config:set mailgun.username="your-username" mailgun.password="your-password" mailgun.sender="Your Name <email@domain.com>"
 */
const mailgunUsername = functions.config().mailgun?.username;
const mailgunPassword = functions.config().mailgun?.password;
const mailgunSender = functions.config().mailgun?.sender;

// Validate email configuration is present
if (!mailgunUsername || !mailgunPassword) {
  logger.error("Mailgun configuration is missing. Please verify your SMTP credentials.");
}

/**
 * Configure Nodemailer with Mailgun SMTP settings
 */
const transporter = nodemailer.createTransport({
  host: "smtp.mailgun.org",
  port: 587,
  secure: false,
  auth: {
    user: mailgunUsername,
    pass: mailgunPassword,
  },
  tls: {
    rejectUnauthorized: false // Only use in development, remove in production
  }
});

/**
 * List the Firestore collections that should trigger an email.
 */
const allowedCollections = [
  "TradeRequests",
  "SellRequests",
  "Requests",
  "Messages"
];

/**
 * Firestore Trigger: on document creation in any allowed collection.
 * Specifying us-central1 region to reduce latency.
 */
export const onRequestDocCreate = functions
  .region('us-central1')
  .firestore
  .document("{collectionName}/{docId}")
  .onCreate(async (snapshot, context) => {
    logger.info(`Function triggered for document ${context.params.docId} in collection ${context.params.collectionName}`);

    const collectionName = context.params.collectionName;

    // Check if this is a collection we care about
    if (!allowedCollections.includes(collectionName)) {
      logger.info(`Skipping document in ${collectionName} as it is not in the monitored collections.`);
      return null;
    }

    // Get document data
    const data = snapshot.data();
    if (!data) {
      logger.error(`No data in document ${context.params.docId} of ${collectionName}.`);
      return null;
    }

    logger.info(`Processing data from ${collectionName}`, { docId: context.params.docId });

    // Extract fields from the document payload
    const {
      mode = "unknown", // Default value to prevent undefined errors
      email = "",
      phoneNumber = "",
      message = "",
      reference = "",
      photoURL = "",
      createdAt = new Date().toISOString(),
      watchBrand = "",
      watchModel = "",
      watchPrice = "",
      watchId = ""
    } = data;

    // Validate minimum required fields - for Messages collection, the validation might be different
    const isMessageCollection = collectionName === "Messages";

    if (!isMessageCollection && (!email || !phoneNumber)) {
      logger.error(`Missing required fields in document ${context.params.docId} of ${collectionName}.`, { data });
      return null;
    }

    // Determine a human-friendly request type
    let requestTypeText = "";
    switch (mode) {
      case "trade":
        requestTypeText = "Trade Request";
        break;
      case "sell":
        requestTypeText = "Sell Request";
        break;
      case "request":
        requestTypeText = "Customer Inquiry";
        break;
      default:
        requestTypeText = collectionName === "Messages" ? "Customer Message" : "Website Request";
    }

    // Different email structures based on collection
    let emailSubject = '';
    let emailHtml = '';

    if (isMessageCollection) {
      // Email structure for Messages collection
      emailSubject = `New Customer Message - ${data.name || 'Website Visitor'}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002d4e;">New Customer Message</h2>
          <h3>Contact Information:</h3>
          <p>
            <strong>Name:</strong> ${data.name || 'Not provided'}<br>
            <strong>Email:</strong> ${data.email || 'Not provided'}<br>
            <strong>Phone:</strong> ${data.phone || 'Not provided'}<br>
            <strong>Submitted At:</strong> ${createdAt}<br>
          </p>
          <h3>Message:</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${(data.message || '').replace(/\n/g, "<br>")}
          </p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This email was automatically sent from the Watch Salon website.</p>
          </div>
        </div>
      `;
    } else {
      // Email structure for Request collections (Trade, Sell, Inquiry)
      emailSubject = `New ${requestTypeText} - ${reference || "No Reference"}`;
      emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002d4e;">New ${requestTypeText}</h2>
          <h3>Contact Information:</h3>
          <p>
            <strong>Email:</strong> ${email}<br>
            <strong>Phone:</strong> ${phoneNumber}<br>
            <strong>Reference:</strong> ${reference || "N/A"}<br>
            <strong>Submitted At:</strong> ${createdAt || "N/A"}<br>
          </p>
          <h3>Message:</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${message.replace(/\n/g, "<br>")}
          </p>
          ${(watchBrand || watchModel) ? `
            <h3>Watch Details:</h3>
            <p>
              ${watchBrand ? `<strong>Brand:</strong> ${watchBrand}<br>` : ""}
              ${watchModel ? `<strong>Model:</strong> ${watchModel}<br>` : ""}
              ${watchPrice ? `<strong>Price:</strong> $${watchPrice}<br>` : ""}
              ${watchId ? `<strong>ID:</strong> ${watchId}<br>` : ""}
            </p>
            ` : ""
        }
          ${photoURL ? `<h3>Photo:</h3><p><a href="${photoURL}">View Photo</a></p>` : ""}
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This email was automatically sent from the Watch Salon website.</p>
          </div>
        </div>
      `;
    }

    // Compose the email
    const mailOptions = {
      from: mailgunSender,
      to: "cclosework@gmail.com", // Partner's email
      subject: emailSubject,
      html: emailHtml,
    };

    try {
      // Verify the transporter first
      logger.info("Verifying Mailgun SMTP connection...");
      await transporter.verify();
      logger.info("Mailgun SMTP connection verified successfully");

      // Send the email
      logger.info("Sending email notification via Mailgun SMTP...");
      const info = await transporter.sendMail(mailOptions);
      logger.info(`Email sent successfully for document ${context.params.docId}`, {
        messageId: info.messageId,
        collection: collectionName
      });

      // Update the document to mark email as sent
      await snapshot.ref.update({
        emailSent: true,
        emailSentTimestamp: admin.firestore.FieldValue.serverTimestamp(),
      });

      logger.info(`Document ${context.params.docId} marked as processed`);

    } catch (error) {
      // More comprehensive error logging
      logger.error("Error sending email via Mailgun SMTP", {
        error: (error as any).message,
        stack: (error as any).stack,
        code: (error as any).code,
        docId: context.params.docId,
        collection: collectionName
      });

      // Save the error to the document for debugging
      try {
        await snapshot.ref.update({
          emailError: (error as any).message,
          emailErrorTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        });
      } catch (updateError) {
        logger.error("Failed to update document with error status", {
          error: (updateError as any).message,
          docId: context.params.docId
        });
      }
    }

    return null;
  });