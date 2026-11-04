# [#05] PM — Brief final WOW → RDV — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**URL live :** https://www.pierreoliviercaouette.ca/campagnes/retraite-reer-celi  
**Date :** 2026-11-04  
**CTA :** RDV Bookings  
**Livrables experts :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Audit source :** `docs/plan-modification-marketing/05-retraite-reer-celi.md`  
**Pas de commit** (brief seulement).

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta (Ad2/Ad3) arrive sur un hero qui **sent** REER · CELI et l’invite d’abord à **essayer le prioriseur** — pas à booker à froid. En quatre réponses (plus matching employeur), il voit où part son prochain dollar : en mixte, les **250 $ / 250 $** dominent l’écran en ton nuance (plus jamais d’alerte ambre au load). Dans les deux secondes, « Réserver 15 min avec mon résumé » colle l’ordre au matching / plafonds / vraie vie ; le PDF passe en secondaire. Mid et FAQ ferment les objections. Résultat : insight personnel → soft close chiffré → RDV, zéro pitch.

---

## 2. Scores cibles

| Métrique | Audit | Cible post-refonte |
|----------|------:|-------------------:|
| Expérience globale | 5,5 | ≥ 7,5 |
| Effet WOW outil | 6 | ≥ 8 |
| Env. booker | 5 | ≥ 7 |

---

## 3. Backlog shippable

### P0 — ship #05 cette itération (effort S sauf noté)

| ID | Quoi | Pourquoi booke | Où | Effort | Owner spec |
|----|------|----------------|-----|--------|------------|
| P0-1 | Tone mixte `warn` → `nuance` (pas d’ambre / triangle) | Cas majoritaire = affiner, pas « erreur » | `RetraiteReerCeliTool.jsx` `buildSuggestion` + `ResultCard` | S | Outil + Visuel |
| P0-2 | Snapshot mixte : $ XXL dominant | Climax Ad2 « prochain dollar » | Snapshot L382–400 | S | Outil + Visuel |
| P0-3 | Footer dual : RDV primary + PDF outline + `…_rdv_tool` | Pont climax → calendrier | Footer outil + `buildCampagneRdvPath` | S | Outil |
| P0-4 | Data landing : promise, bullets, `ctaHeadline` / `ctaSubline`, FAQ +2 | Continuité émotionnelle + freins fermés | `campagneAdsLandings.js` | S | Script |
| P0-5 | Mid CTA lit `ctaHeadline` / `ctaSubline` (branche RDV) | Plus de « Prêt à clarifier… » générique | `CampagneAdsLanding.jsx` ~L181–187 | S | Shell |
| P0-6 | Microcopy footer / post-PDF selon `suggestion.key` | Soft close cite mon ordre / $ | Outil | S | Script + Outil |
| P0-7 | PDF accents + disclaimer | Polish conformité au moment « garder » | `handleDownload` | S | Outil + Finance |

### P1 — fort impact booker (M)

| ID | Quoi | Où | Effort |
|----|------|-----|--------|
| P1-1 | Toggle matching Oui / Non / Je sais pas + raison éducative + PDF row | `RetraiteReerCeliTool.jsx` Block 1 + `buildSuggestion` | M |
| P1-2 | Hero dual CTA outil-first (`#outil`) + ligne confiance CSF | `CampagneAdsLanding.jsx` + data flag | S–M (shell) |
| P1-3 | `id="outil"` + eyebrow « Prioriseur REER · CELI » | Landing | S |
| P1-4 | `ToolDownloadPdf` `variant="outline"` | `CampagneToolShell.jsx` | S (shell) |
| P1-5 | Capsules dual REER · CELI (`/apprendre/celi` 2ᵉ lien) | Landing mid | S–M |
| P1-6 | Ads Ad1–Ad3 micro-ajustements (matching / $ / outil-first) | `emails/campagne-meta-catalog/retraite-reer-celi.md` | S |

### P2 — polish premium

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Kicker / dual bars « REER · CELI » atmosphère hero | S–M |
| P2-2 | Count-up $ + transition tone | S |
| P2-3 | Strip process 3 pas (Répondre → PDF → 15 min) | M shell |
| P2-4 | Bandeau post-PDF → RDV | S |

---

## 4. Ordre d’implémentation recommandé

```
1. P0-1 tone nuance          ┐
2. P0-2 snapshot $           ├─ RetraiteReerCeliTool.jsx (même PR outil)
3. P0-3 footer RDV + events  │
4. P0-6 / P0-7 copy+PDF      ┘
5. P0-4 data landing
6. P0-5 shell mid headline          ← débloque copy P0-4
7. P1-1 matching
8. P1-4 PDF outline shell
9. P1-2 / P1-3 hero outil-first     ← shell partagé
10. P1-5 / P1-6 capsules + ads
11. P2 polish
```

**Dépendances :**  
- P0-4 mid copy **nécessite** P0-5 (sinon headlines inutilisées sur branche RDV).  
- P0-3 peut shipper sans shell outline (classes locales) ; P1-4 factorise.  
- P1-2 hero dual = dette shell catalogue (flag data) — ne bloque pas P0 outil.  
- Finance sign-off avant merge matching (P1-1).

---

## 5. Shell vs spécifique campagne

| Spécifique #05 | Shell / catalogue |
|----------------|-------------------|
| Tone nuance + snapshot $ + matching + footer RDV copy par key | Mid `ctaHeadline` pour **toutes** landings RDV |
| Data slug retraite (faq, bullets, promise) | Dual CTA hero + `id="outil"` |
| Ads retraite | `ToolDownloadPdf` outline |
| Filigrane REER · CELI | Optionnel process strip 3 pas |

---

## 6. Critères d’acceptation « effet WOW + booker »

Repris audit §7 + experts :

- [ ] Climax impossible à manquer : mixte → **$ XXL** ; CELI/REER → short vert ; **jamais** warn ambre par défaut  
- [ ] CTA RDV dans les **2 s** après climax (footer in-tool), pas seulement mid  
- [ ] Identité sujet : signal **REER · CELI** (kicker et/ou copy / dual bars)  
- [ ] Ami comprend en 5 s : « il valide mon ordre 250/250 + matching »  
- [ ] PDF secondaire (outline) ; tracking `campagne_retraite-reer-celi_rdv_tool`  
- [ ] FAQ matching + CELIAPP présentes  
- [ ] Disclaimers outil + CTA + bas de page (finance §5)  
- [ ] Régressions : liquidité→CELI ; élevée+long→REER  
- [ ] Mobile : RDV au-dessus du PDF, thumb-friendly  

---

## 7. Risques & décisions PM

| Risque | Décision |
|--------|----------|
| Matching change la perception de l’algo | **P1** : raison + pont RDV seulement — **pas** de forçage split REER (finance) |
| Shell dual hero retarde #05 | Shipper **P0 outil** sans attendre ; hero en P1 |
| Cannibalisation PDF | Inverser hiérarchie visuelle CTA (P0-3) — non négociable |
| Confusion CELIAPP | FAQ seulement + lien campagne/capsule — hors algo |
| Defaults 500 $ spoilent | **Garder** defaults (WOW $ immédiat) ; fixer le tone, pas les defaults |

---

## 8. Definition of Done (DoD)

1. Specs 01–04 respectées sur P0.  
2. Smoke desktop + mobile sur URL campagne (ou preview).  
3. Events RDV tool visibles analytics / dataLayer.  
4. Checklist finance §8 cochée.  
5. Pas de commit tant que non demandé explicitement.

---

## 9. Synthèse one-liner pour l’équipe

**Neutraliser le mixte, agrandir les $, brancher le Bookings au footer, traiter le matching, tuer le mid générique — le PDF devient la pièce jointe du RDV, pas la sortie.**
