import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Flame,
  Activity,
  GraduationCap,
  HandHeart,
  ArrowRight,
  MapPin,
  Phone,
  Mail,
  Landmark,
  User,
  Crown,
  CalendarDays,
} from 'lucide-react'
import { WhatsAppIcon } from '../components/icons'
import { useLang } from '../lib/useLang'
import { vedas } from '../data/trust'
import { galleryItems } from '../data/gallery'
import { getGallery, getMembers, getPrograms, type GalleryItem, type Member, type Program } from '../lib/api'
import { useAsync } from '../lib/useAsync'
import { useSettings } from '../lib/SettingsContext'

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

// Build a 12-cell collage from the real gallery photos
const collage = [...galleryItems.map((g) => g.src!), galleryItems[0].src!]

export default function Home() {
  const { t } = useTranslation()
  const { pick, lang } = useLang()
  const settings = useSettings()
  const { data: galleryData } = useAsync<GalleryItem[]>(() => getGallery(), [])
  const { data: membersData } = useAsync<Member[]>(() => getMembers(), [])
  const { data: programsData } = useAsync<Program[]>(() => getPrograms('upcoming'), [])
  const previewItems = (galleryData ?? []).slice(0, 6)
  const previewMembers = (membersData ?? []).slice(0, 3)
  const upcomingPrograms = [...(programsData ?? [])]
    .sort((a, b) => {
      const da = a.event_date ? new Date(a.event_date).getTime() : Infinity
      const db = b.event_date ? new Date(b.event_date).getTime() : Infinity
      return da - db
    })
    .slice(0, 2)
  const formatProgramDate = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : t('programs.dateTba')
  const memberGradients = [
    'from-vermilion-500 to-vermilion-700',
    'from-marigold-400 to-marigold-600',
    'from-vermilion-600 to-marigold-500',
  ]
  const waRaw = settings.socials.whatsapp || settings.phones[0] || ''
  const waHref = `https://wa.me/${waRaw.startsWith('91') ? waRaw : `91${waRaw}`}?text=${encodeURIComponent(
    t('whatsapp.prefill'),
  )}`

  return (
    <>
      {/* ============ HERO — full photo collage with bold text ============ */}
      <section className="relative isolate flex min-h-[88vh] items-center overflow-hidden text-white">
        {/* collage background */}
        <div className="absolute inset-0 -z-20 overflow-hidden">
          <div className="grid h-full w-full grid-cols-3 grid-rows-4 lg:grid-cols-4 lg:grid-rows-3">
            {collage.map((src, i) => (
              <div key={i} className="overflow-hidden">
                <img
                  src={src}
                  alt=""
                  loading={i > 3 ? 'lazy' : 'eager'}
                  className="size-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {/* soft dark overlay for readability */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-vermilion-900/92 via-ink-900/88 to-vermilion-900/92" />
        <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-40" aria-hidden />

        <div className="relative mx-auto w-full max-w-5xl px-6 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-6 grid size-32 place-items-center overflow-hidden rounded-full bg-white p-2.5 shadow-2xl ring-4 ring-marigold-300/70 md:size-40"
          >
            <img src="/devarpan-logo.png" alt="देवार्पण ट्रस्ट" className="size-full object-contain" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="font-display text-2xl font-normal tracking-wide text-marigold-200 drop-shadow-lg md:text-3xl"
          >
            {t('brand.sanskrit')}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-3 font-display text-5xl font-normal leading-none drop-shadow-2xl sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {t('home.heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-relaxed text-white drop-shadow-lg md:text-2xl"
          >
            {t('brand.tagline')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-9 flex flex-wrap justify-center gap-4"
          >
            <Link
              to="/objectives"
              className="inline-flex items-center gap-2 rounded-full bg-marigold-400 px-8 py-4 text-base font-bold text-ink-900 shadow-2xl transition-transform hover:scale-105 hover:bg-marigold-300"
            >
              {t('home.heroCtaPrimary')} <ArrowRight className="size-5" />
            </Link>
            <a
              href={waHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-8 py-4 text-base font-bold text-white shadow-2xl ring-2 ring-white/40 transition-transform hover:scale-105"
            >
              <WhatsAppIcon className="size-5" /> {t('whatsapp.label')}
            </a>
          </motion.div>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-vermilion-600 via-marigold-400 to-vermilion-600" />
      </section>

      {/* ============ ABOUT — text left, image right ============ */}
      <section className="bg-mandana py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 lg:grid-cols-2">
          {/* text */}
          <div>
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-vermilion-600">
              {t('home.aboutKicker')}
            </p>
            <h2 className="font-display text-4xl font-normal text-ink-900 md:text-5xl">
              {t('home.aboutTitle')}
            </h2>
            <div className="mt-4 flex items-center gap-2">
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
              <span className="size-2.5 rotate-45 bg-marigold-400" />
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
            </div>
            <p className="mt-5 text-lg font-semibold leading-relaxed text-ink-800 md:text-xl">
              {t('home.aboutText')}
            </p>
          </div>

          {/* image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="overflow-hidden rounded-3xl border-4 border-white shadow-2xl ring-1 ring-black/5">
              <img
                src="/gallery/g04-yajna.jpg"
                alt={t('home.aboutTitle')}
                className="aspect-[4/3] w-full object-cover"
              />
            </div>
            <span className="absolute -bottom-4 -left-4 -z-10 hidden size-28 rounded-3xl bg-marigold-400 lg:block" />
            <span className="absolute -right-4 -top-4 -z-10 hidden size-28 rounded-3xl bg-vermilion-500 lg:block" />
          </motion.div>
        </div>
      </section>

      {/* ============ FOCUS AREAS ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl font-normal text-ink-900 md:text-5xl">
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
                  className="group rounded-3xl border-2 border-saffron-100 bg-saffron-50 p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:border-saffron-300 hover:shadow-xl"
                >
                  <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-saffron-500 to-leaf-600 text-white shadow-lg transition-transform group-hover:scale-110">
                    <Icon className="size-8" />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-extrabold text-ink-900">
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

      {/* ============ STATS ============ */}
      <section className="relative overflow-hidden bg-taupe py-16">
        <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-7xl px-6">
          <h2 className="text-center font-display text-4xl font-normal text-ink-900 md:text-5xl">
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
                className="rounded-3xl border border-marigold-200 bg-white p-6 text-center shadow-sm"
              >
                <p className="font-display text-4xl font-normal text-vermilion-600 md:text-6xl">
                  {s.value}
                </p>
                <p className="mt-2 text-sm font-semibold text-ink-700">{t(`home.stats.${s.key}`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ MEMBERS PREVIEW ============ */}
      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-vermilion-600">
              {t('home.membersKicker')}
            </p>
            <h2 className="font-display text-4xl font-normal text-ink-900 md:text-5xl">
              {t('home.membersTitle')}
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
              <span className="size-2.5 rotate-45 bg-marigold-400" />
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-ink-700">{t('home.membersText')}</p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {previewMembers.map((m, i) => {
              const isPresident = i === 0
              return (
                <motion.article
                  key={m.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`group relative overflow-hidden rounded-3xl bg-white shadow-md ring-1 transition-all hover:-translate-y-1.5 hover:shadow-2xl ${
                    isPresident ? 'ring-2 ring-vermilion-400' : 'ring-marigold-200'
                  }`}
                >
                  {isPresident && (
                    <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-vermilion-600 px-3 py-1 text-xs font-bold text-white shadow">
                      <Crown className="size-3.5" /> {t('contact.presidentTitle')}
                    </span>
                  )}
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
                          memberGradients[i % memberGradients.length]
                        }`}
                      >
                        <div className="grid size-24 place-items-center rounded-full bg-white/25 ring-4 ring-white/40 backdrop-blur">
                          <User className="size-12 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-sans text-xl font-bold text-ink-900">{pick(m.name)}</h3>
                    <p className="mt-1.5 inline-block rounded-full bg-marigold-100 px-3 py-1 text-sm font-bold text-vermilion-700">
                      {pick(m.role)}
                    </p>
                  </div>
                </motion.article>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/members"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-8 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              {t('home.membersViewAll')} <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ UPCOMING PROGRAMS PREVIEW ============ */}
      <section className="bg-stone py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-vermilion-600">
              {t('home.programsKicker')}
            </p>
            <h2 className="font-display text-4xl font-normal text-ink-900 md:text-5xl">
              {t('home.programsTitle')}
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
              <span className="size-2.5 rotate-45 bg-marigold-400" />
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-ink-700">{t('home.programsText')}</p>
          </div>

          {upcomingPrograms.length === 0 ? (
            <p className="mx-auto max-w-xl rounded-3xl border border-dashed border-marigold-300 bg-white p-8 text-center text-ink-700">
              {t('home.programsEmpty')}
            </p>
          ) : (
            <div className="grid gap-8 md:grid-cols-2">
              {upcomingPrograms.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-md ring-1 ring-marigold-200 transition-all hover:-translate-y-1.5 hover:shadow-2xl sm:flex-row"
                >
                  <Link to={`/programs/${p.id}`} className="relative shrink-0 overflow-hidden sm:w-48">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={pick(p.title)}
                        loading="lazy"
                        className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110 sm:h-full"
                      />
                    ) : (
                      <div className="grid h-44 w-full place-items-center bg-gradient-to-br from-vermilion-600 to-marigold-500 sm:h-full">
                        <CalendarDays className="size-12 text-white/80" />
                      </div>
                    )}
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-green-600 px-3 py-1 text-xs font-bold text-white shadow">
                      {t('programs.upcoming')}
                    </span>
                  </Link>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="inline-flex items-center gap-1.5 text-xs font-semibold text-vermilion-600">
                      <CalendarDays className="size-3.5" /> {formatProgramDate(p.event_date)}
                    </p>
                    <h3 className="mt-1.5 font-display text-xl font-normal leading-snug text-ink-900">
                      <Link to={`/programs/${p.id}`} className="hover:text-vermilion-700">
                        {pick(p.title)}
                      </Link>
                    </h3>
                    {pick(p.location) && (
                      <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-ink-700">
                        <MapPin className="size-3.5 text-vermilion-500" /> {pick(p.location)}
                      </p>
                    )}
                    <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-ink-700">
                      {pick(p.description)}
                    </p>
                  </div>
                </motion.article>
              ))}
            </div>
          )}

          <div className="mt-10 text-center">
            <Link
              to="/programs"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-8 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
            >
              {t('home.programsViewAll')} <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ GALLERY PREVIEW ============ */}
      <section className="bg-mandana py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 text-center">
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-vermilion-600">
              {t('home.galleryKicker')}
            </p>
            <h2 className="font-display text-4xl font-normal text-ink-900 md:text-5xl">
              {t('home.galleryTitle')}
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-ink-700">{t('home.galleryText')}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {previewItems.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group relative aspect-[4/3] overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5"
              >
                <img
                  src={item.image_url}
                  alt={pick(item.caption)}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <p className="absolute inset-x-0 bottom-0 p-3 text-sm font-bold text-white drop-shadow md:p-4 md:text-base">
                  {pick(item.caption)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/gallery"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-leaf-600 px-8 py-3.5 font-black text-white shadow-lg transition-transform hover:scale-105"
            >
              {t('home.viewMore')} <ArrowRight className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============ TRUST DETAILS — light ============ */}
      <section className="relative isolate overflow-hidden bg-stone py-16 md:py-24">
        <div className="absolute inset-0 -z-10 bg-mandana-overlay opacity-60" aria-hidden />

        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="mb-2 font-bold uppercase tracking-[0.2em] text-vermilion-600">
              {t('home.detailsKicker')}
            </p>
            <h2 className="font-display text-4xl font-normal text-ink-900 md:text-5xl">
              {t('home.detailsTitle')}
            </h2>
            <div className="mx-auto mt-4 flex items-center justify-center gap-2">
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
              <span className="size-2.5 rotate-45 bg-marigold-400" />
              <span className="h-1 w-12 rounded-full bg-vermilion-500" />
            </div>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-ink-700">{t('home.detailsText')}</p>
          </div>

          {/* detail cards */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <DetailCard icon={MapPin} title={t('contact.officeTitle')}>
              {pick(settings.address)}
            </DetailCard>
            <DetailCard icon={Phone} title={t('contact.phoneTitle')}>
              <div className="flex flex-col gap-0.5">
                {settings.phones.map((p) => (
                  <a key={p} href={`tel:+91${p}`} className="hover:text-vermilion-600">
                    +91 {p}
                  </a>
                ))}
              </div>
            </DetailCard>
            <DetailCard icon={Mail} title={t('contact.emailTitle')}>
              <a href={`mailto:${settings.email}`} className="break-all hover:text-vermilion-600">
                {settings.email}
              </a>
            </DetailCard>
            <DetailCard icon={User} title={t('contact.presidentTitle')}>
              {t('contact.presidentName')}
            </DetailCard>
          </div>

          {/* bank / donate strip */}
          <div className="mt-6 grid gap-6 rounded-3xl border border-marigold-200 bg-white p-6 shadow-sm md:p-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <div className="mb-4 flex items-center gap-3">
                <span className="grid size-11 place-items-center rounded-2xl bg-gradient-to-br from-vermilion-600 to-marigold-500 text-white">
                  <Landmark className="size-6" />
                </span>
                <h3 className="font-display text-xl font-normal text-ink-900">{t('contact.bankTitle')}</h3>
              </div>
              <dl className="grid gap-3 sm:grid-cols-3">
                <BankItem label={t('contact.pan')} value={settings.bank.pan} />
                <BankItem label={t('contact.account')} value={settings.bank.account} />
                <BankItem label={t('contact.ifsc')} value={settings.bank.ifsc} />
              </dl>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-vermilion-600 px-7 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-vermilion-700"
              >
                <HandHeart className="size-5" /> {t('home.ctaButton')}
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-105"
              >
                <WhatsAppIcon className="size-5" /> {t('whatsapp.label')}
              </a>
            </div>
          </div>

          {/* vedas strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
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
      </section>
    </>
  )
}

function DetailCard({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof MapPin
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-3xl border border-marigold-200 bg-white p-5 shadow-sm">
      <span className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-vermilion-600 to-marigold-500 text-white shadow">
        <Icon className="size-6" />
      </span>
      <h3 className="mt-4 font-display text-lg font-normal text-vermilion-700">{title}</h3>
      <div className="mt-1 text-sm font-medium leading-relaxed text-ink-800">{children}</div>
    </div>
  )
}

function BankItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-marigold-50 p-3 ring-1 ring-marigold-100">
      <dt className="text-xs font-semibold text-ink-700">{label}</dt>
      <dd className="mt-0.5 break-all font-mono text-sm font-bold text-ink-900">{value}</dd>
    </div>
  )
}
