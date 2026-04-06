/**
 * Notification par courriel lors d’un nouveau message du formulaire contact.
 *
 * Déploiement : Supabase Dashboard → Edge Functions → déployer ce dossier,
 * ou `supabase functions deploy send-contact-email`
 *
 * Secrets (Dashboard → Project Settings → Edge Functions → Secrets) :
 *   RESEND_API_KEY       — clé API Resend (https://resend.com)
 *   CONTACT_TO_EMAIL     — votre courriel pro (ex. p-o.caouette@agc.ia.ca)
 *   RESEND_FROM          — expéditeur (domaine vérifié chez Resend), ex. "Site <contact@votredomaine.ca>"
 *   CONTACT_WEBHOOK_SECRET — même valeur que l’en-tête Authorization du Database Webhook (voir contact-email-webhook.txt)
 *
 * Puis : Database → Webhooks → New → table contact_submissions → INSERT → URL de cette function
 *         + Header: Authorization: Bearer <CONTACT_WEBHOOK_SECRET>
 */

const corsHeaders: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactRecord {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  subject?: string;
  message?: string;
  referral_code?: string | null;
  created_at?: string;
}

interface DbWebhookBody {
  type?: string;
  table?: string;
  record?: ContactRecord;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const secret = Deno.env.get('CONTACT_WEBHOOK_SECRET');
    const auth = req.headers.get('authorization') || '';
    if (!secret || auth !== `Bearer ${secret}`) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const resendKey = Deno.env.get('RESEND_API_KEY');
    const toEmail = Deno.env.get('CONTACT_TO_EMAIL');
    const fromEmail =
      Deno.env.get('RESEND_FROM') ||
      'Pierre-Olivier Caouette <onboarding@resend.dev>';

    if (!resendKey || !toEmail) {
      console.error('Missing RESEND_API_KEY or CONTACT_TO_EMAIL');
      return new Response(JSON.stringify({ error: 'Server misconfigured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as DbWebhookBody;
    const r = body.record;
    if (!r || !r.name || !r.email || !r.subject || !r.message) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const html = `
      <h2>Nouveau message — formulaire du site</h2>
      <p><strong>Nom :</strong> ${escapeHtml(r.name)}</p>
      <p><strong>Courriel :</strong> <a href="mailto:${escapeHtml(r.email)}">${escapeHtml(r.email)}</a></p>
      <p><strong>Téléphone :</strong> ${r.phone ? escapeHtml(r.phone) : '—'}</p>
      <p><strong>Sujet :</strong> ${escapeHtml(r.subject)}</p>
      ${r.referral_code ? `<p><strong>Code parrainage :</strong> ${escapeHtml(r.referral_code)}</p>` : ''}
      <hr />
      <p><strong>Message :</strong></p>
      <pre style="white-space:pre-wrap;font-family:inherit;">${escapeHtml(r.message)}</pre>
    `;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: r.email,
        subject: `[Site] ${r.subject}`,
        html,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend error:', res.status, errText);
      return new Response(JSON.stringify({ error: 'Email send failed', detail: errText }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
