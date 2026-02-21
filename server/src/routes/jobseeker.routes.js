import express from "express";
import { protect, authorize } from "../middlewares/auth/auth.middleware.js";
import {
  uploadProfilePicture,
  uploadResume,
  uploadVideo,
  uploadPortfolio,
  handleMulterError,
} from "../middlewares/upload/upload.middleware.js";
import {
  getMyProfile,
  createProfile,
  updateProfile,
  uploadProfilePicture as uploadProfilePictureController,
  deleteProfilePicture,
  uploadResumeFile,
  deleteResume,
  uploadVideoResume,
  deleteVideoResume,
  addPortfolioItem,
  deletePortfolioItem,
  searchJobSeekers,
  getJobSeekerProfileById,
} from "../controllers/jobseeker.controller.js";

const jobseekerRouter = express.Router();

// ─── Profile CRUD ────────────────────────────────────────────────────────────
jobseekerRouter.get("/profile",  protect, authorize("jobseeker"), getMyProfile);
jobseekerRouter.post("/profile", protect, authorize("jobseeker"), createProfile);
jobseekerRouter.put("/profile",  protect, authorize("jobseeker"), updateProfile);

// ─── Profile Picture (Cloudinary → SmartHire/profile) ────────────────────────
jobseekerRouter.post(
  "/profile/profile-picture",
  protect,
  authorize("jobseeker"),
  uploadProfilePicture,
  handleMulterError,
  uploadProfilePictureController
);
jobseekerRouter.delete(
  "/profile/profile-picture",
  protect,
  authorize("jobseeker"),
  deleteProfilePicture
);

// ─── Resume (Cloudinary → SmartHire/resume) ──────────────────────────────────
jobseekerRouter.post(
  "/profile/resume",
  protect,
  authorize("jobseeker"),
  uploadResume,
  handleMulterError,
  uploadResumeFile
);
jobseekerRouter.delete(
  "/profile/resume",
  protect,
  authorize("jobseeker"),
  deleteResume
);

// ─── Video Resume (Cloudinary → SmartHire/video-resume) ──────────────────────
jobseekerRouter.post(
  "/profile/video-resume",
  protect,
  authorize("jobseeker"),
  uploadVideo,
  handleMulterError,
  uploadVideoResume
);
jobseekerRouter.delete(
  "/profile/video-resume",
  protect,
  authorize("jobseeker"),
  deleteVideoResume
);

// ─── Portfolio (local disk) ───────────────────────────────────────────────────
jobseekerRouter.post(
  "/profile/portfolio",
  protect,
  authorize("jobseeker"),
  uploadPortfolio,
  handleMulterError,
  addPortfolioItem
);
jobseekerRouter.delete(
  "/profile/portfolio/:itemId",
  protect,
  authorize("jobseeker"),
  deletePortfolioItem
);

// ─── Search & Public view ────────────────────────────────────────────────────
jobseekerRouter.get("/search",       protect, authorize("recruiter"), searchJobSeekers);
jobseekerRouter.get("/:id/profile",  protect, authorize("recruiter"), getJobSeekerProfileById);

export default jobseekerRouter;