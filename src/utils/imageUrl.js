const normalizeBaseUrl = (value) => {
  if (!value) return "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
};

const stripApiPath = (value) => value.replace(/\/api\/?$/i, "");

export const resolveImageUrl = (value, fallback = "") => {
  if (!value) return fallback;
  if (typeof value !== "string") return fallback;

  if (value.startsWith("data:")) return value;
  if (value.startsWith("blob:")) return value;
  if (/^https?:\/\//i.test(value)) return value;

  const envBase = normalizeBaseUrl(import.meta.env.VITE_ASSET_BASE_URL);
  const apiBaseRaw = normalizeBaseUrl(import.meta.env.VITE_API_URL);
  const apiBase = apiBaseRaw ? normalizeBaseUrl(stripApiPath(apiBaseRaw)) : "";
  const baseUrl = envBase || apiBase;

  if (!baseUrl) return value;

  if (value.startsWith("/")) return `${baseUrl}${value}`;
  return `${baseUrl}/${value}`;
};
