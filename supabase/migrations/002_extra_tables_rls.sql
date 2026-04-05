-- Complément au schéma étape 1 : tables restantes, email sur profiles, RLS.
-- À exécuter dans le SQL Editor Supabase après la migration initiale.

-- Email sur profiles (pour l’admin et les listes ; synchronisé depuis auth.users)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS email TEXT;

UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND (p.email IS NULL OR p.email = '');

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name, phone, referral_code)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'first_name', ''),
    COALESCE(new.raw_user_meta_data->>'last_name', ''),
    new.raw_user_meta_data->>'phone',
    upper(substring(md5(random()::text || new.id::text) from 1 for 8))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.sync_profile_email()
RETURNS trigger AS $$
BEGIN
  UPDATE public.profiles SET email = new.email WHERE id = new.id;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS on_auth_user_email_updated ON auth.users;
CREATE TRIGGER on_auth_user_email_updated
  AFTER UPDATE OF email ON auth.users
  FOR EACH ROW
  WHEN (old.email IS DISTINCT FROM new.email)
  EXECUTE PROCEDURE public.sync_profile_email();

-- Tables manquantes (contact, avis Google, vérif client, témoignages)
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  referral_code TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.google_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending',
  screenshot_url TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMPTZ,
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.existing_clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
  verified_at TIMESTAMPTZ,
  UNIQUE (user_id)
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  author_name TEXT NOT NULL,
  rating INT DEFAULT 5,
  text TEXT NOT NULL,
  profile_photo_url TEXT,
  time TEXT DEFAULT '',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.is_admin = true
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.google_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.existing_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policies profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated
  USING (id = auth.uid() OR public.is_admin())
  WITH CHECK (id = auth.uid() OR public.is_admin());

-- tools (anon : actifs seulement — comme l’ancienne API sans JWT)
DROP POLICY IF EXISTS "tools_select" ON public.tools;
DROP POLICY IF EXISTS "tools_select_anon" ON public.tools;
CREATE POLICY "tools_select_anon" ON public.tools FOR SELECT TO anon
  USING (is_active = true);

CREATE POLICY "tools_select" ON public.tools FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "tools_insert_admin" ON public.tools;
CREATE POLICY "tools_insert_admin" ON public.tools FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "tools_update_admin" ON public.tools;
CREATE POLICY "tools_update_admin" ON public.tools FOR UPDATE TO authenticated
  USING (public.is_admin());

DROP POLICY IF EXISTS "tools_delete_admin" ON public.tools;
CREATE POLICY "tools_delete_admin" ON public.tools FOR DELETE TO authenticated
  USING (public.is_admin());

-- tool_results
DROP POLICY IF EXISTS "tool_results_own" ON public.tool_results;
CREATE POLICY "tool_results_own" ON public.tool_results FOR ALL TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- referrals
DROP POLICY IF EXISTS "referrals_select" ON public.referrals;
CREATE POLICY "referrals_select" ON public.referrals FOR SELECT TO authenticated
  USING (referrer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "referrals_insert" ON public.referrals;
CREATE POLICY "referrals_insert" ON public.referrals FOR INSERT TO authenticated
  WITH CHECK (referrer_id = auth.uid());

DROP POLICY IF EXISTS "referrals_update_admin" ON public.referrals;
CREATE POLICY "referrals_update_admin" ON public.referrals FOR UPDATE TO authenticated
  USING (public.is_admin());

-- notifications (admin peut insérer pour un autre user, ex. référence qualifiée)
DROP POLICY IF EXISTS "notifications_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
DROP POLICY IF EXISTS "notifications_insert" ON public.notifications;

CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- contact_submissions (insertion via RPC sécurisée ; lecture admin)
DROP POLICY IF EXISTS "contact_insert_public" ON public.contact_submissions;

DROP POLICY IF EXISTS "contact_select_admin" ON public.contact_submissions;
CREATE POLICY "contact_select_admin" ON public.contact_submissions FOR SELECT TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.create_contact_submission(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT,
  p_subject TEXT,
  p_message TEXT,
  p_referral_code TEXT
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
  INSERT INTO public.contact_submissions (name, email, phone, subject, message, referral_code)
  VALUES (
    trim(p_name),
    lower(trim(p_email)),
    NULLIF(trim(p_phone), ''),
    trim(p_subject),
    trim(p_message),
    NULLIF(upper(trim(p_referral_code)), '')
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

REVOKE ALL ON FUNCTION public.create_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.create_contact_submission(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- Évite les doublons de parrainage (même parrain + même courriel)
CREATE UNIQUE INDEX IF NOT EXISTS referrals_referrer_referred_email_unique
  ON public.referrals (referrer_id, lower(referred_email));

-- google_reviews
DROP POLICY IF EXISTS "google_reviews_select" ON public.google_reviews;
CREATE POLICY "google_reviews_select" ON public.google_reviews FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "google_reviews_insert" ON public.google_reviews;
CREATE POLICY "google_reviews_insert" ON public.google_reviews FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "google_reviews_update_admin" ON public.google_reviews;
CREATE POLICY "google_reviews_update_admin" ON public.google_reviews FOR UPDATE TO authenticated
  USING (public.is_admin());

-- existing_clients
DROP POLICY IF EXISTS "existing_clients_select" ON public.existing_clients;
CREATE POLICY "existing_clients_select" ON public.existing_clients FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "existing_clients_insert" ON public.existing_clients;
CREATE POLICY "existing_clients_insert" ON public.existing_clients FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "existing_clients_update_admin" ON public.existing_clients;
CREATE POLICY "existing_clients_update_admin" ON public.existing_clients FOR UPDATE TO authenticated
  USING (public.is_admin());

-- testimonials (lecture publique des actifs)
DROP POLICY IF EXISTS "testimonials_public_read" ON public.testimonials;
CREATE POLICY "testimonials_public_read" ON public.testimonials FOR SELECT
  USING (is_active = true OR public.is_admin());

DROP POLICY IF EXISTS "testimonials_admin_write" ON public.testimonials;
CREATE POLICY "testimonials_admin_write" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
