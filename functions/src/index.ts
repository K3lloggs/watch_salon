/**
 * Import function triggers from their respective submodules.
 */
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import axios from "axios";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

admin.initializeApp();

export const importWatch = onRequest(async (req, res) => {
    // Allow only POST requests
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }

    try {
        // Parse the incoming JSON payload
        const data = req.body;

        // Instead of rejecting missing required fields, assign defaults.
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
            // _gallery assumed to be an array of image URLs
            if (data.post_meta._gallery && Array.isArray(data.post_meta._gallery)) {
                allImageUrls.push(...data.post_meta._gallery);
            }
            // _thumbnail_id may hold a URL (if not an ID)
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
            // Single image field
            if (data.acf.image_field) {
                allImageUrls.push(data.acf.image_field);
            }
            // Gallery field (assumed to be an array)
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

        // Remove any duplicate URLs
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
                // Append a timestamp to ensure uniqueness if needed
                const uniqueFileName = `${Date.now()}_${fileName}`;
                const tempFilePath = path.join(os.tmpdir(), uniqueFileName);

                // Download the image with axios
                const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
                fs.writeFileSync(tempFilePath, response.data);

                // Define the destination in Firebase Storage (e.g., "watch-images/filename.jpg")
                const destination = `watch-images/${uniqueFileName}`;
                await bucket.upload(tempFilePath, {
                    destination,
                    metadata: {
                        contentType: response.headers["content-type"] || "image/jpeg"
                    }
                });

                // Clean up the temporary file
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
            year: data.year !== undefined ? data.year : new Date().getFullYear()
        };

        // Save the document to the "Watches" collection in Firestore
        await admin.firestore().collection("Watches").add(watchData);

        res.status(200).send("Watch imported successfully");
    } catch (error: any) {
        logger.error("Error importing watch:", error);
        res.status(500).send(`Error: ${error.message}`);
    }
});
