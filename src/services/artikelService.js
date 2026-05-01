import api from "./api";

export const getAllArtikel = () => api.get("/artikel");

export const getArtikelById = (id) => api.get(`/artikel/${id}`);
