import api from './api'
export const getAllSPPG = () => api.get('/sppg')
export const getSPPGById = (id) => api.get(`/sppg/${id}`)
export const updateMyProfile = (payload) => api.patch('/auth/profile', payload)
