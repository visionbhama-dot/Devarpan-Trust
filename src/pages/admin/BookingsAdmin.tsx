import { useMemo, useState } from 'react'
import {
  Plus,
  Trash2,
  CalendarX,
  Phone,
  MapPin,
  Mail,
  Check,
  X,
  CalendarDays,
  Clock,
} from 'lucide-react'
import {
  getBookingDates,
  getBookingRequests,
  createBookingDate,
  deleteBookingDate,
  updateBookingRequest,
  deleteBookingRequest,
  type BookingDate,
  type BookingRequest,
  type BookingRequestStatus,
} from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import { AdminButton, Field, Input, Notice, PageTitle } from '../../components/admin/ui'

function pretty(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso + 'T00:00:00').toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default function BookingsAdmin() {
  const dates = useAsync<BookingDate[]>(() => getBookingDates(), [])
  const requests = useAsync<BookingRequest[]>(() => getBookingRequests(), [])
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  // New blocked-date form
  const [newDate, setNewDate] = useState('')
  const [titleHi, setTitleHi] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [saving, setSaving] = useState(false)

  const sortedDates = useMemo(
    () => [...(dates.data ?? [])].sort((a, b) => a.date.localeCompare(b.date)),
    [dates.data],
  )

  const addDate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newDate) return
    setSaving(true)
    try {
      await createBookingDate({ date: newDate, status: 'booked', title: { hi: titleHi, en: titleEn } })
      setNewDate('')
      setTitleHi('')
      setTitleEn('')
      setMsg({ kind: 'success', text: 'Date marked as booked (now red on the website).' })
      dates.refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Could not save date' })
    } finally {
      setSaving(false)
    }
  }

  const removeDate = async (d: BookingDate) => {
    if (!confirm(`Free up ${pretty(d.date)}? It will turn green (available) again.`)) return
    try {
      await deleteBookingDate(d.id)
      setMsg({ kind: 'success', text: 'Date freed up.' })
      dates.refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  const setStatus = async (r: BookingRequest, status: BookingRequestStatus) => {
    try {
      await updateBookingRequest(r.id, status)
      // Confirming a request also blocks that date on the public calendar.
      if (status === 'confirmed' && r.date) {
        try {
          await createBookingDate({
            date: r.date,
            status: 'booked',
            title: { hi: r.occasion, en: r.occasion },
          })
          dates.refetch()
        } catch {
          // Status is saved; blocking the date failed (e.g. already blocked).
          // Not fatal — the admin can block it manually above.
        }
      }
      setMsg({ kind: 'success', text: `Request ${status}.` })
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Update failed' })
    } finally {
      // Always reflect whatever actually persisted.
      requests.refetch()
    }
  }

  const removeRequest = async (r: BookingRequest) => {
    if (!confirm(`Delete booking request from ${r.name}?`)) return
    try {
      await deleteBookingRequest(r.id)
      setMsg({ kind: 'success', text: 'Request deleted.' })
      requests.refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  const statusBadge = (s: BookingRequestStatus) => {
    const map: Record<BookingRequestStatus, string> = {
      pending: 'bg-marigold-100 text-vermilion-700',
      confirmed: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${map[s]}`}>
        {s === 'pending' && <Clock className="size-3.5" />}
        {s === 'confirmed' && <Check className="size-3.5" />}
        {s === 'cancelled' && <X className="size-3.5" />}
        {s[0].toUpperCase() + s.slice(1)}
      </span>
    )
  }

  const pendingCount = (requests.data ?? []).filter((r) => r.status === 'pending').length

  return (
    <div>
      <PageTitle
        title="Bookings"
        subtitle="Mark dates as booked (they turn red on the website) and manage booking requests."
      />

      {msg && (
        <div className="mb-5">
          <Notice kind={msg.kind} onClose={() => setMsg(null)}>
            {msg.text}
          </Notice>
        </div>
      )}

      {/* ---------- Date availability ---------- */}
      <section className="mb-10 rounded-2xl border border-marigold-200 bg-white p-5 shadow-sm md:p-6">
        <h2 className="font-display text-xl font-normal text-ink-900">Blocked / booked dates</h2>
        <p className="mt-1 text-sm text-ink-700">
          Any future date you add here shows <strong className="text-red-600">red (not available)</strong>{' '}
          on the booking calendar. Everything else stays green.
        </p>

        <form onSubmit={addDate} className="mt-4 grid gap-4 sm:grid-cols-[auto_1fr_1fr_auto] sm:items-end">
          <Field label="Date">
            <Input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} required />
          </Field>
          <Field label="Booked for (Hindi)">
            <Input value={titleHi} placeholder="हवन / विवाह" onChange={(e) => setTitleHi(e.target.value)} />
          </Field>
          <Field label="Booked for (English)">
            <Input value={titleEn} placeholder="Hawan / Wedding" onChange={(e) => setTitleEn(e.target.value)} />
          </Field>
          <AdminButton type="submit" loading={saving}>
            <Plus className="size-4" /> Add
          </AdminButton>
        </form>

        <div className="mt-5">
          {dates.loading ? (
            <div className="h-16 animate-pulse rounded-xl bg-marigold-100/60" />
          ) : sortedDates.length === 0 ? (
            <p className="rounded-xl border border-dashed border-marigold-300 p-5 text-center text-sm text-ink-700">
              No blocked dates yet — every future date is shown as available.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {sortedDates.map((d) => (
                <span
                  key={d.id}
                  className="inline-flex items-center gap-2 rounded-full bg-red-50 py-1.5 pl-3 pr-1.5 text-sm font-semibold text-red-700 ring-1 ring-red-200"
                >
                  <CalendarX className="size-4" />
                  {pretty(d.date)}
                  {d.title.hi && <span className="text-red-500">· {d.title.hi}</span>}
                  <button
                    onClick={() => removeDate(d)}
                    aria-label="Free up date"
                    className="grid size-6 place-items-center rounded-full text-red-600 hover:bg-red-100"
                  >
                    <X className="size-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------- Booking requests ---------- */}
      <section>
        <h2 className="mb-4 flex items-center gap-2 font-display text-xl font-normal text-ink-900">
          Booking requests
          {pendingCount > 0 && (
            <span className="rounded-full bg-vermilion-600 px-2.5 py-0.5 text-xs font-bold text-white">
              {pendingCount} new
            </span>
          )}
        </h2>

        {requests.loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-marigold-100/60" />
            ))}
          </div>
        ) : (requests.data ?? []).length === 0 ? (
          <p className="rounded-2xl border border-dashed border-marigold-300 bg-white p-8 text-center text-ink-700">
            No booking requests yet.
          </p>
        ) : (
          <div className="space-y-3">
            {(requests.data ?? []).map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-marigold-200 bg-white p-4 shadow-sm md:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-ink-900">{r.name}</p>
                      {statusBadge(r.status)}
                    </div>
                    <p className="mt-0.5 text-sm font-semibold text-vermilion-700">{r.occasion}</p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-marigold-50 px-3 py-1 text-sm font-bold text-ink-800 ring-1 ring-marigold-200">
                    <CalendarDays className="size-4" /> {pretty(r.date)}
                  </span>
                </div>

                <div className="mt-3 grid gap-1.5 text-sm text-ink-700 sm:grid-cols-2">
                  <a href={`tel:${r.phone}`} className="inline-flex items-center gap-2 hover:text-vermilion-600">
                    <Phone className="size-4 shrink-0 text-vermilion-500" /> {r.phone || '—'}
                  </a>
                  <a href={`mailto:${r.email}`} className="inline-flex items-center gap-2 hover:text-vermilion-600">
                    <Mail className="size-4 shrink-0 text-vermilion-500" /> {r.email || '—'}
                  </a>
                  <span className="inline-flex items-start gap-2 sm:col-span-2">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-vermilion-500" /> {r.address || '—'}
                  </span>
                  {r.message && <p className="italic text-ink-600 sm:col-span-2">“{r.message}”</p>}
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {r.status !== 'confirmed' && (
                    <AdminButton onClick={() => setStatus(r, 'confirmed')}>
                      <Check className="size-4" /> Confirm &amp; block date
                    </AdminButton>
                  )}
                  {r.status !== 'cancelled' && (
                    <AdminButton variant="ghost" onClick={() => setStatus(r, 'cancelled')}>
                      <X className="size-4" /> Cancel
                    </AdminButton>
                  )}
                  <AdminButton variant="danger" onClick={() => removeRequest(r)}>
                    <Trash2 className="size-4" />
                  </AdminButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
