import api from './api'

export const getAllSekolah = () => api.get('/sekolah')
export const getSekolahById = (id) => api.get(`/sekolah/${id}`)
