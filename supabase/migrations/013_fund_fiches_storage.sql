-- 013: Bucket Storage pour fiches de fonds (PDF) + lecture publique
-- Les rendements année civile sont stockés dans funds.metadata.calendar_returns

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'fund-fiches',
  'fund-fiches',
  true,
  15728640,
  array['application/pdf']::text[]
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Lecture publique des PDF
drop policy if exists "fund_fiches_public_read" on storage.objects;
create policy "fund_fiches_public_read"
on storage.objects
for select
using (bucket_id = 'fund-fiches');

-- Écriture admin seulement
drop policy if exists "fund_fiches_admin_write" on storage.objects;
create policy "fund_fiches_admin_write"
on storage.objects
for insert
with check (bucket_id = 'fund-fiches' and public.is_admin());

drop policy if exists "fund_fiches_admin_update" on storage.objects;
create policy "fund_fiches_admin_update"
on storage.objects
for update
using (bucket_id = 'fund-fiches' and public.is_admin())
with check (bucket_id = 'fund-fiches' and public.is_admin());

drop policy if exists "fund_fiches_admin_delete" on storage.objects;
create policy "fund_fiches_admin_delete"
on storage.objects
for delete
using (bucket_id = 'fund-fiches' and public.is_admin());
