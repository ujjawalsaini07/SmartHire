import JobSeekerProfile from "../models/JobSeekerProfile.model.js";
import User from "../models/User.model.js";
import Skill from "../models/Skills.model.js";
import {
  deleteFromCloudinary,
  deleteFile,
} from "../middlewares/upload/upload.middleware.js";

// ─────────────────────────────────────────────
// PROFILE CRUD
// ─────────────────────────────────────────────

/**
 * @desc    Get current user's job seeker profile
 * @route   GET /api/v1/jobseekers/profile
 * @access  Private (Job Seeker only)
 */
export const getMyProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id })
      .populate("skills", "name category level");

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create your profile first.",
      });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving profile",
      error: error.message,
    });
  }
};

/**
 * @desc    Create job seeker profile
 * @route   POST /api/v1/jobseekers/profile
 * @access  Private (Job Seeker only)
 */
export const createProfile = async (req, res) => {
  try {
    const existingProfile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists. Use PUT to update.",
      });
    }

    const profile = await JobSeekerProfile.create({ userId: req.user.id, ...req.body });

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      data: profile,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation error", errors: messages });
    }
    res.status(500).json({ success: false, message: "Error creating profile", error: error.message });
  }
};

/**
 * @desc    Update job seeker profile
 * @route   PUT /api/v1/jobseekers/profile
 * @access  Private (Job Seeker only)
 */
export const updateProfile = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found. Please create a profile first." });
    }

    const allowedUpdates = [
      "firstName", "lastName", "phone", "location", "profilePicture",
      "headline", "summary", "workExperience", "education", "skills",
      "certifications", "portfolio", "socialLinks", "preferences", "privacy",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) profile[field] = req.body[field];
    });

    await profile.save();
    res.status(200).json({ success: true, message: "Profile updated successfully", data: profile });
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation error", errors: messages });
    }
    res.status(500).json({ success: false, message: "Error updating profile", error: error.message });
  }
};

// ─────────────────────────────────────────────
// PROFILE PICTURE  (Cloudinary → SmartHire/profile)
// ─────────────────────────────────────────────

/**
 * @desc    Upload / replace profile picture
 * @route   POST /api/v1/jobseekers/profile/profile-picture
 * @access  Private (Job Seeker only)
 */
export const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload an image file." });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      // Remove the just-uploaded Cloudinary asset to avoid orphans
      await deleteFromCloudinary(req.file.filename, "image");
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create a profile first.",
      });
    }

    // Delete old profile picture from Cloudinary if it exists
    if (profile.profilePicturePublicId) {
      await deleteFromCloudinary(profile.profilePicturePublicId, "image");
    }

    // req.file.path  = secure Cloudinary URL  (e.g. https://res.cloudinary.com/...)
    // req.file.filename = Cloudinary public_id
    profile.profilePicture = req.file.path;
    profile.profilePicturePublicId = req.file.filename;

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile picture uploaded successfully",
      data: { profilePicture: profile.profilePicture },
    });
  } catch (error) {
    if (req.file) await deleteFromCloudinary(req.file.filename, "image");
    res.status(500).json({ success: false, message: "Error uploading profile picture", error: error.message });
  }
};

/**
 * @desc    Delete profile picture
 * @route   DELETE /api/v1/jobseekers/profile/profile-picture
 * @access  Private (Job Seeker only)
 */
export const deleteProfilePicture = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    if (!profile.profilePicture) {
      return res.status(404).json({ success: false, message: "No profile picture to delete" });
    }

    await deleteFromCloudinary(profile.profilePicturePublicId, "image");

    profile.profilePicture = null;
    profile.profilePicturePublicId = null;
    await profile.save();

    res.status(200).json({ success: true, message: "Profile picture deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting profile picture", error: error.message });
  }
};

// ─────────────────────────────────────────────
// RESUME  (Cloudinary → SmartHire/resume)
// ─────────────────────────────────────────────

/**
 * @desc    Upload resume (PDF/DOC/DOCX) to Cloudinary
 * @route   POST /api/v1/jobseekers/profile/resume
 * @access  Private (Job Seeker only)
 */
export const uploadResumeFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a resume file." });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      await deleteFromCloudinary(req.file.filename, "raw");
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create a profile first.",
      });
    }

    // Remove old resume from Cloudinary
    if (profile.resume?.publicId) {
      await deleteFromCloudinary(profile.resume.publicId, "raw");
    }

    profile.resume = {
      fileName: req.file.originalname,
      fileUrl: req.file.path,       // Cloudinary secure URL
      publicId: req.file.filename,  // Cloudinary public_id
      uploadedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: profile.resume,
    });
  } catch (error) {
    if (req.file) await deleteFromCloudinary(req.file.filename, "raw");
    res.status(500).json({ success: false, message: "Error uploading resume", error: error.message });
  }
};

/**
 * @desc    Delete resume
 * @route   DELETE /api/v1/jobseekers/profile/resume
 * @access  Private (Job Seeker only)
 */
export const deleteResume = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    if (!profile.resume?.fileUrl) {
      return res.status(404).json({ success: false, message: "No resume found to delete" });
    }

    await deleteFromCloudinary(profile.resume.publicId, "raw");

    profile.resume = { fileName: null, fileUrl: null, publicId: null, uploadedAt: null };
    await profile.save();

    res.status(200).json({ success: true, message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting resume", error: error.message });
  }
};

// ─────────────────────────────────────────────
// VIDEO RESUME  (Cloudinary → SmartHire/video-resume)
// ─────────────────────────────────────────────

/**
 * @desc    Upload video resume to Cloudinary
 * @route   POST /api/v1/jobseekers/profile/video-resume
 * @access  Private (Job Seeker only)
 */
export const uploadVideoResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Please upload a video file." });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      await deleteFromCloudinary(req.file.filename, "video");
      return res.status(404).json({
        success: false,
        message: "Profile not found. Please create a profile first.",
      });
    }

    // Remove old video from Cloudinary
    if (profile.videoResume?.publicId) {
      await deleteFromCloudinary(profile.videoResume.publicId, "video");
    }

    profile.videoResume = {
      fileName: req.file.originalname,
      fileUrl: req.file.path,       // Cloudinary secure URL
      publicId: req.file.filename,  // Cloudinary public_id
      uploadedAt: new Date(),
    };

    await profile.save();

    res.status(200).json({
      success: true,
      message: "Video resume uploaded successfully",
      data: profile.videoResume,
    });
  } catch (error) {
    if (req.file) await deleteFromCloudinary(req.file.filename, "video");
    res.status(500).json({ success: false, message: "Error uploading video resume", error: error.message });
  }
};

/**
 * @desc    Delete video resume
 * @route   DELETE /api/v1/jobseekers/profile/video-resume
 * @access  Private (Job Seeker only)
 */
export const deleteVideoResume = async (req, res) => {
  try {
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });
    if (!profile.videoResume?.fileUrl) {
      return res.status(404).json({ success: false, message: "No video resume found to delete" });
    }

    await deleteFromCloudinary(profile.videoResume.publicId, "video");

    profile.videoResume = { fileName: null, fileUrl: null, publicId: null, uploadedAt: null };
    await profile.save();

    res.status(200).json({ success: true, message: "Video resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting video resume", error: error.message });
  }
};

// ─────────────────────────────────────────────
// PORTFOLIO  (local disk — unchanged)
// ─────────────────────────────────────────────

/**
 * @desc    Add portfolio item
 * @route   POST /api/v1/jobseekers/profile/portfolio
 * @access  Private (Job Seeker only)
 */
export const addPortfolioItem = async (req, res) => {
  try {
    const { title, description, projectUrl } = req.body;

    if (!title) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) {
      if (req.file) await deleteFile(req.file.path);
      return res.status(404).json({ success: false, message: "Profile not found" });
    }

    const portfolioItem = { title, description, projectUrl };
    if (req.file) portfolioItem.fileUrl = `/uploads/portfolio/${req.file.filename}`;

    profile.portfolio.push(portfolioItem);
    await profile.save();

    res.status(201).json({
      success: true,
      message: "Portfolio item added successfully",
      data: profile.portfolio[profile.portfolio.length - 1],
    });
  } catch (error) {
    if (req.file) {
      await deleteFile(req.file.path).catch((err) => console.error("Error deleting file:", err));
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ success: false, message: "Validation error", errors: messages });
    }
    res.status(500).json({ success: false, message: "Error adding portfolio item", error: error.message });
  }
};

/**
 * @desc    Delete portfolio item
 * @route   DELETE /api/v1/jobseekers/profile/portfolio/:itemId
 * @access  Private (Job Seeker only)
 */
export const deletePortfolioItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const profile = await JobSeekerProfile.findOne({ userId: req.user.id });
    if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

    const item = profile.portfolio.find((i) => i._id.toString() === itemId);
    if (!item) return res.status(404).json({ success: false, message: "Portfolio item not found" });

    if (item.fileUrl) {
      const filePath = item.fileUrl;
      await deleteFile(filePath).catch((err) => console.error("Error deleting portfolio file:", err));
    }

    profile.portfolio = profile.portfolio.filter((i) => i._id.toString() !== itemId);
    await profile.save();

    res.status(200).json({ success: true, message: "Portfolio item deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting portfolio item", error: error.message });
  }
};

// ─────────────────────────────────────────────
// SEARCH & PUBLIC PROFILE
// ─────────────────────────────────────────────

/**
 * @desc    Search job seekers (for recruiters)
 * @route   GET /api/v1/jobseekers/search
 * @access  Private (Recruiter only)
 */
export const searchJobSeekers = async (req, res) => {
  try {
    const {
      skills, location, jobType, remoteWorkPreference,
      minExperience, page = 1, limit = 10,
    } = req.query;

    const query = { "privacy.profileVisibility": "public" };

    if (skills) {
      const skillsArray = skills.split(",").map((s) => s.trim());
      query.skills = { $in: skillsArray };
    }
    if (location) {
      query.$or = [
        { "location.city": { $regex: location, $options: "i" } },
        { "location.country": { $regex: location, $options: "i" } },
      ];
    }
    if (jobType) query["preferences.jobType"] = jobType;
    if (remoteWorkPreference) query["preferences.remoteWorkPreference"] = remoteWorkPreference;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const profiles = await JobSeekerProfile.find(query)
      .populate("skills", "name category level")
      .select("-privacy -preferences.desiredSalaryMin -preferences.desiredSalaryMax")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ profileCompleteness: -1, createdAt: -1 });

    const total = await JobSeekerProfile.countDocuments(query);

    res.status(200).json({
      success: true,
      count: profiles.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: profiles,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error searching job seekers", error: error.message });
  }
};

/**
 * @desc    Get job seeker profile by ID (for recruiters)
 * @route   GET /api/v1/jobseekers/:id/profile
 * @access  Private (Recruiter only)
 */
export const getJobSeekerProfileById = async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await JobSeekerProfile.findOne({
      userId: id,
      "privacy.profileVisibility": "public",
    }).populate("skills", "name category level");

    if (!profile) {
      return res.status(404).json({ success: false, message: "Profile not found or not public" });
    }

    await profile.incrementViews();

    const profileData = profile.toObject();
    if (!profile.privacy.showEmail) delete profileData.email;
    if (!profile.privacy.showPhone) delete profileData.phone;

    res.status(200).json({ success: true, data: profileData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error retrieving profile", error: error.message });
  }
};