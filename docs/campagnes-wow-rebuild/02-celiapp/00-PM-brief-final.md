# [#02] CELIAPP — Brief PM final (WOW → RDV)

**Campagne :** `/campagnes/celiapp`  
**Date :** 2026-11-04  
**Sources consolidées :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance` · audit `plan-modification-marketing/02-celiapp.md`  
**CTA :** RDV Bookings 15 min · **Pas de commit** (livrable spec seulement)

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive pour un **simulateur gratuit**, pas pour un calendrier : le hero dit « 1ʳᵉ propriété / CELIAPP », dual CTA **Projeter** (primary) / Clarifier 15 min (secondary), sans strip portefeuilles ni orbes clones. Il ajuste un rythme **réaliste** (4 k$ × 4 ans → ~16 k$), lit enfin le headline « Environ X $ pour ta mise de fonds », voit optionnellement l’écart vs sa cible et un check admissibilité **sans verdict**. Dans la même respiration, un bandeau navy lui propose de **clarifier droit d’ouvrir, rythme et CELI vs CELIAPP** — le PDF passe en outline. Il booke parce que le chiffre crée une question personnelle, pas parce qu’on lui a vendu un fichier.

---

## 2. Backlog P0 / P1 / P2

### P0 — ship conversion (effet WOW + booker)

| ID | Item | Effort | Owner fichier |
|----|------|--------|---------------|
| P0-1 | Soft close post-chiffre + RDV primary / PDF outline (footer + bandeau sous KPIs) | **S** | `CeliappTool.jsx`, `CampagneToolShell.jsx` (`ToolDownloadPdf` variant) |
| P0-2 | Afficher `lecture.headline` comme titre climax | **S** | `CeliappTool.jsx` ~L435–441 |
| P0-3 | Defaults `4000` / `4` / `0` + chip « Viser le max 8 k × 5 » | **S** | `CeliappTool.jsx` state |
| P0-4 | Retirer `max={8000}` cotisation → activer clamp narré | **S** | `CeliappTool.jsx` MoneyInput |
| P0-5 | Copy mid CTA CELIAPP (data-driven) + sous-titre outil non-PDF-first | **S** | `campagneAdsLandings.js`, `CampagneAdsLanding.jsx` |
| P0-6 | Hero dual CTA : scroll `#outil` primary + RDV secondary + labels script | **M** | `CampagneAdsLanding.jsx` (+ léger `PageHero` si besoin) |
| P0-7 | Hide `ModelPortfoliosBanner` sur `/campagnes` | **S** | `App.js` |

### P1 — tension & objections Meta

| ID | Item | Effort | Owner |
|----|------|--------|-------|
| P1-1 | Champ optionnel cible mise de fonds → Projection · Cible · Écart | **M** | `CeliappTool.jsx` |
| P1-2 | Checklist admissibilité soft (3× `ToolChecklistItem`) + pont RDV | **M** | `CeliappTool.jsx` |
| P1-3 | Mini tableau CELI ≠ CELIAPP + FAQ « achat qui glisse » / RAP | **M** | outil et/ou `campagneAdsLandings.js` |
| P1-4 | Atmosphère hero 1ʳᵉ propriété (asset + overlay) + eyebrow CSF | **M** | `PageHero.jsx`, asset, landing |
| P1-5 | PDF accents FR + hint reports si > 8 k$ | **S** | `CeliappTool.jsx` |
| P1-6 | Events analytics (scroll outil, chip max, elig, rdv_outil) | **S** | outil + landing |
| P1-7 | Soft close ads Ad1–Ad3 labels alignés | **S** | `emails/.../celiapp.md` |

### P2 — polish / later

| ID | Item | Effort | Note |
|----|------|--------|------|
| P2-1 | Process 3 steps visuel (Projeter → Chiffre → 15 min) | **S** | landing |
| P2-2 | Moteur « droits reportés » jusqu’à 16 k$/an | **L** | **déconseillé** sans UX conformité forte (finance) |
| P2-3 | Photo conseiller près de l’outil | **M** | confiance |
| P2-4 | Variante mensuelle du rythme (ads « rythme ») | **M** | conversion annuelle affichée |

---

## 3. Ordre d’implémentation

```
1. App.js hide banner campagnes                         (P0-7)
2. CampagneToolShell — variant PDF outline              (P0-1 part)
3. CeliappTool — defaults + max input + headline        (P0-2,3,4)
4. CeliappTool — bandeau + footer RDV/PDF               (P0-1)
5. campagneAdsLandings + mid CTA + intro outil copy     (P0-5)
6. CampagneAdsLanding — dual CTA hero + id="outil"      (P0-6)
7. Cible + checklist + CELI≠CELIAPP + FAQ               (P1-1…3)
8. Hero atmosphère + eyebrow                            (P1-4)
9. Analytics + PDF accents + hint reports + ads         (P1-5…7)
10. P2 selon métriques post-ship
```

**Parallélisation :** 1–2 (shell) ∥ 3–4 (outil) ; 5–6 après API soft close data ; P1 après P0 live.

---

## 4. Dépendances shell vs spécifique

| Partagé (impacte d’autres campagnes) | Spécifique CELIAPP |
|--------------------------------------|--------------------|
| `hidePortfolioBanner` `/campagnes` | Defaults, climax headline, chip max |
| `ToolDownloadPdf` `variant` | Cible, checklist, bandeau copy chiffrée |
| Mid soft close lu depuis data (`softCloseHeadline` / `Subline`) | Plafonds 8 k / 40 k, `buildLecture` |
| Pattern dual CTA hero (scroll outil vs RDV) | Tableau CELI ≠ CELIAPP, FAQ achat/RAP |
| `PageHero` prop image/atmosphère optionnelle | Asset foyer/clés CELIAPP |

**Règle :** tout changement shell = rétrocompatible (defaults = comportement actuel des autres landings).

---

## 5. Copy & conformité — garde-fous (finance + script)

- Toujours : **cotisations seulement**, **illustratif 2026**, **CSF**, pas de rendement  
- « 8 000 $ » = **nouveaux droits** / an ; hint reports si input > 8 k  
- Checklist ≠ verdict ; soft close parle d’**ouvrir / rythme / ordre**, ne tranche pas  
- Interdit : « tu auras ta mise », « admissible ✓ », « achète plus vite »

**Textes à coller :** voir `02-expert-script.md` (source de vérité copy).

---

## 6. Critères d’acceptation « effet WOW + booker »

- [ ] **Climax impossible à manquer** : headline « Environ X $… » (ou max à vie) en `text-3xl+`, viewport après interaction
- [ ] **CTA RDV dans les 2 s** après le climax (bandeau navy sous le chiffre ; PDF secondaire)
- [ ] **Identité sujet** : hero 1ʳᵉ propriété / CELIAPP ; sans nav, pas un clone navy générique ; strip portefeuilles absent
- [ ] **Book compréhensible en 5 s** : ami voit le $ projeté + « Clarifier mon CELIAPP (15 min) » — pas « télécharge le PDF »
- [ ] Load **sans** barre 100 % ambre (defaults 4 k×4)
- [ ] Saisie > 8 k$ → message clamp visible
- [ ] Aucun claim d’admissibilité automatique ni promesse de mise

*(Baseline audit 2026-11-04 : 0/4 critères WOW cochés — cible post-P0 : 4/4.)*

---

## 7. Métriques de succès (post-ship)

| Signal | Avant (qualitatif) | Cible |
|--------|--------------------|-------|
| `campagne_celiapp_rdv_outil` / sessions outil | ~0 (CTA absent) | Event fire + ratio book > mid seul |
| PDF / RDV clicks | PDF dominant | RDV ≥ PDF sur sessions avec climax |
| Bounce fold | Hero RDV-first dissonant ads | Scroll `#outil` dominant vs hero RDV |
| Support | Confusion CELI/CELIAPP | ↓ questions « c’est quoi la différence » post-visite |

---

## 8. Livrables dossier

| Fichier | Statut |
|---------|--------|
| `01-expert-visuel.md` | Fait |
| `02-expert-script.md` | Fait |
| `03-expert-outil.md` | Fait |
| `04-expert-finance.md` | Fait |
| `00-PM-brief-final.md` | Fait (ce document) |

**Next step produit :** implémenter P0 dans l’ordre §3 — demander commit seulement quand le user le demande.
