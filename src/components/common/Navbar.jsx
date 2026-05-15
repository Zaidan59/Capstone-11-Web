import { Link } from "react-router-dom";
import logo from "../../assets/Logo.png";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();
  const isLoggedIn = Boolean(user);

  return (
    <nav className="fixed left-0 right-0 top-0 z-[1000] h-14 bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-4">
              <img src={logo} alt="SIMBA Logo" className="w-12 h-12" />
              <span className="font-bold text-[20px]">SIMBA</span>
            </Link>
          </div>
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-[#232B36] font-medium text-[14px] hover:text-blue-700 transition">
              Beranda
            </Link>
            <Link to="/maps" className="text-[#232B36] font-medium text-[14px] hover:text-blue-700 transition">
              Peta
            </Link>
            <Link to="/artikel" className="text-[#232B36] font-medium text-[14px] hover:text-blue-700 transition">
              Artikel
            </Link>
            <span className="h-8 w-px bg-slate-300 mx-2" />
            {isLoggedIn ? (
              <button
                type="button"
                onClick={logout}
                className="text-[#232B36] font-medium text-[14px] hover:text-blue-700 transition"
              >
                Keluar
              </button>
            ) : (
              <>
                <Link to="/login" className="text-[#232B36] font-medium text-[14px] hover:text-blue-700 transition">
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-[#1673FF] text-white px-5 py-2 rounded-lg font-medium text-[14px] ml-2 shadow-md hover:bg-blue-700 transition"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
