import { useState } from 'react'
import {
  Plus,
  Pencil,
  Trash2,
  CalendarClock,
  CheckCircle2,
  Video,
  Link2,
  X,
  Images,
  Sparkles,
} from 'lucide-react'
import {
  getPrograms,
  createProgram,
  updateProgram,
  deleteProgram,
  type Program,
  type ProgramVideo,
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
  MultiImageUpload,
  FileUploadButton,
} from '../../components/admin/ui'

type Draft = {
  id?: string
  title_hi: string
  title_en: string
  description_hi: string
  description_en: string
  location_hi: string
  location_en: string
  time_text_hi: string
  time_text_en: string
  event_date: string
  end_date: string
  image_url: string | null
  images: string[]
  videos: ProgramVideo[]
  status: ProgramStatus
  featured: boolean
  sort: number
}

const emptyDraft = (sort: number): Draft => ({
  title_hi: '',
  title_en: '',
  description_hi: '',
  description_en: '',
  location_hi: '',
  location_en: '',
  time_text_hi: '',
  time_text_en: '',
  event_date: '',
  end_date: '',
  image_url: null,
  images: [],
  videos: [],
  status: 'upcoming',
  featured: false,
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
      time_text_hi: p.time_text?.hi ?? '',
      time_text_en: p.time_text?.en ?? '',
      event_date: p.event_date ?? '',
      end_date: p.end_date ?? '',
      image_url: p.image_url,
      images: p.images ?? [],
      videos: p.videos ?? [],
      status: p.status,
      featured: p.featured ?? false,
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
        time_text: { hi: draft.time_text_hi, en: draft.time_text_en },
        event_date: draft.event_date || null,
        end_date: draft.end_date || null,
        image_url: draft.image_url,
        images: draft.images,
        videos: draft.videos.filter((v) => v.url.trim()),
        status: draft.status,
        featured: draft.featured,
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
        subtitle="Add events with date, venue, photos & videos. Mark them completed when done."
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
                  <p className="flex items-center gap-2 truncate font-bold text-ink-900">
                    <span className="truncate">{p.title.hi}</span>
                    {p.featured && (
                      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-vermilion-600 px-2 py-0.5 text-[10px] font-bold text-white">
                        <Sparkles className="size-3" /> Home banner
                      </span>
                    )}
                  </p>
                  <p className="truncate text-sm text-ink-700">
                    {formatDate(p.event_date)}
                    {p.location.hi ? ` • ${p.location.hi}` : ''}
                  </p>
                  {(p.images.length > 0 || p.videos.length > 0) && (
                    <p className="mt-0.5 flex items-center gap-3 text-xs text-ink-600">
                      {p.images.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Images className="size-3.5" /> {p.images.length}
                        </span>
                      )}
                      {p.videos.length > 0 && (
                        <span className="inline-flex items-center gap-1">
                          <Video className="size-3.5" /> {p.videos.length}
                        </span>
                      )}
                    </p>
                  )}
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
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Start date">
                <Input
                  type="date"
                  value={draft.event_date}
                  onChange={(e) => setDraft({ ...draft, event_date: e.target.value })}
                />
              </Field>
              <Field label="End date (optional)">
                <Input
                  type="date"
                  value={draft.end_date}
                  onChange={(e) => setDraft({ ...draft, end_date: e.target.value })}
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
              <Field label="Timing (Hindi)">
                <Input
                  value={draft.time_text_hi}
                  placeholder="सांयं 4:00 से 5:15 तक"
                  onChange={(e) => setDraft({ ...draft, time_text_hi: e.target.value })}
                />
              </Field>
              <Field label="Timing (English)">
                <Input
                  value={draft.time_text_en}
                  placeholder="Evening 4:00 PM to 5:15 PM"
                  onChange={(e) => setDraft({ ...draft, time_text_en: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Venue (Hindi)">
                <Input
                  value={draft.location_hi}
                  onChange={(e) => setDraft({ ...draft, location_hi: e.target.value })}
                  placeholder="जीवन पार्क, उत्तम नगर"
                />
              </Field>
              <Field label="Venue (English)">
                <Input
                  value={draft.location_en}
                  onChange={(e) => setDraft({ ...draft, location_en: e.target.value })}
                  placeholder="Jeevan Park, Uttam Nagar"
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

            {/* Event photo gallery */}
            <div className="rounded-2xl border border-marigold-200 bg-marigold-50/40 p-4">
              <MultiImageUpload
                bucket="programs"
                label="Event photos (gallery)"
                value={draft.images}
                onChange={(images) => setDraft({ ...draft, images })}
              />
            </div>

            {/* Event videos */}
            <div className="rounded-2xl border border-marigold-200 bg-marigold-50/40 p-4">
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">Videos & Reels</span>
              <p className="mb-3 text-xs text-ink-600">
                Paste a link (YouTube, YouTube Shorts, Instagram Reel, Facebook Reel/video) or upload a
                video file. Reels show in a tall phone-style frame. Add as many as you like.
              </p>
              <div className="space-y-3">
                {draft.videos.map((v, i) => (
                  <div
                    key={i}
                    className="flex flex-wrap items-center gap-2 rounded-xl bg-white p-2.5 ring-1 ring-marigold-200"
                  >
                    <Select
                      value={v.kind}
                      className="w-28"
                      onChange={(e) => {
                        const videos = [...draft.videos]
                        videos[i] = { kind: e.target.value as ProgramVideo['kind'], url: '' }
                        setDraft({ ...draft, videos })
                      }}
                    >
                      <option value="link">Link</option>
                      <option value="file">Upload</option>
                    </Select>
                    {v.kind === 'link' ? (
                      <Input
                        value={v.url}
                        placeholder="YouTube / Instagram Reel / Facebook link…"
                        className="min-w-0 flex-1"
                        onChange={(e) => {
                          const videos = [...draft.videos]
                          videos[i] = { ...videos[i], url: e.target.value }
                          setDraft({ ...draft, videos })
                        }}
                      />
                    ) : v.url ? (
                      <span className="flex min-w-0 flex-1 items-center gap-2 text-sm text-ink-700">
                        <Video className="size-4 shrink-0 text-vermilion-500" />
                        <span className="truncate">{v.url.split('/').pop()}</span>
                      </span>
                    ) : (
                      <FileUploadButton
                        bucket="programs"
                        accept="video/*"
                        label="Upload video"
                        onUploaded={(url) => {
                          const videos = [...draft.videos]
                          videos[i] = { ...videos[i], url }
                          setDraft({ ...draft, videos })
                        }}
                      />
                    )}
                    <button
                      type="button"
                      aria-label="Remove video"
                      onClick={() =>
                        setDraft({ ...draft, videos: draft.videos.filter((_, idx) => idx !== i) })
                      }
                      className="grid size-9 place-items-center rounded-lg text-red-600 ring-1 ring-red-200 hover:bg-red-50"
                    >
                      <X className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <AdminButton
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setDraft({ ...draft, videos: [...draft.videos, { kind: 'link', url: '' }] })
                  }
                >
                  <Link2 className="size-4" /> Add video link
                </AdminButton>
                <AdminButton
                  type="button"
                  variant="ghost"
                  onClick={() =>
                    setDraft({ ...draft, videos: [...draft.videos, { kind: 'file', url: '' }] })
                  }
                >
                  <Video className="size-4" /> Add video upload
                </AdminButton>
              </div>
            </div>

            <Field label="Sort order">
              <Input
                type="number"
                value={draft.sort}
                onChange={(e) => setDraft({ ...draft, sort: Number(e.target.value) })}
              />
            </Field>
            <label className="flex items-start gap-2 rounded-xl bg-marigold-50/60 p-3 text-sm font-semibold text-ink-800 ring-1 ring-marigold-200">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                className="mt-0.5 size-4 accent-vermilion-600"
              />
              <span>
                Show as the highlighted event banner on the home page
                <span className="mt-0.5 block text-xs font-normal text-ink-600">
                  Only one event is shown. If several are ticked, the one with the nearest date wins.
                </span>
              </span>
            </label>
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
