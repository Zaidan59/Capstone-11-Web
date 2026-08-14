import { useState } from 'react'
import { AuthContext } from './AuthContextProvider'
import { clearStoredToken, getStoredToken, setStoredToken } from '../services/api'

const USER_KEY = 'sigizi_user'

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(USER_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [token, setToken] = useState(() => getStoredToken())

  const login = (authData) => {
    const incomingUser = authData?.user ?? authData
    const incomingToken = authData?.token ?? null

    setUser(incomingUser)
    localStorage.setItem(USER_KEY, JSON.stringify(incomingUser))

    if (incomingToken) {
      setToken(incomingToken)
      setStoredToken(incomingToken)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(USER_KEY)
    clearStoredToken()
  }

  const updateUser = (nextUser) => {
    setUser((prev) => {
      const merged = { ...(prev ?? {}), ...(nextUser ?? {}) }
      localStorage.setItem(USER_KEY, JSON.stringify(merged))
      return merged
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: Boolean(user), login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}
