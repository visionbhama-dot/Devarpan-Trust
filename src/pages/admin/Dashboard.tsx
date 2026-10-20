import { Link } from 'react-router-dom'
import {
  Images,
  GalleryHorizontal,
  Users,
  CalendarDays,
  CalendarCheck,
  Newspaper,
  Target,
  Settings as SettingsIcon,
  ArrowRight,
} from 'lucide-react'
import {
  getGallery,
  getMembers,
  getObjectives,
  getBlogs,
  getPrograms,
  getBanners,
  getBookingRequests,
  isSupabaseConfigured,
} from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import { Notice } from '../../components/admin/ui'

export default function Dashboard() {
  const { data: gallery } = useAsync(() => getGallery(), [])
  const { data: members } = useAsync(() => getMembers(), [])
  const { data: objectives } = useAsync(() => getObjectives(), [])
  const { data: blogs } = useAsync(() => getBlogs(false), [])
  const { data: programs } = useAsync(() => getPrograms(), [])
  const { data: banners } = useAsync(() => getBanners(false), [])
  const { data: bookings } = useAsync(() => getBookingRequests(), [])

  const cards = [
    { to: '/admin/banners', label: 'Home Banners', count: banners?.length, icon: GalleryHorizontal },
    { to: '/admin/gallery', label: 'Gallery Photos', count: gallery?.length, icon: Images },
    { to: '/admin/members', label: 'Members', count: members?.length, icon: Users },
    { to: '/admin/programs', label: 'Programs', count: programs?.length, icon: CalendarDays },
    { to: '/admin/bookings', label: 'Bookings', count: bookings?.length, icon: CalendarCheck },
    { to: '/admin/blogs', label: 'Blog Posts', count: blogs?.length, icon: Newspaper },
    { to: '/admin/objectives', label: 'Objectives', count: objectives?.length, icon: Target },
  ]

  return (
    <div>
      <h1 className="font-display text-3xl font-normal text-ink-900 md:text-4xl">Dashboard</h1>
      <p className="mt-1 text-ink-700">Manage all the content of your website from here.</p>

      {!isSupabaseConfigured && (
        <div className="mt-5">
          <Notice kind="error">
            Supabase keys are not connected yet, so you are seeing sample data and cannot save changes.
            Complete the setup in <code className="font-mono">supabase/SETUP.md</code> and add the keys.
          </Notice>
        </div>
      )}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.to}
            to={c.to}
            className="group rounded-2xl border border-marigold-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-vermilion-600 to-marigold-500 text-white">
                <c.icon className="size-6" />
              </span>
              <span className="font-display text-4xl font-normal text-ink-900">
                {c.count ?? '—'}
              </span>
            </div>
            <p className="mt-4 flex items-center justify-between font-bold text-ink-800">
              {c.label}
              <ArrowRight className="size-4 text-vermilion-600 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-marigold-200 bg-white p-6">
        <h2 className="font-display text-xl font-normal text-ink-900">Quick actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            to="/admin/settings"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-800 ring-1 ring-marigold-300 hover:bg-marigold-50"
          >
            <SettingsIcon className="size-4" /> Edit contact & social links
          </Link>
          <Link
            to="/admin/blogs"
            className="inline-flex items-center gap-2 rounded-xl bg-vermilion-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-vermilion-700"
          >
            <Newspaper className="size-4" /> Write a new blog
          </Link>
        </div>
      </div>
    </div>
  )
}
