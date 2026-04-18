import { useState } from 'react'
import { AuthContext } from './AuthContextProvider'

export const AuthProvider = ({ children }) => {
  // user: null kalau belum login
  // user: { role: 'sppg' | 'sekolah', name: '', email: '' } kalau sudah login
  const [user, setUser] = useState(null)

  const login = (userData) => setUser(userData)
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
