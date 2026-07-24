-- Accessibilité outils : membre uniquement vs public (sans connexion)
ALTER TABLE public.tools
  ADD COLUMN IF NOT EXISTS requires_auth boolean NOT NULL DEFAULT true;

COMMENT ON COLUMN public.tools.requires_auth IS
  'true = connexion requise ; false = accessible sans compte (si is_active)';

-- Anon : uniquement les outils actifs ET publics
DROP POLICY IF EXISTS "tools_select_anon" ON public.tools;
CREATE POLICY "tools_select_anon" ON public.tools FOR SELECT TO anon
  USING (is_active = true AND requires_auth = false);

-- Authenticated : inchangé (actifs, ou tout si admin)
DROP POLICY IF EXISTS "tools_select" ON public.tools;
CREATE POLICY "tools_select" ON public.tools FOR SELECT TO authenticated
  USING (is_active = true OR public.is_admin());
