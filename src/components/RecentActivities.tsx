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

/** A sliding marquee bar of recent activities for the home page. */
export function ActivitiesTicker({ items }: { items: Activity[] }) {
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  if (!items.length) return null

  const loop = [...items, ...items]
  const duration = Math.max(24, items.length * 9)

  const Item = ({ a }: { a: Activity }) => {
    const inner = (
      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-medium text-white/90">
        {a.image_url && (
          <img src={a.image_url} alt="" className="size-7 shrink-0 rounded-full object-cover ring-2 ring-white/30" />
        )}
        {a.date && (
          <span className="inline-flex items-center gap-1 text-marigold-300">
            <CalendarDays className="size-3.5" />
            {shortDate(a.date, lang)}
          </span>
        )}
        <span>{pick(a.text)}</span>
        <span className="px-1 text-marigold-400">◆</span>
      </span>
    )
    return a.link ? (
      <Link to={a.link} className="transition-opacity hover:opacity-80">
        {inner}
      </Link>
    ) : (
      inner
    )
  }

  return (
    <section
      id="recent-activities"
      className="relative z-10 border-y-2 border-marigold-400/50 bg-vermilion-900 text-white"
    >
      <div className="mx-auto flex max-w-[1600px] items-stretch">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-marigold-400 px-4 py-2.5 font-bold text-ink-900 shadow-md md:px-5">
          <Bell className="size-4 animate-pulse md:size-5" />
          <span className="hidden text-sm uppercase tracking-wide sm:inline md:text-base">
            {t('activities.label')}
          </span>
        </div>
        <div className="marquee-track relative flex-1 overflow-hidden">
          <div
            className="animate-marquee flex w-max items-center gap-8 py-2.5"
            style={{ ['--marquee-duration' as string]: `${duration}s` }}
          >
            {loop.map((a, i) => (
              <Item key={`${a.id}-${i}`} a={a} />
            ))}
          </div>
          {/* soft fade edges */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-vermilion-900 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-vermilion-900 to-transparent" />
        </div>
      </div>
    </section>
  )
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

  const viewAll = () => {
    close()
    document.getElementById('recent-activities')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
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
              <button
                onClick={viewAll}
                className="inline-flex items-center gap-1.5 rounded-xl bg-vermilion-600 px-4 py-2.5 text-sm font-bold text-white shadow hover:bg-vermilion-700"
              >
                {t('activities.viewAll')} <ArrowRight className="size-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
