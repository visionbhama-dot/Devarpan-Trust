import { useState } from 'react'
import { Plus, Pencil, Trash2, User } from 'lucide-react'
import { getMembers, createMember, updateMember, deleteMember, type Member } from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import {
  AdminButton,
  Field,
  Input,
  Modal,
  Notice,
  PageTitle,
  ImageUpload,
} from '../../components/admin/ui'

type Draft = {
  id?: string
  name_hi: string
  name_en: string
  role_hi: string
  role_en: string
  photo_url: string | null
  sort: number
}

export default function MembersAdmin() {
  const { data, loading, refetch } = useAsync<Member[]>(() => getMembers(), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () =>
    setDraft({ name_hi: '', name_en: '', role_hi: '', role_en: '', photo_url: null, sort: items.length + 1 })
  const openEdit = (m: Member) =>
    setDraft({
      id: m.id,
      name_hi: m.name.hi,
      name_en: m.name.en,
      role_hi: m.role.hi,
      role_en: m.role.en,
      photo_url: m.photo_url,
      sort: m.sort,
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    setSaving(true)
    try {
      const payload = {
        name: { hi: draft.name_hi, en: draft.name_en },
        role: { hi: draft.role_hi, en: draft.role_en },
        photo_url: draft.photo_url,
        sort: Number(draft.sort) || 0,
      }
      if (draft.id) await updateMember(draft.id, payload)
      else await createMember(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (m: Member) => {
    if (!confirm(`Delete member "${m.name.hi}"?`)) return
    try {
      await deleteMember(m.id)
      setMsg({ kind: 'success', text: 'Member deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Members"
        subtitle="Add, edit or remove trustees. Upload their photos and set the display order."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> Add member
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
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-marigold-100/60" />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 rounded-2xl border border-marigold-200 bg-white p-4 shadow-sm"
            >
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-full bg-marigold-100">
                {m.photo_url ? (
                  <img src={m.photo_url} alt={m.name.hi} className="size-full object-cover" />
                ) : (
                  <User className="size-6 text-vermilion-500" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink-900">{m.name.hi}</p>
                <p className="truncate text-sm text-ink-700">{m.role.hi}</p>
              </div>
              <span className="hidden text-xs text-ink-700 sm:block">#{m.sort}</span>
              <AdminButton variant="ghost" onClick={() => openEdit(m)}>
                <Pencil className="size-4" /> Edit
              </AdminButton>
              <AdminButton variant="danger" onClick={() => remove(m)}>
                <Trash2 className="size-4" />
              </AdminButton>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!draft} onClose={() => setDraft(null)} title={draft?.id ? 'Edit member' : 'Add member'}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              bucket="members"
              label="Photo (optional)"
              value={draft.photo_url}
              onChange={(url) => setDraft({ ...draft, photo_url: url })}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Name (Hindi)">
                <Input
                  value={draft.name_hi}
                  onChange={(e) => setDraft({ ...draft, name_hi: e.target.value })}
                  required
                />
              </Field>
              <Field label="Name (English)">
                <Input
                  value={draft.name_en}
                  onChange={(e) => setDraft({ ...draft, name_en: e.target.value })}
                />
              </Field>
              <Field label="Role (Hindi)">
                <Input
                  value={draft.role_hi}
                  onChange={(e) => setDraft({ ...draft, role_hi: e.target.value })}
                />
              </Field>
              <Field label="Role (English)">
                <Input
                  value={draft.role_en}
                  onChange={(e) => setDraft({ ...draft, role_en: e.target.value })}
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
