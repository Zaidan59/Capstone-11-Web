import { useEffect, useState, useRef } from "react";
import iconSekolah from "../../assets/Icon_sekolah.png";
import iconMap from "../../assets/Icon_map.png";
import logo from "../../assets/Logo.png";
import iconPin from '../../assets/icon.png';
import iconUpload from '../../assets/upload_icon.png';
import iconMenu from '../../assets/IconMenu.png';
import iconUnggah from '../../assets/IconUnggah.png';
import iconCatatan from '../../assets/iconCatatan.png';
import iconUnggahanTerbaru from '../../assets/IconUnggahanTerbaru.png';
import menuDefault from '../../assets/menuDefault.png';
import { getSekolahById } from "../../services/sekolahService";
import IconProfile from "../../assets/Icon_profile.png";

export default function DashboardSekolah() {
  const [sekolah, setSekolah] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUnggahSuccess, setShowUnggahSuccess] = useState(false);
  const [catatan, setCatatan] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    getSekolahById(1).then(res => setSekolah(res.data)).catch(() => {});
  }, []);

  const user = { name: "Sekolah XX" };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedFile(file);
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 2500);
    }
  };

  const handleUnggahFoto = () => {
    if (uploadedFile) {
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 2500);
    } else {
      fileInputRef.current.click();
    }
  };

  const handleUnggahCatatan = () => {
    if (catatan.trim()) {
      setShowUnggahSuccess(true);
      setTimeout(() => setShowUnggahSuccess(false), 2500);
      setCatatan("");
    }
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen flex flex-col">

      {/* Modal Sukses Upload Foto */}
      {showUploadSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center px-16 py-12 border-4 border-green-400 animate-fade-in">
            <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center mb-4">
              <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-500 font-bold text-2xl">Sukses</span>
          </div>
        </div>
      )}

      {/* Modal Sukses Unggah Catatan */}
      {showUnggahSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center px-16 py-12 border-4 border-green-400">
            <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center mb-4">
              <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-green-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-green-500 font-bold text-2xl">Sukses</span>
          </div>
        </div>
      )}

      {/* NAVBAR */}
            <nav className="sticky top-0 z-40 bg-white shadow w-full">
              <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[52px]">
                <div className="flex items-center gap-2.5">
                  <img src={logo} alt="SIMBA Logo" className="w-9 h-9" />
                  <span className="font-bold text-[20px] text-[#1a2233] tracking-wide">SIMBA</span>
                </div>
                <div className="flex items-center gap-[18px]">
                  <button className="relative">
                    <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-700">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
                  </button>
                  <span className="font-medium text-[14px] text-gray-700">{user.name}</span>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center cursor-pointer overflow-hidden">
                    <img src={IconProfile} alt="Profile" className="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
            </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 w-full">
        <div className="max-w-6xl mx-auto py-8 px-6">

          {/* Header */}
          <div className="mb-6">
            <h1 className="font-bold text-[32px] md:text-[36px]">Dashboard Operasional Sekolah</h1>
            <p className="text-sm text-[#0F172A] mt-1 flex items-center gap-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
              Senin, 25 Mei 2026
            </p>
          </div>

          {/* Card Sekolah */}
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-[#EEF6FF] flex items-center justify-center flex-shrink-0">
                <img src={iconSekolah} alt="Ikon Sekolah" className="w-14 h-14 md:w-16 md:h-16 object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-lg text-slate-900 truncate">
                      {sekolah ? sekolah.nama : "SMP Negeri 115 Jakarta"}
                    </div>
                    <span className="inline-flex items-center gap-2 mt-2 rounded-full bg-green-100 text-green-700 text-xs px-3 py-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      Operational Aktif
                    </span>
                  </div>
                  <button className="hidden sm:inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white shadow-md flex-shrink-0">
                    <img src={iconPin} alt="Map" className="w-6 h-6 brightness-0 invert" />
                  </button>
                </div>
                <div className="mt-4 text-sm text-slate-500 flex items-start gap-2">
                  <img src={iconMap} alt="Alamat" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="leading-5">
                    {sekolah ? sekolah.alamat : "Jl. KH Abdullah Syafiei No. 8, RT 8/RW 2, Bukit Duri, Kec. Tebet, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12840"}
                  </span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <span className="text-blue-600">Affiliated Kitchen:</span>
                  <span>{sekolah ? sekolah.affiliatedKitchen || "SPPG Tebet Barat" : "SPPG Tebet Barat"}</span>
                </div>
              </div>
              <button className="inline-flex sm:hidden items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 transition-colors text-white shadow-md">
                <img src={iconPin} alt="Map" className="w-6 h-6 brightness-0 invert" />
              </button>
            </div>
          </div>

        {/* Menu Hari Ini */}
        <div className="p-1 mb-1">
          <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-slate-800">
            <img 
              src={iconMenu} 
              alt="Menu Icon" 
              className="w-5 h-5 object-contain" 
            />
            Menu Hari Ini
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Sisi Kiri: Gambar Full Height */}
            <div className="md:w-1/3 lg:w-1/4 h-52 md:h-auto overflow-hidden">
              <img 
                src={menuDefault} 
                alt="menu" 
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Sisi Kanan: Detail Konten */}
            <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
              <div className="mb-6">
                <div className="text-[11px] md:text-xs text-blue-600 font-extrabold mb-2 tracking-widest uppercase">
                  Makanan Utama
                </div>
                <h3 className="font-bold text-2xl md:text-3xl text-slate-900 mb-2">
                  Nasi Goreng + Ayam Goreng
                </h3>
                <p className="text-slate-500 text-sm md:text-base font-medium">
                  Tahu, Buah Pisang, Susu Kemasan
                </p>
              </div>

              {/* Garis Pemisah & Info Nutrisi */}
              <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 bg-[#F0F7FF] border border-blue-100 rounded-xl py-4 px-6 text-center">
                  <div className="text-blue-600 font-extrabold text-2xl">540</div>
                  <div className="text-[13px] text-slate-500 font-medium">Calories (kcal)</div>
                </div>
                
                <div className="flex-1 bg-[#F0F7FF] border border-blue-100 rounded-xl py-4 px-6 text-center">
                  <div className="text-blue-600 font-extrabold text-2xl">25g</div>
                  <div className="text-[13px] text-slate-500 font-medium">Protein</div>
                </div>
              </div>
            </div>
          </div>
        </div>

          {/* Unggah Dokumentasi Menu */}
          <div className="mb-8">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-strong">
              <img 
                src={iconUnggah} 
                alt="Ikon Unggahan" 
                className="w-5 h-5 object-contain" 
              />
              Unggahan Terbaru
            </h2>
          </div>
          {/* Tombol Unggah Foto */}

         <div className="bg-white rounded-xl shadow p-6 mb-6">
            {/* Input file hidden */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            {/* Drop zone - klik buka file manager */}
           <div
              onClick={() => fileInputRef.current.click()}
              className="border-2 border-dashed border-blue-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[150px] mb-4 bg-blue-50/30 cursor-pointer hover:bg-blue-100/40 hover:border-blue-400 transition-all"
            >
              <img src={iconUpload} alt="Upload" className="w-12 h-12 mb-3 opacity-40" />
              {uploadedFile ? (
                <span className="text-blue-600 font-medium text-sm">{uploadedFile.name}</span>
              ) : (
                <span className="text-slate-500 text-center text-sm">
                  Seret dan lepas foto makanan di sini<br />atau klik untuk menjelajahi perangkat
                </span>
              )}
            </div>

            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <input type="text" className="w-full border rounded-lg px-3 py-2 text-sm" placeholder="cth: Pembagian makanan untuk siswa kelas 3" />
            </div>

          {/* Tombol Unggah Foto */}
            <button
              onClick={handleUnggahFoto}
              className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 text-white py-3 rounded-lg font-semibold text-base mt-1 transition-all border border-transparent flex items-center justify-center gap-2"
            >
              {/* Menggunakan SVG untuk ikon upload yang sesuai gambar kedua */}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="flex-shrink-0"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>Unggah Foto</span>
            </button>
          </div>

          {/* Catatan Pengiriman & Menu */}
            <div className="p-1 mb-1">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-strong">
               <img 
                src={iconCatatan} 
                alt="Ikon Unggahan" 
                className="w-5 h-5 object-contain" 
              />
              Catatan Pengiriman & Menu
            </h2>
            </div>
            <div className="bg-white rounded-xl shadow p-6 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Saran dan Kritik</label>
            <textarea
              rows={4}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 resize-none"
              placeholder="cth: Menu diterima tepat waktu, makanan datang terlambat 10 menit..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleUnggahCatatan}
                className="bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 text-white px-10 py-2.5 rounded-lg font-semibold text-base transition-all border border-transparent"
              >
                Unggah
              </button>
            </div>
          </div>

          {/* Unggahan Terbaru */}
          
          <div className="mb-8">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-strong">
               <img 
                src={iconUnggahanTerbaru} 
                alt="Ikon Unggahan" 
                className="w-5 h-5 object-contain" 
              />
              Unggahan Terbaru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { src: "", label: "Makanan Telah Diterima", time: "10:30 AM · Today" },
                { src: "", label: "Sesi Makan Kelas 4", time: "11:45 AM · 22 Mei" },
                { src: "", label: "Verifikasi Bahan", time: "09:15 AM · 22 Mei" },
              ].map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
                  <img src={item.src} alt={item.label} className="w-full h-40 object-cover rounded-lg mb-3" />
                  <div className="font-semibold text-sm">{item.label}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{item.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIMBA Logo" className="w-9 h-9" />
            <span className="font-bold text-[20px] text-[#1a2233] tracking-wide">SIMBA</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:underline">Pusat Dukungan</a>
            <a href="#" className="hover:underline">Pedoman Kebijakan</a>
            <a href="#" className="hover:underline">Privasi</a>
          </div>
        </div>
      </footer>

    </div>
  );
}