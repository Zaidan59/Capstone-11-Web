import api from './api'

export const getNotificationsBySppgId = (sppgId) =>
  api.get('/notifikasi', { params: { sppgId } })

export const getNotificationsBySchoolId = (schoolId) =>
  api.get('/notifikasi', { params: { schoolId } })

export const updateNotificationStatus = (notificationId, status = 'reviewed') =>
  api.patch(`/notifikasi/${notificationId}/status`, { status })