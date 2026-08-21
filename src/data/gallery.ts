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
  { id: 1, category: 'yajna', caption: { hi: 'सामूहिक यज्ञ', en: 'Community Yajna' } },
  { id: 2, category: 'yajna', caption: { hi: 'हवन एवं संस्कार', en: 'Havan & Sanskar' } },
  { id: 3, category: 'yoga', caption: { hi: 'अन्तर्राष्ट्रीय योग दिवस', en: 'International Yoga Day' } },
  { id: 4, category: 'yoga', caption: { hi: 'योग शिविर', en: 'Yoga Camp' } },
  { id: 5, category: 'education', caption: { hi: 'बाल शिक्षा सहयोग', en: 'Child Education Support' } },
  { id: 6, category: 'education', caption: { hi: 'संस्कार कक्षा', en: 'Sanskar Class' } },
  { id: 7, category: 'women', caption: { hi: 'सिलाई सेवा केन्द्र', en: 'Stitching Service Centre' } },
  { id: 8, category: 'women', caption: { hi: 'महिला कार्यशाला', en: 'Women Workshop' } },
  { id: 9, category: 'events', caption: { hi: 'सामूहिक विवाह सहायता', en: 'Community Marriage Support' } },
  { id: 10, category: 'events', caption: { hi: 'अभिनन्दन समारोह', en: 'Felicitation Ceremony' } },
  { id: 11, category: 'events', caption: { hi: 'वार्षिक उत्सव', en: 'Annual Celebration' } },
  { id: 12, category: 'yajna', caption: { hi: 'दीप प्रज्वलन', en: 'Lamp Lighting' } },
]
