import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import { objectives } from '../data/objectives'

export default function Objectives() {
  const { t } = useTranslation()
  const { pick } = useLang()

  return (
    <>
      <PageHeader
        kicker={t('objectives.kicker')}
        title={t('objectives.title')}
        intro={t('objectives.intro')}
        image="/gallery/g06-yajna-bal.jpg"
      />

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <ul className="space-y-5">
          {objectives.map((o, i) => (
            <motion.li
              key={o.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: Math.min(i * 0.04, 0.3) }}
              className="flex gap-4 rounded-2xl border border-saffron-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md md:gap-5 md:p-6"
            >
              <div className="flex shrink-0 flex-col items-center">
                <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-saffron-500 to-leaf-600 font-display text-lg font-bold text-white shadow-md">
                  {o.num}
                </span>
              </div>
              <p className="self-center text-base leading-relaxed text-ink-800 md:text-lg">
                {pick({ hi: o.hi, en: o.en })}
              </p>
            </motion.li>
          ))}
        </ul>

        <div className="mt-12 flex items-center justify-center gap-3 rounded-2xl bg-leaf-50 p-6 text-center text-leaf-800 ring-1 ring-leaf-100">
          <Target className="size-6 shrink-0 text-leaf-600" />
          <p className="font-medium">{t('brand.tagline')}</p>
        </div>
      </section>
    </>
  )
}
