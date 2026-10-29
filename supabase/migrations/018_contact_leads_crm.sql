-- Mini-CRM leads (contact_submissions) + champs vente / Meta Purchase CAPI

ALTER TABLE public.contact_submissions
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS sale_value NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS sale_currency TEXT DEFAULT 'CAD',
  ADD COLUMN IF NOT EXISTS sold_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meta_purchase_event_id TEXT,
  ADD COLUMN IF NOT EXISTS meta_purchase_sent_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS meta_fbp TEXT,
  ADD COLUMN IF NOT EXISTS meta_fbc TEXT;

-- Normaliser les statuts existants hors liste
UPDATE public.contact_submissions
SET status = 'new'
WHERE status IS NULL
   OR status NOT IN ('new', 'contacted', 'qualified', 'sold', 'lost');

ALTER TABLE public.contact_submissions
  ALTER COLUMN status SET DEFAULT 'new';

ALTER TABLE public.contact_submissions
  DROP CONSTRAINT IF EXISTS contact_submissions_status_check;

ALTER TABLE public.contact_submissions
  ADD CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('new', 'contacted', 'qualified', 'sold', 'lost'));

DROP POLICY IF EXISTS "contact_update_admin" ON public.contact_submissions;
CREATE POLICY "contact_update_admin" ON public.contact_submissions
  FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Remplace la RPC publique : + cookies Meta optionnels
DROP FUNCTION IF EXISTS public.create_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT);

CREATE OR REPLACE FUNCTION public.create_contact_submission(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_subject TEXT,
  p_message TEXT,
  p_referral_code TEXT,
  p_meta_fbp TEXT DEFAULT NULL,
  p_meta_fbc TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id UUID;
  ref_profile RECORD;
  code_norm TEXT;
BEGIN
  INSERT INTO public.contact_submissions (
    name, email, phone, subject, message, referral_code, meta_fbp, meta_fbc, status
  )
  VALUES (
    trim(p_name),
    lower(trim(p_email)),
    NULLIF(trim(p_phone), ''),
    trim(p_subject),
    trim(p_message),
    NULLIF(upper(trim(p_referral_code)), ''),
    NULLIF(trim(p_meta_fbp), ''),
    NULLIF(trim(p_meta_fbc), ''),
    'new'
  )
  RETURNING id INTO new_id;

  code_norm := NULLIF(upper(trim(p_referral_code)), '');
  IF code_norm IS NOT NULL THEN
    SELECT id, referral_code INTO ref_profile
    FROM public.profiles
    WHERE referral_code = code_norm
    LIMIT 1;

    IF FOUND THEN
      IF NOT EXISTS (
        SELECT 1 FROM public.referrals r
        WHERE r.referrer_code = ref_profile.referral_code
          AND lower(r.referred_email) = lower(trim(p_email))
      ) THEN
        INSERT INTO public.referrals (
          referrer_id, referrer_code, referred_email, referred_name, referred_phone, notes, status
        ) VALUES (
          ref_profile.id,
          ref_profile.referral_code,
          lower(trim(p_email)),
          trim(p_name),
          NULLIF(trim(p_phone), ''),
          'Via formulaire de contact: ' || trim(p_subject),
          'pending'
        );
      END IF;
    END IF;
  END IF;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.create_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Mise à jour statut / notes (admin)
CREATE OR REPLACE FUNCTION public.admin_update_contact_lead(
  p_id UUID,
  p_status TEXT DEFAULT NULL,
  p_admin_notes TEXT DEFAULT NULL
)
RETURNS public.contact_submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.contact_submissions;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF p_status IS NOT NULL AND p_status NOT IN ('new', 'contacted', 'qualified', 'sold', 'lost') THEN
    RAISE EXCEPTION 'invalid status';
  END IF;

  IF p_status = 'sold' THEN
    RAISE EXCEPTION 'use admin_mark_contact_sold for sold status';
  END IF;

  UPDATE public.contact_submissions c
  SET
    status = COALESCE(p_status, c.status),
    admin_notes = CASE
      WHEN p_admin_notes IS NULL THEN c.admin_notes
      ELSE NULLIF(trim(p_admin_notes), '')
    END
  WHERE c.id = p_id
  RETURNING * INTO row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'not found';
  END IF;

  RETURN row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_update_contact_lead(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_update_contact_lead(UUID, TEXT, TEXT) TO authenticated;

-- Marquer vendu (admin) — Meta CAPI appelé ensuite par Edge Function
CREATE OR REPLACE FUNCTION public.admin_mark_contact_sold(
  p_id UUID,
  p_sale_value NUMERIC,
  p_admin_notes TEXT DEFAULT NULL,
  p_sale_currency TEXT DEFAULT 'CAD'
)
RETURNS public.contact_submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.contact_submissions;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  IF p_sale_value IS NULL OR p_sale_value <= 0 THEN
    RAISE EXCEPTION 'sale_value must be > 0';
  END IF;

  UPDATE public.contact_submissions c
  SET
    status = 'sold',
    sale_value = p_sale_value,
    sale_currency = COALESCE(NULLIF(trim(p_sale_currency), ''), 'CAD'),
    sold_at = COALESCE(c.sold_at, timezone('utc'::text, now())),
    admin_notes = CASE
      WHEN p_admin_notes IS NULL THEN c.admin_notes
      ELSE NULLIF(trim(p_admin_notes), '')
    END,
    meta_purchase_event_id = COALESCE(c.meta_purchase_event_id, 'purchase_' || c.id::text)
  WHERE c.id = p_id
  RETURNING * INTO row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'not found';
  END IF;

  RETURN row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_mark_contact_sold(UUID, NUMERIC, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_mark_contact_sold(UUID, NUMERIC, TEXT, TEXT) TO authenticated;

-- Marquer l'envoi Meta réussi (appelé par Edge Function avec service role ou admin)
CREATE OR REPLACE FUNCTION public.admin_mark_contact_meta_purchase_sent(
  p_id UUID,
  p_event_id TEXT
)
RETURNS public.contact_submissions
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  row public.contact_submissions;
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  UPDATE public.contact_submissions c
  SET
    meta_purchase_event_id = COALESCE(NULLIF(trim(p_event_id), ''), c.meta_purchase_event_id, 'purchase_' || c.id::text),
    meta_purchase_sent_at = timezone('utc'::text, now())
  WHERE c.id = p_id
  RETURNING * INTO row;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'not found';
  END IF;

  RETURN row;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_mark_contact_meta_purchase_sent(UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_mark_contact_meta_purchase_sent(UUID, TEXT) TO authenticated;
