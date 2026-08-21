import { useTranslation } from 'react-i18next'

export type Lang = 'hi' | 'en'

/** Returns the active language code and a helper to pick a bilingual field. */
export function useLang() {
  const { i18n } = useTranslation()
  const lang: Lang = i18n.language?.startsWith('en') ? 'en' : 'hi'
  const pick = <T,>(field: { hi: T; en: T }): T => field[lang]
  return { lang, pick }
}
