import React from 'react';
import IconCalendar from '../../assets/Icon_calendar.png'; 
import IconMap from '../../assets/Icon_map.png';
import IconMakan from '../../assets/Icon_makan.png';
import IconTruck from '../../assets/Icon_truck.png';
import IconCentang from '../../assets/Icon_centang.png';
import IconTime from '../../assets/Icon_time.png';
import logo from '../../assets/logo.png';
import iconProfile from '../../assets/Icon_profile.png';

const NotificationSPPG = () => {
  const displayName = "Admin SPPG";

  const notifications = [
    {
      id: 1,
      school: "SMA Pangudi Luhur Jakarta",
      status: "Dikirim",
      statusColor: "bg-orange-100 text-orange-600",
      accentColor: "#FB923C",
      typeIcon: IconMakan,
      date: "25 Mei",
      menu: "Ikan Bandeng Presto",
      feedback: "Siswa sangat suka ikannya, durinya benar-benar lunak. Terima kasih tim dapur!",
      buttonLabel: "Tandai sebagai Diterima",
      icon: (
        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      )
    },
    {
      id: 2,
      school: "SMP Negeri 240 Jakarta",
      status: "Diterima",
      statusColor: "bg-blue-100 text-blue-600",
      accentColor: "#2563EB",
      typeIcon: IconMakan,
      date: "25 Mei",
      menu: "Ayam Teriyaki & Nasi Putih",
      feedback: "Ayam hari ini agak keras, tapi bumbunya sudah pas. Porsi nasi cukup.",
      buttonLabel: "Tandai sebagai Telah Ditinjau",
      isReviewed: true
    },
    {
      id: 3,
      school: "SDN 03 Kebayoran Lama",
      status: "Diterima",
      statusColor: "bg-blue-100 text-blue-600",
      accentColor: "#2563EB",
      typeIcon: IconTruck,
      date: "25 Mei",
      menu: "Ayam Goreng & Nasi Merah",
      feedback: "MBG datang telat 15 menit, siswa ada yang sakit maag.",
      buttonLabel: "Tandai sebagai Telah Ditinjau",
      isReviewed: true
    },
    {
      id: 4,
      school: "SMA Cenderawasih 1 Jakarta",
      status: "Ditinjau",
      statusColor: "bg-green-100 text-green-600",
      accentColor: "#4ADE80",
      typeIcon: IconMakan,
      date: "25 Mei",
      menu: "Telur Balado",
      feedback: "Sesuai standar. Packing rapi dan suhu makanan masih hangat saat sampai.",
      isCompleted: true
    }
  ];

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
            <div className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">
              <img src={iconProfile} alt="" />
            </div>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <div className="flex-1 p-8">
        <div className="max-w-5xl mx-auto">

          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex justify-between items-center mb-10">
            <div>
              <h1 className="text-2xl font-bold text-[#1A2B4C]">SPPG Kebayoran Baru</h1>
              <p className="text-gray-400 flex items-center mt-1 text-sm">
                <img src={IconMap} className="w-4 mr-2 grayscale opacity-50" alt="map" />
                Jakarta Selatan, Indonesia
              </p>
            </div>
            <div className="bg-[#F4F8FF] px-6 py-3 rounded-xl flex items-center border border-blue-50">
              <img src={IconCalendar} className="w-8 mr-4" alt="calendar" />
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase">Tanggal Operasional</p>
                <p className="text-sm font-extrabold text-[#1A2B4C]">SENIN, 25 MEI 2026</p>
              </div>
            </div>
          </div>

          {/* List Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#1A2B4C]">Notifikasi Umpan Balik</h2>
            <div className="flex items-center gap-3">
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-4 py-2 rounded-full">3 TERTUNDA</span>
              <span className="bg-gray-100 text-gray-500 text-xs font-bold px-4 py-2 rounded-full">12 TOTAL HARI INI</span>
            </div>
          </div>

          {/* List */}
          <div className="space-y-6">
            {notifications.map((item) => (
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
                        {item.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <img src={item.typeIcon} className="w-4 opacity-60" alt="icon" />
                      <p className="text-sm text-gray-400">{item.date} — {item.menu}</p>
                    </div>
                    <div className="bg-[#F8F9FA] p-4 rounded-xl text-gray-600 text-sm">
                      "{item.feedback}"
                    </div>
                  </div>

                  {/* Kanan */}
                  <div className="flex flex-col justify-center gap-3 w-[220px] shrink-0">
                    {item.isCompleted ? (
                      <>
                        <div className="flex items-center justify-center text-[#10B981] font-bold text-[13px] mb-1">
                          <img src={IconCentang} className="w-4 h-4 mr-2" alt="done" />
                          Masalah Terselesaikan
                        </div>
                        <button className="w-full h-[40px] border border-gray-200 rounded-xl text-gray-500 text-[12px] font-bold hover:bg-gray-50 transition-colors">
                          Arsip
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="w-full h-[40px] bg-[#2563EB] text-white text-[12px] rounded-xl font-bold flex items-center justify-center shadow-[0_2px_8px_rgba(37,99,235,0.2)] hover:bg-[#1d4ed8] active:scale-[0.98] transition-all">
                          {item.isReviewed ? (
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            item.icon
                          )}
                          {item.buttonLabel}
                        </button>
                        <button className="w-full h-[40px] border border-gray-200 bg-white rounded-xl text-gray-500 text-[12px] font-bold hover:bg-gray-50 transition-colors">
                          Lihat Detail
                        </button>
                      </>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Bottom Stats */}
          <div className="grid grid-cols-2 gap-6 mt-12 max-w-2xl">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                <img src={IconTime} className="w-6" alt="time" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Waktu Respon Rata - Rata</p>
              <h4 className="text-2xl font-black text-[#1A2B4C] mb-2">18 min</h4>
              <p className="text-[#10B981] text-sm font-medium">↑ 12% lebih cepat dari minggu lalu</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center mb-5">
                <img src={IconCentang} className="w-6" alt="done" />
              </div>
              <p className="text-gray-400 text-sm mb-1">Terselesaikan</p>
              <h4 className="text-2xl font-black text-[#1A2B4C] mb-2">9 / 12</h4>
              <p className="text-gray-400 text-sm">3 sekolah tertunda untuk ditinjau</p>
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