# [#03] Expert outils numériques — Hypothèque + assurance vie

**Slug :** `/campagnes/hypotheque-assurance-vie` (+ aliases `assurance-hypothecaire`, etc.)  
**Date :** 2026-11-04  
**Composant :** `AssuranceHypothecaireTool.jsx` (~488 L)  
**Alias déprécié :** `HypothequeVieTool.jsx` (re-export — ne pas dual-maintenir)  
**Note outil WOW actuelle /10 :** 6 → **cible :** 9

---

## 1. Job unique de l’outil

**Climax conversion = écart solde → capital famille** (`auDelaDuPret` / `capitalFamille`), pas le ×2 coût relatif prêteur.

Ordre mental du prospect post-Meta : « chiffre les proches » → **estimateur first** → comparatif en approfondissement.

---

## 2. Defaults (garder — déjà bons)

| Champ | Default | Rôle |
|-------|---------|------|
| Solde | `350000` | Ancre solde + base capital |
| Années | `20` | Mi-parcours année 10 |
| Prime | `45` | Déclenche ratio ×2,0 |
| Autres dettes | `10000` | |
| Remplacement mensuel | `3000` | |
| Mois | `24` | |
| Coussin | `15000` | |

**Résultat attendu defaults :**  
`capitalFamille = 447 000` · `auDelaDuPret = 97 000` · `ratio ≈ 2,0` · `balanceMid = 175 000`

Ne pas dramatiser davantage les defaults ; le WOW vient de la **hiérarchie UI**, pas de chiffres gonflés.

---

## 3. Architecture UX cible (sections)

```
[Inputs solde / années / prime]
[Mini cards prêteur ×ratio + perso]          ← aha secondaire (garder)
[§ Estimateur famille : 4 champs]            ← FIRST (était §2)
[Climax : ResultCards + bandeau gap + barre] ← WOW
[Soft close inline RDV + PDF ghost]          ← pont 2 s
[<details> Tableau 5 critères]               ← SECOND (était §1)
[Disclaimer]
```

### Titre / intro shell
- Title : `Banque vs famille : chiffre l’écart, puis compare`
- Intro : voir script expert

---

## 4. Climax WOW — hiérarchie chiffres

### Avant
- 2 `ResultCard` égales `text-2xl`
- `Dont 97 000 $…` en `detail` taupe sm

### Après (shippable)

1. Grid results : solde (tone default) | capital famille (tone `warn`, value plus grande si possible via prop `size="lg"` ou classe locale `text-3xl`)
2. **Bandeau gap** pleine largeur sous les cards :
   - Label : `Écart illustratif : +{formatCad(auDelaDuPret)} au-delà du prêt`
   - Micro : `C’est souvent ça qu’on clarifier en 15 minutes — sans pression.`
   - Barre : `width% = auDelaDuPret / capitalFamille` (si capitalFamille > 0)
3. Afficher bandeau seulement si `auDelaDuPret > 0`

### Calc déjà OK
```js
auDelaDuPret = dettes + (remp * mois) + coussin
capitalFamille = balance + auDelaDuPret
balanceMid = round(balance * 0.5)  // illustration — disclaimer obligatoire
```

**Ne pas** remplacer `* 0.5` par un vrai amortissement dans ce sprint (effort L + risque précision) — clarifier disclaimer.

---

## 5. Tableau comparatif — friction mobile

### Avant
5 rangées toujours ouvertes + checkboxes « Lu » + compteur footer

### Après
- Wrapper `<details className="…">` + `<summary>Approfondir : banque vs protection personnelle</summary>`
- Sur mobile : option A (recommandée) — tout dans details fermé par défaut post-gap  
  option B — 1ère rangée (`beneficiaire`) visible, bouton « Voir les 4 autres »
- Checkboxes « Lu » : **optionnel** — si on garde, ne plus piloter le footer (le footer cite l’écart, pas les points lus)
- Footer copy :  
  `Ton illustration : {formatCad(solde)} vs {formatCad(capitalFamille)}`

---

## 6. Pont résultat → RDV (PDF secondaire)

### Footer shell (remplace L229–237)

```
[ Texte chiffré solde vs capitalFamille ]
[ Link RDV outline primary — « Clarifier banque vs famille (15 min) » ]
[ ToolDownloadPdf ghost / secondary ]
```

### Wiring
```js
import { Link, useLocation } from 'react-router-dom';
import { buildCampagneRdvPath } from '../../../data/campagneAdsLandings';
import { trackRendezVousClick } from '../../../lib/analytics';

const location = useLocation();
const rdvPath = buildCampagneRdvPath('hypotheque-assurance-vie', location.search);

// onClick
trackRendezVousClick('campagne_hypotheque-assurance-vie_rdv_outil');
```

- Style RDV : `rounded-full border-2 border-primary bg-white text-primary` (outline) **ou** solid primary si PDF passe en ghost `border`/`text-primary`
- PDF : style ghost ; label inchangé
- Placement : **immédiatement sous le bandeau gap** (idéal) **et/ou** footer shell — au minimum footer ; préférer bloc CTA inline post-gap + PDF en footer

### Landing mid
- Brancher `item.ctaHeadline` / `item.ctaSubline` dans `CampagneAdsLanding.jsx` (~L182–187) comme le form MRa
- Event existant : `campagne_${slug}_rdv_mid` — OK
- Hero primaire : `scrollIntoView` / `href="#outil"` — wrapper outil `id="outil"`

---

## 7. Copy tool à patcher (lignes approx.)

| Loc | Avant | Après |
|-----|-------|-------|
| L227–228 | compare, puis chiffre | chiffre, puis compare |
| L285–286 | prime peut rester semblable | semblable **ou revue au renouvellement\*** |
| L324–380 | §1 tableau ouvert | déplacé en `<details>` post-estimateur |
| L382–476 | §2 estimateur | devient §1 / first |
| L460–476 | cards égales | + bandeau gap |
| L229–237 | points lus + PDF | écart + RDV + PDF ghost |
| PDF strings L174–221 | accents manquants | `hypothécaire`, `Années`, `Coût`, `imprévus`, `créancier`, `éducative` |

---

## 8. Analytics events

| Event | Quand | item_id / name |
|-------|-------|----------------|
| `select_content` tool focus | déjà landing | `campagne_hypotheque-assurance-vie_tool` |
| `trackRendezVousClick` | CTA hero | `campagne_hypotheque-assurance-vie_rdv` |
| `trackRendezVousClick` | mid navy | `…_rdv_mid` |
| `trackRendezVousClick` | **nouveau** post-gap / footer | `…_rdv_outil` |
| PDF | `useCampagneToolPdf('campagne_assurance-hypothecaire_pdf')` | garder (alias historique OK) |

Optionnel P2 : `select_content` quand bandeau gap entre dans le viewport (`item_id: …_gap_view`).

---

## 9. Fichiers exacts à toucher

| Fichier | Scope |
|---------|--------|
| `frontend/src/components/campagne/tools/AssuranceHypothecaireTool.jsx` | **Principal** — ordre, gap, RDV, renouvellement*, PDF accents |
| `frontend/src/components/campagne/tools/HypothequeVieTool.jsx` | Aucun (re-export) |
| `frontend/src/components/campagne/tools/index.js` | Vérifier slugs (déjà OK) |
| `frontend/src/pages/CampagneAdsLanding.jsx` | `#outil`, dual CTA hero, mid `ctaHeadline`/`ctaSubline`, intro outil |
| `frontend/src/data/campagneAdsLandings.js` | promise, bullets, faq×5, ctaHeadline/Subline |
| `frontend/src/components/campagne/CampagneToolShell.jsx` | Seulement si besoin slot CTA générique (sinon tout dans footer prop) |

---

## 10. Critères acceptation outil

- [ ] Avec defaults, le bandeau `+97 000 $` est visible sans ouvrir le tableau
- [ ] CTA RDV apparaît ≤2 s de scroll après le climax (même viewport idéalement)
- [ ] PDF n’est plus le seul next step
- [ ] Event `…_rdv_outil` fire au clic
- [ ] Mobile 390 px : estimateur + gap avant tout mur de critères
- [ ] Phrase renouvellement* présente côté prêteur
