import { getSchools, getSPPG } from "../../../services/mapsService";
import { getResponseArray } from "../../../utils/mapUtils";

export const fallbackMapData = {
  kitchens: [
    {
      id: "sppg-jkt-001",
      name: "Dapur Umum Sehat Jakarta",
      city: "Jakarta Pusat, DKI Jakarta",
      coverage: "Melayani 2 sekolah",
      capacity: "5,000 MBG/hari",
      lat: -6.2088,
      lng: 106.8456,
      left: "42%",
      top: "30%",
    },
    {
      id: "sppg-bks-001",
      name: "Dapur Gizi Nusantara Bekasi",
      city: "Bekasi Selatan, Jawa Barat",
      coverage: "Melayani 2 sekolah",
      capacity: "3,000 MBG/hari",
      lat: -6.2415,
      lng: 106.9924,
      left: "64%",
      top: "40%",
    },
    {
      id: "sppg-dpk-001",
      name: "Dapur Sehat Depok Mandiri",
      city: "Depok, Jawa Barat",
      coverage: "Melayani 2 sekolah",
      capacity: "2,500 MBG/hari",
      lat: -6.3728,
      lng: 106.8317,
      left: "52%",
      top: "62%",
    },
  ],
  schools: [
    {
      id: "sdn-sukamaju-01",
      name: "SDN Sukamaju 01",
      city: "Jakarta Pusat, DKI Jakarta",
      level: "SD",
      students: "Data siswa belum tersedia",
      lat: -6.21,
      lng: 106.85,
      left: "36%",
      top: "22%",
    },
    {
      id: "smpn-nusantara-02",
      name: "SMPN 2 Nusantara",
      city: "Jakarta Pusat, DKI Jakarta",
      level: "SMP",
      students: "Data siswa belum tersedia",
      lat: -6.22,
      lng: 106.84,
      left: "48%",
      top: "26%",
    },
    {
      id: "sdn-mekarsari-03",
      name: "SDN Mekarsari 03",
      city: "Bekasi, Jawa Barat",
      level: "SD",
      students: "Data siswa belum tersedia",
      lat: -6.25,
      lng: 106.99,
      left: "70%",
      top: "36%",
    },
    {
      id: "sdn-harapan-bangsa",
      name: "SDN Harapan Bangsa",
      city: "Bekasi Utara, Jawa Barat",
      level: "SD",
      students: "Data siswa belum tersedia",
      lat: -6.235,
      lng: 107.0,
      left: "74%",
      top: "52%",
    },
    {
      id: "smkn-teknologi-depok",
      name: "SMKN 1 Teknologi Depok",
      city: "Depok, Jawa Barat",
      level: "SMK",
      students: "Data siswa belum tersedia",
      lat: -6.39,
      lng: 106.82,
      left: "48%",
      top: "72%",
    },
    {
      id: "sdn-cempaka-putih",
      name: "SDN Cempaka Putih",
      city: "Depok, Jawa Barat",
      level: "SD",
      students: "Data siswa belum tersedia",
      lat: -6.36,
      lng: 106.84,
      left: "60%",
      top: "70%",
    },
  ],
  links: [
    { kitchenId: "sppg-jkt-001", schoolId: "sdn-sukamaju-01" },
    { kitchenId: "sppg-jkt-001", schoolId: "smpn-nusantara-02" },
    { kitchenId: "sppg-bks-001", schoolId: "sdn-mekarsari-03" },
    { kitchenId: "sppg-bks-001", schoolId: "sdn-harapan-bangsa" },
    { kitchenId: "sppg-dpk-001", schoolId: "smkn-teknologi-depok" },
    { kitchenId: "sppg-dpk-001", schoolId: "sdn-cempaka-putih" },
  ],
  selectedKitchenId: "sppg-jkt-001",
};

function toPercent(value, fallback) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${Math.max(0, Math.min(100, value))}%`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    if (value.includes("%")) return value;

    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) {
      return `${Math.max(0, Math.min(100, asNumber))}%`;
    }
  }

  return fallback;
}

function formatCapacity(value) {
  if (value === null || value === undefined || value === "") {
    return "Kapasitas belum tersedia";
  }

  return `${Number(value).toLocaleString("id-ID")} MBG/hari`;
}

function inferSchoolLevel(name) {
  const normalizedName = String(name ?? "").toUpperCase();
  if (normalizedName.includes("SMK")) return "SMK";
  if (normalizedName.includes("SMA")) return "SMA";
  if (normalizedName.includes("SMP")) return "SMP";
  return "SD";
}

function normalizeKitchen(item, index, position, schoolCount) {
  return {
    id: String(item?.id ?? item?._id ?? item?.sppgId ?? `kitchen-${index + 1}`),
    name: item?.name ?? item?.nama ?? item?.nama_sppg ?? `SPPG ${index + 1}`,
    city: item?.city ?? item?.kota ?? item?.wilayah ?? item?.address ?? "Wilayah belum tersedia",
    coverage: item?.coverage ?? item?.melayani ?? `Melayani ${schoolCount} sekolah`,
    capacity: item?.capacity ?? item?.kapasitas ?? formatCapacity(item?.capacityPerDay),
    lat: Number.isFinite(Number(item?.lat)) ? Number(item.lat) : null,
    lng: Number.isFinite(Number(item?.lng)) ? Number(item.lng) : null,
    left: toPercent(item?.left ?? item?.x ?? item?.mapX ?? position?.left, "50%"),
    top: toPercent(item?.top ?? item?.y ?? item?.mapY ?? position?.top, "50%"),
  };
}

function normalizeSchool(item, index, position) {
  const name = item?.name ?? item?.nama ?? item?.nama_sekolah ?? item?.schoolName;

  return {
    id: String(item?.id ?? item?._id ?? item?.sekolahId ?? `school-${index + 1}`),
    name: name ?? `Sekolah ${index + 1}`,
    city: item?.city ?? item?.kota ?? item?.wilayah ?? item?.address ?? "Wilayah belum tersedia",
    level: item?.level ?? item?.jenjang ?? inferSchoolLevel(name),
    students: item?.students ?? item?.studentsCount ?? item?.jumlahSiswa ?? item?.jumlah_siswa ?? "Data siswa belum tersedia",
    lat: Number.isFinite(Number(item?.lat)) ? Number(item.lat) : null,
    lng: Number.isFinite(Number(item?.lng)) ? Number(item.lng) : null,
    left: toPercent(item?.left ?? item?.x ?? item?.mapX ?? position?.left, "50%"),
    top: toPercent(item?.top ?? item?.y ?? item?.mapY ?? position?.top, "50%"),
  };
}

export function transformHomepageMapData(payload) {
  const kitchensSource = Array.isArray(payload?.kitchens)
    ? payload.kitchens
    : Array.isArray(payload?.sppg)
      ? payload.sppg
      : [];

  const schoolsSource = Array.isArray(payload?.schools)
    ? payload.schools
    : Array.isArray(payload?.sekolah)
      ? payload.sekolah
      : [];

  const points = [...kitchensSource, ...schoolsSource]
    .map((item) => ({
      lat: Number(item?.lat),
      lng: Number(item?.lng),
    }))
    .filter((item) => Number.isFinite(item.lat) && Number.isFinite(item.lng));

  const bounds = points.length
    ? points.reduce(
        (acc, point) => ({
          minLat: Math.min(acc.minLat, point.lat),
          maxLat: Math.max(acc.maxLat, point.lat),
          minLng: Math.min(acc.minLng, point.lng),
          maxLng: Math.max(acc.maxLng, point.lng),
        }),
        {
          minLat: points[0].lat,
          maxLat: points[0].lat,
          minLng: points[0].lng,
          maxLng: points[0].lng,
        },
      )
    : null;

  const getPositionFromLatLng = (item) => {
    if (!bounds) return null;

    const lat = Number(item?.lat);
    const lng = Number(item?.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;

    const latRange = bounds.maxLat - bounds.minLat || 1;
    const lngRange = bounds.maxLng - bounds.minLng || 1;
    const left = 15 + ((lng - bounds.minLng) / lngRange) * 70;
    const top = 15 + ((bounds.maxLat - lat) / latRange) * 70;

    return {
      left: `${left.toFixed(2)}%`,
      top: `${top.toFixed(2)}%`,
    };
  };

  const schoolCountBySppg = schoolsSource.reduce((counts, school) => {
    if (!school?.sppgId) return counts;
    counts.set(school.sppgId, (counts.get(school.sppgId) ?? 0) + 1);
    return counts;
  }, new Map());

  const kitchens = kitchensSource.map((item, index) =>
    normalizeKitchen(item, index, getPositionFromLatLng(item), schoolCountBySppg.get(item?.id) ?? 0),
  );
  const schools = schoolsSource.map((item, index) =>
    normalizeSchool(item, index, getPositionFromLatLng(item)),
  );

  const links = Array.isArray(payload?.links) ? payload.links : [];

  return {
    kitchens,
    schools,
    links,
    selectedKitchenId: payload?.selectedKitchenId ?? kitchens[0]?.id ?? null,
  };
}

export async function fetchHomepageMapData() {
  const [sppgResponse, sekolahResponse] = await Promise.all([getSPPG(), getSchools()]);
  const sppg = getResponseArray(sppgResponse.data);
  const sekolah = getResponseArray(sekolahResponse.data);
  const links = sekolah
    .filter((school) => school?.sppgId)
    .map((school) => ({
      kitchenId: school.sppgId,
      schoolId: school.id,
    }));

  return transformHomepageMapData({ sppg, sekolah, links });
}
