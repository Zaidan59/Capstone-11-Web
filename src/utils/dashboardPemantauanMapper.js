function formatCapacity(value) {
  if (value === undefined || value === null || value === "") {
    return "CAPACITY: -";
  }
  return `CAPACITY: ${value}`;
}

function formatStudents(value) {
  if (value === undefined || value === null || value === "") {
    return "- SISWA";
  }
  return `${value} SISWA`;
}

function formatStatus(value) {
  if (!value) return "STATUS N/A";
  return String(value).replaceAll("_", " ").toUpperCase();
}

export function mapSppgItem(item, index) {
  return {
    id: item?.id ?? `sppg-${index}`,
    title: item?.title ?? item?.name ?? "SPPG Tanpa Nama",
    location:
      item?.location ?? item?.city ?? item?.address ?? "Lokasi belum tersedia",
    status: item?.statusLabel ?? formatStatus(item?.status),
    capacity: item?.capacity ?? formatCapacity(item?.capacityPerDay),
    schoolsServed: item?.schoolsServed ?? item?.totalSchoolsServed ?? 0,
    distributedPortions:
      item?.distributedPortions ?? item?.totalDistributedPortions ?? "0",
    rating: item?.rating ?? item?.averageRating ?? "-",
  };
}

export function mapSchoolItem(item, index) {
  const kitchenName =
    item?.kitchen ?? item?.sppgName ?? item?.partnerSppgName ?? "Belum terhubung";

  return {
    id: item?.id ?? `school-${index}`,
    title: item?.title ?? item?.schoolName ?? item?.name ?? "Sekolah Tanpa Nama",
    location:
      item?.location ?? item?.city ?? item?.address ?? "Lokasi belum tersedia",
    kitchen: kitchenName.startsWith("KITCHEN:")
      ? kitchenName
      : `KITCHEN: ${kitchenName}`,
    students: item?.students ?? formatStudents(item?.studentsCount),
    menuLabel: item?.menuLabel ?? "Menu Hari Ini",
    menuTitle: item?.menuTitle ?? item?.todayMenuTitle ?? "Menu belum tersedia",
    menuDetail:
      item?.menuDetail ?? item?.todayMenuDetail ?? "Detail menu belum tersedia",
    calories: item?.calories ?? "-",
    nutrition: item?.nutrition ?? "Target Nutrisi: -",
  };
}
