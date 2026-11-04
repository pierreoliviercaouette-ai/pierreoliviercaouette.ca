# [#13] Plan global — Expert outils numériques

**Slug :** `/campagnes/plan-global`  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/PlanGlobalTool.jsx` (~326 L)  
**Shell / data :** `CampagneToolShell.jsx` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**Note outil WOW actuelle /10 :** 6,5

---

## Verdict UX

L’outil tient sa promesse « coche → ordre » : `PRIORITY_IDS` encode déjà filet → dettes → salaire → hypo → épargne → projet → succession ; le bloc « Commence ici » est le vrai climax. Ce qui casse le WOW→RDV : (1) next step mental = PDF, (2) `rest` en `<ol>` plate alors que ads vendent Urgent/Important/Plus tard, (3) barre `% = doneCount/7` lue comme score de réussite, (4) 0 event `tool_result`, (5) aucun pont hub → campagne fille. Spec ci-dessous = shippable sans refonte du moteur de priorité.

---

## 1. Defaults & première impression (<10 s)

| Élément | Spec |
|---------|------|
| Defaults | Tout décoché (`INITIAL_CHECKED` false) — **garder** (pas de spoiler) |
| Intro | Déjà clair — garder (script) |
| Pastille | Dès `doneCount >= 1` : chip `Ordre prêt` à côté du compteur |
| Hints mobile | `SoftCheckItem` : hint en `<details>` sous le label sur `max-md` ; visible direct `md:` |

---

## 2. Climax WOW — hiérarchie

```
[ Commence ici ]
1. {first.order}          ← typo dominante
{first.why}

[ Soft-close RDV ]        ← NOUVEAU — ≤ 2 s après climax
Ton n°1 : {first.order}…
[ Ancrer mon n°1 — 15 min ]

[ Deep-link fille? ]      ← si map[id] existe

[ Urgent / Important / Plus tard ]
  buckets du reste (+ éventuellement n°1 dans Urgent)

[ Notes optionnelles ]
[ Footer : statusDetail + RDV filled + PDF outline ]
```

### Buckets (près de `PRIORITY_IDS`)

```js
const TIER_BY_ID = {
  fondsUrgenceFaible: 'urgent',
  dettesCheres: 'urgent',
  revenuNonProtege: 'important',
  hypoSansVie: 'important',
  epargneSansOrdre: 'later',
  projetCourt: 'later',
  successionFloue: 'later',
};
```

- Afficher une section seulement si ≥1 item coché dans le tier (hors duplication visuelle du n°1 si déjà en hero — **recommandation :** n°1 reste dans le hero seul ; les buckets listent **tout** `selectedOrdered` groupé, avec le n°1 marqué `ring` / badge « Toi · n°1 » **ou** buckets = `rest` seulement réparti par tier. Préférer : **hero n°1 + buckets sur `selectedOrdered` complet** avec highlight sur `first.id` pour cohérence pédagogique ads.

### Ordre d’affichage dans un tier
Respecter l’ordre `PRIORITY_IDS` (déjà la source de vérité).

---

## 3. Pont résultat → RDV (PDF secondaire)

### Soft-close sous L260–268
- Import : `Link` (react-router), `buildCampagneRdvPath` depuis `campagneAdsLandings`, `trackRendezVousClick` depuis `lib/analytics`
- `useLocation()` pour forward UTM
- CTA primaire filled → `/rendez-vous/campagne?…` + `campagne_plan-global_rdv_outil`
- Pas de formulaire inline (CTA = Bookings, comme le reste du catalogue RDV)

### Footer (L187–195)
```
[ statusDetail (script) ]
[ Ancrer mon n°1 — 15 min ]  ← filled, même path/event …_rdv_outil (ou …_rdv_outil_footer)
[ Télécharger mon ordre PDF ] ← outline / ToolDownloadPdf secondaire
```

### `statusDetail` L81–92
Remplacer les variantes PDF-first (script § statusDetail).

---

## 4. Barre % → compteur (sémantique)

**Avant :** `progress = round(doneCount/total*100)` + label `{progress} %`  
**Après :**
- Garder une barre visuelle optionnelle dont la largeur = `doneCount/total` (feedback gestuel OK)
- Remplacer le libellé `%` par :  
  - `doneCount === 0` → `0 / 7`  
  - sinon → `{doneCount} cochée(s) · Ordre prêt`
- Microcopy : `Urgent d’abord — pas un score`

Ne **pas** présenter le % comme progression vers un « plan complet ».

---

## 5. Deep-link hub → fille

```js
const DEEP_LINK_BY_ID = {
  fondsUrgenceFaible: {
    to: '/campagnes/fonds-urgence',
    label: 'Calculer mon filet →',
  },
  revenuNonProtege: {
    to: '/campagnes/assurance-invalidite',
    label: 'Estimer mon trou de salaire →',
  },
  hypoSansVie: {
    to: '/campagnes/hypotheque-assurance-vie',
    label: 'Comparer banque vs famille →',
  },
  epargneSansOrdre: {
    to: '/campagnes/retraite-reer-celi',
    label: 'Voir l’ordre REER / CELI →',
  },
  projetCourt: {
    to: '/campagnes/celiapp',
    label: 'Explorer le CELIAPP (1ʳᵉ prop.) →',
  },
  successionFloue: {
    to: '/campagnes/succession-bases',
    label: 'Repérer les trous de liquidité →',
  },
  // dettesCheres: pas de landing fille → pas de lien
};
```

- Afficher **sous** le soft-close n°1 si `DEEP_LINK_BY_ID[first.id]`
- `trackEvent('select_content', { content_type: 'deep_link', item_id: \`campagne_plan-global_to_${slug}\` })`
- Caption : `Approfondir ce point (éducatif) — pas un conseil personnalisé.`
- Unique catalogue : aucun autre `*Tool.jsx` ne deep-link `/campagnes/…` — garder libellés éducatifs only

---

## 6. Analytics

| Event | Quand | Payload |
|-------|-------|---------|
| `select_content` | 1ʳᵉ fois `doneCount` passe 0→≥1 | `content_type: 'tool_result'`, `item_id: 'campagne_plan-global_result'` |
| optionnel | chaque changement de `first.id` | `item_id: 'campagne_plan-global_result'`, `item_variant: first.id` |
| `trackRendezVousClick` | clic soft-close / footer RDV | `campagne_plan-global_rdv_outil` (+ `_footer` si besoin de split) |
| PDF | déjà `useCampagneToolPdf('campagne_plan-global_pdf')` | garder |
| deep-link | clic lien fille | voir §5 |

Implémentation : `useEffect` sur `doneCount` avec ref `hasTrackedResult` pour fire-once 0→1.

---

## 7. PDF

- Titre : `Résumé — ordre d’attaque` (accents)
- Sections : garder Chez toi / Ordre d’attaque / Notes
- Option P1 : ajouter sous-heading palier dans les rows (`Urgent — …`)
- Notes finales : accents FR + disclaimer éducatif (finance)

---

## 8. Fichiers exacts à toucher

| Fichier | Quoi |
|---------|------|
| `PlanGlobalTool.jsx` | Soft-close, tiers, compteur, statusDetail, deep-links, event result, PDF accents, hints `<details>` |
| `campagneAdsLandings.js` | bullets, promise, faq×5, ctaHeadline/Subline/Label |
| `CampagneAdsLanding.jsx` | `id="outil"` ; dual CTA hero ; mid RDV data-driven (`ctaHeadline`) — **dette shell** partagée |
| Ads md | micro optionnel seulement |

Pas de nouveau package. Pas de backend.

---

## 9. Cinq upgrades outil (Avant → Après)

1. Soft-close sous Commence ici → RDV `…_rdv_outil` · **H** · **S**  
2. Buckets Urgent / Important / Plus tard vs `<ol>` · **H** · **M**  
3. Compteur `Ordre prêt` vs `%` inversé · **M** · **S**  
4. `statusDetail` + footer PDF secondaire · **H** · **S**  
5. Deep-link `id → /campagnes/…` · **H** · **M**

---

## Critères acceptation outil

- [ ] Dès 1 coche : n°1 visible + CTA RDV dans le même bloc écran (mobile thumb)
- [ ] Paliers U/I/P visibles si ≥2 items cochés (ou dès 1 si n°1 seul dans son tier)
- [ ] Aucun label « % » de réussite
- [ ] `tool_result` fire une fois
- [ ] PDF ne précède pas le soft-close dans le DOM
- [ ] Disclaimer éducatif conservé
