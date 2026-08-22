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
    name: { hi: 'श्री ओमपाल सिंह आर्य', en: 'Shri Ompal Singh Arya' },
    role: { hi: 'अध्यक्ष', en: 'President' },
    photo: '/members/ompal.jpg',
  },
  {
    id: 2,
    name: { hi: 'श्री रमेशचंद्र आर्य', en: 'Shri Rameshchandra Arya' },
    role: { hi: 'महासचिव', en: 'General Secretary' },
    photo: '/members/ramesh.jpg',
  },
  {
    id: 3,
    name: { hi: 'श्रीमती नीरज कुमारी', en: 'Smt. Neeraj Kumari' },
    role: { hi: 'कोषाध्यक्ष', en: 'Treasurer' },
    photo: '/members/neeraj.jpg',
  },
  {
    id: 4,
    name: { hi: 'आचार्य डॉ. धनंजय आर्य', en: 'Acharya Dr. Dhananjay Arya' },
    role: { hi: 'प्रस्तोता', en: 'Proposer' },
    photo: '/members/dhananjay.jpg',
  },
  {
    id: 5,
    name: { hi: 'श्री देवेन्द्र कुमार', en: 'Shri Devendra Kumar' },
    role: { hi: 'ट्रस्टी', en: 'Trustee' },
    photo: '/members/devendra.jpg',
  },
  {
    id: 6,
    name: { hi: 'श्री रामेश्वर दयाल गुप्ता', en: 'Shri Rameshwar Dayal Gupta' },
    role: { hi: 'ट्रस्टी', en: 'Trustee' },
    photo: '/members/rameshwar.jpg',
  },
  {
    id: 7,
    name: { hi: 'श्री अर्जुन कुमार', en: 'Shri Arjun Kumar' },
    role: { hi: 'ट्रस्टी', en: 'Trustee' },
    photo: '/members/arjun.jpg',
  },
]
