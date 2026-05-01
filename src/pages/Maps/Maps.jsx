import { useCallback, useEffect, useMemo, useState } from "react";
import L from "leaflet";
import { FiArrowRight, FiMapPin, FiSearch, FiUsers, FiX } from "react-icons/fi";
import { LuChefHat, LuGraduationCap, LuRoute } from "react-icons/lu";
import { MapContainer, Marker, Polyline, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useMapsPage } from "../../hooks/useMapsPage";

const defaultCenter = [-6.225, 106.795];
const filters = [
  { value: "all", label: "Semua" },
  { value: "sppg", label: "Dapur SPPG" },
  { value: "school", label: "Sekolah" },
];

function getMarkerIcon(type, isSelected) {
  return L.divIcon({
    className: "",
    html: `<span class="map-dot map-dot-${type} ${isSelected ? "map-dot-selected" : ""}">${
      type === "sppg" ? '<span class="map-dot-glyph">D</span>' : '<span class="map-dot-glyph">S</span>'
    }</span>`,
    iconSize: type === "sppg" ? [28, 28] : [24, 24],
    iconAnchor: type === "sppg" ? [14, 14] : [12, 12],
  });
}

const hasValidLatLng = (item) =>
  Number.isFinite(item?.lat) && Number.isFinite(item?.lng);

function getPosition(item) {
  return [item.lat, item.lng];
}

function MapController({ selectedItem }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedItem || !hasValidLatLng(selectedItem)) return;
    map.flyTo(getPosition(selectedItem), 14, { duration: 0.65 });
  }, [map, selectedItem]);

  return null;
}

function MapProjection({ selectedItem, onClear, onPointChange }) {
  const map = useMap();

  const updatePoint = useCallback(() => {
    if (!selectedItem || !hasValidLatLng(selectedItem)) {
      onPointChange(null);
      return;
    }

    const point = map.latLngToContainerPoint(getPosition(selectedItem));
    onPointChange({ x: point.x, y: point.y });
  }, [map, onPointChange, selectedItem]);

  useEffect(() => {
    updatePoint();
  }, [updatePoint]);

  useMapEvents({
    click: onClear,
    move: updatePoint,
    zoom: updatePoint,
    resize: updatePoint,
  });

  return null;
}

function SearchBar({ items, onSelect }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const normalizedQuery = query.toLowerCase();

    return items
      .filter((item) => item.name.toLowerCase().includes(normalizedQuery))
      .slice(0, 6);
  }, [items, query]);

  return (
    <div className="absolute left-5 top-5 z-[500] w-[min(360px,calc(100vw-40px))]">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
        <div className="flex h-12 items-center gap-3 px-4">
          <FiSearch className="h-5 w-5 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari SPPG atau Sekolah"
            className="h-full min-w-0 flex-1 text-sm font-medium text-slate-800 outline-none placeholder:text-slate-400"
          />
        </div>

        {results.length > 0 ? (
          <div className="border-t border-slate-100 p-2">
            {results.map((item) => (
              <button
                key={`${item.type}-${item.id}`}
                type="button"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left hover:bg-slate-50"
                onClick={() => {
                  onSelect(item.type, item.id);
                  setQuery(item.name);
                }}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    item.type === "sppg" ? "bg-emerald-500" : "bg-blue-500"
                  }`}
                />
                <span>
                  <span className="block text-sm font-bold text-slate-900">{item.name}</span>
                  <span className="block text-xs font-medium text-slate-500">{item.location}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function FilterBar({ value, onChange }) {
  return (
    <div className="absolute left-[410px] top-5 z-[500] flex rounded-xl border border-slate-200 bg-white p-1 shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
      {filters.map((filter) => (
        <button
          key={filter.value}
          type="button"
          className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
            value === filter.value
              ? "bg-[#136DEC] text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          onClick={() => onChange(filter.value)}
        >
          {filter.value === "sppg" ? <span className="h-2 w-2 rounded-full bg-emerald-500" /> : null}
          {filter.value === "school" ? <span className="h-2 w-2 rounded-full bg-blue-500" /> : null}
          {filter.label}
        </button>
      ))}
    </div>
  );
}

function MarkerLayer({ items, selectedItem, onSelect }) {
  return (
    <>
      {items.map((item) => (
        <Marker
          key={item.id}
          position={getPosition(item)}
          icon={getMarkerIcon(item.type, selectedItem?.id === item.id)}
          eventHandlers={{
            click: (event) => {
              event.originalEvent?.stopPropagation?.();
              onSelect(item.type, item.id);
            },
          }}
        />
      ))}
    </>
  );
}

function PopupCard({ item, point, onClose }) {
  if (!item || !point) return null;

  const isSppg = item.type === "sppg";
  const profileLabel = isSppg ? "Lihat Profil SPPG" : "Lihat Profil Sekolah";

  return (
    <article
      className="pointer-events-auto absolute z-[650] w-[340px] -translate-x-1/2 -translate-y-[calc(100%+24px)] overflow-visible rounded-xl bg-white shadow-[0_18px_40px_rgba(15,23,42,0.22)]"
      style={{ left: point.x, top: point.y }}
    >
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="h-[128px] bg-[linear-gradient(135deg,#f8f6ef_0%,#e7dac8_50%,#c7b59c_100%)]">
          <div className="h-full w-full bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.8)_0%,rgba(255,255,255,0)_36%)]" />
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span
                className={`inline-flex rounded-md px-2 py-1 text-[10px] font-black uppercase tracking-wide ${
                  isSppg ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"
                }`}
              >
                {isSppg ? "Dapur SPPG" : "Sekolah"}
              </span>
              <h2 className="mt-2 truncate text-lg font-black text-slate-950">{item.name}</h2>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label="Tutup detail"
              onClick={onClose}
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 text-sm font-semibold text-slate-600">
            <div className="flex items-center gap-2">
              <FiMapPin className="h-4 w-4 shrink-0 text-slate-500" />
              <span>{item.location}</span>
            </div>
            <div className="flex items-center gap-2">
              {isSppg ? (
                <FiUsers className="h-4 w-4 shrink-0 text-slate-500" />
              ) : (
                <LuRoute className="h-4 w-4 shrink-0 text-slate-500" />
              )}
              <span>{item.info}</span>
            </div>
            <div className="flex items-center gap-2">
              {isSppg ? (
                <LuChefHat className="h-4 w-4 shrink-0 text-slate-500" />
              ) : (
                <LuGraduationCap className="h-4 w-4 shrink-0 text-slate-500" />
              )}
              <span>{item.capacity}</span>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#136DEC] text-sm font-black text-white shadow-[0_8px_18px_rgba(19,109,236,0.28)] hover:bg-blue-700"
          >
            {profileLabel}
            <FiArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <span className="absolute left-1/2 top-full h-4 w-4 -translate-x-1/2 -translate-y-2 rotate-45 border-b border-r border-slate-200 bg-white shadow-[8px_8px_16px_rgba(15,23,42,0.08)]" />
    </article>
  );
}

function Legend() {
  return (
    <div className="absolute bottom-5 left-5 z-[500] rounded-xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.14)]">
      <p className="mb-3 text-xs font-bold text-slate-500">Simbol Peta</p>
      <div className="space-y-2 text-sm font-semibold text-slate-700">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          Dapur SPPG
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-500" />
          Sekolah
        </div>
        <div className="flex items-center gap-2">
          <span className="h-0.5 w-8 border-t-2 border-[#136DEC]" />
          Rute Pengiriman
        </div>
      </div>
    </div>
  );
}

export default function Maps() {
  const { sppgItems: sppgData, schoolItems: schoolData, isLoading, isUsingFallback } = useMapsPage();
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [popupPoint, setPopupPoint] = useState(null);

  const sppgItems = useMemo(
    () => sppgData.map((item) => ({ ...item, type: "sppg" })),
    [sppgData],
  );
  const schoolItems = useMemo(
    () => schoolData.map((item) => ({ ...item, type: "school" })),
    [schoolData],
  );
  const validSppgItems = useMemo(
    () => sppgItems.filter(hasValidLatLng),
    [sppgItems],
  );
  const validSchoolItems = useMemo(
    () => schoolItems.filter(hasValidLatLng),
    [schoolItems],
  );
  const allItems = useMemo(() => [...sppgItems, ...schoolItems], [schoolItems, sppgItems]);

  const selectedItem = useMemo(() => {
    if (!selected) return null;
    return allItems.find((item) => item.type === selected.type && item.id === selected.id) ?? null;
  }, [allItems, selected]);

  const visibleItems = useMemo(() => {
    if (filter === "sppg") return validSppgItems;
    if (filter === "school") return validSchoolItems;
    return [...validSppgItems, ...validSchoolItems];
  }, [filter, validSchoolItems, validSppgItems]);

  const routeLines = useMemo(() => {
    if (!selectedItem) return [];

    if (selectedItem.type === "sppg") {
      return selectedItem.schools
        .map((schoolId) => validSchoolItems.find((school) => school.id === schoolId))
        .filter(Boolean)
        .map((school) => [getPosition(selectedItem), getPosition(school)]);
    }

    const sppg = validSppgItems.find((item) => item.id === selectedItem.sppgId);
    return sppg && hasValidLatLng(selectedItem)
      ? [[getPosition(sppg), getPosition(selectedItem)]]
      : [];
  }, [selectedItem, validSchoolItems, validSppgItems]);

  const handleSelect = (type, id) => {
    setSelected({ type, id });
  };

  const clearSelection = useCallback(() => {
    setSelected(null);
    setPopupPoint(null);
  }, []);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-950">
      <MapContainer center={defaultCenter} zoom={12} zoomControl={false} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController selectedItem={selectedItem} />
        <MapProjection selectedItem={selectedItem} onClear={clearSelection} onPointChange={setPopupPoint} />

        {routeLines.map((positions, index) => (
          <Polyline
            key={index}
            positions={positions}
            pathOptions={{
              color: "#136DEC",
              weight: 4,
              opacity: 0.85,
            }}
          />
        ))}

        <MarkerLayer items={visibleItems} selectedItem={selectedItem} onSelect={handleSelect} />
      </MapContainer>

      <SearchBar items={allItems} onSelect={handleSelect} />
      <FilterBar value={filter} onChange={setFilter} />
      <PopupCard item={selectedItem} point={popupPoint} onClose={clearSelection} />
      <Legend />
      {isLoading ? (
        <div className="absolute right-5 top-5 z-[500] rounded-xl bg-white/90 px-3 py-2 text-xs font-bold text-slate-700 shadow">
          Memuat data peta...
        </div>
      ) : null}
      {isUsingFallback ? (
        <div className="absolute right-5 top-16 z-[500] rounded-xl bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 shadow">
          Menampilkan data contoh
        </div>
      ) : null}
    </main>
  );
}
