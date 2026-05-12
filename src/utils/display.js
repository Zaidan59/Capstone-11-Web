export const isEmptyValue = (value) => value === null || value === undefined || value === "";

export const getDisplayValue = (value, fallback = "-") =>
  isEmptyValue(value) ? fallback : value;

export const formatNumberValue = (value, fallback = "-") => {
  if (isEmptyValue(value)) return fallback;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue.toLocaleString("id-ID") : fallback;
};
