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

const normalizeKitchen = (item, index) => ({
  id: String(item?.id ?? item?._id ?? item?.sppgId ?? `kitchen-${index + 1}`),
  name: item?.name ?? item?.nama ?? item?.nama_sppg ?? `SPPG ${index + 1}`,
  city: item?.city ?? item?.kota ?? item?.wilayah ?? "Wilayah belum tersedia",
  coverage: item?.coverage ?? item?.melayani ?? "Cakupan layanan belum tersedia",
  capacity: item?.capacity ?? item?.kapasitas ?? "Kapasitas belum tersedia",
  left: toPercent(item?.left ?? item?.x ?? item?.mapX, "50%"),
  top: toPercent(item?.top ?? item?.y ?? item?.mapY, "50%"),
});

const normalizeSchool = (item, index) => ({
  id: String(item?.id ?? item?._id ?? item?.sekolahId ?? `school-${index + 1}`),
  name: item?.name ?? item?.nama ?? item?.nama_sekolah ?? `Sekolah ${index + 1}`,
  city: item?.city ?? item?.kota ?? item?.wilayah ?? "Wilayah belum tersedia",
  level: item?.level ?? item?.jenjang ?? "Jenjang belum tersedia",
  students: item?.students ?? item?.jumlahSiswa ?? item?.jumlah_siswa ?? "Jumlah siswa belum tersedia",
  left: toPercent(item?.left ?? item?.x ?? item?.mapX, "50%"),
  top: toPercent(item?.top ?? item?.y ?? item?.mapY, "50%"),
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

  const kitchens = kitchensSource.map(normalizeKitchen);
  const schools = schoolsSource.map(normalizeSchool);

  return {
    kitchens,
    schools,
    selectedKitchenId: payload?.selectedKitchenId ?? kitchens[0]?.id ?? null,
  };
};
