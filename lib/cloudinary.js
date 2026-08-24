import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

export const isCloudinaryConfigured = !!(cloudName && apiKey && apiSecret);

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  });
}

/**
 * Uploads a file buffer or base64 data string to Cloudinary CDN
 * Applies automatic WebP format conversion and adaptive compression.
 */
export async function uploadToCloudinary(bufferOrBase64, customFolder = "ravtron_products") {
  if (!isCloudinaryConfigured) {
    throw new Error("Cloudinary CDN is not configured in environment variables.");
  }

  return new Promise((resolve, reject) => {
    const uploadOptions = {
      folder: customFolder,
      fetch_format: "auto",
      quality: "auto:good"
    };

    if (typeof bufferOrBase64 === "string" && bufferOrBase64.startsWith("data:")) {
      cloudinary.uploader.upload(bufferOrBase64, uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
      uploadStream.end(bufferOrBase64);
    }
  });
}

export default cloudinary;
