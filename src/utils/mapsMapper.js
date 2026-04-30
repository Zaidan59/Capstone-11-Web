const toPercent = (value, fallback) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return `${Math.max(0, Math.min(100, value))}%`;
  }

  if (typeof value === "string" && value.trim().length > 0) {
    if (value.includes("%")) {
      return value;
    }

    const asNumber = Number(value);
    if (Number.isFinite(asNumber)) {
      return `${Math.max(0, Math.min(100, asNumber))}%`;
    }
  }

  return fallback;
};

const normalizeKitchen = (item, index, position) => ({
  id: String(item?.id ?? item?._id ?? item?.sppgId ?? `kitchen-${index + 1}`),
  name: item?.name ?? item?.nama ?? item?.nama_sppg ?? `SPPG ${index + 1}`,
  city: item?.city ?? item?.kota ?? item?.wilayah ?? item?.address ?? "Wilayah belum tersedia",
  coverage: item?.coverage ?? item?.melayani ?? "Cakupan layanan belum tersedia",
  capacity: item?.capacity ?? item?.kapasitas ?? item?.capacityPerDay ?? "Kapasitas belum tersedia",
  lat: Number.isFinite(Number(item?.lat)) ? Number(item.lat) : null,
  lng: Number.isFinite(Number(item?.lng)) ? Number(item.lng) : null,
  left: toPercent(item?.left ?? item?.x ?? item?.mapX ?? position?.left, "50%"),
  top: toPercent(item?.top ?? item?.y ?? item?.mapY ?? position?.top, "50%"),
});

const normalizeSchool = (item, index, position) => ({
  id: String(item?.id ?? item?._id ?? item?.sekolahId ?? `school-${index + 1}`),
  name: item?.name ?? item?.nama ?? item?.nama_sekolah ?? item?.schoolName ?? `Sekolah ${index + 1}`,
  city: item?.city ?? item?.kota ?? item?.wilayah ?? item?.address ?? "Wilayah belum tersedia",
  level: item?.level ?? item?.jenjang ?? "Jenjang belum tersedia",
  students: item?.students ?? item?.jumlahSiswa ?? item?.jumlah_siswa ?? "Jumlah siswa belum tersedia",
  lat: Number.isFinite(Number(item?.lat)) ? Number(item.lat) : null,
  lng: Number.isFinite(Number(item?.lng)) ? Number(item.lng) : null,
  left: toPercent(item?.left ?? item?.x ?? item?.mapX ?? position?.left, "50%"),
  top: toPercent(item?.top ?? item?.y ?? item?.mapY ?? position?.top, "50%"),
});

export const mapHomepageMapData = (payload) => {
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

  const hasGeoPoints = points.length > 0;
  const bounds = hasGeoPoints
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

  const kitchens = kitchensSource.map((item, index) =>
    normalizeKitchen(item, index, getPositionFromLatLng(item)),
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
};
