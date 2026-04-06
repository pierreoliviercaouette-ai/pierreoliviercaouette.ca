-- Allow authenticated users to create their own missing profile row.
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
CREATE POLICY "profiles_insert_own"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid() OR public.is_admin());

-- Backfill profiles for users that exist in auth.users but not in public.profiles.
INSERT INTO public.profiles (id, email, first_name, last_name, phone, referral_code, is_admin, created_at)
SELECT
  u.id,
  u.email,
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data ->> 'first_name'), ''), 'Utilisateur') AS first_name,
  COALESCE(NULLIF(TRIM(u.raw_user_meta_data ->> 'last_name'), ''), 'Nouveau') AS last_name,
  u.phone,
  UPPER(SUBSTRING(MD5((u.id::text || clock_timestamp()::text)) FROM 1 FOR 8)) AS referral_code,
  FALSE AS is_admin,
  COALESCE(u.created_at, timezone('utc'::text, now())) AS created_at
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL;

-- Normalize old records that may have empty names.
UPDATE public.profiles
SET first_name = 'Utilisateur'
WHERE COALESCE(TRIM(first_name), '') = '';

UPDATE public.profiles
SET last_name = 'Nouveau'
WHERE COALESCE(TRIM(last_name), '') = '';
