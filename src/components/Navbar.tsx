import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, Heart } from 'lucide-react'
import LanguageToggle from './LanguageToggle'

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/objectives', key: 'nav.objectives' },
  { to: '/members', key: 'nav.members' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Navbar() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-saffron-600 via-saffron-500 to-leaf-600 shadow-lg">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className="grid size-11 place-items-center rounded-full bg-white text-2xl font-bold text-saffron-600 shadow-md ring-2 ring-white/60">
            ॐ
          </span>
          <span className="leading-tight text-white">
            <span className="block font-display text-lg font-extrabold tracking-tight md:text-xl">
              {t('brand.name')}
            </span>
            <span className="block text-[11px] font-medium text-white/85 md:text-xs">
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
                  `rounded-full px-4 py-2 text-sm font-semibold text-white transition-colors ${
                    isActive ? 'bg-white/25' : 'hover:bg-white/15'
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
            <LanguageToggle />
          </div>
          <Link
            to="/contact"
            className="hidden items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-saffron-700 shadow-md transition-transform hover:scale-105 md:inline-flex"
          >
            <Heart className="size-4 fill-saffron-600 text-saffron-600" />
            {t('nav.donate')}
          </Link>

          <button
            type="button"
            className="grid size-10 place-items-center rounded-full bg-white/20 text-white lg:hidden"
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
        <div className="border-t border-white/20 bg-saffron-600/95 backdrop-blur lg:hidden">
          <ul className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `block rounded-xl px-4 py-3 text-base font-semibold text-white ${
                      isActive ? 'bg-white/25' : 'hover:bg-white/15'
                    }`
                  }
                >
                  {t(l.key)}
                </NavLink>
              </li>
            ))}
            <li className="mt-2 flex items-center justify-between gap-3">
              <LanguageToggle />
              <Link
                to="/contact"
                onClick={() => setOpen(false)}
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-sm font-bold text-saffron-700"
              >
                <Heart className="size-4 fill-saffron-600 text-saffron-600" />
                {t('nav.donate')}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
