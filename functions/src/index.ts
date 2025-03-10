/**
 * Import function triggers from their respective submodules.
 */
import { onRequest } from "firebase-functions/v2/https";
import { onCall } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import axios from "axios";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import * as nodemailer from "nodemailer";

admin.initializeApp();

/**
 * Sends an email notification when a user submits a request
 * This function can be called from your client app
 */
export const sendRequestNotification = onCall(async (data) => {
  try {
    // Validate required fields
    if (!data.requestType || !data.userName || !data.userEmail || !data.message) {
      throw new Error("Missing required fields. Please provide requestType, userName, userEmail, and message.");
    }

    // Set up email transporter using Gmail SMTP
    // Note: You should set up environment variables for these in your Firebase project
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // These will be set as environment variables in Firebase
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
      }
    });

    // Format the requestType for the email subject
    let requestTypeText = "";
    switch (data.requestType) {
      case "trade":
        requestTypeText = "Trade Request";
        break;
      case "sell":
        requestTypeText = "Sell Request";
        break;
      case "inquiry":
        requestTypeText = "Customer Inquiry";
        break;
      default:
        requestTypeText = "Website Request";
    }

    // Item details if provided
    const itemDetails = data.itemDetails ? 
      `<h3>Item Details:</h3>
       <p>
         ${data.itemDetails.brand ? `<strong>Brand:</strong> ${data.itemDetails.brand}<br>` : ''}
         ${data.itemDetails.model ? `<strong>Model:</strong> ${data.itemDetails.model}<br>` : ''}
         ${data.itemDetails.referenceNumber ? `<strong>Reference:</strong> ${data.itemDetails.referenceNumber}<br>` : ''}
         ${data.itemDetails.price ? `<strong>Price:</strong> $${data.itemDetails.price.toLocaleString()}<br>` : ''}
       </p>` 
      : '';

    // User contact information
    const userPhone = data.userPhone ? `<strong>Phone:</strong> ${data.userPhone}<br>` : '';
    
    // Construct email HTML
    const mailOptions = {
      from: {
        name: "Watch Salon Notifications",
        address: process.env.EMAIL_USER || "notifications@example.com"
      },
      to: "cclose@shrevecrumpandlow.com",
      subject: `New ${requestTypeText} from ${data.userName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #002d4e;">New ${requestTypeText}</h2>
          
          <h3>Customer Information:</h3>
          <p>
            <strong>Name:</strong> ${data.userName}<br>
            <strong>Email:</strong> ${data.userEmail}<br>
            ${userPhone}
          </p>
          
          ${itemDetails}
          
          <h3>Message:</h3>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${data.message.replace(/\n/g, '<br>')}
          </p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This email was automatically sent from Watch Salon website.</p>
          </div>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Log success
    logger.info(`Email notification sent for ${requestTypeText} from ${data.userName}`);

    // Store the request in Firestore for reference
    await admin.firestore().collection("Requests").add({
      type: data.requestType,
      userName: data.userName,
      userEmail: data.userEmail,
      userPhone: data.userPhone || null,
      message: data.message,
      itemDetails: data.itemDetails || null,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true, message: "Notification sent successfully" };
  } catch (error: any) {
    logger.error("Error sending notification email:", error);
    throw new Error(`Failed to send notification: ${error.message}`);
  }
});

export const importWatch = onRequest(async (req, res) => {
  // Allow only POST requests
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  try {
    // Parse the incoming JSON payload
    const data = req.body;

    // Use default values for missing required fields
    const brand = data.brand || "Unknown Brand";
    const model = data.model || "Unknown Model";

    // ***********************************************
    // STEP 1: Collect Image URLs from Various Sources
    // ***********************************************
    let allImageUrls: string[] = [];

    // 1. Direct image array (if provided)
    if (data.image && Array.isArray(data.image)) {
      allImageUrls.push(...data.image);
    }

    // 2. From post_meta (e.g., gallery and featured image)
    if (data.post_meta) {
      if (data.post_meta._gallery && Array.isArray(data.post_meta._gallery)) {
        allImageUrls.push(...data.post_meta._gallery);
      }
      if (data.post_meta._thumbnail_id) {
        allImageUrls.push(data.post_meta._thumbnail_id);
      }
    }

    // 3. From attached media (e.g., attachment_urls array)
    if (data.attachment_urls && Array.isArray(data.attachment_urls)) {
      const mediaUrls = data.attachment_urls.filter((url: string) =>
        url.match(/\.(jpg|jpeg|png|gif)$/i)
      );
      allImageUrls.push(...mediaUrls);
    }

    // 4. From ACF (Advanced Custom Fields) image fields
    if (data.acf) {
      if (data.acf.image_field) {
        allImageUrls.push(data.acf.image_field);
      }
      if (data.acf.gallery_field && Array.isArray(data.acf.gallery_field)) {
        allImageUrls.push(...data.acf.gallery_field);
      }
    }

    // 5. From Gutenberg blocks (core/image or core/gallery)
    if (data.blocks && Array.isArray(data.blocks)) {
      data.blocks.forEach((block: any) => {
        if (block.blockName === "core/image" && block.attrs && block.attrs.url) {
          allImageUrls.push(block.attrs.url);
        }
        if (
          block.blockName === "core/gallery" &&
          block.attrs &&
          block.attrs.images &&
          Array.isArray(block.attrs.images)
        ) {
          block.attrs.images.forEach((img: any) => {
            if (img.url) {
              allImageUrls.push(img.url);
            }
          });
        }
      });
    }

    // Remove duplicate URLs
    allImageUrls = [...new Set(allImageUrls)];

    // ***********************************************
    // STEP 2: Process Each Image (Download & Upload)
    // ***********************************************
    let storageImageUrls: string[] = [];
    const bucket = admin.storage().bucket();

    for (const imageUrl of allImageUrls) {
      try {
        // Remove query parameters for a clean file name
        const cleanUrl = imageUrl.split("?")[0];
        const fileName = path.basename(cleanUrl);
        const uniqueFileName = `${Date.now()}_${fileName}`;
        const tempFilePath = path.join(os.tmpdir(), uniqueFileName);

        // Download the image with axios
        const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
        fs.writeFileSync(tempFilePath, response.data);

        // Define destination in Firebase Storage (e.g., "watch-images/filename.jpg")
        const destination = `watch-images/${uniqueFileName}`;
        await bucket.upload(tempFilePath, {
          destination,
          metadata: {
            contentType: response.headers["content-type"] || "image/jpeg"
          }
        });

        // Clean up temporary file
        fs.unlinkSync(tempFilePath);

        // Generate a signed URL for the uploaded image (valid until a far future date)
        const file = bucket.file(destination);
        const [signedUrl] = await file.getSignedUrl({
          action: "read",
          expires: "03-09-2500"
        });

        storageImageUrls.push(signedUrl);
      } catch (imgError: any) {
        logger.error(`Error processing image ${imageUrl}: ${imgError.message}`);
      }
    }

    // ***********************************************
    // STEP 3: Build the Firestore Document (Watch Data)
    // ***********************************************
    const watchData = {
      diameter: data.diameter || "Not specified",
      box: data.box !== undefined ? data.box : false,
      brand: brand,
      caseDiameter: data.caseDiameter || "Not specified",
      caseMaterial: data.caseMaterial || "Not specified",
      dateAdded: admin.firestore.FieldValue.serverTimestamp(),
      dial: data.dial || "Not specified",
      image: storageImageUrls, // Array of Firebase Storage image URLs
      model: model,
      movement: data.movement || "Not specified",
      newArrival: data.newArrival !== undefined ? data.newArrival : false,
      papers: data.papers !== undefined ? data.papers : false,
      powerReserve: data.powerReserve || "Not specified",
      price: data.price !== undefined ? data.price : 0,
      strap: data.strap || "Not specified",
      warranty: data.warranty || "Not specified",
      year: data.year !== undefined ? data.year : new Date().getFullYear(),
      // NEW FIELDS
      referenceNumber: data.referenceNumber || "",
      sku: data.sku || "",
      description: data.description || "",
    };

    // Save the document to the "Watches" collection in Firestore
    await admin.firestore().collection("Watches").add(watchData);

    res.status(200).send("Watch imported successfully");
  } catch (error: any) {
    logger.error("Error importing watch:", error);
    res.status(500).send(`Error: ${error.message}`);
  }
});
