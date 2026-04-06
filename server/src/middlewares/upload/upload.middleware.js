import multer from "multer";

// Use memory storage — files are kept in req.file.buffer for Cloudinary upload
const memoryStorage = multer.memoryStorage();

// --- FILE FILTERS ---

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
      false,
    );
  }
};

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
      false,
    );
  }
};

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
        "Invalid file type. Only images, PDFs, and videos are allowed.",
      ),
      false,
    );
  }
};

const imageFileFilter = (req, file, cb) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Only JPG, PNG, GIF, and WEBP allowed."),
      false,
    );
  }
};

// --- MULTER INSTANCES (EXPORTS) ---

export const uploadResume = multer({
  storage: memoryStorage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("resume");

export const uploadVideo = multer({
  storage: memoryStorage,
  fileFilter: videoFileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
}).single("video");

export const uploadPortfolio = multer({
  storage: memoryStorage,
  fileFilter: portfolioFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single("portfolioFile");

export const uploadCompanyImage = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("image");

export const uploadProfilePicture = multer({
  storage: memoryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
}).single("image");

// --- ERROR HANDLER ---

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
