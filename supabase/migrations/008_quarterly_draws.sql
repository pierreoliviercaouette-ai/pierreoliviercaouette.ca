-- Concours trimestriel: tables de tirage et d'entrees (audit).
-- Ajoute un registre traçable des tirages et des chances par participant.

CREATE TABLE IF NOT EXISTS public.quarterly_draws (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_year INT NOT NULL CHECK (draw_year >= 2024),
  draw_quarter SMALLINT NOT NULL CHECK (draw_quarter BETWEEN 1 AND 4),
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  prize_value NUMERIC(10, 2) NOT NULL DEFAULT 750.00 CHECK (prize_value > 0),
  scheduled_at TIMESTAMPTZ,
  drawn_at TIMESTAMPTZ,
  winner_user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  winner_contacted_at TIMESTAMPTZ,
  notes TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (draw_year, draw_quarter)
);

CREATE TABLE IF NOT EXISTS public.quarterly_draw_entries (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  draw_id UUID NOT NULL REFERENCES public.quarterly_draws(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_points INT NOT NULL CHECK (total_points >= 0),
  chances INT NOT NULL CHECK (chances >= 0),
  is_eligible BOOLEAN NOT NULL DEFAULT false,
  minimum_points_required INT NOT NULL DEFAULT 5 CHECK (minimum_points_required >= 0),
  points_breakdown JSONB NOT NULL DEFAULT '{}'::jsonb,
  source_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  UNIQUE (draw_id, user_id)
);

CREATE INDEX IF NOT EXISTS quarterly_draws_status_idx
  ON public.quarterly_draws (status, draw_year DESC, draw_quarter DESC);

CREATE INDEX IF NOT EXISTS quarterly_draw_entries_user_idx
  ON public.quarterly_draw_entries (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS quarterly_draw_entries_draw_idx
  ON public.quarterly_draw_entries (draw_id, chances DESC);

ALTER TABLE public.quarterly_draws ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quarterly_draw_entries ENABLE ROW LEVEL SECURITY;

-- quarterly_draws policies
DROP POLICY IF EXISTS "quarterly_draws_select" ON public.quarterly_draws;
CREATE POLICY "quarterly_draws_select" ON public.quarterly_draws FOR SELECT TO authenticated
  USING (public.is_admin() OR status = 'completed');

DROP POLICY IF EXISTS "quarterly_draws_admin_insert" ON public.quarterly_draws;
CREATE POLICY "quarterly_draws_admin_insert" ON public.quarterly_draws FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quarterly_draws_admin_update" ON public.quarterly_draws;
CREATE POLICY "quarterly_draws_admin_update" ON public.quarterly_draws FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quarterly_draws_admin_delete" ON public.quarterly_draws;
CREATE POLICY "quarterly_draws_admin_delete" ON public.quarterly_draws FOR DELETE TO authenticated
  USING (public.is_admin());

-- quarterly_draw_entries policies
DROP POLICY IF EXISTS "quarterly_draw_entries_select" ON public.quarterly_draw_entries;
CREATE POLICY "quarterly_draw_entries_select" ON public.quarterly_draw_entries FOR SELECT TO authenticated
  USING (public.is_admin() OR user_id = auth.uid());

DROP POLICY IF EXISTS "quarterly_draw_entries_admin_insert" ON public.quarterly_draw_entries;
CREATE POLICY "quarterly_draw_entries_admin_insert" ON public.quarterly_draw_entries FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quarterly_draw_entries_admin_update" ON public.quarterly_draw_entries;
CREATE POLICY "quarterly_draw_entries_admin_update" ON public.quarterly_draw_entries FOR UPDATE TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

DROP POLICY IF EXISTS "quarterly_draw_entries_admin_delete" ON public.quarterly_draw_entries;
CREATE POLICY "quarterly_draw_entries_admin_delete" ON public.quarterly_draw_entries FOR DELETE TO authenticated
  USING (public.is_admin());
