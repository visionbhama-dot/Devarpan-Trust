import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { User, Crown } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import { getMembers, type Member } from '../lib/api'
import { useAsync } from '../lib/useAsync'

// placeholder gradients (warm red/gold theme) for members without a photo
const gradients = [
  'from-vermilion-500 to-vermilion-700',
  'from-marigold-400 to-marigold-600',
  'from-vermilion-600 to-marigold-500',
  'from-marigold-500 to-vermilion-600',
  'from-vermilion-400 to-vermilion-600',
  'from-marigold-500 to-vermilion-700',
  'from-vermilion-500 to-marigold-500',
]

export default function Members() {
  const { t } = useTranslation()
  const { pick } = useLang()
  const { data, loading } = useAsync<Member[]>(() => getMembers(), [])
  const members = data ?? []

  return (
    <>
      <PageHeader
        kicker={t('members.kicker')}
        title={t('members.title')}
        intro={t('members.intro')}
        image="/gallery/g09-varishthjan-samman.jpg"
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-marigold-100/60" />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((m, i) => {
              const isPresident = i === 0
              return (
                <motion.article
                  key={m.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: Math.min(i * 0.06, 0.4) }}
                  className={`group relative overflow-hidden rounded-3xl bg-white shadow-md ring-1 transition-all hover:-translate-y-1.5 hover:shadow-2xl ${
                    isPresident ? 'ring-2 ring-vermilion-400' : 'ring-marigold-200'
                  }`}
                >
                  {isPresident && (
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-vermilion-600 px-3 py-1 text-xs font-bold text-white shadow">
                      <Crown className="size-3.5" /> {t('contact.presidentTitle')}
                    </span>
                  )}

                  {/* photo / placeholder */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    {m.photo_url ? (
                      <img
                        src={m.photo_url}
                        alt={pick(m.name)}
                        className="size-full object-cover object-top"
                      />
                    ) : (
                      <div
                        className={`grid size-full place-items-center bg-gradient-to-br ${
                          gradients[i % gradients.length]
                        }`}
                      >
                        <div className="grid size-24 place-items-center rounded-full bg-white/25 ring-4 ring-white/40 backdrop-blur">
                          <User className="size-12 text-white" />
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>

                  <div className="p-6 text-center">
                    <h3 className="font-display text-xl font-normal text-ink-900">{pick(m.name)}</h3>
                    <p className="mt-1.5 inline-block rounded-full bg-marigold-100 px-3 py-1 text-sm font-semibold text-vermilion-700">
                      {pick(m.role)}
                    </p>
                    {!m.photo_url && (
                      <p className="mt-3 text-xs italic text-ink-700/60">{t('members.photoNote')}</p>
                    )}
                  </div>
                </motion.article>
              )
            })}
          </div>
        )}
      </section>
    </>
  )
}
