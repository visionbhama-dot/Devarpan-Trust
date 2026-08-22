# देवार्पण ट्रस्ट | Devarpan Trust

एक बोल्ड, द्विभाषी (हिन्दी + English) वेबसाइट — यज्ञ, योग, संस्कृति, संस्कार, महिला सशक्तिकरण एवं सामाजिक उद्देश्यों को समर्पित संगठन के लिए।

A bold, bilingual (Hindi-default / English-switchable) website for **Devarpan Trust (Registered)**, New Delhi.

## ✨ Features / विशेषताएँ

- **द्विभाषी (Bilingual):** Hindi is the default language with a one-click English toggle (react-i18next). Choice is remembered in the browser.
- **Pages:** मुखपृष्ठ (Home), हमारा उद्देश्य (Objectives — all 11 objectives), हमारे सदस्य (Members), गैलरी (Gallery with filters + lightbox), संपर्क (Contact + donation details).
- **Bold Indian theme:** saffron + leaf-green gradients, Devanagari-first typography, smooth animations (Framer Motion).
- Fully responsive, mobile-friendly navigation.

## 🔐 Admin Panel

A password-protected admin panel at **`/admin`** (powered by Supabase) lets the trust manage all content without touching code:
- 🖼️ Gallery photos (upload / edit / delete)
- 👥 Members (add / edit / remove, photo upload, ordering)
- 📝 Blogs (write / publish / delete)
- 🎯 Objectives (add / edit / reorder / remove)
- 📞 Contact info, bank details & social media links

The public site reads live from Supabase, and falls back to built-in sample content until the Supabase keys are configured. **Setup guide:** [`supabase/SETUP.md`](supabase/SETUP.md).

## 🛠 Tech Stack

Vite • React + TypeScript • Tailwind CSS v4 • React Router • react-i18next • Framer Motion • lucide-react • Supabase (database, auth, storage)

## 🚀 Getting Started

```bash
npm install
npm run dev      # start dev server
npm run build    # production build
npm run preview  # preview the build
```

## 🖼 अपना डेटा कैसे बदलें (How to update your content)

All content lives in easy-to-edit files under `src/`:

| क्या बदलना है | फ़ाइल |
| --- | --- |
| सदस्य + उनके चित्र (Members & photos) | `src/data/members.ts` |
| उद्देश्य (Objectives) | `src/data/objectives.ts` |
| गैलरी चित्र (Gallery images) | `src/data/gallery.ts` |
| फ़ोन, ईमेल, पता, बैंक विवरण | `src/data/trust.ts` |
| पेज के शब्द / अनुवाद (UI text) | `src/i18n/locales/hi.ts`, `src/i18n/locales/en.ts` |

### फ़ोटो जोड़ना (Adding photos)

1. अपनी तस्वीरें `public/` फ़ोल्डर में रखें (उदा. `public/members/ompal.jpg`, `public/gallery/yajna-1.jpg`).
2. संबंधित डेटा फ़ाइल में `photo` या `src` फ़ील्ड में पथ डालें, जैसे `photo: '/members/ompal.jpg'`.
3. जब तक असली फ़ोटो नहीं जुड़ती, सुंदर placeholder अपने-आप दिखेंगे।

## 📞 संपर्क

- **कार्यालय:** D-2 / 128, जीवन पार्क, उत्तम नगर, नई दिल्ली
- **फ़ोन:** 9312270686, 8920208536, 9718485590
- **ईमेल:** devarpan.trust@gmail.com 
