import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { BookingDate } from '../lib/api'

const toKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export default function BookingCalendar({
  blocked,
  selected,
  onSelect,
  lang,
}: {
  blocked: Map<string, BookingDate>
  selected: string | null
  onSelect: (dateKey: string) => void
  lang: 'hi' | 'en'
}) {
  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])
  const [view, setView] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1))

  const locale = lang === 'hi' ? 'hi-IN' : 'en-IN'
  const monthLabel = view.toLocaleDateString(locale, { month: 'long', year: 'numeric' })

  const weekdays = useMemo(() => {
    // A known Sunday, to generate localized short weekday names
    const base = new Date(2024, 0, 7)
    return Array.from({ length: 7 }, (_, i) =>
      new Date(base.getFullYear(), base.getMonth(), base.getDate() + i).toLocaleDateString(locale, {
        weekday: 'short',
      }),
    )
  }, [locale])

  const startOffset = new Date(view.getFullYear(), view.getMonth(), 1).getDay()
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  const atFirstAllowedMonth =
    view.getFullYear() === today.getFullYear() && view.getMonth() === today.getMonth()

  const prev = () => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))
  const next = () => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))

  const cells: (Date | null)[] = [
    ...Array.from({ length: startOffset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ]

  return (
    <div className="rounded-3xl border border-marigold-200 bg-white p-4 shadow-sm md:p-6">
      {/* Month header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          disabled={atFirstAllowedMonth}
          aria-label="Previous month"
          className="grid size-10 place-items-center rounded-full text-ink-700 ring-1 ring-marigold-200 transition-colors hover:bg-marigold-50 disabled:opacity-30"
        >
          <ChevronLeft className="size-5" />
        </button>
        <p className="font-display text-xl font-normal text-ink-900 md:text-2xl">{monthLabel}</p>
        <button
          type="button"
          onClick={next}
          aria-label="Next month"
          className="grid size-10 place-items-center rounded-full text-ink-700 ring-1 ring-marigold-200 transition-colors hover:bg-marigold-50"
        >
          <ChevronRight className="size-5" />
        </button>
      </div>

      {/* Weekday row */}
      <div className="mb-1 grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-ink-600">
        {weekdays.map((w, i) => (
          <div key={i} className="py-1">
            {w}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((d, i) => {
          if (!d) return <div key={`b-${i}`} />
          const key = toKey(d)
          const isPast = d < today
          const block = blocked.get(key)
          const isBlocked = Boolean(block)
          const isSelected = selected === key
          const label = block ? (lang === 'hi' ? block.title.hi : block.title.en) || '' : ''

          const base =
            'relative flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-bold transition-colors'

          if (isPast) {
            return (
              <div key={key} className={`${base} cursor-not-allowed bg-stone text-ink-600/40`}>
                {d.getDate()}
              </div>
            )
          }
          if (isBlocked) {
            return (
              <div
                key={key}
                title={label ? `${label} — booked` : 'Not available'}
                className={`${base} cursor-not-allowed bg-red-100 text-red-700 ring-1 ring-red-200`}
              >
                {d.getDate()}
                {label && (
                  <span className="mt-0.5 line-clamp-1 w-full px-0.5 text-center text-[8px] font-semibold leading-tight">
                    {label}
                  </span>
                )}
              </div>
            )
          }
          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelect(key)}
              className={`${base} ${
                isSelected
                  ? 'bg-vermilion-600 text-white ring-2 ring-vermilion-700'
                  : 'bg-green-50 text-green-800 ring-1 ring-green-200 hover:bg-green-100'
              }`}
            >
              {d.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
