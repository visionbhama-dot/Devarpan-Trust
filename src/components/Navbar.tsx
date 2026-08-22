import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Heart } from 'lucide-react'
import LanguageToggle from './LanguageToggle'
import OmLogo from './OmLogo'

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/objectives', key: 'nav.objectives' },
  { to: '/members', key: 'nav.members' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b-4 border-vermilion-600 bg-white shadow-md">
      {/* thin festive top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-vermilion-600 via-marigold-400 to-vermilion-600" />

      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <OmLogo size="md" />
          <span className="leading-tight">
            <span className="block font-display text-2xl font-normal tracking-tight text-ink-900 md:text-3xl">
              {t('brand.name')}
            </span>
            <span className="block text-[11px] font-semibold text-vermilion-700 md:text-xs">
              {t('brand.sanskrit')}
            </span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-4 py-2 text-[15px] font-bold transition-colors ${
                    isActive
                      ? 'bg-vermilion-600 text-white shadow-sm'
                      : 'text-ink-900 hover:bg-marigold-100 hover:text-vermilion-700'
                  }`
                }
              >
                {t(l.key)}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageToggle variant="light" />
          </div>
          <Link
            to="/contact"
            className="hidden items-center gap-1.5 rounded-full bg-vermilion-600 px-4 py-2 text-sm font-bold text-white shadow-md transition-transform hover:scale-105 hover:bg-vermilion-700 md:inline-flex"
          >
            <Heart className="size-4 fill-white" />
            {t('nav.donate')}
          </Link>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-marigold-100 text-vermilion-700 ring-1 ring-vermilion-200 lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            aria-expanded={open}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-marigold-200 bg-white lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-base font-bold ${
                      isActive
                        ? 'bg-vermilion-600 text-white'
                        : 'text-ink-900 hover:bg-marigold-100'
                    }`
                  }
                >
                  {t(l.key)}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between gap-3">
              <LanguageToggle variant="light" />
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-vermilion-600 px-4 py-2 text-sm font-bold text-white"
              >
                <Heart className="size-4 fill-white" />
                {t('nav.donate')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
