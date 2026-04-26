import express from "express";
import {
  getSystemSettings,
  updateSystemSettings,
} from "../controllers/adminSettings.controller.js";
import { protect, authorize } from "../middlewares/auth/auth.middleware.js";

const adminSettingsRouter = express.Router();

adminSettingsRouter.use(protect);
adminSettingsRouter.use(authorize("admin"));

/**
 * @route   GET /api/v1/admin/settings
 * @desc    Get platform/system settings
 * @access  Private/Admin
 */
adminSettingsRouter.get("/", getSystemSettings);

/**
 * @route   PATCH /api/v1/admin/settings
 * @desc    Update platform/system settings
 * @access  Private/Admin
 */
adminSettingsRouter.patch("/", updateSystemSettings);

export default adminSettingsRouter;
