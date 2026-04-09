import mongoose from "mongoose";
import Application from "../models/Application.model.js";
import Job from "../models/Jobs.models.js"; // Assuming this path
import JobSeekerProfile from "../models/JobSeekerProfile.model.js";
import { sendInterviewEmail } from "../utils/emailService.js";

/**
 * @desc    Get all applied job IDs for the authenticated job seeker
 * @route   GET /api/v1/applications/applied-jobs
 * @access  Private (Job Seeker)
 */
export const getAppliedJobIds = async (req, res) => {
  try {
    const applications = await Application.find(
      { jobSeekerId: req.user.id },
      { jobId: 1, _id: 0 }
    ).lean();

    const jobIds = applications.map(app => app.jobId.toString());

    res.status(200).json({
      success: true,
      data: jobIds,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Apply to a job
 * @route   POST /api/v1/applications
 * @access  Private (Job Seeker)
 */
export const applyToJob = async (req, res) => {
  try {
    const { jobId, coverLetter, screeningAnswers, resumeUsed } = req.body;
    const jobSeekerId = req.user.id;

    // 1. Validate Job Existence
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    // 2. Prevent Recruiter from applying to their own job (if logic allows users to have dual roles)
    if (job.recruiterId.toString() === jobSeekerId) {
      return res.status(400).json({ success: false, message: "You cannot apply to your own job listing" });
    }

    // 3. Check if already applied
    const hasApplied = await Application.hasApplied(jobId, jobSeekerId);
    if (hasApplied) {
      return res.status(400).json({ success: false, message: "You have already applied to this job" });
    }

    // 4. Check if Job Seeker Profile exists
    const profile = await JobSeekerProfile.findOne({ userId: jobSeekerId });
    if (!profile) {
      return res.status(400).json({ success: false, message: "Please complete your job seeker profile before applying" });
    }

    // 5. Create Application
    // We get recruiterId directly from the Job model to ensure accuracy
    const application = await Application.create({
      jobId,
      jobSeekerId,
      recruiterId: job.recruiterId,
      coverLetter,
      screeningAnswers,
      resumeUsed: resumeUsed || (profile.resume ? {
        fileName: profile.resume.fileName,
        fileUrl: profile.resume.fileUrl
      } : undefined),
      status: "submitted",
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get logged-in job seeker's applications
 * @route   GET /api/v1/applications/my-applications
 * @access  Private (Job Seeker)
 */
export const getMyApplications = async (req, res) => {
  try {
    const { status } = req.query;
    const filters = {};
    if (status) filters.status = status;

    // Uses the static method defined in your Schema
    const applications = await Application.getByJobSeeker(req.user.id, filters);

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all applications for a specific job
 * @route   GET /api/v1/applications/job/:jobId
 * @access  Private (Recruiter)
 */
export const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1. Verify Job Ownership
    // We must ensure the person requesting the applications is the recruiter who posted the job
    const job = await Job.findById(jobId);
    
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    if (job.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to view applications for this job" });
    }

    // 2. Fetch Applications
    // Uses the static method defined in Schema
    const applications = await Application.getByJob(jobId);
    
    // We additionally need the job seeker profile for their profile picture and more detailed info
    // since Application's jobSeekerId ref only points to the base User schema.
    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const appObj = app.toObject();
        if (app.jobSeekerId && app.jobSeekerId._id) {
          try {
            // Find the job seeker profile
            const profile = await JobSeekerProfile.findOne({ userId: app.jobSeekerId._id })
              .select("profilePicture headline summary location");
            
            if (profile) {
              appObj.jobSeekerProfile = profile;
            }
          } catch (err) {
            console.error("Error fetching job seeker profile for application:", err);
          }
        }
        return appObj;
      })
    );
    
    // 3. Get Stats
    const stats = await Application.getJobStats(jobId);

    res.status(200).json({
      success: true,
      count: applicationsWithProfiles.length,
      stats,
      data: applicationsWithProfiles,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single application details
 * @route   GET /api/v1/applications/:id
 * @access  Private (Owner/Recruiter)
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("jobId", "title company location employmentType salary")
      .populate("jobSeekerId", "firstName lastName email phone avatar")
      .populate("recruiterId", "firstName lastName email");

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Security Check:
    // User must be either the Job Seeker (Applicant) OR the Recruiter
    const isApplicant = application.jobSeekerId._id.toString() === req.user.id;
    const isRecruiter = application.recruiterId._id.toString() === req.user.id;

    if (!isApplicant && !isRecruiter) {
      return res.status(403).json({ success: false, message: "Not authorized to view this application" });
    }

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Withdraw an application
 * @route   PATCH /api/v1/applications/:id/withdraw
 * @access  Private (Job Seeker)
 */
export const withdrawApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Verify ownership
    if (application.jobSeekerId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to withdraw this application" });
    }

    // Use schema method
    await application.withdraw(req.user.id);

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully",
      data: application,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update application status
 * @route   PATCH /api/v1/applications/:id/status
 * @access  Private (Recruiter)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    // Verify ownership (Recruiter only)
    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized to update this application" });
    }

    // Use schema method to handle logic and history
    await application.updateStatus(status, req.user.id, notes);

    res.status(200).json({
      success: true,
      message: `Application status updated to ${status}`,
      data: application,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add a note to an application
 * @route   POST /api/v1/applications/:id/notes
 * @access  Private (Recruiter)
 */
export const addRecruiterNote = async (req, res) => {
  try {
    const { note } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await application.addRecruiterNote(note, req.user.id);

    res.status(200).json({
      success: true,
      message: "Note added successfully",
      data: application.recruiterNotes,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Rate a candidate
 * @route   PATCH /api/v1/applications/:id/rating
 * @access  Private (Recruiter)
 */
export const rateCandidate = async (req, res) => {
  try {
    const { rating } = req.body;
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.recruiterId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await application.rateApplication(rating);

    res.status(200).json({
      success: true,
      message: "Candidate rated successfully",
      data: { rating: application.rating },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Schedule an interview
 * @route   POST /api/v1/applications/:id/schedule-interview
 * @access  Private (Recruiter)
 */
export const scheduleInterview = async (req, res) => {
  try {
    const { scheduledAt, meetingLink, notes } = req.body;
    const application = await Application.findById(req.params.id)
      .populate({ path: 'jobSeekerId', select: 'email name' })
      .populate({ path: 'jobId', populate: { path: 'companyId', select: 'companyName company' }, select: 'title company' })
      .populate({ path: 'recruiterId', select: 'name email' });

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    if (application.recruiterId._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    await application.scheduleInterview(scheduledAt, meetingLink, notes);

    // Prepare variables for email
    const candidateEmail = application.jobSeekerId?.email;
    const jobTitle = application.jobId?.title || 'a Job';
    const companyName = application.jobId?.companyId?.companyName || application.jobId?.company || 'our company';

    if (candidateEmail) {
      sendInterviewEmail(candidateEmail, jobTitle, companyName, scheduledAt, meetingLink, notes).catch(e => {
        console.error("Failed to send interview email: ", e);
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview scheduled successfully and email notified",
      data: application.interviewDetails,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a rejected application
 * @route   DELETE /api/v1/applications/:id
 * @access  Private (Recruiter)
 */
export const deleteApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }

    const userId = req.user.id;
    const isRecruiter = application.recruiterId.toString() === userId;
    const isJobSeeker = application.jobSeekerId.toString() === userId;

    if (!isRecruiter && !isJobSeeker) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this application" });
    }

    if (isRecruiter && application.status !== "rejected") {
      return res.status(400).json({ success: false, message: "Recruiters can only delete rejected applications" });
    }

    if (isJobSeeker && !["withdrawn", "rejected"].includes(application.status)) {
      return res.status(400).json({ success: false, message: "You can only delete withdrawn or rejected applications" });
    }

    await Application.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Application deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};