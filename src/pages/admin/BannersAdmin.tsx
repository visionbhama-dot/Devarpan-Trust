import { useState } from 'react'
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { getBanners, createBanner, updateBanner, deleteBanner, type Banner } from '../../lib/api'
import { useAsync } from '../../lib/useAsync'
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
  image_url: string
  title_hi: string
  title_en: string
  subtitle_hi: string
  subtitle_en: string
  link: string
  fit: 'cover' | 'contain'
  active: boolean
  sort: number
}

const emptyDraft = (sort: number): Draft => ({
  image_url: '',
  title_hi: '',
  title_en: '',
  subtitle_hi: '',
  subtitle_en: '',
  link: '',
  fit: 'cover',
  active: true,
  sort,
})

export default function BannersAdmin() {
  const { data, loading, refetch } = useAsync<Banner[]>(() => getBanners(false), [])
  const items = data ?? []
  const [draft, setDraft] = useState<Draft | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  const openNew = () => setDraft(emptyDraft(items.length + 1))
  const openEdit = (b: Banner) =>
    setDraft({
      id: b.id,
      image_url: b.image_url,
      title_hi: b.title.hi,
      title_en: b.title.en,
      subtitle_hi: b.subtitle.hi,
      subtitle_en: b.subtitle.en,
      link: b.link ?? '',
      fit: b.fit,
      active: b.active,
      sort: b.sort,
    })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!draft) return
    if (!draft.image_url) {
      setMsg({ kind: 'error', text: 'Please upload a banner image first.' })
      return
    }
    setSaving(true)
    try {
      const payload = {
        image_url: draft.image_url,
        title: { hi: draft.title_hi, en: draft.title_en },
        subtitle: { hi: draft.subtitle_hi, en: draft.subtitle_en },
        link: draft.link || null,
        fit: draft.fit,
        active: draft.active,
        sort: Number(draft.sort) || 0,
      }
      if (draft.id) await updateBanner(draft.id, payload)
      else await createBanner(payload)
      setDraft(null)
      setMsg({ kind: 'success', text: 'Saved successfully.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (b: Banner) => {
    try {
      await updateBanner(b.id, { active: !b.active })
      setMsg({ kind: 'success', text: b.active ? 'Hidden from website.' : 'Now visible on website.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Update failed' })
    }
  }

  const remove = async (b: Banner) => {
    if (!confirm('Delete this banner?')) return
    try {
      await deleteBanner(b.id)
      setMsg({ kind: 'success', text: 'Banner deleted.' })
      refetch()
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Delete failed' })
    }
  }

  return (
    <div>
      <PageTitle
        title="Home Banners"
        subtitle="The rotating banner at the top of the home page. Slides change every 6 seconds."
        action={
          <AdminButton onClick={openNew}>
            <Plus className="size-4" /> New banner
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

      {!loading && items.length === 0 && (
        <div className="mb-5">
          <Notice kind="error">
            No banners yet, so the home page is showing its default hero. Add at least one banner to
            enable the rotating banner.
          </Notice>
        </div>
      )}

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-56 animate-pulse rounded-2xl bg-marigold-100/60" />
          ))}
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {items.map((b) => (
            <div
              key={b.id}
              className="overflow-hidden rounded-2xl border border-marigold-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/9] bg-marigold-50">
                <img
                  src={b.image_url}
                  alt=""
                  className={`size-full ${b.fit === 'contain' ? 'object-contain' : 'object-cover'}`}
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur">
                  #{b.sort} · {b.fit === 'contain' ? 'Full poster' : 'Fill'}
                </span>
                <span
                  className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                    b.active ? 'bg-green-600 text-white' : 'bg-ink-900/75 text-white'
                  }`}
                >
                  {b.active ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
                  {b.active ? 'Visible' : 'Hidden'}
                </span>
              </div>
              <div className="p-4">
                <p className="truncate font-bold text-ink-900">{b.title.hi || '—'}</p>
                <p className="truncate text-sm text-ink-700">{b.subtitle.hi || b.link || ' '}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <AdminButton variant="ghost" onClick={() => toggleActive(b)}>
                    {b.active ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {b.active ? 'Hide' : 'Show'}
                  </AdminButton>
                  <AdminButton variant="ghost" onClick={() => openEdit(b)} className="flex-1">
                    <Pencil className="size-4" /> Edit
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => remove(b)}>
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
        title={draft?.id ? 'Edit banner' : 'New banner'}
      >
        {draft && (
          <form onSubmit={save} className="space-y-4">
            <ImageUpload
              bucket="banners"
              label="Banner image"
              value={draft.image_url || null}
              onChange={(url) => setDraft({ ...draft, image_url: url })}
            />
            <Field label="Image display">
              <Select
                value={draft.fit}
                onChange={(e) => setDraft({ ...draft, fit: e.target.value as 'cover' | 'contain' })}
              >
                <option value="cover">Fill the banner (best for photos)</option>
                <option value="contain">Show the whole image (best for posters)</option>
              </Select>
              <p className="mt-1 text-xs text-ink-600">
                Choose “Show the whole image” for event posters so no text gets cropped.
              </p>
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Heading (Hindi) — optional">
                <Input
                  value={draft.title_hi}
                  onChange={(e) => setDraft({ ...draft, title_hi: e.target.value })}
                />
              </Field>
              <Field label="Heading (English) — optional">
                <Input
                  value={draft.title_en}
                  onChange={(e) => setDraft({ ...draft, title_en: e.target.value })}
                />
              </Field>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Sub-text (Hindi) — optional">
                <Input
                  value={draft.subtitle_hi}
                  onChange={(e) => setDraft({ ...draft, subtitle_hi: e.target.value })}
                />
              </Field>
              <Field label="Sub-text (English) — optional">
                <Input
                  value={draft.subtitle_en}
                  onChange={(e) => setDraft({ ...draft, subtitle_en: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Button link (optional)">
              <Input
                value={draft.link}
                placeholder="/programs, /gallery or https://…"
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
              />
            </Field>
            <Field label="Slide order">
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
