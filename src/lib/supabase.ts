import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// These are safe to expose in the browser — the anon key is protected by
// Row Level Security (RLS) policies configured in Supabase.
//
// 👉 To switch to a different Supabase account later, just update the two
//    DEFAULT_* values below (or set the VITE_SUPABASE_* environment variables).
const DEFAULT_SUPABASE_URL = 'https://casmuyedxgqohplethek.supabase.co'
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNhc211eWVkeGdxb2hwbGV0aGVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0OTk5NDEsImV4cCI6MjEwMzA3NTk0MX0.fuAN7Op33u9QtsPJilwbiRkF6uR5PAFhAjYqsIp3dio'

const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || DEFAULT_SUPABASE_URL
const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) || DEFAULT_SUPABASE_ANON_KEY

export const isSupabaseConfigured = Boolean(url && anonKey)

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url!, anonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null

/** Storage buckets used by the admin panel. */
export const BUCKETS = {
  gallery: 'gallery',
  members: 'members',
  blogs: 'blogs',
  programs: 'programs',
  activities: 'activities',
  banners: 'banners',
} as const

/**
 * Upload a file to a public bucket and return its public URL.
 * Throws if Supabase is not configured.
 */
export async function uploadPublicFile(
  bucket: keyof typeof BUCKETS,
  file: File,
): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured')
  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
  const { error } = await supabase.storage.from(BUCKETS[bucket]).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error
  const { data } = supabase.storage.from(BUCKETS[bucket]).getPublicUrl(path)
  return data.publicUrl
}
