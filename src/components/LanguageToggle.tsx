import { useTranslation } from 'react-i18next'
import { Languages } from 'lucide-react'
import { LANGUAGES } from '../i18n'

export default function LanguageToggle({
  variant = 'dark',
}: {
  variant?: 'light' | 'dark'
}) {
  const { i18n } = useTranslation()
  const current = i18n.language?.startsWith('en') ? 'en' : 'hi'

  const isLight = variant === 'light'

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full p-1 ${
        isLight
          ? 'bg-marigold-100 ring-1 ring-vermilion-200'
          : 'bg-white/15 ring-1 ring-white/25 backdrop-blur'
      }`}
      role="group"
      aria-label="Language selector"
    >
      <Languages
        className={`ml-1.5 size-4 ${isLight ? 'text-vermilion-600' : 'text-white/90'}`}
        aria-hidden
      />
      {LANGUAGES.map((l) => {
        const active = current === l.code
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => i18n.changeLanguage(l.code)}
            aria-pressed={active}
            className={`rounded-full px-3 py-1 text-sm font-bold transition-colors ${
              active
                ? isLight
                  ? 'bg-vermilion-600 text-white shadow'
                  : 'bg-white text-vermilion-700 shadow'
                : isLight
                  ? 'text-ink-800 hover:bg-marigold-200'
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
