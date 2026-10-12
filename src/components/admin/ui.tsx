import { useState, type ReactNode } from 'react'
import { Loader2, Upload, X, CheckCircle2, AlertTriangle } from 'lucide-react'
import { uploadPublicFile, type BUCKETS } from '../../lib/supabase'

export function AdminButton({
  children,
  variant = 'primary',
  loading,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger'
  loading?: boolean
}) {
  const styles = {
    primary: 'bg-vermilion-600 text-white hover:bg-vermilion-700',
    ghost: 'bg-white text-ink-800 ring-1 ring-marigold-300 hover:bg-marigold-50',
    danger: 'bg-white text-red-600 ring-1 ring-red-200 hover:bg-red-50',
  }[variant]
  return (
    <button
      {...props}
      disabled={loading || props.disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold shadow-sm transition-colors disabled:opacity-60 ${styles} ${className}`}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      {children}
    </label>
  )
}

const inputCls =
  'w-full rounded-xl border border-marigold-300 bg-white px-3.5 py-2.5 text-ink-900 outline-none transition-colors focus:border-vermilion-500 focus:ring-2 focus:ring-vermilion-200'

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${inputCls} ${props.className ?? ''}`} />
}

export function Notice({
  kind,
  children,
  onClose,
}: {
  kind: 'success' | 'error'
  children: ReactNode
  onClose?: () => void
}) {
  const ok = kind === 'success'
  return (
    <div
      className={`flex items-start gap-2 rounded-xl p-3 text-sm font-medium ring-1 ${
        ok ? 'bg-green-50 text-green-800 ring-green-200' : 'bg-red-50 text-red-800 ring-red-200'
      }`}
    >
      {ok ? (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      ) : (
        <AlertTriangle className="mt-0.5 size-4 shrink-0" />
      )}
      <span className="flex-1">{children}</span>
      {onClose && (
        <button onClick={onClose} aria-label="close">
          <X className="size-4" />
        </button>
      )}
    </div>
  )
}

/** Image upload with preview → uploads to a Supabase bucket, returns public URL. */
export function ImageUpload({
  value,
  onChange,
  bucket,
  label = 'Image',
}: {
  value: string | null
  onChange: (url: string) => void
  bucket: keyof typeof BUCKETS
  label?: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr(null)
    try {
      const url = await uploadPublicFile(bucket, file)
      onChange(url)
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Upload failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      <div className="flex items-center gap-4">
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-xl bg-marigold-50 ring-1 ring-marigold-200">
          {value ? (
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <Upload className="size-6 text-marigold-500" />
          )}
        </div>
        <div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-800 ring-1 ring-marigold-300 hover:bg-marigold-50">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
            {busy ? 'Uploading…' : 'Choose image'}
            <input type="file" accept="image/*" className="hidden" onChange={handle} disabled={busy} />
          </label>
          {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
        </div>
      </div>
    </div>
  )
}


/** Upload several images to a bucket; manages an array of public URLs. */
export function MultiImageUpload({
  value,
  onChange,
  bucket,
  label = 'Photos',
}: {
  value: string[]
  onChange: (urls: string[]) => void
  bucket: keyof typeof BUCKETS
  label?: string
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    setBusy(true)
    setErr(null)
    try {
      const uploaded: string[] = []
      for (const file of files) uploaded.push(await uploadPublicFile(bucket, file))
      onChange([...value, ...uploaded])
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-sm font-semibold text-ink-800">{label}</span>
      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-3 gap-2.5 sm:grid-cols-4">
          {value.map((url, i) => (
            <div
              key={`${url}-${i}`}
              className="group relative aspect-square overflow-hidden rounded-xl ring-1 ring-marigold-200"
            >
              <img src={url} alt="" className="size-full object-cover" />
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                aria-label="Remove photo"
                className="absolute right-1.5 top-1.5 grid size-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-800 ring-1 ring-marigold-300 hover:bg-marigold-50">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {busy ? 'Uploading…' : 'Add photos'}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handle}
          disabled={busy}
        />
      </label>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </div>
  )
}

/** A single file upload button that returns the uploaded public URL. */
export function FileUploadButton({
  bucket,
  accept = '*/*',
  label = 'Upload file',
  onUploaded,
}: {
  bucket: keyof typeof BUCKETS
  accept?: string
  label?: string
  onUploaded: (url: string) => void
}) {
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const handle = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setBusy(true)
    setErr(null)
    try {
      onUploaded(await uploadPublicFile(bucket, file))
    } catch (e2) {
      setErr(e2 instanceof Error ? e2.message : 'Upload failed')
    } finally {
      setBusy(false)
      e.target.value = ''
    }
  }

  return (
    <span className="inline-flex flex-col">
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-ink-800 ring-1 ring-marigold-300 hover:bg-marigold-50">
        {busy ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
        {busy ? 'Uploading…' : label}
        <input type="file" accept={accept} className="hidden" onChange={handle} disabled={busy} />
      </label>
      {err && <p className="mt-1 text-xs text-red-600">{err}</p>}
    </span>
  )
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] grid place-items-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-marigold-200 bg-white px-6 py-4">
          <h3 className="font-display text-xl font-normal text-ink-900">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-9 place-items-center rounded-full bg-marigold-50 text-ink-700 ring-1 ring-marigold-200 hover:bg-marigold-100"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function PageTitle({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-3xl font-normal text-ink-900 md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-1 text-ink-700">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
