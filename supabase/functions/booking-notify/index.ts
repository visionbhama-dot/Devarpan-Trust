// Supabase Edge Function: booking-notify
// Sends an email when someone submits a booking request:
//   1. a notification to the Trust, and
//   2. a confirmation to the person who booked (if they gave an email).
//
// This is OPTIONAL. The website works without it — bookings are always saved
// to the database and visible in the admin panel. Deploy this only when you
// want automatic emails. See supabase/SETUP.md ("Booking emails") for steps.
//
// Uses Resend (https://resend.com) — free tier is enough for a trust.
//
// SECURITY NOTES:
//  - Keep JWT verification ON when deploying (the default). Do NOT pass
//    `--no-verify-jwt`. That makes Supabase require the project's anon key,
//    which blocks anonymous bots that don't have it.
//  - Optionally set a BOOKING_SECRET env var; if set, the caller must send a
//    matching `x-booking-secret` header (the website sends VITE_BOOKING_SECRET).
//  - All user input is HTML-escaped before being placed in the email body.

// deno-lint-ignore-file no-explicit-any
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''
// Where booking notifications are sent (the Trust inbox):
const TRUST_EMAIL = Deno.env.get('TRUST_EMAIL') ?? 'devarpan.trust@gmail.com'
// Verified sender. Use Resend's shared sender until you verify your domain:
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'Devarpan Trust <onboarding@resend.dev>'
// Optional shared secret. If set, requests must send a matching header.
const BOOKING_SECRET = Deno.env.get('BOOKING_SECRET') ?? ''

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-booking-secret',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

/** Escape user input so it can't inject markup into the email HTML. */
function esc(s: unknown): string {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** Very light sanity check on an email address. */
function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}

async function sendEmail(to: string, subject: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from: FROM_EMAIL, to, subject, html }),
  })
  if (!res.ok) throw new Error(`Resend error: ${res.status} ${await res.text()}`)
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })

  // Optional shared-secret gate
  if (BOOKING_SECRET && req.headers.get('x-booking-secret') !== BOOKING_SECRET) {
    return json({ ok: false, error: 'unauthorized' }, 401)
  }

  try {
    const b = await req.json()
    const name = esc(b.name)
    const occasion = esc(b.occasion)
    const date = esc(b.date)
    const phone = esc(b.phone)
    const emailRaw = String(b.email ?? '').trim()
    const email = esc(emailRaw)
    const address = esc(b.address)
    const message = esc(b.message)

    if (!RESEND_API_KEY) {
      return json({ ok: false, skipped: 'no RESEND_API_KEY' })
    }

    // 1) Notify the Trust
    await sendEmail(
      TRUST_EMAIL,
      `New booking request: ${occasion || 'Event'} — ${date}`,
      `<h2>New booking request</h2>
       <p><b>Name:</b> ${name}</p>
       <p><b>Occasion:</b> ${occasion}</p>
       <p><b>Date:</b> ${date}</p>
       <p><b>Phone:</b> ${phone}</p>
       <p><b>Email:</b> ${email}</p>
       <p><b>Address:</b> ${address}</p>
       <p><b>Message:</b> ${message || '—'}</p>`,
    )

    // 2) Confirm to the requester (only if a valid email was given)
    if (emailRaw && isEmail(emailRaw)) {
      await sendEmail(
        emailRaw,
        'We received your booking request — Devarpan Trust',
        `<p>Namaste ${name},</p>
         <p>We have received your booking request for <b>${occasion || 'your event'}</b> on <b>${date}</b>.</p>
         <p>Our team will contact you shortly on <b>${phone}</b> to confirm.</p>
         <p>With regards,<br/>Devarpan Trust</p>`,
      )
    }

    return json({ ok: true })
  } catch (err: any) {
    return json({ ok: false, error: String(err?.message ?? err) }, 500)
  }
})
