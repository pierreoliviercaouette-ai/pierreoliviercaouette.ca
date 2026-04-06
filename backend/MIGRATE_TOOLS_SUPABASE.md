## Migrer les outils vers Supabase

Ce script prend les 8 outils (nom, slug, description, tags, `html_content`) depuis `backend/update_tools.py` et les **upsert** dans `public.tools` par `slug`.

### Prérequis

- Python installé
- Dépendance `requests` installée (`pip install requests`)
- Variables d'environnement:
  - `SUPABASE_URL` (ex: `https://xxxx.supabase.co`)
  - `SUPABASE_SERVICE_ROLE_KEY` (clé `service_role`)

### Commandes

```bash
python backend/migrate_tools_to_supabase.py --dry-run
python backend/migrate_tools_to_supabase.py
```

### Vérification SQL

```sql
select slug, name, is_active
from public.tools
order by created_at desc;
```

