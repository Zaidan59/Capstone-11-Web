import api from './api'

export const getAllSPPG = () => api.get('/sppg')
export const getSPPGById = (id) => api.get(`/sppg/${id}`)
