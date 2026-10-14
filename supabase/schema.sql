-- ============================================================
--  देवार्पण ट्रस्ट — Supabase schema, security, storage & seed
--  Run this whole file in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

create extension if not exists "pgcrypto";

-- ---------- TABLES ----------

create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  category text not null default 'events',
  caption_hi text not null default '',
  caption_en text not null default '',
  image_url text not null,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.members (
  id uuid primary key default gen_random_uuid(),
  name_hi text not null,
  name_en text not null default '',
  role_hi text not null default '',
  role_en text not null default '',
  photo_url text,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.objectives (
  id uuid primary key default gen_random_uuid(),
  num text not null default '',
  text_hi text not null,
  text_en text not null default '',
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title_hi text not null,
  title_en text not null default '',
  excerpt_hi text default '',
  excerpt_en text default '',
  content_hi text default '',
  content_en text default '',
  cover_url text,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  title_hi text not null,
  title_en text not null default '',
  description_hi text default '',
  description_en text default '',
  location_hi text default '',
  location_en text default '',
  event_date date,
  image_url text,
  images jsonb not null default '[]'::jsonb,  -- extra photo URLs: ["url1","url2"]
  videos jsonb not null default '[]'::jsonb,  -- [{ "kind": "link"|"file", "url": "..." }]
  status text not null default 'upcoming',  -- 'upcoming' | 'completed'
  sort int not null default 0,
  created_at timestamptz not null default now()
);

-- Add the photo/video columns to any existing programs table (safe to re-run)
alter table public.programs add column if not exists images jsonb not null default '[]'::jsonb;
alter table public.programs add column if not exists videos jsonb not null default '[]'::jsonb;

-- Extra program fields: featured flag, end date and a free-text timing
alter table public.programs add column if not exists featured boolean not null default false;
alter table public.programs add column if not exists end_date date;
alter table public.programs add column if not exists time_text_hi text default '';
alter table public.programs add column if not exists time_text_en text default '';

-- Rotating hero banners for the home page
create table if not exists public.banners (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  title_hi text default '',
  title_en text default '',
  subtitle_hi text default '',
  subtitle_en text default '',
  link text,
  fit text not null default 'cover',   -- 'cover' (photo) | 'contain' (full poster)
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  text_hi text not null,
  text_en text not null default '',
  date date,
  image_url text,
  link text,
  active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id text primary key default 'site',
  phones jsonb not null default '[]'::jsonb,
  email text default '',
  address_hi text default '',
  address_en text default '',
  bank jsonb not null default '{}'::jsonb,     -- { pan, account, ifsc }
  socials jsonb not null default '{}'::jsonb    -- { facebook, instagram, youtube, twitter, whatsapp }
);

-- ---------- ROW LEVEL SECURITY ----------

alter table public.gallery    enable row level security;
alter table public.members    enable row level security;
alter table public.objectives enable row level security;
alter table public.blogs      enable row level security;
alter table public.programs   enable row level security;
alter table public.activities enable row level security;
alter table public.banners    enable row level security;
alter table public.settings   enable row level security;

-- Public (anon) can READ everything except unpublished blogs
drop policy if exists "read gallery"    on public.gallery;
drop policy if exists "read members"    on public.members;
drop policy if exists "read objectives" on public.objectives;
drop policy if exists "read programs"   on public.programs;
drop policy if exists "read activities" on public.activities;
drop policy if exists "read banners"    on public.banners;
drop policy if exists "read settings"   on public.settings;
create policy "read gallery"    on public.gallery    for select using (true);
create policy "read members"    on public.members    for select using (true);
create policy "read objectives" on public.objectives for select using (true);
create policy "read programs"   on public.programs   for select using (true);
create policy "read activities" on public.activities for select using (true);
create policy "read banners"    on public.banners    for select using (true);
create policy "read settings"   on public.settings   for select using (true);

drop policy if exists "read published blogs" on public.blogs;
drop policy if exists "auth read all blogs"  on public.blogs;
create policy "read published blogs" on public.blogs for select using (published = true);
create policy "auth read all blogs"  on public.blogs for select to authenticated using (true);

-- Logged-in admins can WRITE everything
drop policy if exists "write gallery"    on public.gallery;
drop policy if exists "write members"    on public.members;
drop policy if exists "write objectives" on public.objectives;
drop policy if exists "write blogs"      on public.blogs;
drop policy if exists "write programs"   on public.programs;
drop policy if exists "write activities" on public.activities;
drop policy if exists "write banners"    on public.banners;
drop policy if exists "write settings"   on public.settings;
create policy "write gallery"    on public.gallery    for all to authenticated using (true) with check (true);
create policy "write members"    on public.members    for all to authenticated using (true) with check (true);
create policy "write objectives" on public.objectives for all to authenticated using (true) with check (true);
create policy "write blogs"      on public.blogs      for all to authenticated using (true) with check (true);
create policy "write programs"   on public.programs   for all to authenticated using (true) with check (true);
create policy "write activities" on public.activities for all to authenticated using (true) with check (true);
create policy "write banners"    on public.banners    for all to authenticated using (true) with check (true);
create policy "write settings"   on public.settings   for all to authenticated using (true) with check (true);

-- ---------- STORAGE BUCKETS ----------

insert into storage.buckets (id, name, public) values
  ('gallery',    'gallery',    true),
  ('members',    'members',    true),
  ('blogs',      'blogs',      true),
  ('programs',   'programs',   true),
  ('activities', 'activities', true),
  ('banners',    'banners',    true)
on conflict (id) do nothing;

drop policy if exists "public read media"  on storage.objects;
drop policy if exists "auth upload media"  on storage.objects;
drop policy if exists "auth update media"  on storage.objects;
drop policy if exists "auth delete media"  on storage.objects;
create policy "public read media" on storage.objects for select
  using (bucket_id in ('gallery','members','blogs','programs','activities','banners'));
create policy "auth upload media" on storage.objects for insert to authenticated
  with check (bucket_id in ('gallery','members','blogs','programs','activities','banners'));
create policy "auth update media" on storage.objects for update to authenticated
  using (bucket_id in ('gallery','members','blogs','programs','activities','banners'));
create policy "auth delete media" on storage.objects for delete to authenticated
  using (bucket_id in ('gallery','members','blogs','programs','activities','banners'));

-- ============================================================
--  SEED DATA (current website content) — run once
-- ============================================================

-- Settings (single row)
insert into public.settings (id, phones, email, address_hi, address_en, bank, socials)
values (
  'site',
  '["9312270686","8920208536","9718485590"]'::jsonb,
  'devarpan.trust@gmail.com',
  'D-2 / 128, जीवन पार्क, उत्तम नगर, नई दिल्ली - 110059',
  'D-2 / 128, Jeevan Park, Uttam Nagar, New Delhi - 110059',
  '{"pan":"AAETD8306C","account":"052222010003814","ifsc":"UBIN0905224"}'::jsonb,
  '{"facebook":"https://www.facebook.com/share/1DVVYobnxn/","instagram":"","youtube":"","twitter":"","whatsapp":"9312270686"}'::jsonb
)
on conflict (id) do nothing;

-- Objectives (only seeded when the table is empty — safe to re-run)
insert into public.objectives (num, text_hi, text_en, sort)
select * from (values
('i','यज्ञ, योग एवं संस्कार के लिए प्रयत्नशील रहना इसका मुख्य उद्देश्य है।','To remain devoted to Yajna, Yoga and Sanskar (values) is its principal objective.',1),
('ii','यज्ञों की वैज्ञानिकता को समाज के सामने प्रतिष्ठित करना तथा इसके निमित्त विभिन्न आयोजन आयोजित करना।','To establish the scientific basis of Yajnas before society and to organise various events towards this purpose.',2),
('iii','मानव-मात्र को भौतिक वातावरण में प्रदूषित जीवनशैली से उत्पन्न अवसादों से बचाने, बाल एवं युवा पीढ़ी को संस्कारों के महत्व से अवगत कराने के लिए प्रयत्नशील रहना तथा इससे सम्बन्धित शिविरों व विभिन्न कार्यक्रमों का आयोजन करना एवं करवाना।','To strive to protect humankind from the depressions caused by a polluted lifestyle, to make the young generation aware of the importance of values, and to organise related camps and programs.',3),
('iv','अन्तर्राष्ट्रीय योग दिवस के महत्व को जनमानस में जागरुक कराते हुए योग के महत्व को प्रतिष्ठित करना तथा इससे सम्बन्धित शिविरों व विभिन्न कार्यक्रमों का आयोजन करना व करवाना।','To create public awareness of International Yoga Day, establish the importance of Yoga, and organise related camps and programs.',4),
('v','अध्ययनशील मेधावी, निर्धन, असहाय एवं जरूरतमंद बच्चों की शिक्षा और स्वास्थ्य के लिए सहयोग करना व करवाना।','To provide support for the education and health of studious, meritorious, poor, helpless and needy children.',5),
('vi','महिलाओं के जीवनस्तर को उज्ज्वल बनाने के लिए सिलाई, कढ़ाई, बुनायी आदि सेवा केन्द्रों की स्थापना करना एवं संचालन करना।','To establish and run service centres for stitching, embroidery and knitting to uplift the standard of living of women.',6),
('vii','जातीय-धर्मीय विषमताओं को दूर करने के लिए वैवाहिक अवस्था को प्राप्त निर्धन कन्याओं के विवाह समारोह में सहायता प्रदान करना व करवाना।','To provide assistance in the wedding ceremonies of poor girls, in order to remove caste and religious disparities.',7),
('viii','ट्रस्ट के उद्देश्यों को केन्द्र में रखकर प्रतियोगिताओं का आयोजन, विभिन्न आयोजनों पर पुरस्कार तथा अभिनन्दन समारोह का आयोजन, पुस्तक व पत्र-पत्रिकाओं का प्रकाशन करना व करवाना।','To organise competitions, award and felicitation ceremonies, and to publish books and periodicals in line with the Trust’s objectives.',8),
('ix','ट्रस्ट के उद्देश्यों की पूर्ति के लिए दान, अनुदान, केन्द्र सरकार, राज्य-सरकार, संस्था/संस्थाओं, व्यक्ति/व्यक्तियों आदि से सहयोग प्राप्त करना।','To obtain support through donations and grants from the Central Government, State Government, institutions and individuals.',9),
('x','सार्वजनिक हित के लिए संपत्ति अर्जित करना जैसे क्लिनिक, डायग्नोस्टिक सेंटर, केमिस्ट स्टोर, फिजियोथेरेपी सेंटर इत्यादि और इसे प्रशिक्षण सत्रों, सेमिनारों और अन्य सार्वजनिक कार्यों के लिए जनता के लिए उपलब्ध कराना।','To acquire property for public welfare such as a clinic, diagnostic centre, chemist store or physiotherapy centre, and make it available to the public.',10),
('xi','समाज के उत्थान और बेहतरी में शामिल अन्य संगठनों को सहायता/दान देना, जिसमें कोई भी एनजीओ शामिल है जो ऊपर उल्लिखित उद्देश्यों को पूरा कर रहा है।','To give assistance or donations to other organisations, including any NGO fulfilling the aforementioned objectives.',11)
) as v(num, text_hi, text_en, sort)
where not exists (select 1 from public.objectives);

-- Members (only seeded when the table is empty — safe to re-run)
insert into public.members (name_hi, name_en, role_hi, role_en, photo_url, sort)
select * from (values
('श्री ओमपाल सिंह आर्य','Shri Ompal Singh Arya','अध्यक्ष','President','/members/ompal.jpg',1),
('श्री रमेशचंद्र आर्य','Shri Rameshchandra Arya','महासचिव','General Secretary','/members/ramesh.jpg',2),
('श्रीमती नीरज कुमारी','Smt. Neeraj Kumari','कोषाध्यक्ष','Treasurer','/members/neeraj.jpg',3),
('आचार्य डॉ. धनंजय आर्य','Acharya Dr. Dhananjay Arya','प्रस्तोता','Proposer','/members/dhananjay.jpg',4),
('श्री देवेन्द्र कुमार','Shri Devendra Kumar','ट्रस्टी','Trustee','/members/devendra.jpg',5),
('श्री रामेश्वर दयाल गुप्ता','Shri Rameshwar Dayal Gupta','ट्रस्टी','Trustee','/members/rameshwar.jpg',6),
('श्री अर्जुन कुमार','Shri Arjun Kumar','ट्रस्टी','Trustee','/members/arjun.jpg',7)
) as v(name_hi, name_en, role_hi, role_en, photo_url, sort)
where not exists (select 1 from public.members);

-- Gallery (existing photos served from the site’s /gallery folder)
insert into public.gallery (category, caption_hi, caption_en, image_url, sort)
select * from (values
('yajna','सामूहिक यज्ञ (हवन)','Community Yajna (Havan)','/gallery/g04-yajna.jpg',1),
('yajna','यज्ञ एवं बाल अभिनन्दन','Yajna & Children’s Felicitation','/gallery/g06-yajna-bal.jpg',2),
('yajna','सत्संग एवं यज्ञ सभा','Satsang & Yajna Gathering','/gallery/g08-satsang-yajna.jpg',3),
('yoga','बाल योग एवं ध्यान शिविर','Children’s Yoga & Meditation Camp','/gallery/g01-bal-yoga.jpg',4),
('yoga','योग एवं संस्कार प्रतिभागी','Yoga & Sanskar Participants','/gallery/g03-yoga-sanskar.jpg',5),
('education','बच्चों को शिक्षण सामग्री वितरण','Distribution of Study Material to Children','/gallery/g02-shiksha-vitran.jpg',6),
('events','विद्यार्थी अभिनन्दन समारोह','Student Felicitation Ceremony','/gallery/g05-vidyarthi-abhinandan.jpg',7),
('events','मेधावी छात्रा सम्मान','Meritorious Student Honour','/gallery/g07-medhavi-chatra.jpg',8),
('events','वरिष्ठजन सम्मान','Honouring of Elders','/gallery/g09-varishthjan-samman.jpg',9),
('events','सम्मान एवं सहयोग समारोह','Felicitation & Support Ceremony','/gallery/g10-samman-samaroh.jpg',10),
('women','महिला सम्मान समारोह','Women’s Felicitation Ceremony','/gallery/g11-mahila-samman.jpg',11)
) as v(category, caption_hi, caption_en, image_url, sort)
where not exists (select 1 from public.gallery);

-- Sample blog post
insert into public.blogs (slug, title_hi, title_en, excerpt_hi, excerpt_en, content_hi, content_en, published, published_at)
values (
  'welcome',
  'देवार्पण ट्रस्ट के ब्लॉग में आपका स्वागत है',
  'Welcome to the Devarpan Trust Blog',
  'हमारे आयोजनों, यज्ञों एवं सामाजिक कार्यों की जानकारी यहाँ साझा की जाएगी।',
  'Updates about our events, Yajnas and social work will be shared here.',
  'यह हमारा पहला ब्लॉग है। शीघ्र ही हम अपने कार्यक्रमों की विस्तृत जानकारी यहाँ प्रकाशित करेंगे।',
  'This is our first blog post. We will soon publish detailed updates about our programs here.',
  true,
  now()
) on conflict (slug) do nothing;

-- Programs / Events (only seeded when the table is empty — safe to re-run)
insert into public.programs (title_hi, title_en, description_hi, description_en, location_hi, location_en, event_date, image_url, status, sort)
select * from (values
(
  'अन्तर्राष्ट्रीय योग दिवस शिविर',
  'International Yoga Day Camp',
  'सभी आयु वर्ग के लिए निःशुल्क योग एवं ध्यान शिविर। पंजीकरण हेतु संपर्क करें।',
  'A free yoga and meditation camp for all age groups. Contact us to register.',
  'जीवन पार्क, उत्तम नगर, नई दिल्ली',
  'Jeevan Park, Uttam Nagar, New Delhi',
  '2026-06-21'::date,
  '/gallery/g01-bal-yoga.jpg',
  'upcoming',
  1
),
(
  'मेधावी छात्र सम्मान समारोह',
  'Meritorious Student Felicitation',
  'क्षेत्र के मेधावी एवं निर्धन विद्यार्थियों को प्रोत्साहन एवं शिक्षण सामग्री वितरण।',
  'Encouragement and distribution of study material to meritorious and needy students of the area.',
  'उत्तम नगर, नई दिल्ली',
  'Uttam Nagar, New Delhi',
  '2025-11-14'::date,
  '/gallery/g07-medhavi-chatra.jpg',
  'completed',
  2
)
) as v(title_hi, title_en, description_hi, description_en, location_hi, location_en, event_date, image_url, status, sort)
where not exists (select 1 from public.programs);

-- Recent activities (only seeded when the table is empty — safe to re-run)
insert into public.activities (text_hi, text_en, date, image_url, link, active, sort)
select * from (values
('उत्तम नगर में सामूहिक यज्ञ का सफल आयोजन सम्पन्न हुआ।', 'A community Yajna was successfully held at Uttam Nagar.', '2025-10-05'::date, '/gallery/g04-yajna.jpg', '/programs', true, 1),
('50 निर्धन विद्यार्थियों को शिक्षण सामग्री वितरित की गई।', 'Study material was distributed to 50 needy students.', '2025-09-20'::date, '/gallery/g02-shiksha-vitran.jpg', '/gallery', true, 2),
('अन्तर्राष्ट्रीय योग दिवस शिविर हेतु पंजीकरण प्रारम्भ।', 'Registration has opened for the International Yoga Day camp.', '2026-05-15'::date, '/gallery/g01-bal-yoga.jpg', '/programs', true, 3)
) as v(text_hi, text_en, date, image_url, link, active, sort)
where not exists (select 1 from public.activities);

-- Home page hero banners (only seeded when the table is empty — safe to re-run)
insert into public.banners (image_url, title_hi, title_en, subtitle_hi, subtitle_en, link, fit, active, sort)
select * from (values
(
  '/gallery/g04-yajna.jpg',
  'यज्ञ, योग एवं संस्कार',
  'Yajna, Yoga & Sanskar',
  'श्रद्धा से प्रज्वलित संकल्प — देवार्पण ट्रस्ट',
  'A resolve kindled by devotion — Devarpan Trust',
  '/objectives', 'cover', true, 1
),
(
  '/gallery/g01-bal-yoga.jpg',
  'बाल योग एवं ध्यान शिविर',
  'Children''s Yoga & Meditation Camps',
  'स्वस्थ शरीर, एकाग्र मन एवं संस्कारित जीवन की ओर',
  'Towards a healthy body, focused mind and a life of values',
  '/programs', 'cover', true, 2
),
(
  '/gallery/g10-samman-samaroh.jpg',
  'सम्मान एवं सहयोग समारोह',
  'Felicitation & Support Ceremonies',
  'शिक्षा, स्वास्थ्य एवं महिला सशक्तिकरण हेतु निरंतर प्रयास',
  'Continuous efforts for education, health and women empowerment',
  '/gallery', 'cover', true, 3
)
) as v(image_url, title_hi, title_en, subtitle_hi, subtitle_en, link, fit, active, sort)
where not exists (select 1 from public.banners);

-- ============================================================
--  तृतीय गायत्री यज्ञ (शारदीय नवरात्रि) — featured event
--  Inserted only if this event is not already present, so it is
--  added even when the programs table already has other rows.
--  👉 Upload the real poster via Admin → Programs → Edit → image.
-- ============================================================
insert into public.programs (
  title_hi, title_en, description_hi, description_en,
  location_hi, location_en, event_date, end_date,
  time_text_hi, time_text_en, image_url, status, featured, sort
)
select
  'शारदीय नवरात्रि में गायत्री यज्ञ',
  'Gayatri Yajna during Shardiya Navratri',
  E'आप सभी सादर आमंत्रित हैं अपने इस तृतीय गायत्री यज्ञ में। परिवार सहित बच्चों को साथ लेकर पधारें।\n\nवेद बचेंगे तो संस्कार बचेंगे, संस्कार बचेंगे तो संस्कृति बचेगी।\n\n11 अक्टूबर 2026 से ये कार्यक्रम प्रारम्भ हो रहा है तथा रामनवमी पर पूर्णाहुति होगी।\n\nअनेक विद्वानों का मार्गदर्शन प्राप्त होगा। यज्ञ में पवित्र आहुति प्रदान कर अपने जीवन को सफल बनाएं।\n\nअध्यक्ष — ओमपाल सिंह आर्य',
  E'You are all cordially invited to our third Gayatri Yajna. Please come along with your family and children.\n\nIf the Vedas are preserved, values will be preserved; if values are preserved, our culture will endure.\n\nThe program begins on 11 October 2026 and the concluding offering (Purnahuti) will be held on Ram Navami.\n\nGuidance from many learned scholars will be received. Make your life fulfilling by offering a sacred oblation in the Yajna.\n\nPresident — Ompal Singh Arya',
  'जन्मेजय पार्क, सोम बाजार रोड (समीप पावर हाउस)',
  'Janmejay Park, Som Bazar Road (near Power House)',
  '2026-10-11'::date,
  '2026-10-19'::date,
  'सांयं 4:00 से 5:15 तक',
  'Evening 4:00 PM to 5:15 PM',
  '/gallery/g04-yajna.jpg',
  'upcoming',
  true,
  0
where not exists (
  select 1 from public.programs where title_hi = 'शारदीय नवरात्रि में गायत्री यज्ञ'
);
