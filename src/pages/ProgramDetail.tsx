import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Clock,
  X,
  Images as ImagesIcon,
  Video,
  ExternalLink,
} from 'lucide-react'
import { useLang } from '../lib/useLang'
import { getProgramById, type Program } from '../lib/api'
import { resolveVideo } from '../lib/video'
import { useAsync } from '../lib/useAsync'

function formatDate(iso: string | null, lang: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProgramDetail() {
  const { id = '' } = useParams()
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  const { data: program, loading } = useAsync<Program | null>(() => getProgramById(id), [id])
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-24">
        <div className="h-8 w-2/3 animate-pulse rounded bg-marigold-100" />
        <div className="mt-6 h-64 animate-pulse rounded-3xl bg-marigold-100/60" />
      </div>
    )
  }

  if (!program) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <p className="text-lg font-medium text-ink-700">{t('programs.notFound')}</p>
        <Link
          to="/programs"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-vermilion-600 px-6 py-3 font-bold text-white"
        >
          <ArrowLeft className="size-4" /> {t('programs.back')}
        </Link>
      </div>
    )
  }

  const upcoming = program.status === 'upcoming'
  const start = formatDate(program.event_date, lang)
  const end = formatDate(program.end_date, lang)
  const date = start && end && end !== start ? `${start} – ${end}` : start
  const timing = pick(program.time_text)
  const venue = pick(program.location)
  const photos = program.images
  const paragraphs = pick(program.description)
    .split(/\n{2,}|\n/)
    .filter(Boolean)

  return (
    <article className="pb-16">
      {/* Hero */}
      <div className="relative isolate overflow-hidden border-b-4 border-marigold-400 text-white">
        {program.image_url ? (
          <img src={program.image_url} alt="" className="absolute inset-0 -z-30 size-full object-cover" />
        ) : null}
        <div className="absolute inset-0 -z-20 bg-gradient-to-br from-vermilion-900/92 via-ink-900/85 to-vermilion-900/92" />
        <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-30" aria-hidden />
        <div className="mx-auto max-w-4xl px-6 py-16 md:py-20">
          <Link
            to="/programs"
            className="mb-5 inline-flex items-center gap-1.5 text-sm font-semibold text-marigold-200 hover:text-white"
          >
            <ArrowLeft className="size-4" /> {t('programs.back')}
          </Link>
          <span
            className={`mb-4 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold shadow ${
              upcoming ? 'bg-green-600 text-white' : 'bg-white/20 text-white backdrop-blur'
            }`}
          >
            {upcoming ? t('programs.upcoming') : t('programs.completed')}
          </span>
          <h1 className="font-display text-4xl font-normal leading-tight drop-shadow-lg md:text-5xl">
            {pick(program.title)}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-semibold text-marigold-100">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" /> {date || t('programs.dateTba')}
            </span>
            {timing && (
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-4" /> {timing}
              </span>
            )}
            {venue && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="size-4" /> {venue}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        {paragraphs.length > 0 && (
          <div className="space-y-5 text-lg leading-relaxed text-ink-800">
            {paragraphs.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 inline-flex items-center gap-2 font-display text-2xl font-normal text-ink-900">
              <ImagesIcon className="size-6 text-vermilion-600" /> {t('programs.photosTitle')}
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {photos.map((url, i) => (
                <button
                  key={`${url}-${i}`}
                  onClick={() => setLightbox(url)}
                  className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
                >
                  <img
                    src={url}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {program.videos.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 inline-flex items-center gap-2 font-display text-2xl font-normal text-ink-900">
              <Video className="size-6 text-vermilion-600" /> {t('programs.videosTitle')}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {program.videos.map((v, i) => {
                const embed = resolveVideo(v)
                // Reels / shorts are portrait; everything else is 16:9
                const frame = embed.portrait
                  ? 'aspect-[9/16] mx-auto w-full max-w-[320px]'
                  : 'aspect-video w-full'

                if (
                  embed.type === 'youtube' ||
                  embed.type === 'vimeo' ||
                  embed.type === 'instagram' ||
                  embed.type === 'facebook'
                ) {
                  return (
                    <div
                      key={i}
                      className={`${frame} overflow-hidden rounded-2xl bg-black shadow-md ring-1 ring-marigold-200`}
                    >
                      <iframe
                        src={embed.src}
                        title={`video-${i}`}
                        className="size-full"
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  )
                }
                if (embed.type === 'file') {
                  return (
                    <video
                      key={i}
                      src={embed.src}
                      controls
                      className={`${frame} rounded-2xl bg-black shadow-md ring-1 ring-marigold-200`}
                    />
                  )
                }
                return (
                  <a
                    key={i}
                    href={embed.src}
                    target="_blank"
                    rel="noreferrer"
                    className="flex aspect-video w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-vermilion-600 to-marigold-500 font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                  >
                    <ExternalLink className="size-5" /> {t('programs.watchVideo')}
                  </a>
                )
              })}
            </div>
          </section>
        )}

        <div className="mt-12">
          <Link
            to="/programs"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105"
          >
            <ArrowLeft className="size-4" /> {t('programs.back')}
          </Link>
        </div>
      </div>

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
            <motion.img
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              src={lightbox}
              alt=""
              className="max-h-[85vh] w-auto max-w-full rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </article>
  )
}
