# [#06] Maladie grave — Brief PM final (WOW → RDV)

**Slug :** `/campagnes/maladie-grave`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/maladie-grave  
**Date :** 2026-11-04  
**CTA :** RDV Bookings 15 min  
**Livrables experts :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit :** non (docs seulement)

---

## 1. Vision WOW (1 paragraphe)

Le prospect arrive de Meta convaincu que « j’ai déjà l’invalidité ». En une composition, la page **montre** deux jobs (revenu dans le temps vs capital forfaitaire), le laisse **estimer** un capital en 3 blocs (avec option solo), et transforme l’écart amber — déjà le meilleur asset de la page — en **15 minutes pour lire sa brochure**, pas en téléchargement PDF. Clarifier ≠ acheter. L’effet WOW n’est pas un nouveau chiffre magique : c’est monétiser le climax qui existe déjà.

**Scores cibles post-refonte :** expérience ≥ 8 · outil WOW ≥ 8,5 · envie de booker ≥ 7,5  
*(baseline audit : 5,5 / 6,5 / 4,5)*

---

## 2. Backlog shippable

### P0 — ship cette itération (WOW → RDV)

| ID | Item | Effort | Owner fichier | Dépendance |
|----|------|--------|---------------|------------|
| P0-1 | CTA RDV sous bandeau écart + `trackRendezVousClick('…_rdv_tool')` ; PDF ghost ; statusDetail brochure | **S** | `MaladieGraveTool.jsx` | — |
| P0-2 | Phrase « ce que ça paie » (3 blocs narrés en $) sous capital | **S** | `MaladieGraveTool.jsx` | script |
| P0-3 | Module contraste 2 cols Invalidité ≠ MG (dans tool si shell pas prêt) | **S** | `MaladieGraveTool.jsx` | visuel |
| P0-4 | Toggle `Pas de conjoint` → capital = soins + QV | **M** | `MaladieGraveTool.jsx` | — |
| P0-5 | Chip `Je ne sais pas → 0 $` + pont brochure | **S** | `MaladieGraveTool.jsx` | — |
| P0-6 | Copy data : promise, bullets, `ctaHeadline`, `ctaSubline`, FAQ +2 | **S** | `campagneAdsLandings.js` | script |
| P0-7 | Mid navy lit `ctaHeadline` / `ctaSubline` quand `!isFormCta` + ligne CSF · Victoriaville | **S–M** | `CampagneAdsLanding.jsx` | **shell** (max dettes) |
| P0-8 | Accents PDF + notes conformité | **S** | `MaladieGraveTool.jsx` | finance |

### P1 — juste après P0

| ID | Item | Effort | Owner | Dépendance |
|----|------|--------|-------|------------|
| P1-1 | Hero dual CTA : primaire `#outil` « Estimer mon capital » + ghost RDV | **M** | `CampagneAdsLanding.jsx` / `PageHero` | **shell** |
| P1-2 | `id="outil"` + scroll-mt sur wrapper tool | **S** | `CampagneAdsLanding.jsx` | P1-1 |
| P1-3 | Chips dual hero (Invalidité / MG) | **S** | landing hero children | visuel |
| P1-4 | Motion : reveal capital + pulse écart (`prefers-reduced-motion`) | **S** | `MaladieGraveTool.jsx` | — |
| P1-5 | Ads Ad1–Ad3 resserrés (outil-first + brochure) | **S** | `emails/…/maladie-grave.md` | script |
| P1-6 | Hint SCC condensé mobile (1 ligne + expand) | **S** | `MaladieGraveTool.jsx` | — |

### P2 — polish

| ID | Item | Effort |
|----|------|--------|
| P2-1 | Photo / présence humaine near mid CTA | M |
| P2-2 | Events optionnels solo_toggle / couvert_unknown | S |
| P2-3 | Contraste module aussi en section landing (si retiré du tool) | M |
| P2-4 | A/B label CTA écart avec/sans `~{ecart}` inline | S |

---

## 3. Ordre d’implémentation recommandé

```
1. P0-1  CTA RDV in-tool          ← plus gros levier booker (climax déjà là)
2. P0-2  Phrase 3 blocs $
3. P0-6  Copy landing + FAQ
4. P0-7  Mid headline data         ← shell (1/2)
5. P0-3  Module contraste 2 cols
6. P0-5  Chip 0 $
7. P0-4  Toggle solo
8. P0-8  PDF accents
9. P1-2  Ancre #outil
10. P1-1 Hero dual CTA             ← shell (2/2)
11. P1-3 Chips hero
12. P1-4 Motion
13. P1-5 Ads
14. P1-6 Hint SCC mobile
```

**Règle shell :** max 2 dettes shell dans le TOP (P0-7 + P1-1). Tout le reste = spécifique MG.

---

## 4. Critères d’acceptation « effet WOW + booker »

### Expérience
- [ ] En 5 s, Invalidité ≠ capital est **visible** (chips ou 2 cols), pas seulement FAQ
- [ ] Hero n’impose pas le RDV avant l’outil (dual CTA ou au minimum CTA outil accessible)
- [ ] Soft close mid cite capital / brochure / Clarifier ≠ acheter

### Outil
- [ ] Mount : capital ~90 k$ + écart amber **et** bouton RDV dans le même viewport
- [ ] Solo : chip → ~48 k$ sans framing couple
- [ ] PDF secondaire ; event `campagne_maladie-grave_rdv_tool` tire
- [ ] Phrase sous capital déplie conjoint / soins / QV (ou solo)

### Conformité
- [ ] Aucune promesse « tu recevras X $ »
- [ ] SCC = Canada, illustrative, ajustable
- [ ] FAQ collective + maladies/délai présentes
- [ ] Disclaimer outil + Clarifier ≠ acheter sur pont RDV

### Proxy mesure
- Ratio `…_rdv_tool` ≥ `…_rdv` (hero)
- ↓ PDF-only sans clic RDV
- En RDV : prospects qui mentionnent écart ou brochure

---

## 5. Dépendances shell vs spécifique

| Type | Items | Fichiers |
|------|-------|----------|
| **Shell** (partagé campagnes RDV) | Mid `ctaHeadline`/`ctaSubline` ; hero dual CTA + `#outil` | `CampagneAdsLanding.jsx`, éventuellement `PageHero` |
| **Spécifique #06** | CTA écart, solo, chip 0 $, contraste MG, phrase 3 blocs, FAQ, ads, PDF | `MaladieGraveTool.jsx`, `campagneAdsLandings.js` entrée `maladie-grave`, catalog ads |

Si le shell mid/hero glisse : **ship quand même P0-1…P0-6 + P0-8** — le levier booker #1 est in-tool.

---

## 6. Risques & mitigations PM

| Risque | Mitigation |
|--------|------------|
| Cannibalisation créa #04 | Vocabulaire capital / forfaitaire ; module ≠ ; pas les mêmes visuels « trou mensuel » |
| Defaults 90 k$ = pitch perçu | Labels illustratif + CTA « écart illustratif » + finance checklist |
| Shell bloqué | Contaste + CTA RDV 100 % dans le tool |
| Solo oublié | P0-4 non négociable avant scale CBO 30–55 |
| Over-scope motion/photo | P2 seulement |

---

## 7. Definition of Done (docs → code)

1. Les 5 fichiers de ce dossier lus par l’agent d’implémentation  
2. P0 coché en code + smoke mobile (écart + CTA pouce)  
3. Events `rdv_tool` vérifié en preview analytics  
4. Pas de régression #04 (slug / tool séparés)  
5. **Pas de commit** sauf demande explicite du product owner

---

## 8. Synthèse one-liner pour l’équipe

> **Monétise l’écart amber, prouve Invalidité ≠ MG en UI, inclus les solos, PDF en ghost — le RDV = lire la brochure, pas closer un produit.**
