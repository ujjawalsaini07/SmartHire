import RecruiterProfile from "../models/RecruiterProfile.model.js";
import User from "../models/User.model.js";

/**
 * @desc    Get all pending recruiter verifications
 * @route   GET /api/v1/admin/recruiters/pending
 * @access  Admin only
 */
export const getPendingVerification = async (req, res) => {
  try {
    // Find all recruiter profiles with pending verification status
    const pendingRecruiters = await RecruiterProfile.find({
      verificationStatus: "pending",
    })
      .populate("userId", "name email createdAt lastLogin")
      .sort({ createdAt: -1 }); // Most recent first

    // Calculate profile completeness for each recruiter
    const recruitersWithCompleteness = pendingRecruiters.map((recruiter) => {
      const recruiterObj = recruiter.toObject();
      recruiterObj.profileCompleteness = recruiter.calculateProfileCompleteness();
      return recruiterObj;
    });

    return res.status(200).json({
      success: true,
      count: recruitersWithCompleteness.length,
      data: recruitersWithCompleteness,
    });
  } catch (error) {
    console.error("Error fetching pending verifications:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching pending verifications",
      error: error.message,
    });
  }
};

/**
 * @desc    Approve/verify a recruiter
 * @route   PATCH /api/v1/admin/recruiters/:id/verify
 * @access  Admin only
 */
export const verifyRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id; // Admin user ID from protect middleware

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter profile ID format",
      });
    }

    // Find the recruiter profile
    const recruiterProfile = await RecruiterProfile.findById(id).populate(
      "userId",
      "name email"
    );

    if (!recruiterProfile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    // Check if already verified
    if (recruiterProfile.verificationStatus === "approved") {
      return res.status(400).json({
        success: false,
        message: "Recruiter is already verified",
      });
    }

    // Use the schema method to approve verification
    await recruiterProfile.approveVerification(adminId);

    // Update the User model's isVerified field
    await User.findByIdAndUpdate(recruiterProfile.userId, {
      isVerified: true,
    });

    return res.status(200).json({
      success: true,
      message: "Recruiter verified successfully",
      data: {
        recruiterId: recruiterProfile._id,
        companyName: recruiterProfile.companyName,
        verificationStatus: recruiterProfile.verificationStatus,
        verifiedAt: recruiterProfile.verifiedAt,
      },
    });
  } catch (error) {
    console.error("Error verifying recruiter:", error);
    return res.status(500).json({
      success: false,
      message: "Error verifying recruiter",
      error: error.message,
    });
  }
};

/**
 * @desc    Reject a recruiter verification
 * @route   PATCH /api/v1/admin/recruiters/:id/reject
 * @access  Admin only
 */
export const rejectRecruiter = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes } = req.body;
    const adminId = req.user.id; // Admin user ID from protect middleware

    // Validate ID format
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid recruiter profile ID format",
      });
    }

    // Validate rejection notes
    if (!notes || notes.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Rejection notes are required",
      });
    }

    // Find the recruiter profile
    const recruiterProfile = await RecruiterProfile.findById(id).populate(
      "userId",
      "name email"
    );

    if (!recruiterProfile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found",
      });
    }

    // Check if already rejected
    if (recruiterProfile.verificationStatus === "rejected") {
      return res.status(400).json({
        success: false,
        message: "Recruiter is already rejected",
      });
    }

    // Use the schema method to reject verification
    await recruiterProfile.rejectVerification(adminId, notes);

    // Update the User model's isVerified field
    await User.findByIdAndUpdate(recruiterProfile.userId, {
      isVerified: false,
    });

    return res.status(200).json({
      success: true,
      message: "Recruiter verification rejected",
      data: {
        recruiterId: recruiterProfile._id,
        companyName: recruiterProfile.companyName,
        verificationStatus: recruiterProfile.verificationStatus,
        verificationNotes: recruiterProfile.verificationNotes,
      },
    });
  } catch (error) {
    console.error("Error rejecting recruiter:", error);
    return res.status(500).json({
      success: false,
      message: "Error rejecting recruiter",
      error: error.message,
    });
  }
};