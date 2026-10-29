/**
 * Conversion Meta « Schedule » quand un RDV Outlook Bookings est créé.
 *
 * Pourquoi : l’iframe outlook.office.com est cross-origin — le site ne peut
 * PAS détecter la confirmation. On écoute plutôt la création côté Microsoft
 * (Power Automate) et on envoie l’événement serveur (Conversions API).
 *
 * Secrets (Supabase → Edge Functions → Secrets) :
 *   META_PIXEL_ID              — 3777221109164370
 *   META_CAPI_ACCESS_TOKEN     — Events Manager → Pixel → Settings → Generate access token
 *   BOOKING_WEBHOOK_SECRET     — même valeur que Bearer dans Power Automate
 *
 * Voir : outlook-booking-meta-setup.txt
 */

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
  // Digits only; Meta prefers E.164 — on envoie au mieux ce qu’on a
  return phone.replace(/\D/g, '');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
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

    const pixelId = Deno.env.get('META_PIXEL_ID') || '3777221109164370';
    const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');
    if (!accessToken) {
      console.error('Missing META_CAPI_ACCESS_TOKEN');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const raw = (await req.json()) as Record<string, unknown>;
    // Power Automate / Bookings : noms de champs variables
    const pick = (...keys: string[]) => {
      for (const k of keys) {
        const v = raw[k];
        if (v != null && String(v).trim() !== '') return String(v);
      }
      return '';
    };

    const emailRaw = pick(
      'customer_email',
      'email',
      'CustomerEmail',
      'customerEmail',
      'Email'
    );
    const phoneRaw = pick(
      'customer_phone',
      'phone',
      'CustomerPhone',
      'customerPhone',
      'Phone'
    );
    const serviceName = pick(
      'service_name',
      'ServiceName',
      'serviceName',
      'Service'
    );
    const eventId =
      pick('appointment_id', 'id', 'Id', 'appointmentId', 'AppointmentId') ||
      `booking_${Date.now()}`;
    const source = pick('source') || 'power_automate';

    const userData: Record<string, string | string[]> = {};
    if (emailRaw) {
      userData.em = [await sha256Hex(normalizeEmail(emailRaw))];
    }
    if (phoneRaw) {
      const digits = normalizePhone(phoneRaw);
      if (digits) userData.ph = [await sha256Hex(digits)];
    }

    const event = {
      event_name: 'Schedule',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'website',
      event_source_url: 'https://www.pierreoliviercaouette.ca/rendez-vous',
      user_data: userData,
      custom_data: {
        content_name: serviceName || 'outlook_bookings',
        content_category: 'appointment',
        status: true,
      },
    };

    const metaRes = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: [event],
          // Partner agent optional
        }),
      }
    );

    const metaJson = await metaRes.json().catch(() => ({}));
    if (!metaRes.ok) {
      console.error('Meta CAPI error', metaRes.status, metaJson);
      return new Response(
        JSON.stringify({ error: 'Meta CAPI failed', detail: metaJson }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        ok: true,
        event_id: eventId,
        meta: metaJson,
        source,
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
