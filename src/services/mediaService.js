import api from './api'

// Contract yang diharapkan dari backend:
// POST /media/upload-image (multipart/form-data: file)
// Response contoh:
// {
//   data: {
//     url: "https://res.cloudinary.com/.../image/upload/...jpg",
//     publicId: "simba/docs/abc123",
//     width: 1200,
//     height: 800,
//     format: "jpg"
//   }
// }
export const uploadImage = async (file, extraFields = {}) => {
  const form = new FormData()
  form.append('file', file)

  Object.entries(extraFields).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      form.append(key, value)
    }
  })

  const res = await api.post('/media/upload-image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  const payload = res?.data?.data ?? res?.data ?? {}
  return {
    url: payload?.url ?? payload?.secure_url ?? '',
    publicId: payload?.publicId ?? payload?.public_id ?? '',
    width: payload?.width ?? null,
    height: payload?.height ?? null,
    format: payload?.format ?? null,
    raw: payload,
  }
}

