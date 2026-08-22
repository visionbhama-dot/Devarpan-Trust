import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Eye, Target, Flame, Activity, GraduationCap, HandHeart, Crown, ArrowRight } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import { vedas } from '../data/trust'

const focusIcons = { yajna: Flame, yoga: Activity, education: GraduationCap, women: HandHeart } as const

export default function About() {
  const { t } = useTranslation()
  const { pick } = useLang()

  return (
    <>
      <PageHeader
        kicker={t('about.kicker')}
        title={t('about.title')}
        intro={t('about.intro')}
        image="/gallery/g04-yajna.jpg"
      />

      {/* STORY — text left, image right */}
      <section className="py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          <div>
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-vermilion-600">
              {t('about.kicker')}
            </p>
            <h2 className="font-display text-4xl font-normal text-ink-900 md:text-5xl">
              {t('about.storyTitle')}
            </h2>
            <div className="mt-5 flex items-center gap-2">
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
              <span className="size-2.5 rotate-45 bg-marigold-400" />
            </div>
            <p className="mt-5 text-lg leading-relaxed text-ink-700">{t('about.story1')}</p>
            <p className="mt-4 text-lg leading-relaxed text-ink-700">{t('about.story2')}</p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl ring-1 ring-black/5">
              <img src="/gallery/g06-yajna-bal.jpg" alt={t('about.title')} className="aspect-[4/3] w-full object-cover" />
            </div>
            <span className="absolute -bottom-4 -left-4 -z-10 hidden size-28 rounded-3xl bg-marigold-400 lg:block" />
            <span className="absolute -right-4 -top-4 -z-10 hidden size-28 rounded-3xl bg-vermilion-500 lg:block" />
          </motion.div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section className="bg-mandana py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
          {[
            { icon: Eye, title: t('about.visionTitle'), text: t('about.vision') },
            { icon: Target, title: t('about.missionTitle'), text: t('about.mission') },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-3xl border-2 border-marigold-200 bg-white p-8 shadow-sm"
            >
              <span className="grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-vermilion-600 to-marigold-500 text-white shadow-lg">
                <c.icon className="size-7" />
              </span>
              <h3 className="mt-5 font-display text-2xl font-normal text-ink-900">{c.title}</h3>
              <p className="mt-3 text-lg leading-relaxed text-ink-700">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MOTTO */}
      <section className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-vermilion-800 to-vermilion-900" />
        <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-25" aria-hidden />
        <div className="mx-auto max-w-4xl px-6 py-16 text-center md:py-20">
          <span className="mx-auto mb-5 grid size-16 place-items-center rounded-full bg-white/15 text-3xl ring-2 ring-marigold-300/40">
            ॐ
          </span>
          <p className="font-bold uppercase tracking-[0.2em] text-marigold-300">{t('about.mottoTitle')}</p>
          <p className="mt-3 font-display text-4xl font-normal text-marigold-200 md:text-5xl">
            {t('brand.sanskrit')}
          </p>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
            {t('about.mottoText')}
          </p>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl font-normal text-ink-900 md:text-5xl">
            {t('about.focusTitle')}
          </h2>
          <div className="mx-auto mt-4 flex items-center justify-center gap-2">
            <span className="h-1 w-12 rounded-full bg-vermilion-500" />
            <span className="size-2.5 rotate-45 bg-marigold-400" />
            <span className="h-1 w-12 rounded-full bg-vermilion-500" />
          </div>
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
                  className="group rounded-3xl border-2 border-marigold-100 bg-marigold-50 p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:border-vermilion-300 hover:shadow-xl"
                >
                  <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-vermilion-600 to-marigold-500 text-white shadow-lg transition-transform group-hover:scale-110">
                    <Icon className="size-8" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-normal text-ink-900">
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

      {/* FOUNDER + VEDAS */}
      <section className="bg-mandana py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <div className="rounded-3xl border-2 border-marigold-200 bg-white p-8 text-center shadow-sm md:p-10">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-gradient-to-br from-vermilion-600 to-marigold-500 text-white shadow-lg">
              <Crown className="size-8" />
            </span>
            <p className="mt-4 font-bold uppercase tracking-widest text-vermilion-600">
              {t('about.founderTitle')}
            </p>
            <h3 className="mt-1 font-display text-3xl font-normal text-ink-900">
              {t('about.founderName')}
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-ink-700">{t('about.founderText')}</p>
          </div>

          <div className="mt-8 text-center">
            <p className="font-display text-2xl font-normal text-ink-900">{t('about.vedasTitle', { defaultValue: t('home.vedasTitle') })}</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
              {vedas.map((v) => (
                <span
                  key={v.en}
                  className="rounded-full bg-vermilion-600 px-5 py-2 text-sm font-bold text-white shadow"
                >
                  {pick(v)}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/objectives"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-8 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              {t('home.heroCtaPrimary')} <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
