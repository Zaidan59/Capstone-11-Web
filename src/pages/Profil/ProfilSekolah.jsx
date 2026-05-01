import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import Footer from '../../components/common/Footer';
import arrowBack from '../../assets/Vector_arrow.png';
import iconPeople from '../../assets/icon_people.png';
import iconTanggal from '../../assets/iconTanggal.png';
import dokumMenu from '../../assets/dokumMenu.png';
import catatanIcon from '../../assets/catatanIcon.png';
import DefaultSekolah from '../../assets/defaultSekolah.png';
import dokumMenu1 from '../../assets/dokumDefault1.png'; 
import dokumMenu2 from '../../assets/dokumDefault2.png';
import dokumMenu3 from '../../assets/dokumDefault3.png';
// ─────────────────────────────────────────────
// DEFAULT DATA (fallback jika API gagal)
// ─────────────────────────────────────────────
const DEFAULT_SEKOLAH = {
  nama: 'SMP Negeri 12 Jakarta',
  foto: DefaultSekolah,
  status: 'Operasional Aktif',
  alamat: 'Jl. Wijaya IX No.50 2, RT.2/RW.5, Melawai, Kec. Kby. Baru, Kota Jakarta Selatan, Daerah Khusus Ibukota Jakarta 12160',
  npsn: '4500',
  siswa: 450,
};

const DEFAULT_SPPG = {
  nama: 'SPPG Kebayoran Baru',
  alamat: 'Jl. Melawai Raya No.12, Kebayoran Baru, Jakarta Selatan',
  kapasitas: 1000,
};

const DEFAULT_MENU_HARIAN = [
  {
    hari: 'Senin, 25 Mei',
    isToday: true,
    menu: ['Nasi Goreng', 'Ayam Goreng', 'Tahu', 'Buah Pisang'],
  },
  {
    hari: 'Selasa, 26 Mei',
    isToday: false,
    menu: ['Nasi Merah', 'Ikan Bakar Bumbu Kuning', 'Tumis Buncis Wortel', 'Buah Pepaya'],
  },
];

const DEFAULT_DOKUMENTASI = [
  {
    foto: dokumMenu1,
    caption: 'Menu Diterima Jam 10:00 WIB',
  },
  {
    foto: dokumMenu2,
    caption: 'Quality Check Jam 09:45 WIB',
  },
  {
    foto: dokumMenu3,
    caption: 'Pengecekan Menu Jam 09:00 WIB',
  },
];

const DEFAULT_NUTRISI = [
  { lbl: 'KALORI', val: '650', unit: 'kcal' },
  { lbl: 'PROTEIN', val: '28g', unit: 'g' },
  { lbl: 'KARBOHIDRAT', val: '85g', unit: 'g' },
  { lbl: 'LEMAK', val: '18g', unit: 'g' },
];

const DEFAULT_CATATAN = [
  {
    type: 'success',
    judul: 'Menu diterima sesuai jadwal',
    meta: 'Hari ini, pukul 10:00 WIB - Kepala Sekolah',
    kutipan: null,
  },
  {
    type: 'warning',
    judul: 'Masalah kemasan ditemukan',
    meta: 'Kemarin, 10:30 WIB - Administrasi Sekolah',
    kutipan: 'Beberapa tutup wadah longgar saat pengiriman, pihak dapur telah diberitahu.',
  },
];

// ─────────────────────────────────────────────
// KOMPONEN UTAMA
// ─────────────────────────────────────────────
export default function ProfilSekolah() {
  const idSekolah = 1;

  const [sekolah, setSekolah]         = useState(null);
  const [sppg, setSppg]               = useState(null);
  const [menuHarian, setMenuHarian]   = useState([]);
  const [dokumentasi, setDokumentasi] = useState([]);
  const [nutrisi, setNutrisi]         = useState([]);
  const [catatan, setCatatan]         = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [resSekolah, resSppg, resMenu, resDokumentasi, resNutrisi, resCatatan] =
          await Promise.allSettled([
            fetch(`/api/sekolah/${idSekolah}`).then(r => r.json()),
            fetch(`/api/sekolah/${idSekolah}/sppg`).then(r => r.json()),
            fetch(`/api/sekolah/${idSekolah}/menu-harian`).then(r => r.json()),
            fetch(`/api/sekolah/${idSekolah}/dokumentasi`).then(r => r.json()),
            fetch(`/api/sekolah/${idSekolah}/nutrisi`).then(r => r.json()),
            fetch(`/api/sekolah/${idSekolah}/catatan`).then(r => r.json()),
          ]);

        setSekolah(resSekolah.status         === 'fulfilled' ? resSekolah.value         : DEFAULT_SEKOLAH);
        setSppg(resSppg.status               === 'fulfilled' ? resSppg.value            : DEFAULT_SPPG);
        setMenuHarian(resMenu.status         === 'fulfilled' ? resMenu.value            : DEFAULT_MENU_HARIAN);
        setDokumentasi(resDokumentasi.status === 'fulfilled' ? resDokumentasi.value     : DEFAULT_DOKUMENTASI);
        setNutrisi(resNutrisi.status         === 'fulfilled' ? resNutrisi.value         : DEFAULT_NUTRISI);
        setCatatan(resCatatan.status         === 'fulfilled' ? resCatatan.value         : DEFAULT_CATATAN);
      } catch {
        setSekolah(DEFAULT_SEKOLAH);
        setSppg(DEFAULT_SPPG);
        setMenuHarian(DEFAULT_MENU_HARIAN);
        setDokumentasi(DEFAULT_DOKUMENTASI);
        setNutrisi(DEFAULT_NUTRISI);
        setCatatan(DEFAULT_CATATAN);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [idSekolah]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 w-full max-w-5xl mx-auto py-5 px-4">

        {/* Tombol Kembali */}
        <button className="flex items-center gap-2 text-[20px] font-bold text-gray-800 mb-4 hover:opacity-70">
          <img src={arrowBack} alt="" className="w-3.5 h-3.5 flex-shrink-0" />
          Kembali
        </button>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400">Loading...</div>
        ) : sekolah ? (
          <div className="space-y-3">

            {/* ── Header Sekolah ── */}
            <div className="bg-white rounded-2xl px-8 py-8 flex items-center gap-6">
              <img
                src={sekolah.foto || ''}
                alt={sekolah.nama}
                className="w-36 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-[30px] font-bold text-gray-900">{sekolah.nama}</h2>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[14px] font-medium px-3 py-1 rounded-full border border-green-200">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4" stroke="#16a34a" strokeWidth="1.5" />
                      <polyline points="3,5 4.2,6.2 7,3.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {sekolah.status}
                  </span>
                </div>
                <p className="text-[13.5px] text-gray-500 flex items-start gap-1 mb-1">
                  <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" />
                    <circle cx="8" cy="6" r="1.5" />
                  </svg>
                  {sekolah.alamat}
                </p>
                <p className="text-[13.5px] text-gray-500 flex items-center gap-1.5">
                  <img src={iconPeople} alt="" className="w-3.5 h-3 flex-shrink-0" />
                  {sekolah.siswa} Siswa Terdaftar
                </p>
              </div>
            </div>

            {/* ── Grid Utama: Konten Kiri | Sidebar Kanan ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-3 items-start">

              {/* ── KOLOM KIRI ── */}
              <div className="flex flex-col gap-3">

                {/* Menu Harian */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-2">
                    <img src={iconTanggal} alt="" className="h-5 w-5" />
                    Menu Harian
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {menuHarian.map((item, index) => (
                      <div key={index} className="bg-white border border-gray-100 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-semibold text-gray-800">{item.hari}</span>
                          {item.isToday && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Today</span>
                          )}
                        </div>
                        <ul className="space-y-1.5">
                          {item.menu.map((m, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                              {m}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>

                        {/* Dokumentasi Menu */}
                <div className="rounded-2xl p-5">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <img src={dokumMenu} alt="" />
                    Dokumentasi Menu
                  </h3>
                  <div className="grid grid-cols-3 gap-2">
                    {dokumentasi.map((doc, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3]">
                        <img
                          // Properti .foto ini mengambil gambar dari array DEFAULT_DOKUMENTASI
                          src={doc.foto} 
                          alt={doc.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1.5 py-1 leading-tight">
                          {doc.caption}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Catatan & Histori */}
                <div className="rounded-2xl p-5">
                  <h3 className="text-[20px] font-bold text-gray-900 flex items-center gap-2 mb-3">
                    <img src={catatanIcon} alt="" />
                    Catatan Sekolah &amp; Histori
                  </h3>
                  <div className="space-y-2">
                    {catatan.map((c, i) => (
                      <div key={i} className="border border-gray-100 bg-white rounded-xl p-3.5 flex items-start gap-3">
                        {c.type === 'success' ? (
                          <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#16a34a" strokeWidth="2">
                              <polyline points="2,6 5,9 10,3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="#d97706" strokeWidth="1.8">
                              <path d="M6 1.5L11 10.5H1L6 1.5z" strokeLinejoin="round" />
                              <line x1="6" y1="5" x2="6" y2="7.5" strokeLinecap="round" />
                              <circle cx="6" cy="9" r="0.5" fill="#d97706" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="text-[14px] font-bold text-gray-800">{c.judul}</p>
                          <p className="text-[14px] text-gray-400 mt-0.5">{c.meta}</p>
                          {c.kutipan && (
                            <p className="text-[12px] text-gray-500 mt-1.5">"{c.kutipan}"</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* ── KOLOM KANAN (SIDEBAR) ── */}
              <div className="flex flex-col gap-3">

                {/* SPPG Bersangkutan */}
                {sppg && (
                  <div>
                    <p className="text-base font-bold text-gray-700 mb-2">SPPG Bersangkutan</p>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Penyedia Layanan</p>
                      <p className="text-[18px] font-bold text-blue-900 mb-1">{sppg.nama}</p>
                      <p className="text-[13px] text-blue-700 mb-3 leading-relaxed">{sppg.alamat}</p>
                      <p className="text-[13px] text-blue-700 flex items-center gap-1.5 mb-3">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="5" width="14" height="8" rx="2" />
                          <path d="M4 5V4a4 4 0 0 1 8 0v1" />
                        </svg>
                        Kapasitas : {sppg.kapasitas} porsi/hari
                      </p>
                      <button className="w-full bg-blue-600 hover:bg-blue-700 active:scale-95 transition-all text-white text-sm font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2">
                        Lihat Profil SPPG
                        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 7h10M8 3l4 4-4 4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}

                {/* Informasi Nutrisi */}
                <div className="rounded-2xl p-4">
                  <p className="text-[15px] font-bold text-gray-900 mb-3">Informasi Nutrisi (per makanan)</p>
                  <div className="bg-white grid grid-cols-2 gap-2">
                    {nutrisi.map((n) => (
                      <div key={n.lbl} className="border border-gray-100 rounded-xl p-3 text-center">
                        <p className="text-[10px] font-semibold text-gray-400 mb-1 tracking-wide">{n.lbl}</p>
                        <p className="text-xl font-bold text-blue-500 leading-none">{n.val}</p>
                        <p className="text-[10px] text-gray-400 mt-1">{n.unit}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Info Transparansi */}
                <div className="bg-gray-900 rounded-2xl p-4">
                  <p className="text-sm font-semibold text-white mb-2">Info Transparansi</p>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Semua data yang disajikan diperbarui secara real-time oleh staf dapur dan diverifikasi oleh administrasi sekolah setiap hari pada saat pengiriman, waktu.
                  </p>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                    <span className="text-xs text-gray-500">Terakhir Disinkronkan</span>
                    <span className="text-xs font-semibold text-gray-400">5 MENIT LALU</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-500">Data sekolah tidak ditemukan.</div>
        )}
      </main>

      <Footer />
    </div>
  );
}
