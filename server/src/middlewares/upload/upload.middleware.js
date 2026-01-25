import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure upload directories exist
const createUploadDirs = () => {
  const dirs = ["./uploads/resumes", "./uploads/videos", "./uploads/portfolio"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

createUploadDirs();

// Storage configuration for resumes
const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/resumes");
  },
  filename: (req, file, cb) => {
    // Create unique filename: userId_timestamp_originalname
    const uniqueSuffix = `${req.user.id}_${Date.now()}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}_${uniqueSuffix}${ext}`);
  },
});

// Storage configuration for video resumes
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/videos");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user.id}_${Date.now()}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}_${uniqueSuffix}${ext}`);
  },
});

// Storage configuration for portfolio files
const portfolioStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/portfolio");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${req.user.id}_${Date.now()}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}_${uniqueSuffix}${ext}`);
  },
});

// File filter for resumes (PDF, DOC, DOCX)
const resumeFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only PDF, DOC, and DOCX are allowed."),
      false
    );
  }
};

// File filter for videos (MP4, AVI, MOV, WebM)
const videoFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "video/mp4",
    "video/x-msvideo",
    "video/quicktime",
    "video/webm",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only MP4, AVI, MOV, and WebM are allowed."),
      false
    );
  }
};

// File filter for portfolio (images, PDFs, videos)
const portfolioFileFilter = (req, file, cb) => {
  const allowedMimes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
    "application/pdf",
    "video/mp4",
    "video/webm",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only images, PDFs, and videos are allowed."
      ),
      false
    );
  }
};

// Multer upload instances
export const uploadResume = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("resume");

export const uploadVideo = multer({
  storage: videoStorage,
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
}).single("video");

export const uploadPortfolio = multer({
  storage: portfolioStorage,
  fileFilter: portfolioFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
}).single("portfolioFile");

// Error handling middleware for multer
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        message: "File too large. Please upload a smaller file.",
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};

// Utility function to delete file
export const deleteFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, (err) => {
      if (err && err.code !== "ENOENT") {
        // ENOENT means file doesn't exist, which is okay
        reject(err);
      } else {
        resolve();
      }
    });
  });
};