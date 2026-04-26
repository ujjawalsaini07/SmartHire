import Job from "../models/Jobs.models.js";
import RecruiterProfile from "../models/RecruiterProfile.model.js";
import JobSeekerProfile from "../models/JobSeekerProfile.model.js";
import JobView from "../models/JobView.model.js";
import SystemSettings from "../models/SystemSettings.model.js";
import mongoose from "mongoose";

/**
 * @desc    Get all jobs (public, paginated)
 * @route   GET /api/v1/jobs
 * @access  Public
 */
export const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      keyword,        // frontend sends 'keyword'
      experienceLevel,
      employmentType,
      location,
      isRemote,
      isFeatured,
      sortBy = "postedAt",
      order = "desc",
    } = req.query;

    // Build filter object
    const filter = { status: "active" };

    // Keyword search (title / description)
    if (keyword && keyword.trim()) {
      filter.$or = [
        { title: { $regex: keyword.trim(), $options: 'i' } },
        { description: { $regex: keyword.trim(), $options: 'i' } },
      ];
    } 

    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (employmentType) filter.employmentType = employmentType;
    
    // Location filter
    if (location) {
      filter.$or = [
        { "location.city": new RegExp(location, "i") },
        { "location.state": new RegExp(location, "i") },
        { "location.country": new RegExp(location, "i") },
      ];
    }
    
    if (isRemote === "true") filter["location.isRemote"] = true;
    if (isFeatured === "true") filter.isFeatured = true;

    // Exclude expired jobs — only exclude when a deadline is explicitly set AND it has passed.
    // Jobs with no deadline (null/undefined) are open-ended and should always be shown.
    filter.$and = filter.$and || [];
    filter.$and.push({
      $or: [
        { applicationDeadline: { $exists: false } },
        { applicationDeadline: null },
        { applicationDeadline: { $gt: new Date() } },
      ],
    });

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Map frontend sort values to MongoDB field names
    let sortField = sortBy;
    let customSortOrder = sortOrder;
    if (sortBy === 'newest') { sortField = 'postedAt'; customSortOrder = -1; }
    else if (sortBy === 'oldest') { sortField = 'postedAt'; customSortOrder = 1; }
    else if (sortBy === 'salary-high') { sortField = 'salary.max'; customSortOrder = -1; }
    else if (sortBy === 'salary-low') { sortField = 'salary.min'; customSortOrder = 1; }
    else if (sortBy === 'relevance') { sortField = 'isFeatured'; customSortOrder = -1; }

    // Get total count for pagination
    const totalJobs = await Job.countDocuments(filter);

    // Fetch jobs with population
    const jobs = await Job.find(filter)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry location")
      .populate("requiredSkills", "name")
      .populate("category", "name")
      .sort({ [sortField]: customSortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      currentPage: parseInt(page),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching jobs",
      error: error.message,
    });
  }
};

/**
 * @desc    Search jobs with filters
 * @route   GET /api/v1/jobs/search
 * @access  Public
 */
export const searchJobs = async (req, res) => {
  try {
    const {
      q, // search query
      page = 1,
      limit = 10,
      experienceLevel,
      employmentType,
      location,
      isRemote,
      salaryMin,
      salaryMax,
      skills,
      category,
      sortBy = "relevance",
    } = req.query;

    // Build filter object
    const filter = { status: "active" };

    // Text search
    if (q) {
      filter.$text = { $search: q };
    }

    // Apply filters
    if (experienceLevel) filter.experienceLevel = experienceLevel;
    if (employmentType) filter.employmentType = employmentType;
    if (location) {
      filter.$or = [
        { "location.city": new RegExp(location, "i") },
        { "location.state": new RegExp(location, "i") },
        { "location.country": new RegExp(location, "i") },
      ];
    }
    if (isRemote === "true") filter["location.isRemote"] = true;

    // Salary range filter
    if (salaryMin) {
      filter["salary.max"] = { $gte: parseInt(salaryMin) };
    }
    if (salaryMax) {
      filter["salary.min"] = { $lte: parseInt(salaryMax) };
    }

    // Skills filter
    if (skills) {
      const skillIds = skills.split(",");
      filter.requiredSkills = { $in: skillIds };
    }

    // Category filter
    if (category) {
      filter.category = category;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Determine sort
    let sort = {};
    if (sortBy === "relevance" && q) {
      sort = { score: { $meta: "textScore" }, isFeatured: -1 };
    } else if (sortBy === "date") {
      sort = { postedAt: -1 };
    } else if (sortBy === "salary") {
      sort = { "salary.max": -1 };
    } else {
      sort = { isFeatured: -1, postedAt: -1 };
    }

    // Get total count
    const totalJobs = await Job.countDocuments(filter);

    // Fetch jobs
    const jobs = await Job.find(filter)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry location")
      .populate("requiredSkills", "name")
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      currentPage: parseInt(page),
      searchQuery: q || null,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching jobs",
      error: error.message,
    });
  }
};

/**
 * @desc    Get recommended jobs for job seeker
 * @route   GET /api/v1/jobs/recommended
 * @access  Private (Job Seeker)
 */
export const getRecommendedJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    // Get job seeker profile
    const jobSeekerProfile = await JobSeekerProfile.findOne({ userId })
      .populate("skills", "name")
      .lean();

    if (!jobSeekerProfile) {
      return res.status(404).json({
        success: false,
        message: "Job seeker profile not found",
      });
    }

    // Build recommendation filter
    const filter = { status: "active" };

    // Match skills
    const skillIds = jobSeekerProfile.skills?.map((skill) =>
      skill._id ? skill._id : skill
    );

    if (skillIds && skillIds.length > 0) {
      filter.requiredSkills = { $in: skillIds };
    }

    // Match job type preferences
    if (
      jobSeekerProfile.preferences?.jobType &&
      jobSeekerProfile.preferences.jobType.length > 0
    ) {
      filter.employmentType = { $in: jobSeekerProfile.preferences.jobType };
    }

    // Match remote work preference
    if (jobSeekerProfile.preferences?.remoteWorkPreference) {
      const remotePreference =
        jobSeekerProfile.preferences.remoteWorkPreference;
      if (remotePreference === "remote") {
        filter["location.isRemote"] = true;
      } else if (remotePreference === "onsite") {
        filter["location.isRemote"] = false;
      }
      // hybrid and flexible match any
    }

    // Match salary expectations
    if (jobSeekerProfile.preferences?.desiredSalaryMin) {
      filter["salary.max"] = {
        $gte: jobSeekerProfile.preferences.desiredSalaryMin,
      };
    }

    // Match location if not willing to relocate and not remote preference
    if (
      !jobSeekerProfile.preferences?.willingToRelocate &&
      jobSeekerProfile.preferences?.remoteWorkPreference !== "remote" &&
      jobSeekerProfile.location?.city
    ) {
      filter.$or = [
        { "location.city": jobSeekerProfile.location.city },
        { "location.isRemote": true },
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Get total count
    const totalJobs = await Job.countDocuments(filter);

    // Fetch recommended jobs
    const jobs = await Job.find(filter)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry location")
      .populate("requiredSkills", "name")
      .populate("category", "name")
      .sort({ isFeatured: -1, postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      currentPage: parseInt(page),
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching recommended jobs",
      error: error.message,
    });
  }
};

/**
 * @desc    Get job details by ID
 * @route   GET /api/v1/jobs/:id
 * @access  Public
 */
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    const job = await Job.findById(id)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo companyDescription industry location website")
      .populate("requiredSkills", "name")
      .populate("category", "name");

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching job details",
      error: error.message,
    });
  }
};

/**
 * @desc    Create job posting
 * @route   POST /api/v1/jobs
 * @access  Private (Recruiter - Verified)
 */
export const createJob = async (req, res) => {
  try {
    const recruiterId = req.user.id;

    // Check if recruiter profile exists and is verified
    const recruiterProfile = await RecruiterProfile.findOne({
      userId: recruiterId,
    });

    if (!recruiterProfile) {
      return res.status(404).json({
        success: false,
        message: "Recruiter profile not found. Please complete your profile first.",
      });
    }

    if (!recruiterProfile.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Your recruiter account must be verified before posting jobs.",
      });
    }

    // 🔒 SANITIZE INPUT - Remove protected fields
    const sanitizedBody = { ...req.body };
    delete sanitizedBody.recruiterId;
    delete sanitizedBody.companyId;
    delete sanitizedBody.views;
    delete sanitizedBody.applicationCount;
    delete sanitizedBody.moderatedBy;
    delete sanitizedBody.moderatedAt;
    delete sanitizedBody.moderationNotes;
    delete sanitizedBody.postedAt;
    delete sanitizedBody.closedAt;
    delete sanitizedBody.isFeatured; // Only admins should set this

    // Create job with recruiter and company information
    const jobData = {
      ...sanitizedBody,
      recruiterId,
      companyId: recruiterProfile._id,
      status: "draft", // Always start as draft
    };

    const job = await Job.create(jobData);

    // Populate the created job
    const populatedJob = await Job.findById(job._id)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry")
      .populate("requiredSkills", "name")
      .populate("category", "name");

    res.status(201).json({
      success: true,
      message: "Job posting created successfully",
      data: populatedJob,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating job posting",
      error: error.message,
    });
  }
};

/**
 * @desc    Update job posting
 * @route   PUT /api/v1/jobs/:id
 * @access  Private (Recruiter - Owner)
 */
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id;
    let wasAutoModerated = false;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Find job and check ownership
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is the owner
    if (job.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to update this job",
      });
    }

    // 🔒 SANITIZE INPUT - Remove ALL protected fields
    const sanitizedBody = { ...req.body };
    delete sanitizedBody.recruiterId;
    delete sanitizedBody.companyId;
    delete sanitizedBody.views;
    delete sanitizedBody.applicationCount;
    delete sanitizedBody.moderatedBy;
    delete sanitizedBody.moderatedAt;
    delete sanitizedBody.moderationNotes;
    delete sanitizedBody.postedAt;
    delete sanitizedBody.closedAt;
    delete sanitizedBody.isFeatured;
    delete sanitizedBody.status; // Handle status separately

    // ⚠️ Status transitions allowed for recruiters
    if (req.body.status) {
      if (job.status === "draft" && req.body.status === "pending-approval") {
        const settings = await SystemSettings.getSingleton();

        if (settings.autoModerateJobs) {
          const recruiterProfile = await RecruiterProfile.findOne({ userId: recruiterId }).select("isVerified");
          if (recruiterProfile?.isVerified) {
            job.status = "active";
            job.moderatedBy = null;
            job.moderatedAt = new Date();
            job.moderationNotes = "Auto-approved by platform settings.";
            wasAutoModerated = true;
          } else {
            await job.submitForApproval();
          }
        } else {
          await job.submitForApproval();
        }
      } else if (job.status === "pending-approval" && req.body.status === "draft") {
        job.status = "draft";
      } else if (req.body.status !== job.status) {
        return res.status(403).json({
          success: false,
          message: "You can only toggle between Draft and Pending Approval. Other status changes require the close/reopen endpoints.",
        });
      }
    }

    // If recruiter edits a closed/filled job's content, it must go through approval again
    if (["closed", "filled"].includes(job.status) && Object.keys(sanitizedBody).length > 0) {
      job.status = "pending-approval";
      job.closedAt = null;
      job.moderatedBy = null;
      job.moderatedAt = null;
    }

    // Update job with sanitized data using Mongoose's .set() for proper array updates
    job.set(sanitizedBody);
    await job.save();

    // Populate the updated job
    const updatedJob = await Job.findById(job._id)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry")
      .populate("requiredSkills", "name")
      .populate("category", "name");

    res.status(200).json({
      success: true,
      message: wasAutoModerated
        ? "Job auto-approved and published successfully"
        : "Job posting updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle custom errors from methods (like submitForApproval)
    if (error.message.includes("Only draft jobs")) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Error updating job posting",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete job posting
 * @route   DELETE /api/v1/jobs/:id
 * @access  Private (Recruiter - Owner)
 */
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Find job and check ownership
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Check if user is the owner
    if (job.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this job",
      });
    }

    const Application = mongoose.model("Application");

    // Delete only non-accepted applications (ghost prevention)
    // Accepted/hired/offered applications are preserved so job seekers retain their
    // acceptance record, but the job title is snapshotted onto the application.
    await Application.updateMany(
      { jobId: id, status: { $in: ["accepted", "hired", "offered"] } },
      { $set: { _deletedJobTitle: job.title, _deletedJobCompany: job.companyId } }
    );
    await Application.deleteMany({
      jobId: id,
      status: { $nin: ["accepted", "hired", "offered"] }
    });

    // Delete the job itself
    await Job.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Job posting deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting job posting",
      error: error.message,
    });
  }
};

/**
 * @desc    Close job posting
 * @route   PATCH /api/v1/jobs/:id/close
 * @access  Private (Recruiter - Owner)
 */
export const closeJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    // Only active jobs can be closed directly
    if (!['active'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot close a job with status "${job.status}". Only active jobs can be closed.`,
      });
    }

    job.status = "closed";
    job.closedAt = new Date();
    await job.save();

    const closedJob = await Job.findById(job._id)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry")
      .populate("requiredSkills", "name")
      .populate("category", "name");

    res.status(200).json({ success: true, message: "Job closed successfully", data: closedJob });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error closing job", error: error.message });
  }
};

/**
 * @desc    Reopen a closed job (goes back to pending-approval)
 * @route   PATCH /api/v1/jobs/:id/reopen
 * @access  Private (Recruiter - Owner)
 */
export const reopenJob = async (req, res) => {
  try {
    const { id } = req.params;
    const recruiterId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ success: false, message: "Job not found" });
    if (job.recruiterId.toString() !== recruiterId) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    if (!['closed', 'filled'].includes(job.status)) {
      return res.status(400).json({
        success: false,
        message: `Only closed or filled jobs can be reopened. Current status: "${job.status}"`,
      });
    }

    // Reopening requires admin re-approval
    job.status = "pending-approval";
    job.closedAt = null;
    job.moderatedBy = null;
    job.moderatedAt = null;
    job.moderationNotes = null;
    await job.save();

    const updatedJob = await Job.findById(job._id)
      .populate("recruiterId", "name email")
      .populate("companyId", "companyName companyLogo industry")
      .populate("requiredSkills", "name")
      .populate("category", "name");

    res.status(200).json({
      success: true,
      message: "Job submitted for re-approval. It will go live once approved by an admin.",
      data: updatedJob,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error reopening job", error: error.message });
  }
};

/**
 * @desc    Get recruiter's jobs
 * @route   GET /api/v1/jobs/my-jobs
 * @access  Private (Recruiter)
 */
export const getMyJobs = async (req, res) => {
  try {
    const recruiterId = req.user.id;
    const {
      page = 1,
      limit = 10,
      status,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    // Build filter
    const filter = { recruiterId };

    if (status) {
      filter.status = status;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const sortOrder = order === "asc" ? 1 : -1;

    // Get total count
    const totalJobs = await Job.countDocuments(filter);

    // Fetch jobs
    const jobs = await Job.find(filter)
      .populate("companyId", "companyName companyLogo industry")
      .populate("requiredSkills", "name")
      .populate("category", "name")
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(parseInt(limit));

    // Get status counts
    const statusCounts = await Job.aggregate([
      { $match: { recruiterId: new mongoose.Types.ObjectId(recruiterId) } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const statusSummary = statusCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: jobs.length,
      totalJobs,
      totalPages: Math.ceil(totalJobs / parseInt(limit)),
      currentPage: parseInt(page),
      statusSummary,
      data: jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching your jobs",
      error: error.message,
    });
  }
};

/**
 * @desc    Track job view
 * @route   POST /api/v1/jobs/:id/view
 * @access  Public
 */
export const trackJobView = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id || null; // Optional: user might not be logged in
    const { ipAddress, userAgent } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    // Check if job exists
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // Record the view
    await JobView.recordView(id, userId, ipAddress, userAgent);

    res.status(200).json({
      success: true,
      message: "Job view tracked successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error tracking job view",
      error: error.message,
    });
  }
};

/**
 * @desc    Toggle featured status of a job (Admin only)
 * @route   PATCH /api/v1/jobs/:id/featured
 * @access  Private (Admin)
 */
export const toggleFeaturedJob = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid job ID" });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.isFeatured = !job.isFeatured;
    await job.save({ validateBeforeSave: false });

    res.status(200).json({
      success: true,
      message: `Job ${job.isFeatured ? "featured" : "unfeatured"} successfully`,
      data: { isFeatured: job.isFeatured },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error toggling featured status",
      error: error.message,
    });
  }
};
