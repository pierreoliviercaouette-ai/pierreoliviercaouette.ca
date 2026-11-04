# [#03] PM — Brief final WOW → RDV

**Campagne :** Hypothèque + assurance vie  
**Slug :** `/campagnes/hypotheque-assurance-vie`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/hypotheque-assurance-vie  
**Date brief :** 2026-11-04  
**CTA :** RDV Bookings 15 min  
**Livrables experts :** `01-expert-visuel` → `02-expert-script` → `03-expert-outil` → `04-expert-finance`  
**Commit :** non (spec only)

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive avec Option 1 / Option 2 en tête et l’objection « c’est déjà réglé à la banque ». La page doit le mener en moins de 10 secondes à **son écart solde → famille** (defaults : 350 k$ vs 447 k$, +97 k$), pas à un mur de 5 critères « Lu ». Le climax émotionnel est monétisé **dans la même respiration** par un CTA « Clarifier banque vs famille (15 min) » ; le PDF devient souvenir secondaire. Hero et soft close portent l’identité **maison/famille** et le chiffre — plus un clone catalogue. Ads, outil et FAQ disent la même chose sur le **renouvellement\*** et n’agressent plus sur l’annulation. Résultat : wow visible → question ouverte → Bookings.

---

## 2. Scores & cible

| Métrique | Audit 2026-11-04 | Cible post-refonte |
|----------|------------------|--------------------|
| Expérience globale | 5 | ≥ 8 |
| Effet WOW outil | 6 | ≥ 9 |
| Envies de booker | 4.5 | ≥ 7.5 |

---

## 3. Backlog shippable

### P0 — Conversion (ship first)

| ID | Quoi | Pourquoi | Où | Effort | Dépendance |
|----|------|----------|----|--------|------------|
| P0-1 | Estimateur + gap **avant** tableau 5× (`<details>`) | Ads promettent le chiffre ; mur éducatif tue le scroll mobile | `AssuranceHypothecaireTool.jsx` | M | — |
| P0-2 | Bandeau climax `+{auDelaDuPret}` + barre visuelle | Rendre le « damn » impossible à manquer | même fichier post-ResultCards | S | — |
| P0-3 | CTA RDV inline post-écart + track `…_rdv_outil` ; PDF ghost | Monétiser le pic avant refroidissement | footer / bloc post-gap + `buildCampagneRdvPath` | S | — |
| P0-4 | Copy shell + renouvellement* carte prêteur | Alignement ads ↔ outil | tool L227–228, L285–286 | S | Finance ✓ |
| P0-5 | FAQ renouvellement* + data promise/bullets/ctaHeadline/Subline | Confiance post-Meta + mid non générique | `campagneAdsLandings.js` | S | Script ✓ |
| P0-6 | Mid navy lit `ctaHeadline`/`ctaSubline` | Soft close chiffré / sujet | `CampagneAdsLanding.jsx` ~L182–187 | S | Shell léger |

### P1 — Identité & polish

| ID | Quoi | Pourquoi | Où | Effort | Dépendance |
|----|------|----------|----|--------|------------|
| P1-1 | Dual CTA hero (scroll `#outil` primary / RDV secondary) + `id="outil"` | CTA RDV avant insight = friction | `CampagneAdsLanding.jsx` | S | — |
| P1-2 | Process 3 steps + ligne confiance CSF/Victoriaville | Moins de card soup ; preuve douce | landing | S | Visuel ✓ |
| P1-3 | Hero atmosphère foyer full-bleed (image + overlay) | Identité sujet ≠ template orbs | `PageHero` prop **ou** override campagne | M | **Shell** |
| P1-4 | Ad3 adoucie + titres tutoiement ; Ad1/2 outil-first | Conformité + match landing | `emails/…/assurance-hypothecaire.md` | S | Finance ✓ |
| P1-5 | PDF accents FR + notes disclaimer amortissement | Polish + conformité | `handlePdf` dans tool | S | Finance ✓ |
| P1-6 | Mobile : tableau entièrement en details fermé | Thumb / scroll fatigue | tool COMPARISON_ROWS | S | P0-1 |

### P2 — Nice-to-have

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Soft close mid dynamique branché aux montants outil (context/lift state) | L |
| P2-2 | Event `…_gap_view` IntersectionObserver | S |
| P2-3 | Vrai amortissement approximatif (taux/paiement) vs `×0.5` | L — hors sprint WOW |
| P2-4 | Photo conseiller hors hero (section confiance) | M |

---

## 4. Ordre d’implémentation recommandé

```
1. P0-1 ordre sections + details tableau
2. P0-2 bandeau gap + barre
3. P0-3 RDV inline + analytics
4. P0-4 / P0-5 / P1-5 copy + FAQ + PDF
5. P0-6 + P1-1 + P1-2 landing shell data-driven
6. P1-4 ads md
7. P1-3 hero image (shell) — peut paralleler si design asset prêt
8. QA mobile 390 + desktop + events + disclaimers
```

**Ne pas bloquer P0 sur le hero photo.** Le wow conversion est dans l’outil.

---

## 5. Dépendances shell vs spécifique #03

| Élément | Type | Notes |
|---------|------|-------|
| Mid `ctaHeadline`/`ctaSubline` pour CTA **RDV** (pas seulement form) | **Shell** `CampagneAdsLanding.jsx` | MRa a déjà le pattern form ; étendre branche RDV |
| Dual CTA hero + `#outil` | Shell landing | Réutilisable autres campagnes |
| `PageHero` backgroundImage | **Shell** | Compte comme upgrade catalogue #2 si généralisé |
| Ordre estimateur / gap / RDV outil | **Spécifique #03** | `AssuranceHypothecaireTool.jsx` |
| FAQ renouvellement* + Ad3 | Spécifique #03 | data + emails |
| Process 3 steps / confiance strip | Shell-ish data ou composant partagé | OK si props optionnelles |

---

## 6. Critères d’acceptation « effet WOW + booker »

Issus des 4 experts + audit §7 :

1. **Climax impossible à manquer** — avec defaults, `+97 000 $` (ou équivalent formaté) dominant sans ouvrir le tableau.
2. **CTA RDV ≤ 2 s après climax** — visible même viewport ou un demi-écran ; event `campagne_hypotheque-assurance-vie_rdv_outil`.
3. **Identité sujet** — hero ou au minimum process/copy ne pourrait pas être une autre campagne catalogue après retrait de la nav (P1-3 idéalement coché).
4. **Ami comprend en 5 s** pourquoi Book — soft close cite écart solde → famille.
5. **Conformité** — pas de « annulation généralement sans frais » en hook ; renouvellement* cohérent ads/outil/FAQ ; disclaimers amortissement + créancier ≠ perso.
6. **PDF secondaire** — contraste / ordre visuel inférieur au RDV post-climax.

---

## 7. Recette QA rapide

- [ ] Live path + alias `/campagnes/assurance-hypothecaire`
- [ ] Defaults → 350 k$ / 447 k$ / +97 k$ / ×2,0
- [ ] Clic RDV outil → `/rendez-vous/campagne?…` + UTM préservés
- [ ] Mid + hero events distincts (`_rdv`, `_rdv_mid`, `_rdv_outil`)
- [ ] FAQ 5 : inclut renouvellement
- [ ] Mobile : pas de mur 5 critères avant gap
- [ ] Ad file mis à jour (si P1-4 dans le même ship)

---

## 8. Hors scope (ce brief)

- Commit / deploy
- Refonte vidéo créative Meta
- Calcul d’amortissement exact
- Fusion ou suppression du slug alias
- Changements `HypothequeVieTool.jsx` au-delà du re-export

---

## 9. Synthèse propriétaire

| Rôle | Livrable | Décision PM retenue |
|------|----------|---------------------|
| Visuel | Hero foyer + gap dominant + mid chiffré | P0 = gap ; hero image = P1 shell |
| Script | Textes coller + Ad3 douce + FAQ×5 | Adopté tel quel |
| Outil | Estimateur first + RDV post-gap | Cœur P0 |
| Finance | Interdits + disclaimers + formulation « illustratif » | Gate merge copy/ads |

**Next step implémentation :** démarrer P0-1 → P0-3 dans `AssuranceHypothecaireTool.jsx`, puis data landing + mid shell.
