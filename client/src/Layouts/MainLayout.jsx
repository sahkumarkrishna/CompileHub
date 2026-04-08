import { Outlet } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";
import Footer from "../components/Footer";

function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#030712] flex flex-col">
      <UserNavbar />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          {children || <Outlet />}
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MainLayout;