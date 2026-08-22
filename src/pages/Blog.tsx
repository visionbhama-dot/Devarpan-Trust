import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarDays, Newspaper } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { useLang } from '../lib/useLang'
import { getBlogs, type Blog as BlogType } from '../lib/api'
import { useAsync } from '../lib/useAsync'

function formatDate(iso: string | null, lang: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function Blog() {
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  const { data, loading } = useAsync<BlogType[]>(() => getBlogs(true), [])
  const posts = data ?? []

  return (
    <>
      <PageHeader
        kicker={t('blog.kicker')}
        title={t('blog.title')}
        intro={t('blog.intro')}
        image="/gallery/g05-vidyarthi-abhinandan.jpg"
      />

      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        {loading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-80 animate-pulse rounded-3xl bg-marigold-100/60" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center text-ink-700">
            <Newspaper className="size-12 text-vermilion-400" />
            <p className="text-lg font-medium">{t('blog.empty')}</p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <motion.article
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.06, 0.3) }}
                className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-marigold-200 transition-all hover:-translate-y-1.5 hover:shadow-2xl"
              >
                <Link to={`/blog/${p.slug}`} className="block overflow-hidden">
                  {p.cover_url ? (
                    <img
                      src={p.cover_url}
                      alt={pick(p.title)}
                      loading="lazy"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="grid aspect-[16/10] w-full place-items-center bg-gradient-to-br from-vermilion-600 to-marigold-500">
                      <Newspaper className="size-14 text-white/80" />
                    </div>
                  )}
                </Link>
                <div className="flex flex-1 flex-col p-6">
                  <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold text-vermilion-600">
                    <CalendarDays className="size-3.5" /> {formatDate(p.published_at, lang)}
                  </p>
                  <h3 className="font-display text-xl font-normal leading-snug text-ink-900">
                    <Link to={`/blog/${p.slug}`} className="hover:text-vermilion-700">
                      {pick(p.title)}
                    </Link>
                  </h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-700">
                    {pick(p.excerpt)}
                  </p>
                  <Link
                    to={`/blog/${p.slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 font-bold text-vermilion-600 hover:gap-2.5"
                  >
                    {t('blog.readMore')} <ArrowRight className="size-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}
