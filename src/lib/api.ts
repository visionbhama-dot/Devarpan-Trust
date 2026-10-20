import { supabase, isSupabaseConfigured } from './supabase'
import { galleryItems as staticGallery, type GalleryCategory } from '../data/gallery'
import { members as staticMembers } from '../data/members'
import { objectives as staticObjectives } from '../data/objectives'
import { trustInfo } from '../data/trust'
import { type ProgramStatus } from '../data/programs'

export { type ProgramStatus } from '../data/programs'

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
export interface ProgramVideo {
  kind: 'link' | 'file'
  url: string
}
export interface Program {
  id: string
  title: Bilingual
  description: Bilingual
  location: Bilingual
  /** Free-text timing, e.g. "सांयं 4:00 से 5:15 तक" */
  time_text: Bilingual
  event_date: string | null
  end_date: string | null
  image_url: string | null
  images: string[]
  videos: ProgramVideo[]
  status: ProgramStatus
  /** When true, this event is highlighted in the home page banner. */
  featured: boolean
  sort: number
  created_at: string
}
export interface Banner {
  id: string
  image_url: string
  title: Bilingual
  subtitle: Bilingual
  link: string | null
  /** 'cover' crops to fill (photos); 'contain' shows the whole image (posters). */
  fit: 'cover' | 'contain'
  active: boolean
  sort: number
  created_at: string
}
export interface Activity {
  id: string
  text: Bilingual
  date: string | null
  image_url: string | null
  link: string | null
  active: boolean
  sort: number
  created_at: string
}
export type BookingDateStatus = 'booked' | 'blocked'
export interface BookingDate {
  id: string
  date: string // 'YYYY-MM-DD'
  status: BookingDateStatus
  title: Bilingual
  created_at: string
}
export type BookingRequestStatus = 'pending' | 'confirmed' | 'cancelled'
export interface BookingRequest {
  id: string
  name: string
  occasion: string
  address: string
  phone: string
  email: string
  date: string | null
  message: string
  status: BookingRequestStatus
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

const fallbackPrograms: Program[] = [
  {
    id: 'gayatri-yajna',
    title: {
      hi: 'शारदीय नवरात्रि में गायत्री यज्ञ',
      en: 'Gayatri Yajna during Shardiya Navratri',
    },
    description: {
      hi: 'आप सभी सादर आमंत्रित हैं अपने इस तृतीय गायत्री यज्ञ में। परिवार सहित बच्चों को साथ लेकर पधारें।\n\nवेद बचेंगे तो संस्कार बचेंगे, संस्कार बचेंगे तो संस्कृति बचेगी।\n\nअनेक विद्वानों का मार्गदर्शन प्राप्त होगा। यज्ञ में पवित्र आहुति प्रदान कर अपने जीवन को सफल बनाएं।',
      en: 'You are all cordially invited to our third Gayatri Yajna. Please come along with your family and children.\n\nIf the Vedas are preserved, values will be preserved; if values are preserved, our culture will endure.\n\nGuidance from many learned scholars will be received.',
    },
    location: {
      hi: 'जन्मेजय पार्क, सोम बाजार रोड (समीप पावर हाउस)',
      en: 'Janmejay Park, Som Bazar Road (near Power House)',
    },
    time_text: { hi: 'सांयं 4:00 से 5:15 तक', en: 'Evening 4:00 PM to 5:15 PM' },
    event_date: '2026-10-11',
    end_date: '2026-10-19',
    image_url: '/posters/gayatri-yajna-2026.jpg',
    images: [],
    videos: [],
    status: 'upcoming',
    featured: true,
    sort: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'yoga-diwas',
    title: {
      hi: 'अन्तर्राष्ट्रीय योग दिवस शिविर',
      en: 'International Yoga Day Camp',
    },
    description: {
      hi: 'सभी आयु वर्ग के लिए निःशुल्क योग एवं ध्यान शिविर। पंजीकरण हेतु संपर्क करें।',
      en: 'A free yoga and meditation camp for all age groups. Contact us to register.',
    },
    location: { hi: 'जीवन पार्क, उत्तम नगर, नई दिल्ली', en: 'Jeevan Park, Uttam Nagar, New Delhi' },
    time_text: { hi: '', en: '' },
    event_date: '2026-06-21',
    end_date: null,
    image_url: '/gallery/g01-bal-yoga.jpg',
    images: ['/gallery/g03-yoga-sanskar.jpg'],
    videos: [],
    status: 'upcoming',
    featured: false,
    sort: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'medhavi-samman',
    title: {
      hi: 'मेधावी छात्र सम्मान समारोह',
      en: 'Meritorious Student Felicitation',
    },
    description: {
      hi: 'क्षेत्र के मेधावी एवं निर्धन विद्यार्थियों को प्रोत्साहन एवं शिक्षण सामग्री वितरण।',
      en: 'Encouragement and distribution of study material to meritorious and needy students of the area.',
    },
    location: { hi: 'उत्तम नगर, नई दिल्ली', en: 'Uttam Nagar, New Delhi' },
    time_text: { hi: '', en: '' },
    event_date: '2025-11-14',
    end_date: null,
    image_url: '/gallery/g07-medhavi-chatra.jpg',
    images: ['/gallery/g05-vidyarthi-abhinandan.jpg', '/gallery/g10-samman-samaroh.jpg'],
    videos: [],
    status: 'completed',
    featured: false,
    sort: 2,
    created_at: new Date().toISOString(),
  },
]

const fallbackBanners: Banner[] = [
  {
    id: 'b0',
    image_url: '/posters/gayatri-yajna-2026.jpg',
    title: { hi: '', en: '' },
    subtitle: { hi: '', en: '' },
    link: '/programs',
    fit: 'contain',
    active: true,
    sort: 0,
    created_at: new Date().toISOString(),
  },
  {
    id: 'b1',
    image_url: '/gallery/g04-yajna.jpg',
    title: { hi: 'यज्ञ, योग एवं संस्कार', en: 'Yajna, Yoga & Sanskar' },
    subtitle: {
      hi: 'श्रद्धा से प्रज्वलित संकल्प — देवार्पण ट्रस्ट',
      en: 'A resolve kindled by devotion — Devarpan Trust',
    },
    link: '/objectives',
    fit: 'cover',
    active: true,
    sort: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'b2',
    image_url: '/gallery/g01-bal-yoga.jpg',
    title: { hi: 'बाल योग एवं ध्यान शिविर', en: "Children's Yoga & Meditation Camps" },
    subtitle: {
      hi: 'स्वस्थ शरीर, एकाग्र मन एवं संस्कारित जीवन की ओर',
      en: 'Towards a healthy body, focused mind and a life of values',
    },
    link: '/programs',
    fit: 'cover',
    active: true,
    sort: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'b3',
    image_url: '/gallery/g10-samman-samaroh.jpg',
    title: { hi: 'सम्मान एवं सहयोग समारोह', en: 'Felicitation & Support Ceremonies' },
    subtitle: {
      hi: 'शिक्षा, स्वास्थ्य एवं महिला सशक्तिकरण हेतु निरंतर प्रयास',
      en: 'Continuous efforts for education, health and women empowerment',
    },
    link: '/gallery',
    fit: 'cover',
    active: true,
    sort: 3,
    created_at: new Date().toISOString(),
  },
]

const fallbackActivities: Activity[] = [
  {
    id: 'act-1',
    text: {
      hi: 'उत्तम नगर में सामूहिक यज्ञ का सफल आयोजन सम्पन्न हुआ।',
      en: 'A community Yajna was successfully held at Uttam Nagar.',
    },
    date: '2025-10-05',
    image_url: '/gallery/g04-yajna.jpg',
    link: '/programs',
    active: true,
    sort: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'act-2',
    text: {
      hi: '50 निर्धन विद्यार्थियों को शिक्षण सामग्री वितरित की गई।',
      en: 'Study material was distributed to 50 needy students.',
    },
    date: '2025-09-20',
    image_url: '/gallery/g02-shiksha-vitran.jpg',
    link: '/gallery',
    active: true,
    sort: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'act-3',
    text: {
      hi: 'अन्तर्राष्ट्रीय योग दिवस शिविर हेतु पंजीकरण प्रारम्भ।',
      en: 'Registration has opened for the International Yoga Day camp.',
    },
    date: '2026-05-15',
    image_url: '/gallery/g01-bal-yoga.jpg',
    link: '/programs',
    active: true,
    sort: 3,
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
const toProgram = (r: any): Program => ({
  id: r.id,
  title: { hi: r.title_hi, en: r.title_en },
  description: { hi: r.description_hi ?? '', en: r.description_en ?? '' },
  location: { hi: r.location_hi ?? '', en: r.location_en ?? '' },
  time_text: { hi: r.time_text_hi ?? '', en: r.time_text_en ?? '' },
  event_date: r.event_date,
  end_date: r.end_date ?? null,
  image_url: r.image_url,
  images: Array.isArray(r.images) ? r.images : [],
  videos: Array.isArray(r.videos) ? r.videos : [],
  status: r.status,
  featured: Boolean(r.featured),
  sort: r.sort,
  created_at: r.created_at,
})
const toBanner = (r: any): Banner => ({
  id: r.id,
  image_url: r.image_url,
  title: { hi: r.title_hi ?? '', en: r.title_en ?? '' },
  subtitle: { hi: r.subtitle_hi ?? '', en: r.subtitle_en ?? '' },
  link: r.link,
  fit: r.fit === 'contain' ? 'contain' : 'cover',
  active: r.active,
  sort: r.sort,
  created_at: r.created_at,
})
const toActivity = (r: any): Activity => ({
  id: r.id,
  text: { hi: r.text_hi, en: r.text_en ?? '' },
  date: r.date,
  image_url: r.image_url,
  link: r.link,
  active: r.active,
  sort: r.sort,
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

export async function getPrograms(status?: ProgramStatus): Promise<Program[]> {
  const fallback = status ? fallbackPrograms.filter((p) => p.status === status) : fallbackPrograms
  if (!supabase) return fallback
  let q = supabase
    .from('programs')
    .select('*')
    .order('event_date', { ascending: false, nullsFirst: false })
    .order('sort')
  if (status) q = q.eq('status', status)
  const { data, error } = await q
  if (error || !data) return fallback
  return data.map(toProgram)
}

export async function getProgramById(id: string): Promise<Program | null> {
  if (!supabase) return fallbackPrograms.find((p) => p.id === id) ?? null
  const { data, error } = await supabase.from('programs').select('*').eq('id', id).maybeSingle()
  if (error || !data) return null
  return toProgram(data)
}

export async function getBanners(activeOnly = true): Promise<Banner[]> {
  const fallback = activeOnly ? fallbackBanners.filter((b) => b.active) : fallbackBanners
  if (!supabase) return fallback
  let q = supabase.from('banners').select('*').order('sort')
  if (activeOnly) q = q.eq('active', true)
  const { data, error } = await q
  if (error || !data) return fallback
  return data.map(toBanner)
}

export async function getActivities(activeOnly = true): Promise<Activity[]> {
  const fallback = activeOnly ? fallbackActivities.filter((a) => a.active) : fallbackActivities
  if (!supabase) return fallback
  let q = supabase.from('activities').select('*').order('sort')
  if (activeOnly) q = q.eq('active', true)
  const { data, error } = await q
  if (error || !data) return fallback
  return data.map(toActivity)
}

export async function getBookingDates(): Promise<BookingDate[]> {
  if (!supabase) return []
  const { data, error } = await supabase.from('booking_dates').select('*').order('date')
  if (error || !data) return []
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data.map((r: any) => ({
    id: r.id,
    date: r.date,
    status: r.status,
    title: { hi: r.title_hi ?? '', en: r.title_en ?? '' },
    created_at: r.created_at,
  }))
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

/** Admin only — the public cannot read other people's submissions (RLS). */
export async function getBookingRequests(): Promise<BookingRequest[]> {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('booking_requests')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return []
  /* eslint-disable @typescript-eslint/no-explicit-any */
  return data.map((r: any) => ({
    id: r.id,
    name: r.name ?? '',
    occasion: r.occasion ?? '',
    address: r.address ?? '',
    phone: r.phone ?? '',
    email: r.email ?? '',
    date: r.date,
    message: r.message ?? '',
    status: r.status,
    created_at: r.created_at,
  }))
  /* eslint-enable @typescript-eslint/no-explicit-any */
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

// Programs
export async function createProgram(p: Omit<Program, 'id' | 'created_at'>) {
  const { error } = await requireDb().from('programs').insert({
    title_hi: p.title.hi,
    title_en: p.title.en,
    description_hi: p.description.hi,
    description_en: p.description.en,
    location_hi: p.location.hi,
    location_en: p.location.en,
    time_text_hi: p.time_text?.hi ?? '',
    time_text_en: p.time_text?.en ?? '',
    event_date: p.event_date || null,
    end_date: p.end_date || null,
    image_url: p.image_url,
    images: p.images ?? [],
    videos: p.videos ?? [],
    status: p.status,
    featured: p.featured ?? false,
    sort: p.sort,
  })
  if (error) throw error
}
export async function updateProgram(id: string, p: Partial<Program>) {
  const patch: Record<string, unknown> = {}
  if (p.title) {
    patch.title_hi = p.title.hi
    patch.title_en = p.title.en
  }
  if (p.description) {
    patch.description_hi = p.description.hi
    patch.description_en = p.description.en
  }
  if (p.location) {
    patch.location_hi = p.location.hi
    patch.location_en = p.location.en
  }
  if (p.time_text) {
    patch.time_text_hi = p.time_text.hi
    patch.time_text_en = p.time_text.en
  }
  if (p.event_date !== undefined) patch.event_date = p.event_date || null
  if (p.end_date !== undefined) patch.end_date = p.end_date || null
  if (p.image_url !== undefined) patch.image_url = p.image_url
  if (p.images !== undefined) patch.images = p.images
  if (p.videos !== undefined) patch.videos = p.videos
  if (p.status !== undefined) patch.status = p.status
  if (p.featured !== undefined) patch.featured = p.featured
  if (p.sort !== undefined) patch.sort = p.sort
  const { error } = await requireDb().from('programs').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteProgram(id: string) {
  const { error } = await requireDb().from('programs').delete().eq('id', id)
  if (error) throw error
}

// Activities
// NOTE: the home-page ticker and popup that displayed these were removed on
// request, so nothing renders activities right now. The table and these
// helpers are kept so the feature can be re-enabled without a migration.
export async function createActivity(a: Omit<Activity, 'id' | 'created_at'>) {
  const { error } = await requireDb().from('activities').insert({
    text_hi: a.text.hi,
    text_en: a.text.en,
    date: a.date || null,
    image_url: a.image_url,
    link: a.link || null,
    active: a.active,
    sort: a.sort,
  })
  if (error) throw error
}
export async function updateActivity(id: string, a: Partial<Activity>) {
  const patch: Record<string, unknown> = {}
  if (a.text) {
    patch.text_hi = a.text.hi
    patch.text_en = a.text.en
  }
  if (a.date !== undefined) patch.date = a.date || null
  if (a.image_url !== undefined) patch.image_url = a.image_url
  if (a.link !== undefined) patch.link = a.link || null
  if (a.active !== undefined) patch.active = a.active
  if (a.sort !== undefined) patch.sort = a.sort
  const { error } = await requireDb().from('activities').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteActivity(id: string) {
  const { error } = await requireDb().from('activities').delete().eq('id', id)
  if (error) throw error
}

// Banners
export async function createBanner(b: Omit<Banner, 'id' | 'created_at'>) {
  const { error } = await requireDb().from('banners').insert({
    image_url: b.image_url,
    title_hi: b.title.hi,
    title_en: b.title.en,
    subtitle_hi: b.subtitle.hi,
    subtitle_en: b.subtitle.en,
    link: b.link || null,
    fit: b.fit,
    active: b.active,
    sort: b.sort,
  })
  if (error) throw error
}
export async function updateBanner(id: string, b: Partial<Banner>) {
  const patch: Record<string, unknown> = {}
  if (b.image_url !== undefined) patch.image_url = b.image_url
  if (b.title) {
    patch.title_hi = b.title.hi
    patch.title_en = b.title.en
  }
  if (b.subtitle) {
    patch.subtitle_hi = b.subtitle.hi
    patch.subtitle_en = b.subtitle.en
  }
  if (b.link !== undefined) patch.link = b.link || null
  if (b.fit !== undefined) patch.fit = b.fit
  if (b.active !== undefined) patch.active = b.active
  if (b.sort !== undefined) patch.sort = b.sort
  const { error } = await requireDb().from('banners').update(patch).eq('id', id)
  if (error) throw error
}
export async function deleteBanner(id: string) {
  const { error } = await requireDb().from('banners').delete().eq('id', id)
  if (error) throw error
}

// Bookings — public submit (allowed for everyone by RLS)
export async function createBookingRequest(
  b: Omit<BookingRequest, 'id' | 'created_at' | 'status'>,
) {
  if (!supabase) throw new Error('Supabase is not configured')
  const { error } = await supabase.from('booking_requests').insert({
    name: b.name,
    occasion: b.occasion,
    address: b.address,
    phone: b.phone,
    email: b.email,
    date: b.date || null,
    message: b.message,
    status: 'pending',
  })
  if (error) throw error

  // Best-effort email notification. Does nothing if the edge function is not
  // deployed — the booking is already safely saved above.
  try {
    const secret = import.meta.env.VITE_BOOKING_SECRET as string | undefined
    await supabase.functions.invoke('booking-notify', {
      body: {
        name: b.name,
        occasion: b.occasion,
        address: b.address,
        phone: b.phone,
        email: b.email,
        date: b.date,
        message: b.message,
      },
      headers: secret ? { 'x-booking-secret': secret } : undefined,
    })
  } catch {
    /* ignore — email is optional */
  }
}

// Bookings — admin management
export async function updateBookingRequest(id: string, status: BookingRequestStatus) {
  const { error } = await requireDb().from('booking_requests').update({ status }).eq('id', id)
  if (error) throw error
}
export async function deleteBookingRequest(id: string) {
  const { error } = await requireDb().from('booking_requests').delete().eq('id', id)
  if (error) throw error
}

// Booking date availability (the red dates on the public calendar)
export async function createBookingDate(d: Omit<BookingDate, 'id' | 'created_at'>) {
  const { error } = await requireDb()
    .from('booking_dates')
    .upsert(
      {
        date: d.date,
        status: d.status,
        title_hi: d.title.hi,
        title_en: d.title.en,
      },
      { onConflict: 'date' },
    )
  if (error) throw error
}
export async function deleteBookingDate(id: string) {
  const { error } = await requireDb().from('booking_dates').delete().eq('id', id)
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
