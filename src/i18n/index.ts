import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import hi from './locales/hi'
import en from './locales/en'

export const LANGUAGES = [
  { code: 'hi', label: 'हिन्दी' },
  { code: 'en', label: 'English' },
] as const

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      hi: { translation: hi },
      en: { translation: en },
    },
    fallbackLng: 'hi',
    supportedLngs: ['hi', 'en'],
    detection: {
      // Prefer a previously chosen language; otherwise default to Hindi.
      order: ['localStorage', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'devarpan-lang',
    },
    interpolation: { escapeValue: false },
  })

export default i18n
