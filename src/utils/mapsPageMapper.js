import { getDisplayValue } from "./display";

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
  const schoolsRaw =
    item?.schools ?? item?.schoolIds ?? item?.sekolahIds ?? item?.school_ids;
  const schools =
    Array.isArray(schoolsRaw)
      ? schoolsRaw
          .map((school) =>
            typeof school === "object" && school !== null
              ? school?.id ?? school?._id ?? school?.schoolId ?? school?.sekolahId
              : school,
          )
          .filter(Boolean)
          .map((schoolId) => String(schoolId))
      : toStringArray(schoolsRaw);

  return {
    id: String(item?.id ?? item?._id ?? item?.sppgId ?? `sppg-${index + 1}`),
    name: getDisplayValue(item?.name ?? item?.nama ?? item?.sppgName),
    location:
      getDisplayValue(
        item?.location ?? item?.city ?? item?.address ?? item?.wilayah,
      ),
    info: getDisplayValue(item?.info ?? item?.coverage ?? item?.melayani),
    capacity:
      getDisplayValue(item?.capacity ?? item?.capacityPerDay ?? item?.kapasitas),
    photoUrl:
      item?.photoUrl ??
      item?.photo_url ??
      item?.imageUrl ??
      item?.image_url ??
      item?.logoUrl ??
      item?.logo_url ??
      null,
    lat: toNumber(item?.lat),
    lng: toNumber(item?.lng),
    schools,
  };
};

export const mapSchoolForMapPage = (item, index) => {
  const rawSppgId =
    item?.sppgId ??
    item?.sppg_id ??
    item?.sppg?.id ??
    item?.sppg?.sppgId ??
    null;

  return {
    id: String(item?.id ?? item?._id ?? item?.sekolahId ?? `school-${index + 1}`),
    name: getDisplayValue(item?.name ?? item?.nama ?? item?.schoolName),
    location:
      getDisplayValue(
        item?.location ?? item?.city ?? item?.address ?? item?.wilayah,
      ),
    info:
      getDisplayValue(item?.info ?? item?.partnerInfo ?? item?.description),
    capacity:
      getDisplayValue(
        item?.capacity ??
          item?.students ??
          item?.studentsCount ??
          item?.jumlahSiswa,
      ),
    photoUrl:
      item?.photoUrl ??
      item?.photo_url ??
      item?.imageUrl ??
      item?.image_url ??
      item?.logoUrl ??
      item?.logo_url ??
      null,
    lat: toNumber(item?.lat),
    lng: toNumber(item?.lng),
    sppgId: rawSppgId !== null && rawSppgId !== undefined ? String(rawSppgId) : null,
  };
};
