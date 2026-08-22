import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import {
  getGallery,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  type GalleryItem,
} from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
import { galleryCategories, type GalleryCategory } from '../../data/gallery'
import {
  AdminButton,
  Field,
  Input,
  Select,
  Modal,
  Notice,
  PageTitle,
  ImageUpload,
} from '../../components/admin/ui'

type Draft = {
  id?: string
  category: GalleryCategory
  caption_hi: string
  caption_en: string
  image_url: string
  sort: number
}

const emptyDraft = (sort: number): Draft => ({
  category: 'events',
  caption_hi: '',
  caption_en: '',
  image_url: '',
  sort,
})

export default function GalleryAdmin() {
  const { data, loading, refetch } = useAsync<GalleryItem[]>(() => getGallery(), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () => setDraft(emptyDraft(items.length + 1))
  const openEdit = (g: GalleryItem) =>
    setDraft({
      id: g.id,
      category: g.category,
      caption_hi: g.caption.hi,
      caption_en: g.caption.en,
      image_url: g.image_url,
      sort: g.sort,
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    if (!draft.image_url) {
      setMsg({ kind: 'error', text: 'Please upload an image first.' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        category: draft.category,
        caption: { hi: draft.caption_hi, en: draft.caption_en },
        image_url: draft.image_url,
        sort: Number(draft.sort) || 0,
      }
      if (draft.id) await updateGalleryItem(draft.id, payload)
      else await createGalleryItem(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (g: GalleryItem) => {
    if (!confirm('Delete this photo?')) return
    try {
      await deleteGalleryItem(g.id)
      setMsg({ kind: 'success', text: 'Photo deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Gallery"
        subtitle="Add, edit or remove gallery photos."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> Add photo
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-52 animate-pulse rounded-2xl bg-marigold-100/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((g) => (
            <div
              key={g.id}
              className="overflow-hidden rounded-2xl border border-marigold-200 bg-white shadow-sm"
            >
              <img src={g.image_url} alt={g.caption.hi} className="aspect-[4/3] w-full object-cover" />
              <div className="p-4">
                <span className="inline-block rounded-full bg-marigold-100 px-2.5 py-0.5 text-[11px] font-bold text-vermilion-700">
                  {galleryCategories.find((c) => c.key === g.category)?.hi ?? g.category}
                </span>
                <p className="mt-1.5 font-semibold text-ink-900">{g.caption.hi}</p>
                <p className="text-sm text-ink-700">{g.caption.en}</p>
                <div className="mt-3 flex gap-2">
                  <AdminButton variant="ghost" onClick={() => openEdit(g)} className="flex-1">
                    <Pencil className="size-4" /> Edit
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => remove(g)}>
                    <Trash2 className="size-4" />
                  </AdminButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        open={!!draft}
        onClose={() => setDraft(null)}
        title={draft?.id ? 'Edit photo' : 'Add photo'}
      >
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              bucket="gallery"
              label="Photo"
              value={draft.image_url || null}
              onChange={(url) => setDraft({ ...draft, image_url: url })}
            />
            <Field label="Category">
              <Select
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value as GalleryCategory })}
              >
                {galleryCategories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.hi} / {c.en}
                  </option>
                ))}
              </Select>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Caption (Hindi)">
                <Input
                  value={draft.caption_hi}
                  onChange={(e) => setDraft({ ...draft, caption_hi: e.target.value })}
                  required
                />
              </Field>
              <Field label="Caption (English)">
                <Input
                  value={draft.caption_en}
                  onChange={(e) => setDraft({ ...draft, caption_en: e.target.value })}
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
