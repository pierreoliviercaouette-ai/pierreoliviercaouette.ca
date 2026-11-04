# [#12] Travailleur autonome — Expert outils numériques

**Slug :** `/campagnes/travailleur-autonome`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier cœur :** `frontend/src/components/campagne/tools/AutonomeChecklistTool.jsx`  
**Verrouillé :** pont RDV = `ToolSoftClose` déjà sous climax — **ne pas** re-spécifier SoftClose / dual CTA. Focus = **climax filet**.

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | ≥ 8,5 |
| WOW outil | 5,5 | 7 | ≥ 8,5 |
| Env. booker | 5 | 7,5 | ≥ 8,5 |

**Top 1 gap WOW restant :** climax `Mince` + prochaine étape **à poids égal** (`text-xl/2xl`) — l’état filet ne « frappe » pas ; pas de keyed reveal ; faux trous `vie`/`rc` diluent encore le filet.

---

## Spec climax P1 — renforcer le filet

### 1. Hiérarchie chiffres (Avant → Après)

| Élément | Avant | Après Vague 2 |
|---------|-------|---------------|
| `filetValue` | `ResultCard` value `text-xl sm:text-2xl` | **Hero climax** : `font-heading text-3xl sm:text-4xl font-bold` (contrat typo catalogue) |
| `nextValue` | Même taille que filet | Secondaire : `text-xl sm:text-2xl` ambre — pas de concurrence |
| Mini-piliers 4 cols | Grille égale sous Trous | **Filet visuel** : 4 cells restent, mais `Mince` → liquidité/revenu en warn pulse léger (classe shell keyed) |
| Liste Trous | OK + badge « en premier » | Garder ; item #1 reste ambre |

Layout cible bloc « Ton filet » :

```
[ État du filet — MINCE XXL ]     [ Prochaine étape — short ambre ]
[ Trous restants … ]
[ Mini-piliers 4 ]
[ ToolSoftClose — inchangé ]
```

### 2. Reorder / champs WOW

| Item | Spec | Priorité |
|------|------|----------|
| `hasInteracted` | Masquer ResultCards + Trous tant que `doneCount === 0` — copy seule « Coche pour voir ton filet se remplir » | P0-v2 |
| Toggles hypo / RC | Filtre `relevantItems` (rebuild P1-1) — retire faux trous | P1 |
| Seuils filet | Inchangés : 0 À construire / &lt;3 Mince / &lt;6 En cours / ≥6 Solide | — |

Toggles (P1) sous Progression :

- « Hypothèque, conjoint ou enfants ? » Oui / Non → filtre `vie`
- « Métier exige RC ? » Oui / Non / Je sais pas → filtre `rc` si Non

### 3. Motion in-tool

| Motion | Trigger | Impl |
|--------|---------|------|
| Keyed reveal État | `filetValue` change | `key={filetValue}` sur value + helper shell `animate-in fade` |
| SoftClose fade | déjà présent | **Ne pas** forker |
| Progress bar | existant 500 ms | garder |

### 4. SoftClose placement

**Déjà correct** : sous Trous, dans bloc Ton filet (`AutonomeChecklistTool.jsx` L561–576).  
Vague 2 : **zéro** bandeau custom — rester sur `ToolSoftClose`.

Portrait CSF = mid page shell, **pas** dans le strip outil (évite double portrait).

### 5. Events analytics (ajouts V2)

| `item_id` | Quand |
|-----------|-------|
| `campagne_travailleur-autonome_filet_climax` | première fois `filetValue === 'Mince'` **et** ResultCard visible (`doneCount >= 1`) — peut fusionner avec `filet_mince` existant (ne pas doubler) |
| `campagne_travailleur-autonome_toggle_contexte` | changement toggle hypo/RC (P1) | `{ has_hypo, needs_rc }` |
| Existants | `progress` 1&3, `filet_mince`, `_rdv_tool`, `_pdf` — **garder** |

---

## Fichiers JSX exacts

| Fichier | Touch Vague 2 |
|---------|---------------|
| `AutonomeChecklistTool.jsx` | Typo climax XXL ; `hasInteracted` / hide cards à 0 ; keyed reveal ; (P1) toggles `relevantItems` |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps`, `toolIntro` optionnel |
| `CampagneAdsLanding.jsx` | Shell : render `processSteps`, `heroExtras`, portrait mid — **partagé** |
| `PageHero.jsx` | Shell : prop `atmosphere` desk-ledger |
| `CampagneToolShell.jsx` | SoftClose **inchangé** ; helpers motion si centralisés ici |

---

## Critères acceptation outil V2

- [ ] Après 1–2 « non » liquidité : `Mince` lit en text-3xl/4xl **sans** remonter
- [ ] Prochaine étape ambre plus petite — hiérarchie claire
- [ ] `doneCount === 0` → pas de faux climax warn
- [ ] SoftClose = `ToolSoftClose` only
- [ ] (P1) Solo sans hypo → `vie` hors trous
