import { Navigate, Outlet } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../lib/AuthContext'

export default function RequireAuth() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-mandana">
        <Loader2 className="size-8 animate-spin text-vermilion-600" />
      </div>
    )
  }

  if (!user) return <Navigate to="/admin/login" replace />

  return <Outlet />
}
