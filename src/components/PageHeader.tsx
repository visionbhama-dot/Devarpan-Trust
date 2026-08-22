import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Home, ChevronRight } from 'lucide-react'

export default function PageHeader({
  kicker,
  title,
  intro,
  image,
}: {
  kicker: string
  title: string
  intro?: string
  /** Background photo for the hero banner (public path). */
  image?: string
}) {
  const { t } = useTranslation()

  // Fallback: light Mandana header when no image is supplied
  if (!image) {
    return (
      <section className="relative overflow-hidden border-b-4 border-marigold-400 bg-mandana">
        <div className="relative mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <span className="mb-4 inline-block rounded-full bg-vermilion-600 px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-white shadow-sm">
            {kicker}
          </span>
          <h1 className="font-display text-5xl font-normal text-ink-900 md:text-6xl">{title}</h1>
          {intro && <p className="mx-auto mt-4 max-w-2xl text-ink-700">{intro}</p>}
        </div>
      </section>
    )
  }

  return (
    <section className="relative isolate flex min-h-[44vh] items-center overflow-hidden border-b-4 border-marigold-400 text-white md:min-h-[54vh]">
      {/* background photo */}
      <img src={image} alt="" className="absolute inset-0 -z-30 size-full object-cover" />
      {/* maroon overlay + folk-art texture */}
      <div className="absolute inset-0 -z-20 bg-gradient-to-br from-vermilion-900/90 via-ink-900/80 to-vermilion-900/90" />
      <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-30" aria-hidden />

      <div className="relative mx-auto w-full max-w-4xl px-6 py-16 text-center md:py-20">
        {/* breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 flex items-center justify-center gap-1.5 text-sm font-semibold text-marigold-200"
          aria-label="breadcrumb"
        >
          <Link to="/" className="inline-flex items-center gap-1 hover:text-white">
            <Home className="size-4" /> {t('nav.home')}
          </Link>
          <ChevronRight className="size-4 opacity-70" />
          <span className="text-white">{title}</span>
        </motion.nav>

        <motion.span
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 }}
          className="mb-4 inline-block rounded-full bg-vermilion-600 px-5 py-1.5 text-sm font-bold uppercase tracking-widest text-white shadow-lg ring-1 ring-marigold-300/40"
        >
          {kicker}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display text-5xl font-normal drop-shadow-2xl md:text-7xl"
        >
          {title}
        </motion.h1>

        {/* decorative divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.15 }}
          className="mx-auto mt-5 flex items-center justify-center gap-2"
        >
          <span className="h-1 w-12 rounded-full bg-marigold-400" />
          <span className="size-3 rotate-45 bg-marigold-400" />
          <span className="h-1 w-12 rounded-full bg-marigold-400" />
        </motion.div>

        {intro && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-white/90 drop-shadow-lg md:text-lg"
          >
            {intro}
          </motion.p>
        )}
      </div>

      {/* festive bottom accent */}
      <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-vermilion-600 via-marigold-400 to-vermilion-600" />
    </section>
  )
}
