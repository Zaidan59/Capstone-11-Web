import { getDisplayValue } from "./display";

function formatCapacity(value) {
  return `CAPACITY: ${getDisplayValue(value)}`;
}

function formatStudents(value) {
  return `${getDisplayValue(value)} SISWA`;
}

function formatStatus(value) {
  if (!value) return "STATUS N/A";
  return String(value).replaceAll("_", " ").toUpperCase();
}

export function mapSppgItem(item, index) {
  return {
    id: item?.id ?? `sppg-${index}`,
    title: getDisplayValue(item?.title ?? item?.name),
    location:
      getDisplayValue(item?.location ?? item?.city ?? item?.address),
    status: getDisplayValue(item?.statusLabel ?? formatStatus(item?.status)),
    capacity: item?.capacity ?? formatCapacity(item?.capacityPerDay),
    schoolsServed:
      getDisplayValue(
        item?.schoolsServed ??
          item?.totalSchoolsServed ??
          item?.totalPartnerSchools,
      ),
    distributedPortions:
      getDisplayValue(
        item?.distributedPortions ??
          item?.totalDistributedPortions ??
          item?.totalMealsDistributed,
      ),
    rating: getDisplayValue(item?.rating ?? item?.averageRating),
  };
}

export function mapSchoolItem(item, index) {
  const kitchenName =
    item?.kitchen ??
    item?.sppgName ??
    item?.partnerSppgName ??
    item?.partnerSppg?.sppgName ??
    item?.sppg?.name ??
    "Belum terhubung";

  return {
    id: item?.id ?? `school-${index}`,
    title: getDisplayValue(item?.title ?? item?.schoolName ?? item?.name),
    location:
      getDisplayValue(item?.location ?? item?.city ?? item?.address),
    kitchen: kitchenName.startsWith("KITCHEN:")
      ? kitchenName
      : `KITCHEN: ${kitchenName}`,
    students: item?.students ?? formatStudents(item?.studentsCount),
    menuLabel: getDisplayValue(item?.menuLabel ?? "Menu Hari Ini"),
    menuTitle: getDisplayValue(item?.menuTitle ?? item?.todayMenuTitle),
    menuDetail: getDisplayValue(item?.menuDetail ?? item?.todayMenuDetail),
    calories: getDisplayValue(item?.calories),
    nutrition: getDisplayValue(item?.nutrition ?? "Target Nutrisi: -"),
  };
}
