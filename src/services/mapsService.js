import api from "./api";

// Endpoint ini disiapkan agar frontend tinggal tersambung saat backend siap.
export const getHomepageMapOverview = () => api.get("/maps/overview");
