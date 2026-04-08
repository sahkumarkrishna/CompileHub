import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userProfilePhoto");
    
    window.dispatchEvent(new Event("profileUpdated"));
    
    toast.success("Logged out successfully");
    navigate("/");
  }, [navigate]);

  return null;
};

export default Logout;
