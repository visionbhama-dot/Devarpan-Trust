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
    <footer className="bg-ink-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-gradient-to-br from-saffron-500 to-leaf-600 text-2xl font-bold text-white">
              ॐ
            </span>
            <div>
              <p className="font-display text-lg font-extrabold text-white">{t('brand.name')}</p>
              <p className="text-xs text-saffron-300">{t('brand.sanskrit')}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{t('footer.about')}</p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 font-display text-base font-bold text-white">{t('footer.quickLinks')}</h3>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-slate-400 transition-colors hover:text-saffron-300">
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-display text-base font-bold text-white">{t('footer.contactTitle')}</h3>
          <ul className="space-y-3 text-sm text-slate-400">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-saffron-400" />
              <span>{pick(trustInfo.address)}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-saffron-400" />
              <span className="flex flex-col">
                {trustInfo.phones.map((p) => (
                  <a key={p} href={`tel:+91${p}`} className="hover:text-saffron-300">
                    +91 {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-saffron-400" />
              <a href={`mailto:${trustInfo.email}`} className="break-all hover:text-saffron-300">
                {trustInfo.email}
              </a>
            </li>
            <li className="flex gap-2.5">
              <FacebookIcon className="mt-0.5 size-4 shrink-0 text-saffron-400" />
              <a
                href={trustInfo.facebook}
                target="_blank"
                rel="noreferrer"
                className="hover:text-saffron-300"
              >
                Facebook
              </a>
            </li>
          </ul>
        </div>

        {/* Donate */}
        <div>
          <h3 className="mb-4 font-display text-base font-bold text-white">{t('footer.donateTitle')}</h3>
          <dl className="space-y-2 text-sm text-slate-400">
            <div>
              <dt className="text-slate-500">{t('contact.pan')}</dt>
              <dd className="font-mono text-slate-200">{trustInfo.bank.pan}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('contact.account')}</dt>
              <dd className="font-mono text-slate-200">{trustInfo.bank.account}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('contact.ifsc')}</dt>
              <dd className="font-mono text-slate-200">{trustInfo.bank.ifsc}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-xs text-slate-500 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </p>
          <p className="inline-flex items-center gap-1.5">
            {t('footer.made')} <Heart className="size-3.5 fill-saffron-500 text-saffron-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
