import { supabase, isSupabaseConfigured } from './supabase'
import { galleryItems as staticGallery, type GalleryCategory } from '../data/gallery'
import { members as staticMembers } from '../data/members'
import { objectives as staticObjectives } from '../data/objectives'
import { trustInfo } from '../data/trust'

// ---------- Unified types used across the app ----------
export interface Bilingual {
  hi: string
  en: string
}
export interface GalleryItem {
  id: string
  category: GalleryCategory
  caption: Bilingual
  image_url: string
  sort: number
}
export interface Member {
  id: string
  name: Bilingual
  role: Bilingual
  photo_url: string | null
  sort: number
}
export interface Objective {
  id: string
  num: string
  text: Bilingual
  sort: number
}
export interface Blog {
  id: string
  slug: string
  title: Bilingual
  excerpt: Bilingual
  content: Bilingual
  cover_url: string | null
  published: boolean
  published_at: string | null
  created_at: string
}
export interface Settings {
  phones: string[]
  email: string
  address: Bilingual
  bank: { pan: string; account: string; ifsc: string }
  socials: {
    facebook?: string
    instagram?: string
    youtube?: string
    twitter?: string
    whatsapp?: string
  }
}

// ---------- Static fallbacks (used until Supabase is configured) ----------
const fallbackGallery: GalleryItem[] = staticGallery
  .filter((g) => g.src)
  .map((g, i) => ({
    id: String(g.id),
    category: g.category,
    caption: g.caption,
    image_url: g.src!,
    sort: i + 1,
  }))

const fallbackMembers: Member[] = staticMembers.map((m) => ({
  id: String(m.id),
  name: m.name,
  role: m.role,
  photo_url: m.photo ?? null,
  sort: m.id,
}))

const fallbackObjectives: Objective[] = staticObjectives.map((o, i) => ({
  id: o.num,
  num: o.num,
  text: { hi: o.hi, en: o.en },
  sort: i + 1,
}))

const fallbackSettings: Settings = {
  phones: trustInfo.phones,
  email: trustInfo.email,
  address: trustInfo.address,
  bank: trustInfo.bank,
  socials: { facebook: trustInfo.facebook, whatsapp: trustInfo.phones[0] },
}

const fallbackBlogs: Blog[] = [
  {
    id: 'welcome',
    slug: 'welcome',
    title: {
      hi: 'देवार्पण ट्रस्ट के ब्लॉग में आपका स्वागत है',
      en: 'Welcome to the Devarpan Trust Blog',
    },
    excerpt: {
      hi: 'हमारे आयोजनों, यज्ञों एवं सामाजिक कार्यों की जानकारी यहाँ साझा की जाएगी।',
      en: 'Updates about our events, Yajnas and social work will be shared here.',
    },
    content: {
      hi: 'यह हमारा पहला ब्लॉग है। शीघ्र ही हम अपने कार्यक्रमों की विस्तृत जानकारी यहाँ प्रकाशित करेंगे।',
      en: 'This is our first blog post. We will soon publish detailed updates about our programs here.',
    },
    cover_url: null,
    published: true,
    published_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  },
]

// ---------- Row mappers ----------
/* eslint-disable @typescript-eslint/no-explicit-any */
const toGallery = (r: any): GalleryItem => ({
  id: r.id,
  category: r.category,
  caption: { hi: r.caption_hi, en: r.caption_en },
  image_url: r.image_url,
  sort: r.sort,
})
const toMember = (r: any): Member => ({
  id: r.id,
  name: { hi: r.name_hi, en: r.name_en },
  role: { hi: r.role_hi, en: r.role_en },
  photo_url: r.photo_url,
  sort: r.sort,
})
const toObjective = (r: any): Objective => ({
  id: r.id,
  num: r.num,
  text: { hi: r.text_hi, en: r.text_en },
  sort: r.sort,
})
const toBlog = (r: any): Blog => ({
  id: r.id,
  slug: r.slug,
  title: { hi: r.title_hi, en: r.title_en },
  excerpt: { hi: r.excerpt_hi ?? '', en: r.excerpt_en ?? '' },
  content: { hi: r.content_hi ?? '', en: r.content_en ?? '' },
  cover_url: r.cover_url,
  published: r.published,
  published_at: r.published_at,
  created_at: r.created_at,
})
/* eslint-enable @typescript-eslint/no-explicit-any */

// ============================================================
//  PUBLIC READS (fall back to static data if not configured)
// ============================================================
export async function getGallery(): Promise<GalleryItem[]> {
  if (!supabase) return fallbackGallery
  const { data, error } = await supabase.from('gallery').select('*').order('sort')
  if (error || !data) return fallbackGallery
  return data.map(toGallery)
}

export async function getMembers(): Promise<Member[]> {
  if (!supabase) return fallbackMembers
  const { data, error } = await supabase.from('members').select('*').order('sort')
  if (error || !data) return fallbackMembers
  return data.map(toMember)
}

export async function getObjectives(): Promise<Objective[]> {
  if (!supabase) return fallbackObjectives
  const { data, error } = await supabase.from('objectives').select('*').order('sort')
  if (error || !data) return fallbackObjectives
  return data.map(toObjective)
}

export async function getBlogs(publishedOnly = true): Promise<Blog[]> {
  if (!supabase) return publishedOnly ? fallbackBlogs.filter((b) => b.published) : fallbackBlogs
  let q = supabase.from('blogs').select('*').order('published_at', { ascending: false, nullsFirst: false })
  if (publishedOnly) q = q.eq('published', true)
  const { data, error } = await q
  if (error || !data) return fallbackBlogs
  return data.map(toBlog)
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!supabase) return fallbackBlogs.find((b) => b.slug === slug) ?? null
  const { data, error } = await supabase.from('blogs').select('*').eq('slug', slug).maybeSingle()
  if (error || !data) return null
  return toBlog(data)
}

export async function getSettings(): Promise<Settings> {
  if (!supabase) return fallbackSettings
  const { data, error } = await supabase.from('settings').select('*').eq('id', 'site').maybeSingle()
  if (error || !data) return fallbackSettings
  return {
    phones: data.phones ?? [],
    email: data.email ?? '',
    address: { hi: data.address_hi ?? '', en: data.address_en ?? '' },
    bank: data.bank ?? { pan: '', account: '', ifsc: '' },
    socials: data.socials ?? {},
  }
}

// ============================================================
//  ADMIN WRITES (require Supabase)
// ============================================================
function requireDb() {
  if (!supabase) throw new Error('Supabase is not configured')
  return supabase
}

// Gallery
export async function createGalleryItem(item: Omit<GalleryItem, 'id'>) {
  const db = requireDb()
  const { error } = await db.from('gallery').insert({
    category: item.category,
    caption_hi: item.caption.hi,
    caption_en: item.caption.en,
    image_url: item.image_url,
    sort: item.sort,
  })
  if (error) throw error
}
export async function updateGalleryItem(id: string, item: Partial<GalleryItem>) {
  const db = requireDb()
  const patch: Record<string, unknown> = {}
  if (item.category) patch.category = item.category
  if (item.caption) {
    patch.caption_hi = item.caption.hi
    patch.caption_en = item.caption.en
  }
  if (item.image_url) patch.image_url = item.image_url
  if (item.sort !== undefined) patch.sort = item.sort
  const { error } = await db.from('gallery').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteGalleryItem(id: string) {
  const { error } = await requireDb().from('gallery').delete().eq('id', id)
  if (error) throw error
}

// Members
export async function createMember(m: Omit<Member, 'id'>) {
  const { error } = await requireDb().from('members').insert({
    name_hi: m.name.hi,
    name_en: m.name.en,
    role_hi: m.role.hi,
    role_en: m.role.en,
    photo_url: m.photo_url,
    sort: m.sort,
  })
  if (error) throw error
}
export async function updateMember(id: string, m: Partial<Member>) {
  const patch: Record<string, unknown> = {}
  if (m.name) {
    patch.name_hi = m.name.hi
    patch.name_en = m.name.en
  }
  if (m.role) {
    patch.role_hi = m.role.hi
    patch.role_en = m.role.en
  }
  if (m.photo_url !== undefined) patch.photo_url = m.photo_url
  if (m.sort !== undefined) patch.sort = m.sort
  const { error } = await requireDb().from('members').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteMember(id: string) {
  const { error } = await requireDb().from('members').delete().eq('id', id)
  if (error) throw error
}

// Objectives
export async function createObjective(o: Omit<Objective, 'id'>) {
  const { error } = await requireDb().from('objectives').insert({
    num: o.num,
    text_hi: o.text.hi,
    text_en: o.text.en,
    sort: o.sort,
  })
  if (error) throw error
}
export async function updateObjective(id: string, o: Partial<Objective>) {
  const patch: Record<string, unknown> = {}
  if (o.num !== undefined) patch.num = o.num
  if (o.text) {
    patch.text_hi = o.text.hi
    patch.text_en = o.text.en
  }
  if (o.sort !== undefined) patch.sort = o.sort
  const { error } = await requireDb().from('objectives').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteObjective(id: string) {
  const { error } = await requireDb().from('objectives').delete().eq('id', id)
  if (error) throw error
}

// Blogs
export async function createBlog(b: Omit<Blog, 'id' | 'created_at'>) {
  const { error } = await requireDb().from('blogs').insert({
    slug: b.slug,
    title_hi: b.title.hi,
    title_en: b.title.en,
    excerpt_hi: b.excerpt.hi,
    excerpt_en: b.excerpt.en,
    content_hi: b.content.hi,
    content_en: b.content.en,
    cover_url: b.cover_url,
    published: b.published,
    published_at: b.published ? (b.published_at ?? new Date().toISOString()) : null,
  })
  if (error) throw error
}
export async function updateBlog(id: string, b: Partial<Blog>) {
  const patch: Record<string, unknown> = {}
  if (b.slug !== undefined) patch.slug = b.slug
  if (b.title) {
    patch.title_hi = b.title.hi
    patch.title_en = b.title.en
  }
  if (b.excerpt) {
    patch.excerpt_hi = b.excerpt.hi
    patch.excerpt_en = b.excerpt.en
  }
  if (b.content) {
    patch.content_hi = b.content.hi
    patch.content_en = b.content.en
  }
  if (b.cover_url !== undefined) patch.cover_url = b.cover_url
  if (b.published !== undefined) {
    patch.published = b.published
    patch.published_at = b.published ? (b.published_at ?? new Date().toISOString()) : null
  }
  const { error } = await requireDb().from('blogs').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteBlog(id: string) {
  const { error } = await requireDb().from('blogs').delete().eq('id', id)
  if (error) throw error
}

// Settings
export async function updateSettings(s: Settings) {
  const { error } = await requireDb().from('settings').upsert({
    id: 'site',
    phones: s.phones,
    email: s.email,
    address_hi: s.address.hi,
    address_en: s.address.en,
    bank: s.bank,
    socials: s.socials,
  })
  if (error) throw error
}

export const defaultSettings = fallbackSettings

export { isSupabaseConfigured }
