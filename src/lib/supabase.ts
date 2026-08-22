import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// These are safe to expose in the browser — the anon key is protected by
// Row Level Security (RLS) policies configured in Supabase.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

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
