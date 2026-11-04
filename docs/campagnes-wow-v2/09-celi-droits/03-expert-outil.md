# [#09] CELI droits — Expert outils numériques

**Slug :** `/campagnes/celi-droits`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Rôle :** Expert outils numériques  
**Fichier principal :** `frontend/src/components/campagne/tools/CeliDroitsTool.jsx`  
**Shell :** `CampagneToolShell.jsx` · `ToolSoftClose` · `CampagneAdsLanding.jsx` · `campagneAdsLandings.js`  
**Interdit V2 :** re-spécifier SoftClose RDV / PDF ghost / dual CTA hero (livrés).

---

## Rescore post-P0 (outil)

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| WOW chiffre | 7 | **8** (split 7k vs ~84k) | ≥ 8,5 |
| Intention usage | 2 (string) | **8** (chips) | ≥ 8 |
| Pont RDV | ~3 | **7** (`ToolSoftClose`) | ≥ 7,5 |
| Scenic / polish | 5 | 5,5 | ≥ 7,5 |

**Top 1 gap WOW outil restant :** climax **structurellement bon**, mais (1) pas de motion keyed / fade SoftClose, (2) defaults sans badge **Exemple** / reset → ownership faible, (3) page chrome (atmosphere / process) hors outil mais nécessaire au « ami 5 s ».

---

## 1. Job de l’outil (inchangé)

Estimer la **place restante CELI** → **choisir un usage** → soft-close RDV 15 min (PDF secondaire).  
Chips + SoftClose = **faits** — V2 = climax scenic léger + ownership Exemple.

---

## 2. État actuel (ne pas casser)

| Module | Statut |
|--------|--------|
| Split plafond vs place dominante | ✅ |
| Chips `urgence` / `projet` / `long_terme` + analytics | ✅ |
| `buildLecture(result, usage)` | ✅ |
| `ToolSoftClose` sous ResultCards | ✅ placement OK (pas footer-only) |
| ArcLink + disclaimer retraits | ✅ |
| PDF FR + usage + notes | ✅ |
| Barre place utilisée `duration-500` | ✅ |

---

## 3. Climax P1 — upgrades Vague 2

### A. Motion scenic **léger** (priorité V2)

| Motion | Implémentation | Fichier |
|--------|----------------|---------|
| Keyed reveal gros $ | Wrapper place restante : `key={result.placeRestante}` + classe helper shell `campagne-climax-reveal` (fade + zoom-in-95 ~300 ms) | `CeliDroitsTool.jsx` + helper CSS/Tailwind shell |
| SoftClose fade on usage | Quand `usage` change : `key={usage \|\| 'none'}` sur `ToolSoftClose` **ou** classe fade partagée | `CeliDroitsTool.jsx` |
| Barre | Aucun change | — |

Pas de reorder majeur des blocs. Hiérarchie actuelle :

1. Barre place utilisée  
2. Steps 1–2 inputs  
3. Split contraste + chips + lecture  
4. ResultCards  
5. `ToolSoftClose`  
6. À retenir  

### B. Badge Exemple + reset (P1 ownership)

| Item | Spec |
|------|------|
| State | `isExample = true` tant qu’aucun edit user sur naissance / déjà / prévu |
| UI | Pill `Exemple — modifie pour que ce soit toi` près du titre shell ou sous pastille trust |
| Reset | Lien `Partir de zéro` → vide les 3 champs, `usage=null`, `isExample=false` |
| Analytics | optionnel `campagne_celi-droits_reset` |

Defaults Meta (1992 / 20k / 7k → ~84k) **conservés** — badge = honesty.

### C. Non-objectifs V2

- Pas de nouveaux champs (retraits, multi-émetteurs, matching)
- Pas de % allocation multi-usages
- Pas de SoftClose custom / bandeau navy one-off
- Pas de déplacement SoftClose (déjà sous climax)

---

## 4. Shell landing — dépendances (chrome, pas outil)

| Besoin | Scope | Note |
|--------|-------|------|
| `atmosphere: 'place-restante'` | Shell `PageHero` | V2-S1 |
| `heroExtras` contraste | Shell + data | V2-S2 |
| `processSteps` ×3 | Shell + data | V2-S3 |
| Portrait mid | Shell SoftClose mid | V2-S4 |
| Motion helpers partagés | Shell | V2-S5 |

Outil #09 consomme les helpers ; ne réinvente pas.

---

## 5. Events analytics (existant + delta)

| Event | Statut |
|-------|--------|
| `campagne_celi-droits_usage_{id}` | ✅ |
| `campagne_celi-droits_rdv_outil` | ✅ |
| `campagne_celi-droits_pdf` | ✅ |
| `campagne_*_outil_scroll` / `_rdv` / `_rdv_mid` | ✅ shell |
| `campagne_celi-droits_reset` | **Nouveau** si reset ship |

Aucun event SoftClose à re-spécifier.

---

## 6. Avant → Après (outil)

| Zone | Avant post-P0 | Après V2 | Fichier |
|------|---------------|----------|---------|
| Gros $ | Statique au change | Keyed fade/zoom léger | `CeliDroitsTool.jsx` |
| SoftClose | Instant swap copy | Fade keyed sur `usage` | idem + helper |
| Ownership | Defaults sans marquage | Badge Exemple + reset | idem |
| SoftClose placement | Sous climax | **Inchangé** | — |

---

## 7. Critères acceptation OUTIL V2

- [ ] Scénario default ~84 000 $ + contraste 7 000 $ intact
- [ ] Chips + SoftClose + PDF inchangés fonctionnellement
- [ ] Reveal place restante perceptible mais discret (scenic léger)
- [ ] SoftClose fade quand on change d’usage
- [ ] Badge Exemple visible au load ; reset fonctionne
- [ ] Zéro SoftClose one-off ; toujours `ToolSoftClose`
