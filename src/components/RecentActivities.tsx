import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Bell, X, ArrowRight, CalendarDays } from 'lucide-react'
import { useLang } from '../lib/useLang'
import type { Activity } from '../lib/api'

const POPUP_KEY = 'devarpan-activities-popup'

function shortDate(iso: string | null, lang: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'short',
  })
}

/** A one-time popup (after 10s) inviting visitors to see recent activities. */
export function ActivitiesPopup({ items }: { items: Activity[] }) {
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!items.length) return
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(POPUP_KEY)) return
    const timer = setTimeout(() => setOpen(true), 10000)
    return () => clearTimeout(timer)
  }, [items.length])

  const close = () => {
    setOpen(false)
    try {
      sessionStorage.setItem(POPUP_KEY, '1')
    } catch {
      /* ignore */
    }
  }

  const preview = items.slice(0, 3)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[90] grid place-items-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={close}
              aria-label={t('activities.close')}
              className="absolute right-3 top-3 z-10 grid size-9 place-items-center rounded-full bg-white/90 text-ink-700 shadow ring-1 ring-marigold-200 hover:bg-marigold-50"
            >
              <X className="size-5" />
            </button>

            <div className="bg-gradient-to-br from-vermilion-700 to-vermilion-900 px-6 py-5 text-white">
              <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-marigold-300">
                <Bell className="size-4" /> {t('activities.label')}
              </p>
              <h3 className="mt-1 font-display text-2xl font-normal leading-tight">
                {t('activities.popupTitle')}
              </h3>
              <p className="mt-1 text-sm text-white/80">{t('activities.popupText')}</p>
            </div>

            <ul className="divide-y divide-marigold-100 px-6">
              {preview.map((a) => {
                const row = (
                  <div className="flex items-center gap-3 py-3">
                    {a.image_url ? (
                      <img
                        src={a.image_url}
                        alt=""
                        className="size-12 shrink-0 rounded-xl object-cover ring-1 ring-marigold-200"
                      />
                    ) : (
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-marigold-100 text-vermilion-600">
                        <CalendarDays className="size-5" />
                      </span>
                    )}
                    <div className="min-w-0">
                      {a.date && (
                        <p className="text-xs font-semibold text-vermilion-600">{shortDate(a.date, lang)}</p>
                      )}
                      <p className="line-clamp-2 text-sm font-medium text-ink-800">{pick(a.text)}</p>
                    </div>
                  </div>
                )
                return (
                  <li key={a.id}>
                    {a.link ? (
                      <Link to={a.link} onClick={close} className="block hover:bg-marigold-50/60">
                        {row}
                      </Link>
                    ) : (
                      row
                    )}
                  </li>
                )
              })}
            </ul>

            <div className="flex items-center justify-end gap-3 border-t border-marigold-100 px-6 py-4">
              <button
                onClick={close}
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-ink-700 hover:bg-marigold-50"
              >
                {t('activities.close')}
              </button>
              <Link
                to="/programs"
                onClick={close}
                className="inline-flex items-center gap-1.5 rounded-xl bg-vermilion-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-vermilion-700"
              >
                {t('activities.viewAll')} <ArrowRight className="size-4" />
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
