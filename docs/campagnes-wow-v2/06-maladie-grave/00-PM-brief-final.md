# [#06] Maladie grave — Brief PM final (Vague 2 post-P0)

**Slug :** `/campagnes/maladie-grave`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/maladie-grave  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**CTA :** RDV Bookings 15 min  
**Pilote atmosphère :** capital ≠ invalidité (CSS only)  
**Livrables :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit :** non (docs seulement)

---

## 1. Vision Vague 2 (1 paragraphe)

P0 a monétisé l’écart (SoftClose) et prouvé Invalidité ≠ MG in-tool. Il reste un hero catalogue interchangeable et un écart encore trop petit (`text-lg`) à côté d’un capital XXL. Vague 2 : **chrome différenciant CSS** (atmosphere capital forfaitaire + kicker, pas photos, pas chips Invalidité\|MG en hero) + **climax typo écart `text-3xl+`** + process / portrait / motion shell. Même système que les 14 autres — seul le sujet diverge.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | 6,5 | ≥ 8 |
| WOW outil | 6,5 | 7,5 | ≥ 8,5 |
| Env. booker | 4,5 | 6,5 | ≥ 7,5 |

**Top 1 gap WOW restant :** (visuel) atmosphere capital CSS + (outil) écart `text-3xl+` — couple inseparable pour « ami reconnaît la campagne en 5 s ».

---

## Spec Avant → Après (synthèse)

| Zone | Avant (post-P0) | Après (Vague 2) | Fichiers |
|------|-----------------|-----------------|----------|
| Hero | Navy générique + dual CTA | `atmosphere: capital-forfaitaire` + `heroExtras` kicker capital | `PageHero` · `campagneAdsLandings.js` · `CampagneAdsLanding` |
| heroExtras | — | Kicker + chips 3 blocs / complète invalidité — **pas** Invalidité\|MG | data + landing |
| Process | Absent | 3 steps shell sous En bref | landing + data `processSteps` |
| Portrait | Absent mid | `/seo/portrait.jpg` 48–64 + libellé CSF | mid navy |
| Écart | `text-lg` | `font-heading text-3xl sm:text-4xl` + keyed reveal | `MaladieGraveTool.jsx` |
| SoftClose | Livré sous climax | Inchangé (`ToolSoftClose` + tone opt.) | — |
| Motion | 0 | Reveal écart + fade SoftClose (helpers shell) | shell + tool |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| MG-V2-1 | Shell `PageHero` atmosphere + `item.atmosphere` | M | **P0-v2** (shell partagé) |
| MG-V2-2 | `heroExtras` kicker + 1–2 chips (script) | S | **P0-v2** |
| MG-V2-3 | `processSteps` ×3 sous En bref | S | **P0-v2** (shell) |
| MG-V2-4 | Portrait mid `/seo/portrait.jpg` + libellé CSF | S | **P0-v2** (shell) |
| MG-V2-5 | Écart `text-3xl+` + layout bandeau | S | **P0-v2 / P1** (spécifique #06) |
| MG-V2-6 | Motion keyed reveal + fade SoftClose | S | P1 (shell helpers) |
| MG-V2-7 | SoftClose `tone` warn/ok | S | P1 |
| MG-V2-8 | `toolIntro` data landing | S | P1 |
| MG-V2-9 | Hint SCC condensé mobile | S | P2 |
| MG-V2-10 | Event optionnel `ecart_reveal` | S | P2 |

**Ordre ship :** shell V2-S1…S5 (atmosphere, extras, process, portrait, motion) → MG-V2-5 écart XXL en parallèle dès que typo catalogue figée.

---

## Uniformité catalogue

Même **système shell** que les 14 autres campagnes. Différencier le **sujet** (#06 = capital forfaitaire / atmosphere ambre) sans reinventer les primitives.

| Contrat shell | OK ? | Note #06 |
|---------------|------|----------|
| Ordre sections Hero → En bref → Process → Outil → Mid soft-close → FAQ | ✅ à ship | Process = seul trou d’ordre post-P0 |
| Hero CTAs primaire outil / secondaire RDV — mêmes variantes boutons | ✅ déjà | Ne pas re-spécifier |
| SoftClose = `ToolSoftClose` partagé (RDV primary + PDF ghost) | ✅ déjà | Pas de bandeau custom ; tone warn/ok optionnel |
| Portrait `/seo/portrait.jpg` + libellé CSF · Victoriaville | ⬜ P0-v2 | Mid navy — même vignette catalogue |
| Process strip même composant / classes ; seuls 3 libellés changent | ⬜ P0-v2 | Copy script #06 only |
| Typo climax `font-heading` + `text-3xl/4xl` | ⬜ P0-v2 | **Écart** aligne sur capital (plus de `text-lg` orphelin) |
| Spacing / cards tokens prestige ; pas de palette solo hors teinte atmosphere | ✅ | Tint ambre capital = seule divergence couleur |
| Motion helpers shell (fade SoftClose, keyed reveal) — pas lib one-off | ⬜ P1 | Partagé cross-catalogue |
| Divergence seulement atmosphere / heroExtras / climax / copy | ✅ | heroExtras ≠ chips Invalidité\|MG (contraste = outil) |
| Interdit : mid CTA / footer outil / FAQ layout / SoftClose one-off | ✅ | Respecté dans les 4 specs experts |

**Autorisé à diverger :** `atmosphere: capital-forfaitaire`, `heroExtras`, chiffre écart XXL, copy process.  
**Interdit :** reinventer SoftClose, dual CTA, mid headline pattern, ou module contraste hero qui double `mg-contrast`.

---

## Dépendances shell vs spécifique

| Type | Items | Fichiers |
|------|-------|----------|
| **Shell** | atmosphere PageHero, heroExtras slot, processSteps, portrait mid, motion helpers | `PageHero.jsx` · `CampagneAdsLanding.jsx` · éventuellement SoftClose tone |
| **Spécifique #06** | `atmosphere` value + extras copy + process labels + écart `text-3xl+` + keyed reveal | `campagneAdsLandings.js` (`maladie-grave`) · `MaladieGraveTool.jsx` |

Si shell glisse : **ship quand même MG-V2-5** (écart XXL) — climax outil 100 % local.

---

## Finance / conformité (synthèse)

- **Claims OK :** capital forfaitaire conditionnel ; complète l’invalidité ; écart illustratif ; SCC Canada ajustable
- **Interdits :** montant « dû » près du XXL ; « tu recevras » ; invalidité inutile ; liste maladies inventée
- **Disclaimer :** outil existant + Clarifier ≠ acheter SoftClose/mid + kicker `si le contrat s’applique`

---

## Critères acceptation « ami reconnaît en 5 s »

- [ ] Atmosphere + kicker = « grosse somme une fois », pas hero CSF clone ni twin #04
- [ ] Pas de chips hero Invalidité \| MG
- [ ] Process 3 steps catalogue entre En bref et outil
- [ ] Portrait CSF identique cross-catalogue au mid
- [ ] Écart `text-3xl+` + SoftClose même viewport
- [ ] SoftClose = composant partagé uniquement
- [ ] 0 nouvelle photo

---

## Risques PM

| Risque | Mitigation |
|--------|------------|
| Cannibalisation créa #04 | Atmosphere ambre lump-sum ≠ teal revenu ; pas chips dual en hero |
| Écart XXL = pitch perçu | Labels illustratif + finance checklist |
| Shell bloqué | Ship écart XXL seul |
| Over-scope photo / SoftClose rewrite | Interdit Vague 2 |

---

## Definition of Done

1. Pack `docs/campagnes-wow-v2/06-maladie-grave/` (5 md) lu par l’agent d’implémentation  
2. P0-v2 coché en code + smoke mobile (écart XXL + SoftClose pouce)  
3. Uniformité catalogue validée vs une autre landing Vague 2  
4. **Pas de commit** sauf demande explicite PO

---

## One-liner

> **Même shell catalogue — atmosphere capital + écart XXL ; le contraste Invalidité\|MG reste dans l’outil, pas en chips hero.**
