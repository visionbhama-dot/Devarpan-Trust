-- ============================================================
--  देवार्पण ट्रस्ट — Remove duplicate rows (run ONCE)
--
--  Why: earlier versions of schema.sql re-inserted the seed data
--  every time it was run, because these tables use a random UUID id
--  (so "on conflict do nothing" never matched). This script keeps the
--  EARLIEST copy of each identical entry and deletes the rest.
--
--  Safe: it only removes exact duplicates. Rows you added or edited in
--  the admin panel (which differ in content) are kept.
--
--  How to run: Supabase Dashboard → SQL Editor → New query → paste all →
--  Run. You can run it again any time; after the first run it does nothing.
-- ============================================================

-- Members
delete from public.members t using (
  select id, row_number() over (
    partition by name_hi, name_en, role_hi, role_en, coalesce(photo_url, '')
    order by created_at, id
  ) as rn
  from public.members
) d
where t.id = d.id and d.rn > 1;

-- Gallery
delete from public.gallery t using (
  select id, row_number() over (
    partition by category, caption_hi, caption_en, image_url
    order by created_at, id
  ) as rn
  from public.gallery
) d
where t.id = d.id and d.rn > 1;

-- Objectives
delete from public.objectives t using (
  select id, row_number() over (
    partition by num, text_hi, text_en
    order by created_at, id
  ) as rn
  from public.objectives
) d
where t.id = d.id and d.rn > 1;

-- Programs
delete from public.programs t using (
  select id, row_number() over (
    partition by title_hi, title_en, coalesce(event_date::text, ''), status
    order by created_at, id
  ) as rn
  from public.programs
) d
where t.id = d.id and d.rn > 1;

-- Activities
delete from public.activities t using (
  select id, row_number() over (
    partition by text_hi, text_en, coalesce(date::text, '')
    order by created_at, id
  ) as rn
  from public.activities
) d
where t.id = d.id and d.rn > 1;

-- Optional: see the remaining counts
-- select 'members' as t, count(*) from public.members
-- union all select 'gallery', count(*) from public.gallery
-- union all select 'objectives', count(*) from public.objectives
-- union all select 'programs', count(*) from public.programs
-- union all select 'activities', count(*) from public.activities;
