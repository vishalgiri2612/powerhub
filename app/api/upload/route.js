import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import cloudinary from "cloudinary";
import { verifyAdmin } from "@/lib/auth";

// Configure Cloudinary v2 API
const cloudinaryCloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudinaryApiKey = process.env.CLOUDINARY_API_KEY;
const cloudinaryApiSecret = process.env.CLOUDINARY_API_SECRET;

const isCloudinaryConfigured = !!(
  cloudinaryCloudName && 
  cloudinaryApiKey && 
  cloudinaryApiSecret
);

if (isCloudinaryConfigured) {
  cloudinary.v2.config({
    cloud_name: cloudinaryCloudName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
  });
}

export async function POST(request) {
  try {
    if (!(await verifyAdmin())) {
      return NextResponse.json({ error: "Unauthorized access: Administrator role required" }, { status: 403 });
    }
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isProd = process.env.NODE_ENV === "production";

    if (isProd && !isCloudinaryConfigured) {
      return NextResponse.json(
        { error: "Cloud storage is mandatory in production, but Cloudinary is not configured." },
        { status: 500 }
      );
    }

    if (isCloudinaryConfigured) {
      try {
        // Cloudinary upload path using stream helper
        const uploadPromise = new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { folder: "powerhub" },
            (error, result) => {
              if (error) {
                console.error("Cloudinary stream upload failed:", error);
                reject(error);
              } else {
                resolve(result);
              }
            }
          );
          uploadStream.end(buffer);
        });

        const result = await uploadPromise;
        return NextResponse.json({ url: result.secure_url });
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed:", cloudinaryError);
        if (isProd) {
          return NextResponse.json(
            { error: `Cloud storage upload failed: ${cloudinaryError.message || cloudinaryError}` },
            { status: 500 }
          );
        }
        console.warn("Falling back to local storage in development mode.");
      }
    }

    if (isProd) {
      return NextResponse.json(
        { error: "Cloud storage upload failed and local fallback is disabled in production." },
        { status: 500 }
      );
    }

    // Fallback local upload path
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Ensure the directory exists
    await mkdir(uploadDir, { recursive: true });
    
    // Create a unique filename
    const fileExt = path.extname(file.name) || ".png";
    const baseName = path.basename(file.name, fileExt).replace(/[^a-zA-Z0-9]/g, "_");
    const uniqueFilename = `${baseName}_${Date.now()}${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFilename);
    
    // Save file to public/uploads
    await writeFile(filePath, buffer);
    
    // Return the public URL path
    return NextResponse.json({ url: `/uploads/${uniqueFilename}` });
  } catch (error) {
    console.error("Upload handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload file" }, { status: 500 });
  }
}
