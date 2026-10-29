-- Permettre aux admins de supprimer des leads / contacts

DROP POLICY IF EXISTS "contact_delete_admin" ON public.contact_submissions;
CREATE POLICY "contact_delete_admin" ON public.contact_submissions
  FOR DELETE TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.admin_delete_contact_lead(p_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.is_admin() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;

  DELETE FROM public.contact_submissions WHERE id = p_id;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'not found';
  END IF;

  RETURN true;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_delete_contact_lead(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_delete_contact_lead(UUID) TO authenticated;
