# [#08] Fonds d’urgence — Brief PM final (WOW → RDV)

**Gestionnaire de projet** · synthèse des 4 experts  
**Slug :** `/campagnes/fonds-urgence`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/fonds-urgence  
**Date :** 2026-11-04  
**CTA :** RDV Bookings 15 min  
**Livrables experts :** `01-expert-visuel.md` · `02-expert-script.md` · `03-expert-outil.md` · `04-expert-finance.md`  
**Pas de commit** — brief d’implémentation seulement.

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive pour un **calculateur de filet** (Ad1–Ad3) : en moins de 10 secondes, les defaults lui mettent **16 000 $ manquants** et **~4 ans et demi** à 300 $/mois sous les yeux — c’est déjà le WOW. La refonte ne « réinvente » pas l’outil : elle **monétise ce pic**. Hero outil-first (« Calculer mon filet »), soft-close ambre/émeraude collé sous les Metrics qui cite *son* écart / délai / surplus, mid « Ton écart est clair — et après ? », FAQ « carte ≠ filet » pour Ad2, PDF en outline. Atmosphère navy « Filet d’abord. » pour casser le clone de shell. Résultat : l’ami qui regarde l’écran comprend qu’on booke pour **calmer le palier et où garer**, pas pour télécharger un PDF.

**Scores cibles :** expérience 6→8 · outil WOW 7,5 (garder) · envie de booker 4,5→7,5.

---

## 2. Diagnostic (consensus équipe)

| Zone | Verdict |
|------|---------|
| Outil / climax | Fort — ne pas toucher à la formule ni aux defaults aha |
| Conversion | Faible — PDF cannibalise ; mid générique ; hero RDV-first vs Ad3 |
| Visuel sujet | Faible — PageHero clone ; brief ads absent de la page |
| Conformité | OK — garder disclaimers ; interdits clairs (finance) |
| Unique catalogue | Seul outil **cible × mois → manquant → délai → rythme12 / palier >24 m** avec bascule warn↔ok |

---

## 3. Backlog P0 / P1 / P2

### P0 — Ship conversion (impact H, effort S)

| # | Item | Fichier(s) | Effort | Owner logique |
|---|------|------------|--------|---------------|
| P0.1 | Soft-close RDV 3 tons sous Metrics (warn court / >24 m / atteint) + `buildCampagneRdvPath` + `trackRendezVousClick('…_rdv_outil')` | `FondsUrgenceTool.jsx` | S | Outil + Script |
| P0.2 | Rythme12 bold sous gros manquant si `moisPourCombler > 12` | `FondsUrgenceTool.jsx` | S | Outil |
| P0.3 | Mid data-driven : `ctaHeadline` / `ctaSubline` fonds-urgence | `campagneAdsLandings.js` + `CampagneAdsLanding.jsx` | S | Script + Shell |
| P0.4 | FAQ « La carte, c’est un fonds d’urgence ? » | `campagneAdsLandings.js` | S | Script + Finance ✓ |
| P0.5 | `statusDetail` + état atteint → RDV « prochain dollar » (plus PDF-only) | `FondsUrgenceTool.jsx` | S | Outil + Script |
| P0.6 | PDF accents FR (`handleDownload`) | `FondsUrgenceTool.jsx` | S | Outil |

### P1 — Alignement ads + polish

| # | Item | Fichier(s) | Effort |
|---|------|------------|--------|
| P1.1 | Hero dual CTA outil-first (« Calculer mon filet » → `#outil` + sec. RDV) | `CampagneAdsLanding.jsx` + data | S *(shell partagé)* |
| P1.2 | `id="outil"` + intro « …15 min si tu veux fixer le palier » | `CampagneAdsLanding.jsx` | S |
| P1.3 | Promise / bullets / preuve CSF Victoriaville (script) | `campagneAdsLandings.js` + mid | S |
| P1.4 | Collapse « À retenir » mobile + event `campagne_fonds-urgence_result` | `FondsUrgenceTool.jsx` | S–M |
| P1.5 | PDF / footer outline (RDV primary dominant) | `FondsUrgenceTool.jsx` (± variant `ToolDownloadPdf`) | S |
| P1.6 | Micro-ajustements close Ad1/Ad2 | `emails/campagne-meta-catalog/fonds-urgence.md` | S |

### P2 — Atmosphère / shell industrialisé

| # | Item | Fichier(s) | Effort |
|---|------|------------|--------|
| P2.1 | Atmosphère hero « Filet d’abord. » (navy brief ads) | `PageHero` / landing prop | M |
| P2.2 | Slot `postResultCta` dans `CampagneToolShell` | `CampagneToolShell.jsx` | M *(15 campagnes)* |
| P2.3 | Motion fade barre au mount `#outil` | `FondsUrgenceTool.jsx` | S |
| P2.4 | Ligne « carte ≠ filet » entre En bref et outil | landing | S |

---

## 4. Ordre d’implémentation recommandé

```text
1. FondsUrgenceTool — soft-close 3 tons + rythme12 + statusDetail + PDF FR + events
2. campagneAdsLandings — copy promise/bullets/faq/ctaHeadline/ctaSubline
3. CampagneAdsLanding — mid data-driven + id="outil" (+ dual CTA si shell prêt)
4. QA parcours defaults 16 k$ → RDV visible ≤2 s post-climax
5. Ads md micro-close (peut shipper après landing)
6. Shell/PageHero atmosphère (P2) — ne bloque pas P0
```

**Dépendances :**
- **Spécifique #08 :** P0.1–P0.6, P1.3–P1.6, P2.1, P2.3–P2.4  
- **Shell partagé (15) :** P1.1 dual CTA · P0.3 pattern mid · P2.2 `postResultCta`  
→ #08 peut livrer le soft-close **localement** sans attendre le slot shell.

---

## 5. Critères d’acceptation « effet WOW + booker »

Issus des 4 experts + audit §7 :

1. **Climax impossible à manquer** — 16 k$ (ou chiffre user) + délai + rythme12 si >12 mois  
2. **CTA RDV ≤ 2 s après climax** — soft-close sous Metrics, avant « À retenir » / avant mid  
3. **Identité sujet** — copy + (P2) navy « Filet d’abord. » ; plus seulement template clone  
4. **Ami comprend Book** — phrase soft-close cite manquant/délai/surplus ; pas « télécharge le PDF »  
5. **Ad3 sans dissonance** — hero primaire = outil (P1.1)  
6. **Ad2 reconnu** — FAQ carte live  
7. **Conformité** — aucun claim « garanti / filet complet / 6 mois = sécurité » ; disclaimers intacts  
8. **Analytics** — `rdv_outil` + `result` mesurables en QA

**Definition of Done (P0) :** items P0.1–P0.6 mergés en local, parcours defaults → clic RDV outil sans scroller le mid, FAQ carte visible, PDF FR, zéro régression calcul.

---

## 6. Risques & garde-fous

| Risque | Mitigation |
|--------|------------|
| Double CTA RDV (soft-close + footer) | Footer = PDF + status ; conversion = soft-close sous Metrics |
| Shell dual-CTA retarde #08 | Soft-close local d’abord ; hero dual en P1 quand shell prêt |
| Soft-close « où garer » lu comme reco produit | Finance : cadrer comme sujet de RDV + disclaimer outil |
| Ownership faible (defaults) | Garder defaults aha ; event result OK ; hints invitant à ajuster |

---

## 7. Hors scope (cette vague)

- Merger avec `calculateFondsUrgence` (Apprendre)  
- Formulaire email / lead (CTA = Bookings)  
- Nouveaux champs outil  
- Commit / deploy (explicitement hors mandat)  
- Refonte complète PageHero pour les 15 (seulement consommer quand prêt)

---

## 8. Checklist handoff dev

- [ ] Lire `03-expert-outil.md` (JSX + events)  
- [ ] Copier textes depuis `02-expert-script.md` (pas d’invention)  
- [ ] Respecter interdits `04-expert-finance.md`  
- [ ] Suivre composition / dual CTA / soft-close ton `01-expert-visuel.md`  
- [ ] Tester mobile : RDV avant PDF ; À retenir ne cache pas le CTA  
- [ ] Pas de commit sauf demande explicite

**Priorité produit #1 (synthèse 00) confirmée :** soft-close branché sur les 3 états « En clair ».
