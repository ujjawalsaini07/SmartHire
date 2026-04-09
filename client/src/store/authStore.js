import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authApi } from '@api/authApi';

const customAuthStorage = {
  getItem: (name) => localStorage.getItem(name) || sessionStorage.getItem(name),
  setItem: (name, value) => {
    try {
      const parsed = JSON.parse(value);
      if (parsed.state && parsed.state.rememberMe === false) {
        sessionStorage.setItem(name, value);
        localStorage.removeItem(name);
      } else {
        localStorage.setItem(name, value);
        sessionStorage.removeItem(name);
      }
    } catch (e) {
      localStorage.setItem(name, value);
    }
  },
  removeItem: (name) => {
    localStorage.removeItem(name);
    sessionStorage.removeItem(name);
  }
};

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: false,
      rememberMe: true,
      appliedJobs: [],
      
      // Set authentication data
      setAuth: (user, accessToken, rememberMe = true) => {
        set({
          user,
          accessToken,
          isAuthenticated: true,
          rememberMe,
        });
      },
      
      // Update user data
      updateUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },
      
      // Set completely initialized appliedJobs list
      setAppliedJobs: (jobIds) => {
        set({ appliedJobs: jobIds });
      },

      // Push one job locally after applying
      addAppliedJob: (jobId) => {
        set((state) => ({ appliedJobs: [...state.appliedJobs, jobId] }));
      },
      
      // Logout user
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          appliedJobs: [],
        });
        customAuthStorage.removeItem('auth-storage');
      },
      
      // Set loading state
      setLoading: (isLoading) => {
        set({ isLoading });
      },
      
      // Check if user has specific role
      hasRole: (role) => {
        return get().user?.role === role;
      },
      
      // Check if user is verified
      isVerified: () => {
        return get().user?.isVerified === true;
      },
      // Check authentication status
      checkAuth: async () => {
        const state = get();
        
        // Skip if we're already logged out and have no user data
        if (!state.user && !state.isAuthenticated) {
          set({ isLoading: false });
          return;
        }
        
        set({ isLoading: true });
        try {
          const response = await authApi.getCurrentUser();
          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              appliedJobs: response.data.appliedJobs || [],
            });
          } else {
            // Invalid session - clear auth state
            set({
              user: null,
              accessToken: null,
              isAuthenticated: false,
              appliedJobs: [],
            });
          }
        } catch (error) {
          // Auth check failed - just clear the state, don't call logout
          // (logout would clear localStorage which we might want to keep for retry)
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            appliedJobs: [],
          });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
      getStorage: () => customAuthStorage,
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken, // Persist access token too if needed for API interceptors
        rememberMe: state.rememberMe,
      }),
    }
  )
);

export default useAuthStore;
