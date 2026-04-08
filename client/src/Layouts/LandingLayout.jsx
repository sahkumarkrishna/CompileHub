import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

function LandingLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#030712]">
      <UserNavbar />
      {children || <Outlet />}
    </div>
  );
}

export default LandingLayout;
