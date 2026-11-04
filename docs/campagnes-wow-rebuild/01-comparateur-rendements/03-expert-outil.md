# [#01] Expert outils numériques — Spec UX shippable

**Campagne :** `/campagnes/comparateur-rendements`  
**Signé :** Expert outils numériques  
**Date :** 2026-11-04  
**Live 2026-11-04 :** defaults 10 k$ / 200 $ / 10 ans / équilibré → banque **52 060 $** · modèles **64 149 $** (9,2 % au 30 juin 2026) · écart **12 088 $** · Progress **3/3** immédiat · footer PDF primaire · mid « Voir mon écart » → `/outils/comparateur-rendements`  
**Score outil WOW actuel /10 :** 6,5 → **cible ship :** 9

---

## Verdict (1 paragraphe)

L’outil livre déjà un aha chiffré en <10 s — c’est rare et précieux. Le bug conversion : à 3/3, le **next step** est le PDF (`statusDetail` + `ToolDownloadPdf` plein), pas le RDV ; le scénario signature ads (50 k$ · 20 ans) est absent ; aucun event `…_result` ; la fuite mid casse le funnel UTM. Spec ci-dessous = shippable, fichiers JSX exacts, PDF secondaire, climax monétisé.

---

## 1. Architecture UX cible (funnel)

```
Hero « Voir mon écart » → #outil
  → Chiffres (+ chip mythe one-tap)
  → Profil + taux (préréglage ou relevé)
  → Climax : barres + Écart illustratif (motion)
  → Soft close chiffré + CTA RDV (≤2 s)
  → PDF outline (optionnel)
→ Mid navy (ctaHeadline) + Ajuster #outil
→ FAQ / disclaimer
```

---

## 2. Defaults & presets

### Defaults actuels (garder comme arrivée « douce »)
```js
montantInitial: '10000'
cotisationMensuelle: '200'
annees: '10'
profil: 'equilibre'
```
**Pourquoi garder :** aha immédiat (~12 k$ live) sans formulaire.  
**Contrepartie :** Progress 3/3 spoil — traiter via UI (voir §4), pas en vidant les champs (sinon Ad1 « tu joues tout de suite » casse).

### Chip preset mythe (P0)
| Champ | Valeur |
|-------|--------|
| Montant | `50000` |
| Cotisation | `0` |
| Années | `20` |
| Profil | `equilibre` |
| Taux banque | reset préréglage (`applyProfil('equilibre')` / `setTauxBanqueManuel(false)`) |

**UI :** bouton chip sous Block « Tes chiffres »  
`Essayer le scénario 50 k$ · 20 ans (mythe)`  
**Optionnel 2ᵉ chip :** `Revenir au départ (10 k$ · 10 ans)` pour rejouer le 1er aha.

**Fichier :** `ComparateurRendementsTool.jsx` L148–168 + Block L330–404.

---

## 3. Climax WOW — hiérarchie chiffres

### Ordre de lecture (haut → bas) quand `milestones[2].done`
1. **Écart illustratif** (`ResultCard` emphasize) — hero du résultat  
2. Barres Banque / Modèles  
3. Cards totaux (banque / modèles) — peuvent passer **sous** l’écart (swap order P1) ou rester au-dessus si motion M1 sur écart suffit (P0 = garder order, amplifier écart)  
4. Soft close RDV  
5. PDF outline  

### Spec P0 (sans reorder lourd)
- Après `ResultCard` écart (L569–575) :  
  - Phrase narration composition (script)  
  - CTA `Link` → `buildCampagneRdvPath('comparateur-rendements')`  
  - `trackRendezVousClick('campagne_comparateur-rendements_rdv_tool')`  
  - Classes : `rounded-full bg-primary text-white px-8 py-3.5` (primaire)  
- `statusDetail` (L222–227) → soft close chiffré, **pas** « Télécharge le PDF… »  
- Footer : RDV primaire **ou** status alone + PDF outline à droite  

### `ecartFontScale`
Garder L91–97. S’assurer que le scale se voit aussi sur scénario 20 ans (écarts plus gros → plafonner 2× OK).

### Progress
À 3/3 : réduire `text-2xl` → `text-xl` ; ligne résumé écart sous barre OK (L319–326) mais **ne pas** voler le climax — c’est un teaser, le wow reste le `ResultCard`.

---

## 4. Pont résultat → RDV (PDF secondaire)

### Footer outil — Avant → Après

| Avant | Après |
|-------|-------|
| « C’est prêt. Télécharge le PDF… » + `ToolDownloadPdf` plein primary | Soft close « ≈ {écart} … 15 min… » + bouton RDV primary + `ToolDownloadPdf` `variant="outline"` label « Garder mon résumé PDF » |

### `ToolDownloadPdf` — extension shell
Fichier : `CampagneToolShell.jsx` L47–59  
Ajouter prop `variant = 'primary' | 'outline'` :
- `outline` : `border border-primary/30 bg-transparent text-primary hover:bg-primary/5` (pas `bg-primary`)

### PDF contenu (`handleDownload` L229–281)
| Avant | Après |
|-------|-------|
| `Resume — banque vs modeles` (ASCII) | `Résumé — banque vs modèles` |
| Sections sans accents | Accents FR partout (`entrées`, `années`, `Écart illustratif`, etc.) |
| Notes courtes | Notes = méthodo ads : Classique 75/75 · `asOfLabel` · préréglages illustratifs · produits différents · passés ≠ futurs · pas conseil personnalisé |

### Import manquant aujourd’hui
Le soft close RDV dans l’outil nécessite :
```js
import { Link } from 'react-router-dom';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackRendezVousClick } from '../../../lib/analytics';
```
Passer `location.search` via `useLocation()` pour conserver UTM.

---

## 5. Champs / modules à ajouter

| Module | Priorité | Spec | Fichier |
|--------|----------|------|---------|
| Chip mythe 50k/20ans | P0 | §2 | `ComparateurRendementsTool.jsx` |
| Soft close RDV sous écart | P0 | §3–4 | idem |
| Narration 2–3 % | P0 | 1 `<p>` sous écart | idem |
| Event `_result` | P0 | §6 | idem |
| Ancre `#outil` | P0 | `id="outil"` sur wrapper tool | `CampagneAdsLanding.jsx` |
| Coupe fuite mid | P0 | `#outil` ou retirer 2ᵉ CTA ; brancher `secondaryIsTool` | `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` L197–208 |
| Dual CTA hero | P0 | scroll `#outil` + RDV ghost | `CampagneAdsLanding.jsx` |
| Module preuve landing | P1 | table 5 profils + ligne 20 ans calculée | landing + `comparateurRendementsRates.js` / `getIaPct` |
| Reorder résultat (écart d’abord) | P1 | swap grid | tool |
| Sticky mini-écart mobile | P2 | fixed bottom | tool |
| Invite « saisis ton taux » highlight | P1 | pulse border 1× sur `#cmp-taux-banque` après climax si `!tauxBanqueManuel` | tool |

---

## 6. Analytics events

| Event | Quand | `item_id` / params |
|-------|-------|-------------------|
| `view_item` | Mount landing | `campagne_comparateur-rendements` *(existe)* |
| `select_content` tool focus | `onFocusCapture` | `campagne_comparateur-rendements_tool` *(existe)* |
| **`select_content` result** | 1× quand `milestones[2].done` passe false→true | `content_type: 'tool_result'`, `item_id: 'campagne_comparateur-rendements_result'`, optional `value: Math.round(ecart)` |
| `select_content` preset mythe | click chip | `campagne_comparateur-rendements_preset_mythe` |
| RDV hero | click | `campagne_comparateur-rendements_rdv` |
| RDV tool | click | `campagne_comparateur-rendements_rdv_tool` **(nouveau)** |
| RDV mid | click | `campagne_comparateur-rendements_rdv_mid` |
| PDF | existant hook | `campagne_comparateur-rendements_pdf` |
| Hero primaire outil | click scroll | `campagne_comparateur-rendements_hero_outil` |

Implémentation `_result` : `useEffect` + `useRef` firedOnce quand `doneCount >= 3`.

---

## 7. Shell vs spécifique

### Shell générique (réutilisable 15 campagnes)
1. Dual CTA hero (primary scroll / secondary RDV) — data-driven  
2. `ctaHeadline` / `ctaSubline` sur branche **RDV** mid (pas seulement form)  
3. `secondaryIsTool` : si true → `<a href="#outil">` ou `button` scroll, **pas** `Link` vers `apprendrePath` externe  
4. `ToolDownloadPdf` variant outline  
5. Intro outil overridable via `item.toolIntro` (optionnel)

### Spécifique #01
- Chip mythe, narration composition, soft close chiffré, PDF notes Classique, module preuve, rates live

**Bug actuel :** `secondaryIsTool: true` est déclaré (L210) mais **jamais lu** dans `CampagneAdsLanding.jsx` — le mid Link va toujours à `/outils/comparateur-rendements`. À brancher.

---

## 8. Fichiers JSX exacts à toucher

| Fichier | Changements |
|---------|-------------|
| `frontend/src/components/campagne/tools/ComparateurRendementsTool.jsx` | chip, soft close RDV, narration, statusDetail, PDF FR+notes, event `_result`, motion optionnelle |
| `frontend/src/components/campagne/CampagneToolShell.jsx` | `ToolDownloadPdf` variant |
| `frontend/src/pages/CampagneAdsLanding.jsx` | `#outil`, dual CTA, intro, mid `ctaHeadline`/`ctaSubline`, `secondaryIsTool` |
| `frontend/src/data/campagneAdsLandings.js` | copy + flags CTA |
| `frontend/src/data/comparateurRendementsRates.js` | helper projection preuve si besoin (sinon inline tool formula) |
| `emails/campagne-meta-catalog/comparateur-rendements.md` | Ad2 (hors JSX) |

**Ne pas toucher** (sauf bug) : formule `futureValueMonthly`, `ecartFontScale`, hook `useModelPortfolioReturns`.

---

## 9. Critères acceptation outil

- [ ] En <10 s : écart visible sans remplir (defaults OK).
- [ ] One-tap mythe 50 k$ / 20 ans recrée le wow « détail → somme ».
- [ ] ≤2 s après lecture de l’écart : CTA RDV visible (même viewport mobile si possible).
- [ ] PDF n’est plus le bouton le plus saturé.
- [ ] Aucun lien mid vers `/outils/comparateur-rendements`.
- [ ] Event `_result` fire 1× par session outil complété.
- [ ] UTM conservés sur tous les liens Bookings.
