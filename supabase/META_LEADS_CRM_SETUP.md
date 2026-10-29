# Guide d’intégration Supabase — Mini-CRM leads + Meta Purchase

Ce guide branche le suivi des leads (formulaire `/contact`) et l’envoi **Purchase** à Meta quand tu marques une vente dans l’admin.

**Pixel Meta :** `1157851050245521`  
**Fichiers concernés :**
- Migration : `migrations/018_contact_leads_crm.sql`
- Edge Function : `functions/meta-lead-purchase/`
- Frontend : Admin → onglet Contacts (déjà dans le code)

---

## Vue d’ensemble

```text
Visiteur → /contact (+ cookies _fbp/_fbc)
        → table contact_submissions + événement Lead (Pixel)

Admin   → Contacts → Vendu + montant $
        → Edge Function meta-lead-purchase
        → Meta Conversions API (Purchase + value CAD)
```

---

## Prérequis

1. Accès au projet Supabase du site (Dashboard)
2. Compte admin sur le site (`profiles.is_admin = true`)
3. Jeton **Conversions API** pour le Pixel `1157851050245521`  
   Events Manager → Pixel → Paramètres → Conversions API → Générer un jeton  
   (ne colle jamais le jeton dans Git ni dans un chat)
4. Optionnel CLI : [Supabase CLI](https://supabase.com/docs/guides/cli) connecté au projet

---

## Étape 1 — Appliquer la migration SQL

### Option A — Dashboard (recommandé si pas de CLI)

1. Ouvre **SQL Editor** dans Supabase
2. Copie tout le contenu de `migrations/018_contact_leads_crm.sql`
3. Exécute (**Run**)
4. Vérifie qu’il n’y a pas d’erreur

### Option B — CLI

```bash
supabase db push
# ou, selon ton flux :
supabase migration up
```

### Ce que la migration ajoute

Sur `public.contact_submissions` :
| Colonne | Rôle |
|---------|------|
| `status` | `new` / `contacted` / `qualified` / `sold` / `lost` |
| `admin_notes` | Notes internes |
| `sale_value` / `sale_currency` | Montant vente (CAD) |
| `sold_at` | Date de vente |
| `meta_fbp` / `meta_fbc` | Cookies Pixel pour matching CAPI |
| `meta_purchase_event_id` / `meta_purchase_sent_at` | Idempotence Purchase |

Policies / RPC :
- `contact_update_admin` (UPDATE réservé admin)
- `create_contact_submission(..., p_meta_fbp, p_meta_fbc)`
- `admin_update_contact_lead`
- `admin_mark_contact_sold`
- `admin_mark_contact_meta_purchase_sent`

### Vérification rapide

Dans SQL Editor :

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name = 'contact_submissions'
ORDER BY ordinal_position;

SELECT proname
FROM pg_proc
WHERE proname LIKE 'admin_%contact%'
   OR proname = 'create_contact_submission';
```

---

## Étape 2 — Secrets Edge Functions

Dashboard → **Project Settings** → **Edge Functions** → **Secrets**  
(ou CLI : `supabase secrets set ...`)

Ajoute / mets à jour :

| Secret | Valeur |
|--------|--------|
| `META_PIXEL_ID` | `1157851050245521` |
| `META_CAPI_ACCESS_TOKEN` | jeton Conversions API (nouveau pixel) |

`SUPABASE_URL`, `SUPABASE_ANON_KEY` et `SUPABASE_SERVICE_ROLE_KEY` sont déjà injectés automatiquement dans les Edge Functions — **ne les mets pas** dans le repo.

CLI :

```bash
supabase secrets set META_PIXEL_ID=1157851050245521
supabase secrets set META_CAPI_ACCESS_TOKEN=ton_jeton_ici
```

---

## Étape 3 — Déployer l’Edge Function (sans CLI)

### Dashboard (recommandé si tu n’as pas la CLI)

1. Supabase → **Edge Functions**
2. **Deploy a new function** / **Create a new function**
3. Nom exact (important pour le frontend) : `meta-lead-purchase`
4. Colle le code de `functions/meta-lead-purchase/index.ts` dans l’éditeur  
   (tout le fichier, y compris l’import `esm.sh`)
5. Déploie / Save
6. Confirme que la function apparaît comme **Active**

Si l’UI propose un template Hello World : remplace entièrement le contenu par ton `index.ts`.

**JWT / Verify JWT :** laisse la vérification JWT **activée** (le site envoie le token de l’admin connecté).

### Alternative CLI (optionnel)

```bash
supabase functions deploy meta-lead-purchase
```

### Vérifier

Dashboard → **Edge Functions** → `meta-lead-purchase` = Active.

URL typique :

```text
https://<PROJECT_REF>.supabase.co/functions/v1/meta-lead-purchase
```

Le frontend l’appelle via `supabase.functions.invoke('meta-lead-purchase')` avec le JWT admin — **pas besoin** d’appeler l’URL à la main.

---

## Étape 4 — (Rappel) Webhook courriel contact

Si ce n’est pas déjà fait, le courriel à la réception d’un lead utilise :

- Function : `send-contact-email`
- Guide : `functions/contact-email-webhook.txt`
- Database Webhook sur `contact_submissions` INSERT

Indépendant du Purchase Meta, mais utile pour le mini-CRM au quotidien.

---

## Étape 5 — Tests de bout en bout

### A. Lead (formulaire)

1. Sur le site prod/staging : **accepter** le bandeau cookies
2. Envoyer un message via `/contact`
3. Admin → **Contacts** : le lead apparaît en **Nouveau**
4. Meta Events Manager : événement **Lead** (navigateur)

### B. Parcours CRM

1. Admin → Contacts → **Marquer contacté** / **Qualifier**
2. **Vendu** → entrer un montant (ex. `2500`) → Confirmer
3. Toast : vente enregistrée + Purchase envoyé (ou erreur Meta claire)
4. La fiche affiche le montant + « Meta Purchase envoyé »

### C. Meta Events Manager

1. Pixel `1157851050245521` → Vue d’ensemble / Test events
2. Chercher **Purchase** (source **Server** / Conversions API)
3. Vérifier `value` + `currency` = CAD

### Si Purchase échoue

| Symptôme | Cause probable |
|----------|----------------|
| Toast « META_CAPI_ACCESS_TOKEN missing » | Secret non défini ou function non redéployée |
| 401 / Forbidden | Compte non admin ou session expirée |
| 502 Meta CAPI failed | Mauvais jeton / jeton de l’ancien Pixel |
| Lead sans fbp/fbc | Cookies refusés — Purchase part quand même (email hashé) |

Bouton **Envoyer / Renvoyer Purchase Meta** sur une fiche déjà « Vendu » si l’envoi a échoué la première fois.

---

## Checklist finale

- [ ] Migration `018_contact_leads_crm.sql` exécutée
- [ ] Migration `019_contact_leads_delete.sql` exécutée (suppression leads admin)
- [ ] Secret `META_PIXEL_ID=1157851050245521`
- [ ] Secret `META_CAPI_ACCESS_TOKEN` (jeton du **nouveau** Pixel)
- [ ] Edge Function `meta-lead-purchase` déployée (Dashboard ou CLI)
- [ ] Test Lead (`/contact` + cookies acceptés)
- [ ] Test Vendu admin → Purchase dans Events Manager
- [ ] Site déployé avec le code (Pixel `1157851050245521` + UI Admin)

---

## Sécurité

- Ne committe jamais `META_CAPI_ACCESS_TOKEN`
- Si un jeton a fuité (chat, capture d’écran) : **régénère-le** dans Events Manager et mets à jour le secret Supabase
- Seuls les utilisateurs `is_admin` peuvent marquer vendu et appeler la function
