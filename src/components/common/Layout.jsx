import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="min-h-screen bg-white pt-14">
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  );
}
