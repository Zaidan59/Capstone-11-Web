import React from "react";
import prabowo from "../../../assets/prabowo.png";
import icon from "../../../assets/Icon.png";

export default function Hero() {
  return (
    <main className="bg-slate-50">
      <section className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="w-full lg:w-1/2 space-y-5 lg:space-y-7">
          <span className="inline-flex items-center rounded-full text-blue-700 text-[12px] font-bold px-3 md:px-4 py-1 md:py-2"></span>
          <h1 className="max-w-xl text-[62px] sm:text-5xl lg:text-[62px] font-extrabold tracking-tight leading-[0.88] text-slate-950">
            Transparansi
            <br />
            <span className="block">
              Program <span className="text-blue-700">Makan</span>
            </span>
            <span className="block text-blue-700">Bergizi Gratis</span>
            <span className="block">Untuk Semua</span>
          </h1>
          <p className="max-w-xl text-gray-600 text-[18px] md:text-lg mt-4 md:mt-6 leading-relaxed">
            Platform layanan untuk monitoring menu sekolah dan operasional{" "}
            <br />
            dapur Satuan Pelayanan Pemenuhan Gizi (SPPG) secara real-time <br />
            untuk memastikan kualitas nutrisi anak bangsa yang optimal.
          </p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-6 md:mt-8">
            <button className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold text-sm transition hover:shadow-[0_8px_40px_0_rgba(22,96,255,0.84)]">
              Lihat Peta Dapur MBG
              <img src={icon} alt="icon maps" className="ml-2 h-4 w-4" />
            </button>
            <button
              onClick={() => {
                document
                  .getElementById("section-about")
                  .scrollIntoView({ behavior: "smooth" });
              }}
              className="inline-flex items-center justify-center bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold text-sm transition hover:shadow-[0_8px_40px_0_rgba(22,96,255,0.84)]"
            >
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex justify-center mt-8 lg:mt-0">
          <img
            src={prabowo}
            alt="Dapur MBG"
            className="rounded-[28px] border-4 border-blue-100 shadow-[0_20px_80px_rgba(15,23,42,0.08)] w-full max-w-[620px] h-auto object-cover"
          />
        </div>
      </section>
    </main>
  );
}
