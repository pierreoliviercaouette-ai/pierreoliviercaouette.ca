# [#12] Travailleur autonome — Expert outils numériques

**Slug :** `/campagnes/travailleur-autonome`  
**Fichier cœur :** `frontend/src/components/campagne/tools/AutonomeChecklistTool.jsx`  
**Shell :** `CampagneToolShell.jsx`, `CampagneAdsLanding.jsx`, `campagneAdsLandings.js`  
**Date :** 2026-11-04  
**Objectif :** coche → climax `Mince`/`nextItem` collé → soft RDV en <2 s · PDF secondaire

---

## 1. Diagnostic UX actuel

| Problème | Preuve code | Effet |
|----------|-------------|-------|
| Insight avant checklist | Bloc L304–405 **avant** L407–511 | Yo-yo mobile ; climax froid |
| PDF doublé | Header Ton filet L314–320 + footer L267–271 | Trophy > conversation |
| Pas de RDV dans l’outil | Footer PDF only | Bridge WOW→RDV cassé |
| Copy collective en boucle | `statusDetail` / `filetDetail` / barre | Ad2 sous-joué |
| Faux trous `vie` / `rc` | `missingOrdered` = tous ITEMS non cochés | Peur diluée |
| Accents PDF ASCII | `Resume`, `Etat`, `etape` | Qualité perçue ↓ |
| Events | focus outil + PDF ; pas progress / filet | Retarget faible |

**Note outil WOW actuelle /10 :** 5,5

---

## 2. Architecture UX cible (ordre DOM)

```
CampagneToolShell
├─ Progression (done/total + barre + 1 ligne ordre)
├─ Checklist 4 piliers + Notes
├─ Ton filet
│  ├─ ResultCard État + ResultCard Prochaine étape
│  ├─ Trous restants (si doneCount > 0 && missing)
│  ├─ Mini piliers 4 colonnes
│  └─ SoftCloseRdvStrip (si missingCount ≥ 1 && doneCount ≥ 1)
└─ footer: statusDetail + ToolDownloadPdf (seul PDF)
```

**Defaults :** tout décoché (`INITIAL_CHECKED` false) — **garder**.  
**À l’arrivée :** ne pas montrer strip RDV ni liste Trous tant que `doneCount === 0` (éviter warn + PDF avant geste).  
Option P0 : si `doneCount === 0`, ResultCards restent visibles **sous** la checklist (pas au-dessus) avec copy « Coche pour voir ton filet se remplir » — ou masquer les ResultCards jusqu’à la 1ʳᵉ interaction (`hasInteracted`).

**Recommandation P0 :**  
- Toujours afficher Progression en tête.  
- Checklist immédiatement après.  
- Bloc Ton filet **après** checklist.  
- Si `doneCount === 0` : ResultCards en tone default « À construire » OK (déjà sous les cases) + **pas** de liste Trous + **pas** de soft RDV + **pas** de PDF dans ce bloc.

---

## 3. Climax WOW

### Chiffre / état hero
- **`filetValue`** : `À construire` → `Mince` → `En cours` → `Solide` (seuils inchangés : 0 / <3 / <6 / ≥6)
- **`nextItem.short`** en ambre (ResultCard tone warn)
- Liste Trous : item #1 badge « en premier »

### Narration (voir script)
Remplacer boucle collective par **mois mauvais** dans `statusDetail` / `filetDetail`.

### Pont émotion → RDV (<2 s)
Dès `doneCount >= 1 && missingCount >= 1`, strip sous Trous :

```jsx
// pseudo
<p>{softCloseLine(filetValue, nextItem, missingCount)}</p>
<Link
  to={buildCampagneRdvPath('travailleur-autonome', location.search)}
  onClick={() => trackRendezVousClick('campagne_travailleur-autonome_rdv_tool')}
>
  Clarifier : {nextItem.short} en 15 min
</Link>
<p className="text-xs">Clarifier ≠ acheter · sans pression</p>
```

Imports à ajouter : `Link` + `useLocation` (react-router), `buildCampagneRdvPath`, `trackRendezVousClick`.

---

## 4. Toggles contexte (hypo / RC) — P1

### State
```js
const [hasHypoOrDependents, setHasHypoOrDependents] = useState(true); // ou null = « pas encore dit »
const [needsRc, setNeedsRc] = useState(null); // null | true | false
```

### UI (sous Progression, avant piliers)
- Toggle / segment : « Hypothèque, conjoint ou enfants ? » Oui / Non  
- Toggle : « Ton métier exige une assurance responsabilité ? » Oui / Non / Je sais pas

### Logique `relevantItems`
```js
const relevantItems = ITEMS.filter((item) => {
  if (item.id === 'vie' && hasHypoOrDependents === false) return false;
  if (item.id === 'rc' && needsRc === false) return false;
  return true;
});
```

- `doneCount` / `total` / `missingOrdered` / PDF / piliers : basés sur `relevantItems`
- Si `vie` N/A : pilier proches = 0 items → masquer pilier ou label « N/A — pas d’hypo / proches à charge »
- Si `rc` N/A : retirer de structure total
- PDF : section « Non applicable » listant vie/rc exclus

**P0 sans toggles :** garder 7 cases mais **descendre** `rc` en dernier (déjà) et soft-copy hint ; toggles = P1 pour qualité trous.

---

## 5. PDF

| Règle | Spec |
|-------|------|
| Boutons | **1 seul** — footer `CampagneToolShell` |
| Accents FR | Résumé / État / Prochaine étape / À faire / cochés |
| Note | « Apporte ce résumé aux 15 min si tu veux » |
| Event | garder `campagne_travailleur-autonome_pdf` |
| Quand `doneCount >= 6` | `statusDetail` ne pousse plus le download comme seul next step ; mentionner PDF **et** revalidation / RDV soft |

---

## 6. Events analytics

| Event `item_id` / name | Quand | Props utiles |
|------------------------|-------|--------------|
| `campagne_travailleur-autonome_tool` | focus capture (existant shell) | — |
| `campagne_travailleur-autonome_progress` | `doneCount` atteint 1 et 3 (throttle / once each) | `{ doneCount, filetValue }` |
| `campagne_travailleur-autonome_filet_mince` | première fois `filetValue === 'Mince'` après interaction | `{ next: nextItem?.id }` |
| `campagne_travailleur-autonome_rdv_tool` | clic soft CTA outil | via `trackRendezVousClick` |
| `campagne_travailleur-autonome_pdf` | download (existant) | — |
| `campagne_travailleur-autonome_outil_hero` | clic CTA hero `#outil` | shell |
| `campagne_…_rdv` / `_rdv_mid` | existants | — |

Implémentation progress : `useRef` set des seuils déjà envoyés.

---

## 7. Fichiers à toucher

| Fichier | Changements |
|---------|-------------|
| `AutonomeChecklistTool.jsx` | Réordonner DOM ; soft RDV ; copy climax ; 1 PDF ; accents FR ; events ; (P1) toggles |
| `campagneAdsLandings.js` | promise, bullets, faq, cta labels, ctaHeadline/Subline, apprendrePath |
| `CampagneAdsLanding.jsx` | Dual CTA hero ; mid data-driven (`ctaHeadline`/`ctaSubline`) ; (P1) 2e lien Apprendre |
| `CampagneToolShell.jsx` | Aucun sauf si footer flex déjà OK |
| Tests | Si existants pour outils campagne — ajouter smoke order + CTA |

---

## 8. Spec soft-close strip (composant local)

Pas besoin d’un fichier séparé P0 — fonction interne `SoftCloseAutonome` dans le même JSX.

**Visibilité :** `doneCount >= 1 && missingCount >= 1`  
**Accessibilité :** lien focusable ; phrase résultat en `<p>` avant le lien  
**Mobile :** CTA `w-full` ; pas de double sticky

---

## 9. Critères acceptation outil

- [ ] Ordre : Progression → cases → Ton filet → soft RDV → PDF footer
- [ ] Après 1–2 « non » sur urgence/factures : `Mince` + « Fonds d’urgence » visibles sans scroll-up
- [ ] Clic « Clarifier : Fonds d’urgence en 15 min » → Bookings + event `_rdv_tool`
- [ ] Un seul bouton PDF
- [ ] PDF accents FR corrects
- [ ] Events progress 1 & 3 + filet_mince once
- [ ] Defaults toujours tout décoché

**Note cible outil WOW /10 :** ≥ 8,5
