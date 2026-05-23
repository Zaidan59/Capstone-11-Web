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

const isFilled = (value) => value !== null && value !== undefined && value !== "";

const firstFilled = (...values) => values.find(isFilled);

const getRelatedSppgName = (item) => {
  const affiliatedSppg = item?.affiliatedSppg;
  const partnerSppg = item?.partnerSppg;

  return firstFilled(
    item?.sppgName,
    item?.partnerSppgName,
    item?.affiliatedKitchen,
    item?.namaSppg,
    item?.sppg?.sppgName,
    item?.sppg?.name,
    item?.sppg?.nama,
    typeof affiliatedSppg === "object" ? affiliatedSppg?.sppgName ?? affiliatedSppg?.name ?? affiliatedSppg?.nama : affiliatedSppg,
    typeof partnerSppg === "object" ? partnerSppg?.sppgName ?? partnerSppg?.name ?? partnerSppg?.nama : partnerSppg,
  );
};

const getSchoolName = (school) => {
  if (typeof school !== "object" || school === null) return null;
  return firstFilled(school?.schoolName, school?.name, school?.nama);
};

const getSppgRelationInfo = (item, schoolNames) => {
  const directInfo = firstFilled(item?.info, item?.coverage, item?.melayani);
  if (directInfo) return directInfo;

  const totalSchools = Number(
    firstFilled(
      item?.totalPartnerSchools,
      item?.schoolsServed,
      item?.totalSchoolsServed,
      schoolNames.length || null,
    ),
  );

  if (Number.isFinite(totalSchools) && totalSchools > 0) {
    return `Melayani ${totalSchools.toLocaleString("id-ID")} sekolah`;
  }

  return null;
};

const getSchoolRelationInfo = (item) => {
  const directInfo = firstFilled(item?.info, item?.partnerInfo);
  if (directInfo) return directInfo;

  const sppgName = getRelatedSppgName(item);
  return sppgName ? `Ditangani oleh ${sppgName}` : null;
};

export const mapSppgForMapPage = (item, index) => {
  const schoolsRaw =
    item?.schools ?? item?.schoolIds ?? item?.sekolahIds ?? item?.school_ids;
  const schoolNames = Array.isArray(schoolsRaw)
    ? schoolsRaw.map(getSchoolName).filter(Boolean)
    : [];
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
    info: getDisplayValue(getSppgRelationInfo(item, schoolNames)),
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
    info: getDisplayValue(getSchoolRelationInfo(item)),
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
