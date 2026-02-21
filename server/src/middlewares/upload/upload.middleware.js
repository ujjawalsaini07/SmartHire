import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.config.js";

// ─────────────────────────────────────────────
// CLOUDINARY STORAGE CONFIGURATIONS
// ─────────────────────────────────────────────

// 1. Profile Pictures  →  SmartHire/profile
const profilePictureStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartHire/profile",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    // Use userId + timestamp as public_id so old pictures auto-replace
    public_id: (req) => `profile_${req.user.id}_${Date.now()}`,
  },
});

// 2. Resumes (PDF / DOC / DOCX)  →  SmartHire/resume
const resumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartHire/resume",
    resource_type: "raw", // required for non-image/video files
    allowed_formats: ["pdf", "doc", "docx"],
    public_id: (req) => `resume_${req.user.id}_${Date.now()}`,
  },
});

// 3. Video Resumes  →  SmartHire/video-resume
const videoResumeStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartHire/video-resume",
    resource_type: "video",
    allowed_formats: ["mp4", "avi", "mov", "webm"],
    public_id: (req) => `video_resume_${req.user.id}_${Date.now()}`,
  },
});

// 4. Portfolio Files  →  SmartHire/portfolio
const portfolioStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartHire/portfolio",
    resource_type: "auto", // allow images, pdfs, etc.
    allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
    public_id: (req) => `portfolio_${req.user.id}_${Date.now()}`,
  },
});

// ─────────────────────────────────────────────
// FILE FILTERS  (client-side MIME validation)
// ─────────────────────────────────────────────

const imageFileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, and WebP images are allowed."),
      false
    );
  }
};

const resumeFileFilter = (req, file, cb) => {
  const allowed = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, DOC, and DOCX files are allowed."),
      false
    );
  }
};

const videoFileFilter = (req, file, cb) => {
  const allowed = [
    "video/mp4",
    "video/x-msvideo", // AVI
    "video/quicktime", // MOV
    "video/webm",
  ];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only MP4, AVI, MOV, and WebM videos are allowed."),
      false
    );
  }
};

// ─────────────────────────────────────────────
// MULTER UPLOAD INSTANCES (NAMED EXPORTS)
// ─────────────────────────────────────────────

/** Upload a single profile picture (field name: "image") */
export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("image");

/** Upload a single resume PDF/DOC (field name: "resume") */
export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("resume");

/** Upload a single video resume (field name: "video") */
export const uploadVideo = multer({
  storage: videoResumeStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 200 * 1024 * 1024 }, // 200 MB
}).single("video");

/** Upload a portfolio file (field name: "file") */
export const uploadPortfolio = multer({
  storage: portfolioStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}).single("file");

// ─────────────────────────────────────────────
// CLOUDINARY DELETE HELPER
// ─────────────────────────────────────────────

/**
 * Delete an asset from Cloudinary by its public_id.
 * @param {string} publicId  - Cloudinary public_id (e.g. "SmartHire/resume/resume_123_1706000000000")
 * @param {"image"|"raw"|"video"} resourceType - Cloudinary resource type
 */
export const deleteFromCloudinary = async (publicId, resourceType = "raw") => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (err) {
    // Log but don't throw — a failed delete should not block the user
    console.error(`[Cloudinary] Failed to delete ${publicId}:`, err.message);
  }
};

// ─────────────────────────────────────────────
// ERROR HANDLER MIDDLEWARE
// ─────────────────────────────────────────────

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Please upload a smaller file.",
      });
    }
    return res.status(400).json({ success: false, message: err.message });
  } else if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
};

// 4. Company Logo  →  SmartHire/companylogo
const companyLogoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartHire/companylogo",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req) => `logo_${req.user.id}_${Date.now()}`,
  },
});

// 5. Company Banner  →  SmartHire/companybanner
const companyBannerStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "SmartHire/companybanner",
    resource_type: "image",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    public_id: (req) => `banner_${req.user.id}_${Date.now()}`,
  },
});

/** Upload company logo (field name: "image") */
export const uploadCompanyLogo = multer({
  storage: companyLogoStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
}).single("image");

/** Upload company banner (field name: "image") */
export const uploadCompanyBanner = multer({
  storage: companyBannerStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB (banners can be wider/larger)
}).single("image");


