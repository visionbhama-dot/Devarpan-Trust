import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ArrowLeft, CalendarDays } from 'lucide-react'
import { useLang } from '../lib/useLang'
import { getBlogBySlug, type Blog } from '../lib/api'
import { useAsync } from '../lib/useAsync'

function formatDate(iso: string | null, lang: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPost() {
  const { slug = '' } = useParams()
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  const { data: post, loading } = useAsync<Blog | null>(() => getBlogBySlug(slug), [slug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24">
        <div className="h-8 w-2/3 animate-pulse rounded bg-marigold-100" />
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-marigold-100/60" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-lg font-medium text-ink-700">{t('blog.notFound')}</p>
        <Link
          to="/blog"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-vermilion-600 px-6 py-3 font-bold text-white"
        >
          <ArrowLeft className="size-4" /> {t('blog.back')}
        </Link>
      </div>
    )
  }

  const paragraphs = pick(post.content).split(/\n{2,}|\n/).filter(Boolean)

  return (
    <article className="pb-16">
      {/* Hero */}
      <div className="relative isolate overflow-hidden border-b-4 border-marigold-400 text-white">
        {post.cover_url ? (
          <img src={post.cover_url} alt="" className="absolute inset-0 -z-30 size-full object-cover" />
        ) : null}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-vermilion-900/92 via-ink-900/85 to-vermilion-900/92" />
        <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-30" aria-hidden />
        <div className="mx-auto max-w-3xl px-6 py-16 md:py-20">
          <Link
            to="/blog"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-marigold-200 hover:text-white"
          >
            <ArrowLeft className="size-4" /> {t('blog.back')}
          </Link>
          <p className="mb-3 inline-flex items-center gap-1.5 text-sm font-semibold text-marigold-200">
            <CalendarDays className="size-4" /> {formatDate(post.published_at, lang)}
          </p>
          <h1 className="font-display text-4xl font-normal leading-tight drop-shadow-lg md:text-5xl">
            {pick(post.title)}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-3xl px-6 py-12">
        {pick(post.excerpt) && (
          <p className="mb-8 border-l-4 border-vermilion-500 bg-marigold-50 py-3 pl-4 text-lg font-medium italic text-ink-800">
            {pick(post.excerpt)}
          </p>
        )}
        <div className="space-y-5 text-lg leading-relaxed text-ink-800">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className="mt-12">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <ArrowLeft className="size-4" /> {t('blog.back')}
          </Link>
        </div>
      </div>
    </article>
  )
}
