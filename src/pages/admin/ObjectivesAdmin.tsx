import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getObjectives,
  createObjective,
  updateObjective,
  deleteObjective,
  type Objective,
} from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import { AdminButton, Field, Input, Textarea, Modal, Notice, PageTitle } from '../../components/admin/ui'

type Draft = { id?: string; num: string; text_hi: string; text_en: string; sort: number }

export default function ObjectivesAdmin() {
  const { data, loading, refetch } = useAsync<Objective[]>(() => getObjectives(), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () => setDraft({ num: '', text_hi: '', text_en: '', sort: items.length + 1 })
  const openEdit = (o: Objective) =>
    setDraft({ id: o.id, num: o.num, text_hi: o.text.hi, text_en: o.text.en, sort: o.sort })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    setSaving(true)
    try {
      const payload = {
        num: draft.num,
        text: { hi: draft.text_hi, en: draft.text_en },
        sort: Number(draft.sort) || 0,
      }
      if (draft.id) await updateObjective(draft.id, payload)
      else await createObjective(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (o: Objective) => {
    if (!confirm('Delete this objective?')) return
    try {
      await deleteObjective(o.id)
      setMsg({ kind: 'success', text: 'Objective deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Objectives"
        subtitle="Add, edit, reorder or remove the Trust's objectives."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> Add objective
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
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-marigold-100/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((o) => (
            <div
              key={o.id}
              className="flex items-start gap-4 rounded-2xl border border-marigold-200 bg-white p-4 shadow-sm"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-vermilion-600 to-marigold-500 font-display text-white">
                {o.num}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-ink-900">{o.text.hi}</p>
                <p className="mt-1 text-sm text-ink-700">{o.text.en}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <AdminButton variant="ghost" onClick={() => openEdit(o)}>
                  <Pencil className="size-4" />
                </AdminButton>
                <AdminButton variant="danger" onClick={() => remove(o)}>
                  <Trash2 className="size-4" />
                </AdminButton>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!draft} onClose={() => setDraft(null)} title={draft?.id ? 'Edit objective' : 'Add objective'}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-[120px_1fr]">
              <Field label="Number (e.g. i, ii)">
                <Input value={draft.num} onChange={(e) => setDraft({ ...draft, num: e.target.value })} />
              </Field>
              <Field label="Sort order">
                <Input
                  type="number"
                  value={draft.sort}
                  onChange={(e) => setDraft({ ...draft, sort: Number(e.target.value) })}
                />
              </Field>
            </div>
            <Field label="Text (Hindi)">
              <Textarea
                rows={4}
                value={draft.text_hi}
                onChange={(e) => setDraft({ ...draft, text_hi: e.target.value })}
                required
              />
            </Field>
            <Field label="Text (English)">
              <Textarea
                rows={4}
                value={draft.text_en}
                onChange={(e) => setDraft({ ...draft, text_en: e.target.value })}
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
