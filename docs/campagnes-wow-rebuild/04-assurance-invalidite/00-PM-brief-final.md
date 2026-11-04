# [#04] PM — Brief final WOW → RDV — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/assurance-invalidite  
**Date :** 2026-11-04  
**CTA :** RDV Bookings  
**Livrables rôles :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit :** non (brief seulement)

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive sur le mythe « ma collective me suffit », joue quatre chiffres, et voit **en même temps** le trou mensuel et le coussin d’attente — le double punch Ad1+Ad2. Au pic, un CTA **Clarifier mon trou en 15 min** cite *ses* montants et promet d’ouvrir le livret (%, délai, définition) ; le PDF devient souvenir secondaire. Même si les $ « tiennent sur papier », on n’enferme pas : on ouvre la vraie peur contrat. Hero outil-first (Ad3), soft close mid chiffré, FAQ livret. Résultat : page qui sent le sujet (paie/livret), insight perso, bridge booker immédiat — pas « je télécharge pour ce soir ».

---

## 2. Scores & écart

| Métrique | Audit | Cible post-refonte |
|----------|-------|-------------------|
| Expérience globale | 6 | 8+ |
| Effet WOW outil | 7 | 9 |
| Envie de booker | 5 | 8 |
| Prob. booker (client) | ~35 % | ≥ 55 % (qualitatif) |

**Fuite #1 :** climax → PDF only.  
**Fuite #2 :** hero RDV avant outil (dissonance Ad3).  
**Fuite #3 :** `!gapWarn` = fausse clôture + mid générique.

---

## 3. Backlog shippable

### P0 — ship cette itération (WOW → RDV)

| ID | Quoi | Pourquoi | Où | Effort | Rôle source |
|----|------|----------|-----|--------|-------------|
| P0-1 | Footer outil : RDV outline chiffré + PDF ghost + track `…_rdv_tool` | Booker au pic | `InvaliditeTool.jsx` L186–191, L125–129 | **S** | Outil + Script |
| P0-2 | Chips délai 30/90/120 + hint « Pas le livret ? » | Insight Ad2 *personnel* | `InvaliditeTool.jsx` L261–271 | **S** | Outil + Script |
| P0-3 | État `!gapWarn` → définition/durée (pas « t’es correct ») | Conformité + objection réelle | `statusDetail` + note L317–322 | **S** | Finance + Outil |
| P0-4 | Snapshot duo Trou \| Coussin | Double climax visible | `InvaliditeTool.jsx` L193–230 | **S** | Visuel + Outil |
| P0-5 | Soft close mid data-driven (`ctaHeadline`/`ctaSubline`) | Continuité émotionnelle | `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` L181–187 | **S–M** | Script + Visuel |
| P0-6 | FAQ +3 (définition, durée, individuelle) | Leads plus chauds | `campagneAdsLandings.js` faq | **S** | Script + Finance |
| P0-7 | PDF accents FR + note next-step livret/RDV | Souvenir hors page → booker | `handleDownload` L131–178 | **S** | Outil + Finance |

### P1 — fort impact, shell ou asset

| ID | Quoi | Où | Effort |
|----|------|-----|--------|
| P1-1 | Hero outil-first : « Voir mon trou » → `#outil` + RDV secondary | `CampagneAdsLanding.jsx` L79–88 + `id="outil"` | **S** (copy) / **M** si API hero |
| P1-2 | Hero image sujet (bureau/livret) full-bleed | `PageHero` prop **ou** variante landing + asset public | **M–L** *(shell partagé — coordonner)* |
| P1-3 | Ligne confiance sous hero | Landing | **S** |
| P1-4 | Ligne process sous En bref | Landing | **S** |
| P1-5 | Chip rapide 60 % + hint net vs brut (1 ligne FAQ) | Outil / FAQ | **S** |
| P1-6 | Ads Ad1–Ad3 micro-align (coussin, chips, outil-first) | `emails/campagne-meta-catalog/assurance-invalidite.md` | **S** |

### P2 — polish

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Motion entrée chiffre snapshot (ambre) | S |
| P2-2 | Réduire redondance Block 2 vs snapshot | S |
| P2-3 | Mock aperçu livret/PDF | M |
| P2-4 | `ToolDownloadPdf` variant ghost réutilisable shell | S–M *(shell)* |

---

## 4. Ordre d’implémentation recommandé

```
1. InvaliditeTool.jsx
   P0-4 snapshot duo → P0-2 chips → P0-3 statusDetail → P0-1 footer RDV → P0-7 PDF
2. campagneAdsLandings.js
   P0-5 copy mid + P0-6 FAQ (+ promise/bullets script)
3. CampagneAdsLanding.jsx
   P0-5 brancher ctaHeadline/ctaSubline branche RDV
   P1-1 id="outil" + duo CTA hero (même PR si possible)
4. Asset + PageHero (PR séparée si touche shell multi-campagnes)
   P1-2 / P1-3
5. Ads catalogue
   P1-6
```

**Règle dépendances :**  
- Specifique campagne (`InvaliditeTool` + entrée `assurance-invalidite`) = PR A possible seule.  
- Shell (`CampagneAdsLanding` mid + hero `#outil`) = utile à **toutes** les campagnes RDV → faire propre / feature-flag via champs data.  
- `PageHero` image = **shell global** → ne pas bloquer P0 outil.

---

## 5. Copy figée à brancher (extrait)

| Clé | Valeur |
|-----|--------|
| promise | Quatre chiffres — tu vois le trou vs tes dépenses, et ce qu’il faut tenir pendant l’attente. Sans compte. |
| ctaHeadline | Ton trou vs dépenses, c’est clair sur papier. |
| ctaSubline | 15 min : on valide le %, le délai, et la définition (« ta job » vs « n’importe quelle job »). Sans pression. |
| CTA outil | Clarifier mon trou en 15 min |
| Hero primary | Voir mon trou |
| Track outil | `campagne_assurance-invalidite_rdv_tool` |

Textes complets : `02-expert-script.md`.

---

## 6. Critères d’acceptation « effet WOW + booker »

- [ ] Climax impossible à manquer : **trou + coussin** duo (ambre si warn) sans scroller Block 2  
- [ ] CTA RDV visible **< 2 s** après lecture du climax (footer outil)  
- [ ] PDF n’est plus le bouton le plus fort post-résultat  
- [ ] `!gapWarn` ouvre définition/durée — ne dit plus « t’es correct / garde le PDF »  
- [ ] Chips 30/90/120 changent le coussin immédiatement  
- [ ] Mid navy reprend le sujet invalidité (pas « Prêt à clarifier ta situation ? »)  
- [ ] ≥ 5 FAQ dont définition + durée + individuelle  
- [ ] PDF FR + note « 15 min / aucun % promis »  
- [ ] Events : `…_rdv_tool` (+ hero outil si P1-1)  
- [ ] Ami qui voit l’écran comprend en 5 s : « son trou + son coussin → livret 15 min »  
- [ ] *(P1)* Hero sent paie/livret ; CTA primaire = outil (Ad3)

---

## 7. Risques & décisions PM

| Risque | Mitigation |
|--------|------------|
| Shell mid hardcodé bloque copy | Brancher `ctaHeadline`/`ctaSubline` pour **toutes** les landings RDV (bénéfice catalogue) |
| Image hero retarde le ship | Shipper P0 outil **sans** attendre asset ; P1-2 ensuite |
| Defaults trop dramatiques | Hint livret + finance GO ; ne pas durcir les defaults |
| Confusion avec #06 / #11 | FAQ + ne pas élargir l’outil en checklist collective |
| Lead froid « PDF ce soir » | P0-1 non négociable |

**Décision :** prioriser **pont RDV au climax** + **conformité `!gapWarn`** avant polish hero photo.

---

## 8. Fichiers touchés (carte)

| Fichier | P0 | P1 |
|---------|----|----|
| `frontend/src/components/campagne/tools/InvaliditeTool.jsx` | ✓ | chip % |
| `frontend/src/data/campagneAdsLandings.js` | ✓ | — |
| `frontend/src/pages/CampagneAdsLanding.jsx` | mid | hero `#outil` |
| `frontend/src/components/layout/PageHero.jsx` | — | image (shell) |
| `emails/campagne-meta-catalog/assurance-invalidite.md` | — | ads |
| Asset `invalidite-feed` → public | — | hero |

---

## 9. Definition of Done

1. Les 5 critères audit §7 cochés (dont identité sujet en P1 si asset prêt ; sinon documenter écart).  
2. Revue finance checklist §6 = GO.  
3. Test manuel mobile : defaults → chip 120 → footer RDV → Bookings UTM conservés.  
4. Pas de commit tant que le parent / utilisateur ne le demande.

---

## 10. Synthèse exécutive

**Ship P0 (S, ~1 PR outil + 1 PR data/shell mid) :** duo snapshot, chips délai, status/RDV footer, PDF FR, mid + FAQ.  
**Ensuite P1 :** hero outil-first + atmosphère livret/bureau + ads.  
**Ne pas** laisser le PDF comme next step ni le vert « t’es correct » tuer le mythe Ad1.
