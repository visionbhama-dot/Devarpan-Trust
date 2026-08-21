import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { LANGUAGES } from '../i18n'

export default function LanguageToggle({ compact = false }: { compact?: boolean }) {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('en') ? 'en' : 'hi'

  return (
    <div
      className="inline-flex items-center gap-1 rounded-full bg-white/15 p-1 backdrop-blur ring-1 ring-white/25"
      role="group"
      aria-label="Language selector"
    >
      {!compact && <Languages className="ml-1.5 size-4 text-white/90" aria-hidden />}
      {LANGUAGES.map((l) => {
        const active = current === l.code
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => i18n.changeLanguage(l.code)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-sm font-semibold transition-colors ${
              active
                ? 'bg-white text-saffron-700 shadow'
                : 'text-white/90 hover:bg-white/10'
            }`}
          >
            {l.label}
          </button>
        )
      })}
    </div>
  )
}
