import SystemSettings from "../models/SystemSettings.model.js";
import { invalidateMaintenanceCache } from "../middlewares/system/maintenance.middleware.js";

const SETTINGS_KEYS = ["registrationOpen", "autoModerateJobs", "maintenanceMode"];

const toPayload = (settings) => ({
  registrationOpen: settings.registrationOpen,
  autoModerateJobs: settings.autoModerateJobs,
  maintenanceMode: settings.maintenanceMode,
  updatedAt: settings.updatedAt,
});

/**
 * @desc    Get platform/system settings
 * @route   GET /api/v1/admin/settings
 * @access  Private/Admin
 */
export const getSystemSettings = async (req, res) => {
  try {
    const settings = await SystemSettings.getSingleton();

    return res.status(200).json({
      success: true,
      data: toPayload(settings),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load system settings",
      error: error.message,
    });
  }
};

/**
 * @desc    Update platform/system settings
 * @route   PATCH /api/v1/admin/settings
 * @access  Private/Admin
 */
export const updateSystemSettings = async (req, res) => {
  try {
    const updates = {};

    for (const key of SETTINGS_KEYS) {
      if (Object.prototype.hasOwnProperty.call(req.body, key)) {
        if (typeof req.body[key] !== "boolean") {
          return res.status(400).json({
            success: false,
            message: `${key} must be a boolean value`,
          });
        }
        updates[key] = req.body[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid settings provided for update",
      });
    }

    const settings = await SystemSettings.getSingleton();
    settings.set({ ...updates, updatedBy: req.user.id });
    await settings.save();

    invalidateMaintenanceCache();

    return res.status(200).json({
      success: true,
      message: "System settings updated successfully",
      data: toPayload(settings),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update system settings",
      error: error.message,
    });
  }
};
