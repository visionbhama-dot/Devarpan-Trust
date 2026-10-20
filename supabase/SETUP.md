# देवार्पण ट्रस्ट — Admin Panel Setup (Supabase)

Follow these one-time steps to power the admin panel. It's all free.

## 1. Create a Supabase project
1. Go to **https://supabase.com** → sign up / log in.
2. Click **New project**. Give it a name (e.g. `devarpan-trust`), choose a region close to India (e.g. *South Asia (Mumbai)*), set a database password (save it), and create.

## 2. Run the database script
1. In your project, open **SQL Editor** (left sidebar) → **New query**.
2. Open the file `supabase/schema.sql` from this repo, copy **everything**, paste it into the editor, and click **Run**.
3. This creates all tables, security rules, storage buckets, and fills in your current content.

## 3. Create your admin login
1. Go to **Authentication → Users → Add user → Create new user**.
2. Enter the **email** and **password** you want to log in with. Tick **Auto Confirm User**.
3. (Recommended) Under **Authentication → Providers → Email**, turn **OFF** "Allow new users to sign up", so only you can log in.

## 4. Get your keys
1. Go to **Project Settings → API**.
2. Copy the **Project URL** and the **anon public** key.
3. Send both to me — I'll plug them in. They're safe to share (protected by the security rules from step 2).

## 5. Done!
Once the keys are in, visit **/admin** on the website, log in, and you can manage:
- 🎞️ Home Banners (the rotating banner at the top of the home page)
- 🖼️ Gallery photos
- 👥 Members
- 📅 Programs / Events (date, venue, photos, videos & status)
- 🗓️ Bookings (mark dates booked/red, and manage booking requests)
- 📝 Blogs
- 🎯 Objectives
- 📞 Contact info, bank details & social media links

Content changes appear on the live site instantly.

### 📹 About event videos
For each event you can either **paste a video link** (YouTube/Facebook — recommended, free and fast) **or upload a video file**.

If you upload video **files**, raise Supabase's upload size limit so larger files are accepted:
**Storage → Settings → "Upload file size limit"** → set it to e.g. `200 MB` and save. (The free plan allows up to ~1 GB of total storage, so prefer YouTube links for long videos.)

---

### ⚠️ Seeing duplicate content (members/photos/events listed 2–3 times)?
This happened if an older `schema.sql` was run more than once. Fix it in one step:
1. Open **SQL Editor → New query**.
2. Paste all of **`supabase/cleanup-duplicates.sql`** and click **Run**.

It keeps one copy of each identical entry and removes the extras. The current `schema.sql` is now safe to re-run — the seed data only loads when a table is empty, so it will never duplicate again.

### 📅 How the booking calendar works
- On **/booking**, every future date is shown **green (available)** by default.
- In **Admin → Bookings**, add a date under *"Blocked / booked dates"* to make it **red (not available)** on the public calendar — e.g. mark a date as booked for a Hawan.
- When a visitor submits the form, it appears under *"Booking requests"* with their phone, email and address. Click **Confirm & block date** to accept (this also turns that date red automatically), or **Cancel**.
- Booking submissions are private: only the logged-in admin can read them.

### ✉️ Booking emails (optional)
The website itself cannot send email (it has no server), so by default you just see new bookings in the admin panel and contact the person. To also send **automatic emails** (a notification to the Trust + a confirmation to the visitor), deploy the included function:

1. Create a free account at **https://resend.com** and copy an **API key**. (To send from your own address, verify your domain in Resend; otherwise it uses `onboarding@resend.dev`.)
2. In Supabase → **Edge Functions**, deploy the function in `supabase/functions/booking-notify/` (via the Supabase CLI `supabase functions deploy booking-notify`, or paste it into a new function in the dashboard).
3. In Supabase → **Edge Functions → booking-notify → Settings → Secrets**, add:
   - `RESEND_API_KEY` = your Resend key
   - `TRUST_EMAIL` = the inbox that should receive bookings (e.g. `devarpan.trust@gmail.com`)
   - `FROM_EMAIL` = e.g. `Devarpan Trust <onboarding@resend.dev>` (or your verified domain address)

That's it — the booking form already calls this function automatically. If it isn't deployed, the form still works; it just skips the email step.

**Keep it safe:** deploy with JWT verification **on** (the default — don't pass `--no-verify-jwt`), so only callers with your project's key reach it. For an extra layer, set a `BOOKING_SECRET` secret on the function *and* a matching `VITE_BOOKING_SECRET` env var on Vercel — the site will send it as a header and the function will reject anyone else. All submitted text is HTML-escaped before it goes into the email.

### For developers (local run)
Copy `.env.example` to `.env` and fill in the two values, then `npm install && npm run dev`.
