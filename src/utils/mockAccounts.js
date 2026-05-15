/**
 * Mock accounts untuk demo/testing tanpa backend
 * Format: { identifier (username/email), password, role, name }
 */
export const mockAccounts = [
  {
    identifier: 'admin',
    password: '123',
    role: 'sppg',
    name: 'Admin SPPG',
  },
  {
    identifier: 'SPPG001',
    password: '123',
    role: 'sppg',
    name: 'Dapur SPPG Jakarta',
  },
  {
    identifier: 'sekolah',
    password: '123',
    role: 'sekolah',
    name: 'Admin Sekolah',
  },
  {
    identifier: 'SDN115',
    password: '123',
    role: 'sekolah',
    name: 'SDN 115 Jakarta',
  },
]

/**
 * Validasi mock account
 * @param {string} identifier - username/email
 * @param {string} password - password
 * @param {string} role - role yang dipilih (sppg/sekolah)
 * @returns {object|null} - akun jika valid, null jika tidak
 */
export const validateMockAccount = (identifier, password, role) => {
  const account = mockAccounts.find(
    (acc) =>
      acc.identifier === identifier &&
      acc.password === password &&
      acc.role === role
  )

  if (!account) return null

  return {
    role: account.role,
    identifier: account.identifier,
    name: account.name,
  }
}
