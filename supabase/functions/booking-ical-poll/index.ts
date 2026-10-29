/**
 * Poll Google Calendar (URL iCal secrète) → Meta Schedule (CAPI).
 * Contourne Apps Script (OAuth Google souvent bloqué sur Gmail perso).
 *
 * Secrets :
 *   GOOGLE_CALENDAR_ICAL_URL   — adresse secrète iCal
 *   META_PIXEL_ID              — 1157851050245521
 *   META_CAPI_ACCESS_TOKEN
 *   BOOKING_WEBHOOK_SECRET     — Bearer pour cron / appel manuel
 *   BOOKING_MY_EMAIL           — (optionnel) exclure des attendees
 *   BOOKING_TITLE_INCLUDE      — (optionnel) filtre titre
 *   BOOKING_LOOKBACK_MIN       — (optionnel) défaut 45
 *
 * Auth : Authorization: Bearer <BOOKING_WEBHOOK_SECRET>
 * Invoke toutes les 5–10 min (cron-job.org ou schedule Supabase).
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

type IcsEvent = {
  uid: string;
  summary: string;
  description: string;
  created: Date | null;
  attendees: string[];
};

async function sha256Hex(value: string): Promise<string> {
  const data = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, '');
}

function icsProp(block: string, name: string): string {
  const re = new RegExp(`(?:^|\\n)${name}(?:;[^:]*)?:([^\\n]*)`);
  const m = block.match(re);
  return m ? m[1].trim() : '';
}

function icsUnescape(s: string): string {
  return String(s || '')
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseIcsDate(s: string): Date | null {
  if (!s) return null;
  const m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?/);
  if (!m) return null;
  if (m[7] === 'Z') {
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  }
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

function icsAttendees(block: string): string[] {
  const emails: string[] = [];
  const re = /(?:^|\n)ATTENDEE[^:]*:([^\n]+)/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(block))) {
    const v = m[1].trim().replace(/^mailto:/i, '').toLowerCase();
    if (v.includes('@')) emails.push(v);
  }
  return emails;
}

function parseIcsEvents(raw: string): IcsEvent[] {
  const text = String(raw || '').replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  const blocks = text.split('BEGIN:VEVENT');
  const out: IcsEvent[] = [];
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i].split('END:VEVENT')[0];
    const uid = icsProp(block, 'UID');
    if (!uid) continue;
    out.push({
      uid,
      summary: icsUnescape(icsProp(block, 'SUMMARY')),
      description: icsUnescape(icsProp(block, 'DESCRIPTION')),
      created: parseIcsDate(icsProp(block, 'CREATED') || icsProp(block, 'DTSTAMP')),
      attendees: icsAttendees(block),
    });
  }
  return out;
}

function pickGuest(ev: IcsEvent, myEmail: string): string {
  for (const a of ev.attendees) {
    if (myEmail && a === myEmail) continue;
    return a;
  }
  const blob = `${ev.description} ${ev.summary}`;
  const m = blob.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (m) {
    const found = m[0].toLowerCase();
    if (!myEmail || found !== myEmail) return found;
  }
  return '';
}

function pickPhone(desc: string): string {
  const m = String(desc).match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return m ? m[0] : '';
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST' && req.method !== 'GET') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const secret = Deno.env.get('BOOKING_WEBHOOK_SECRET');
    const auth = req.headers.get('authorization') || '';
    if (!secret || auth !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const icalUrl = Deno.env.get('GOOGLE_CALENDAR_ICAL_URL');
    if (!icalUrl) {
      return new Response(JSON.stringify({ error: 'GOOGLE_CALENDAR_ICAL_URL missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const pixelId = Deno.env.get('META_PIXEL_ID') || '1157851050245521';
    const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'META_CAPI_ACCESS_TOKEN missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !serviceKey) {
      return new Response(JSON.stringify({ error: 'Supabase env missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const myEmail = (Deno.env.get('BOOKING_MY_EMAIL') || '').toLowerCase().trim();
    const titleFilter = (Deno.env.get('BOOKING_TITLE_INCLUDE') || '').trim().toLowerCase();
    const lookback = Math.max(5, parseInt(Deno.env.get('BOOKING_LOOKBACK_MIN') || '45', 10) || 45);
    const createdAfter = Date.now() - lookback * 60 * 1000;

    const icalRes = await fetch(icalUrl, { redirect: 'follow' });
    if (!icalRes.ok) {
      return new Response(
        JSON.stringify({ error: 'ICAL fetch failed', status: icalRes.status }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }
    const events = parseIcsEvents(await icalRes.text());
    const db = createClient(supabaseUrl, serviceKey);

    const { count: existingCount, error: countErr } = await db
      .from('booking_ical_events')
      .select('uid', { count: 'exact', head: true });
    if (countErr) {
      console.error(countErr);
      return new Response(JSON.stringify({ error: 'DB count failed', detail: countErr.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const bootstrap = !existingCount || existingCount === 0;
    let bootstrapped = 0;
    let sent = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const ev of events) {
      const { data: row } = await db
        .from('booking_ical_events')
        .select('uid, meta_schedule_sent_at')
        .eq('uid', ev.uid)
        .maybeSingle();

      if (row?.meta_schedule_sent_at) {
        skipped++;
        continue;
      }
      if (row && !bootstrap) {
        skipped++;
        continue;
      }

      if (bootstrap) {
        const { error } = await db.from('booking_ical_events').upsert({
          uid: ev.uid,
          summary: ev.summary || null,
          guest_email: pickGuest(ev, myEmail) || null,
          created_at_event: ev.created?.toISOString() || null,
          skipped_bootstrap: true,
        });
        if (error) errors.push(`bootstrap ${ev.uid}: ${error.message}`);
        else bootstrapped++;
        continue;
      }

      const createdMs = ev.created?.getTime() || 0;
      if (!createdMs || createdMs < createdAfter) {
        await db.from('booking_ical_events').upsert({
          uid: ev.uid,
          summary: ev.summary || null,
          guest_email: pickGuest(ev, myEmail) || null,
          created_at_event: ev.created?.toISOString() || null,
          skipped_bootstrap: false,
        });
        skipped++;
        continue;
      }

      const title = ev.summary || '';
      if (titleFilter && !title.toLowerCase().includes(titleFilter)) {
        await db.from('booking_ical_events').upsert({
          uid: ev.uid,
          summary: title || null,
          guest_email: pickGuest(ev, myEmail) || null,
          created_at_event: ev.created?.toISOString() || null,
        });
        skipped++;
        continue;
      }

      const guest = pickGuest(ev, myEmail);
      const phoneRaw = pickPhone(ev.description || '');
      const eventId = `gcal_${ev.uid.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80)}`;

      const userData: Record<string, string | string[]> = {};
      if (guest) userData.em = [await sha256Hex(normalizeEmail(guest))];
      if (phoneRaw) {
        const digits = normalizePhone(phoneRaw);
        if (digits) userData.ph = [await sha256Hex(digits)];
      }

      const metaEvent = {
        event_name: 'Schedule',
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        action_source: 'website',
        event_source_url: 'https://www.pierreoliviercaouette.ca/rendez-vous',
        user_data: userData,
        custom_data: {
          content_name: title || 'google_calendar_booking',
          content_category: 'appointment',
          status: true,
        },
      };

      const metaRes = await fetch(
        `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ data: [metaEvent] }),
        }
      );
      const metaJson = await metaRes.json().catch(() => ({}));
      if (!metaRes.ok) {
        errors.push(`meta ${ev.uid}: ${JSON.stringify(metaJson)}`);
        continue;
      }

      const { error: upErr } = await db.from('booking_ical_events').upsert({
        uid: ev.uid,
        summary: title || null,
        guest_email: guest || null,
        created_at_event: ev.created?.toISOString() || null,
        meta_schedule_sent_at: new Date().toISOString(),
        meta_event_id: eventId,
        skipped_bootstrap: false,
      });
      if (upErr) errors.push(`save ${ev.uid}: ${upErr.message}`);
      else sent++;
    }

    return new Response(
      JSON.stringify({
        ok: true,
        bootstrap,
        events_in_feed: events.length,
        bootstrapped,
        sent,
        skipped,
        errors: errors.length ? errors : undefined,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
