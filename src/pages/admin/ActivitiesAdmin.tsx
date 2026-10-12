import { useState } from 'react'
import { Plus, Pencil, Trash2, Bell, Eye, EyeOff } from 'lucide-react'
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  type Activity,
} from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import {
  AdminButton,
  Field,
  Input,
  Textarea,
  Modal,
  Notice,
  PageTitle,
  ImageUpload,
} from '../../components/admin/ui'

type Draft = {
  id?: string
  text_hi: string
  text_en: string
  date: string
  image_url: string | null
  link: string
  active: boolean
  sort: number
}

const emptyDraft = (sort: number): Draft => ({
  text_hi: '',
  text_en: '',
  date: '',
  image_url: null,
  link: '',
  active: true,
  sort,
})

function formatDate(iso: string | null) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function ActivitiesAdmin() {
  const { data, loading, refetch } = useAsync<Activity[]>(() => getActivities(false), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () => setDraft(emptyDraft(items.length + 1))
  const openEdit = (a: Activity) =>
    setDraft({
      id: a.id,
      text_hi: a.text.hi,
      text_en: a.text.en,
      date: a.date ?? '',
      image_url: a.image_url,
      link: a.link ?? '',
      active: a.active,
      sort: a.sort,
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    setSaving(true)
    try {
      const payload = {
        text: { hi: draft.text_hi, en: draft.text_en },
        date: draft.date || null,
        image_url: draft.image_url,
        link: draft.link || null,
        active: draft.active,
        sort: Number(draft.sort) || 0,
      }
      if (draft.id) await updateActivity(draft.id, payload)
      else await createActivity(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (a: Activity) => {
    try {
      await updateActivity(a.id, { active: !a.active })
      setMsg({ kind: 'success', text: a.active ? 'Hidden from website.' : 'Now visible on website.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Update failed' })
    }
  }

  const remove = async (a: Activity) => {
    if (!confirm('Delete this activity?')) return
    try {
      await deleteActivity(a.id)
      setMsg({ kind: 'success', text: 'Activity deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Recent Activities"
        subtitle="These appear in the sliding bar and the welcome popup on the home page."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> New activity
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
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-marigold-100/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((a) => (
            <div
              key={a.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-marigold-200 bg-white p-4 shadow-sm"
            >
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-marigold-100">
                {a.image_url ? (
                  <img src={a.image_url} alt="" className="size-full object-cover" />
                ) : (
                  <Bell className="size-5 text-vermilion-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-ink-900">{a.text.hi}</p>
                <p className="truncate text-sm text-ink-700">
                  {formatDate(a.date)}
                  {a.link ? ` • ${a.link}` : ''}
                </p>
              </div>
              <span
                className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${
                  a.active ? 'bg-green-100 text-green-700' : 'bg-marigold-100 text-vermilion-700'
                }`}
              >
                {a.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                {a.active ? 'Visible' : 'Hidden'}
              </span>
              <AdminButton variant="ghost" onClick={() => toggleActive(a)}>
                {a.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                {a.active ? 'Hide' : 'Show'}
              </AdminButton>
              <AdminButton variant="ghost" onClick={() => openEdit(a)}>
                <Pencil className="size-4" /> Edit
              </AdminButton>
              <AdminButton variant="danger" onClick={() => remove(a)}>
                <Trash2 className="size-4" />
              </AdminButton>
            </div>
          ))}
          {items.length === 0 && (
            <p className="rounded-2xl border border-dashed border-marigold-300 bg-white p-8 text-center text-ink-700">
              No activities yet. Click “New activity” to add your first update.
            </p>
          )}
        </div>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? 'Edit activity' : 'New activity'}
      >
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              bucket="activities"
              label="Image (optional)"
              value={draft.image_url}
              onChange={(url) => setDraft({ ...draft, image_url: url })}
            />
            <Field label="Activity text (Hindi)">
              <Textarea
                rows={2}
                value={draft.text_hi}
                onChange={(e) => setDraft({ ...draft, text_hi: e.target.value })}
                required
              />
            </Field>
            <Field label="Activity text (English)">
              <Textarea
                rows={2}
                value={draft.text_en}
                onChange={(e) => setDraft({ ...draft, text_en: e.target.value })}
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Date (optional)">
                <Input
                  type="date"
                  value={draft.date}
                  onChange={(e) => setDraft({ ...draft, date: e.target.value })}
                />
              </Field>
              <Field label="Link (optional)">
                <Input
                  value={draft.link}
                  placeholder="/programs or https://…"
                  onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Sort order">
              <Input
                type="number"
                value={draft.sort}
                onChange={(e) => setDraft({ ...draft, sort: Number(e.target.value) })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              <input
                type="checkbox"
                checked={draft.active}
                onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                className="size-4 accent-vermilion-600"
              />
              Show on website
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
