import { getSchools, getSPPG } from "../../services/mapsService";
import { buildLinks, getResponseArray, toCoordinate } from "../../utils/mapUtils";

function formatCapacity(value) {
  if (value === null || value === undefined || value === "") {
    return "Kapasitas belum tersedia";
  }

  return `Kapasitas: ${Number(value).toLocaleString("id-ID")} MBG/hari`;
}

function transformSchool(item) {
  const lat = toCoordinate(item?.lat);
  const lng = toCoordinate(item?.lng);

  if (!item?.id || lat === null || lng === null) {
    return null;
  }

  return {
    id: item.id,
    type: "school",
    name: item.schoolName ?? item.name ?? "Sekolah",
    location: item.address ?? "Lokasi belum tersedia",
    info: item.sppgId ? `Terhubung dengan SPPG ${item.sppgId}` : "Belum terhubung dengan SPPG",
    capacity: item.npsn ? `NPSN: ${item.npsn}` : "NPSN belum tersedia",
    lat,
    lng,
    sppgId: item.sppgId ?? null,
  };
}

function transformKitchen(item, schoolCount) {
  const lat = toCoordinate(item?.lat);
  const lng = toCoordinate(item?.lng);

  if (!item?.id || lat === null || lng === null) {
    return null;
  }

  return {
    id: item.id,
    type: "sppg",
    name: item.name ?? "Dapur SPPG",
    location: item.address ?? "Lokasi belum tersedia",
    info: `Melayani ${schoolCount} sekolah`,
    capacity: formatCapacity(item.capacityPerDay),
    lat,
    lng,
  };
}

export function transformMapsData(rawSppg, rawSchools) {
  const schools = getResponseArray(rawSchools).map(transformSchool).filter(Boolean);

  const schoolCountBySppg = schools.reduce((counts, school) => {
    if (!school.sppgId) return counts;
    counts.set(school.sppgId, (counts.get(school.sppgId) ?? 0) + 1);
    return counts;
  }, new Map());

  const kitchens = getResponseArray(rawSppg)
    .map((item) => transformKitchen(item, schoolCountBySppg.get(item?.id) ?? 0))
    .filter(Boolean);

  return {
    kitchens,
    schools,
    links: buildLinks(kitchens, schools),
  };
}

export async function fetchMapsData() {
  const [sppgResponse, schoolsResponse] = await Promise.all([getSPPG(), getSchools()]);
  return transformMapsData(sppgResponse.data, schoolsResponse.data);
}
