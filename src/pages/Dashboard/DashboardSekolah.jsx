import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import iconSekolah from "../../assets/Icon_sekolah.png";
import iconMap from "../../assets/Icon_map.png";
import logo from "../../assets/Logo.png";
import iconUpload from "../../assets/upload_icon.png";
import iconMenu from "../../assets/IconMenu.png";
import iconUnggah from "../../assets/IconUnggah.png";
import iconCatatan from "../../assets/iconCatatan.png";
import iconUnggahanTerbaru from "../../assets/IconUnggahanTerbaru.png";
import iconProfile from "../../assets/icon_profile.png";
import { uploadImage } from "../../services/mediaService";
import {
  createSekolahCatatan,
  createSekolahDokumentasi,
  getAllSekolah,
  getSekolahById,
  getSekolahDokumentasi,
} from "../../services/sekolahService";
import { useAuth } from "../../hooks/useAuth";
import { getDisplayValue } from "../../utils/display";
import { resolveImageUrl } from "../../utils/imageUrl";

const DEFAULT_DOCS = Array.from({ length: 3 }, () => ({
  foto: null,
  fotoUrl: null,
  caption: "-",
  time: "-",
}));

function getImageSource(raw) {
  return (
    raw?.foto ??
    raw?.photoUrl ??
    raw?.photo_url ??
    raw?.imageUrl ??
    raw?.image_url ??
    raw?.logoUrl ??
    raw?.logo_url ??
    raw?.avatarUrl ??
    raw?.avatar_url ??
    raw?.profilePhotoUrl ??
    raw?.profile_photo_url ??
    raw?.image ??
    raw?.gambar ??
    null
  );
}

function ImageBox({ src, alt, className, fallbackSrc = null }) {
  const imageUrl = resolveImageUrl(src);
  const resolvedSrc = imageUrl || fallbackSrc;

  if (!resolvedSrc) {
    return (
      <div className={`flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-400 ${className}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 5h16a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="9" cy="10" r="1.5" fill="currentColor" />
          <path d="m4 16 4.5-4.5a1 1 0 0 1 1.4 0L13 14.6l1.6-1.6a1 1 0 0 1 1.4 0L20 16.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[11px] font-semibold">Belum ada gambar</span>
      </div>
    );
  }

  return <img src={resolvedSrc} alt={alt} className={className} />;
}

function getNowLabel() {
  const now = new Date();
  return `${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB - Hari ini`;
}

function normalizeSekolahData(raw) {
  if (!raw) return null;
  return {
    ...raw,
    nama: raw?.nama ?? raw?.schoolName ?? "-",
    foto: getImageSource(raw),
    alamat: raw?.alamat ?? raw?.address ?? "-",
    affiliatedKitchen: raw?.affiliatedKitchen ?? raw?.sppgName ?? raw?.sppg?.name ?? "-",
    menuImage: raw?.menuImage ?? raw?.menu_image_url ?? null,
    menuMain: raw?.menuMain ?? raw?.mainDish ?? raw?.menu?.mainDish ?? "-",
    menuSide: raw?.menuSide ?? raw?.sideDish ?? raw?.menu?.sideDish ?? "-",
    menuCalories: raw?.menuCalories ?? raw?.calories ?? raw?.menu?.calories ?? "-",
    menuProtein: raw?.menuProtein ?? raw?.protein ?? raw?.menu?.protein ?? "-",
  };
}

function getLatestDocumentationImage(items) {
  if (!Array.isArray(items) || items.length === 0) return null;
  const latest = items[0];
  return latest?.fotoUrl ?? latest?.foto ?? latest?.photoUrl ?? latest?.photo_url ?? null;
}

export default function DashboardSekolah() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const resolvedSekolahId = user?.sekolahId || user?.schoolId || null;

  const [sekolah, setSekolah] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
  const [keterangan, setKeterangan] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [showUploadSuccess, setShowUploadSuccess] = useState(false);
  const [showUnggahSuccess, setShowUnggahSuccess] = useState(false);
  const [showStorageError, setShowStorageError] = useState(false);
  const [showProfileOverlay, setShowProfileOverlay] = useState(false);
  const [catatan, setCatatan] = useState("");
  const [recentDocs, setRecentDocs] = useState(DEFAULT_DOCS);

  const fileInputRef = useRef(null);

  const loadSekolahDashboard = async (id) => {
    if (!id) {
      setSekolah(null);
      return;
    }

    Promise.allSettled([getSekolahById(id), getSekolahDokumentasi(id)])
      .then(async ([sekolahRes, dokumentasiRes]) => {
        const sekolahPayload =
          sekolahRes.status === "fulfilled"
            ? sekolahRes.value?.data?.data ?? sekolahRes.value?.data ?? null
            : null;
        const dokumentasiItems =
          dokumentasiRes.status === "fulfilled"
            ? dokumentasiRes.value?.data?.data ?? dokumentasiRes.value?.data ?? []
            : [];

        if (sekolahPayload) {
          const normalized = normalizeSekolahData(sekolahPayload);
          const latestDocImage = getLatestDocumentationImage(dokumentasiItems);
          setSekolah({
            ...normalized,
            menuImage: latestDocImage ?? normalized?.menuImage ?? null,
          });
          return;
        }

        throw new Error("Sekolah payload tidak ditemukan");
      })
      .catch(async () => {
        try {
          const [allSekolahRes, dokumentasiRes] = await Promise.allSettled([
            getAllSekolah(),
            getSekolahDokumentasi(id),
          ]);

          const items =
            allSekolahRes.status === "fulfilled"
              ? Array.isArray(allSekolahRes.value?.data?.data)
                ? allSekolahRes.value.data.data
                : []
              : [];
          const matched =
            items.find((item) => item?.id === id || item?.userId === user?.id) ?? null;
          const normalized = normalizeSekolahData(matched);
          const dokumentasiItems =
            dokumentasiRes.status === "fulfilled"
              ? dokumentasiRes.value?.data?.data ?? dokumentasiRes.value?.data ?? []
              : [];
          const latestDocImage = getLatestDocumentationImage(dokumentasiItems);

          setSekolah(
            normalized
              ? {
                  ...normalized,
                  menuImage: latestDocImage ?? normalized?.menuImage ?? null,
                }
              : null,
          );
        } catch {
          setSekolah(null);
        }
      });
  };

  useEffect(() => {
    if (!resolvedSekolahId) return;
    Promise.resolve().then(() => loadSekolahDashboard(resolvedSekolahId));
  }, [resolvedSekolahId, user?.id]);

  useEffect(() => {
    return () => {
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    };
  }, [uploadedFileUrl]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
    const objectUrl = URL.createObjectURL(file);

    setUploadedFile(file);
    setUploadedFileUrl(objectUrl);
  };

  const handleUnggahFoto = async () => {
    if (!uploadedFile) {
      fileInputRef.current?.click();
      return;
    }

    setIsUploading(true);

    try {
      const uploaded = await uploadImage(uploadedFile, {
        folder: `simba/sekolah/${resolvedSekolahId || "unknown"}`,
      });

      const caption = keterangan || uploadedFile.name;

      await createSekolahDokumentasi(resolvedSekolahId, {
        caption,
        photoUrl: uploaded.url,
        photoPublicId: uploaded.publicId,
        source: "cloudinary",
      });

      setRecentDocs((prev) =>
        [
          { foto: null, fotoUrl: uploaded.url, caption, time: getNowLabel() },
          ...prev,
        ].slice(0, 3),
      );
      await loadSekolahDashboard(resolvedSekolahId);
      setShowUploadSuccess(true);
      setTimeout(() => setShowUploadSuccess(false), 2500);
    } catch {
      setShowStorageError(true);
      setTimeout(() => setShowStorageError(false), 3000);
    } finally {
      setIsUploading(false);
      if (uploadedFileUrl) URL.revokeObjectURL(uploadedFileUrl);
      setUploadedFile(null);
      setUploadedFileUrl(null);
      setKeterangan("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUnggahCatatan = async () => {
    const trimmed = catatan.trim();
    if (!trimmed) return;

    setIsSubmittingNote(true);

    const notePayload = {
      type: "success",
      judul: trimmed,
      meta: `Hari ini, pukul ${new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      })} WIB - Admin Sekolah`,
      kutipan: null,
    };

    let isSuccess = false;
    try {
      await createSekolahCatatan(resolvedSekolahId, {
        title: notePayload.judul,
        message: notePayload.meta,
        type: notePayload.type,
      });
      isSuccess = true;
    } catch {
      setShowStorageError(true);
      setTimeout(() => setShowStorageError(false), 3000);
    } finally {
      setIsSubmittingNote(false);
      if (isSuccess) {
        setShowUnggahSuccess(true);
        setTimeout(() => setShowUnggahSuccess(false), 2500);
        setCatatan("");
      }
    }
  };

  const displayName = user?.name || user?.identifier || "Pengguna Sekolah";
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    [],
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-[#F3F4F6] min-h-screen flex flex-col">
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

      {showStorageError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center px-16 py-12 border-4 border-red-400">
            <div className="w-20 h-20 rounded-full border-4 border-red-400 flex items-center justify-center mb-4">
              <svg width="44" height="44" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <span className="text-red-500 font-bold text-2xl">Penyimpanan Penuh</span>
            <span className="text-slate-500 text-sm mt-2 text-center">Hapus beberapa foto lama lalu coba lagi.</span>
          </div>
        </div>
      )}

      <nav className="sticky top-0 z-40 bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[52px]">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIMBA Logo" className="w-9 h-9" />
            <span className="font-bold text-[20px] text-[#1a2233] tracking-wide">SIMBA</span>
          </div>
          <div className="flex items-center gap-[18px]">
            <button className="relative" onClick={() => navigate("/notification/sekolah")} aria-label="Buka Notifikasi">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-700 hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
            </button>
            <span className="font-medium text-[14px] text-gray-700">{displayName}</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowProfileOverlay((prev) => !prev)}
                className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer"
                aria-label="Buka Menu Profil"
              >
                <img src={iconProfile} alt="" />
              </button>
              {showProfileOverlay ? (
                <div className="absolute right-0 top-full mt-2 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 w-full">
        <div className="max-w-6xl mx-auto py-8 px-6">
          <div className="mb-6">
            <h1 className="font-bold text-[32px] md:text-[36px]">Dashboard Operasional Sekolah</h1>
            <p className="text-sm text-[#0F172A] mt-1 flex items-center gap-1">
              <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {todayLabel}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-3xl bg-[#EEF6FF] flex items-center justify-center flex-shrink-0">
                <ImageBox
                  src={sekolah?.foto}
                  alt={sekolah?.nama ?? "Sekolah"}
                  fallbackSrc={iconSekolah}
                  className="w-full h-full rounded-3xl object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-semibold text-lg text-slate-900 truncate">{getDisplayValue(sekolah?.nama)}</div>
                    <span className="inline-flex items-center gap-2 mt-2 rounded-full bg-green-100 text-green-700 text-xs px-3 py-1 font-semibold">
                      <span className="w-2 h-2 rounded-full bg-green-600" />
                      Operational Aktif
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-sm text-slate-500 flex items-start gap-2">
                  <img src={iconMap} alt="Alamat" className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="leading-5">{getDisplayValue(sekolah?.alamat)}</span>
                </div>
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600">
                  <span className="text-blue-600">Affiliated Kitchen:</span>
                  <span>{getDisplayValue(sekolah?.affiliatedKitchen)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-1 mb-1">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-slate-800">
              <img src={iconMenu} alt="Menu Icon" className="w-5 h-5 object-contain" />
              Menu Hari Ini
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 lg:w-1/4 h-52 md:h-auto overflow-hidden">
                <ImageBox src={sekolah?.menuImage} alt="menu" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
                <div className="mb-6">
                  <div className="text-[11px] md:text-xs text-blue-600 font-extrabold mb-2 tracking-widest uppercase">Makanan Utama</div>
                  <h3 className="font-bold text-2xl md:text-3xl text-slate-900 mb-2">{getDisplayValue(sekolah?.menuMain)}</h3>
                  <p className="text-slate-500 text-sm md:text-base font-medium">{getDisplayValue(sekolah?.menuSide)}</p>
                </div>
                <div className="pt-6 border-t border-slate-50 flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 bg-[#F0F7FF] border border-blue-100 rounded-xl py-4 px-6 text-center">
                    <div className="text-blue-600 font-extrabold text-2xl">{getDisplayValue(sekolah?.menuCalories)}</div>
                    <div className="text-[13px] text-slate-500 font-medium">Calories (kcal)</div>
                  </div>
                  <div className="flex-1 bg-[#F0F7FF] border border-blue-100 rounded-xl py-4 px-6 text-center">
                    <div className="text-blue-600 font-extrabold text-2xl">{getDisplayValue(sekolah?.menuProtein)}</div>
                    <div className="text-[13px] text-slate-500 font-medium">Protein</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-strong">
              <img src={iconUnggah} alt="Ikon Unggahan" className="w-5 h-5 object-contain" />
              Unggah Dokumentasi Menu
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-blue-200 rounded-xl p-10 flex flex-col items-center justify-center min-h-[150px] mb-4 bg-blue-50/30 cursor-pointer hover:bg-blue-100/40 hover:border-blue-400 transition-all"
            >
              {uploadedFileUrl ? (
                <ImageBox src={uploadedFileUrl} alt="preview" className="h-24 object-contain rounded-lg mb-2" />
              ) : (
                <img src={iconUpload} alt="Upload" className="w-12 h-12 mb-3 opacity-40" />
              )}
              {uploadedFile ? (
                <span className="text-blue-600 font-medium text-sm">{uploadedFile.name}</span>
              ) : (
                <span className="text-slate-500 text-center text-sm">Seret dan lepas foto makanan di sini<br />atau klik untuk menjelajahi perangkat</span>
              )}
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan</label>
              <input
                type="text"
                value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                disabled={isUploading}
                className="w-full border rounded-lg px-3 py-2 text-sm"
                placeholder="cth: Pembagian makanan untuk siswa kelas 3"
              />
            </div>
            <button
              onClick={handleUnggahFoto}
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 text-white py-3 rounded-lg font-semibold text-base mt-1 transition-all border border-transparent flex items-center justify-center gap-2 disabled:opacity-70"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              <span>{isUploading ? "Mengunggah..." : "Unggah Foto"}</span>
            </button>
          </div>

          <div className="p-1 mb-1">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-strong">
              <img src={iconCatatan} alt="Ikon Catatan" className="w-5 h-5 object-contain" />
              Catatan Pengiriman & Menu
            </h2>
          </div>
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Saran dan Kritik</label>
            <textarea
              rows={4}
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              disabled={isSubmittingNote}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 resize-none"
              placeholder="cth: Menu diterima tepat waktu, makanan datang terlambat 10 menit..."
            />
            <div className="flex justify-end">
              <button
                onClick={handleUnggahCatatan}
                disabled={isSubmittingNote}
                className="bg-blue-600 hover:bg-white hover:text-blue-600 hover:border-blue-600 text-white px-10 py-2.5 rounded-lg font-semibold text-base transition-all border border-transparent disabled:opacity-70"
              >
                {isSubmittingNote ? "Menyimpan..." : "Unggah"}
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="font-semibold mb-4 text-[20px] flex items-center gap-2 text-strong">
              <img src={iconUnggahanTerbaru} alt="Ikon Unggahan Terbaru" className="w-5 h-5 object-contain" />
              Unggahan Terbaru
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recentDocs.map((item, i) => (
                <div key={i} className="bg-white rounded-xl shadow p-3 flex flex-col items-center">
                  <ImageBox
                    src={item.fotoUrl || item.foto}
                    alt={item.caption}
                    className="w-full h-40 object-cover rounded-lg mb-3"
                  />
                  <div className="font-semibold text-sm">{getDisplayValue(item.caption)}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{getDisplayValue(item.time)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-white border-t mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-5">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIMBA Logo" className="w-9 h-9" />
            <span className="font-bold text-[20px] text-[#1a2233] tracking-wide">SIMBA</span>
          </div>
          <div className="flex gap-6 text-sm text-slate-400">
            <span className="cursor-not-allowed">Pusat Dukungan</span>
            <span className="cursor-not-allowed">Pedoman Kebijakan</span>
            <span className="cursor-not-allowed">Privasi</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
