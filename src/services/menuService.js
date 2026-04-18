import api from './api'

export const getMenuMingguan = (sppgId) => api.get(`/menu/${sppgId}`)
export const uploadMenuCSV = (formData) => api.post('/menu/upload', formData)
