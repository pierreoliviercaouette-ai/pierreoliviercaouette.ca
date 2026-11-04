# [#02] CELIAPP — Brief PM final Vague 2 (post-P0)

**Campagne :** `/campagnes/celiapp`  
**Vague :** 2 — pilote atmosphère foyer / 1ʳᵉ propriété  
**Date :** 2026-11-04  
**Sources consolidées :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance` · code post-P0 · `_ROLES.md`  
**Livrable :** spec seulement — **pas de code / pas de commit**

---

## 1. Vision WOW Vague 2 (1 paragraphe)

P0 a corrigé la conversion (outil-first, headline, SoftClose RDV, defaults réalistes). Il reste le **reconnaissable en 5 s** et le **damn personnel** : le hero porte une atmosphère CSS foyer (sans photo), des chips « CELIAPP ≠ CELI / Cotisations seulement », un process strip catalogue, et le climax ajoute **Projection \| Cible \| Écart** au-dessus du `ToolSoftClose` déjà en place. Le prospect booke parce que l’écart vs *sa* cible crée une question — pas parce qu’on a reinventé le pont RDV.

---

## 2. Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | **7** | **8,5** |
| WOW outil | 5 | **6,5** | **8,5** |
| Env. booker | 4,5 | **7,5** | **8** |

**Top 1 gap WOW restant (visuel + outil) :**  
fold encore navy-générique **+** climax sans tension vs cible personnelle → **atmosphere foyer CSS + grille gap 3 cols**.

---

## 3. Uniformité catalogue

Le PM garantit le **même système** que les 14 autres campagnes. On différencie le **sujet** seulement.

| Contrat shell | Règle | Statut CELIAPP V2 |
|---------------|-------|-------------------|
| Structure page | Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ | **À respecter** — ajouter Process ; ne pas réordonner |
| Hero CTAs | Primaire outil / secondaire RDV — mêmes variantes boutons | **OK post-P0** — ne pas toucher |
| SoftClose | `ToolSoftClose` uniquement ; RDV/form primary + PDF ghost | **OK post-P0** — gap s’insère *au-dessus* ; pas de bandeau custom |
| Portrait | `/seo/portrait.jpg` 48–64px + libellé exact `Conseiller en sécurité financière · Victoriaville` | **À ajouter** mid (shell) |
| Process strip | Même composant / classes ; seuls 3 libellés changent | **À ajouter** — labels script § |
| Typo climax | `font-heading` + `text-3xl/4xl` (headline) ; gap en `text-lg/xl` | **OK** — pas d’échelle orpheline |
| Spacing / cards | Tokens prestige ; pas de palette solo hors teinte atmosphere | Tint foyer = overlay hero seulement |
| Motion | Helpers shell (fade SoftClose, keyed reveal) | SoftClose fade déjà ; keyed gap reveal |

**Autorisé à diverger :** `atmosphere` foyer (tint/texture), `heroExtras`, climax gap 3 cols + copy.  
**Interdit :** SoftClose one-off, mid CTA reinventé, footer outil custom, FAQ layout solo, photos full-bleed, process en cards.

### Checklist uniformité (cocher au ship)

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre sections Hero→En bref→Process→Outil→Mid→FAQ | ☐ | Process nouveau |
| SoftClose = `ToolSoftClose` partagé | ☐ | Déjà en code — ne pas casser |
| Portrait + libellé CSF identiques | ☐ | Shell mid |
| Process strip même composant | ☐ | Labels CELIAPP seulement |
| Typo climax `font-heading` text-3xl/4xl | ☐ | Headline ; gap plus petit |
| Divergence seulement atmosphere / heroExtras / climax | ☐ | PM review PR |

---

## 4. Backlog P0-v2 / P1 / P2

### P0-v2 — ship Vague 2 CELIAPP (chrome + gap)

| ID | Item | Effort | Owner |
|----|------|--------|-------|
| V2-0 | `PageHero` API `atmosphere` + tint/texture CSS (shell) | **M** | `PageHero.jsx` |
| V2-1 | Item data `atmosphere: 'foyer'` + overlays CELIAPP | **S** | `campagneAdsLandings.js` + hero |
| V2-2 | `heroExtras` (kicker + 2 chips) slot landing | **S** | data + `CampagneAdsLanding.jsx` |
| V2-3 | Process strip partagé + 3 labels CELIAPP | **S** | shell landing + data |
| V2-4 | Portrait mid SoftClose (`/seo/portrait.jpg` + libellé CSF) | **S** | `CampagneAdsLanding.jsx` (shell) |
| V2-5 | Champ `miseCible` + grille **Projection \| Cible \| Écart** + micro-disclaimer + event | **M** | `CeliappTool.jsx` |
| V2-6 | SoftClose branche copy si cible (templates script) — **via** `ToolSoftClose` | **S** | `CeliappTool.jsx` |

### P1 — après pilote / métriques

| ID | Item | Effort | Note |
|----|------|--------|------|
| P1-1 | Checklist admissibilité soft 3 items | **M** | Pas dans P0-v2 ; conformité OK si soft |
| P1-2 | Mini tableau CELI ≠ CELIAPP sous À retenir | **S** | Chip hero couvre déjà le signal |
| P1-3 | PDF accents FR + rows cible/écart | **S** | |
| P1-4 | Analytics restants (elig, etc.) | **S** | |

### P2 — plus tard

| ID | Item | Effort | Note |
|----|------|--------|------|
| P2-1 | Moteur droits reportés / 16 k$ | **L** | Déconseillé sans UX conformité forte |
| P2-2 | Variante rythme mensuel | **M** | |
| P2-3 | Nouvelles photos hero | — | **Interdit** Vague 2 |

---

## 5. Ordre d’implémentation

```
1. Shell PageHero atmosphere API                         (V2-0)  — partagé
2. Shell processSteps + heroExtras slot + portrait mid   (V2-2…4) — partagé
3. Data celiapp atmosphere/foyer + extras + processSteps (V2-1,2,3)
4. CeliappTool gap 3 cols + SoftClose branche            (V2-5,6)
5. QA uniformité catalogue (§3 checklist)
6. P1 selon métriques
```

**Parallélisation :** 1–2 (shell) ∥ 4 (outil) dès que l’API SoftClose/placement est figée (déjà).

---

## 6. Dépendances shell vs spécifique

| Partagé (15 campagnes) | Spécifique CELIAPP |
|------------------------|-------------------|
| `PageHero` `atmosphere` | Valeurs tint `foyer` |
| Slot `heroExtras` | Kicker + chips copy |
| `processSteps` renderer | 3 labels |
| Portrait + libellé CSF mid | — |
| `ToolSoftClose` + motion helpers | Branche écart + grille gap |
| Ordre de page | — |

**Règle :** tout changement shell = rétrocompatible (pas d’atmosphere = rendu post-P0 actuel).

---

## 7. Copy & conformité — garde-fous

- Gap = **cotisations vs souhait** ; micro-ligne sous grille (finance)
- SoftClose / mid : **ne pas réécrire** sauf branche écart
- Interdit : « tu auras ta mise », « assez pour acheter », verdict admissibilité, rendement pour combler
- Portrait libellé catalogue exact

**Textes :** `02-expert-script.md` · **Claims gap :** `04-expert-finance.md`

---

## 8. Critères d’acceptation « ami reconnaît en 5 s »

- [ ] Sans nav : atmosphere foyer + badge CELIAPP + chip « ≠ CELI » → sujet 1ʳᵉ propriété évident
- [ ] Process 3 steps visibles, même look que les autres landings
- [ ] Portrait CSF mid identique au catalogue
- [ ] Avec cible : 3 cols Projection \| Cible \| Écart au-dessus de `ToolSoftClose`
- [ ] Sans cible : parcours post-P0 intact
- [ ] Aucune photo nouvelle ; SoftClose non reinventé
- [ ] Checklist uniformité §3 cochée

---

## 9. Métriques de succès (post-ship V2)

| Signal | Après P0 (attendu) | Cible V2 |
|--------|--------------------|----------|
| Reconnaissance sujet (qualitatif) | Badge seul | Atmosphere + extras en 5 s |
| `campagne_celiapp_cible` | — | Fire + sessions avec écart |
| RDV outil / sessions avec cible | SoftClose seul | ↑ vs sessions sans cible |
| Bounce fold | Dual CTA OK | Stable ou ↓ (identité +) |

---

## 10. Livrables dossier

| Fichier | Statut |
|---------|--------|
| `01-expert-visuel.md` | Fait |
| `02-expert-script.md` | Fait |
| `03-expert-outil.md` | Fait |
| `04-expert-finance.md` | Fait |
| `00-PM-brief-final.md` | Fait (ce document) |

**Next step produit :** implémenter P0-v2 dans l’ordre §5 — commit seulement sur demande user.
