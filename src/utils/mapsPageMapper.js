const toStringArray = (value) => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item));
  }

  if (typeof value === "string" && value.trim()) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const toNumber = (value) => {
  const asNumber = Number(value);
  return Number.isFinite(asNumber) ? asNumber : null;
};

export const mapSppgForMapPage = (item, index) => {
  return {
    id: String(item?.id ?? item?._id ?? item?.sppgId ?? `sppg-${index + 1}`),
    name: item?.name ?? item?.nama ?? item?.sppgName ?? `SPPG ${index + 1}`,
    location:
      item?.location ??
      item?.city ??
      item?.address ??
      item?.wilayah ??
      "Lokasi belum tersedia",
    info: item?.info ?? item?.coverage ?? item?.melayani ?? "Melayani sekolah sekitar",
    capacity:
      item?.capacity ??
      item?.capacityPerDay ??
      item?.kapasitas ??
      "Kapasitas belum tersedia",
    lat: toNumber(item?.lat),
    lng: toNumber(item?.lng),
    schools: toStringArray(
      item?.schools ?? item?.schoolIds ?? item?.sekolahIds ?? item?.school_ids,
    ),
  };
};

export const mapSchoolForMapPage = (item, index) => {
  return {
    id: String(item?.id ?? item?._id ?? item?.sekolahId ?? `school-${index + 1}`),
    name: item?.name ?? item?.nama ?? item?.schoolName ?? `Sekolah ${index + 1}`,
    location:
      item?.location ??
      item?.city ??
      item?.address ??
      item?.wilayah ??
      "Lokasi belum tersedia",
    info:
      item?.info ?? item?.partnerInfo ?? item?.description ?? "Mitra distribusi SPPG",
    capacity:
      item?.capacity ??
      item?.students ??
      item?.studentsCount ??
      item?.jumlahSiswa ??
      "Jumlah siswa belum tersedia",
    lat: toNumber(item?.lat),
    lng: toNumber(item?.lng),
    sppgId:
      item?.sppgId ??
      item?.sppg_id ??
      item?.sppg?.id ??
      item?.sppg?.sppgId ??
      null,
  };
};
