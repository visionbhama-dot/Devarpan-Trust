import { useEffect, useState } from 'react'
import { Plus, Trash2, Save } from 'lucide-react'
import { getSettings, updateSettings, type Settings } from '../../lib/api'
import { AdminButton, Field, Input, Notice, PageTitle } from '../../components/admin/ui'

export default function SettingsAdmin() {
  const [s, setS] = useState<Settings | null>(null)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ kind: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    getSettings().then(setS)
  }, [])

  if (!s) {
    return (
      <div className="space-y-3">
        <div className="h-10 w-1/3 animate-pulse rounded bg-marigold-100" />
        <div className="h-64 animate-pulse rounded-2xl bg-marigold-100/60" />
      </div>
    )
  }

  const setPhone = (i: number, v: string) => {
    const phones = [...s.phones]
    phones[i] = v
    setS({ ...s, phones })
  }
  const addPhone = () => setS({ ...s, phones: [...s.phones, ''] })
  const removePhone = (i: number) => setS({ ...s, phones: s.phones.filter((_, idx) => idx !== i) })

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateSettings({ ...s, phones: s.phones.filter((p) => p.trim()) })
      setMsg({ kind: 'success', text: 'Settings saved. Refresh the website to see changes.' })
    } catch (e2) {
      setMsg({ kind: 'error', text: e2 instanceof Error ? e2.message : 'Save failed' })
    } finally {
      setSaving(false)
    }
  }

  const card = 'rounded-2xl border border-marigold-200 bg-white p-6 shadow-sm'
  const heading = 'mb-4 font-display text-xl font-normal text-ink-900'

  return (
    <form onSubmit={save}>
      <PageTitle
        title="Contact & Footer Settings"
        subtitle="Edit contact info, bank details and social media links shown across the site."
        action={
          <AdminButton type="submit" loading={saving}>
            <Save className="size-4" /> Save changes
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

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Contact */}
        <div className={card}>
          <h2 className={heading}>Contact</h2>
          <div className="space-y-4">
            <Field label="Email">
              <Input value={s.email} onChange={(e) => setS({ ...s, email: e.target.value })} />
            </Field>
            <Field label="Address (Hindi)">
              <Input
                value={s.address.hi}
                onChange={(e) => setS({ ...s, address: { ...s.address, hi: e.target.value } })}
              />
            </Field>
            <Field label="Address (English)">
              <Input
                value={s.address.en}
                onChange={(e) => setS({ ...s, address: { ...s.address, en: e.target.value } })}
              />
            </Field>
            <div>
              <span className="mb-1.5 block text-sm font-semibold text-ink-800">Phone numbers</span>
              <div className="space-y-2">
                {s.phones.map((p, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={p} onChange={(e) => setPhone(i, e.target.value)} />
                    <AdminButton type="button" variant="danger" onClick={() => removePhone(i)}>
                      <Trash2 className="size-4" />
                    </AdminButton>
                  </div>
                ))}
                <AdminButton type="button" variant="ghost" onClick={addPhone}>
                  <Plus className="size-4" /> Add phone
                </AdminButton>
              </div>
            </div>
          </div>
        </div>

        {/* Bank */}
        <div className={card}>
          <h2 className={heading}>Bank details (for donations)</h2>
          <div className="space-y-4">
            <Field label="PAN Number">
              <Input
                value={s.bank.pan}
                onChange={(e) => setS({ ...s, bank: { ...s.bank, pan: e.target.value } })}
              />
            </Field>
            <Field label="Account Number">
              <Input
                value={s.bank.account}
                onChange={(e) => setS({ ...s, bank: { ...s.bank, account: e.target.value } })}
              />
            </Field>
            <Field label="IFSC Code">
              <Input
                value={s.bank.ifsc}
                onChange={(e) => setS({ ...s, bank: { ...s.bank, ifsc: e.target.value } })}
              />
            </Field>
          </div>
        </div>

        {/* Social media */}
        <div className={`${card} lg:col-span-2`}>
          <h2 className={heading}>Social media & WhatsApp</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Facebook URL">
              <Input
                value={s.socials.facebook ?? ''}
                onChange={(e) => setS({ ...s, socials: { ...s.socials, facebook: e.target.value } })}
                placeholder="https://facebook.com/..."
              />
            </Field>
            <Field label="Instagram URL">
              <Input
                value={s.socials.instagram ?? ''}
                onChange={(e) => setS({ ...s, socials: { ...s.socials, instagram: e.target.value } })}
                placeholder="https://instagram.com/..."
              />
            </Field>
            <Field label="YouTube URL">
              <Input
                value={s.socials.youtube ?? ''}
                onChange={(e) => setS({ ...s, socials: { ...s.socials, youtube: e.target.value } })}
                placeholder="https://youtube.com/..."
              />
            </Field>
            <Field label="X (Twitter) URL">
              <Input
                value={s.socials.twitter ?? ''}
                onChange={(e) => setS({ ...s, socials: { ...s.socials, twitter: e.target.value } })}
                placeholder="https://x.com/..."
              />
            </Field>
            <Field label="WhatsApp number (for the chat button)">
              <Input
                value={s.socials.whatsapp ?? ''}
                onChange={(e) => setS({ ...s, socials: { ...s.socials, whatsapp: e.target.value } })}
                placeholder="9312270686"
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <AdminButton type="submit" loading={saving}>
          <Save className="size-4" /> Save changes
        </AdminButton>
      </div>
    </form>
  )
}
