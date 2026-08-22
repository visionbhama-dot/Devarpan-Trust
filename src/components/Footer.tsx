import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { MapPin, Phone, Mail, Heart } from 'lucide-react'
import { FacebookIcon, InstagramIcon, YouTubeIcon, TwitterIcon } from './icons'
import OmLogo from './OmLogo'
import { useLang } from '../lib/useLang'
import { useSettings } from '../lib/SettingsContext'

const links = [
  { to: '/', key: 'nav.home' },
  { to: '/objectives', key: 'nav.objectives' },
  { to: '/members', key: 'nav.members' },
  { to: '/gallery', key: 'nav.gallery' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/contact', key: 'nav.contact' },
]

export default function Footer() {
  const { t } = useTranslation()
  const { pick } = useLang()
  const settings = useSettings()
  const { socials } = settings

  const socialLinks = [
    { url: socials.facebook, Icon: FacebookIcon, label: 'Facebook' },
    { url: socials.instagram, Icon: InstagramIcon, label: 'Instagram' },
    { url: socials.youtube, Icon: YouTubeIcon, label: 'YouTube' },
    { url: socials.twitter, Icon: TwitterIcon, label: 'X' },
  ].filter((s) => s.url)

  return (
    <footer className="relative isolate overflow-hidden border-t border-marigold-200 bg-sand text-ink-700">
      <div className="h-1.5 w-full bg-gradient-to-r from-vermilion-600 via-marigold-400 to-vermilion-600" />
      <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-50" aria-hidden />

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <OmLogo size="md" />
            <div>
              <p className="font-display text-2xl font-normal text-ink-900">{t('brand.name')}</p>
              <p className="text-xs font-semibold text-vermilion-600">{t('brand.sanskrit')}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-700">{t('footer.about')}</p>

          {/* Social media */}
          {socialLinks.length > 0 && (
            <div className="mt-5 flex gap-2.5">
              {socialLinks.map(({ url, Icon, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="grid size-9 place-items-center rounded-full bg-vermilion-600 text-white shadow-sm transition-colors hover:bg-marigold-500"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Quick links */}
        <div>
          <h3 className="mb-4 font-display text-xl font-normal text-vermilion-700">
            {t('footer.quickLinks')}
          </h3>
          <ul className="space-y-2 text-sm">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="font-medium text-ink-700 transition-colors hover:text-vermilion-600"
                >
                  {t(l.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="mb-4 font-display text-xl font-normal text-vermilion-700">
            {t('footer.contactTitle')}
          </h3>
          <ul className="space-y-3 text-sm text-ink-700">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-vermilion-600" />
              <span>{pick(settings.address)}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-vermilion-600" />
              <span className="flex flex-col">
                {settings.phones.map((p) => (
                  <a key={p} href={`tel:+91${p}`} className="hover:text-vermilion-600">
                    +91 {p}
                  </a>
                ))}
              </span>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-vermilion-600" />
              <a href={`mailto:${settings.email}`} className="break-all hover:text-vermilion-600">
                {settings.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Donate */}
        <div>
          <h3 className="mb-4 font-display text-xl font-normal text-vermilion-700">
            {t('footer.donateTitle')}
          </h3>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="text-ink-600">{t('contact.pan')}</dt>
              <dd className="font-mono font-semibold text-ink-900">{settings.bank.pan}</dd>
            </div>
            <div>
              <dt className="text-ink-600">{t('contact.account')}</dt>
              <dd className="font-mono font-semibold text-ink-900">{settings.bank.account}</dd>
            </div>
            <div>
              <dt className="text-ink-600">{t('contact.ifsc')}</dt>
              <dd className="font-mono font-semibold text-ink-900">{settings.bank.ifsc}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="border-t border-marigold-300/40">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 text-center text-xs text-ink-600 sm:flex-row sm:text-left">
          <p>
            © {new Date().getFullYear()} {t('brand.name')}. {t('footer.rights')}
          </p>
          <p className="inline-flex items-center gap-1.5">
            {t('footer.made')} <Heart className="size-3.5 fill-vermilion-500 text-vermilion-500" />
          </p>
        </div>
      </div>
    </footer>
  )
}
