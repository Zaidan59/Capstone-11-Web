import api from './api'

const SPPG_LIST_CACHE_KEY = 'simba_cache_sppg_list_v1'
const SPPG_LIST_TTL_MS = 60 * 1000
let sppgListInFlight = null

function readSppgListCache() {
  try {
    const raw = sessionStorage.getItem(SPPG_LIST_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.timestamp || !parsed?.data) return null
    if (Date.now() - parsed.timestamp > SPPG_LIST_TTL_MS) {
      sessionStorage.removeItem(SPPG_LIST_CACHE_KEY)
      return null
    }
    return parsed.data
  } catch {
    return null
  }
}

function writeSppgListCache(data) {
  try {
    sessionStorage.setItem(
      SPPG_LIST_CACHE_KEY,
      JSON.stringify({
        timestamp: Date.now(),
        data,
      }),
    )
  } catch {
    // ignore cache write failures
  }
}

export const getAllSPPG = async ({ forceRefresh = false } = {}) => {
  if (!forceRefresh) {
    const cachedData = readSppgListCache()
    if (cachedData) {
      return { data: cachedData }
    }
  }

  if (sppgListInFlight && !forceRefresh) {
    return sppgListInFlight
  }

  sppgListInFlight = api
    .get('/sppg')
    .then((response) => {
      writeSppgListCache(response?.data)
      return response
    })
    .finally(() => {
      sppgListInFlight = null
    })

  return sppgListInFlight
}
export const getSPPGById = (id) => api.get(`/sppg/${id}`)
