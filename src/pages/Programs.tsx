import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, MapPin, CalendarClock } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import { getPrograms, type Program } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { type ProgramStatus } from '../data/programs'

function formatDate(iso: string | null, lang: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/** Sort: upcoming first (soonest date first), then completed (most recent first). */
function sortPrograms(list: Program[]) {
  return [...list].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'upcoming' ? -1 : 1
    const da = a.event_date ? new Date(a.event_date).getTime() : 0
    const db = b.event_date ? new Date(b.event_date).getTime() : 0
    return a.status === 'upcoming' ? da - db : db - da
  })
}

export default function Programs() {
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  const [active, setActive] = useState<ProgramStatus | 'all'>('all')
  const { data, loading } = useAsync<Program[]>(() => getPrograms(), [])
  const items = data ?? []

  const filtered = useMemo(() => {
    const list = active === 'all' ? items : items.filter((p) => p.status === active)
    return sortPrograms(list)
  }, [active, items])

  const emptyText =
    active === 'upcoming'
      ? t('programs.upcomingEmpty')
      : active === 'completed'
        ? t('programs.completedEmpty')
        : t('programs.empty')

  return (
    <>
      <PageHeader
        kicker={t('programs.kicker')}
        title={t('programs.title')}
        intro={t('programs.intro')}
        image="/gallery/g10-samman-samaroh.jpg"
      />

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          <FilterButton active={active === 'all'} onClick={() => setActive('all')}>
            {t('programs.all')}
          </FilterButton>
          <FilterButton active={active === 'upcoming'} onClick={() => setActive('upcoming')}>
            {t('programs.upcoming')}
          </FilterButton>
          <FilterButton active={active === 'completed'} onClick={() => setActive('completed')}>
            {t('programs.completed')}
          </FilterButton>
        </div>

        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-96 animate-pulse rounded-3xl bg-marigold-100/60" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-ink-700">
            <CalendarClock className="size-12 text-vermilion-400" />
            <p className="text-lg font-medium">{emptyText}</p>
          </div>
        ) : (
          <motion.div layout className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {filtered.map((p, i) => (
                <ProgramCard key={p.id} p={p} index={i} pick={pick} lang={lang} t={t} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </>
  )
}

function ProgramCard({
  p,
  index,
  pick,
  lang,
  t,
}: {
  p: Program
  index: number
  pick: <T>(f: { hi: T; en: T }) => T
  lang: string
  t: (k: string) => string
}) {
  const date = formatDate(p.event_date, lang)
  const location = pick(p.location)
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: Math.min(index * 0.06, 0.3) }}
      className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-marigold-200 transition-all hover:-translate-y-1.5 hover:shadow-2xl"
    >
      <div className="relative overflow-hidden">
        {p.image_url ? (
          <img
            src={p.image_url}
            alt={pick(p.title)}
            loading="lazy"
            className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="grid aspect-[16/10] w-full place-items-center bg-gradient-to-br from-vermilion-600 to-marigold-500">
            <CalendarDays className="size-14 text-white/80" />
          </div>
        )}
        <StatusBadge status={p.status} t={t} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-vermilion-600">
          <CalendarDays className="size-3.5" /> {date || t('programs.dateTba')}
        </p>
        <h3 className="font-display text-xl font-normal leading-snug text-ink-900">
          {pick(p.title)}
        </h3>
        {location && (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-ink-700">
            <MapPin className="size-3.5 text-vermilion-500" /> {location}
          </p>
        )}
        <p className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-ink-700">
          {pick(p.description)}
        </p>
      </div>
    </motion.article>
  )
}

function StatusBadge({ status, t }: { status: ProgramStatus; t: (k: string) => string }) {
  const upcoming = status === 'upcoming'
  return (
    <span
      className={`absolute left-4 top-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow ${
        upcoming ? 'bg-green-600 text-white' : 'bg-ink-900/80 text-white backdrop-blur'
      }`}
    >
      {upcoming ? t('programs.upcoming') : t('programs.completed')}
    </span>
  )
}

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
        active
          ? 'bg-gradient-to-r from-vermilion-600 to-marigold-500 text-white shadow-md'
          : 'bg-white text-ink-700 ring-1 ring-marigold-200 hover:bg-marigold-50'
      }`}
    >
      {children}
    </button>
  )
}
