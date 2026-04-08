import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const token = localStorage.getItem("token");
  
  if (!isLoggedIn || !token) {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
