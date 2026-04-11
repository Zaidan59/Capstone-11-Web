import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 py-1 bg-white shadow">
      <div className="flex items-center space-x-4">
        <Link to="/" className="flex items-center space-x-4">
          <img src={logo} alt="SIMBA Logo" className="w-12 h-12" />
          <span className="font-bold text-[20]">SIMBA</span>
        </Link>
      </div>
      <div className="flex items-center space-x-8">
        <Link to="/" className="text-[#232B36] font-medium text-[14] hover:text-blue-700 transition">
          Beranda
        </Link>
        <Link to="/maps" className="text-[#232B36] font-medium text-[14] hover:text-blue-700 transition">
          Peta
        </Link>
        <Link to="/artikel" className="text-[#232B36] font-medium text-[14] hover:text-blue-700 transition">
          Artikel
        </Link>
        <span className="h-8 w-px bg-slate-300 mx-2" />
        <Link to="/login" className="text-[#232B36] font-medium text-[14] hover:text-blue-700 transition">
          Masuk
        </Link>
        <Link
          to="/register"
          className="bg-[#1673FF] text-white px-5 py-2 rounded-lg font-medium text-[14] ml-2 shadow-md hover:bg-blue-700 transition"
        >
          Daftar
        </Link>
      </div>
    </nav>
  );
}