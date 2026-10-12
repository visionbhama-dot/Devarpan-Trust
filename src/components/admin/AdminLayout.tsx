import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Images,
  Users,
  CalendarDays,
  Bell,
  Newspaper,
  Target,
  Settings as SettingsIcon,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react'
import { useAuth } from '../../lib/AuthContext'
import OmLogo from '../OmLogo'

const nav = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/gallery', label: 'Gallery', icon: Images },
  { to: '/admin/members', label: 'Members', icon: Users },
  { to: '/admin/programs', label: 'Programs', icon: CalendarDays },
  { to: '/admin/activities', label: 'Activities', icon: Bell },
  { to: '/admin/blogs', label: 'Blogs', icon: Newspaper },
  { to: '/admin/objectives', label: 'Objectives', icon: Target },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  const logout = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      <Link to="/admin" className="flex items-center gap-3 px-5 py-5" onClick={() => setOpen(false)}>
        <OmLogo size="sm" />
        <div>
          <p className="font-display text-lg font-normal text-white">देवार्पण</p>
          <p className="text-[11px] font-semibold text-marigold-300">Admin Panel</p>
        </div>
      </Link>
      <nav className="flex-1 space-y-1 px-3">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
                isActive
                  ? 'bg-white text-vermilion-700 shadow'
                  : 'text-marigold-50/85 hover:bg-white/10'
              }`
            }
          >
            <n.icon className="size-5" /> {n.label}
          </NavLink>
        ))}
      </nav>
      <div className="space-y-2 border-t border-white/15 p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-marigold-50/85 hover:bg-white/10"
        >
          <ExternalLink className="size-5" /> View Website
        </a>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold text-marigold-50/85 hover:bg-white/10"
        >
          <LogOut className="size-5" /> Log out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-paper lg:flex">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 bg-vermilion-900 lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between bg-vermilion-900 px-4 py-3 lg:hidden">
        <Link to="/admin" className="flex items-center gap-2">
          <OmLogo size="sm" />
          <span className="font-display text-lg text-white">Admin</span>
        </Link>
        <button
          onClick={() => setOpen(true)}
          className="grid size-10 place-items-center rounded-full bg-white/15 text-white"
          aria-label="Menu"
        >
          <Menu className="size-6" />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-vermilion-900 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/15 text-white"
              aria-label="Close"
            >
              <X className="size-5" />
            </button>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Content */}
      <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
        <div className="mb-6 hidden items-center justify-end gap-3 text-sm text-ink-700 lg:flex">
          <span>
            Logged in as <strong className="text-ink-900">{user?.email}</strong>
          </span>
        </div>
        <Outlet />
      </main>
    </div>
  )
}
