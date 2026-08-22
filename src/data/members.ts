// न्यासी सदस्य (Board of Trustees)
// `photo` को असली चित्र अपलोड करने के बाद बदलें, जैसे: '/members/ompal.jpg'
export interface Member {
  id: number
  name: { hi: string; en: string }
  role: { hi: string; en: string }
  photo?: string // optional — abhi placeholder use hoga
}

export const members: Member[] = [
  {
    id: 1,
    name: { hi: 'श्री ओम पाल सिंह', en: 'Shri Om Pal Singh' },
    role: { hi: 'फर्स्ट ट्रस्टी और अध्यक्ष', en: 'First Trustee & President' },
    photo: '/members/ompal.jpg',
  },
  {
    id: 2,
    name: { hi: 'श्री रमेश चंद्र', en: 'Shri Ramesh Chandra' },
    role: { hi: 'फर्स्ट ट्रस्टी और महासचिव', en: 'First Trustee & General Secretary' },
    photo: '/members/ramesh.jpg',
  },
  {
    id: 3,
    name: { hi: 'श्रीमती नीरज कुमारी', en: 'Smt. Neeraj Kumari' },
    role: { hi: 'फर्स्ट ट्रस्टी और कोषाध्यक्ष', en: 'First Trustee & Treasurer' },
    photo: '/members/neeraj.jpg',
  },
  {
    id: 4,
    name: { hi: 'श्री धनंजय', en: 'Shri Dhananjay' },
    role: { hi: 'फर्स्ट ट्रस्टी और प्रस्तोता', en: 'First Trustee & Proposer' },
    photo: '/members/dhananjay.jpg',
  },
  {
    id: 5,
    name: { hi: 'श्री देवेन्द्र कुमार', en: 'Shri Devendra Kumar' },
    role: { hi: 'फर्स्ट ट्रस्टी', en: 'First Trustee' },
    photo: '/members/devendra.jpg',
  },
  {
    id: 6,
    name: { hi: 'श्री रामेश्वर दयाल गुप्ता', en: 'Shri Rameshwar Dayal Gupta' },
    role: { hi: 'फर्स्ट ट्रस्टी', en: 'First Trustee' },
    photo: '/members/rameshwar.jpg',
  },
  {
    id: 7,
    name: { hi: 'श्री अर्जुन कुमार', en: 'Shri Arjun Kumar' },
    role: { hi: 'फर्स्ट ट्रस्टी', en: 'First Trustee' },
    photo: undefined,
  },
]
