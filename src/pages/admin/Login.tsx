import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, AlertTriangle } from 'lucide-react'
import { useAuth } from '../../lib/AuthContext'
import { AdminButton, Field, Input, Notice } from '../../components/admin/ui'
import OmLogo from '../../components/OmLogo'

export default function Login() {
  const { signIn, user, configured, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (user) navigate('/admin', { replace: true })
  }, [user, navigate])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError(null)
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) setError(error)
    else navigate('/admin', { replace: true })
  }

  return (
    <div className="grid min-h-screen place-items-center bg-mandana px-4">
      <div className="w-full max-w-md rounded-3xl border border-marigold-200 bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center text-center">
          <OmLogo size="lg" />
          <h1 className="mt-4 font-display text-3xl font-normal text-ink-900">देवार्पण ट्रस्ट</h1>
          <p className="text-sm font-semibold text-vermilion-700">Admin Panel</p>
        </div>

        {!configured && !loading && (
          <div className="mt-6">
            <Notice kind="error">
              Supabase is not configured yet. Please complete the setup steps and add the project keys.
            </Notice>
          </div>
        )}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
          </Field>
          <Field label="Password">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
          </Field>

          {error && (
            <p className="flex items-center gap-1.5 text-sm font-medium text-red-600">
              <AlertTriangle className="size-4" /> {error}
            </p>
          )}

          <AdminButton type="submit" loading={busy} disabled={!configured} className="w-full">
            <LogIn className="size-4" /> Log in
          </AdminButton>
        </form>
      </div>
    </div>
  )
}
