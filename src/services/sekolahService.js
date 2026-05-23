import api from './api'
export const getAllSekolah = () => api.get('/sekolah')
export const getSekolahById = (id) => api.get(`/sekolah/${id}`)

export const getSekolahSppg = (id) => api.get(`/sekolah/${id}/sppg`)
export const getSekolahMenuHarian = (id) => api.get(`/sekolah/${id}/menu-harian`)
export const getSekolahDokumentasi = (id) => api.get(`/sekolah/${id}/dokumentasi`)
export const getSekolahNutrisi = (id) => api.get(`/sekolah/${id}/nutrisi`)
export const getSekolahCatatan = (id) => api.get(`/sekolah/${id}/catatan`)

export const createSekolahDokumentasi = (id, payload) =>
  api.post(`/sekolah/${id}/dokumentasi`, payload)

export const createSekolahCatatan = (id, payload) =>
  api.post(`/sekolah/${id}/catatan`, payload)
