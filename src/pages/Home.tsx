import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Flame, Activity, GraduationCap, HandHeart, ArrowRight, Sparkles } from 'lucide-react'
import { useLang } from '../lib/useLang'
import { vedas } from '../data/trust'

const focusIcons = {
  yajna: Flame,
  yoga: Activity,
  education: GraduationCap,
  women: HandHeart,
} as const

const stats = [
  { key: 'years', value: '10+' },
  { key: 'trustees', value: '7' },
  { key: 'programs', value: '100+' },
  { key: 'lives', value: '5000+' },
] as const

export default function Home() {
  const { t } = useTranslation()
  const { pick } = useLang()

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-saffron-600 via-saffron-500 to-leaf-600 text-white">
        <div className="absolute inset-0 bg-pattern opacity-25" aria-hidden />
        <div className="absolute -right-16 -top-16 size-72 rounded-full bg-white/10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-24 -left-16 size-80 rounded-full bg-leaf-300/20 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold ring-1 ring-white/30"
              >
                <Sparkles className="size-4" /> {t('home.heroKicker')}
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="font-display text-lg font-semibold text-white/90"
              >
                {t('brand.sanskrit')}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mt-2 font-display text-5xl font-black leading-tight drop-shadow-md md:text-6xl"
              >
                {t('home.heroTitle')}
                <span className="ml-2 align-middle text-2xl font-semibold text-saffron-100">
                  {t('brand.registered')}
                </span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="mt-5 max-w-xl text-lg leading-relaxed text-white/90"
              >
                {t('home.heroSubtitle')}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <Link
                  to="/objectives"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-saffron-700 shadow-lg transition-transform hover:scale-105"
                >
                  {t('home.heroCtaPrimary')} <ArrowRight className="size-5" />
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-ink-900/30 px-6 py-3 font-bold text-white ring-2 ring-white/50 backdrop-blur transition-colors hover:bg-ink-900/50"
                >
                  {t('home.heroCtaSecondary')}
                </Link>
              </motion.div>
            </div>

            {/* Decorative Om medallion */}
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15, type: 'spring' }}
              className="relative mx-auto hidden aspect-square w-full max-w-md place-items-center lg:grid"
            >
              <div className="absolute inset-0 animate-pulse rounded-full bg-white/10 blur-2xl" aria-hidden />
              <div className="relative grid size-72 place-items-center rounded-full bg-white/15 ring-4 ring-white/30 backdrop-blur md:size-80">
                <div className="grid size-56 place-items-center rounded-full bg-gradient-to-br from-white to-saffron-100 shadow-2xl md:size-64">
                  <span className="font-display text-[8rem] font-black text-saffron-600 md:text-[9rem]">ॐ</span>
                </div>
                {vedas.map((v, i) => {
                  const angle = (i / vedas.length) * 2 * Math.PI - Math.PI / 2
                  const r = 46
                  const x = 50 + r * Math.cos(angle)
                  const y = 50 + r * Math.sin(angle)
                  return (
                    <span
                      key={v.en}
                      style={{ left: `${x}%`, top: `${y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full bg-leaf-600 px-3 py-1 text-xs font-bold text-white shadow-lg"
                    >
                      {pick(v)}
                    </span>
                  )
                })}
              </div>
            </motion.div>
          </div>
        </div>
        <div className="h-3 w-full bg-gradient-to-r from-saffron-700 via-white/40 to-leaf-700" />
      </section>

      {/* ABOUT */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center md:py-20">
        <p className="mb-2 font-semibold uppercase tracking-widest text-saffron-600">
          {t('home.aboutKicker')}
        </p>
        <h2 className="font-display text-3xl font-extrabold text-ink-900 md:text-4xl">
          {t('home.aboutTitle')}
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-lg leading-relaxed text-ink-700">
          {t('home.aboutText')}
        </p>
        <p className="mt-6 rounded-2xl bg-white p-5 text-base font-medium text-leaf-700 shadow-sm ring-1 ring-leaf-100">
          {t('brand.tagline')}
        </p>
      </section>

      {/* FOCUS AREAS */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-3xl font-extrabold text-ink-900 md:text-4xl">
            {t('home.focusTitle')}
          </h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(['yajna', 'yoga', 'education', 'women'] as const).map((k, i) => {
              const Icon = focusIcons[k]
              return (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group rounded-3xl border border-saffron-100 bg-saffron-50 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-saffron-500 to-leaf-600 text-white shadow-md transition-transform group-hover:scale-110">
                    <Icon className="size-7" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold text-ink-900">
                    {t(`home.focus.${k}.title`)}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-700">
                    {t(`home.focus.${k}.desc`)}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="bg-gradient-to-r from-leaf-700 to-saffron-700 py-16 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-3xl font-extrabold md:text-4xl">
            {t('home.statsTitle')}
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-6 lg:grid-cols-4">
            {stats.map((s, i) => (
              <motion.div
                key={s.key}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-3xl bg-white/10 p-6 text-center ring-1 ring-white/20 backdrop-blur"
              >
                <p className="font-display text-4xl font-black md:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm font-medium text-white/85">
                  {t(`home.stats.${s.key}`)}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-6 py-16 md:py-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-saffron-600 to-leaf-600 p-10 text-center text-white shadow-2xl md:p-14">
          <div className="absolute inset-0 bg-pattern opacity-20" aria-hidden />
          <div className="relative">
            <h2 className="font-display text-3xl font-extrabold md:text-4xl">{t('home.ctaTitle')}</h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">{t('home.ctaText')}</p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-bold text-saffron-700 shadow-lg transition-transform hover:scale-105"
            >
              <HandHeart className="size-5" /> {t('home.ctaButton')}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
