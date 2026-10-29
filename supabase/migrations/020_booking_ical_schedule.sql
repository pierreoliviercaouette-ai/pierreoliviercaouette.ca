-- Suivi des RDV détectés via flux iCal Google → Meta Schedule (sans Apps Script).
-- Voir : GOOGLE_APPS_SCRIPT_SCHEDULE_SETUP.md (section Supabase cron / iCal)

CREATE TABLE IF NOT EXISTS public.booking_ical_events (
  uid TEXT PRIMARY KEY,
  summary TEXT,
  guest_email TEXT,
  created_at_event TIMESTAMPTZ,
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  meta_schedule_sent_at TIMESTAMPTZ,
  meta_event_id TEXT,
  skipped_bootstrap BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS booking_ical_events_sent_idx
  ON public.booking_ical_events (meta_schedule_sent_at);

ALTER TABLE public.booking_ical_events ENABLE ROW LEVEL SECURITY;

-- Pas d'accès anon/authenticated : uniquement service_role (Edge Function).
DROP POLICY IF EXISTS booking_ical_events_deny_all ON public.booking_ical_events;
CREATE POLICY booking_ical_events_deny_all
  ON public.booking_ical_events
  FOR ALL
  TO authenticated, anon
  USING (false)
  WITH CHECK (false);

COMMENT ON TABLE public.booking_ical_events IS
  'UID iCal Google Calendar déjà vus ; meta_schedule_sent_at = Schedule CAPI envoyé';
