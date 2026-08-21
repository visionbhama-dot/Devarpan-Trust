// गैलरी आइटम — अभी placeholder रंग/आइकन दिखेंगे।
// असली फोटो अपलोड करने के बाद `src` में पथ डालें, जैसे: '/gallery/yajna-1.jpg'
export type GalleryCategory = 'yajna' | 'yoga' | 'education' | 'women' | 'events'

export interface GalleryItem {
  id: number
  category: GalleryCategory
  caption: { hi: string; en: string }
  src?: string
}

export const galleryCategories: { key: GalleryCategory; hi: string; en: string }[] = [
  { key: 'yajna', hi: 'यज्ञ', en: 'Yajna' },
  { key: 'yoga', hi: 'योग', en: 'Yoga' },
  { key: 'education', hi: 'शिक्षा', en: 'Education' },
  { key: 'women', hi: 'महिला सशक्तिकरण', en: 'Women Empowerment' },
  { key: 'events', hi: 'आयोजन', en: 'Events' },
]

export const galleryItems: GalleryItem[] = [
  {
    id: 1,
    category: 'yajna',
    caption: { hi: 'सामूहिक यज्ञ (हवन)', en: 'Community Yajna (Havan)' },
    src: '/gallery/g04-yajna.jpg',
  },
  {
    id: 2,
    category: 'yajna',
    caption: { hi: 'यज्ञ एवं बाल अभिनन्दन', en: 'Yajna & Children\u2019s Felicitation' },
    src: '/gallery/g06-yajna-bal.jpg',
  },
  {
    id: 3,
    category: 'yajna',
    caption: { hi: 'सत्संग एवं यज्ञ सभा', en: 'Satsang & Yajna Gathering' },
    src: '/gallery/g08-satsang-yajna.jpg',
  },
  {
    id: 4,
    category: 'yoga',
    caption: { hi: 'बाल योग एवं ध्यान शिविर', en: 'Children\u2019s Yoga & Meditation Camp' },
    src: '/gallery/g01-bal-yoga.jpg',
  },
  {
    id: 5,
    category: 'yoga',
    caption: { hi: 'योग एवं संस्कार प्रतिभागी', en: 'Yoga & Sanskar Participants' },
    src: '/gallery/g03-yoga-sanskar.jpg',
  },
  {
    id: 6,
    category: 'education',
    caption: { hi: 'बच्चों को शिक्षण सामग्री वितरण', en: 'Distribution of Study Material to Children' },
    src: '/gallery/g02-shiksha-vitran.jpg',
  },
  {
    id: 7,
    category: 'events',
    caption: { hi: 'विद्यार्थी अभिनन्दन समारोह', en: 'Student Felicitation Ceremony' },
    src: '/gallery/g05-vidyarthi-abhinandan.jpg',
  },
  {
    id: 8,
    category: 'events',
    caption: { hi: 'मेधावी छात्रा सम्मान', en: 'Meritorious Student Honour' },
    src: '/gallery/g07-medhavi-chatra.jpg',
  },
  {
    id: 9,
    category: 'events',
    caption: { hi: 'वरिष्ठजन सम्मान', en: 'Honouring of Elders' },
    src: '/gallery/g09-varishthjan-samman.jpg',
  },
  {
    id: 10,
    category: 'events',
    caption: { hi: 'सम्मान एवं सहयोग समारोह', en: 'Felicitation & Support Ceremony' },
    src: '/gallery/g10-samman-samaroh.jpg',
  },
  {
    id: 11,
    category: 'women',
    caption: { hi: 'महिला सम्मान समारोह', en: 'Women\u2019s Felicitation Ceremony' },
    src: '/gallery/g11-mahila-samman.jpg',
  },
]
