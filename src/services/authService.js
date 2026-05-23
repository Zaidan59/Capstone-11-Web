import api from './api'

export const login = (data) => api.post('/auth/login', data)
export const register = (data) => api.post('/auth/register', data)
export const logout = () => api.post('/auth/logout')

const normalizeRole = (role) => {
  if (!role) return ''
  if (role === 'sekolah') return 'school'
  return role
}

const getArrayPayload = (payload) => {
  if (Array.isArray(payload?.data?.data)) return payload.data.data
  if (Array.isArray(payload?.data)) return payload.data
  if (Array.isArray(payload)) return payload
  return []
}

export const resolveUserEntityIds = async ({ user, role }) => {
  if (!user?.id) return user

  const normalizedRole = normalizeRole(role || user.role)

  try {
    if (normalizedRole === 'sppg') {
      const res = await api.get('/sppg')
      const items = getArrayPayload(res?.data)
      const matched = items.find((item) => item?.userId === user.id)
      if (matched?.id) {
        return { ...user, sppgId: matched.id }
      }
    }

    if (normalizedRole === 'school') {
      const res = await api.get('/sekolah')
      const items = getArrayPayload(res?.data)
      const matched = items.find((item) => item?.userId === user.id)
      if (matched?.id) {
        return {
          ...user,
          schoolId: matched.id,
          sekolahId: matched.id,
        }
      }
    }
  } catch {
    // fallback ke user asli kalau resolver gagal
  }

  return user
}

export const resolveEntityIdByUser = async ({ userId, role }) => {
  if (!userId) return null
  const normalizedRole = normalizeRole(role)

  try {
    if (normalizedRole === 'sppg') {
      const res = await api.get('/sppg')
      const items = getArrayPayload(res?.data)
      const matched = items.find((item) => item?.userId === userId)
      return matched?.id ?? null
    }

    if (normalizedRole === 'school') {
      const res = await api.get('/sekolah')
      const items = getArrayPayload(res?.data)
      const matched = items.find((item) => item?.userId === userId)
      return matched?.id ?? null
    }
  } catch {
    return null
  }

  return null
}
