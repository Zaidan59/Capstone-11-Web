import { useState } from 'react';
import { HiOutlineChevronDown } from "react-icons/hi2";

function FAQ() {
  const faqs = [
    {
      question: 'Apa tujuan utama dari platform transparansi MBG ini?',
      answer: 'Platform ini dibangun untuk memastikan setiap orang tua, guru, dan masyarakat umum dapat memantau kualitas gizi, ketepatan waktu distribusi, dan higienitas proses masak Program Makan Bergizi Gratis secara transparan.',
    },
    {
      question: 'Siapa saja yang memiliki akses ke data platform?',
      answer: 'Platform SIMBA dapat diakses oleh masyarakat umum dan orang tua siswa secara terbuka untuk memantau menu serta gizi anak. Selain itu, akses khusus (dashboard) diberikan kepada pengelola dapur SPPG dan pihak sekolah untuk kebutuhan pelaporan dan operasional program MBG.',
    },
    {
      question: 'Dari mana sumber data menu dan dapur ini berasal?',
      answer: 'Seluruh data menu dan informasi gizi diinput langsung oleh pengelola dapur SPPG (Satuan Pelayanan Pemenuhan Gizi) secara mingguan. Selain itu, data realisasi distribusi didukung oleh laporan bukti foto dan umpan balik yang diunggah oleh pihak sekolah setiap harinya.',
    },
    {
      question: 'Bagaimana cara memberikan laporan jika ada ketidaksesuaian?',
      answer: 'Laporan ketidaksesuaian dilakukan oleh pihak sekolah melalui dashboard khusus dengan mengunggah bukti foto makanan harian dan mengisi catatan feedback. Laporan ini akan langsung diterima oleh pihak dapur (SPPG) untuk segera ditindaklanjuti sebagai bentuk evaluasi kualitas layanan.',
    }
  ];

  const [openIdx, setOpenIdx] = useState(-1);

  const toggleFaq = (idx) => {
    setOpenIdx(openIdx === idx ? -1 : idx);
  };

  return (
    <div className="bg-white min-h-screen text-slate-900">
      
      {/* BAGIAN KONTEN UTAMA FAQ */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        
        <h1 className="text-[40px] font-bold text-center mt-8 mb-12 text-[#1a202c]">
          Pertanyaan Umum
        </h1>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-slate-200 rounded-2xl bg-white">
              <button 
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full px-6 py-5 text-left focus:outline-none"
              >
                <h3 className="text-[17px] font-semibold text-[#1a202c] pr-6">
                  {faq.question}
                </h3>
                
                {/* IKON PANAH MENGGUNAKAN LIBRARY */}
                <HiOutlineChevronDown 
                  className={`w-6 h-6 text-slate-400 transform transition-transform duration-300 flex-shrink-0 ${openIdx === index ? 'rotate-180' : ''}`} 
                />
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openIdx === index ? 'max-h-96' : 'max-h-0'}`}>
                <div className="px-6 pb-5 text-slate-600 leading-relaxed text-[15px]">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BAGIAN FOOTER */}
      <footer className="bg-[#0a2551] text-white mt-24 py-16 px-10">
        <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Kolom 1: SIMBA Logo & Deskripsi */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Logo SIMBA" className="w-16 h-auto object-contain" />
              <h2 className="text-xl font-bold">SIMBA</h2>
            </div>
            <p className="text-sm text-slate-300 mt-3 leading-relaxed pr-4">
              Mengawal kualitas nutrisi generasi masa depan melalui keterbukaan informasi dan pengawasan publik berbasis teknologi digital.
            </p>
            
            {/* IKON SOSMED */}
            <div className="flex gap-4 pt-2 text-slate-300 items-center">
              <a href="#" className="group transition-colors">
                <img 
                  src="/globe.png" 
                  alt="Ikon Web" 
                  className="w-5 h-5 transition-all duration-300 group-hover:brightness-200" 
                />
              </a>
              <a href="#" className="group transition-colors">
                <img 
                  src="/@.png" 
                  alt="Ikon Email" 
                  className="w-5 h-5 transition-all duration-300 group-hover:brightness-200" 
                />
              </a>
              <a href="#" className="group transition-colors">
                <img 
                  src="/call.png" 
                  alt="Ikon Telepon" 
                  className="w-5 h-5 transition-all duration-300 group-hover:brightness-200" 
                />
              </a>
            </div>
          </div>

          <div className="space-y-4 pt-1">
            <h4 className="font-bold text-lg mb-6">Peta Situs</h4>
            <ul className="space-y-4 text-slate-300">
              <li><a href="#" className="hover:text-white hover:underline">Dashboard Utama</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Peta Interaktif</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Database Sekolah</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Daftar Dapur SPPG</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Artikel & Edukasi</a></li>
            </ul>
          </div>

          <div className="space-y-4 pt-1">
            <h4 className="font-bold text-lg mb-6">Layanan Publik</h4>
            <ul className="space-y-4 text-slate-300">
              <li><a href="#" className="hover:text-white hover:underline">Pusat Bantuan</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Form Pelaporan</a></li>
              <li><a href="#" className="hover:text-white hover:underline">Standar Gizi Nasional</a></li>
              <li><a href="#" className="hover:text-white hover:underline">FAQ Program</a></li>
            </ul>
          </div>

          {/* Kolom 4: Kontak & Lokasi */}
          <div className="space-y-4 pt-1 md:justify-self-end">
            <h4 className="font-bold text-lg mb-6">Kontak & Lokasi</h4>
            <div className="space-y-5 text-slate-300 text-[15px]">
              
              {/* IKON LOKASI PNG (Diperbaiki:items-start dan pt-0.5,w-3.5 h-3.5) */}
              <div className="flex items-start gap-3">
                <img src="/location.png" alt="Ikon Lokasi" className="w-3.5 h-3.5 pt-0.5 flex-shrink-0 object-contain" />
                <span>Jl. Merdeka Barat No. 1, Jakarta Pusat</span>
              </div>
              
              {/* IKON EMAIL PNG (Diperbaiki:items-start dan pt-0.5,w-3.5 h-3.5) */}
              <div className="flex items-start gap-3">
                <img src="/letter.png" alt="Ikon Email" className="w-3.5 h-3.5 pt-0.5 flex-shrink-0 object-contain" />
                <a href="mailto:info@mbg.go.id" className="hover:text-white hover:underline">info@mbg.go.id</a>
              </div>
              
              {/* IKON TELEPON PNG (Diperbaiki:items-start dan pt-0.5,w-3.5 h-3.5) */}
              <div className="flex items-start gap-3">
                <img src="/bluecall.png" alt="Ikon Telepon" className="w-3.5 h-3.5 pt-0.5 flex-shrink-0 object-contain" />
                <span>1500-XXX (Layanan Bebas Pulsa)</span>
              </div>
              
            </div>
          </div>

        </div>

        {/* BAGIAN BAWAH FOOTER */}
        <div className="w-full border-t border-slate-700 mt-16 pt-8 flex justify-between items-center text-sm text-slate-400">
          <p>© 2024 Badan Gizi Nasional - Pemerintah Republik Indonesia.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white hover:underline">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white hover:underline">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white hover:underline">Aksesibilitas</a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default FAQ;