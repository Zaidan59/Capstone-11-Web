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

function parseCount(value) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function formatSchoolCount(value) {
  const parsed = parseCount(value);
  if (parsed === null) return "-";
  return String(parsed);
}

function formatPortionCount(value) {
  const parsed = parseCount(value);
  if (parsed === null) return "-";
  return `${parsed.toLocaleString("id-ID")} porsi`;
}

function formatRating(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return parsed.toFixed(1);
}

export function mapSppgItem(item, index) {
  const schoolsServedRaw =
    item?.schoolsServed ?? item?.totalSchoolsServed ?? item?.totalPartnerSchools;
  const distributedPortionsRaw =
    item?.distributedPortions ??
    item?.totalDistributedPortions ??
    item?.totalMealsDistributed;
  const ratingRaw = item?.rating ?? item?.averageRating;

  return {
    id: item?.id ?? `sppg-${index}`,
    title: getDisplayValue(item?.title ?? item?.name ?? item?.sppgName),
    location: getDisplayValue(item?.location ?? item?.city ?? item?.address),
    photoUrl:
      item?.photoUrl ??
      item?.photo_url ??
      item?.imageUrl ??
      item?.image_url ??
      item?.logoUrl ??
      item?.logo_url ??
      null,
    status: getDisplayValue(item?.statusLabel ?? formatStatus(item?.status)),
    capacity: item?.capacity ?? formatCapacity(item?.capacityPerDay),
    schoolsServed: formatSchoolCount(schoolsServedRaw),
    distributedPortions: formatPortionCount(distributedPortionsRaw),
    rating: formatRating(ratingRaw),
  };
}

export function mapSchoolItem(item, index, sppgById = {}) {
  const relatedSppg =
    sppgById?.[item?.sppgId] ?? sppgById?.[item?.sppg?.id] ?? null;
  const kitchenNameValue =
    item?.kitchen ??
    item?.sppgName ??
    item?.partnerSppgName ??
    item?.partnerSppg?.sppgName ??
    item?.sppg?.sppgName ??
    item?.sppg?.name ??
    relatedSppg?.sppgName ??
    relatedSppg?.name;

  const kitchenName = kitchenNameValue
    ? `KITCHEN: ${kitchenNameValue}`
    : "KITCHEN: Belum terhubung";

  return {
    id: item?.id ?? `school-${index}`,
    title: getDisplayValue(item?.title ?? item?.schoolName ?? item?.name),
    location: getDisplayValue(item?.location ?? item?.city ?? item?.address),
    photoUrl:
      item?.photoUrl ??
      item?.photo_url ??
      item?.imageUrl ??
      item?.image_url ??
      item?.logoUrl ??
      item?.logo_url ??
      null,
    kitchen: kitchenName,
    students:
      item?.students ??
      formatStudents(item?.studentsCount ?? item?.studentCount ?? item?.jumlahSiswa),
    menuLabel: getDisplayValue(item?.menuLabel ?? "Menu Hari Ini"),
    menuTitle: getDisplayValue(
      item?.menuTitle ?? item?.todayMenuTitle,
      "Belum ada menu hari ini",
    ),
    menuImageUrl:
      item?.menuImageUrl ??
      item?.menu_image_url ??
      item?.menuImage ??
      item?.menu?.imageUrl ??
      item?.menu?.photoUrl ??
      null,
    menuDetail: getDisplayValue(
      item?.menuDetail ?? item?.todayMenuDetail,
      "Data menu belum tersedia",
    ),
    calories: getDisplayValue(item?.calories, "-"),
    nutrition: getDisplayValue(item?.nutrition ?? "Target Nutrisi: -"),
  };
}
