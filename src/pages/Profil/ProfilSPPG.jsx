import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { formatNumberValue, getDisplayValue } from "../../utils/display";
import { resolveImageUrl } from "../../utils/imageUrl";
import { getSPPGById } from "../../services/sppgService";

const emptySppg = {
  id: null,
  name: "-",
  image: null,
  location: "-",
  description: "-",
  longDescription: "-",
  stats: {
    schoolsServed: "-",
    dailyCapacity: "-",
    staffCount: "-",
  },
  nutrition: {
    calories: "-",
    protein: "-",
    carbs: "-",
    fat: "-",
    fiber: "-",
  },
  weeklyMenu: [
    {
      day: "-",
      title: "-",
      items: ["-"],
      image: null,
    },
  ],
  schools: [],
};

const withUnit = (value, unit) => {
  if (value === null || value === undefined || value === "") return "-";
  return `${value}${unit}`;
};

function ImageBox({ src, alt, className }) {
  const imageUrl = resolveImageUrl(src);

  if (!imageUrl) {
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

  return <img src={imageUrl} alt={alt} className={className} />;
}

export default function ProfilSPPG() {
  const navigate = useNavigate();
  const { id } = useParams();
  const hasId = Boolean(id);
  const [sppgData, setSppgData] = useState(emptySppg);
  const [loading, setLoading] = useState(hasId);
  const [error, setError] = useState(hasId ? "" : "ID SPPG belum tersedia.");
  const [isMenuDragging, setIsMenuDragging] = useState(false);
  const menuScrollRef = useRef(null)
  const isDraggingMenuRef = useRef(false)
  const menuStartXRef = useRef(0)
  const menuStartScrollLeftRef = useRef(0)
  const menuHasDraggedRef = useRef(false)

  const handleMenuPointerDown = (event) => {
    const container = menuScrollRef.current
    if (!container) return

    isDraggingMenuRef.current = true
    setIsMenuDragging(true)
    menuHasDraggedRef.current = false
    menuStartXRef.current = event.clientX
    menuStartScrollLeftRef.current = container.scrollLeft
    container.setPointerCapture?.(event.pointerId)
  }

  const handleMenuPointerMove = (event) => {
    if (!isDraggingMenuRef.current) return

    const container = menuScrollRef.current
    if (!container) return

    event.preventDefault()

    const deltaX = event.clientX - menuStartXRef.current
    if (Math.abs(deltaX) > 5) {
      menuHasDraggedRef.current = true
    }

    container.scrollLeft = menuStartScrollLeftRef.current - deltaX
  }

  const stopMenuDrag = (event) => {
    const container = menuScrollRef.current
    if (!container) return

    isDraggingMenuRef.current = false
    setIsMenuDragging(false)
    container.releasePointerCapture?.(event.pointerId)
  }

  const handleMenuClickCapture = (event) => {
    if (!menuHasDraggedRef.current) return

    event.preventDefault()
    event.stopPropagation()
    menuHasDraggedRef.current = false
  }

  useEffect(() => {
    if (!id) {
      return;
    }
    Promise.resolve()
      .then(() => {
        setLoading(true);
        setError("");
        return getSPPGById(id);
      })
      .then((res) => {
        const data = res?.data?.data ?? {};
        const schools = Array.isArray(data?.schools) ? data.schools : [];
        const mappedSchools = schools.map((school) => ({
          name: school?.schoolName ?? school?.name ?? "-",
          location: school?.address ?? "-",
          studentCount: school?.studentCount ?? "-",
          siswaTotal: school?.siswaTotal ?? "-",
          image: school?.photoUrl ?? null,
        }));

        setSppgData({
          ...emptySppg,
          id: data?.id ?? null,
          name: data?.name ?? "-",
          image:
            data?.photoUrl ??
            data?.photo_url ??
            data?.imageUrl ??
            data?.image_url ??
            data?.logoUrl ??
            data?.logo_url ??
            null,
          location: data?.address ?? "-",
          description: data?.description ?? "-",
          longDescription: data?.longDescription ?? "-",
          stats: {
            schoolsServed: mappedSchools.length || "-",
            dailyCapacity: data?.capacityPerDay ?? "-",
            staffCount: data?.staffCount ?? "-",
          },
          schools: mappedSchools,
        });
      })
      .catch(() => {
        setSppgData(emptySppg);
        setError("Gagal memuat data SPPG.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Scroll ke atas saat component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#f6f7f8]">
      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-20 space-y-12">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-3 text-xl font-bold"
        >
          <svg
            width={47}
            height={47}
            viewBox="0 0 47 47"
            fill="none"
            className="w-8 h-8"
          >
            <rect width={47} height={47} rx={15} fill="#F3FAFF" />
            <path
              d="M15.2829 21.9397C15.002 22.221 14.8442 22.6022 14.8442 22.9997C14.8442 23.3972 15.002 23.7785 15.2829 24.0597L20.9389 29.7187C21.2203 30.0001 21.602 30.1582 21.9999 30.1582C22.3979 30.1582 22.7795 30.0001 23.0609 29.7187C23.3423 29.4373 23.5004 29.0557 23.5004 28.6577C23.5004 28.2598 23.3423 27.8781 23.0609 27.5967L19.9649 24.4997H31.4999C31.8977 24.4997 32.2793 24.3417 32.5606 24.0604C32.8419 23.7791 32.9999 23.3975 32.9999 22.9997C32.9999 22.6019 32.8419 22.2204 32.5606 21.9391C32.2793 21.6578 31.8977 21.4997 31.4999 21.4997H19.9649L23.0609 18.4037C23.3423 18.1223 23.5004 17.7407 23.5004 17.3427C23.5004 16.9447 23.3423 16.5631 23.0609 16.2817C22.7795 16.0003 22.3979 15.8422 21.9999 15.8422C21.602 15.8422 21.2203 16.0003 20.9389 16.2817L15.2829 21.9397Z"
              fill="black"
            />
          </svg>
          Kembali
        </button>

        {loading ? (
          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
            Memuat data SPPG...
          </div>
        ) : null}
        {error ? (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </div>
        ) : null}

        {/* Hero Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div className="rounded-xl overflow-hidden shadow-sm border border-slate-200">
            <ImageBox
              src={sppgData.image}
              alt={sppgData.name}
              className="w-full h-full md:h-80 object-cover"
            />
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-start gap-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#136dec]/10 w-fit">
              <svg width={13} height={13} viewBox="0 0 13 13" fill="none">
                <path
                  d="M4.43333 12.25L3.325 10.3833L1.225 9.91667L1.42917 7.75833L0 6.125L1.42917 4.49167L1.225 2.33333L3.325 1.86667L4.43333 0L6.41667 0.845833L8.4 0L9.50833 1.86667L11.6083 2.33333L11.4042 4.49167L12.8333 6.125L11.4042 7.75833L11.6083 9.91667L9.50833 10.3833L8.4 12.25L6.41667 11.4042L4.43333 12.25ZM4.92917 10.7625L6.41667 10.1208L7.93333 10.7625L8.75 9.3625L10.3542 8.98333L10.2083 7.35L11.2875 6.125L10.2083 4.87083L10.3542 3.2375L8.75 2.8875L7.90417 1.4875L6.41667 2.12917L4.9 1.4875L4.08333 2.8875L2.47917 3.2375L2.625 4.87083L1.54583 6.125L2.625 7.35L2.47917 9.0125L4.08333 9.3625L4.92917 10.7625ZM5.80417 8.19583L9.1 4.9L8.28333 4.05417L5.80417 6.53333L4.55 5.30833L3.73333 6.125L5.80417 8.19583Z"
                  fill="#136DEC"
                />
              </svg>
              <span className="text-xs font-bold uppercase text-[#136dec]">
                Fasilitas Terverifikasi
              </span>
            </div>

            {/* Title */}
            <h1 className="text-4xl font-bold text-slate-900">
              {getDisplayValue(sppgData.name)}
            </h1>

            {/* Location */}
            <div className="flex items-center gap-1 text-slate-500">
              <svg width={12} height={15} viewBox="0 0 12 15" fill="none">
                <path
                  d="M6 7.5C6.4125 7.5 6.76562 7.35312 7.05937 7.05937C7.35312 6.76562 7.5 6.4125 7.5 6C7.5 5.5875 7.35312 5.23438 7.05937 4.94063C6.76562 4.64688 6.4125 4.5 6 4.5C5.5875 4.5 5.23438 4.64688 4.94063 4.94063C4.64688 5.23438 4.5 5.5875 4.5 6C4.5 6.4125 4.64688 6.76562 4.94063 7.05937C5.23438 7.35312 5.5875 7.5 6 7.5ZM6 13.0125C7.525 11.6125 8.65625 10.3406 9.39375 9.19687C10.1313 8.05312 10.5 7.0375 10.5 6.15C10.5 4.7875 10.0656 3.67188 9.19687 2.80312C8.32812 1.93437 7.2625 1.5 6 1.5C4.7375 1.5 3.67188 1.93437 2.80312 2.80312C1.93437 3.67188 1.5 4.7875 1.5 6.15C1.5 7.0375 1.86875 8.05312 2.60625 9.19687C3.34375 10.3406 4.475 11.6125 6 13.0125ZM6 15C3.9875 13.2875 2.48438 11.6969 1.49063 10.2281C0.496875 8.75937 0 7.4 0 6.15C0 4.275 0.603125 2.78125 1.80938 1.66875C3.01562 0.55625 4.4125 0 6 0C7.5875 0 8.98438 0.55625 10.1906 1.66875C11.3969 2.78125 12 4.275 12 6.15C12 7.4 11.5031 8.75937 10.5094 10.2281C9.51562 11.6969 8.0125 13.2875 6 15Z"
                  fill="#64748B"
                />
              </svg>
              <span className="text-base">{getDisplayValue(sppgData.location)}</span>
            </div>

            {/* Description */}
            <p className="text-lg text-slate-600">{getDisplayValue(sppgData.description)}</p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Sekolah yang Dilayani
                </p>
                <p className="text-3xl font-bold text-[#136dec]">
                  {getDisplayValue(sppgData.stats.schoolsServed)}
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Kapasitas Harian
                </p>
                <p className="text-3xl font-bold text-[#136dec]">
                  {formatNumberValue(sppgData.stats.dailyCapacity)}
                </p>
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Meals / Day
                </p>
              </div>
              <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-sm text-center">
                <p className="text-sm font-medium text-slate-500 mb-2">
                  Staf Pekerja
                </p>
                <p className="text-3xl font-bold text-[#136dec]">
                  {getDisplayValue(sppgData.stats.staffCount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8 rounded-2xl bg-white border border-slate-200">
          {/* Left Content */}
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <svg width={20} height={20} viewBox="0 0 20 20" fill="none">
                <path
                  d="M9 15H11V9H9V15ZM10 7C10.2833 7 10.5208 6.90417 10.7125 6.7125C10.9042 6.52083 11 6.28333 11 6C11 5.71667 10.9042 5.47917 10.7125 5.2875C10.5208 5.09583 10.2833 5 10 5C9.71667 5 9.47917 5.09583 9.2875 5.2875C9.09583 5.47917 9 5.71667 9 6C9 6.28333 9.09583 6.52083 9.2875 6.7125C9.47917 6.90417 9.71667 7 10 7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z"
                  fill="#136DEC"
                />
              </svg>
              <h2 className="text-2xl font-bold text-slate-900">
                Tentang Fasilitas Kami
              </h2>
            </div>
            <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap">
              {getDisplayValue(sppgData.longDescription)}
            </p>
          </div>

          {/* Right: Features */}
          <div className="space-y-4">
            {[
              {
                title: "Kapasitas Porsi",
                desc: `${formatNumberValue(sppgData.stats.dailyCapacity)} porsi harian`,
                icon: "👨‍🍳",
              },
              {
                title: "Total Staf Pekerja",
                desc: `${getDisplayValue(sppgData.stats.staffCount)} staf`,
                icon: "👥",
              },
              {
                title: "Lingkup",
                desc: getDisplayValue(sppgData.location),
                icon: "🗺️",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex gap-4 p-4 rounded-lg bg-[#f6f7f8] border border-slate-100"
              >
                <div className="w-12 h-12 rounded-lg bg-[#136dec]/10 flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{item.title}</p>
                  <p className="text-sm text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Menu */}
        <div className="space-y-6 p-8 rounded-2xl bg-[#136dec]/5">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Menu Pekan Ini
            </h2>
            <p className="text-base text-slate-500">
              {getDisplayValue(sppgData.menuPeriod)}
            </p>
          </div>
          <div
            ref={menuScrollRef}
            onPointerDown={handleMenuPointerDown}
            onPointerMove={handleMenuPointerMove}
            onPointerUp={stopMenuDrag}
            onPointerLeave={stopMenuDrag}
            onClickCapture={handleMenuClickCapture}
            className={`flex gap-5 overflow-x-auto pb-4 pr-1 select-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
              isMenuDragging ? 'cursor-grabbing snap-none' : 'cursor-grab snap-x snap-proximity'
            }`}
            style={{ touchAction: 'pan-y' }}
          >
            {sppgData.weeklyMenu.map((menu, idx) => (
              <div
                key={idx}
                className="relative flex w-[250px] shrink-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm snap-start"
              >
                <ImageBox
                  src={menu.image}
                  alt={menu.day}
                  className="h-32 w-full object-cover"
                />
                <div className="p-4 flex flex-col gap-3">
                  <h3 className="font-bold text-slate-900 text-sm">
                    {getDisplayValue(menu.title)}
                  </h3>
                  <ul className="text-sm text-slate-500 space-y-1">
                    {menu.items.map((item, i) => (
                      <li key={i}>• {getDisplayValue(item)}</li>
                    ))}
                  </ul>
                </div>
                <div className="absolute left-3 top-3 rounded bg-[#136dec] px-2 py-1 text-[10px] font-bold text-white">
                  {getDisplayValue(menu.day)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nutrition Info */}
        <div className="space-y-6 p-8 rounded-2xl bg-[#136dec]/5">
          <h2 className="text-xl font-bold text-slate-900 text-center">
            Rata-rata Komposisi Gizi Harian
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: "Kalori (kcal)",
                value: sppgData.nutrition.calories,
                icon: "⚡",
              },
              {
                label: "Protein",
                value: withUnit(sppgData.nutrition.protein, "g"),
                icon: "💪",
              },
              {
                label: "Karbohidrat",
                value: withUnit(sppgData.nutrition.carbs, "g"),
                icon: "🍚",
              },
              {
                label: "Lemak",
                value: withUnit(sppgData.nutrition.fat, "g"),
                icon: "❤️",
              },
              {
                label: "Serat",
                value: withUnit(sppgData.nutrition.fiber, "g"),
                icon: "🌿",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-white border border-[#136dec]/20 shadow-sm"
              >
                <div className="text-2xl">{item.icon}</div>
                <p className="text-2xl font-bold text-slate-900">
                  {getDisplayValue(item.value)}
                </p>
                <p className="text-xs font-bold uppercase text-slate-400 text-center">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Schools Section */}
        <div className="space-y-6 p-8 rounded-2xl bg-[#136dec]/5">
          <h2 className="text-2xl font-bold text-slate-900">
            Sekolah yang Berpartisipasi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sppgData.schools.map((school, idx) => (
              <div
                key={idx}
                className="flex h-full flex-col gap-4 p-6 rounded-xl bg-white shadow-md"
              >
                <div className="flex gap-4">
                  <ImageBox
                    src={school.image}
                    alt={school.name}
                    className="w-20 h-20 rounded-2xl object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900">{getDisplayValue(school.name)}</h3>
                    <div className="flex items-center gap-1 text-sm text-slate-500">
                      <span>📍</span>
                      <span>{getDisplayValue(school.location)}</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      <span className="px-2 py-1 rounded-full bg-[#e7f0fd] text-[10px] font-bold text-[#136dec]">
                        {formatNumberValue(school.siswaTotal)} SISWA
                      </span>
                      <span className="px-2 py-1 rounded-full bg-[#e4f8e1] text-[10px] font-bold text-[#2b7d20]">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
                <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                  <div>
                    <p className="text-xs font-semibold uppercase text-slate-400">
                      Student Count
                    </p>
                    <p className="font-bold text-slate-900">
                      {getDisplayValue(school.studentCount)} Students
                    </p>
                  </div>
                  <button className="text-sm font-bold text-[#136dec] flex items-center gap-1">
                    Profile
                    <span>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
