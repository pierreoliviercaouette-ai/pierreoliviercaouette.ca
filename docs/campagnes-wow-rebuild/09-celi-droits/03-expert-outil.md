# [#09] CELI droits — Spec OUTIL (UX shippable)

**Slug :** `/campagnes/celi-droits`  
**Rôle :** Expert outils numériques  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/CeliDroitsTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · landing `CampagneAdsLanding.jsx` · data `campagneAdsLandings.js`  
**Dette #1 :** sélecteur usage Urgence / Projet / Long terme (**absent** — ads + bullet 3 + `buildLecture` string only)

---

## 1. Job de l’outil (1 ligne)

Estimer la **place restante CELI** (ordre de grandeur) → faire **choisir un usage** → soft-close **RDV 15 min** (PDF secondaire).

---

## 2. Defaults & ownership

| Champ | Default actuel | Spec |
|-------|----------------|------|
| Année naissance | `1992` | Garder (aha Meta : ~104k cumulés → ~84k place) |
| Déjà cotisé | `20000` | Garder |
| Cotisation année | `7000` | Garder |
| Usage | — | `null` au load |

### Badge Exemple + reset
- State `isExample = true` tant qu’aucun champ (naissance / déjà / prévu) n’a été édité par l’user.
- UI : pill `Exemple` près du titre shell ou au-dessus Block 1.
- Bouton texte `Partir de zéro` → vide les 3 champs, `usage=null`, `isExample=false`.
- Au premier `onChange` user → `isExample=false`.

**Pourquoi :** defaults = WOW Meta ; badge = ownership « c’est pas forcément moi ».

---

## 3. Climax WOW — hiérarchie chiffres

Ordre visuel (haut → bas) après steps 1–2 :

1. **Split contraste Ad1**  
   - Gauche : `Plafond {ANNEE_COURANTE}` → `formatCad(plafondAnnuel)` (ex. 7 000 $)  
   - Droite (dominant) : `Place restante estimée` → `formatCad(placeRestante)` (`text-3xl sm:text-4xl`)
2. **Detail ligne** (cumulés · déjà · année 18) — garder version courte
3. **Chips usage** (voir §4) — **avant** la liste `lecture.points`
4. Points lecture (branchés usage)
5. ResultCards cotisation possible / place après
6. Soft close RDV (§5)
7. « À retenir » (optionnel compressé)
8. Footer : status + PDF ghost (si soft close déjà dans body, footer = PDF only OK)

Motion : reveal léger sur le gros $ (§ visuel).

---

## 4. Module P0 — Sélecteur usage

### State
```js
const [usage, setUsage] = useState(null); // 'urgence' | 'projet' | 'long_terme' | null
```

### UI
- `role="radiogroup"` + 3 `role="radio"` (accessibilité)
- Labels : voir `02-expert-script.md`
- Placement : sous split contraste / gros $, **au-dessus** des bullets lecture
- Visible si `!depassement && placeRestante > 0` ; si place ≤ 0 ou dépassement → masquer chips, soft close « vérifier ARC »

### Branchements
| Surface | Comportement |
|---------|--------------|
| `buildLecture(result, usage)` | Point usage spécifique ; retirer string générique L210–212 si chip actif |
| Soft close copy | Cite label usage |
| PDF section | Row `Usage choisi` |
| Milestone optionnel | `usage` done → 4e mini-step **ou** garder 3 steps + chip hors milestone |
| Analytics | `trackEvent('select_content', { content_type: 'tool_usage', item_id: 'campagne_celi-droits_usage_'+usage })` au click chip |

### Non-objectifs
- Pas de % d’allocation multi-usages
- Pas de calcul rendement
- Pas d’obligation de chip pour afficher le $ (chip = pont intention → RDV)

---

## 5. Soft close RDV (≤2 s post-climax)

### Dans l’outil (prioritaire)
Bloc navy sous ResultCards (ou header du `footer`) :

```jsx
<Link
  to={rdvPath} // buildCampagneRdvPath('celi-droits', search)
  onClick={() => trackRendezVousClick('campagne_celi-droits_rdv_outil')}
>
  {/* label dynamique script */}
</Link>
<ToolDownloadPdf … variant ghost / className outline />
```

- Importer `trackRendezVousClick` depuis `../../../lib/analytics`
- Importer `Link` + `useLocation` + `buildCampagneRdvPath`
- **PDF n’est plus le CTA primary** du footer (`ToolDownloadPdf` : outline / secondary)

### statusDetail
Remplacer orientation 100 % PDF (L307–311) par textes script §2.

---

## 6. Lien ARC + pastille

- Constante :
  `ARC_DOSSIER_URL = 'https://www.canada.ca/fr/agence-revenu/services/services-electroniques/services-electroniques-particuliers/dossier-particuliers.html'`
- Helper inline : `ArcLink` → `target="_blank" rel="noopener noreferrer"`
- Appliquer : intro (1×), disclaimer, points « ouvre Mon Dossier ARC », statusDetail
- Pastille « Sans compte · sans formulaire · estimation » dans header shell (sous intro) **ou** via data landing au fold

---

## 7. PDF

- Accents FR (voir script)
- Section Usage
- Notes : estimation ; ARC fait foi ; cotisations ≠ solde ; **+** « Retraits : droits souvent rétablis l’année suivante — non modélisés ici » (finance)
- Note soft RDV
- Event existant : `useCampagneToolPdf('campagne_celi-droits_pdf')` — garder

---

## 8. Events analytics

| Event | Quand |
|-------|-------|
| `view_item` / focus tool | déjà landing |
| `select_content` tool | déjà `onFocusCapture` |
| `select_content` `campagne_celi-droits_usage_{id}` | chip |
| `trackRendezVousClick('campagne_celi-droits_rdv_outil')` | CTA soft close outil |
| `campagne_celi-droits_rdv` / `_rdv_mid` | hero secondaire / mid (existants) |
| PDF | hook existant |

---

## 9. Shell landing (dépendances)

| Change | Fichier | Effort |
|--------|---------|--------|
| `id="outil"` sur section outil | `CampagneAdsLanding.jsx` | S |
| Hero dual CTA si `item.heroCta === 'outil'` | `CampagneAdsLanding.jsx` + data | S–M |
| Mid RDV lit `ctaHeadline` / `ctaSubline` | `CampagneAdsLanding.jsx` ~L181–187 (aujourd’hui hardcodé) | S |
| Props data celi-droits | `campagneAdsLandings.js` | S |

---

## 10. Backlog implémentation outil (ordre)

1. State `usage` + chips + `buildLecture(result, usage)`  
2. Split plafond vs place  
3. Soft close RDV + `trackRendezVousClick` + PDF secondary  
4. Badge Exemple + reset  
5. ArcLink + pastille  
6. PDF FR + usage + note retraits  
7. (Shell) `#outil` + hero dual + mid data-driven  

---

## 11. Critères acceptation OUTIL

- [ ] Scénario default : place ~84 000 $ visible + contraste vs 7 000 $
- [ ] 3 chips sélectionnables ; lecture + soft close + PDF réagissent
- [ ] CTA RDV dans l’outil avec event `_rdv_outil` **avant**/à côté PDF
- [ ] Badge Exemple sur defaults ; reset fonctionne
- [ ] Aucune régression calcul (cumules, placeRestante, coupe plafond annuel, dépassement)
- [ ] Mobile : chips tappables, soft close stack OK

**Note WOW chiffre :** déjà ~7/10 → **conversion outil→RDV cible ≥7/10** (baseline ~3/10)
