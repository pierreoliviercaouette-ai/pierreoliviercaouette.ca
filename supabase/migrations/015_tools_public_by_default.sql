-- Outils accessibles sans connexion (tous les actifs)
-- requires_auth reste disponible en admin pour un éventuel usage futur,
-- mais la lecture anon n'y est plus conditionnée.

ALTER TABLE public.tools
  ALTER COLUMN requires_auth SET DEFAULT false;

UPDATE public.tools
SET requires_auth = false
WHERE requires_auth IS DISTINCT FROM false;

DROP POLICY IF EXISTS "tools_select_anon" ON public.tools;
CREATE POLICY "tools_select_anon" ON public.tools FOR SELECT TO anon
  USING (is_active = true);

DROP POLICY IF EXISTS "tools_select" ON public.tools;
CREATE POLICY "tools_select" ON public.tools FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());
