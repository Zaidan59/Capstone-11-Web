import api from './api'

export const uploadImage = async (file, extraFields = {}) => {
  const form = new FormData()
  // BE route aktif saat ini: POST /api/upload dengan field "image"
  form.append('image', file)

  Object.entries(extraFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, value)
    }
  })

  const res = await api.post('/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const payload = res?.data?.data ?? res?.data ?? {}
  return {
    url: payload?.imageUrl ?? payload?.url ?? payload?.secure_url ?? '',
    publicId: payload?.publicId ?? payload?.public_id ?? '',
    width: payload?.width ?? null,
    height: payload?.height ?? null,
    format: payload?.format ?? null,
    raw: payload,
  }
}

export const uploadProfileImage = async (file, extraFields = {}) => {
  const form = new FormData()
  form.append('avatar', file)

  Object.entries(extraFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, value)
    }
  })

  const res = await api.post('/upload/profile', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const payload = res?.data?.data ?? res?.data ?? {}
  return {
    url: payload?.imageUrl ?? payload?.url ?? payload?.secure_url ?? '',
    publicId: payload?.publicId ?? payload?.public_id ?? '',
    width: payload?.width ?? null,
    height: payload?.height ?? null,
    format: payload?.format ?? null,
    raw: payload,
  }
}

