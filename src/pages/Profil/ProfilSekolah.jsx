import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import arrowBack from '../../assets/Vector_arrow.png';
import iconPeople from '../../assets/icon_people.png';
import iconTanggal from '../../assets/iconTanggal.png';
import dokumMenu from '../../assets/dokumMenu.png';
import catatanIcon from '../../assets/catatanIcon.png';
import { getDisplayValue } from '../../utils/display';
import { resolveImageUrl } from '../../utils/imageUrl';
import { useAuth } from '../../hooks/useAuth';
import {
  getSekolahById,
  getSekolahCatatan,
  getSekolahDokumentasi,
  getSekolahMenuHarian,
  getSekolahNutrisi,
  getSekolahSppg,
} from '../../services/sekolahService';

const STORAGE_KEY_DOCS  = 'simba_dokumentasi';
const STORAGE_KEY_NOTES = 'simba_catatan';

const DEFAULT_SEKOLAH = {
  nama: '-',
  foto: null,
  status: '-',
  alamat: '-',
  npsn: '-',
  siswa: '-',
};

const DEFAULT_SPPG = {
  nama: '-',
  alamat: '-',
  kapasitas: '-',
};

const DEFAULT_MENU_HARIAN = [
  {
    hari: '-',
    isToday: false,
    menu: ['-'],
  },
  {
    hari: 'Selasa, 26 Mei',
    isToday: false,
    menu: ['Nasi Merah', 'Ikan Bakar Bumbu Kuning', 'Tumis Buncis Wortel', 'Buah Pepaya'],
  },
];

const DEFAULT_DOKUMENTASI = [
  { foto: null, fotoUrl: null, caption: '-' },
];

const DEFAULT_NUTRISI = [
  { lbl: 'KALORI',      val: '-', unit: '' },
  { lbl: 'PROTEIN',     val: '-', unit: '' },
  { lbl: 'KARBOHIDRAT', val: '-', unit: '' },
  { lbl: 'LEMAK',       val: '-', unit: '' },
];

const DEFAULT_CATATAN = [];

function ImageBox({ src, alt, className }) {
  const imageUrl = resolveImageUrl(src);

  if (!imageUrl) {
    return (
      <div className={`flex items-center justify-center bg-slate-100 text-xs font-bold text-slate-400 ${className}`}>
        -
      </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} />;
}

export default function ProfilSekolah() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const idSekolah = id || user?.sekolahId || user?.schoolId || user?.id || null;
  const hasSekolahId = Boolean(idSekolah);

  const [sekolah, setSekolah] = useState(hasSekolahId ? null : DEFAULT_SEKOLAH);
  const [sppg, setSppg] = useState(hasSekolahId ? null : DEFAULT_SPPG);
  const [menuHarian, setMenuHarian] = useState(hasSekolahId ? [] : DEFAULT_MENU_HARIAN);
  const [dokumentasi, setDokumentasi] = useState(hasSekolahId ? [] : DEFAULT_DOKUMENTASI);
  const [nutrisi, setNutrisi] = useState(hasSekolahId ? [] : DEFAULT_NUTRISI);
  const [catatan, setCatatan] = useState(hasSekolahId ? [] : DEFAULT_CATATAN);
  const [loading, setLoading] = useState(hasSekolahId);

  useEffect(() => {
    if (!idSekolah) return;

    const fetchAll = async () => {
      try {
        const [resSekolah, resSppg, resMenu, resDokumentasi, resNutrisi, resCatatan] =
          await Promise.allSettled([
            getSekolahById(idSekolah),
            getSekolahSppg(idSekolah),
            getSekolahMenuHarian(idSekolah),
            getSekolahDokumentasi(idSekolah),
            getSekolahNutrisi(idSekolah),
            getSekolahCatatan(idSekolah),
          ]);

        setSekolah(
          resSekolah.status === 'fulfilled'
            ? (resSekolah.value?.data?.data ?? resSekolah.value?.data ?? DEFAULT_SEKOLAH)
            : DEFAULT_SEKOLAH,
        );
        setSppg(
          resSppg.status === 'fulfilled'
            ? (resSppg.value?.data?.data ?? resSppg.value?.data ?? DEFAULT_SPPG)
            : DEFAULT_SPPG,
        );
        setMenuHarian(
          resMenu.status === 'fulfilled'
            ? (resMenu.value?.data?.data ?? resMenu.value?.data ?? DEFAULT_MENU_HARIAN)
            : DEFAULT_MENU_HARIAN,
        );
        setNutrisi(
          resNutrisi.status === 'fulfilled'
            ? (resNutrisi.value?.data?.data ?? resNutrisi.value?.data ?? DEFAULT_NUTRISI)
            : DEFAULT_NUTRISI,
        );

        // ── Dokumentasi: gabung localStorage di depan, max 3 tampil ──
        const baseDokum = resDokumentasi.status === 'fulfilled'
          ? (resDokumentasi.value?.data?.data ?? resDokumentasi.value?.data ?? DEFAULT_DOKUMENTASI)
          : DEFAULT_DOKUMENTASI;
        const savedDocs = localStorage.getItem(STORAGE_KEY_DOCS);
        if (savedDocs) {
          const parsed = JSON.parse(savedDocs);
          // Ambil hanya 3 terbaru dari localStorage, sisanya dari default
          const merged = [...parsed.slice(0, 3)];
          setDokumentasi(merged);
        } else {
          setDokumentasi(baseDokum);
        }

        // ── Catatan: gabung localStorage di depan ──
        const baseCatatan = resCatatan.status === 'fulfilled'
          ? (resCatatan.value?.data?.data ?? resCatatan.value?.data ?? DEFAULT_CATATAN)
          : DEFAULT_CATATAN;
        const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
        if (savedNotes) {
          const parsed = JSON.parse(savedNotes);
          setCatatan([...parsed, ...baseCatatan]);
        } else {
          setCatatan(baseCatatan);
        }

      } catch {
        setSekolah(DEFAULT_SEKOLAH);
        setSppg(DEFAULT_SPPG);
        setMenuHarian(DEFAULT_MENU_HARIAN);
        setNutrisi(DEFAULT_NUTRISI);

        const savedDocs = localStorage.getItem(STORAGE_KEY_DOCS);
        if (savedDocs) {
          setDokumentasi(JSON.parse(savedDocs).slice(0, 3));
        } else {
          setDokumentasi(DEFAULT_DOKUMENTASI);
        }

        const savedNotes = localStorage.getItem(STORAGE_KEY_NOTES);
        if (savedNotes) {
          setCatatan([...JSON.parse(savedNotes), ...DEFAULT_CATATAN]);
        } else {
          setCatatan(DEFAULT_CATATAN);
        }
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
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[20px] font-bold text-gray-800 mb-4 hover:opacity-70">
          <img src={arrowBack} alt="" className="w-3.5 h-3.5 flex-shrink-0" />
          Kembali
        </button>

        {loading ? (
          <div className="bg-white rounded-2xl p-6 text-center text-gray-400">Loading...</div>
        ) : sekolah ? (
          <div className="space-y-3">

            {/* ── Header Sekolah ── */}
            <div className="bg-white rounded-2xl px-8 py-8 flex items-center gap-6">
              <ImageBox
                src={sekolah.foto}
                alt={sekolah.nama}
                className="w-36 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap mb-2">
                  <h2 className="text-[30px] font-bold text-gray-900">{getDisplayValue(sekolah.nama)}</h2>
                  <span className="inline-flex items-center gap-1.5 bg-green-50 text-green-700 text-[14px] font-medium px-3 py-1 rounded-full border border-green-200">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <circle cx="5" cy="5" r="4" stroke="#16a34a" strokeWidth="1.5" />
                      <polyline points="3,5 4.2,6.2 7,3.5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {getDisplayValue(sekolah.status)}
                  </span>
                </div>
                <p className="text-[13.5px] text-gray-500 flex items-start gap-1 mb-1">
                  <svg className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-gray-400" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M8 2C5.8 2 4 3.8 4 6c0 3.5 4 8 4 8s4-4.5 4-8c0-2.2-1.8-4-4-4z" />
                    <circle cx="8" cy="6" r="1.5" />
                  </svg>
                  {getDisplayValue(sekolah.alamat)}
                </p>
                <p className="text-[13.5px] text-gray-500 flex items-center gap-1.5">
                  <img src={iconPeople} alt="" className="w-3.5 h-3 flex-shrink-0" />
                  {getDisplayValue(sekolah.siswa)} Siswa Terdaftar
                </p>
              </div>
            </div>

            {/* ── Grid Utama ── */}
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
                          <span className="text-sm font-semibold text-gray-800">{getDisplayValue(item.hari)}</span>
                          {item.isToday && (
                            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">Today</span>
                          )}
                        </div>
                        <ul className="space-y-1.5">
                          {item.menu.map((m, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                              {getDisplayValue(m)}
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
                    {dokumentasi.slice(0, 3).map((doc, i) => (
                      <div key={i} className="relative rounded-xl overflow-hidden aspect-[4/3]">
                        <ImageBox
                          src={doc.fotoUrl || doc.foto}
                          alt={doc.caption}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] px-1.5 py-1 leading-tight">
                          {getDisplayValue(doc.caption)}
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

                {sppg && (
                  <div>
                    <p className="text-base font-bold text-gray-700 mb-2">SPPG Bersangkutan</p>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <p className="text-[10px] font-bold text-blue-500 uppercase tracking-wider mb-1">Penyedia Layanan</p>
                      <p className="text-[18px] font-bold text-blue-900 mb-1">{getDisplayValue(sppg.nama)}</p>
                      <p className="text-[13px] text-blue-700 mb-3 leading-relaxed">{getDisplayValue(sppg.alamat)}</p>
                      <p className="text-[13px] text-blue-700 flex items-center gap-1.5 mb-3">
                        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="1" y="5" width="14" height="8" rx="2" />
                          <path d="M4 5V4a4 4 0 0 1 8 0v1" />
                        </svg>
                        Kapasitas : {getDisplayValue(sppg.kapasitas)} porsi/hari
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
    </div>
  );
}
