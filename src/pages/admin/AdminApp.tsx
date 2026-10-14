import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from '../../lib/AuthContext'
import AdminLayout from '../../components/admin/AdminLayout'
import RequireAuth from './RequireAuth'
import Login from './Login'
import Dashboard from './Dashboard'
import BannersAdmin from './BannersAdmin'
import GalleryAdmin from './GalleryAdmin'
import MembersAdmin from './MembersAdmin'
import ProgramsAdmin from './ProgramsAdmin'
import BlogsAdmin from './BlogsAdmin'
import ObjectivesAdmin from './ObjectivesAdmin'
import SettingsAdmin from './SettingsAdmin'

export default function AdminApp() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="banners" element={<BannersAdmin />} />
            <Route path="gallery" element={<GalleryAdmin />} />
            <Route path="members" element={<MembersAdmin />} />
            <Route path="programs" element={<ProgramsAdmin />} />
            <Route path="blogs" element={<BlogsAdmin />} />
            <Route path="objectives" element={<ObjectivesAdmin />} />
            <Route path="settings" element={<SettingsAdmin />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  )
}
