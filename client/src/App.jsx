import { useEffect } from "react";
import useAuthStore from "./store/auth.store";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./routes/ProtectedRoutes.jsx";
import LandingPage from "./pages/public/LandingPage.jsx";
import Unauthorized from "./pages/public/Unauthorized.jsx";
import Register from "./pages/auth/Register.jsx";

function App() {
  const { refresh, loading } = useAuthStore();

  useEffect(() => {
 
    refresh();
  }, [refresh]);

 
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Role-specific Registration Routes */}
        <Route path="/register/candidate" element={<Register initialRole="CANDIDATE" />} />
        <Route path="/register/recruiter" element={<Register initialRole="RECRUITER" />} />
        
        {/* Fallback generic register */}
        <Route path="/register" element={<Register />} />
        
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* PROTECTED */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;