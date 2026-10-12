import { useState } from 'react'
import { Plus, Pencil, Trash2, CalendarClock, CheckCircle2 } from 'lucide-react'
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  type Program,
} from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import { programStatuses, type ProgramStatus } from '../../data/programs'
import {
  AdminButton,
  Field,
  Input,
  Textarea,
  Select,
  Modal,
  Notice,
  PageTitle,
  ImageUpload,
} from '../../components/admin/ui'

type Draft = {
  id?: string
  title_hi: string
  title_en: string
  description_hi: string
  description_en: string
  location_hi: string
  location_en: string
  event_date: string
  image_url: string | null
  status: ProgramStatus
  sort: number
}

const emptyDraft = (sort: number): Draft => ({
  title_hi: '',
  title_en: '',
  description_hi: '',
  description_en: '',
  location_hi: '',
  location_en: '',
  event_date: '',
  image_url: null,
  status: 'upcoming',
  sort,
})

function formatDate(iso: string | null) {
  if (!iso) return 'Date TBA'
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ProgramsAdmin() {
  const { data, loading, refetch } = useAsync<Program[]>(() => getPrograms(), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () => setDraft(emptyDraft(items.length + 1))
  const openEdit = (p: Program) =>
    setDraft({
      id: p.id,
      title_hi: p.title.hi,
      title_en: p.title.en,
      description_hi: p.description.hi,
      description_en: p.description.en,
      location_hi: p.location.hi,
      location_en: p.location.en,
      event_date: p.event_date ?? '',
      image_url: p.image_url,
      status: p.status,
      sort: p.sort,
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    setSaving(true)
    try {
      const payload = {
        title: { hi: draft.title_hi, en: draft.title_en },
        description: { hi: draft.description_hi, en: draft.description_en },
        location: { hi: draft.location_hi, en: draft.location_en },
        event_date: draft.event_date || null,
        image_url: draft.image_url,
        status: draft.status,
        sort: Number(draft.sort) || 0,
      }
      if (draft.id) await updateProgram(draft.id, payload)
      else await createProgram(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  /** Quick toggle a program between upcoming and completed. */
  const toggleStatus = async (p: Program) => {
    const next: ProgramStatus = p.status === 'upcoming' ? 'completed' : 'upcoming'
    try {
      await updateProgram(p.id, { status: next })
      setMsg({ kind: 'success', text: `Marked as ${next}.` })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Update failed' })
    }
  }

  const remove = async (p: Program) => {
    if (!confirm(`Delete program "${p.title.hi}"?`)) return
    try {
      await deleteProgram(p.id)
      setMsg({ kind: 'success', text: 'Program deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Programs"
        subtitle="Add events, set their date & image, and mark them completed when done."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> New program
          </AdminButton>
        }
      />

      {msg && (
        <div className="mb-5">
          <Notice kind={msg.kind} onClose={() => setMsg(null)}>
            {msg.text}
          </Notice>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-marigold-100/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((p) => {
            const upcoming = p.status === 'upcoming'
            return (
              <div
                key={p.id}
                className="flex flex-wrap items-center gap-4 rounded-2xl border border-marigold-200 bg-white p-4 shadow-sm"
              >
                <div className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-marigold-100">
                  {p.image_url ? (
                    <img src={p.image_url} alt="" className="size-full object-cover" />
                  ) : (
                    <CalendarClock className="size-6 text-vermilion-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-bold text-ink-900">{p.title.hi}</p>
                  <p className="truncate text-sm text-ink-700">
                    {formatDate(p.event_date)}
                    {p.location.hi ? ` • ${p.location.hi}` : ''}
                  </p>
                </div>
                <span
                  className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${
                    upcoming ? 'bg-green-100 text-green-700' : 'bg-marigold-100 text-vermilion-700'
                  }`}
                >
                  {upcoming ? <CalendarClock className="size-3.5" /> : <CheckCircle2 className="size-3.5" />}
                  {upcoming ? 'Upcoming' : 'Completed'}
                </span>
                <AdminButton variant="ghost" onClick={() => toggleStatus(p)}>
                  <CheckCircle2 className="size-4" />
                  {upcoming ? 'Mark done' : 'Reopen'}
                </AdminButton>
                <AdminButton variant="ghost" onClick={() => openEdit(p)}>
                  <Pencil className="size-4" /> Edit
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(p)}>
                  <Trash2 className="size-4" />
                </AdminButton>
              </div>
            )
          })}
          {items.length === 0 && (
            <p className="rounded-2xl border border-dashed border-marigold-300 bg-white p-8 text-center text-ink-700">
              No programs yet. Click “New program” to add your first event.
            </p>
          )}
        </div>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? 'Edit program' : 'New program'}
      >
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              bucket="programs"
              label="Program image (optional)"
              value={draft.image_url}
              onChange={(url) => setDraft({ ...draft, image_url: url })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title (Hindi)">
                <Input
                  value={draft.title_hi}
                  onChange={(e) => setDraft({ ...draft, title_hi: e.target.value })}
                  required
                />
              </Field>
              <Field label="Title (English)">
                <Input
                  value={draft.title_en}
                  onChange={(e) => setDraft({ ...draft, title_en: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date">
                <Input
                  type="date"
                  value={draft.event_date}
                  onChange={(e) => setDraft({ ...draft, event_date: e.target.value })}
                />
              </Field>
              <Field label="Status">
                <Select
                  value={draft.status}
                  onChange={(e) => setDraft({ ...draft, status: e.target.value as ProgramStatus })}
                >
                  {programStatuses.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.hi} / {s.en}
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Location (Hindi)">
                <Input
                  value={draft.location_hi}
                  onChange={(e) => setDraft({ ...draft, location_hi: e.target.value })}
                />
              </Field>
              <Field label="Location (English)">
                <Input
                  value={draft.location_en}
                  onChange={(e) => setDraft({ ...draft, location_en: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Description (Hindi)">
              <Textarea
                rows={4}
                value={draft.description_hi}
                onChange={(e) => setDraft({ ...draft, description_hi: e.target.value })}
              />
            </Field>
            <Field label="Description (English)">
              <Textarea
                rows={4}
                value={draft.description_en}
                onChange={(e) => setDraft({ ...draft, description_en: e.target.value })}
              />
            </Field>
            <Field label="Sort order">
              <Input
                type="number"
                value={draft.sort}
                onChange={(e) => setDraft({ ...draft, sort: Number(e.target.value) })}
              />
            </Field>
            <div className="flex justify-end gap-3 pt-2">
              <AdminButton type="button" variant="ghost" onClick={() => setDraft(null)}>
                Cancel
              </AdminButton>
              <AdminButton type="submit" loading={saving}>
                Save
              </AdminButton>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
