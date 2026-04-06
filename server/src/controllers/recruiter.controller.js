import RecruiterProfile from "../models/RecruiterProfile.model.js";
import path from "path";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../config/cloudinary.js";

/**
 * Helper: extract file extension from original filename
 */
const getExt = (originalname) => path.extname(originalname).toLowerCase();

/**
 * @desc    Get current recruiter's company profile
 * @route   GET /api/v1/recruiters/profile
 * @access  Private (Recruiter)
 */
export const getMyCompanyProfile = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Create company profile
 * @route   POST /api/v1/recruiters/profile
 * @access  Private (Recruiter)
 */
export const createCompanyProfile = async (req, res) => {
  try {
    const existingProfile = await RecruiterProfile.findOne({
      userId: req.user.id,
    });

    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists for this user",
      });
    }

    const sanitizedBody = { ...req.body };
    delete sanitizedBody.isVerified;
    delete sanitizedBody.verificationStatus;
    delete sanitizedBody.verifiedAt;
    delete sanitizedBody.verifiedBy;
    delete sanitizedBody.userId;

    const profile = await RecruiterProfile.create({
      ...sanitizedBody,
      userId: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: "Company profile created successfully",
      data: profile,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate field value entered",
      });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Update company profile
 * @route   PUT /api/v1/recruiters/profile
 * @access  Private (Recruiter)
 */
export const updateCompanyProfile = async (req, res) => {
  try {
    const sanitizedBody = { ...req.body };
    delete sanitizedBody.isVerified;
    delete sanitizedBody.verificationStatus;
    delete sanitizedBody.verifiedAt;
    delete sanitizedBody.verifiedBy;
    delete sanitizedBody.userId;

    const profile = await RecruiterProfile.findOneAndUpdate(
      { userId: req.user.id },
      sanitizedBody,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company profile updated successfully",
      data: profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Upload company logo to Cloudinary
 * @route   POST /api/v1/recruiters/profile/logo
 * @access  Private (Recruiter)
 */
export const uploadCompanyLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const profile = await RecruiterProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Please create a company profile before uploading a logo",
      });
    }

    // Delete old logo from Cloudinary if exists
    if (profile.companyLogoPublicId) {
      try {
        await deleteFromCloudinary(profile.companyLogoPublicId, "image");
      } catch (err) {
        console.error("Failed to delete old logo from Cloudinary:", err);
      }
    }

    // Upload to Cloudinary: SmartHire/companylogo/companylogo_<userId>
    const publicId = `companylogo_${req.user.id}`;

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "SmartHire/companylogo",
      resourceType: "image",
      publicId,
    });

    profile.companyLogo = result.secure_url;
    profile.companyLogoPublicId = result.public_id;
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Company logo uploaded successfully",
      data: {
        companyLogo: profile.companyLogo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Upload company banner to Cloudinary
 * @route   POST /api/v1/recruiters/profile/banner
 * @access  Private (Recruiter)
 */
export const uploadCompanyBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a file",
      });
    }

    const profile = await RecruiterProfile.findOne({ userId: req.user.id });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Please create a company profile before uploading a banner",
      });
    }

    // Delete old banner from Cloudinary if exists
    if (profile.companyBannerPublicId) {
      try {
        await deleteFromCloudinary(profile.companyBannerPublicId, "image");
      } catch (err) {
        console.error("Failed to delete old banner from Cloudinary:", err);
      }
    }

    // Upload to Cloudinary: SmartHire/companybanner/banner_<userId>
    const publicId = `banner_${req.user.id}`;

    const result = await uploadToCloudinary(req.file.buffer, {
      folder: "SmartHire/companybanner",
      resourceType: "image",
      publicId,
    });

    profile.companyBanner = result.secure_url;
    profile.companyBannerPublicId = result.public_id;
    await profile.save();

    res.status(200).json({
      success: true,
      message: "Company banner uploaded successfully",
      data: {
        companyBanner: profile.companyBanner,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get verification status
 * @route   GET /api/v1/recruiters/verification-status
 * @access  Private (Recruiter)
 */
export const getVerificationStatus = async (req, res) => {
  try {
    const profile = await RecruiterProfile.findOne({
      userId: req.user.id,
    }).select("isVerified verificationStatus verificationNotes");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

/**
 * @desc    Get public company profile by ID
 * @route   GET /api/v1/recruiters/:id/profile
 * @access  Public
 */
export const getPublicCompanyProfile = async (req, res) => {
  try {
    const id = req.params.id;

    let profile = await RecruiterProfile.findOne({ userId: id }).populate(
      "userId",
      "firstName lastName email",
    );

    if (!profile) {
      try {
        profile = await RecruiterProfile.findById(id).populate(
          "userId",
          "firstName lastName email",
        );
      } catch (err) {
        profile = null;
      }
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Company profile not found",
      });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
