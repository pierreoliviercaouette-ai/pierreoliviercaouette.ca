# [#08] Fonds d’urgence — Spec climax outil P1 (Vague 2)

**Rôle :** Expert outils numériques  
**Slug :** `/campagnes/fonds-urgence`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Fichier principal :** `frontend/src/components/campagne/tools/FondsUrgenceTool.jsx`  
**Interdits V2 :** ne pas re-spécifier SoftClose RDV/PDF · pas de nouveaux inputs fiscaux · pas de pont RDV alternatif

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | 8,5 |
| WOW outil | 7,5 | 8 | 8–8,5 |
| Env. booker | 4,5 | 6,5 | 7,5 |

**Top 1 gap WOW restant (outil) :** climax déjà fort (16 k$ + délai + rythme12 + SoftClose sous Metrics). Gap restant = **friction mobile** (« À retenir » ouvert) + **motion** (barre keyed + fade SoftClose) — pas un nouveau champ.

**Placement SoftClose :** déjà sous Metrics / avant « À retenir » via `ToolSoftClose` — **OK, ne pas déplacer**.

---

## 1. Climax — hiérarchie (garder)

Ordre actuel valide — ne pas reorder :

1. Barre « Vers ta cible » (`epargneActuelle` / `cible` + %)  
2. Inputs blocs 1–2  
3. « En clair » — headline · gros $ `text-3xl/4xl` · label · rythme12 si >12 m · detail · points  
4. Metrics 2 cols (délai · rythme12/atteint)  
5. `ToolSoftClose` 3 tons  
6. « À retenir » → **collapse mobile V2**  
7. Footer status + PDF ghost  

**Defaults aha (ne pas toucher) :** 3500 × 6 / 5000 / 300 → manquant 16 000 $ · ~4 a 6 m · rythme12 ~1 334 $.

---

## Spec Avant → Après

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| SoftClose | `ToolSoftClose` sous Metrics | **Inchangé** (fade via helper shell) | `CampagneToolShell.jsx` |
| « À retenir » | Bloc toujours ouvert ~L599–609 | `<details>` mobile default **closed** ; desktop `open` ou toujours visible | `FondsUrgenceTool.jsx` |
| Barre | `transition-all duration-500` | Keyed reveal 1× au mount / focus `#outil` (0 → `pctVersCible`) | `FondsUrgenceTool.jsx` |
| Ancre | `scrollToOutil` → `#outil` | Wrapper outil landing **doit** avoir `id="outil"` (fix shell si manquant) | `CampagneAdsLanding.jsx` |
| Champs | 4 inputs | **Aucun nouveau champ** | — |
| Events | `rdv_outil` live ; `result` ? | Ajouter `campagne_fonds-urgence_result` 1× si absent | `FondsUrgenceTool.jsx` |

---

## 2. Motion in-tool

| Motion | Spec | Helper |
|--------|------|--------|
| SoftClose fade | opacity 0→1, 200–300 ms quand `softClose` non null | Shell partagé (pas Framer one-off) |
| Bar keyed | `key={`bar-${cible}-${atteint}`}` ou mount-once flag ; width anim | Local + classes existantes |
| Interdit | Confetti, pulse infini sur $, lib motion dédiée #08 |

---

## 3. « À retenir » — details mobile

```text
Mobile (<sm) : <details> fermé par défaut — summary « À retenir (4 points) »
Desktop : ouvert (attribute open) OU même details avec open
Ne jamais placer À retenir entre Metrics et SoftClose
```

Event optionnel : `campagne_fonds-urgence_a_retenir_open` au premier toggle — P2.

---

## 4. Analytics

| Event | Quand | Statut |
|-------|-------|--------|
| `campagne_fonds-urgence_tool` | focus outil | Existant (landing) |
| `campagne_fonds-urgence_rdv_outil` | SoftClose RDV | Existant |
| `campagne_fonds-urgence_pdf` | download | Existant |
| `campagne_fonds-urgence_rdv_mid` | mid | Existant |
| `campagne_fonds-urgence_result` | 1× climax visible (defaults OK) | **À ajouter si absent** |
| `campagne_fonds-urgence_outil_scroll` | hero → `#outil` | Existant pattern landing |

---

## 5. Fichiers exacts

| Fichier | Quoi V2 |
|---------|---------|
| `FondsUrgenceTool.jsx` | `<details>` À retenir · keyed bar · event `result` · **pas** toucher formule SoftClose copy |
| `CampagneToolShell.jsx` | Fade SoftClose partagé · slot portrait optionnel (shell) |
| `CampagneAdsLanding.jsx` | `id="outil"` · render `processSteps` · `atmosphere` / `heroExtras` · portrait mid |
| `campagneAdsLandings.js` | `atmosphere`, `heroExtras`, `processSteps`, `toolIntro` |
| `PageHero.jsx` | prop `atmosphere` CSS variants incl. `filet` |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| O-08.1 | `<details>` À retenir mobile | S | P0-v2 |
| O-08.2 | `id="outil"` landing (si manquant) | S | P0-v2 *(shell)* |
| O-08.3 | Event `result` | S | P0-v2 |
| O-08.4 | Keyed bar reveal | S | P1 |
| O-08.5 | Fade SoftClose shell | S | P1 *(shell)* |
| O-08.6 | Nouveaux champs / gap UI | — | **Hors scope** (outil déjà fort) |

---

## Acceptance UX

- [ ] Defaults : 16 k$ + délai + rythme12 visibles <10 s  
- [ ] SoftClose sous climax, composant partagé uniquement  
- [ ] Mobile : RDV SoftClose visible **sans** ouvrir À retenir  
- [ ] Typo climax reste `font-heading text-3xl sm:text-4xl`  
- [ ] Aucune régression formule / SoftClose 3 tons  
- [ ] Ami booke pour palier / où garer — pas pour PDF  

---

## Hors scope

- Merger avec `calculateFondsUrgence` (Apprendre)  
- Email gate PDF  
- SoftClose custom one-off  
- Matching / plafonds CELI (autres campagnes)  
