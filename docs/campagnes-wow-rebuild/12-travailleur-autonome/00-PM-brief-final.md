# [#12] Travailleur autonome — Brief PM final (WOW → RDV)

**Slug :** `/campagnes/travailleur-autonome`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/travailleur-autonome  
**Date :** 2026-11-04  
**Équipe :** VISUEL → SCRIPT → OUTIL → FINANCE → PM  
**Livrables experts :** `01`–`04` dans ce dossier  
**Commit :** non — docs seulement

---

## 1. Vision WOW (1 paragraphe)

Le prospect autonome arrive de Meta avec une peur précise (pas de collective **ou** mois mauvais). La page le reconnaît immédiatement, le pousse à **cocher son filet** (pas à booker à froid), lui colle le climax `Mince` + prochaine case **sous les coches**, puis lui tend un pont humain : « Clarifier : Fonds d’urgence en 15 min — Clarifier ≠ acheter ». Le PDF devient un trophy secondaire qu’il peut apporter au RDV. Résultat : effet WOW = voir ses trous dans le bon ordre ; conversion = conversation sur **sa** case, pas un bandeau générique.

---

## 2. Scores (audit → cible)

| Métrique | Avant | Cible post-P0 |
|----------|-------|---------------|
| Expérience globale | 6 | ≥ 8 |
| Effet WOW outil | 5,5 | ≥ 8,5 |
| Enviede booker | 5 | ≥ 8 |
| Visuel | 6,5 | ≥ 8,5 |

---

## 3. Backlog shippable

### P0 — Ship WOW → RDV (obligatoire)

| ID | Quoi | Pourquoi | Où | Effort | Dépendance |
|----|------|----------|-----|--------|------------|
| P0-1 | Réordonner : Progression → checklist → Ton filet | Climax collé post-coche | `AutonomeChecklistTool.jsx` | M | — |
| P0-2 | Soft CTA RDV sur `nextItem.short` + Clarifier ≠ acheter | Pont émotion → Bookings | même fichier + `buildCampagneRdvPath` | M | P0-1 |
| P0-3 | Copy climax « mois mauvais » ; collective 1× intro | Match Ad2 ; fin fatigue | `statusDetail` / `filetDetail` / hints | S | — |
| P0-4 | 1 PDF footer + accents FR + note 15 min | Qualité + PDF secondaire | `handleDownload` + retirer PDF header | S | P0-1 |
| P0-5 | Hero dual CTA outil-first | Ad3 tenu | `CampagneAdsLanding.jsx` + data slug | S | Shell (compte 1/2) |
| P0-6 | Mid `ctaHeadline` / `ctaSubline` data-driven | Fin générique « Prêt à clarifier… » | `CampagneAdsLanding.jsx` L181–187 + data | S | Shell (compte 2/2) |
| P0-7 | Data copy : promise, bullets, faq×5, cta labels, apprendre urgence | Textes finaux script | `campagneAdsLandings.js` | S | Script |
| P0-8 | Events progress 1&3 + `filet_mince` + `_rdv_tool` | Retarget intent réel | outil + analytics | S | P0-2 |

### P1 — Qualité trous / confiance

| ID | Quoi | Effort | Notes |
|----|------|--------|-------|
| P1-1 | Toggles hypo/charges + RC → filtre `relevantItems` | M | Expert outil §4 |
| P1-2 | Process 4 steps sous En bref + pictos ordre | S–M | Visuel §5.1 |
| P1-3 | Ligne confiance CSF · Victoriaville sous mid | S | Script |
| P1-4 | 2e lien Apprendre (invalidité) si shell l’autorise | S | Sinon urgence only OK |
| P1-5 | Override sous-titre « À toi de jouer » slug-aware | S | Optionnel |
| P1-6 | Disclaimer renforcé revenu net / situation perso | S | Finance §4 |

### P2 — Polish

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Texture ledger / atmosphère TA sur hero ou `#outil` | S–M |
| P2-2 | Motion fade soft strip + stagger pictos | S |
| P2-3 | Photo desk solo (seulement si A+B insuffisants) | L |
| P2-4 | `hasInteracted` : masquer ResultCards avant 1ʳᵉ coche | S |

---

## 4. Ordre d’implémentation recommandé

```
1. Data copy (P0-7) — débloque review contenu
2. AutonomeChecklistTool DOM + copy + PDF (P0-1,3,4)
3. Soft RDV + events (P0-2, P0-8)
4. Shell : dual hero CTA (P0-5) puis mid data-driven (P0-6)
   ⚠️ Max 2 touch shell catalogue — ces deux-là, pas plus en P0
5. QA mobile climax + tracking
6. P1 toggles / process / confiance
7. P2 atmosphère
```

**Parallélisation :** 1+2 possibles en parallèle ; 4 après review copy ; 5 bloque le « done ».

---

## 5. Dépendances shell vs campagne

| Changement | Scope | Commentaire |
|------------|-------|-------------|
| Dual CTA hero (`#outil` + RDV soft) | **Shell** `CampagneAdsLanding` | Générique via `ctaPrimaryHref` / labels — utile autres campagnes |
| Mid headline/subline data | **Shell** branche RDV | Aujourd’hui hardcodé ; form a déjà les champs |
| Réordre outil + soft RDV + PDF | **Campagne only** | `AutonomeChecklistTool.jsx` |
| FAQ / bullets / promise | **Data** slug | Aucun shell |
| Toggles N/A | **Campagne only** | — |
| 2e Apprendre | Shell optionnel P1 | Ne pas brûler un 3e slot shell en P0 |

**Règle PM :** P0 consomme **exactement 2** modifications shell (hero dual + mid data). Tout le reste reste dans l’outil / data.

---

## 6. Critères d’acceptation « effet WOW + booker »

### Parcours test (mobile + desktop)

1. Arrivée Ad3 → hero primaire « Coche ton filet » → scroll `#outil`
2. Décocher défaut ; cocher urgence=non, factures=non (laisser non)
3. **Sans remonter :** voir `Mince` + « Fonds d’urgence » + Trous #1
4. En <2 s : CTA « Clarifier : Fonds d’urgence en 15 min » + Clarifier ≠ acheter
5. Clic → path RDV campagne + event `_rdv_tool`
6. PDF une fois, accents FR, note apporte résumé
7. Mid répète peur TA (revenu / hypo), pas « Prêt à clarifier ta situation ? »
8. FAQ : gratuit/sans compte + tu vends ? présents
9. Ami regarde l’écran 5 s → comprend « filet mince → urgence → 15 min »

### Conformité (finance)

- [ ] Pas de « remplacer la collective »
- [ ] Invalidité = « une partie du revenu »
- [ ] Disclaimers outil + footer intacts (+ renfort P1-6)
- [ ] Ads disclaimer épinglé inchangé

---

## 7. Hors scope / ne pas faire

- Refonte globale `PageHero` orbs pour toutes les campagnes
- Pitch produit invalidité forcé si trou = liquidité
- Calculatrice de primes / % remplacement
- Commit / deploy (sauf demande explicite)
- Fusionner avec landing `#11` collective

---

## 8. Owners & Definition of Done

| Rôle | DoD |
|------|-----|
| Visuel | Hero outil-first + climax visible mobile + 1 PDF |
| Script | Textes collés data + ads alignées + FAQ 5 |
| Outil | Ordre DOM + soft RDV + events |
| Finance | Claims validés ; interdits respectés |
| PM | P0 passé critères §6 ; shell ≤2 touches |

**Done campagne #12 :** P0-1…P0-8 mergés + QA parcours §6 vert.

---

## 9. Synthèse exécutive

| Levier | Action unique |
|--------|----------------|
| WOW | Checklist puis insight `Mince` collé |
| RDV | Soft CTA nommé sur `nextItem` dans l’outil |
| Ads | Hero = même geste que Ad3 (« Coche ») |
| Confiance | Clarifier ≠ acheter + CSF Victoriaville |
| Risque | Qualitatif only — pas de claim collective/employé |

**Prochaine action dev :** implémenter P0 dans l’ordre §4 — commencer par `campagneAdsLandings.js` + réordre `AutonomeChecklistTool.jsx`.
