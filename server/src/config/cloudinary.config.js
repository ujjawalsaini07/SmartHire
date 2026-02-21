import { v2 as cloudinary } from "cloudinary";

/**
 * Configure Cloudinary using the CLOUDINARY_URL env variable.
 * Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME
 * This is already set in server/.env as CLOUDINARY_URL=cloudinary://...@dmropie6n
 */
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
});

export default cloudinary;
