import api from './axios';

export const jobSeekerApi = {
  // ============================================
  // Profile Management
  // ============================================
  
  // Get my profile
  getMyProfile: async () => {
    const response = await api.get('/jobseekers/profile');
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
  // Resume & Portfolio Management
  // ============================================
  
  // Upload resume
  uploadResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/jobseekers/profile/resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete resume
  deleteResume: async () => {
    const response = await api.delete('/jobseekers/profile/resume');
    return response.data;
  },

  // Upload video resume
  uploadVideoResume: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/jobseekers/profile/video-resume', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete video resume
  deleteVideoResume: async () => {
    const response = await api.delete('/jobseekers/profile/video-resume');
    return response.data;
  },

  // Add portfolio item
  addPortfolioItem: async (portfolioData) => {
    const formData = new FormData();
    formData.append('title', portfolioData.title);
    if (portfolioData.description) {
      formData.append('description', portfolioData.description);
    }
    if (portfolioData.projectUrl) {
      formData.append('projectUrl', portfolioData.projectUrl);
    }
    if (portfolioData.file) {
      formData.append('file', portfolioData.file);
    }
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
