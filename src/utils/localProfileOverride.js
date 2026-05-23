const KEY = 'simba_sppg_profile_overrides_v1'

const readAll = () => {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeAll = (data) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // ignore write failure
  }
}

export const getSppgProfileOverride = (sppgId) => {
  if (!sppgId) return null
  const all = readAll()
  return all[sppgId] ?? null
}

export const setSppgProfileOverride = (sppgId, payload) => {
  if (!sppgId || !payload) return
  const all = readAll()
  all[sppgId] = {
    ...(all[sppgId] ?? {}),
    ...payload,
    updatedAt: Date.now(),
  }
  writeAll(all)
}

