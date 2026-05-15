import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconMap from "../../assets/Icon_map.png";
import IconBuilding from "../../assets/Icon_building.png";
import IconCalendar from "../../assets/Icon_calendar.png";
import IconEducation from "../../assets/Icon_education.png";
import IconPrint from "../../assets/Icon_print.png";
import IconNutrisi from "../../assets/Icon_nutrisi.png";
import IconCamera from "../../assets/Icon_camera.png";
import IconCeklis from "../../assets/Icon_ceklis.png";
import IconFeedback from "../../assets/Icon_feedback.png";
import IconWarning from "../../assets/Icon_warning.png";
import logo from "../../assets/Logo.png";
import IconProfile from "../../assets/Icon_profile.png";
import { useAuth } from '../../hooks/useAuth';
import { getSPPGById } from '../../services/sppgService';
import { getNotificationsBySppgId } from '../../services/notificationService';
import { getDisplayValue } from '../../utils/display';
import UserMenu from "../../components/common/UserMenu";

const DashboardSPPG = () => {
  const FEATURE_MENU_UPLOAD_READY = false;
  const FEATURE_NUTRITION_UPLOAD_READY = false;
  const FEATURE_DOC_UPLOAD_READY = false;
  const { user } = useAuth();
  const navigate = useNavigate();
  const sppgId = user?.sppgId || user?.id || null;
  const hasSppgId = Boolean(sppgId);
  const [sppgData, setSppgData] = useState(null);
  const [servedSchools, setServedSchools] = useState([]);
  const [loading, setLoading] = useState(hasSppgId);
  const [error, setError] = useState(hasSppgId ? '' : 'ID SPPG belum tersedia.');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [csvFile, setCsvFile] = useState(null);
  const [nutritionFile, setNutritionFile] = useState(null);
  const [menuData, setMenuData] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [actionMessage, setActionMessage] = useState("");

  useEffect(() => {
    if (!sppgId) {
      return;
    }
    Promise.resolve()
      .then(() => {
        setLoading(true);
        setError('');
        return Promise.all([getSPPGById(sppgId), getNotificationsBySppgId(sppgId)]);
      })
      .then(([sppgRes, notificationRes]) => {
        const data = sppgRes?.data?.data ?? null;
        const notifData = Array.isArray(notificationRes?.data?.data)
          ? notificationRes.data.data
          : [];
        setSppgData(data);
        setServedSchools(Array.isArray(data?.schools) ? data.schools : []);
        setNotifications(notifData);
        setMenuData([]);
      })
      .catch(() => {
        setSppgData(null);
        setServedSchools([]);
        setNotifications([]);
        setMenuData([]);
        setError('Gagal memuat data SPPG.');
      })
      .finally(() => setLoading(false));
  }, [sppgId]);

  const sppgName = getDisplayValue(sppgData?.name);
  const sppgAddress = getDisplayValue(sppgData?.address);
  const sppgStatus = getDisplayValue(sppgData?.status);
  const displayName = user?.name || user?.identifier || 'Admin SPPG';
  const schoolCount = servedSchools.length > 0 ? servedSchools.length : '-';
  const uploadPreviewItems =
    servedSchools.length > 0
      ? servedSchools.slice(0, 4).map((school) => ({
          school: getDisplayValue(school?.schoolName ?? school?.name),
          time: '-',
          img: null,
        }))
      : [{ school: '-', time: '-', img: null }];
  const feedbackItems =
    notifications.length > 0
      ? notifications.slice(0, 3).map((item) => ({
          title: getDisplayValue(item?.type),
          time: item?.createdAt
            ? new Date(item.createdAt).toLocaleString('id-ID', {
                day: '2-digit',
                month: 'short',
                hour: '2-digit',
                minute: '2-digit',
              })
            : '-',
          desc: getDisplayValue(item?.message),
          school: getDisplayValue(item?.schoolName),
          variant: item?.status === 'new' ? 'warning' : item?.status === 'reviewed' ? 'success' : 'info',
        }))
      : [
          {
            title: '-',
            time: '-',
            desc: '-',
            school: '-',
            variant: 'info',
          },
        ];
  const nutritionCoverage = menuData.length > 0 ? '100%' : '-';
  const nutritionBarWidth = menuData.length > 0 ? '100%' : '0%';
  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    [],
  );

  const handleFileDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files[0] || e.target.files[0];
    if (file) setUploadedFile(file);
  };

  const showUnavailableMessage = () => {
    setActionMessage("Fitur ini belum terhubung ke backend. Sementara hanya tampilan.");
    setTimeout(() => setActionMessage(""), 2500);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900 flex flex-col">
      <nav className="sticky top-0 z-40 bg-white shadow w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-[52px]">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="SIMBA Logo" className="w-9 h-9" />
            <span className="font-bold text-[20px] text-[#1a2233] tracking-wide">SIMBA</span>
          </div>
          <div className="flex items-center gap-[18px]">
            <button
              className="relative"
              onClick={() => navigate('/notification')}
              aria-label="Buka Notifikasi"
            >
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} className="text-gray-700 hover:text-blue-600 transition-colors">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-0 right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
            </button>
            <span className="font-medium text-[14px] text-gray-700">{displayName}</span>
            <UserMenu icon={IconProfile} ariaLabel="Menu Pengguna SPPG" />
          </div>
        </div>
      </nav>


      {/* MAIN CONTENT */}
      <div className="py-10 px-4 flex-1">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="mb-6 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-500">
              Memuat data SPPG...
            </div>
          ) : null}
          {error ? (
            <div className="mb-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
              {error}
            </div>
          ) : null}
          {actionMessage ? (
            <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
              {actionMessage}
            </div>
          ) : null}

          {/* HEADER INFO CARD */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 flex flex-col md:flex-row justify-between items-center gap-8 shadow-sm">
            <div className="flex items-center gap-8 w-full">
              <div className="w-32 h-32 bg-[#F0F7FF] rounded-xl flex items-center justify-center">
                <img src={IconBuilding} alt="Building Icon" className="w-14 h-14 object-contain" />
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-4">
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900">{sppgName}</h1>
                  <span className="inline-flex items-center gap-1 px-4 py-1.5 bg-[#E7F8F0] text-[#059669] text-[14px] font-semibold rounded-full border border-[#D1FAE5]">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7" />
                    </svg>
                    {sppgStatus === '-' ? 'Status -' : `Status ${sppgStatus}`}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-gray-500 text-lg mt-1.5">
                  <img src={IconMap} alt="Map Icon" className="w-4 h-4 object-contain"
                    style={{ filter: 'invert(60%) sepia(0%) saturate(0%) brightness(90%)' }} />
                  <p>{sppgAddress}</p>
                </div>
                <div className="flex gap-4 mt-3 text-sm font-bold text-gray-600 uppercase tracking-wide">
                  <span className="flex items-center gap-2">
                    <img src={IconEducation} alt="Education Icon" className="w-7 h-7 object-contain" />
                    {schoolCount} Schools Served
                  </span>
                  <span className="flex items-center gap-2 pl-8">
                    <img src={IconCalendar} alt="Calendar Icon" className="w-6 h-6 object-contain" />
                    Today: {todayLabel}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center flex-shrink-0">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap">
                <img src={IconPrint} alt="Print Icon" className="w-3 h-3 object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }} />
                Print Labels
              </button>
            </div>
          </div>

          {/* Section Title 1 */}
          <div className="flex items-center gap-3 mt-10 mb-4">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
            <h2 className="text-xl font-bold text-gray-900">Upload Weekly Menu (CSV)</h2>
          </div>

          {/* UPLOAD WEEKLY MENU SECTION */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
              onDrop={handleFileDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => document.getElementById('csvInput').click()}
            >
              <input
                id="csvInput"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  setCsvFile(file);
                }}
              />
              <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-lg font-semibold text-gray-600">
                {csvFile ? csvFile.name : 'Menu belum tersedia'}
              </span>
            </div>

            <div className="border-t border-gray-100" />

            <div className="space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview (Last Uploaded)</p>
              <div className="rounded-xl border border-gray-200 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200" style={{ backgroundColor: '#F8FAFC' }}>
                      <th className="text-left px-6 py-4 font-bold text-gray-700">Day</th>
                      <th className="text-left px-6 py-4 font-bold text-gray-700">Main Dish</th>
                      <th className="text-left px-6 py-4 font-bold text-gray-700">Side Dish</th>
                      <th className="text-left px-6 py-4 font-bold text-gray-700">Fruit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menuData.length > 0 ? (
                      menuData.map((row, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="px-6 py-4 text-gray-700">{getDisplayValue(row.day)}</td>
                          <td className="px-6 py-4 text-gray-700">{getDisplayValue(row.mainDish)}</td>
                          <td className="px-6 py-4 text-gray-700">{getDisplayValue(row.sideDish)}</td>
                          <td className="px-6 py-4 text-gray-700">{getDisplayValue(row.fruit)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b border-gray-100 last:border-0">
                        <td className="px-6 py-4 text-gray-700">-</td>
                        <td className="px-6 py-4 text-gray-700">-</td>
                        <td className="px-6 py-4 text-gray-700">-</td>
                        <td className="px-6 py-4 text-gray-700">-</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-60"
                disabled={!FEATURE_MENU_UPLOAD_READY}
                onClick={() => {
                  if (!FEATURE_MENU_UPLOAD_READY) {
                    showUnavailableMessage();
                  }
                }}
              >
                {FEATURE_MENU_UPLOAD_READY ? "Confirm Menu" : "Belum Terhubung"}
              </button>
            </div>
          </div>

          {/* Section Title 2 */}
          <div className="flex items-center gap-3 mt-10 mb-4">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
            <h2 className="text-xl font-bold text-gray-900">Upload Nutrition Data (CSV)</h2>
          </div>

          {/* UPLOAD NUTRITION DATA SECTION */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all w-full md:w-1/2"
                onClick={() => {
                  if (!FEATURE_NUTRITION_UPLOAD_READY) {
                    showUnavailableMessage();
                    return;
                  }
                  document.getElementById('nutritionCsvInput').click();
                }}
              >
                <input
                  id="nutritionCsvInput"
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setNutritionFile(file);
                  }}
                />
                <img src={IconNutrisi} alt="Nutrisi Icon" className="w-8 h-8 object-contain" />
                <p className="text-base font-bold text-gray-700">Nutrition CSV Upload</p>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-60"
                  disabled={!FEATURE_NUTRITION_UPLOAD_READY}
                >
                  {FEATURE_NUTRITION_UPLOAD_READY ? "Upload CSV" : "Belum Terhubung"}
                </button>
                {nutritionFile ? (
                  <p className="text-xs text-slate-500">{nutritionFile.name}</p>
                ) : null}
              </div>

              <div className="flex flex-col justify-center gap-5 w-full md:w-1/2">
                <p className="text-gray-600 text-base leading-relaxed">
                  Ensure your CSV includes columns for:{' '}
                  <span className="text-blue-500 font-mono font-semibold bg-blue-50 px-1 rounded">Calories</span>,{' '}
                  <span className="text-blue-500 font-mono font-semibold bg-blue-50 px-1 rounded">Protein</span>,{' '}
                  <span className="text-blue-500 font-mono font-semibold bg-blue-50 px-1 rounded">Fat</span>,{' '}
                  and <span className="text-blue-500 font-mono font-semibold bg-blue-50 px-1 rounded">Carbs</span>.
                </p>
                <div className="rounded-xl p-5 space-y-3" style={{ backgroundColor: '#136DEC0D', border: '1px solid #136DEC1A' }}>
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Recent Upload Score</p>
                    <span className="text-sm font-bold text-green-500">{nutritionCoverage === '-' ? '-' : 'VALID'}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: nutritionBarWidth }} />
                  </div>
                  <p className="text-sm text-gray-500">Data Coverage: {nutritionCoverage}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Title 3 */}
          <div className="flex items-center gap-3 mt-10 mb-4">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
            <h2 className="text-xl font-bold text-gray-900">Upload Meal Documentation</h2>
          </div>

          {/* UPLOAD MEAL DOCUMENTATION SECTION */}
          <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row gap-8">
              <div
                className="rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all w-full md:w-1/3 min-h-[320px]"
                style={{ backgroundColor: '#F1F5F9', border: '2px dashed #CBD5E1' }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = '#EFF6FF';
                  e.currentTarget.style.border = '2px dashed #93C5FD';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = '#F1F5F9';
                  e.currentTarget.style.border = '2px dashed #CBD5E1';
                }}
                onClick={showUnavailableMessage}
              >
                <img src={IconCamera} alt="Camera Icon" className="w-10 h-10 object-contain" />
                <p className="text-sm text-gray-500 font-medium">Add Meal Photo</p>
              </div>

              <div className="flex flex-col gap-5 w-full md:w-2/3 min-h-[320px]">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-sm font-semibold text-gray-700">Preparation Date</label>
                    <input type="text" placeholder="mm/dd/yyyy"
                      className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-400" />
                  </div>
                  <div className="flex flex-col gap-1.5 flex-1">
                    <label className="text-sm font-semibold text-gray-700">Target School</label>
                    <select className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-blue-400 bg-white">
                      <option>SDN 01 Kebayoran Baru</option>
                      <option>SMPN 12 Jakarta</option>
                      <option>SDN 05 Petogogan</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-gray-700">Caption/Notes</label>
                  <textarea placeholder="e.g. Fresh portion delivered to SDN 01" rows={3}
                    className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm text-gray-400 outline-none focus:border-blue-400 resize-none" />
                </div>

                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 w-fit disabled:opacity-60"
                  disabled={!FEATURE_DOC_UPLOAD_READY}
                  onClick={() => {
                    if (!FEATURE_DOC_UPLOAD_READY) {
                      showUnavailableMessage();
                    }
                  }}
                >
                  {FEATURE_DOC_UPLOAD_READY ? "Submit Documentation" : "Belum Terhubung"}
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Uploads</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadPreviewItems.map((item, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-200">
                    <div className="aspect-square w-full overflow-hidden">
                      {item.img ? (
                        <img src={item.img} alt={item.school} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400 text-sm font-semibold">-</div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-blue-500">{getDisplayValue(item.school)}</p>
                      <p className="text-xs text-gray-400">{getDisplayValue(item.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section Title 4 */}
          <div className="flex items-center gap-3 mt-10 mb-4">
            <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
            <h2 className="text-xl font-bold text-gray-900">School Feedback & Notifications</h2>
          </div>

          {/* SCHOOL FEEDBACK CARD */}
          <div className="px-16 pb-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feedbackItems.map((item, index) => {
                const borderColor =
                  item.variant === 'warning'
                    ? '#EF4444'
                    : item.variant === 'success'
                    ? '#10B981'
                    : '#3B82F6';
                const icon =
                  item.variant === 'warning'
                    ? IconWarning
                    : item.variant === 'success'
                    ? IconCeklis
                    : IconFeedback;

                return (
                  <div
                    key={`${item.title}-${index}`}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex gap-4"
                    style={{ borderLeft: `4px solid ${borderColor}` }}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <img src={icon} alt="Feedback" className="w-6 h-6 object-contain" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-bold text-gray-900">{getDisplayValue(item.title)}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap ml-4">{getDisplayValue(item.time)}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{getDisplayValue(item.desc)}</p>
                      <p className="text-sm font-semibold text-blue-500 mt-2">{getDisplayValue(item.school)}</p>
                    </div>
                  </div>
                );
              })}

              <div className="bg-gray-50 rounded-xl border border-gray-200 shadow-sm p-5 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-all">
                <p className="text-base font-bold text-gray-900">View History →</p>
              </div>
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

export default DashboardSPPG;
