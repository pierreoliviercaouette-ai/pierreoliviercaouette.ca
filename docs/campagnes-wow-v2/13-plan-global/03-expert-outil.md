# [#13] Plan global — Expert outils numériques

**Slug :** `/campagnes/plan-global`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/PlanGlobalTool.jsx`  
**Note :** SoftClose, compteur `Ordre prêt`, dual CTA hero, mid data — **déjà livrés**. Spec = climax P1 only.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7 | 8 |
| WOW outil | 6,5 | ~7 | **8,5–9** (buckets + n°1 scenic) |
| Env. booker | 4,5 | ~7 | 8 |

**Top 1 gap WOW outil :** ads + intro promettent **Urgent / Important / Plus tard** ; UI montre encore `rest` en `<ol>` plate (L317–338). SoftClose placement = **OK** (sous n°1, pas footer-only).

---

## Verdict UX

Le moteur `PRIORITY_IDS` est solide. Le WOW différenciant Vague 2 = **visualiser la pédagogie en 3 buckets** + rendre le n°1 impossible à confondre avec une ligne de liste (scenic + motion). Deep-links hub→fille et `tool_result` restent des bonus P1/P2 utiles mais secondaires au climax buckets.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| SoftClose | `ToolSoftClose` sous n°1 | **Ne pas toucher** placement/copy | — |
| N°1 | `text-xl sm:text-2xl` | `font-heading text-3xl sm:text-4xl` + `key={first.id}` reveal | `PlanGlobalTool.jsx` |
| `rest` | `<ol>` numérotée plate | Buckets `TIER_BY_ID` U/I/P | `PlanGlobalTool.jsx` |
| Analytics | RDV + PDF only | + `tool_result` 0→1 | `PlanGlobalTool.jsx` |
| Deep-links | Absents | Map id→campagne (sans `projetCourt`→CELIAPP) | `PlanGlobalTool.jsx` |
| Hints mobile | Toujours visibles | `<details>` max-md (option P2) | `PlanGlobalTool.jsx` |
| PDF rows | Liste plate | Option sous-heading palier | `PlanGlobalTool.jsx` |

---

## 1. Climax P1 — hiérarchie DOM (post SoftClose existant)

```
[ Commence ici — scenic XXL ]     ← keyed motion
  1. {first.order}
  {first.why}

[ ToolSoftClose ]                 ← DÉJÀ LÀ — ne pas déplacer / re-spéc

[ Deep-link fille? ]              ← P1 optionnel sous SoftClose

[ Urgent ]
  items cochés tier (ordre PRIORITY_IDS)
[ Important ]
  …
[ Plus tard ]
  …

[ Notes ]
[ Footer statusDetail + RDV + PDF ghost ]
```

**Règle affichage buckets :** hero n°1 **+** buckets sur `selectedOrdered` complet avec highlight `first.id` (`ring` / badge `Toi · n°1`) — cohérence ads « tu vois les trois paliers ». Section omit si 0 item dans le tier.

---

## 2. `TIER_BY_ID` (près de `PRIORITY_IDS`)

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

Ordre d’affichage dans un tier = ordre `PRIORITY_IDS` (source de vérité — **ne pas recalculer**).

Labels UI / aides = script Vague 2 §3.

---

## 3. N°1 scenic + motion in-tool

| Élément | Spec |
|---------|------|
| Typo | `font-heading font-bold text-3xl sm:text-4xl leading-snug` |
| Motion | `key={first.id}` + helper shell fade/slide (pas Framer one-off) |
| SoftClose | fade-in partagé si helper catalogue existe |
| Buckets headers | apparition légère stagger optionnel (P2) |

---

## 4. Deep-links (P1)

```js
const DEEP_LINK_BY_ID = {
  fondsUrgenceFaible: { to: '/campagnes/fonds-urgence', label: 'Calculer mon filet →' },
  revenuNonProtege: { to: '/campagnes/assurance-invalidite', label: 'Estimer mon trou de salaire →' },
  hypoSansVie: { to: '/campagnes/hypotheque-assurance-vie', label: 'Comparer banque vs famille →' },
  epargneSansOrdre: { to: '/campagnes/retraite-reer-celi', label: 'Voir l’ordre REER / CELI →' },
  successionFloue: { to: '/campagnes/succession-bases', label: 'Repérer les trous de liquidité →' },
  // dettesCheres: pas de fille
  // projetCourt: PAS de CELIAPP (finance — faux positifs 1ʳᵉ prop.)
};
```

- Afficher sous SoftClose si `DEEP_LINK_BY_ID[first.id]`
- Caption finance obligatoire
- Event : `select_content` `{ content_type: 'deep_link', item_id: 'campagne_plan-global_to_{slug}' }`

---

## 5. Analytics

| Event | Quand | Payload |
|-------|-------|---------|
| `select_content` | 1ʳᵉ fois `doneCount` 0→≥1 | `content_type: 'tool_result'`, `item_id: 'campagne_plan-global_result'` |
| optionnel | changement `first.id` | `item_variant: first.id` |
| RDV / PDF | déjà branchés | garder |

`useEffect` + ref `hasTrackedResult` fire-once.

---

## 6. Fichiers exacts

| Fichier | Quoi Vague 2 |
|---------|----------------|
| `PlanGlobalTool.jsx` | `TIER_BY_ID`, buckets UI, n°1 scenic, motion keyed, deep-links, `tool_result`, PDF paliers option |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps` seulement |
| `PageHero.jsx` / `CampagneAdsLanding.jsx` | shell atmosphere / process / portrait — **pas** SoftClose custom |

Pas de backend. Pas de nouveau package motion.

---

## 7. Hors scope / interdits Vague 2

- Re-spéc SoftClose / footer dual / statusDetail (P0 done)
- Changer `PRIORITY_IDS` / montants $
- SoftClose one-off hors `ToolSoftClose`
- Deep-link `projetCourt` → CELIAPP

---

## Backlog outil

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| O1 | Buckets U/I/P + highlight n°1 | M | **P1** (climax catalogue #13) |
| O2 | N°1 scenic `text-3xl/4xl` + keyed reveal | S | P1 |
| O3 | Event `tool_result` 0→1 | S | P1 |
| O4 | Deep-links (sans projetCourt) | M | P1 |
| O5 | PDF sous-headings palier | S | P2 |
| O6 | Hints `<details>` mobile | S | P2 |

---

## Critères acceptation outil

- [ ] ≥2 coches cross-tiers → 2–3 headers U/I/P visibles
- [ ] N°1 typo ≥ `text-3xl` ; SoftClose toujours immédiatement sous
- [ ] Aucun SoftClose custom
- [ ] `tool_result` fire une fois
- [ ] Pas de deep-link CELIAPP sur `projetCourt`
- [ ] Disclaimer outil inchangé
