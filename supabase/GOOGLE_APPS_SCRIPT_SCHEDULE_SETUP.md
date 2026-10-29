# Guide — Google Calendar → Meta Schedule

Quand quelqu’un réserve via **Outlook Bookings**, une invitation arrive dans ton **Google Agenda**. On envoie un **Schedule** Meta automatiquement.

**Pixel Meta :** `1157851050245521`

> **Si Apps Script est bloqué par Google (ton cas) :** utilise la **voie A — Supabase** ci-dessous.  
> Aucune autorisation Google à accepter. Automatique via cron gratuit.

---

## Voie A — Supabase iCal poll (recommandée)

```text
Client réserve (Outlook Bookings)
        → événement dans Google Agenda
        → cron (toutes les 5–10 min) appelle booking-ical-poll
        → lit l’URL iCal secrète
        → Meta Conversions API (Schedule)
```

Fichiers : `functions/booking-ical-poll/` · `migrations/020_booking_ical_schedule.sql`

### A1 — URL iCal secrète

1. [calendar.google.com](https://calendar.google.com)  
2. Engrenage → **Paramètres** → ton calendrier  
3. **Intégrer le calendrier** → copie **Adresse secrète au format iCal**

### A2 — SQL

SQL Editor → colle et exécute `migrations/020_booking_ical_schedule.sql`

### A3 — Secrets

Edge Functions → Secrets :

| Secret | Valeur |
|--------|--------|
| `GOOGLE_CALENDAR_ICAL_URL` | l’URL iCal secrète |
| `META_PIXEL_ID` | `1157851050245521` |
| `META_CAPI_ACCESS_TOKEN` | jeton CAPI |
| `BOOKING_WEBHOOK_SECRET` | secret long (ex. `monwebhook`) |
| `BOOKING_MY_EMAIL` | `pierre.olivier.caouette@gmail.com` |
| `BOOKING_TITLE_INCLUDE` | `Nouvelle réservation` (ou vide) |
| `BOOKING_LOOKBACK_MIN` | `45` |

### A4 — Déployer la function

Dashboard → Edge Functions → créer **`booking-ical-poll`** → coller `functions/booking-ical-poll/index.ts` → Deploy  
(ou CLI : `supabase functions deploy booking-ical-poll`)

### A5 — Premier appel (bootstrap)

PowerShell :

```powershell
Invoke-RestMethod -Method POST `
  -Uri "https://gksqjvattwhmofdarqnq.supabase.co/functions/v1/booking-ical-poll" `
  -Headers @{ Authorization = "Bearer monwebhook" }
```

Attendu : `"bootstrap": true` — les RDV existants sont mémorisés, **rien** n’est envoyé à Meta.

### A6 — Automatique toutes les 5–10 min

1. Crée un compte gratuit sur [cron-job.org](https://cron-job.org)  
2. **Create cronjob**  
3. URL : `https://gksqjvattwhmofdarqnq.supabase.co/functions/v1/booking-ical-poll`  
4. Schedule : every 5 or 10 minutes  
5. Request method : **POST**  
6. Headers : `Authorization` = `Bearer monwebhook` (même secret)  
7. Save  

Les **nouveaux** RDV → `Schedule` Meta. Plus besoin d’Apps Script.

---

## Voie B — Apps Script (souvent bloqué sur Gmail perso)

Ne suis cette section **que** si la voie A ne te convient pas.

**Edge Function legacy :** `functions/outlook-booking-meta/`

### Prérequis (voie B)

1. Projet Supabase du site + accès Dashboard  
2. Jeton **Conversions API** (`META_CAPI_ACCESS_TOKEN`)  
3. Compte Gmail où arrivent les invitations Bookings  
4. Un secret partagé pour le webhook

---


## Étape 1 — Secrets Supabase

Dashboard → **Project Settings** → **Edge Functions** → **Secrets** (ou CLI) :

| Secret | Valeur |
|--------|--------|
| `META_PIXEL_ID` | `1157851050245521` |
| `META_CAPI_ACCESS_TOKEN` | jeton CAPI (Events Manager) |
| `BOOKING_WEBHOOK_SECRET` | secret long aléatoire (même valeur dans Apps Script) |

CLI (optionnel) :

```bash
supabase secrets set BOOKING_WEBHOOK_SECRET=ton_secret_long_ici
# META_PIXEL_ID et META_CAPI_ACCESS_TOKEN si pas déjà définis
```

Ne committe **jamais** le secret ni le jeton CAPI.

---

## Étape 2 — Déployer l’Edge Function

### Option A — Dashboard

1. **Edge Functions** → Create / Edit  
2. Nom exact : `outlook-booking-meta`  
3. Colle le code de `functions/outlook-booking-meta/index.ts`  
4. Deploy

### Option B — CLI

```bash
supabase functions deploy outlook-booking-meta
```

### URL à noter

```text
https://<PROJECT_REF>.supabase.co/functions/v1/outlook-booking-meta
```

`<PROJECT_REF>` = id du projet (Dashboard → Settings → General → Reference ID).

### Test manuel (PowerShell)

Remplace `PROJECT_REF`, `SECRET` et l’email de test :

```powershell
Invoke-RestMethod -Method POST `
  -Uri "https://PROJECT_REF.supabase.co/functions/v1/outlook-booking-meta" `
  -Headers @{
    Authorization = "Bearer SECRET"
    "Content-Type" = "application/json"
  } `
  -Body '{"email":"test@example.com","appointment_id":"test_manual_001","service_name":"test_apps_script","source":"manual_test"}'
```

Attendu : `{ "ok": true, ... }`.  
Dans Events Manager → **Test events** / historique CAPI : un `Schedule` doit apparaître (parfois avec quelques minutes de délai).

---

## Étape 3 — Récupérer l’URL iCal secrète (contourne le blocage OAuth Agenda)

`CalendarApp` demande l’accès Agenda → Google te bloque.  
On lit le calendrier via une **URL iCal privée** + `UrlFetchApp` seulement (autorisation beaucoup plus légère).

1. [calendar.google.com](https://calendar.google.com) (même Gmail)  
2. Engrenage → **Paramètres**  
3. À gauche : ton calendrier (celui qui reçoit les Bookings)  
4. **Intégrer le calendrier**  
5. Copie **Adresse secrète au format iCal**  
   (commence par `https://calendar.google.com/calendar/ical/.../basic.ics`)

Ne partage jamais cette URL (elle donne accès en lecture à l’agenda).

---

## Étape 4 — Nouveau projet Apps Script (sans projet Cloud)

1. [script.google.com](https://script.google.com) → **Nouveau projet**  
2. **Ne touche pas** à « Projet Google Cloud / Changer de projet »  
3. Colle le code ci-dessous dans `Code.gs`  
4. (Optionnel) Affiche `appsscript.json` → remplace par le manifeste de l’étape 4b

### Code `Code.gs`

```javascript
/**
 * Bookings → Meta Schedule via flux iCal (pas de CalendarApp = pas de blocage Agenda).
 *
 * Propriétés du script :
 *   ICAL_URL        = adresse secrète iCal Google Calendar
 *   WEBHOOK_URL     = https://PROJECT_REF.supabase.co/functions/v1/outlook-booking-meta
 *   WEBHOOK_SECRET  = même valeur que BOOKING_WEBHOOK_SECRET
 *   MY_EMAIL        = ton Gmail
 *   TITLE_INCLUDE   = (optionnel) ex. Nouvelle réservation
 *   LOOKBACK_MIN    = (optionnel) défaut 30
 */

var PROP = PropertiesService.getScriptProperties();

function checkNewBookings() {
  var icalUrl = mustProp_('ICAL_URL');
  var url = mustProp_('WEBHOOK_URL');
  var secret = mustProp_('WEBHOOK_SECRET');
  var myEmail = (PROP.getProperty('MY_EMAIL') || '').toLowerCase().trim();
  var titleFilter = (PROP.getProperty('TITLE_INCLUDE') || '').trim().toLowerCase();
  var lookback = parseInt(PROP.getProperty('LOOKBACK_MIN') || '30', 10);
  if (isNaN(lookback) || lookback < 5) lookback = 30;

  var res = UrlFetchApp.fetch(icalUrl, { muteHttpExceptions: true, followRedirects: true });
  if (res.getResponseCode() < 200 || res.getResponseCode() >= 300) {
    throw new Error('ICAL HTTP ' + res.getResponseCode() + ' — vérifie ICAL_URL');
  }

  var events = parseIcsEvents_(res.getContentText());
  var processed = loadProcessed_();
  var bootstrapped = PROP.getProperty('BOOTSTRAPPED') === '1';
  var now = Date.now();
  var createdAfter = now - lookback * 60 * 1000;
  var sent = 0;

  // 1er run : mémoriser tous les UID existants SANS envoyer à Meta
  if (!bootstrapped) {
    events.forEach(function (ev) {
      if (ev.uid) markProcessed_(processed, ev.uid);
    });
    saveProcessed_(processed);
    PROP.setProperty('BOOTSTRAPPED', '1');
    console.log('Bootstrap OK — ' + events.length + ' événement(s) ignorés. Prochains = Schedule.');
    return;
  }

  events.forEach(function (ev) {
    if (!ev.uid || processed[ev.uid]) return;

    var createdMs = ev.created ? ev.created.getTime() : 0;
    if (!createdMs || createdMs < createdAfter) {
      markProcessed_(processed, ev.uid);
      return;
    }

    var title = ev.summary || '';
    if (titleFilter && title.toLowerCase().indexOf(titleFilter) === -1) {
      markProcessed_(processed, ev.uid);
      return;
    }

    var guest = pickGuestFromIcs_(ev, myEmail);
    var phone = pickPhoneFromDescription_(ev.description || '');
    var payload = {
      email: guest || '',
      phone: phone || '',
      appointment_id: 'gcal_' + String(ev.uid).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 80),
      service_name: title || 'google_calendar_booking',
      source: 'google_apps_script_ical',
    };

    if (postSchedule_(url, secret, payload)) {
      markProcessed_(processed, ev.uid);
      sent++;
      console.log('Schedule OK:', payload.appointment_id, payload.email || '(sans email)');
    } else {
      console.error('Échec webhook', ev.uid);
    }
  });

  saveProcessed_(processed);
  console.log('Terminé. Nouveaux Schedule:', sent);
}

function postSchedule_(url, secret, payload) {
  var res = UrlFetchApp.fetch(url, {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + secret },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  if (res.getResponseCode() < 200 || res.getResponseCode() >= 300) {
    console.error('HTTP', res.getResponseCode(), res.getContentText());
    return false;
  }
  return true;
}

function parseIcsEvents_(raw) {
  var text = String(raw || '').replace(/\r\n/g, '\n').replace(/\n[ \t]/g, '');
  var blocks = text.split('BEGIN:VEVENT');
  var out = [];
  for (var i = 1; i < blocks.length; i++) {
    var block = blocks[i].split('END:VEVENT')[0];
    var uid = icsProp_(block, 'UID');
    if (!uid) continue;
    out.push({
      uid: uid,
      summary: icsUnescape_(icsProp_(block, 'SUMMARY')),
      description: icsUnescape_(icsProp_(block, 'DESCRIPTION')),
      created: parseIcsDate_(icsProp_(block, 'CREATED') || icsProp_(block, 'DTSTAMP')),
      attendees: icsAttendees_(block),
    });
  }
  return out;
}

function icsProp_(block, name) {
  var re = new RegExp('(?:^|\\n)' + name + '(?:;[^:]*)?:([^\\n]*)');
  var m = block.match(re);
  return m ? m[1].trim() : '';
}

function icsAttendees_(block) {
  var emails = [];
  var re = /(?:^|\n)ATTENDEE[^:]*:([^\n]+)/g;
  var m;
  while ((m = re.exec(block))) {
    var v = m[1].trim().replace(/^mailto:/i, '').toLowerCase();
    if (v.indexOf('@') !== -1) emails.push(v);
  }
  return emails;
}

function icsUnescape_(s) {
  return String(s || '')
    .replace(/\\n/g, '\n')
    .replace(/\\,/g, ',')
    .replace(/\\;/g, ';')
    .replace(/\\\\/g, '\\');
}

function parseIcsDate_(s) {
  if (!s) return null;
  // 20240115T183000Z ou 20240115T183000
  var m = s.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})(Z)?/);
  if (!m) return null;
  if (m[7] === 'Z') {
    return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  }
  return new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
}

function pickGuestFromIcs_(ev, myEmail) {
  var list = ev.attendees || [];
  for (var i = 0; i < list.length; i++) {
    if (myEmail && list[i] === myEmail) continue;
    return list[i];
  }
  var blob = (ev.description || '') + ' ' + (ev.summary || '');
  var m = blob.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (m) {
    var found = m[0].toLowerCase();
    if (!myEmail || found !== myEmail) return found;
  }
  return '';
}

function pickPhoneFromDescription_(desc) {
  var m = String(desc).match(/(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return m ? m[0] : '';
}

function mustProp_(key) {
  var v = PROP.getProperty(key);
  if (!v) throw new Error('Propriété manquante : ' + key);
  return v;
}

function loadProcessed_() {
  try {
    return JSON.parse(PROP.getProperty('PROCESSED_IDS') || '{}');
  } catch (e) {
    return {};
  }
}

function markProcessed_(map, id) {
  map[id] = Date.now();
  var keys = Object.keys(map);
  if (keys.length > 200) {
    keys
      .sort(function (a, b) {
        return map[a] - map[b];
      })
      .slice(0, keys.length - 200)
      .forEach(function (k) {
        delete map[k];
      });
  }
}

function saveProcessed_(map) {
  PROP.setProperty('PROCESSED_IDS', JSON.stringify(map));
}

function runOnce() {
  checkNewBookings();
}
```

### Étape 4b — Manifeste (réduit les permissions)

Paramètres du projet → coche **Afficher le fichier manifeste appsscript.json**, puis :

```json
{
  "timeZone": "America/Toronto",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "oauthScopes": [
    "https://www.googleapis.com/auth/script.external_request"
  ]
}
```

---

## Étape 5 — Propriétés du script

**Paramètres du projet** → **Propriétés du script** :

| Clé | Valeur |
|-----|--------|
| `ICAL_URL` | l’adresse secrète iCal (étape 3) |
| `WEBHOOK_URL` | `https://gksqjvattwhmofdarqnq.supabase.co/functions/v1/outlook-booking-meta` |
| `WEBHOOK_SECRET` | même secret que Supabase `BOOKING_WEBHOOK_SECRET` |
| `MY_EMAIL` | `pierre.olivier.caouette@gmail.com` |
| `TITLE_INCLUDE` | `Nouvelle réservation` (ou vide pour tester) |
| `LOOKBACK_MIN` | `30` |

Ne mets **pas** ces valeurs dans le code.

---

## Étape 6 — Autorisations + premier test

1. Sélectionne la fonction `runOnce`  
2. **Exécuter**  
3. Autorise le compte Google (Agenda + UrlFetch)  
4. Sur l’avertissement : **Avancé** → **Accéder à … (non sécurisé)**  
5. **Exécutions** (horloge à gauche) : vérifie les logs  

Puis crée un **faux** événement de test dans ton Agenda (avec un guest email de test), attends 1 minute, relance `runOnce`, et vérifie Events Manager.

> Au premier run, les vieux événements hors fenêtre `LOOKBACK_MIN` sont marqués traités sans webhook — c’est voulu.

### Si « Cette application est bloquée » (même avec le bon Gmail)

**Important (Gmail perso) :** ne **lie pas** un projet Google Cloud (« Changer de projet »).  
Un projet Cloud en mode Test force les « utilisateurs tests », expire en 7 jours, et bloque souvent l’auth.  
Le projet **géré par Apps Script** (par défaut) est plus permissif pour un usage perso.

#### Méthode qui marche le plus souvent

1. Crée un **nouveau** projet sur [script.google.com](https://script.google.com) (même Gmail)  
2. **Ne touche pas** à « Projet Google Cloud Platform » / « Changer de projet »  
3. Colle le code + propriétés du script (étape 5)  
4. Exécute `runOnce`  
5. Sur l’écran d’avertissement : en bas à gauche → **Avancé** → **Accéder à … (non sécurisé)**  

> Si tu as déjà lié un projet Cloud, tu ne peux en général **pas** revenir en arrière : il faut un **nouveau** projet Apps Script (étape 1).

#### Si tu as déjà un projet Cloud lié et tu veux le débloquer

1. Ouvre :  
   `https://console.cloud.google.com/auth/audience`  
   (bon projet sélectionné en haut)  
2. Cherche la section **Utilisateurs tests** / **Test users** (pas « Audience Workspace »)  
3. **Ajouter des utilisateurs** → ton Gmail  
4. Tu n’as **pas** besoin de Google Workspace ni de changer Interne/Externe  
5. Relance `runOnce` → **Avancé**

#### Protection avancée

Compte Google → [Sécurité](https://myaccount.google.com/security) : si **Programme de protection avancée** est actif, les scripts non vérifiés sont **refusés**. Désactive-le pour autoriser le script, ou ce chemin est impossible.

---

## Étape 7 — Déclencheur automatique

1. Apps Script → **Déclencheurs** (horloge) → **Ajouter**  
2. Fonction : `checkNewBookings`  
3. Type : **Temporel**  
4. Intervalle : **Toutes les 5 minutes** ou **10 minutes**  
5. Enregistrer  

C’est tout : chaque nouvelle invite Bookings (dans la fenêtre) → Schedule Meta.

---

## Vérification Meta

Events Manager → Pixel `1157851050245521` → **Test events** / **Overview** :

- Nom d’événement : `Schedule`  
- Source : serveur (Conversions API)  
- `custom_data.content_name` ≈ titre Google Calendar  
- Matching : email hashé si guest trouvé

---

## Dépannage

| Symptoôme | Cause probable |
|-----------|----------------|
| 401 Unauthorized | `WEBHOOK_SECRET` ≠ `BOOKING_WEBHOOK_SECRET` |
| 500 Server misconfigured | `META_CAPI_ACCESS_TOKEN` manquant |
| ICAL HTTP 401/403/404 | Mauvaise `ICAL_URL` ou mauvais calendrier — régénère l’adresse secrète |
| Aucun nouveau Schedule | 1er run = bootstrap (normal) ; ou `TITLE_INCLUDE` trop strict ; ou CREATED hors `LOOKBACK_MIN` |
| Schedule sans email | Pas d’ATTENDEE dans l’ICS — matching Meta faible |
| Trop de Schedule | Filtre `TITLE_INCLUDE` ; ou doublon avec le bouton site |
| Encore « application bloquée » | Vérifie le manifeste (étape 4b) ; pas de projet Cloud lié ; Protection avancée OFF |

Pour voir le corps exact reçu par Supabase : Dashboard → Edge Functions → `outlook-booking-meta` → Logs.

---

## Checklist

- [ ] Secrets `META_PIXEL_ID`, `META_CAPI_ACCESS_TOKEN`, `BOOKING_WEBHOOK_SECRET`  
- [ ] Function `outlook-booking-meta` déployée  
- [ ] Test PowerShell → `{ ok: true }`  
- [ ] Apps Script + propriétés + service Calendar  
- [ ] `runOnce` OK sur un événement de test  
- [ ] Déclencheur toutes les 5–10 min  
- [ ] `Schedule` visible dans Events Manager  

---

## Rappel attribution

| Signal | Attribution Pixel | Automatique |
|--------|-------------------|-------------|
| Bouton « Oui, j’ai réservé » | Bonne (navigateur) | Non |
| Apps Script (ce guide) | Moyenne (email) | Oui |
| Redirect Bookings → `/merci` | Bonne | Oui, si URL validée côté Microsoft |

Idéal long terme : redirect Bookings validée. En attendant : ce guide suffit pour un volume de `Schedule` sans Zapier.
