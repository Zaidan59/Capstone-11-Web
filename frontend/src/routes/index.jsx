import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

// Public Pages
import Home from '../pages/Home/Home'
import Maps from '../pages/Maps/Maps'
import Artikel from '../pages/Artikel/Artikel'
import ArtikelDetail from '../pages/Artikel/ArtikelDetail'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ProfilSPPG from '../pages/Profil/ProfilSPPG'
import ProfilSekolah from '../pages/Profil/ProfilSekolah'

// Protected Pages (harus login)
import DashboardSPPG from '../pages/Dashboard/DashboardSPPG'
import DashboardSekolah from '../pages/Dashboard/DashboardSekolah'
import Notification from '../pages/Notification/Notification'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/maps" element={<Maps />} />
        <Route path="/artikel" element={<Artikel />} />
        <Route path="/artikel/:id" element={<ArtikelDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profil/sppg/:id" element={<ProfilSPPG />} />
        <Route path="/profil/sekolah/:id" element={<ProfilSekolah />} />

        {/* Protected Routes — harus login dulu */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard/sppg" element={<DashboardSPPG />} />
          <Route path="/dashboard/sekolah" element={<DashboardSekolah />} />
          <Route path="/notification" element={<Notification />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}