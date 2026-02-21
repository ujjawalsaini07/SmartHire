import express from "express";
import { protect, authorize } from "../middlewares/auth/auth.middleware.js";
import {
  uploadCompanyLogo,
  uploadCompanyBanner,
  handleMulterError,
} from "../middlewares/upload/upload.middleware.js";
import {
  getMyCompanyProfile,
  createCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo as uploadCompanyLogoController,
  uploadCompanyBanner as uploadCompanyBannerController,
  getVerificationStatus,
  getPublicCompanyProfile,
} from "../controllers/recruiter.controller.js";

const recruiterRouter = express.Router();

// Public route (no auth needed)
recruiterRouter.get("/:id/profile", getPublicCompanyProfile);

// All routes below require authentication
recruiterRouter.use(protect);
recruiterRouter.use(authorize("recruiter"));

// Profile Routes
recruiterRouter.get("/profile", getMyCompanyProfile);
recruiterRouter.post("/profile", createCompanyProfile);
recruiterRouter.put("/profile", updateCompanyProfile);

// Company Logo  (Cloudinary → SmartHire/companylogo)
recruiterRouter.post(
  "/profile/logo",
  uploadCompanyLogo,
  handleMulterError,
  uploadCompanyLogoController
);

// Company Banner  (Cloudinary → SmartHire/companybanner)
recruiterRouter.post(
  "/profile/banner",
  uploadCompanyBanner,
  handleMulterError,
  uploadCompanyBannerController
);

recruiterRouter.get("/verification-status", getVerificationStatus);

export default recruiterRouter;