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
- 🖼️ Gallery photos
- 👥 Members
- 📅 Programs / Events (date, venue, photos, videos & status)
- 📝 Blogs
- 🎯 Objectives
- 📞 Contact info, bank details & social media links

Content changes appear on the live site instantly.

### 📹 About event videos
For each event you can either **paste a video link** (YouTube/Facebook — recommended, free and fast) **or upload a video file**.

If you upload video **files**, raise Supabase's upload size limit so larger files are accepted:
**Storage → Settings → "Upload file size limit"** → set it to e.g. `200 MB` and save. (The free plan allows up to ~1 GB of total storage, so prefer YouTube links for long videos.)

---

### For developers (local run)
Copy `.env.example` to `.env` and fill in the two values, then `npm install && npm run dev`.
