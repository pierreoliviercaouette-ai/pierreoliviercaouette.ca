# [#09] CELI droits — Brief PM final (WOW → RDV)

**Slug :** `/campagnes/celi-droits`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/celi-droits  
**Rôle :** Gestionnaire de projet  
**Date :** 2026-11-04  
**CTA :** RDV Bookings 15 min  
**Livrables experts :** `01-expert-visuel` → `02-expert-script` → `03-expert-outil` → `04-expert-finance`  
**Pas de commit** — docs de refonte seulement.

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive convaincu que « c’est juste le plafond de l’année » ou qu’il a déjà assez cotisé. En moins de deux minutes, l’outil lui montre le contraste **7 000 $ vs ~84 000 $** (defaults Exemple), lui fait **choisir un usage** (Fonds d’urgence / Projet court / Long terme), puis lui tend un soft close navy : *« ~84 k$ · usage X — 15 min soft, Clarifier ≠ cotiser demain »* — PDF en ghost. Le hero est outil-first (comme les ads), plus de claim « coûte cher », pastille sans compte tenue. Résultat : le chiffre n’est plus un screenshot ; c’est une **intention** qui booke.

---

## 2. Scores (baseline audit → cible)

| Score | Baseline 2026-11-04 | Cible ship |
|-------|---------------------|------------|
| Expérience globale | 5,5 | ≥ 8 |
| Effet WOW outil | 7 | ≥ 8,5 |
| Envies de booker | 4,5 | ≥ 7,5 |
| Conversion outil→RDV | ~3 | ≥ 7 |

**Bouclement critique :** ads + En bref #3 promettent le tri d’usage — **seul funnel catalogue qui promet et n’implémente pas**. P0 = chips.

---

## 3. Backlog shippable

### P0 — Doit shipper ensemble (WOW→RDV)

| ID | Item | Fichier(s) | Effort | Owner logique |
|----|------|------------|--------|---------------|
| P0-1 | **Sélecteur usage** chips exclusives + `buildLecture` + PDF + analytics | `CeliDroitsTool.jsx` | M | OUTIL + SCRIPT |
| P0-2 | **Soft close RDV** post-climax (`_rdv_outil`) ; PDF secondary | `CeliDroitsTool.jsx` | S | OUTIL + SCRIPT |
| P0-3 | **Split contraste** plafond annuel vs place restante | `CeliDroitsTool.jsx` | S | VISUEL + OUTIL |
| P0-4 | Copy hero / bullets / mid / FAQ « déjà cotisé » ; retirer « coûte cher » | `campagneAdsLandings.js` | S | SCRIPT |
| P0-5 | Disclaimer retraits + lien ARC + pastille sans compte | Tool + landing | S | FINANCE + VISUEL |

### P1 — Fort levier, juste après

| ID | Item | Fichier(s) | Effort |
|----|------|------------|--------|
| P1-1 | Badge **Exemple** + reset « Partir de zéro » | `CeliDroitsTool.jsx` | S |
| P1-2 | Shell : mid RDV lit `ctaHeadline` / `ctaSubline` | `CampagneAdsLanding.jsx` | S |
| P1-3 | Shell : `id="outil"` + hero primaire scroll outil / secondaire RDV | `CampagneAdsLanding.jsx` + data | S–M |
| P1-4 | PDF accents FR + section usage + notes finance | `CeliDroitsTool.jsx` `handleDownload` | S |
| P1-5 | Ad3 tweak « chips livrées » (catalog email) | `emails/campagne-meta-catalog/celi-droits.md` | S |

### P2 — Polish

| ID | Item | Effort |
|----|------|--------|
| P2-1 | Motion reveal gros $ | S |
| P2-2 | Compresser / repositionner « À retenir » sous soft close | S |
| P2-3 | Ligne CSF · Victoriaville sous mid | S |
| P2-4 | Commentaire `PLAFONDS_ANNUELS` « validé 2026-11 » | S |
| P2-5 | FAQ mention MAJ ARC printemps | S |

---

## 4. Ordre d’implémentation recommandé

```
1. Data copy landing (P0-4) — débloque hero/FAQ sans dépendance JSX lourd
2. CeliDroitsTool : usage chips → lecture → split contraste → soft close RDV (P0-1..3)
3. ArcLink + pastille + disclaimer retraits (P0-5)
4. Exemple/reset + PDF FR (P1-1, P1-4)
5. Shell catalogue : #outil + dual CTA hero + mid data-driven (P1-2, P1-3)
   └─ si shell catalogue pas prêt : branche slug `celi-droits` temporaire OK
6. Ads catalog Ad3 (P1-5) + polish P2
7. QA mobile + events + scénario default 84k
```

**Parallélisation :** copy data (1) // outil JSX (2–4) ; shell (5) peut suivre dès que mid/hero texts sont figés.

---

## 5. Dépendances shell vs campagne

| Besoin | Scope | Note |
|--------|-------|------|
| Chips usage + soft close `$`+usage | **Spécifique #09** | Cœur différenciant |
| Split plafond vs place | Spécifique #09 | |
| `ctaHeadline` / `ctaSubline` mid RDV | **Shell catalogue** (partagé 01–14) | Compte dans « max 2 » shell audit |
| Hero dual CTA `#outil` | Shell **ou** branche slug | Ads Ad3 l’exigent pour #09 |
| `id="outil"` | Shell 1 ligne | |

Ne pas bloquer P0 outil sur le shell : soft close **dans** `CeliDroitsTool` suffit pour convertir ; shell améliore cohérence ads↔fold.

---

## 6. Critères d’acceptation « effet WOW + booker »

1. **Climax impossible à manquer :** contraste plafond 2026 (7 000 $) vs place restante (~84 000 $ defaults).  
2. **Usage jouable :** 3 chips ; lecture + soft close + PDF reflètent le choix.  
3. **CTA RDV ≤ 2 s après climax** dans l’outil (`campagne_celi-droits_rdv_outil`) ; PDF n’est plus le seul next step.  
4. **Ads ↔ page :** outil-first au fold ; pastille sans compte ; plus de « coûte cher ».  
5. **Test ami 5 s :** « T’as de la place, t’as choisi un usage, tu bookes pour coller le plan. »  
6. **Conformité :** estimation + ARC fait foi + retraits non modélisés + pas de conseil perso.  
7. **Mobile :** chips ≥44px ; soft close stack CTA puis PDF.

---

## 7. Risques & mitigations

| Risque | Mitigation |
|--------|------------|
| Shell mid/hero retardé | Soft close 100 % dans l’outil (P0-2) |
| User croit que 84k = ARC | Badge Exemple + disclaimer + lien ARC |
| Chip = « on me vend une cotisation » | Copy « intention / Clarifier ≠ cotiser » |
| Plafonds 2027+ | Revalider table avant scale Ads annuelle |
| PDF cannibalise encore | PDF outline only post-climax |

---

## 8. Definition of Done (sprint)

- [ ] 5 fichiers rebuild lus / implémentés selon P0  
- [ ] Scénario default QA + 1 scénario dépassement + 1 place faible  
- [ ] Events `_usage_*` + `_rdv_outil` visibles en debug analytics  
- [ ] FAQ « déjà cotisé » live  
- [ ] Pas de commit tant que non demandé  

---

## 9. Synthèse décisions d’équipe (VISUEL→…→PM)

| Décision | Source |
|----------|--------|
| Angle hero = place / mythe, pas coût | VISUEL + SCRIPT + FINANCE |
| Livrer **chips** Urgence/Projet/LT (pas seulement texte) | OUTIL + audit + ads Ad3 |
| Soft close ancré `{X}$` + usage avant PDF | VISUEL + OUTIL + SCRIPT |
| Plafonds 2009–2026 OK ; documenter retraits | FINANCE |
| Shell mid/hero = P1 catalogue, pas bloqueur P0 | PM |

**Prochaine action dev :** implémenter P0-1 → P0-3 dans `CeliDroitsTool.jsx`, puis P0-4 data landing.
