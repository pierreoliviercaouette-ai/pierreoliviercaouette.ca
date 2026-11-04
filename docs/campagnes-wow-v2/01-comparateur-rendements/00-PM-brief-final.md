# [#01] Brief final PM — Comparateur rendements (Vague 2 post-P0)

**Slug :** `/campagnes/comparateur-rendements`  
**Vague :** 2 (post-P0)  
**Signé :** Gestionnaire de projet  
**Date :** 2026-11-04  
**Livrables lus :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**État P0 en code :** SoftClose + PDF ghost · dual CTA hero · `ctaHeadline` mid · chip mythe · narration · `_result` — **SoftClose encore footer** · pas d’atmosphere · pas de process · pas d’écart-first · badge `Rendements`  
**Objectif conversion :** damn sur l’écart → book 15 min (Bookings campagne)  
**Conformité :** éducatif / illustration / CSF · iA — gate finance

**Interdits (ne pas re-spécifier) :** SoftClose contenu RDV/PDF · dual CTA · `ctaHeadline`/`ctaSubline` · shoot photos.

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | **7,2** | **≥ 9,0** |
| WOW outil | 6,5 | **7,4** | **≥ 9,0** |
| Env. booker | 4,5 | **7,0** | **≥ 8,5** |

**Top 1 gap WOW restant :**  
**Visuel** — hero encore template navy générique (zéro signal Banque\|Modèles).  
**Outil** — SoftClose footer-only + totaux avant l’écart → le « damn » et le booker sont séparés.  
→ **P0-v2 = atmosphere `split-compare` + heroExtras + SoftClose sous climax + écart-first + typo catalogue.**

---

## 1. Vision Vague 2 (1 paragraphe)

Le prospect Meta arrive déjà sur un funnel qui laisse jouer (P0). Vague 2 fait **reconnaître le comparateur en 5 s** : teinte CSS split Banque/Modèles, micro-ligne heroExtras, process strip catalogue, puis climax **écart XXL** (`font-heading text-3xl/4xl`) avec pulse et SoftClose **collé dessous** (toujours `ToolSoftClose`). Portrait CSF mid (`/seo/portrait.jpg`). Pas de nouvelles photos. Différenciation sujet seulement — le chrome reste le système des 15 campagnes.

---

## Uniformité catalogue

Le PM garantit le **même système** que les 14 autres landings. On différencie le **sujet** (#01 = split-compare + écart-first), pas le squelette.

| Contrat shell | Règle | #01 — validation |
|---------------|-------|------------------|
| Structure page | **Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ** (même ordre) | Process **ajouté** entre En bref et outil ; pas d’autre réordonnancement |
| Hero CTAs | Primaire outil / secondaire RDV — mêmes variantes boutons | **Déjà P0** — ne pas reinventer |
| SoftClose | Composant **`ToolSoftClose` uniquement** (pas de bandeau custom) ; RDV primary + PDF ghost | **Placement** sous climax seulement — **pas** de SoftClose one-off |
| Portrait | Même vignette **`/seo/portrait.jpg`** + même libellé **CSF · Victoriaville** (mid ou SoftClose) | Mid navy — composant partagé |
| Process strip | Même composant / classes ; seuls les **3 libellés** changent | `Tes chiffres` / `Profil égal` / `L’écart` |
| Typo climax | `font-heading` + `text-3xl/4xl` (ou `5xl` fit) — **pas** d’échelle orpheline | Retirer `style.fontSize` `ecartFontScale` → classes catalogue |
| Spacing / cards | Tokens prestige ; pas de palette solo hors teinte atmosphere | Teinte `split-compare` seulement |
| Motion | Helpers shell partagés (fade SoftClose, keyed reveal, pulse) | Pas de lib motion #01-only |

**Autorisé à diverger :** `atmosphere: 'split-compare'`, `heroExtras` Banque\|Modèles, climax écart-first + pulse, chip mythe (déjà).  
**Interdit :** reinventer mid CTA, footer outil générique, FAQ layout, SoftClose custom, process one-off, typo px orpheline.

| Contrat | OK ? | Note |
|---------|------|------|
| Ordre sections Hero→En bref→Process→Outil→Mid→FAQ | ☐ → ✅ à ship | Process manquant post-P0 |
| SoftClose = `ToolSoftClose` partagé | ✅ | Déjà ; move sous climax |
| Portrait + libellé CSF identiques | ☐ → ✅ | À brancher mid |
| Process strip même composant | ☐ → ✅ | Shell V2-S3 |
| Typo climax `font-heading` text-3xl/4xl | ☐ → ✅ | Remplace inline scale |
| Divergence seulement atmosphere / heroExtras / climax | ✅ (spec) | Visuel + outil alignés |

---

## 2. Spec Avant → Après (synthèse)

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers | Effort |
|------|---------------------|-----------------|----------|--------|
| Hero atmosphere | Orbs génériques | `atmosphere="split-compare"` tints + grain CSS | `PageHero.jsx`, `CampagneAdsLanding.jsx`, data | M |
| heroExtras | Absent | Split Banque \| Modèles | data + slot landing | S |
| Badge | `Rendements` | `Comparateur` | `campagneAdsLandings.js` | S |
| Process strip | Absent | 3 steps catalogue sous En bref | shell + data `processSteps` | S–M |
| SoftClose place | `footer` `CampagneToolShell` | Sous climax, toujours `ToolSoftClose` | `ComparateurRendementsTool.jsx` | S |
| Order résultats | Totaux → barres → écart | **Écart-first** → barres → totaux | tool | S |
| Typo écart | `style.fontSize` scale | `font-heading text-3xl md:text-4xl` (+5xl fit) | tool | S |
| Motion | Bar transitions | SoftClose fade + keyed bars + pulse (helpers shell) | tool + CSS shell | S |
| Portrait mid | Absent | `/seo/portrait.jpg` 48–64 + CSF · Victoriaville | `CampagneAdsLanding.jsx` | S |
| FAQ +2 | À vérifier | Produits différents / d’où les taux | data | S |
| Preuve 5 profils | Absent | Table live + disclaimer (P1) | landing / data | M |

---

## 3. Backlog shippable

### P0-v2 — Ship Vague 2 #01 (doit partir ensemble)

| ID | Item | Effort | Owner | Fichiers |
|----|------|--------|-------|----------|
| P0v2-1 | SoftClose sous climax (`ToolSoftClose`) | S | Outil | `ComparateurRendementsTool.jsx` |
| P0v2-2 | Écart-first + typo catalogue 3xl/4xl | S | Outil + Visuel | tool |
| P0v2-3 | Pulse écart + SoftClose fade + keyed bars (helpers shell) | S | Outil + Visuel + **Shell** | tool + CSS/`CampagneToolShell` |
| P0v2-4 | `PageHero` `atmosphere` + preset `split-compare` | M | Visuel + **Shell** | `PageHero.jsx`, landing, data |
| P0v2-5 | `heroExtras` Banque\|Modèles | S | Script + Visuel + **Shell** | data + landing |
| P0v2-6 | Process strip catalogue + 3 steps #01 | S–M | Script + Visuel + **Shell** | landing + data |
| P0v2-7 | Portrait mid partagé `/seo/portrait.jpg` | S | Visuel + **Shell** | landing |
| P0v2-8 | Badge `Comparateur` + FAQ +2 (si absentes) + gate finance copy | S | Script + Finance | data |

### P1 — Amplifie WOW / preuve

| ID | Item | Effort | Fichiers |
|----|------|--------|----------|
| P1-1 | Module preuve 5 profils + projection 20 ans live + disclaimer | M | landing / data / rates |
| P1-2 | Invite highlight taux relevé si préréglage actif | S | tool |
| P1-3 | Mobile : masquer taux inline radios non sélectionnés | S | tool |
| P1-4 | Ad2 catalog scénario composé 20 ans (finance-safe) | S | `emails/campagne-meta-catalog/…` |

### P2 — Nice-to-have

| ID | Item | Effort |
|----|------|--------|
| P2-1 | Sticky mini-bar écart mobile | M |
| P2-2 | Chip « Revenir au départ 10 k$ · 10 ans » | S |
| P2-3 | Event `…_climax_view` 1× | S |

---

## 4. Ordre d’implémentation

```
1. Shell Vague 2 (débloque 15 campagnes)
   └─ PageHero atmosphere · heroExtras slot · ProcessStrip · MidPortrait · motion helpers
2. Data #01 (atmosphere, heroExtras, processSteps, badge, FAQ)
3. ComparateurRendementsTool P0-v2 (SoftClose move, écart-first, typo, pulse/keys)
4. QA mobile : defaults → chip mythe → SoftClose collé → mid portrait → Bookings UTM
5. P1 preuve + Ad2 si même sprint
```

**Parallélisation :** shell (1) // data (2) // tool (3) si 2–3 devs ; finance review copy avant merge ads.

---

## 5. Dépendances shell vs spécifique

| Couche | Items | Impact catalogue |
|--------|-------|------------------|
| **Shell** | `atmosphere`, `heroExtras`, `processSteps`, portrait mid, motion helpers SoftClose/pulse | Positif — uniformité 15 landings |
| **Spécifique #01** | `split-compare` tint, copy Banque\|Modèles, process labels, écart-first + SoftClose move, chip mythe (déjà) | Isolé slug + tool |

**Règle PM :** props data-driven ; defaults = comportement actuel si champs absents (pas de régression des 14 autres).

---

## 6. Critères d’acceptation « ami en 5 s »

### Expérience / WOW
- [ ] Fold : signal Banque \| Modèles visible sans lire le H1.
- [ ] Ordre page = Hero → En bref → Process → Outil → Mid → FAQ.
- [ ] Climax : premier chiffre = **écart** en `font-heading text-3xl+`.
- [ ] SoftClose (`ToolSoftClose`) **sous** l’écart, pas seulement footer gris.
- [ ] Portrait mid = `/seo/portrait.jpg` + libellé CSF catalogue.
- [ ] Ami reconnaît « la pub du comparateur » en ≤5 s.

### Uniformité
- [ ] Pas de SoftClose / mid / process one-off.
- [ ] Pas de `font-size` inline orphelin sur l’écart.
- [ ] Divergence limitée à atmosphere / heroExtras / climax.

### Conformité (gate finance)
- [ ] « Illustratif » sur écart + SoftClose.
- [ ] Process step 3 = non-garantie.
- [ ] Classique 75/75 + produits différents + passés ≠ futurs.
- [ ] Aucun « gagner / garanti / meilleur que ta banque ».

### Analytics
- [ ] `_result` 1× · `_rdv_outil` · scroll outil · UTM Bookings.

---

## 7. Risques & mitigations

| Risque | Impact | Mitigation |
|--------|--------|------------|
| Shell atmosphere casse autres landings | Régression visuelle | Prop optionnelle ; default = hero actuel |
| SoftClose move oublié PDF ghost | Book ↓ | Toujours `ToolSoftClose` avec `onPdf` |
| Écart XXL = « pub mensongère » | Confiance | Label illustratif + disclaimer adjacent + FAQ |
| Process / portrait one-off par campagne | Catalogue incohérent | Composants partagés obligatoires |
| Typo px orpheline conservée | Divergence shell | Classes 3xl/4xl/5xl only |

---

## 8. Hors scope

- Nouvelles photos / full-bleed shoot.
- Rewrite SoftClose / dual CTA / ctaHeadline (déjà livrés).
- Changer formule `futureValueMonthly` ou préréglages banque sans brief finance.
- Refonte globale design system / polices.
- Commit / deploy — **sur demande PM produit seulement**.

---

## 9. Definition of Done

1. P0v2-1 → P0v2-8 mergés ; QA mobile + desktop `/campagnes/comparateur-rendements`.  
2. Checklist **Uniformité catalogue** 100 % ✅.  
3. Finance checklist § ship V2 cochée.  
4. Rescore mesuré ≥ cibles Exp 9 / WOW 9 / Booker 8,5.  
5. P1-1 si alignement organique / Ad2 même sprint.

**Go / No-Go booker V2 :** Go si SoftClose sous climax + écart-first + atmosphere/heroExtras + uniformité shell verts + gate finance.
