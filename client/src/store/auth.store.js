import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  accesstoken: null,
  isAuthenticated: false,
  loading: true,

  login: (user, accesstoken) =>
    set({
      user,
      accesstoken,
      isAuthenticated: true,
      loading: false,
    }),

  logout: async () => {
    try {
    
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
 
      set({
        user: null,
        accesstoken: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  refresh: async () => {
    try {
      
      const res = await api.get("/auth/refresh");
      
      set({
        user: res.data.user,
        accesstoken: res.data.accesstoken,
        isAuthenticated: true,
        loading: false,
      });
      
      return true; 
    } catch (err) {
      console.error("Refresh token error:", err);
      
      
      set({
        user: null,
        accesstoken: null,
        isAuthenticated: false,
        loading: false,
      });
      
      return false; 
    }
  },
}));

export default useAuthStore;