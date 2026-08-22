import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { getBlogs, createBlog, updateBlog, deleteBlog, type Blog } from '../../lib/api'
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
  slug: string
  title_hi: string
  title_en: string
  excerpt_hi: string
  excerpt_en: string
  content_hi: string
  content_en: string
  cover_url: string | null
  published: boolean
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60) || `post-${Date.now()}`

const emptyDraft = (): Draft => ({
  slug: '',
  title_hi: '',
  title_en: '',
  excerpt_hi: '',
  excerpt_en: '',
  content_hi: '',
  content_en: '',
  cover_url: null,
  published: false,
})

export default function BlogsAdmin() {
  const { data, loading, refetch } = useAsync<Blog[]>(() => getBlogs(false), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () => setDraft(emptyDraft())
  const openEdit = (b: Blog) =>
    setDraft({
      id: b.id,
      slug: b.slug,
      title_hi: b.title.hi,
      title_en: b.title.en,
      excerpt_hi: b.excerpt.hi,
      excerpt_en: b.excerpt.en,
      content_hi: b.content.hi,
      content_en: b.content.en,
      cover_url: b.cover_url,
      published: b.published,
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    setSaving(true)
    try {
      const slug = draft.slug.trim() || slugify(draft.title_en || draft.title_hi)
      const payload = {
        slug,
        title: { hi: draft.title_hi, en: draft.title_en },
        excerpt: { hi: draft.excerpt_hi, en: draft.excerpt_en },
        content: { hi: draft.content_hi, en: draft.content_en },
        cover_url: draft.cover_url,
        published: draft.published,
        published_at: null,
      }
      if (draft.id) await updateBlog(draft.id, payload)
      else await createBlog(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const remove = async (b: Blog) => {
    if (!confirm(`Delete blog "${b.title.hi}"?`)) return
    try {
      await deleteBlog(b.id)
      setMsg({ kind: 'success', text: 'Blog deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Blogs"
        subtitle="Write, edit, publish or delete blog posts."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> New blog
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
          {items.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-4 rounded-2xl border border-marigold-200 bg-white p-4 shadow-sm"
            >
              <div className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-marigold-100">
                {b.cover_url ? (
                  <img src={b.cover_url} alt="" className="size-full object-cover" />
                ) : (
                  <span className="font-display text-xl text-vermilion-500">ब्</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-bold text-ink-900">{b.title.hi}</p>
                <p className="truncate text-sm text-ink-700">/{b.slug}</p>
              </div>
              <span
                className={`hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold sm:inline-flex ${
                  b.published ? 'bg-green-100 text-green-700' : 'bg-marigold-100 text-vermilion-700'
                }`}
              >
                {b.published ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                {b.published ? 'Published' : 'Draft'}
              </span>
              <AdminButton variant="ghost" onClick={() => openEdit(b)}>
                <Pencil className="size-4" /> Edit
              </AdminButton>
              <AdminButton variant="danger" onClick={() => remove(b)}>
                <Trash2 className="size-4" />
              </AdminButton>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!draft} onClose={() => setDraft(null)} title={draft?.id ? 'Edit blog' : 'New blog'}>
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              bucket="blogs"
              label="Cover image (optional)"
              value={draft.cover_url}
              onChange={(url) => setDraft({ ...draft, cover_url: url })}
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
                  onChange={(e) =>
                    setDraft({
                      ...draft,
                      title_en: e.target.value,
                      slug: draft.slug || slugify(e.target.value),
                    })
                  }
                />
              </Field>
            </div>
            <Field label="URL slug">
              <Input
                value={draft.slug}
                onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
                placeholder="my-first-post"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Short summary (Hindi)">
                <Textarea
                  rows={2}
                  value={draft.excerpt_hi}
                  onChange={(e) => setDraft({ ...draft, excerpt_hi: e.target.value })}
                />
              </Field>
              <Field label="Short summary (English)">
                <Textarea
                  rows={2}
                  value={draft.excerpt_en}
                  onChange={(e) => setDraft({ ...draft, excerpt_en: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Content (Hindi)">
              <Textarea
                rows={6}
                value={draft.content_hi}
                onChange={(e) => setDraft({ ...draft, content_hi: e.target.value })}
              />
            </Field>
            <Field label="Content (English)">
              <Textarea
                rows={6}
                value={draft.content_en}
                onChange={(e) => setDraft({ ...draft, content_en: e.target.value })}
              />
            </Field>
            <label className="flex items-center gap-2 text-sm font-semibold text-ink-800">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => setDraft({ ...draft, published: e.target.checked })}
                className="size-4 accent-vermilion-600"
              />
              Publish (visible on the website)
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
