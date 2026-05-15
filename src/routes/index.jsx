import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Suspense, useEffect } from 'react'
import { lazy } from 'react'
import ProtectedRoute from './ProtectedRoute'
import Layout from '../components/common/Layout'

// Public Pages
import Home from '../pages/Homepage/Home'
import Maps from '../pages/Maps/Maps'
import ArtikelList from '../pages/Artikel/ArtikelList'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ProfilSPPG from '../pages/Profil/ProfilSPPG'
import ProfilSekolah from '../pages/Profil/ProfilSekolah'

// Lazy-loaded Pages (to reduce initial bundle)
const ArtikelDetail = lazy(() => import('../pages/Artikel/ArtikelDetail'))
const DashboardSPPG = lazy(() => import('../pages/Dashboard/DashboardSPPG'))
const DashboardSekolah = lazy(() => import('../pages/Dashboard/DashboardSekolah'))
const NotificationSekolah = lazy(() => import('../pages/Notification/NotificationSekolah'))
const NotificationSPPG = lazy(() => import('../pages/Notification/NotificationSPPG'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

// Loading fallback component
function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Memuat halaman...</p>
      </div>
    </div>
  )
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Auth Routes - outside Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/maps" element={<Maps />} />

        {/* Dashboard/Notif Routes - outside Layout (custom navbar), but protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/sppg" element={<Suspense fallback={<LoadingFallback />}><DashboardSPPG /></Suspense>} />
          <Route path="/dashboard/sekolah" element={<Suspense fallback={<LoadingFallback />}><DashboardSekolah /></Suspense>} />
          <Route path="/notification/sekolah" element={<Suspense fallback={<LoadingFallback />}><NotificationSekolah /></Suspense>} />
          <Route path="/notification" element={<Suspense fallback={<LoadingFallback />}><NotificationSPPG /></Suspense>} />
        </Route>

        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/artikel" element={<ArtikelList />} />
          <Route path="/artikel/:id" element={<Suspense fallback={<LoadingFallback />}><ArtikelDetail /></Suspense>} />
          <Route path="/profil/sppg/:id" element={<ProfilSPPG />} />
          <Route path="/profil/sekolah/:id" element={<ProfilSekolah />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
