-- Permet à un invité (sans compte) d'enregistrer une demande de contact via lien de parrainage,
-- avec consentement explicite (contourne RLS via SECURITY DEFINER).

CREATE OR REPLACE FUNCTION public.submit_referral_consent(
  p_referral_code TEXT,
  p_first_name TEXT,
  p_last_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_consent BOOLEAN
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ref_profile RECORD;
  consent_note TEXT;
BEGIN
  IF p_consent IS NOT TRUE THEN
    RETURN jsonb_build_object('ok', false, 'error', 'consent_required');
  END IF;

  IF trim(coalesce(p_first_name, '')) = ''
     OR trim(coalesce(p_last_name, '')) = ''
     OR trim(coalesce(p_phone, '')) = ''
     OR trim(coalesce(p_email, '')) = '' THEN
    RETURN jsonb_build_object('ok', false, 'error', 'required_fields');
  END IF;

  SELECT id, referral_code INTO ref_profile
  FROM public.profiles
  WHERE referral_code = upper(trim(p_referral_code))
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.referrals r
    WHERE r.referrer_id = ref_profile.id
      AND lower(r.referred_email) = lower(trim(p_email))
  ) THEN
    RETURN jsonb_build_object('ok', false, 'error', 'duplicate');
  END IF;

  consent_note := 'Consentement électronique : la personne accepte d''être contactée par Pierre-Olivier Caouette, conseiller en sécurité financière, par téléphone ou par courriel concernant des services de conseil. Enregistré le '
    || to_char(timezone('utc'::text, now()), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
    || ' (UTC).';

  INSERT INTO public.referrals (
    referrer_id,
    referrer_code,
    referred_email,
    referred_name,
    referred_phone,
    notes,
    status
  ) VALUES (
    ref_profile.id,
    ref_profile.referral_code,
    lower(trim(p_email)),
    trim(p_first_name) || ' ' || trim(p_last_name),
    trim(p_phone),
    consent_note,
    'pending'
  );

  RETURN jsonb_build_object('ok', true);
END;
$$;

REVOKE ALL ON FUNCTION public.submit_referral_consent(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_referral_consent(TEXT, TEXT, TEXT, TEXT, TEXT, BOOLEAN) TO anon, authenticated;
