import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Clock, ArrowRight, Sparkles } from 'lucide-react'
import { useLang } from '../lib/useLang'
import type { Program } from '../lib/api'

function formatDate(iso: string | null, lang: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Highlight banner for the upcoming event, shown directly below the hero.
 * Clicking anywhere opens the full event page (details, photos, videos).
 */
export default function FeaturedEventBanner({ program }: { program: Program | null }) {
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  if (!program) return null

  const href = `/programs/${program.id}`
  const start = formatDate(program.event_date, lang)
  const end = formatDate(program.end_date, lang)
  const dateLabel = start ? (end && end !== start ? `${start} – ${end}` : start) : t('programs.dateTba')
  const venue = pick(program.location)
  const timing = pick(program.time_text)

  return (
    <section className="relative isolate overflow-hidden bg-vermilion-900 py-8 md:py-10">
      <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-20" aria-hidden />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mx-auto max-w-7xl px-6"
      >
        <Link
          to={href}
          className="group grid gap-0 overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-marigold-300/50 transition-transform hover:-translate-y-1 md:grid-cols-[minmax(0,340px)_1fr]"
        >
          {/* Poster / image */}
          <div className="relative overflow-hidden bg-marigold-50">
            {program.image_url ? (
              <img
                src={program.image_url}
                alt={pick(program.title)}
                className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-full"
              />
            ) : (
              <div className="grid h-56 w-full place-items-center bg-gradient-to-br from-vermilion-600 to-marigold-500 md:h-full">
                <CalendarDays className="size-16 text-white/80" />
              </div>
            )}
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow-lg">
              <Sparkles className="size-3.5" /> {t('home.featuredEventBadge')}
            </span>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center p-6 md:p-8">
            <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.18em] text-vermilion-600">
              {t('home.featuredEventKicker')}
            </p>
            <h2 className="font-display text-2xl font-normal leading-snug text-ink-900 md:text-4xl">
              {pick(program.title)}
            </h2>

            <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold text-ink-800">
              <div className="inline-flex items-center gap-1.5">
                <CalendarDays className="size-4 shrink-0 text-vermilion-500" />
                <dd>{dateLabel}</dd>
              </div>
              {timing && (
                <div className="inline-flex items-center gap-1.5">
                  <Clock className="size-4 shrink-0 text-vermilion-500" />
                  <dd>{timing}</dd>
                </div>
              )}
              {venue && (
                <div className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 shrink-0 text-vermilion-500" />
                  <dd>{venue}</dd>
                </div>
              )}
            </dl>

            {pick(program.description) && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-700 md:text-base">
                {pick(program.description)}
              </p>
            )}

            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition-all group-hover:gap-3">
              {t('home.featuredEventCta')} <ArrowRight className="size-4" />
            </span>
          </div>
        </Link>
      </motion.div>
    </section>
  )
}
