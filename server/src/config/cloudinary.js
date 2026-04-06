import { v2 as cloudinary } from "cloudinary";

// CLOUDINARY_URL env var is auto-read by the SDK — no manual config needed.
// Format: cloudinary://API_KEY:API_SECRET@CLOUD_NAME

/**
 * Upload a file buffer to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from multer memory storage
 * @param {Object} options
 * @param {string} options.folder - Cloudinary folder (e.g. "job-portal/resumes")
 * @param {string} [options.resourceType="auto"] - "image" | "video" | "raw" | "auto"
 * @param {string} [options.publicId] - Optional custom public ID
 * @returns {Promise<{secure_url: string, public_id: string, ...}>}
 */
export const uploadToCloudinary = (fileBuffer, options = {}) => {
  const { folder, resourceType = "auto", publicId } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions = { folder, resource_type: resourceType, overwrite: true, access_mode: "public" };
    if (publicId) uploadOptions.public_id = publicId;

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    stream.end(fileBuffer);
  });
};

/**
 * Delete a resource from Cloudinary by its public ID.
 * @param {string} publicId - The Cloudinary public ID
 * @param {string} [resourceType="image"] - "image" | "video" | "raw"
 * @returns {Promise<{result: string}>}
 */
export const deleteFromCloudinary = (publicId, resourceType = "image") => {
  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};

export default cloudinary;
