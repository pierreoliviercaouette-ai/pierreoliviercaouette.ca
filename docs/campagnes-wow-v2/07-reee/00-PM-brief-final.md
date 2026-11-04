# [#07] REEE — Brief PM final (Vague 2 post-P0)

**Slug :** `/campagnes/reee`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/reee  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Équipe :** Visuel · Script · Outil · Finance → synthèse PM  
**Sources :** livrables `01`–`04` ce dossier · code `ReeeTool.jsx` · landing `reee`  
**Commit / code :** non — brief seulement

---

## 1. Vision WOW V2 (1 paragraphe)

P0 a fermé le pont booker (`ToolSoftClose` sur `laisseSurTable`, dual CTA, mid data, FAQ banque). Il reste le **chrome sujet** et le **climax différenciant** : sans nav, la page doit « sentir » parent / SCEE (atmosphere CSS + chips + process — **pas** de photo), et dans l’outil le regret **~X $ encore possibles** doit dominer **avant** le total études, seedé par un champ `sceeDejaRecues` pour le parent qui a déjà un compte. Même squelette que les 14 autres ; seul le sujet et le climax divergent.

---

## 2. Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|---------:|---------:|---------:|
| Expérience | 6 | 7,5 | ≥ 8,5 |
| WOW outil | 7 | 8 | ≥ 9 |
| Env. booker | 4,5 | 7,5 | ≥ 8 |

**Top 1 gap WOW restant (visuel + outil) :**  
Hero encore clone catalogue + climax **total-first** malgré bandeau P0 — persona « compte ouvert » sans `sceeDejaRecues`.  
→ **Atmosphere parent-scee + regret-first + seed SCEE.**

**North star #07 :** ami en 5 s voit « encore ~X $ » dominant + reconnaît REEE (pas une landing générique).

---

## 3. Spec Avant → Après

| Zone | Avant (post-P0 code) | Après Vague 2 | Fichiers |
|------|----------------------|---------------|----------|
| Hero | Orbes / vague génériques | `atmosphere: 'parent-scee'` tint or + grain CSS | `PageHero` · data `reee` |
| Fold | Pas de chips sujet | `heroExtras` 2 chips + kicker | data · `CampagneAdsLanding` |
| Process | Absent | Strip 3 steps **shell** (labels REEE) | landing · data |
| Portrait | Absent | `/seo/portrait.jpg` 48–64 px mid SoftClose | shell mid |
| Climax | Total puis bandeau regret | **Regret-first** XXL ; total secondary ; grille sans doublon | `ReeeTool.jsx` |
| Champ | Cotisation annuelle only | + `sceeDejaRecues` 0–7200 seed `projeterReee` | `ReeeTool.jsx` |
| SoftClose | `ToolSoftClose` footer OK | **Ne pas retoucher** | — |
| Dual CTA / mid | Livrés | **Ne pas retoucher** | — |

---

## 4. Backlog

### P0-v2 — ship Vague 2 cette campagne

| ID | Item | Effort | Dépendance |
|----|------|--------|------------|
| V2-07-1 | `atmosphere: parent-scee` + brancher `PageHero` | **S** | Shell V2-S1 |
| V2-07-2 | `heroExtras` chips + kicker (copy script) | **S** | Shell V2-S2 |
| V2-07-3 | `processSteps` 3 labels REEE | **S** | Shell V2-S3 |
| V2-07-4 | Portrait CSF mid SoftClose catalogue | **S** | Shell V2-S4 |
| V2-07-5 | Regret-first DOM + typo `text-3xl/4xl` + keyed fade | **S** | Spécifique + V2-S5 |
| V2-07-6 | Champ `sceeDejaRecues` + seed + PDF + event + headline | **M** | Spécifique |
| V2-07-7 | Grille résultat : retirer doublon « Encore possibles » | **S** | Spécifique |

### P1 — après P0-v2

| ID | Item | Effort |
|----|------|--------|
| P1-07-a | Toggle cotisation $/mois ↔ $/an | S–M |
| P1-07-b | « À retenir » en `<details>` mobile | S |

### P2 — later

| ID | Item | Effort |
|----|------|--------|
| P2-07-a | Ligne IQEE illustration séparée (hors total) | M |
| P2-07-b | Teaser multi-enfants soft-close only | S |
| P2-07-c | ~~Photo parent·enfant~~ — **refusée** (CSS only) | — |

---

## 5. Ordre d’implémentation

```
1. Shell V2-S1…S5 (atmosphere, heroExtras, process, portrait, motion)
   ※ même vague que les autres — ne pas forker un hero REEE solo
2. Data reee : atmosphere + heroExtras + processSteps
3. ReeeTool regret-first (V2-07-5, V2-07-7)
4. sceeDejaRecues + projeterReee seed + events (V2-07-6)
5. QA defaults 1200 $ regret-first · seed 3000 · plafond 7200 · mobile
```

---

## 6. Dépendances shell vs spécifique

| Levier | Shell partagé | Spécifique `#07` |
|--------|---------------|------------------|
| `PageHero` atmosphere / tint / texture | Oui | Valeur `parent-scee` |
| `heroExtras` / chips | Oui | Copy REEE |
| `processSteps` | Oui | 3 labels Âge / Rythme / Encore possibles |
| Portrait mid SoftClose | Oui (`/seo/portrait.jpg`) | — |
| Motion fade SoftClose / keyed reveal | Oui | Appliquer au bandeau regret |
| Regret-first + `sceeDejaRecues` | — | `ReeeTool.jsx` only |
| SoftClose / dual CTA / mid copy | Déjà P0 | **Interdit de reinventer** |

---

## 7. Uniformité catalogue

**Garant PM :** même **système** shell que les 14 autres ; différencier seulement le **sujet** (atmosphere, micro-signaux, climax outil).

| Contrat shell | OK ? | Note |
|---------------|:----:|------|
| Ordre sections Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ | ✅ | Spec V2 impose cet ordre ; process à brancher |
| Hero CTAs : primaire outil / secondaire RDV — mêmes variantes boutons | ✅ | Déjà P0 — ne pas custom |
| SoftClose = `ToolSoftClose` uniquement (RDV primary + PDF ghost) | ✅ | Déjà en footer `ReeeTool` — **pas** de bandeau one-off |
| Portrait `/seo/portrait.jpg` + libellé CSF · Victoriaville (mid ou SoftClose) | ✅ | Slot shell — pas autre photo |
| Process strip : même composant / classes ; seuls les 3 libellés changent | ✅ | Labels script §3 |
| Typo climax `font-heading` + `text-3xl/4xl` (ou `5xl` fit) | ✅ | Regret dominant — pas d’échelle orpheline |
| Spacing / cards : tokens prestige ; pas de palette solo hors teinte atmosphere | ✅ | Tint or/navy parent-scee only |
| Motion : helpers shell (fade SoftClose, keyed reveal) — pas lib solo | ✅ | Barre + bandeau keyed |

**Autorisé à diverger :** `atmosphere` parent-scee, `heroExtras`, regret-first + `sceeDejaRecues`, copy.  
**Interdit :** reinventer mid CTA, footer outil, FAQ layout, SoftClose one-off, shoot photo.

---

## 8. Critères d’acceptation « ami reconnaît en 5 s »

- [ ] Sans nav : teinte/chips/process disent REEE / subventions (pas clone orbes seul)
- [ ] Defaults : `~1 200 $` encore possibles = chiffre **dominant** (au-dessus du total)
- [ ] Seed SCEE déjà reçues change le room + headline « Avec ce que t’as déjà… »
- [ ] SoftClose catalogue inchangé sous climax ; portrait CSF visible au mid
- [ ] Conformité : room ≠ dû ; hint solde ≠ SCEE ; SCEE de base only
- [ ] Events : `laisse_sur_table` + `scee_deja` + `_rdv_outil`
- [ ] Aucune divergence structurelle vs catalogue (checklist §7)

---

## 9. Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Shell atmosphere retardé | Data + regret-first + sceeDeja shipables seuls ; atmosphere suit S1 |
| Parent entre solde REEE dans seed | Hint finance obligatoire + RDV « déjà en place » |
| Double « Encore possibles » (bandeau + grille) | V2-07-7 retire la 3e cellule |
| Temptation SoftClose custom | **Interdit** — Uniformité §7 |

---

## 10. Livrables dossier

| Fichier | Statut |
|---------|--------|
| `01-expert-visuel.md` | Done |
| `02-expert-script.md` | Done |
| `03-expert-outil.md` | Done |
| `04-expert-finance.md` | Done |
| `00-PM-brief-final.md` | Done (ce fichier) |

**Prochaine action dev :** P0-v2 dans l’ordre §5 — **sans commit** jusqu’à demande explicite.
