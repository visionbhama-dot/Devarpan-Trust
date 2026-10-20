import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, Loader2, PartyPopper } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import BookingCalendar from '../components/BookingCalendar'
import { useLang } from '../lib/useLang'
import { getBookingDates, createBookingRequest, type BookingDate } from '../lib/api'
import { useAsync } from '../lib/useAsync'

export default function Booking() {
  const { t } = useTranslation()
  const { lang } = useLang()
  const { data } = useAsync<BookingDate[]>(() => getBookingDates(), [])

  const blocked = useMemo(() => {
    const m = new Map<string, BookingDate>()
    for (const d of data ?? []) m.set(d.date, d)
    return m
  }, [data])

  const [date, setDate] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const prettyDate = (key: string) =>
    new Date(key + 'T00:00:00').toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!date || blocked.has(date)) {
      setDate(null)
      setError(t('booking.errNoDate'))
      return
    }
    setSubmitting(true)
    try {
      await createBookingRequest({ name, occasion, address, phone, email, date, message })
      setDone(true)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e2) {
      setError(e2 instanceof Error ? e2.message : t('booking.errGeneric'))
    } finally {
      setSubmitting(false)
    }
  }

  const inputCls =
    'w-full rounded-xl border border-marigold-300 bg-white px-3.5 py-2.5 text-ink-900 outline-none transition-colors focus:border-vermilion-500 focus:ring-2 focus:ring-vermilion-200'

  return (
    <>
      <PageHeader
        kicker={t('booking.kicker')}
        title={t('booking.title')}
        intro={t('booking.intro')}
        image="/gallery/g04-yajna.jpg"
      />

      <section className="mx-auto max-w-5xl px-6 py-14 md:py-16">
        {done ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-xl rounded-3xl border border-green-200 bg-green-50 p-8 text-center shadow-sm"
          >
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-green-600 text-white">
              <PartyPopper className="size-8" />
            </div>
            <h2 className="mt-5 font-display text-3xl font-normal text-ink-900">
              {t('booking.successTitle')}
            </h2>
            <p className="mt-3 text-ink-700">{t('booking.successText')}</p>
            {date && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-vermilion-700 ring-1 ring-marigold-200">
                <CalendarDays className="size-4" /> {prettyDate(date)}
              </p>
            )}
            <div className="mt-6">
              <button
                onClick={() => {
                  setDone(false)
                  setDate(null)
                  setName('')
                  setOccasion('')
                  setAddress('')
                  setPhone('')
                  setEmail('')
                  setMessage('')
                }}
                className="rounded-full bg-vermilion-600 px-6 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 hover:bg-vermilion-700"
              >
                {t('booking.another')}
              </button>
            </div>
          </motion.div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            {/* Calendar */}
            <div>
              <h2 className="mb-3 font-display text-2xl font-normal text-ink-900">
                {t('booking.pickDate')}
              </h2>
              <BookingCalendar blocked={blocked} selected={date} onSelect={setDate} lang={lang} />
              {/* Legend */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-medium text-ink-700">
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded bg-green-100 ring-1 ring-green-300" />
                  {t('booking.legendAvailable')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded bg-red-100 ring-1 ring-red-300" />
                  {t('booking.legendBooked')}
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="size-4 rounded bg-stone ring-1 ring-marigold-200" />
                  {t('booking.legendPast')}
                </span>
              </div>
            </div>

            {/* Form */}
            <form
              onSubmit={submit}
              className="rounded-3xl border border-marigold-200 bg-white p-6 shadow-sm md:p-8"
            >
              <div
                className={`mb-5 flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold ${
                  date
                    ? 'bg-green-50 text-green-800 ring-1 ring-green-200'
                    : 'bg-marigold-50 text-vermilion-700 ring-1 ring-marigold-200'
                }`}
              >
                <CalendarDays className="size-4 shrink-0" />
                {date ? prettyDate(date) : t('booking.noDateYet')}
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink-800">
                    {t('booking.fName')} *
                  </span>
                  <input
                    className={inputCls}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink-800">
                    {t('booking.fOccasion')} *
                  </span>
                  <input
                    className={inputCls}
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    placeholder={t('booking.fOccasionHint')}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink-800">
                    {t('booking.fAddress')} *
                  </span>
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-ink-800">
                      {t('booking.fPhone')} *
                    </span>
                    <input
                      type="tel"
                      className={inputCls}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold text-ink-800">
                      {t('booking.fEmail')} *
                    </span>
                    <input
                      type="email"
                      className={inputCls}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold text-ink-800">
                    {t('booking.fMessage')}
                  </span>
                  <textarea
                    className={inputCls}
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </label>
              </div>

              {error && (
                <p className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm font-medium text-red-700 ring-1 ring-red-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-vermilion-600 to-marigold-500 px-6 py-3.5 font-bold text-white shadow-lg transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {submitting ? (
                  <Loader2 className="size-5 animate-spin" />
                ) : (
                  <CheckCircle2 className="size-5" />
                )}
                {t('booking.submit')}
              </button>
              <p className="mt-3 text-center text-xs text-ink-600">{t('booking.mailNote')}</p>
            </form>
          </div>
        )}
      </section>
    </>
  )
}
