// Helper untuk parse CSV menu sebelum diupload
export const parseCSV = (text) => {
  const lines = text.trim().split('\n')
  const headers = lines[0].split(',')
  return lines.slice(1).map((line) => {
    const values = line.split(',')
    return headers.reduce((obj, header, i) => {
      obj[header.trim()] = values[i]?.trim()
      return obj
    }, {})
  })
}
