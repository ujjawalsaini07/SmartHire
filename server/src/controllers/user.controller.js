import User from "../models/User.model.js";
import Job from "../models/Jobs.models.js";
import Application from "../models/Application.model.js";
import JobSeekerProfile from "../models/JobSeekerProfile.model.js";
import RecruiterProfile from "../models/RecruiterProfile.model.js";
import SavedJob from "../models/SavedJobs.model.js";
import Notification from "../models/Notification.model.js";
import JobView from "../models/JobView.model.js";

/**
 * @desc    Get all users with pagination
 * @route   GET /api/v1/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter = {};
    
    // Optional filters
    if (req.query.role) {
      filter.role = req.query.role;
    }
    if (req.query.isActive !== undefined) {
      filter.isActive = req.query.isActive === 'true';
    }
    if (req.query.isVerified !== undefined) {
      filter.isVerified = req.query.isVerified === 'true';
    }
    if (req.query.search) {
      filter.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    // Get total count and stats for pagination
    const [total, activeCount, inactiveCount] = await Promise.all([
      User.countDocuments(filter),
      User.countDocuments({ ...filter, isActive: true }),
      User.countDocuments({ ...filter, isActive: false })
    ]);

    // Fetch users
    const users = await User.find(filter)
      .select('-password -verificationToken -resetPasswordToken -refreshToken')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: users,
      stats: {
        active: activeCount,
        inactive: inactiveCount
      },
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message
    });
  }
};

/**
 * @desc    Get user by ID
 * @route   GET /api/v1/users/:id
 * @access  Private/Admin
 */
export const getUsersbyId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -verificationToken -resetPasswordToken -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    // Handle invalid ObjectId
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
};

/**
 * @desc    Activate user account
 * @route   PATCH /api/v1/users/:id/activate
 * @access  Private/Admin
 */
export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if already active
    if (user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User account is already active"
      });
    }

    user.isActive = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "User account activated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error activating user",
      error: error.message
    });
  }
};

/**
 * @desc    Deactivate user account
 * @route   PATCH /api/v1/users/:id/deactivate
 * @access  Private/Admin
 */
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot deactivate your own account"
      });
    }

    // Check if already inactive
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "User account is already inactive"
      });
    }

    user.isActive = false;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: "User account deactivated successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        isActive: user.isActive
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deactivating user",
      error: error.message
    });
  }
};

/**
 * @desc    Delete user
 * @route   DELETE /api/v1/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account"
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message
    });
  }
};

/**
 * @desc    Delete currently authenticated account (jobseeker/recruiter)
 * @route   DELETE /api/v1/users/me
 * @access  Private/Jobseeker or Recruiter
 */
export const deleteOwnAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).select("name email role");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!["jobseeker", "recruiter"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Only recruiter and job seeker accounts can use this action",
      });
    }

    if (user.role === "jobseeker") {
      await Promise.all([
        JobSeekerProfile.deleteOne({ userId }),
        Application.deleteMany({ jobSeekerId: userId }),
        SavedJob.deleteMany({ jobSeekerId: userId }),
        JobView.deleteMany({ jobSeekerId: userId }),
      ]);
    }

    if (user.role === "recruiter") {
      const recruiterJobs = await Job.find({ recruiterId: userId }).select("_id");
      const recruiterJobIds = recruiterJobs.map((job) => job._id);

      await Promise.all([
        RecruiterProfile.deleteOne({ userId }),
        Application.deleteMany({ recruiterId: userId }),
        Job.deleteMany({ recruiterId: userId }),
      ]);

      if (recruiterJobIds.length > 0) {
        await Promise.all([
          Application.deleteMany({ jobId: { $in: recruiterJobIds } }),
          SavedJob.deleteMany({ jobId: { $in: recruiterJobIds } }),
          JobView.deleteMany({ jobId: { $in: recruiterJobIds } }),
        ]);
      }
    }

    await Promise.all([
      Notification.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "Your account has been deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting your account",
      error: error.message,
    });
  }
};
