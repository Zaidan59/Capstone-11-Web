import api from './api'
 
// Ambil semua notifikasi berdasarkan sekolahId yang sedang login
export const getNotificationsBySekolahId = (sekolahId) =>
  api.get(`/notifications/sekolah/${sekolahId}`)
 
// Tandai satu notifikasi sebagai sudah dibaca
export const markAsRead = (notifId) =>
  api.patch(`/notifications/${notifId}/read`)
 
// Tandai semua notifikasi milik sekolah sebagai sudah dibaca
export const markAllAsRead = (sekolahId) =>
  api.patch(`/notifications/sekolah/${sekolahId}/read-all`)