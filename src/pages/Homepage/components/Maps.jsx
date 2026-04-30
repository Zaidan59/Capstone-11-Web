import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Polyline, Popup, useMap } from "react-leaflet";
import { useHomepageMap } from "../../../hooks/useHomepageMap";

const Maps = () => {
  const { mapData, isLoading, isUsingFallback } = useHomepageMap();
  const kitchens = useMemo(() => mapData?.kitchens ?? [], [mapData]);
  const schools = useMemo(() => mapData?.schools ?? [], [mapData]);
  const links = useMemo(() => mapData?.links ?? [], [mapData]);

  const validKitchens = useMemo(
    () => kitchens.filter((item) => Number.isFinite(item?.lat) && Number.isFinite(item?.lng)),
    [kitchens],
  );

  const validSchools = useMemo(
    () => schools.filter((item) => Number.isFinite(item?.lat) && Number.isFinite(item?.lng)),
    [schools],
  );

  const mapPoints = useMemo(
    () =>
      [...validKitchens, ...validSchools].map((item) => ({
        lat: item.lat,
        lng: item.lng,
      })),
    [validKitchens, validSchools],
  );

  const mapCenter = mapPoints.length > 0
    ? [mapPoints[0].lat, mapPoints[0].lng]
    : [-6.2, 106.8];

  const linkLines = useMemo(() => {
    if (!links.length) return [];

    const kitchenById = new Map(validKitchens.map((item) => [String(item.id), item]));
    const schoolById = new Map(validSchools.map((item) => [String(item.id), item]));

    return links
      .map((link) => {
        const kitchen = kitchenById.get(String(link.kitchenId));
        const school = schoolById.get(String(link.schoolId));

        if (!kitchen || !school) return null;
        if (!Number.isFinite(kitchen.lat) || !Number.isFinite(kitchen.lng)) return null;
        if (!Number.isFinite(school.lat) || !Number.isFinite(school.lng)) return null;

        return [
          [kitchen.lat, kitchen.lng],
          [school.lat, school.lng],
        ];
      })
      .filter(Boolean);
  }, [validKitchens, validSchools, links]);

  const popupImage =
    "https://images.unsplash.com/photo-1502005097973-6a7082348e28?auto=format&fit=crop&w=900&q=80";

  const PopupCloseButton = () => {
    const map = useMap();

    return (
      <button
        type="button"
        className="absolute right-5 top-5 text-slate-400 transition hover:text-slate-600"
        aria-label="Tutup popup"
        onClick={() => map.closePopup()}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M6 6L18 18M18 6L6 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
    );
  };

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
          <div className="relative h-[560px] isolate">
            <MapContainer
              center={mapCenter}
              zoom={10}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {linkLines.map((line, index) => (
                <Polyline
                  key={`link-${index}`}
                  positions={line}
                  pathOptions={{ color: "#60A5FA", weight: 2, opacity: 0.6 }}
                />
              ))}

              {validSchools.map((school) => (
                <CircleMarker
                  key={school.id}
                  center={[school.lat, school.lng]}
                  radius={6}
                  pathOptions={{ color: "#2563EB", fillColor: "#3B82F6", fillOpacity: 0.9 }}
                >
                  <Popup closeButton={false}  autoPan>
                    <div className="w-[300px] bg-white shadow-[0_24px_50px_rgba(15,23,42,0.18)]">
                      <div
                        className="h-[140px] w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${popupImage})` }}
                      />
                      <div className="relative space-y-3 pl-6 pr-8 pb-5 pt-4">
                        <PopupCloseButton />
                        <span className="inline-flex rounded-lg bg-blue-100 px-3 py-1 text-[12px] font-bold uppercase text-blue-700">
                          Sekolah
                        </span>
                        <p className="text-[22px] font-bold text-slate-900">
                          {school?.name ?? "Data sekolah belum tersedia"}
                        </p>
                        <ul className="space-y-2 text-sm font-medium text-slate-600">
                          <li className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M12 21s-6-5.1-6-10a6 6 0 1112 0c0 4.9-6 10-6 10z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                                <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                              </svg>
                            </span>
                            {school?.city ?? "Wilayah belum tersedia"}
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M4 10l8-5 8 5-8 5-8-5z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                                <path
                                  d="M4 10v6l8 5 8-5v-6"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                              </svg>
                            </span>
                            Jenjang: {school?.level ?? "Belum tersedia"}
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M6 9h12M6 15h12M4 6h16v12H4z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                              </svg>
                            </span>
                            Jumlah siswa: {school?.students ?? "Belum tersedia"}
                          </li>
                        </ul>
                        <button
                          type="button"
                          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#136DEC] py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(19,109,236,0.3)]"
                        >
                          Lihat Profil Sekolah
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M5 12h14M13 6l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {validKitchens.map((kitchen) => (
                <CircleMarker
                  key={kitchen.id}
                  center={[kitchen.lat, kitchen.lng]}
                  radius={7}
                  pathOptions={{ color: "#10B981", fillColor: "#34D399", fillOpacity: 0.9 }}
                >
                  <Popup closeButton={false} offset={[0, 0]} autoPan>
                    <div className="w-[300px] rounded-[22px] bg-white shadow-[0_24px_50px_rgba(15,23,42,0.18)]">
                      <div
                        className="h-[140px] w-full bg-cover bg-center"
                        style={{ backgroundImage: `url(${popupImage})` }}
                      />
                      <div className="relative space-y-3 pl-6 pr-8 pb-5 pt-4">
                        <PopupCloseButton />
                        <span className="inline-flex rounded-lg bg-[#e4f8e1] px-3 py-1 text-[12px] font-bold uppercase text-[#2b7d20]">
                          Dapur SPPG
                        </span>
                        <p className="text-[22px] font-bold text-slate-900">
                          {kitchen?.name ?? "Data SPPG belum tersedia"}
                        </p>
                        <ul className="space-y-2 text-sm font-medium text-slate-600">
                          <li className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M12 21s-6-5.1-6-10a6 6 0 1112 0c0 4.9-6 10-6 10z"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                />
                                <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.6" />
                              </svg>
                            </span>
                            {kitchen?.city ?? "Wilayah belum tersedia"}
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M5 10h14M7 10c0-3 2-5 5-5s5 2 5 5M7 10v6a2 2 0 002 2h6a2 2 0 002-2v-6"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                            {kitchen?.coverage ?? "Cakupan layanan belum tersedia"}
                          </li>
                          <li className="flex items-center gap-2">
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-100">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                                <path
                                  d="M4 7h16M6 7v10a2 2 0 002 2h8a2 2 0 002-2V7"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                                <path
                                  d="M9 11h6M9 15h6"
                                  stroke="currentColor"
                                  strokeWidth="1.6"
                                  strokeLinecap="round"
                                />
                              </svg>
                            </span>
                            Kapasitas: {kitchen?.capacity ?? "Belum tersedia"}
                          </li>
                        </ul>
                        <button
                          type="button"
                          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#136DEC] py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(19,109,236,0.3)]"
                        >
                          Lihat Profil SPPG
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <path
                              d="M5 12h14M13 6l6 6-6 6"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </MapContainer>

            {isLoading ? (
              <div className="absolute left-4 top-4 z-20 rounded-lg bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow">
                Memuat data peta...
              </div>
            ) : null}

            {isUsingFallback ? (
              <div className="absolute left-16 top-4 z-20 rounded-lg bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 shadow">
                Menampilkan data contoh
              </div>
            ) : null}

            <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2 rounded-lg bg-white/90 p-2 text-xs font-bold text-slate-900 md:bottom-6 md:right-6">
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
