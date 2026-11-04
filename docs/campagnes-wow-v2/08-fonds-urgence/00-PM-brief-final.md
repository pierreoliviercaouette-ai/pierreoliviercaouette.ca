# [#08] Fonds d’urgence — Brief PM final (Vague 2 post-P0)

**Gestionnaire de projet** · synthèse des 4 experts  
**Slug :** `/campagnes/fonds-urgence`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/fonds-urgence  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Livrables :** `01-expert-visuel.md` · `02-expert-script.md` · `03-expert-outil.md` · `04-expert-finance.md`  
**Pas de commit / pas de code** — brief d’implémentation seulement.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | 8,5 |
| WOW outil | 7,5 | 8 | 8–8,5 |
| Env. booker | 4,5 | 6,5 | 7,5 |

**Top 1 gap WOW restant :** **chrome différenciant filet** (atmosphere CSS + chips + process) — l’outil est déjà fort (climax 16 k$ + SoftClose sous Metrics). Mobile : collapse « À retenir ».

---

## 1. Vision WOW Vague 2 (1 paragraphe)

En 5 secondes, un ami qui ouvre `/campagnes/fonds-urgence` doit reconnaître le **sujet filet** (mesh navy + chips « Cible × mois / Écart + délai / Carte ≠ filet »), pas une landing CSF clone. Le process 3 steps (Cible → Écart → Palier) pose le parcours avant l’outil. L’outil garde son climax ; SoftClose `ToolSoftClose` déjà en place monétise. Portrait CSF unique `/seo/portrait.jpg` au mid. « À retenir » en `<details>` mobile pour ne pas noyer le CTA. **Même système shell que les 14 autres** — seule l’atmosphère / micro-signaux / chiffres divergent.

---

## 2. Uniformité catalogue

**Garant rendu uniforme** avec les 14 autres campagnes. Différencier le **sujet** sans casser le **système**.

| Contrat shell | Règle | Statut #08 V2 |
|---------------|-------|---------------|
| Structure page | Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ | **À aligner** — Process absent aujourd’hui ; ajouter via shell |
| Hero CTAs | Primaire outil / secondaire RDV — mêmes variantes boutons | **OK P0** — ne pas reinventer |
| SoftClose | `ToolSoftClose` uniquement ; RDV primary + PDF ghost | **OK P0** — déjà sous Metrics ; fade via helper shell |
| Portrait | `/seo/portrait.jpg` 48–64px + libellé `Pierre-Olivier · CSF · Victoriaville` | **À ajouter** — slot shell mid (ou SoftClose), pas asset solo |
| Process strip | Même composant / classes ; seuls 3 libellés changent | **À ajouter** — libellés : Cible / Écart / Palier |
| Typo climax | `font-heading` + `text-3xl/4xl` | **OK** — garder |
| Spacing / cards | Tokens prestige ; teinte atmosphere seulement | **OK** — atmosphere `filet` = tint/mesh, pas palette solo |
| Motion | Helpers partagés (fade SoftClose, keyed reveal) | **À industrialiser** shell — pas lib #08 |

**Autorisé à diverger :** `atmosphere: 'filet'`, `heroExtras`, climax chiffres outil, copy process/chips.  
**Interdit :** SoftClose one-off, mid CTA custom, FAQ layout custom, footer outil reinventé, photos nouvelles.

### Checklist Uniformité catalogue (PM)

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre sections Hero→En bref→Process→Outil→Mid→FAQ | ☐ → ☑ à ship | Process = gap P0-v2 |
| SoftClose = `ToolSoftClose` partagé | ☑ | Ne pas re-spécifier |
| Portrait + libellé CSF identiques | ☐ → ☑ | Même vignette catalogue |
| Process strip même composant | ☐ → ☑ | Copy #08 seulement |
| Typo climax `font-heading` text-3xl/4xl | ☑ | Déjà |
| Divergence seulement atmosphere / heroExtras / climax | ☑ | Spec visuel `filet` |

---

## Spec Avant → Après (synthèse)

| Zone | Avant (post-P0) | Après (Vague 2) | Fichiers |
|------|-----------------|-----------------|----------|
| Hero | Dual CTA OK ; PageHero clone | `atmosphere="filet"` + mesh/tint/grain | `PageHero.jsx` · landing · data |
| Fold | Pas de chips sujet | `heroExtras` + kicker | data · landing |
| Process | Absent | Strip 3 steps shell | landing · data |
| Outil climax | Fort + SoftClose | Garder ; keyed bar + fade | outil · shell |
| À retenir | Toujours ouvert | `<details>` mobile closed | `FondsUrgenceTool.jsx` |
| Mid | Copy OK | + portrait CSF shell | landing · shell |
| SoftClose / mid copy | OK | **Inchangés** | — |

---

## 3. Backlog P0-v2 / P1 / P2

### P0-v2 — Ship Vague 2 #08 (effet « ami en 5 s »)

| ID | Item | Effort | Dépendance |
|----|------|--------|------------|
| 08-V2.1 | Atmosphere `filet` (CSS mesh + tint ambre soft + grain) | M | Shell `PageHero` (V2-S1) |
| 08-V2.2 | `item.atmosphere` + `heroExtras` (chips + kicker) | S | Shell V2-S2 + data |
| 08-V2.3 | `processSteps` ×3 sous En bref | S | Shell V2-S3 + copy script |
| 08-V2.4 | Portrait mid + libellé CSF catalogue | S | Shell V2-S4 |
| 08-V2.5 | « À retenir » `<details>` mobile | S | Spécifique `FondsUrgenceTool.jsx` |
| 08-V2.6 | `id="outil"` sur wrapper outil (si manquant) | S | Shell landing |
| 08-V2.7 | Event `campagne_fonds-urgence_result` si absent | S | Spécifique outil |
| 08-V2.8 | QA finance chips/process (pas de claim sécurité) | S | Finance |

### P1 — Polish

| ID | Item | Effort |
|----|------|--------|
| 08-V2.9 | Fade SoftClose + keyed bar reveal | S *(shell helpers)* |
| 08-V2.10 | `toolIntro` sujet + ancre chip → FAQ carte | S |

### P2

| ID | Item | Effort |
|----|------|--------|
| 08-V2.11 | Ligne « carte ≠ filet » hors FAQ | S |
| 08-V2.12 | Event open « À retenir » | S |

---

## 4. Ordre d’implémentation

```text
1. Shell : PageHero atmosphere + heroExtras + processSteps + portrait mid
   (bloquant catalogue — #08 consomme, ne fork pas)
2. Data fonds-urgence : atmosphere, heroExtras, processSteps, toolIntro
3. FondsUrgenceTool : details À retenir + event result (+ keyed bar si P1)
4. QA : ordre sections · SoftClose partagé · portrait identique · mobile CTA
5. Finance spot-check micro-copy
```

**Dépendances shell vs spécifique :**

| Shell (15 campagnes) | Spécifique #08 |
|----------------------|----------------|
| `PageHero` atmosphere / grain | Teinte + texture `filet` |
| `heroExtras` / `processSteps` render | Contenu chips + 3 libellés |
| Portrait mid slot | — (asset partagé) |
| Fade SoftClose helper | — |
| `id="outil"` | — |
| | `<details>` À retenir |
| | Event `result` |
| | Keyed bar (P1) |

---

## 5. Critères d’acceptation « ami reconnaît en 5 s »

1. **Sujet** — atmosphere filet + chips visibles without scroll outil  
2. **Système** — même ordre page / SoftClose / portrait / process composant que le catalogue  
3. **Climax** — defaults 16 k$ + délai + SoftClose sous Metrics (régression 0)  
4. **Mobile** — À retenir fermé ; RDV SoftClose ≤2 s post-climax  
5. **Booker** — ami comprend : palier / où garer / surplus — pas « télécharge le PDF »  
6. **Conformité** — zéro « garanti / filet complet / 6 mois = sécurité »  
7. **Pas de photos** nouvelles  

**Definition of Done (P0-v2) :** 08-V2.1–08-V2.8 prêts à coder ; checklist Uniformité ☑ ; zéro fork SoftClose/mid.

---

## 6. Hors scope

- Re-spécifier SoftClose / dual CTA / `ctaHeadline` (P0 livré)  
- Nouveaux champs outil / merger Apprendre  
- Shoot photos  
- Commit / deploy  

---

## 7. Handoff dev

- [ ] Lire Uniformité catalogue §2 (contrat shell d’abord)  
- [ ] Copy depuis `02-expert-script.md` uniquement pour chips/process  
- [ ] Visuel `01` atmosphere `filet` — CSS only  
- [ ] Outil `03` — details + events ; ne pas toucher formule SoftClose  
- [ ] Finance `04` — spot-check avant merge copy  
- [ ] Pas de commit sauf demande explicite  
