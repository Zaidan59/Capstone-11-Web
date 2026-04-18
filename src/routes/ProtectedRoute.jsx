import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

const ProtectedRoute = () => {
  const { user } = useAuth()

  // Kalau belum login, redirect ke /login
  return user ? <Outlet /> : <Navigate to="/login" replace />
}

export default ProtectedRoute
