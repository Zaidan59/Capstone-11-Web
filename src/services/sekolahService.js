import api from './api'

const SEKOLAH_LIST_CACHE_KEY = 'simba_cache_sekolah_list_v1'
const SEKOLAH_LIST_TTL_MS = 60 * 1000
let sekolahListInFlight = null

function readSekolahListCache() {
  try {
    const raw = sessionStorage.getItem(SEKOLAH_LIST_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || !parsed?.data) return null
    if (Date.now() - parsed.timestamp > SEKOLAH_LIST_TTL_MS) {
      sessionStorage.removeItem(SEKOLAH_LIST_CACHE_KEY)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

function writeSekolahListCache(data) {
  try {
    sessionStorage.setItem(
      SEKOLAH_LIST_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    )
  } catch {
    // ignore cache write failures
  }
}

export const getAllSekolah = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh) {
    const cachedData = readSekolahListCache()
    if (cachedData) {
      return { data: cachedData }
    }
  }

  if (sekolahListInFlight && !forceRefresh) {
    return sekolahListInFlight
  }

  sekolahListInFlight = api
    .get('/sekolah')
    .then((response) => {
      writeSekolahListCache(response?.data)
      return response
    })
    .finally(() => {
      sekolahListInFlight = null
    })

  return sekolahListInFlight
}
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
