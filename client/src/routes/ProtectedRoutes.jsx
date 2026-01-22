import { Navigate } from "react-router-dom";
import useAuthStore from "../store/auth.store";
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <p>Loading...</p>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
