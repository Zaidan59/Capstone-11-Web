import { useMemo, useState } from "react";
import { useHomepageMap } from "../../../hooks/useHomepageMap";

const Maps = () => {
  const { mapData, isLoading, isUsingFallback } = useHomepageMap();
  const kitchens = useMemo(() => mapData?.kitchens ?? [], [mapData]);
  const schools = useMemo(() => mapData?.schools ?? [], [mapData]);
  const [activeKitchenId, setActiveKitchenId] = useState(null);
  const [activeSchoolId, setActiveSchoolId] = useState(null);

  const selectedKitchen = useMemo(
    () => kitchens.find((kitchen) => kitchen.id === activeKitchenId) ?? null,
    [activeKitchenId, kitchens],
  );

  const selectedSchool = useMemo(
    () => schools.find((school) => school.id === activeSchoolId) ?? null,
    [activeSchoolId, schools],
  );

  const activeCard = selectedKitchen
    ? { type: "kitchen", data: selectedKitchen }
    : selectedSchool
      ? { type: "school", data: selectedSchool }
      : null;

  return (
    <section className="bg-slate-50 py-12">
      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 md:text-4xl">Peta Sebaran Dapur &amp; Sekolah</h2>
            <p className="mt-2 text-base text-slate-600">
              Pilih wilayah untuk melihat detail SPPG dan unit sekolah terdaftar.
            </p>
          </div>

          <a
            href="/peta"
            className="inline-flex w-fit items-center gap-2 border-b-2 border-[#136DEC] pb-1 text-base font-bold text-[#136DEC]"
          >
            View Full Map
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H9V2H2V16H16V9H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM6.7 12.7L5.3 11.3L14.6 2H11V0H18V7H16V3.4L6.7 12.7Z"
                fill="#136DEC"
              />
            </svg>
          </a>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-slate-300 bg-slate-100">
          <div className="relative h-[560px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#dbeafe_0%,#f1f5f9_45%,#e2e8f0_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.25)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.25)_1px,transparent_1px)] bg-[size:64px_64px]" />

            {isLoading ? (
              <div className="absolute left-4 top-4 z-20 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow">
                Memuat data peta...
              </div>
            ) : null}

            {isUsingFallback ? (
              <div className="absolute left-4 top-4 z-20 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 shadow">
                Menampilkan data contoh
              </div>
            ) : null}

            {schools.map((school) => (
              <button
                key={school.id}
                type="button"
                className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-blue-500 shadow-lg transition-transform hover:scale-110 ${
                  school.id === activeSchoolId ? "scale-110 ring-4 ring-blue-200" : ""
                }`}
                style={{ left: school.left, top: school.top }}
                title={school.name ?? "Sekolah"}
                onClick={() => {
                  setActiveSchoolId((current) => (current === school.id ? null : school.id));
                  setActiveKitchenId(null);
                }}
              />
            ))}

            {kitchens.map((kitchen) => (
              <button
                key={kitchen.id}
                type="button"
                className={`absolute h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-emerald-500 shadow-lg transition-transform hover:scale-110 ${
                  kitchen.id === activeKitchenId ? "scale-110 ring-4 ring-emerald-200" : ""
                }`}
                style={{ left: kitchen.left, top: kitchen.top }}
                title={kitchen.name}
                onClick={() => {
                  setActiveKitchenId((current) => (current === kitchen.id ? null : kitchen.id));
                  setActiveSchoolId(null);
                }}
              />
            ))}

            {activeCard ? (
              <article className="absolute left-4 right-4 top-4 z-10 w-auto rounded-xl border border-slate-200 bg-white shadow-xl md:left-auto md:right-6 md:w-[340px]">
              <div className="h-28 rounded-t-xl bg-gradient-to-r from-[#136DEC] to-[#22C55E]" />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        activeCard.type === "kitchen" ? "bg-[#e4f8e1] text-[#2b7d20]" : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {activeCard.type === "kitchen" ? "Dapur SPPG" : "Sekolah"}
                    </span>
                    <p className="mt-2 text-xl font-bold text-slate-900">
                      {activeCard.data?.name ??
                        (activeCard.type === "kitchen" ? "Data SPPG belum tersedia" : "Data sekolah belum tersedia")}
                    </p>
                  </div>
                  <button
                    className="text-slate-400 hover:text-slate-600"
                    type="button"
                    aria-label="Tutup detail"
                    onClick={() => {
                      setActiveKitchenId(null);
                      setActiveSchoolId(null);
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z"
                        fill="currentColor"
                      />
                    </svg>
                  </button>
                </div>

                <ul className="space-y-2 text-sm font-medium text-slate-600">
                  <li>{activeCard.data?.city ?? "Wilayah belum tersedia"}</li>
                  <li>
                    {activeCard.type === "kitchen"
                      ? activeCard.data?.coverage ?? "Cakupan layanan belum tersedia"
                      : `Jenjang: ${activeCard.data?.level ?? "Belum tersedia"}`}
                  </li>
                  <li>
                    {activeCard.type === "kitchen"
                      ? `Kapasitas: ${activeCard.data?.capacity ?? "Belum tersedia"}`
                      : `Jumlah siswa: ${activeCard.data?.students ?? "Belum tersedia"}`}
                  </li>
                </ul>

                <button
                  type="button"
                  className="w-full rounded-lg bg-[#136DEC] py-3 text-base font-bold text-white shadow-[0px_4px_6px_-1px_rgba(19,109,236,0.2),0px_2px_4px_-2px_rgba(19,109,236,0.2)]"
                >
                  {activeCard.type === "kitchen" ? "Lihat Profil SPPG" : "Lihat Profil Sekolah"}
                </button>
              </div>
              </article>
            ) : null}

            <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-white/90 p-2 text-xs font-bold text-slate-900 md:bottom-6 md:right-6">
              <span className="inline-block h-3 w-3 rounded-full bg-blue-500" />
              Sekolah
              <span className="ml-2 inline-block h-3 w-3 rounded-full bg-green-500" />
              Dapur SPPG
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Maps;
