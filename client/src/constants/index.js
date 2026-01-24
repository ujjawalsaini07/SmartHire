export const API_BASE_URL = "http://localhost:5000/api/v1";

export const USER_ROLES = {
  CANDIDATE: "CANDIDATE",
  RECRUITER: "RECRUITER",
  ADMIN: "ADMIN",
};

export const APPLICATION_STATUS = {
  SUBMITTED: "submitted",
  UNDER_REVIEW: "under_review",
  SHORTLISTED: "shortlisted",
  REJECTED: "rejected",
  INTERVIEW_SCHEDULED: "interview_scheduled",
  HIRED: "hired",
};

export const JOB_TYPES = {
  FULL_TIME: "full-time",
  PART_TIME: "part-time",
  CONTRACT: "contract",
  INTERNSHIP: "internship",
};

export const EXPERIENCE_LEVELS = {
  ENTRY_LEVEL: "entry-level",
  MID_LEVEL: "mid-level",
  SENIOR: "senior",
  EXECUTIVE: "executive",
};

export const WORK_OPTIONS = {
  ONSITE: "onsite",
  HYBRID: "hybrid",
  REMOTE: "remote",
};

export const ROUTES = {
  PUBLIC: {
    HOME: "/",
    LOGIN: "/login",
    REGISTER: "/register",
    REGISTER_CANDIDATE: "/register/candidate",
    REGISTER_RECRUITER: "/register/recruiter",
    UNAUTHORIZED: "/unauthorized",
  },
  DASHBOARD: {
    BASE: "/dashboard",
    CANDIDATE: {
      PROFILE: "/dashboard/profile",
      JOB_MATCHES: "/dashboard/job-matches",
      APPLICATIONS: "/dashboard/applications",
      RESUME_BUILDER: "/dashboard/resume-builder",
    },
    RECRUITER: {
      HOME: "/dashboard/recruiter-home",
      POST_JOB: "/dashboard/post-job",
      JOB_MANAGEMENT: "/dashboard/job-management",
      CANDIDATE_SEARCH: "/dashboard/candidate-search",
      APPLICANTS: "/dashboard/applicants",
      ANALYTICS: "/dashboard/recruiter-analytics",
    },
    ADMIN: {
      HOME: "/dashboard/admin-home",
      USER_MANAGEMENT: "/dashboard/user-management",
      JOB_MANAGEMENT: "/dashboard/job-management-admin",
      ANALYTICS: "/dashboard/admin-analytics",
      SYSTEM_SETTINGS: "/dashboard/system-settings",
    },
  },
};
