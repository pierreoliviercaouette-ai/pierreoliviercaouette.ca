# [#05] Expert script marketing — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, soft close — zéro pitch  
**Périmètre V2 :** textes différenciants fold + process + matching — **ne pas** réécrire SoftClose / mid sauf gap réel.

---

## Rescore post-P0 (copy)

| Zone | Après P0 | Verdict V2 |
|------|----------|------------|
| H1 / promise | Alignés Ad2, bons | **Garder** |
| Bullets / FAQ | Matching + CELIAPP présents | **Garder** |
| SoftClose / mid | `ctaHeadline` + ToolSoftClose branchés | **Ne pas réécrire** |
| Fold identité | Pas de kicker / process | **Gap** → heroExtras + processSteps |

**Top 1 gap copy :** le fold reste générique catalogue — manque le micro-signal « REER · CELI » et le process narratif 3 pas.

---

## Textes différenciants collables

### `heroExtras` / fold

| Champ | Texte |
|-------|--------|
| Kicker | `REER · CELI` |
| Chip CELI (opt.) | `CELI` |
| Chip REER (opt.) | `REER` |
| H1 | **Garder** `REER ou CELI : où va le prochain dollar ?` |
| Promise | **Garder** `Quatre réponses. Une piste d’ordre REER / CELI — et un PDF à apporter en 15 minutes. Sans compte.` |

### Process steps (3 max — data `processSteps`)

| # | Label court | Sous-ligne (opt. aria / desktop) |
|---|-------------|----------------------------------|
| 1 | `Répondre` | `Tranche, horizon, liquidité, matching` |
| 2 | `Voir l’ordre $` | `Partage illustratif du prochain dollar` |
| 3 | `15 min` | `Coller ça à ton dossier — zéro pitch` |

### Intro outil (si shell lit encore « À toi de jouer »)

| Champ | Texte |
|-------|--------|
| Eyebrow | `Prioriseur REER · CELI` |
| `toolIntro` | `Réponds · vois où part le prochain dollar · garde le PDF pour les 15 minutes.` |

### Matching employeur (champ P1 — copy exacte)

| Champ | Texte |
|-------|--------|
| Label | `Ton employeur matche ou cotise déjà à un REER ?` |
| Hint | `Si oui, ça peut changer l’ordre du prochain dollar — on le quantifie en 15 min.` |
| Options | `Oui` / `Non` / `Je sais pas` |
| Raison si Oui (prepend) | `Ton employeur matche souvent le REER : ce match-là se regarde souvent avant le débat perso CELI vs REER — on le chiffre en 15 minutes.` |
| Si Oui + liquidité oui (nuance) | `Même avec un match, ton besoin d’accès peut justifier du CELI — on démêle ça en 15 min.` |
| Chip snapshot | `Match employeur noté` |

### Soft close / mid — **pas de rewrite**

Garder tels quels (P0) :

- `ctaHeadline` : `Ton ordre REER / CELI, on le valide en 15 minutes`  
- `ctaSubline` : `Apporte ton PDF — matching employeur, plafonds, prochain dollar. Zéro pitch.`  
- SoftClose branché par `suggestion.key` / `pdfReady` déjà en code  

Portrait mid : libellé shell standard `Conseiller en sécurité financière · Victoriaville` — pas de phrase custom.

---

## Spec Avant → Après

| Zone | Avant | Après V2 | Fichiers |
|------|-------|----------|----------|
| Kicker | Absent | `REER · CELI` | data `heroExtras` |
| Process | Absent | 3 labels ci-dessus | data `processSteps` |
| Matching | Absent | Label + hint + 3 chips | `RetraiteReerCeliTool.jsx` |
| SoftClose / mid | Livré P0 | **Inchangé** | — |

---

## Backlog copy

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| S-1 | `heroExtras.kicker` + processSteps ×3 | S | P0-v2 |
| S-2 | `toolIntro` / eyebrow sujet | S | P0-v2 |
| S-3 | Copy matching + raisons Oui / Oui+liquidité | S | P1 |
| S-4 | Chip « Match employeur noté » | S | P1 |

---

## Ce qu’on ne dit pas (rappel)

- Pas « meilleur compte », pas rendement %, pas ordre produit définitif sur le matching.  
- Soft close : ne pas rouvrir le chantier P0.  
