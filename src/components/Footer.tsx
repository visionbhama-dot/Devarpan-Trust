import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'
import { FacebookIcon } from './icons'
import { useLang } from '../lib/useLang'
import { trustInfo } from '../data/trust'

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/objectives', key: 'nav.objectives' },
  { to: '/members', key: 'nav.members' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Footer() {
  const { t } = useTranslation()
  const { pick } = useLang()

  return (
    <footer className="relative isolate overflow-hidden bg-vermilion-900 text-marigold-50/85">
      {/* festive top accent */}
      <div className="h-1.5 w-full bg-gradient-to-r from-marigold-400 via-vermilion-500 to-marigold-400" />
      <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-20" aria-hidden />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-12 place-items-center rounded-full bg-gradient-to-br from-marigold-400 to-vermilion-500 text-2xl font-bold text-white shadow ring-2 ring-marigold-300/40">
              ॐ
            </span>
            <div>
              <p className="font-display text-2xl font-normal text-white">{t('brand.name')}</p>
              <p className="text-xs font-semibold text-marigold-300">{t('brand.sanskrit')}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-marigold-50/70">{t('footer.about')}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 font-display text-xl font-normal text-marigold-300">
            {t('footer.quickLinks')}
          </h3>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="text-marigold-50/75 transition-colors hover:text-marigold-300"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-display text-xl font-normal text-marigold-300">
            {t('footer.contactTitle')}
          </h3>
          <ul className="space-y-3 text-sm text-marigold-50/80">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-marigold-400" />
              <span>{pick(trustInfo.address)}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-marigold-400" />
              <span className="flex flex-col">
                {trustInfo.phones.map((p) => (
                  <a key={p} href={`tel:+91${p}`} className="hover:text-marigold-300">
                    +91 {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-marigold-400" />
              <a href={`mailto:${trustInfo.email}`} className="break-all hover:text-marigold-300">
                {trustInfo.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <FacebookIcon className="mt-0.5 size-4 shrink-0 text-marigold-400" />
              <a
                href={trustInfo.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-marigold-300"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* Donate */}
        <div>
          <h3 className="mb-4 font-display text-xl font-normal text-marigold-300">
            {t('footer.donateTitle')}
          </h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-marigold-50/60">{t('contact.pan')}</dt>
              <dd className="font-mono font-semibold text-white">{trustInfo.bank.pan}</dd>
            </div>
            <div>
              <dt className="text-marigold-50/60">{t('contact.account')}</dt>
              <dd className="font-mono font-semibold text-white">{trustInfo.bank.account}</dd>
            </div>
            <div>
              <dt className="text-marigold-50/60">{t('contact.ifsc')}</dt>
              <dd className="font-mono font-semibold text-white">{trustInfo.bank.ifsc}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-marigold-300/20">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-xs text-marigold-50/60 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </p>
          <p className="inline-flex items-center gap-1.5">
            {t('footer.made')} <Heart className="size-3.5 fill-marigold-400 text-marigold-400" />
          </p>
        </div>
      </div>
    </footer>
  )
}
