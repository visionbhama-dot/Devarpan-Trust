import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { Flame, Activity, GraduationCap, HandHeart, CalendarDays, X, ImageIcon } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import {
  galleryCategories,
  galleryItems,
  type GalleryCategory,
  type GalleryItem,
} from '../data/gallery'

const catIcons: Record<GalleryCategory, typeof Flame> = {
  yajna: Flame,
  yoga: Activity,
  education: GraduationCap,
  women: HandHeart,
  events: CalendarDays,
}

const catGradients: Record<GalleryCategory, string> = {
  yajna: 'from-orange-500 to-red-600',
  yoga: 'from-leaf-500 to-emerald-700',
  education: 'from-sky-500 to-indigo-600',
  women: 'from-pink-500 to-rose-600',
  events: 'from-amber-500 to-saffron-700',
}

export default function Gallery() {
  const { t } = useTranslation()
  const { pick } = useLang()
  const [active, setActive] = useState<GalleryCategory | 'all'>('all')
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null)

  const filtered = useMemo(
    () => (active === 'all' ? galleryItems : galleryItems.filter((g) => g.category === active)),
    [active],
  )

  return (
    <>
      <PageHeader
        kicker={t('gallery.kicker')}
        title={t('gallery.title')}
        intro={t('gallery.intro')}
        image="/gallery/g08-satsang-yajna.jpg"
      />

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-16">
        {/* Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-2.5">
          <FilterButton active={active === 'all'} onClick={() => setActive('all')}>
            {t('gallery.all')}
          </FilterButton>
          {galleryCategories.map((c) => (
            <FilterButton key={c.key} active={active === c.key} onClick={() => setActive(c.key)}>
              {pick(c)}
            </FilterButton>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => {
              const Icon = catIcons[item.category]
              return (
                <motion.button
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => setLightbox(item)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl text-left shadow-md ring-1 ring-black/5"
                >
                  {item.src ? (
                    <img
                      src={item.src}
                      alt={pick(item.caption)}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className={`grid size-full place-items-center bg-gradient-to-br ${
                        catGradients[item.category]
                      } transition-transform duration-500 group-hover:scale-110`}
                    >
                      <Icon className="size-16 text-white/85" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <span className="mb-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                      {pick(galleryCategories.find((c) => c.key === item.category)!)}
                    </span>
                    <p className="font-semibold text-white drop-shadow">{pick(item.caption)}</p>
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </motion.div>

        <p className="mt-10 flex items-center justify-center gap-2 text-center text-sm text-ink-700/70">
          <ImageIcon className="size-4" /> {t('gallery.note')}
        </p>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-black/80 p-4 backdrop-blur"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute right-5 top-5 grid size-11 place-items-center rounded-full bg-white/15 text-white hover:bg-white/25"
              onClick={() => setLightbox(null)}
              aria-label="Close"
            >
              <X className="size-6" />
            </button>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {lightbox.src ? (
                <img src={lightbox.src} alt={pick(lightbox.caption)} className="max-h-[70vh] w-full object-contain" />
              ) : (
                <div
                  className={`grid aspect-video w-full place-items-center bg-gradient-to-br ${
                    catGradients[lightbox.category]
                  }`}
                >
                  {(() => {
                    const Icon = catIcons[lightbox.category]
                    return <Icon className="size-24 text-white/85" />
                  })()}
                </div>
              )}
              <div className="p-5 text-center">
                <p className="font-display text-lg font-bold text-ink-900">{pick(lightbox.caption)}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
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
          ? 'bg-gradient-to-r from-saffron-600 to-leaf-600 text-white shadow-md'
          : 'bg-white text-ink-700 ring-1 ring-saffron-200 hover:bg-saffron-50'
      }`}
    >
      {children}
    </button>
  )
}
