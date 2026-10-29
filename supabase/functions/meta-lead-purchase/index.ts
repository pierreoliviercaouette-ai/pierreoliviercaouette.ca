/**
 * Envoie Meta Purchase (Conversions API) quand un lead CRM est marque Vendu.
 *
 * Appel depuis l'admin (JWT Supabase admin) :
 *   POST /functions/v1/meta-lead-purchase
 *   Authorization: Bearer <user_access_token>
 *   Body: { contact_id, sale_value?, currency?, resend? }
 *
 * Secrets :
 *   META_PIXEL_ID
 *   META_CAPI_ACCESS_TOKEN
 *   SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY (auto sur Edge)
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.1';

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
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const authHeader = req.headers.get('Authorization') || '';

    if (!supabaseUrl || !anonKey || !serviceKey || !authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userErr,
    } = await userClient.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: profile, error: profileErr } = await adminClient
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .maybeSingle();
    if (profileErr || !profile?.is_admin) {
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = (await req.json()) as {
      contact_id?: string;
      sale_value?: number;
      currency?: string;
      resend?: boolean;
    };

    const contactId = String(body.contact_id || '').trim();
    if (!contactId) {
      return new Response(JSON.stringify({ error: 'contact_id required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: lead, error: leadErr } = await adminClient
      .from('contact_submissions')
      .select('*')
      .eq('id', contactId)
      .maybeSingle();

    if (leadErr || !lead) {
      return new Response(JSON.stringify({ error: 'Lead not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (lead.meta_purchase_sent_at && !body.resend) {
      return new Response(
        JSON.stringify({
          ok: true,
          skipped: true,
          reason: 'already_sent',
          event_id: lead.meta_purchase_event_id,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const saleValue = Number(
      body.sale_value != null ? body.sale_value : lead.sale_value
    );
    if (!Number.isFinite(saleValue) || saleValue <= 0) {
      return new Response(JSON.stringify({ error: 'sale_value must be > 0' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const currency = String(body.currency || lead.sale_currency || 'CAD').toUpperCase();
    const eventId = String(lead.meta_purchase_event_id || `purchase_${lead.id}`);

    const pixelId = Deno.env.get('META_PIXEL_ID') || '1157851050245521';
    const accessToken = Deno.env.get('META_CAPI_ACCESS_TOKEN');
    if (!accessToken) {
      return new Response(JSON.stringify({ error: 'META_CAPI_ACCESS_TOKEN missing' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userData: Record<string, string | string[]> = {};
    if (lead.email) {
      userData.em = [await sha256Hex(normalizeEmail(lead.email))];
    }
    if (lead.phone) {
      const digits = normalizePhone(String(lead.phone));
      if (digits) userData.ph = [await sha256Hex(digits)];
    }
    if (lead.meta_fbp) userData.fbp = String(lead.meta_fbp);
    if (lead.meta_fbc) userData.fbc = String(lead.meta_fbc);

    const event = {
      event_name: 'Purchase',
      event_time: Math.floor(Date.now() / 1000),
      event_id: eventId,
      action_source: 'system_generated',
      event_source_url: 'https://www.pierreoliviercaouette.ca/admin',
      user_data: userData,
      custom_data: {
        value: saleValue,
        currency,
        content_name: lead.subject || 'lead_sale',
        content_category: 'crm_sale',
        order_id: lead.id,
      },
    };

    const metaRes = await fetch(
      `https://graph.facebook.com/v21.0/${pixelId}/events?access_token=${encodeURIComponent(accessToken)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: [event] }),
      }
    );
    const metaJson = await metaRes.json().catch(() => ({}));
    if (!metaRes.ok) {
      console.error('Meta CAPI Purchase error', metaRes.status, metaJson);
      return new Response(
        JSON.stringify({ error: 'Meta CAPI failed', detail: metaJson }),
        {
          status: 502,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const { error: updErr } = await adminClient
      .from('contact_submissions')
      .update({
        meta_purchase_event_id: eventId,
        meta_purchase_sent_at: new Date().toISOString(),
        sale_value: saleValue,
        sale_currency: currency,
      })
      .eq('id', lead.id);

    if (updErr) {
      console.error('Failed to mark purchase sent', updErr);
    }

    return new Response(
      JSON.stringify({ ok: true, event_id: eventId, meta: metaJson }),
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
