import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const AdminProtectedRoute = ({ children }) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkAdmin = () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAdmin(false);
        setIsChecking(false);
        return;
      }
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setIsAdmin(decoded.isAdmin === true);
      } catch {
        setIsAdmin(false);
      }
      setIsChecking(false);
    };
    checkAdmin();
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
};

export default AdminProtectedRoute;
