import api from './axios';

export const jobSeekerApi = {
  // ============================================
  // Profile Management
  // ============================================

  // Get my profile
  getMyProfile: async () => {
    const response = await api.get(`/jobseekers/profile?_t=${new Date().getTime()}`);
    return response.data;
  },

  // Create profile
  createProfile: async (profileData) => {
    const response = await api.post('/jobseekers/profile', profileData);
    return response.data;
  },

  // Update profile
  updateProfile: async (profileData) => {
    const response = await api.put('/jobseekers/profile', profileData);
    return response.data;
  },

  // ============================================
  // Profile Picture  (Cloudinary → SmartHire/profile)
  // ============================================

  // Upload profile picture
  uploadProfilePicture: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('image', file); // field name must match middleware: "image"
    const response = await api.post('/jobseekers/profile/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined,
    });
    return response.data;
  },

  // Delete profile picture
  deleteProfilePicture: async () => {
    const response = await api.delete('/jobseekers/profile/profile-picture');
    return response.data;
  },

  // ============================================
  // Resume  (Cloudinary → SmartHire/resume)
  // ============================================

  // Upload resume — accepts optional progress callback (pct: 0-100)
  uploadResume: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('resume', file); // field name must match middleware: "resume"
    const response = await api.post('/jobseekers/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined,
    });
    return response.data;
  },

  // Delete resume
  deleteResume: async () => {
    const response = await api.delete('/jobseekers/profile/resume');
    return response.data;
  },

  // ============================================
  // Video Resume  (Cloudinary → SmartHire/video-resume)
  // ============================================

  // Upload video resume — accepts optional progress callback (pct: 0-100)
  uploadVideoResume: async (file, onProgress) => {
    const formData = new FormData();
    formData.append('video', file); // field name must match middleware: "video"
    const response = await api.post('/jobseekers/profile/video-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: onProgress
        ? (e) => onProgress(Math.round((e.loaded * 100) / e.total))
        : undefined,
    });
    return response.data;
  },

  // Delete video resume
  deleteVideoResume: async () => {
    const response = await api.delete('/jobseekers/profile/video-resume');
    return response.data;
  },

  // ============================================
  // Portfolio Management  (Cloudinary → SmartHire/portfolio)
  // ============================================

  // Add portfolio item (with optional file)
  addPortfolioItem: async (portfolioData) => {
    const formData = portfolioData instanceof FormData ? portfolioData : (() => {
      const fd = new FormData();
      Object.keys(portfolioData).forEach(key => {
        if (Array.isArray(portfolioData[key])) {
          portfolioData[key].forEach(val => fd.append(key, val));
        } else {
          fd.append(key, portfolioData[key]);
        }
      });
      return fd;
    })();
    const response = await api.post('/jobseekers/profile/portfolio', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete portfolio item
  deletePortfolioItem: async (itemId) => {
    const response = await api.delete(`/jobseekers/profile/portfolio/${itemId}`);
    return response.data;
  },

  // ============================================
  // Job Applications
  // ============================================

  // Apply to job
  applyToJob: async (applicationData) => {
    const response = await api.post('/applications', applicationData);
    return response.data;
  },

  // Get my applications
  getMyApplications: async (params) => {
    const response = await api.get('/applications/my-applications', { params });
    return response.data;
  },

  // Get application details
  getApplicationDetails: async (applicationId) => {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  },

  // Withdraw application
  withdrawApplication: async (applicationId) => {
    const response = await api.patch(`/applications/${applicationId}/withdraw`);
    return response.data;
  },

  // ============================================
  // Saved Jobs
  // ============================================

  // Get saved jobs
  getSavedJobs: async () => {
    const response = await api.get('/saved-jobs');
    return response.data;
  },

  // Save job
  saveJob: async (jobId) => {
    const response = await api.post('/saved-jobs', { jobId });
    return response.data;
  },

  // Unsave job
  unsaveJob: async (jobId) => {
    const response = await api.delete(`/saved-jobs/${jobId}`);
    return response.data;
  },

  // ============================================
  // Job Search & Recommendations
  // ============================================

  // Get recommended jobs
  getRecommendedJobs: async (params) => {
    const response = await api.get('/jobs/recommendations', { params });
    return response.data;
  },
};
