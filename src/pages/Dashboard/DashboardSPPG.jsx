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
import { getDisplayValue } from '../../utils/display';

const DashboardSPPG = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const sppgId = user?.sppgId || user?.id || null;
  const profileId = user?.sppgId || user?.id || null;
  const hasSppgId = Boolean(sppgId);
  const [sppgData, setSppgData] = useState(null);
  const [servedSchools, setServedSchools] = useState([]);
  const [loading, setLoading] = useState(hasSppgId);
  const [error, setError] = useState(hasSppgId ? '' : 'ID SPPG belum tersedia.');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [menuData, setMenuData] = useState([]);

  useEffect(() => {
    if (!sppgId) {
      return;
    }
    Promise.resolve()
      .then(() => {
        setLoading(true);
        setError('');
        return getSPPGById(sppgId);
      })
      .then((res) => {
        const data = res?.data?.data ?? null;
        setSppgData(data);
        setServedSchools(Array.isArray(data?.schools) ? data.schools : []);
        setMenuData([]);
      })
      .catch(() => {
        setSppgData(null);
        setServedSchools([]);
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
            <button
              type="button"
              onClick={() => profileId && navigate(`/profil/sppg/${profileId}`)}
              className="w-8 h-8 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
              aria-label="Buka Profil SPPG"
              disabled={!profileId}
            >
              <img src={IconProfile} alt="" />
            </button>
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
              <input id="csvInput" type="file" accept=".csv" className="hidden" onChange={handleFileDrop} />
              <svg className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="text-lg font-semibold text-gray-600">
                {uploadedFile ? uploadedFile.name : 'Menu belum tersedia'}
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
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all active:scale-95">
                Confirm Menu
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
                onClick={() => document.getElementById('nutritionCsvInput').click()}
              >
                <input id="nutritionCsvInput" type="file" accept=".csv" className="hidden" />
                <img src={IconNutrisi} alt="Nutrisi Icon" className="w-8 h-8 object-contain" />
                <p className="text-base font-bold text-gray-700">Nutrition CSV Upload</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-xl font-bold transition-all active:scale-95">
                  Upload CSV
                </button>
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
                    <span className="text-sm font-bold text-green-500">VALID</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }} />
                  </div>
                  <p className="text-sm text-gray-500">Data Coverage: 85%</p>
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

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-xl font-bold transition-all active:scale-95 w-fit">
                  Submit Documentation
                </button>
              </div>
            </div>

            <div className="border-t border-gray-100" />

            <div className="space-y-4">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Today's Uploads</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { school: 'SDN 01 Kebayoran', time: '10:30 AM', img: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=800&q=100' },
                  { school: 'SMPN 12 Jakarta', time: '10:45 AM', img: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=100' },
                  { school: 'SDN 05 Petogogan', time: '11:00 AM', img: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=800&q=100' },
                  { school: 'General Prep', time: '09:15 AM', img: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=100' },
                ].map((item, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border border-gray-200">
                    <div className="aspect-square w-full overflow-hidden">
                      <img src={item.img} alt={item.school} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-semibold text-blue-500">{item.school}</p>
                      <p className="text-xs text-gray-400">{item.time}</p>
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
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex gap-4" style={{ borderLeft: '4px solid #EF4444' }}>
                <div className="flex-shrink-0 mt-0.5">
                  <img src={IconWarning} alt="Warning" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900">Meal arrived late</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">12:30 PM</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Delivery arrived at 12:15 PM instead of the planned 11:30 AM.</p>
                  <p className="text-sm font-semibold text-blue-500 mt-2">SDN 01 Kebayoran Baru</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex gap-4" style={{ borderLeft: '4px solid #10B981' }}>
                <div className="flex-shrink-0 mt-0.5">
                  <img src={IconCeklis} alt="Ceklis" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900">Menu matches plan</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">11:50 AM</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">All 150 portions received and quality approved by school staff.</p>
                  <p className="text-sm font-semibold text-blue-500 mt-2">SMPN 12 Jakarta</p>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex gap-4" style={{ borderLeft: '4px solid #3B82F6' }}>
                <div className="flex-shrink-0 mt-0.5">
                  <img src={IconFeedback} alt="Feedback" className="w-6 h-6 object-contain" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-900">Feedback: Portion Size</p>
                    <span className="text-xs text-gray-400 whitespace-nowrap ml-4">Yesterday</span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Students really liked the stir-fry but suggested more broccoli next time.</p>
                  <p className="text-sm font-semibold text-blue-500 mt-2">SDN 05 Petogogan</p>
                </div>
              </div>

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
