import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { useLang } from '../lib/useLang'
import type { Banner } from '../lib/api'

const SLIDE_MS = 6000

/** Auto-rotating hero banner for the home page. Admin-managed. */
export default function HeroCarousel({ banners }: { banners: Banner[] }) {
  const { t } = useTranslation()
  const { pick } = useLang()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const count = banners.length
  const go = useCallback(
    (n: number) => setIndex(((n % count) + count) % Math.max(count, 1)),
    [count],
  )
  const next = useCallback(() => go(index + 1), [go, index])
  const prev = useCallback(() => go(index - 1), [go, index])

  useEffect(() => {
    if (count <= 1 || paused) return
    const id = setTimeout(() => setIndex((i) => (i + 1) % count), SLIDE_MS)
    return () => clearTimeout(id)
  }, [index, count, paused])

  // Keep index valid if banners change
  useEffect(() => {
    if (index >= count) setIndex(0)
  }, [count, index])

  if (!count) return null

  const slide = banners[index]
  const title = pick(slide.title)
  const subtitle = pick(slide.subtitle)
  const isPoster = slide.fit === 'contain'

  const Media = (
    <>
      {/* Blurred backdrop so posters never get cropped but still fill the width */}
      {isPoster && (
        <img
          src={slide.image_url}
          alt=""
          aria-hidden
          className="absolute inset-0 -z-30 size-full scale-110 object-cover blur-2xl"
        />
      )}
      <img
        src={slide.image_url}
        alt={title || 'Devarpan Trust'}
        className={`absolute inset-0 -z-20 size-full ${isPoster ? 'object-contain' : 'object-cover'}`}
      />
      {/* Readability overlay — lighter for posters so artwork stays visible */}
      <div
        className={`absolute inset-0 -z-10 ${
          isPoster
            ? 'bg-ink-900/25'
            : 'bg-gradient-to-t from-ink-900/90 via-ink-900/45 to-vermilion-900/50'
        }`}
      />
    </>
  )

  return (
    <section
      className="relative isolate overflow-hidden border-b-4 border-marigold-400 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      <div className="relative h-[62vh] min-h-[380px] w-full sm:h-[70vh] lg:h-[82vh]">
        <AnimatePresence mode="sync">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            {Media}
          </motion.div>
        </AnimatePresence>

        {/* Caption */}
        {(title || subtitle) && (
          <div className="absolute inset-x-0 bottom-0 z-10 p-6 pb-16 md:p-12 md:pb-20">
            <div className="mx-auto max-w-5xl text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={`cap-${slide.id}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.45 }}
                >
                  {title && (
                    <h1 className="font-display text-3xl font-normal leading-tight drop-shadow-2xl sm:text-5xl md:text-6xl">
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mx-auto mt-3 max-w-2xl text-sm font-semibold leading-relaxed text-white/90 drop-shadow-lg sm:text-base md:text-lg">
                      {subtitle}
                    </p>
                  )}
                  {slide.link && (
                    <Link
                      to={slide.link}
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-marigold-400 px-7 py-3 text-sm font-bold text-ink-900 shadow-2xl transition-transform hover:scale-105 hover:bg-marigold-300 md:text-base"
                    >
                      {t('home.bannerCta')} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Arrows */}
        {count > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous slide"
              className="absolute left-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/60 md:left-5 md:size-12"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={next}
              aria-label="Next slide"
              className="absolute right-3 top-1/2 z-20 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white backdrop-blur transition-colors hover:bg-black/60 md:right-5 md:size-12"
            >
              <ChevronRight className="size-6" />
            </button>
          </>
        )}

        {/* Dots */}
        {count > 1 && (
          <div className="absolute inset-x-0 bottom-5 z-20 flex justify-center gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index}
                className={`h-2.5 rounded-full transition-all ${
                  i === index ? 'w-7 bg-marigold-400' : 'w-2.5 bg-white/60 hover:bg-white'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-vermilion-600 via-marigold-400 to-vermilion-600" />
    </section>
  )
}
