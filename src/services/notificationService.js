import api from './api'

export const getNotificationsBySppgId = (sppgId) =>
  api.get('/notifikasi', { params: { sppgId } })

export const getNotificationsBySchoolId = (schoolId) =>
  api.get('/notifikasi', { params: { schoolId } })