import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/Logo.png";
import Regist_image from "../../assets/Regist_image.png";
// import { register } from "../../services/authService";

const sppgOptions = [
  "SPPG Srengseng",
  "SPPG Tebet Kebon Baru",
  "SPPG Kebayoran Baru",
  "SPPG Bambu Apus",
];

export default function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("sppg");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    nama: "",
    email: "",
    nomor: "",
    kode: "",
    alamat: "",
    sppg: "",
    password: "",
    konfirmasi: "",
  });

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async () => {
    setError("");
    if (form.password !== form.konfirmasi) {
      setError("Kata sandi tidak cocok.");
      return;
    }
    if (!agreed) {
      setError("Harap centang persetujuan terlebih dahulu.");
      return;
    }
    setIsLoading(true);
    try {
     // await register({ ...form, role });//
      navigate("/login");
    } catch {
      setError("Pendaftaran gagal. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-5xl flex rounded-2xl overflow-hidden shadow-xl bg-white">

        {/* Left Panel */}
        <div className="hidden md:flex w-1/2 flex-col justify-between bg-gradient-to-b from-blue-50 to-blue-100 p-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-blue-600 transition w-fit"
          >
            ← Kembali
          </button>

          <div className="rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(15,23,42,0.12)] border border-slate-200 bg-white p-3">
            <img src={Regist_image} alt="RegisterImage" className="w-full object-cover h-full" />
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">
              Membangun Kepercayaan <br /> Melalui Transparansi
            </h2>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Daftarkan institusi Anda untuk mendapatkan akses ke dashboard pemantauan gizi dan logistik pelayanan sekolah nasional.
            </p>
          </div>

          <div className="text-xs text-slate-400 space-y-1">
            <p>© 2026 SIMBA · Capstone Kelompok 11 · All rights reserved.</p>
            <div className="flex gap-3">
              <span className="hover:text-blue-500 cursor-pointer">Kebijakan Privasi</span>
              <span className="hover:text-blue-500 cursor-pointer">Ketentuan Layanan</span>
              <span className="hover:text-blue-500 cursor-pointer">Pusat Dukungan</span>
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-7/12 flex flex-col px-8 py-8 overflow-y-auto max-h-screen">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
            Pilih Peran Institusi
          </p>

          {/* Role Toggle */}
          <div className="flex rounded-lg border border-slate-200 p-1 mb-5 gap-1">
            <button
              type="button"
              onClick={() => setRole("sppg")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition flex items-center justify-center gap-1 ${
                role === "sppg"
                  ? "bg-white shadow text-slate-800 border border-slate-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              🍴 SPPG (Dapur)
            </button>
            <button
              type="button"
              onClick={() => setRole("sekolah")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold transition flex items-center justify-center gap-1 ${
                role === "sekolah"
                  ? "bg-white shadow text-slate-800 border border-slate-200"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
            >
              🎓 Sekolah
            </button>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                {role === "sppg" ? "Nama SPPG" : "Nama Sekolah"}
              </label>
              <input
                type="text"
                value={form.nama}
                onChange={handleChange("nama")}
                placeholder={role === "sppg" ? "Contoh: SPPG Mentari Pagi" : "Contoh: SDN Kelapa Dua 06"}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none placeholder:text-slate-400"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                {role === "sppg" ? "Email Institusi" : "Email Sekolah"}
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder={role === "sppg" ? "admin@sppgmentari.go.id" : "admin@sekolah.ac.id"}
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">Nomor Kontak</label>
              <div className="flex items-center border border-slate-200 rounded-lg bg-slate-50 overflow-hidden">
                <span className="px-3 text-sm text-slate-500 border-r border-slate-200">+62</span>
                <input
                  type="text"
                  value={form.nomor}
                  onChange={handleChange("nomor")}
                  placeholder="812 3456 7890"
                  className="flex-1 px-3 py-2.5 text-sm bg-transparent outline-none placeholder:text-slate-400"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 mb-1 block">
                {role === "sppg" ? "Kode SPPG" : "NPSN Sekolah"}
              </label>
              <input
                type="text"
                value={form.kode}
                onChange={handleChange("kode")}
                placeholder="01234567"
                className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">
              {role === "sppg" ? "Alamat Dapur" : "Alamat Sekolah"}
            </label>
            <textarea
              value={form.alamat}
              onChange={handleChange("alamat")}
              placeholder="Jl. Pahlawan No. 45, Kebayoran Baru, Jakarta Selatan"
              rows={2}
              className="w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none placeholder:text-slate-400 resize-none"
            />
          </div>

          {/* SPPG Dropdown */}
          <div className="mb-1">
            <label className="text-xs font-semibold text-slate-400 mb-1 block">SPPG yang melayani</label>
            <div className="relative">
              <select
                value={form.sppg}
                onChange={handleChange("sppg")}
                disabled={role === "sppg"}
                className={`w-full border border-slate-200 rounded-lg px-3 py-2.5 text-sm bg-slate-50 outline-none appearance-none ${
                  role === "sppg" ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <option value="">Pilih SPPG</option>
                {sppgOptions.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▾</span>
            </div>
            <p className="text-xs text-slate-400 mt-1">Opsi ini hanya berlaku untuk pendaftaran tipe Sekolah.</p>
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Kata Sandi</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 bg-slate-50">
              <span className="text-slate-400 mr-2">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                className="flex-1 py-2.5 text-sm bg-transparent outline-none placeholder:text-slate-400"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-slate-400 text-xs ml-2">
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-slate-600 mb-1 block">Konfirmasi Ulang Kata Sandi</label>
            <div className="flex items-center border border-slate-200 rounded-lg px-3 bg-slate-50">
              <span className="text-slate-400 mr-2">🔒</span>
              <input
                type={showConfirm ? "text" : "password"}
                value={form.konfirmasi}
                onChange={handleChange("konfirmasi")}
                placeholder="••••••••"
                className="flex-1 py-2.5 text-sm bg-transparent outline-none placeholder:text-slate-400"
              />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-slate-400 text-xs ml-2">
                {showConfirm ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-start gap-2 mb-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 accent-blue-600"
            />
            <label htmlFor="agree" className="text-xs text-slate-500 leading-relaxed">
              Saya menyatakan bahwa data yang diberikan adalah benar dan bersedia mengikuti protokol operasional{" "}
              <span className="text-blue-600 font-semibold">SIMBA.</span>
            </label>
          </div>

          {error ? (
            <p className="text-xs text-red-500 font-semibold mb-3">{error}</p>
          ) : null}

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? "Memuat..." : "Daftar →"}
          </button>

          <p className="text-center text-xs text-slate-500 mt-3">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}