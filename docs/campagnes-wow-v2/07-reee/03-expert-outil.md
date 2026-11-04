# [#07] REEE — Expert outils numériques

**Slug :** `/campagnes/reee`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/ReeeTool.jsx`  
**Focus V2 :** climax regret-first + champ `sceeDejaRecues` — **pas** le pont RDV (SoftClose déjà livré)

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|---------:|---------:|---------:|
| WOW outil | 7 | 8 | ≥ 9 |
| Narration regret | 5 | 7,5 | ≥ 9 |
| Persona « compte ouvert » | 4 | 5 | ≥ 8 |

**Top 1 gap :** `laisseSurTable` calculé + bandeau P0, mais **total toujours first** ; aucun seed SCEE déjà reçues → parent banque sous-estimé / room faux.

**SoftClose :** `ToolSoftClose` en footer sous climax — **placement OK**. Ne pas re-spécifier. Ne pas inventer bandeau custom.

---

## 1. Climax P1 — regret-first

### Hiérarchie quand `laisseSurTable > 0` && !`plafondAtteint`
1. **Bandeau `laisseSurTable`** dominant (`font-heading text-3xl sm:text-4xl text-primary`) — **premier** dans le bloc résultat  
2. Barre plafond (déjà en haut outil — garder)  
3. `totalIllustratif` secondary (`text-xl sm:text-2xl`)  
4. Grille support cotisé / SCEE — **retirer** la 3e cellule « Encore possibles » (doublon) → 2 cols ou garder 3e grisée inactive

### Quand `plafondAtteint`
Amber headline max (inchangé) → SoftClose « valider cadre ».

### `buildLecture` headline
| Avant P0→P1 partiel | Après V2 |
|---------------------|----------|
| Si regret : `Il resterait encore ~X avant le max` (OK) | Garder ; si `sceeDeja > 0` : `Avec ce que t’as déjà, il resterait encore ~X $` |
| Total first dans le DOM | **DOM :** bandeau regret **avant** le gros total |

### Motion in-tool
- Keyed bandeau : `key={\`regret-${laisseSurTable}\`}` + helper fade shell  
- Barre : `transition-all duration-500` (existant)  
- Pas de lib motion solo

---

## 2. Champ `sceeDejaRecues` (P1 cœur)

### State
```js
const [sceeDejaRecues, setSceeDejaRecues] = useState('0');
// clamp 0 … SCEE_PLAFOND_VIE (7200)
```

### `projeterReee` — contrat
```js
projeterReee(cotisationAnnuelle, annees, tauxRendement = 0, sceeDejaRecues = 0)
// totalSubventions starts at clamp(sceeDeja, 0, PLAFOND)
// room = max(0, PLAFOND − totalSubventions) each year
// laisseSurTable = max(0, PLAFOND − final totalSubventions)
```

### UI
- Nouveau mini-block **« Déjà en place »** entre Block 1 (enfant) et Block 2 (épargne)  
  **ou** Field full-width en tête de Block 2  
- `type="number"` min 0 max 7200 step 100  
- Hint script (solde ≠ SCEE)  
- PDF row « SCEE déjà reçues » dans « Tes entrées »  
- Event (1× session quand seed > 0 et lecture ready) :  
  `campagne_reee_scee_deja` · `value: sceeDeja`

### Defaults
Garder âge 5 / 2500 / 12 / rendement off.  
`sceeDejaRecues = 0` → defaults restent `laisseSurTable = 1200` (régression zéro).

### Scénarios QA
| Entrées | Attendu |
|---------|---------|
| Defaults | laisse 1 200 $ ; regret-first DOM |
| sceeDeja 3 000 + 2 500 × 12 | room réduit ; headline « Avec ce que t’as déjà… » |
| sceeDeja 7 200 | plafond immédiat / room 0 |
| preset 1 000 $ | callout sous-max P0 intact |

---

## 3. SoftClose placement

Déjà sous climax via `footer={<ToolSoftClose …/>}`.  
**Action V2 :** aucune — sauf s’assurer que le bandeau regret-first précède toujours le footer dans le scroll émotionnel (déjà le cas).

Portrait : **shell mid** (pas custom dans `ReeeTool`) sauf si catalogue standardise prop `portrait` sur `ToolSoftClose` — alors utiliser le slot partagé.

---

## 4. Analytics (ajouts V2)

| Event | Quand | item_id / value |
|-------|-------|-----------------|
| Existant climax | laisse > 0 + lecture | `campagne_reee_laisse_sur_table` |
| Existant sous-max | callout | `campagne_reee_sous_max_annuel` |
| **NEW** | seed > 0 + lecture 1× | `campagne_reee_scee_deja`, value = $ |
| RDV outil | SoftClose click | `campagne_reee_rdv_outil` (existant) |

---

## 5. Fichiers exacts

| Fichier | Quoi V2 |
|---------|---------|
| `frontend/src/components/campagne/tools/ReeeTool.jsx` | Regret-first DOM · `sceeDejaRecues` · `projeterReee` seed · PDF row · event · grille 2 cols |
| `frontend/src/data/campagneAdsLandings.js` | `atmosphere` · `heroExtras` · `processSteps` (copy script) |
| `frontend/src/pages/CampagneAdsLanding.jsx` | Brancher process + heroExtras + portrait mid (**shell**) |
| `frontend/src/components/layout/PageHero.jsx` | Prop `atmosphere` CSS (**shell**) |
| `frontend/src/components/campagne/CampagneToolShell.jsx` | Portrait slot SoftClose **seulement si** pattern catalogue — sinon mid landing |

**Hors scope V2 (P2) :** toggle $/mois, IQEE ligne séparée, multi-enfants modèle.

---

## 6. Critères acceptation outil

- [ ] Defaults : regret ~1 200 $ **au-dessus** du total dans le bloc résultat  
- [ ] `sceeDejaRecues` borne 0–7200 ; seed change `laisseSurTable`  
- [ ] SoftClose reste `ToolSoftClose` shared — PDF ghost  
- [ ] Event `scee_deja` + `laisse_sur_table`  
- [ ] Aucun SoftClose one-off
