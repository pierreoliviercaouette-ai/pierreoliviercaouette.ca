# [#14] Succession — bases — Brief final PM (Vague 2 post-P0)

**Slug :** `/campagnes/succession-bases` (alias `/campagnes/succession`)  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/succession-bases  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**CTA :** RDV Bookings (`buildCampagneRdvPath`)  
**Livrables :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit / code :** non (spec only)

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | ~7 | 8 |
| WOW outil | 6 | ~7,5 | 8,5 |
| Env. booker | 4,5 | ~6,5–7 | 7,5–8 |

**P0 déjà en code (ne pas re-spécifier) :** `ToolSoftClose` sous climax trous · hero dual CTA outil-first · H1 Ad1 · mid `ctaHeadline`/`ctaSubline` · invite + reveal portrait · next-step CSF vs notaire · FAQ ×5.

**Top 1 gap WOW restant :** chrome page encore **clone catalogue** — pas d’atmosphère « dossier », pas de process strip, pas de **module CSF \| Notaire** visible, pas de portrait mid. L’outil booke déjà ; la page ne se *reconnaît* pas en 5 s comme succession.

---

## Vision Vague 2 (1 paragraphe)

Après P0, le pont trous → 15 min existe. Vague 2 différencie le **sujet** sans casser le **système** : hero CSS dossier (liquidité ≠ papier), chips fold, process catalogue 3 steps, module visuel CSF \| Notaire sous l’outil, portrait `/seo/portrait.jpg` au mid, climax Trous un cran plus XXL + motion keyed. Résultat : un ami lit en 5 s « checklist succession → CSF liquidité / notaire testament », pas une landing générique iA.

---

## Spec Avant → Après (synthèse)

| Zone | Avant (post-P0) | Après Vague 2 | Fichiers |
|------|-----------------|---------------|----------|
| Hero | Navy/orbes + dual CTA | + `atmosphere: 'dossier'` + `heroExtras` chips | `PageHero` · `campagneAdsLandings.js` · `CampagneAdsLanding.jsx` |
| Process | Absent | 3 steps shell sous En bref | data + landing shell |
| Outil climax | SoftClose OK, Trous xl/2xl | Trous `text-3xl/4xl` + keyed reveal + tone SoftClose + mobile cases-first | `SuccessionChecklistTool.jsx` |
| Sous outil | Scale fin de liste | Module 2 col. CSF \| Notaire | landing (post-`#outil`) |
| Mid | Ad3 copy OK | + portrait 48–64px `/seo/portrait.jpg` + libellé CSF | `CampagneAdsLanding.jsx` |

---

## Backlog

| ID | Item | Effort | P0-v2 / P1 / P2 |
|----|------|--------|-----------------|
| V2-14-1 | `atmosphere: 'dossier'` (tint/texture CSS, pas photo) | M | **P0-v2** (shell V2-S1 + data) |
| V2-14-2 | `heroExtras` kicker + chips Liquidité / CSF·Notaire | S | **P0-v2** |
| V2-14-3 | `processSteps` ×3 sous En bref | S | **P0-v2** (shell V2-S3) |
| V2-14-4 | Module CSF \| Notaire sous outil | S–M | **P0-v2** (spécifique #14) |
| V2-14-5 | Portrait mid `/seo/portrait.jpg` + libellé CSF · Victoriaville | S | **P0-v2** (shell V2-S4) |
| V2-14-6 | Trous XXL + SoftClose `tone` warn/ok + keyed motion | S–M | **P1** |
| V2-14-7 | Mobile cases-first (`flex-col-reverse` / reorder) | S | **P1** |
| V2-14-8 | Events `first_check` / `gaps_reveal` | S | **P2** |
| V2-14-9 | Ads Ad2 micro-ligne portrait après coches | S | **P2** |

**P0-v2 = ship Vague 2 pour cette campagne** (chrome + module métier).  
**Dépendances shell :** V2-S1 atmosphere · V2-S2 heroExtras · V2-S3 processSteps · V2-S4 portrait mid · V2-S5 motion helpers.  
**Spécifique #14 :** module CSF \| Notaire + copy process/chips + climax Trous.

---

## Uniformité catalogue

Même **système shell** que les 14 autres campagnes. On différencie le **sujet** (atmosphere dossier, chips, climax Trous, module CSF\|Notaire) — on ne réinvente pas mid, SoftClose, FAQ layout ni footer outil.

| Contrat shell | Règle | Statut #14 V2 |
|---------------|-------|---------------|
| Structure page | Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ (même ordre) | Module CSF\|Notaire s’insère **entre Outil et Mid** (contenu sujet, pas nouveau SoftClose) |
| Hero CTAs | Primaire outil / secondaire RDV — mêmes variantes boutons | **Déjà P0** — ne pas changer |
| SoftClose | `ToolSoftClose` uniquement ; RDV primary + PDF ghost | **Déjà P0** sous climax — ne pas bandeau custom |
| Portrait | Même vignette `/seo/portrait.jpg` + libellé CSF · Victoriaville | **À ajouter** au mid (contrat V2-S4) |
| Process strip | Même composant / classes ; seuls les 3 libellés changent | Labels succession (script) |
| Typo climax | `font-heading` + `text-3xl/4xl` (5xl fit si besoin) | Trous prioritaires — pas d’échelle orpheline hors tokens |
| Spacing / cards | Tokens prestige ; pas de palette solo hors teinte atmosphere | Module CSF\|Notaire = `primary/[0.04]` + `prestige-beige/40` |
| Motion | Helpers shell (fade SoftClose, keyed reveal) | Pas de lib motion locale |

**Autorisé à diverger :** `atmosphere` dossier, `heroExtras`, module CSF\|Notaire, typo Trous, copy.  
**Interdit :** SoftClose one-off, mid CTA reinventé, FAQ layout custom, nouvelles photos.

---

## Critères acceptation « ami reconnaît en 5 s »

- [ ] Hero sent le **dossier / liquidité** (atmosphere + chips), pas un clone orbes
- [ ] Process visible : coche → portrait → CSF **ou** notaire
- [ ] Sous l’outil : split **Avec moi** \| **Avec le notaire** impossible à manquer
- [ ] Mid : visage `/seo/portrait.jpg` + CSF · Victoriaville
- [ ] SoftClose reste le composant catalogue sous les Trous
- [ ] Ami résume : « checklist succession — liquidité avec le conseiller, testament chez le notaire »
- [ ] Zéro funéraire / zéro « succession réglée »

---

## Ordre d’implémentation (quand code)

```text
1. Shell catalogue     → atmosphere, heroExtras, processSteps, portrait mid, motion helpers
2. campagneAdsLandings → atmosphere, heroExtras, processSteps (slug succession-bases)
3. CampagneAdsLanding  → render process + module CSF|Notaire + portrait mid
4. SuccessionChecklist → Trous XXL, tone SoftClose, keyed reveal, mobile order
5. QA 5 s + disclaimers Finance
```

---

## Hors scope

- Commit / push / implémentation  
- Re-spec SoftClose / dual CTA / mid Ad3  
- Simulateur fiscal / liquidité $  
- Changement des 6 items checklist
