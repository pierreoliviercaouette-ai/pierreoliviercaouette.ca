# [#10] Trop jeune — Brief PM final (WOW → RDV)

**Rôle :** Gestionnaire de projet  
**Campagne :** `trop-jeune-assurance`  
**Date :** 2026-11-04  
**Livrables experts :** `01-visuel` · `02-script` · `03-outil` · `04-finance`  
**Live de référence :** score 33/100 · capital 455 000 $ spoilés au load · CTA hero RDV · mid générique  
**Pas de commit** (brief seulement)

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive pour **essayer un score sans compte**, pas pour se faire closer. Au load, l’outil montre un présent léger (dettes seules) — pas un pitch 455 k$. Quand il coche hypothèque / famille **déjà connues**, le score saute et le capital se split **Aujourd’hui vs Projets connus** : le mythe « trop jeune » tombe sur *son* geste. Dans les 2 secondes, un soft close cite **son** score et **son** capital : 15 min pour lire ça ensemble — clarifier ≠ acheter. PDF = souvenir à apporter, pas la sortie principale. Résultat : insight personnel → envie de booker, pas une démo pré-cuite.

**Cibles post-refonte (notes expertes) :** expérience ≥ 8 · WOW outil ≥ 8 · envie booker ≥ 7.

---

## 2. Backlog shippable

### P0 — ship immédiat (WOW + conversion)

| ID | Quoi | Pourquoi booke | Où | Effort | Source |
|----|------|----------------|-----|--------|--------|
| P0-1 | Defaults futur `non`/`non` + coach toggle | Ownership / aha | `TropJeuneTool.jsx` L163–167 | **S** | Outil |
| P0-2 | Split capital Aujourd’hui / Projets / Total dans ResultCard | Mythe-killer Ad2 visible | `TropJeuneTool.jsx` capital + Lecture | **S** | Outil + Visuel |
| P0-3 | Soft close RDV score-aware sous Lecture + event `_rdv_outil` | Capture pic émotionnel | `TropJeuneTool.jsx` + `buildCampagneRdvPath` | **M** | Outil + Script |
| P0-4 | Hero dual CTA : primaire `#outil` / secondaire RDV | Répare soft-close Meta | `CampagneAdsLanding.jsx` + data | **S** | Visuel + Script |
| P0-5 | Copy data : promise, bullet #3, mid `ctaHeadline`/`ctaSubline`, intro outil | Align ads → page → book | `campagneAdsLandings.js` + mid RDV branch | **S** | Script |
| P0-6 | Label contrib `Proche dépend de toi` | Confiance climax | `TropJeuneTool.jsx` ~L242 | **S** | Outil + Script |

### P1 — renforce book + conformité

| ID | Quoi | Où | Effort |
|----|------|-----|--------|
| P1-1 | FAQ « attendre / prix » + « collective » (max 5) | `campagneAdsLandings.js` | **S** |
| P1-2 | Jalons dirty + PDF accents FR + note « Apporte en RDV » | `TropJeuneTool.jsx` | **S** |
| P1-3 | Footer : PDF secondaire si score ≥ 15 ; statusDetail sans « Garde le PDF » seul | `TropJeuneTool.jsx` | **S** |
| P1-4 | Proof strip CSF · Victoriaville · clarifier ≠ acheter | Landing sous outil ou mid | **S** |
| P1-5 | Sync Ad2 split + Ad3 collective (emails catalog) | `emails/…/trop-jeune-assurance.md` | **S** |
| P1-6 | Option : case informative « collective déjà en place » (hors score) | `TropJeuneTool.jsx` | **M** |

### P2 — polish

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Sticky score bar mobile | M |
| P2-2 | Motion fade sous-ligne split + pastilles | S |
| P2-3 | Accent typo « trop jeune » / badge mythe | S |
| P2-4 | Photo conseiller au mid (si asset) | S |

---

## 3. Ordre d’implémentation

```
1. TropJeuneTool defaults + coach          (P0-1)     — débloque le WOW
2. Split capital + label contrib           (P0-2,6)   — narratif climax
3. Soft close RDV sous Lecture + footer    (P0-3, P1-3)
4. Data copy bullets/promise/faq/cta*      (P0-5, P1-1)
5. CampagneAdsLanding dual CTA + id=outil  (P0-4)
   + mid lit ctaHeadline/ctaSubline (RDV)
6. Jalons dirty + PDF FR                   (P1-2)
7. Proof strip + sync ads                  (P1-4,5)
8. P2 polish si bande passante
```

**Dépendance critique :** P0-4 (hero) peut shipper en parallèle de P0-1–3, mais **ne pas** shipper soft close ads cassé sans defaults fix — sinon le traffic outil voit encore le spoiler.

---

## 4. Shell vs spécifique campagne

| Changement | Portée | Note PM |
|------------|--------|---------|
| Dual CTA hero + `ctaHref` / `ctaSecondaryLabel` | **Shell** `CampagneAdsLanding.jsx` | Data-driven : autres campagnes gardent RDV seul si props absentes |
| Mid RDV lit `ctaHeadline` / `ctaSubline` | **Shell** | Aujourd’hui hardcodé « Prêt à clarifier… » — fix profite à tout le catalogue |
| `id="outil"` + intro section | **Shell** léger | Ancre réutilisable |
| Defaults, split, soft close outil, PDF, contrib, jalons | **Spécifique** `TropJeuneTool.jsx` | |
| Copy / FAQ / cta* | **Data** `campagneAdsLandings.js` entry trop-jeune | |
| Ads email | **Spécifique** catalog md | |

**Décision :** préférer props data-driven shell (pas de `if slug ===` sauf fallback temporaire). Effort shell S–M, ROI multi-campagnes.

---

## 5. Critères d’acceptation « effet WOW + booker »

### Parcours test (locataire 28 ans, 5 k$ dettes)

1. Arrive de Meta → hero dit **score** en premier CTA → scroll `#outil`.  
2. Load : score ≈ **1**/100 (dettes), capital ≈ **5 000 $** — **pas** 33 / 455 k$.  
3. Coche hypo Oui 350 k$ → score et pastille « Hypothèque prévue » apparaissent ; sous-ligne Projets ≈ 350 k$.  
4. Coche famille Oui → 2e saut ; total ≈ 455 k$ **après le geste**.  
5. Soft close sous Lecture cite score + capital → tap « Lire mon score en 15 min » → Bookings campagne.  
6. PDF disponible mais pas seul CTA dominant.  
7. FAQ répond « si j’attends » + collective sans claim prime.

### Checklist ami (5 s)
- [ ] Comprend : mythe âge + score présent/projets  
- [ ] Voit pourquoi booker : lire *mon* chiffre, pas « acheter »  
- [ ] Page ne sent pas un template RDV-first

### Conformité (finance)
- [ ] Aucune prime / % / « plus cheap »  
- [ ] Illustratif partout  
- [ ] Clarifier ≠ acheter

---

## 6. Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Shell dual CTA retarde ship | Fallback : override local slug trop-jeune seulement en 1 PR outil |
| Score trop bas au load → bounce | Coach step 2 + bullets « projets connus » + Ad2 aligné |
| Soft close trop « vente » | Copy finance : illustratif + clarifier ≠ acheter |
| Collective hors scope outil | FAQ + option P1-6 informative, hors score |

---

## 7. Definition of Done

- [ ] 5 livrables experts lus et P0 implémentés en code (ticket suivant)  
- [ ] QA live mobile + desktop sur parcours test  
- [ ] Events `_rdv_outil`, hero outil, PDF smoke-test  
- [ ] Ads catalog sync si P1-5  
- [ ] **Pas de commit** dans ce brief — commit seulement sur demande explicite

---

## 8. Résumé exécutif pour implémentation

**Une phrase :** anti-spoiler defaults → aha au toggle → split $ → RDV collé au score.  
**Fichiers chauds :** `TropJeuneTool.jsx`, `campagneAdsLandings.js`, `CampagneAdsLanding.jsx`.  
**Effort P0 total :** ~S+S+M+S+S+S ≈ **1–1,5 j** dev focus.  
**Impact conversion :** **H** (defaults + soft close + hero outil-first).
)
