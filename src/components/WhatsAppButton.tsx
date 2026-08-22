import { useTranslation } from 'react-i18next'
import { WhatsAppIcon } from './icons'
import { useSettings } from '../lib/SettingsContext'

export default function WhatsAppButton() {
  const { t } = useTranslation()
  const settings = useSettings()
  const raw = settings.socials.whatsapp || settings.phones[0] || ''
  if (!raw) return null
  const number = raw.startsWith('91') ? raw : `91${raw}`
  const text = encodeURIComponent(t('whatsapp.prefill'))
  const href = `https://wa.me/${number}?text=${text}`

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={t('whatsapp.label')}
      className="group fixed bottom-5 right-5 z-[70] flex items-center gap-2"
    >
      <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/50" aria-hidden />
      <span className="hidden rounded-full bg-white px-3 py-2 text-sm font-bold text-[#075E54] shadow-lg ring-1 ring-black/5 md:group-hover:inline-block">
        {t('whatsapp.label')}
      </span>
      <span className="grid size-14 place-items-center rounded-full bg-[#25D366] text-white shadow-2xl ring-4 ring-white/70 transition-transform hover:scale-110">
        <WhatsAppIcon className="size-8" />
      </span>
    </a>
  )
}
