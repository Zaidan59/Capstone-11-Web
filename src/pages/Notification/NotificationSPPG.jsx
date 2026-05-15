import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconCalendar from '../../assets/Icon_calendar.png';
import IconMap from '../../assets/Icon_map.png';
import IconMakan from '../../assets/Icon_makan.png';
import IconTruck from '../../assets/Icon_truck.png';
import IconCentang from '../../assets/Icon_centang.png';
import IconTime from '../../assets/Icon_time.png';
import logo from '../../assets/Logo.png';
import iconProfile from '../../assets/icon_profile.png';
import { useAuth } from '../../hooks/useAuth';
import { getNotificationsBySppgId } from '../../services/notificationService';
import { getSPPGById } from '../../services/sppgService';
import { getDisplayValue } from '../../utils/display';

const statusStyles = {
  new: { label: 'Baru', color: 'bg-amber-100 text-amber-700', accent: '#F59E0B' },
  received: { label: 'Diterima', color: 'bg-blue-100 text-blue-700', accent: '#2563EB' },
  reviewed: { label: 'Ditinjau', color: 'bg-emerald-100 text-emerald-700', accent: '#10B981' },
};

const typeIcons = {
  menu: IconMakan,
  pengiriman: IconTruck,
  feedback: IconMakan,
  info: IconCalendar,
};

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const NotificationSPPG = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sppgId = user?.sppgId || user?.id || null;
  const profileId = user?.sppgId || user?.id || null;
  const hasSppgId = Boolean(sppgId);
  const [notifications, setNotifications] = useState([]);
  const [sppgProfile, setSppgProfile] = useState(null);
  const [loading, setLoading] = useState(hasSppgId);
  const [error, setError] = useState(hasSppgId ? '' : 'ID SPPG belum tersedia.');

  const displayName = user?.name || user?.identifier || 'Admin SPPG';

  useEffect(() => {
    if (!sppgId) {
      return;
    }
    Promise.resolve()
      .then(() => {
        setLoading(true);
        setError('');
        return Promise.all([getNotificationsBySppgId(sppgId), getSPPGById(sppgId)]);
      })
      .then(([notificationsRes, profileRes]) => {
        const data = Array.isArray(notificationsRes?.data?.data)
          ? notificationsRes.data.data
          : [];
        setNotifications(data);
        setSppgProfile(profileRes?.data?.data ?? null);
      })
      .catch(() => {
        setNotifications([]);
        setSppgProfile(null);
        setError('Gagal memuat notifikasi.');
      })
      .finally(() => setLoading(false));
  }, [sppgId]);

  const mappedNotifications = useMemo(
    () =>
      notifications.map((item, index) => {
        const statusKey = item?.status ?? 'new';
        const status = statusStyles[statusKey] ?? statusStyles.new;
        const typeKey = item?.type ?? 'info';
        const icon = typeIcons[typeKey] ?? typeIcons.info;

        return {
          id: item?.id ?? `${typeKey}-${item?.createdAt ?? 'unknown'}-${index}`,
          school: getDisplayValue(
            item?.schoolName ?? (item?.schoolId ? `Sekolah ${item.schoolId}` : null),
          ),
          statusLabel: status.label,
          statusColor: status.color,
          accentColor: status.accent,
          typeIcon: icon,
          date: formatDate(item?.createdAt),
          message: getDisplayValue(item?.message),
        };
      }),
    [notifications],
  );
  const pendingCount = mappedNotifications.filter((item) => item.statusLabel === 'Baru').length;
  const totalTodayCount = mappedNotifications.length;
  const resolvedCount = mappedNotifications.filter((item) => item.statusLabel === 'Ditinjau').length;
  const sppgName = getDisplayValue(sppgProfile?.name, displayName);
  const sppgAddress = getDisplayValue(sppgProfile?.address);
  const operationDateLabel = useMemo(
    () =>
      new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans">

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
            <span className="font-medium text-[14px] text-gray-700">{displayName}</span>
            <button
              type="button"
              onClick={() => profileId && navigate(`/profil/sppg/${profileId}`)}
              className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Buka Profil SPPG"
              disabled={!profileId}
            >
              <img src={iconProfile} alt="" />
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-bold text-[#1A2B4C]">{sppgName}</h1>
              <p className="text-gray-400 flex items-center mt-1 text-sm">
                <img src={IconMap} className="w-4 mr-2 grayscale opacity-50" alt="map" />
                {sppgAddress}
              </p>
            </div>
            <div className="bg-[#F4F8FF] px-6 py-3 rounded-xl flex items-center border border-blue-50">
              <img src={IconCalendar} className="w-8 mr-4" alt="calendar" />
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Tanggal Operasional</p>
                <p className="text-sm font-extrabold text-[#1A2B4C]">{operationDateLabel}</p>
              </div>
            </div>
          </div>

          {/* List Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A2B4C]">Notifikasi Umpan Balik</h2>
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-4 py-2 rounded-full">{pendingCount} TERTUNDA</span>
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-4 py-2 rounded-full">{totalTodayCount} TOTAL HARI INI</span>
            </div>
          </div>

          {/* List */}
          <div className="space-y-6">
            {loading ? (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-gray-500">
                Memuat notifikasi...
              </div>
            ) : error ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl shadow-sm p-6 text-rose-700">
                {error}
              </div>
            ) : mappedNotifications.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 text-gray-500">
                Belum ada notifikasi.
              </div>
            ) : (
              mappedNotifications.map((item) => (
                <div
                  key={item.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
                  style={{ borderLeftColor: item.accentColor, borderLeftWidth: '6px' }}
                >
                  <div className="flex justify-between items-center">

                    {/* Kiri */}
                    <div className="flex-1 pr-6">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-bold text-[#1A2B4C]">{item.school}</h3>
                        <span className={`${item.statusColor} text-[10px] px-3 py-1 rounded-md font-bold`}>
                          {item.statusLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-4">
                        <img src={item.typeIcon} className="w-4 opacity-60" alt="icon" />
                        <p className="text-sm text-gray-400">{item.date}</p>
                      </div>
                      <div className="bg-[#F8F9FA] p-4 rounded-xl text-gray-600 text-sm">
                        "{item.message}"
                      </div>
                    </div>

                    {/* Kanan */}
                    <div className="flex flex-col justify-center gap-3 w-[220px] shrink-0">
                      <div className="flex items-center justify-center text-[#10B981] font-bold text-[13px] mb-1">
                        <img src={IconCentang} className="w-4 h-4 mr-2" alt="done" />
                        Status: {item.statusLabel}
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-6 mt-12 max-w-2xl">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                <img src={IconTime} className="w-6" alt="time" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Waktu Respon Rata - Rata</p>
              <h4 className="text-2xl font-black text-[#1A2B4C] mb-2">-</h4>
              <p className="text-[#10B981] text-sm font-medium">Belum tersedia</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-5">
                <img src={IconCentang} className="w-6" alt="done" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Terselesaikan</p>
              <h4 className="text-2xl font-black text-[#1A2B4C] mb-2">{resolvedCount} / {totalTodayCount}</h4>
              <p className="text-gray-400 text-sm">{pendingCount} sekolah tertunda untuk ditinjau</p>
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
};

export default NotificationSPPG;
