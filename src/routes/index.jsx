import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import Layout from '../components/common/Layout'

// Public Pages
import Home from '../pages/Homepage/Home'
import Maps from '../pages/Maps/Maps'
import ArtikelList from '../pages/Artikel/ArtikelList'
import ArtikelDetail from '../pages/Artikel/ArtikelDetail'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ProfilSPPG from '../pages/Profil/ProfilSPPG'
import ProfilSekolah from '../pages/Profil/ProfilSekolah'

// Protected Pages (harus login)
import DashboardSPPG from '../pages/Dashboard/DashboardSPPG'
import DashboardSekolah from '../pages/Dashboard/DashboardSekolah'
import NotificationSekolah from '../pages/Notification/NotificationSekolah'
import NotificationSPPG from '../pages/Notification/NotificationSPPG'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes - outside Layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard/Notif Routes - outside Layout (custom navbar), but protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/sppg" element={<DashboardSPPG />} />
          <Route path="/dashboard/sekolah" element={<DashboardSekolah />} />
          <Route path="/notification/sekolah" element={<NotificationSekolah />} />
          <Route path="/notification" element={<NotificationSPPG />} />
        </Route>

        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/maps" element={<Maps />} />
          <Route path="/artikel" element={<ArtikelList />} />
          <Route path="/artikel/:id" element={<ArtikelDetail />} />
          <Route path="/profil/sppg/:id" element={<ProfilSPPG />} />
          <Route path="/profil/sekolah/:id" element={<ProfilSekolah />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
