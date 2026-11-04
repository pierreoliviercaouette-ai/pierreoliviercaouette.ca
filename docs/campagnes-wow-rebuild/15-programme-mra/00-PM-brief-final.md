# [#15] Programme MRa PME — Brief PM final (WOW → Lead)

**Rôle :** Gestionnaire de projet  
**Slug :** `/campagnes/programme-mra`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/programme-mra  
**CTA :** formulaire Lead (`CampagneLeadForm` → rappel → présentation) — **pas** Bookings  
**Date :** 2026-11-04  
**Livrables experts :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Audit source :** `docs/plan-modification-marketing/15-programme-mra.md`  
**Commit :** non (spec seulement)

---

## 1. Vision WOW (1 paragraphe)

Un décideur PME arrive d’Ad1 (« pas besoin d’une grosse collective ») : hero PME (pas clone orbs), outil qui sort un **badge fit + ~n employés + phrase avec sa cotisation**, bouton immédiat **Recevoir une présentation** vers un form court (entreprise *, message optionnel, fit prérempli). Il comprend en 5 secondes que ce n’est **pas** la page employé #11 (livret / Bookings 15 min). Le PDF reste disponible, secondaire. Objectif session : `generate_lead`, pas un calendrier.

---

## 2. Scores & écart

| Métrique (audit) | Aujourd’hui | Cible ship |
|------------------|-------------|------------|
| Expérience globale | 5,5 | ≥ 8 |
| Effet WOW outil | 4,5 | ≥ 8 |
| Envie de submit Lead | 5 | ≥ 8 |

**Racines :** climax mou + `contrib` ignoré + piliers spoil + PDF-first + Message * + fuite Apprendre #11.

---

## 3. Différenciation #11 (non négociable)

| | #11 Collective | #15 MRa PME |
|--|----------------|-------------|
| Persona | Employé + livret | Propriétaire / décideur PME |
| Outil | `CollectiveChecklistTool` | `MraFitTool` |
| WOW | Cases floues livret | Score fit taille·situation·contrib |
| CTA | Bookings 15 min | Lead → rappel → présentation |
| Soft close | Schedule | `generate_lead` |
| Lien croisé | — | Secondaire « Employé + livret ? » → #11 |

---

## 4. Backlog shippable

### P0 — ship campagne (ordre d’implémentation)

| # | Item | Effort | Owner logique | Fichiers |
|---|------|--------|---------------|----------|
| 1 | Score fit (taille + situation + **contrib**) + climax XL + badge | M | Outil | `MraFitTool.jsx` |
| 2 | Piliers defaults **off** | S | Outil | `MraFitTool.jsx` state L83 |
| 3 | CTA primaire outil → `#demande` + PDF outline + event `…_tool_to_form` | S | Outil | `MraFitTool.jsx` footer + sous climax |
| 4 | Bridge fit → préremplir message form (sessionStorage OK) | S | Outil + Form | `MraFitTool.jsx`, `CampagneLeadForm.jsx` |
| 5 | Form MRa : Entreprise * · Message optionnel rows=2 · titre rappel · tel hint · teamSize | M | Form + Landing | `CampagneLeadForm.jsx`, `CampagneAdsLanding.jsx`, data |
| 6 | Copy hero / bullets / cta / FAQ / intro outil (script) | S | Script | `campagneAdsLandings.js`, `MraFitTool` strings |
| 7 | Couper fuite #11 : remplacer Apprendre collective → lien employé discret | S | Script + Landing | data `apprendre*` ou Link custom |
| 8 | Disclaimers + claims ads alignés (sélection médicale, pas fiscal, pas Bookings) | S | Finance + Script | ads md + disclaimer outil |

### P1 — WOW premium

| # | Item | Effort | Scope |
|---|------|--------|-------|
| 9 | Strip comparatif 5 critères Collective vs MRa | M | Landing ou outil |
| 10 | Process 3 pastilles avant `#demande` + ligne CSF Victoriaville | S | Landing |
| 11 | Hero atmosphère PME (asset / texture) + eyebrow décideur | M | Visuel / `PageHero` |
| 12 | Sticky CTA mobile post-outil → `#demande` | M | **Shell** `CampagneAdsLanding` si `ctaType==='form'` |
| 13 | `ToolDownloadPdf` variant outline / slot `postResultCta` | M | **Shell** catalogue |
| 14 | PDF accents FR + row score fit | S | `MraFitTool` PDF |

### P2 — polish

| # | Item | Effort |
|---|------|--------|
| 15 | Photo conseiller près du form | S (asset) |
| 16 | Motion climax (scale chiffre) + pulse CTA une fois | S |
| 17 | Nav globale « Prendre rendez-vous » — mitigations copy in-page seulement | — |
| 18 | Affiner seuils score fit avec retour terrain | S |

**Max shell catalogue dans ce brief :** items 12–13 (≤2), comme audit TOP 7–8.

---

## 5. Ordre d’implémentation recommandé (sprint)

```
J1  Outil : score + climax UI + piliers off + CTA Lead/PDF + event
J1  Form : props requireCompany / message optional / initialMessage
J1  Bridge sessionStorage fit → form
J2  Data + script landing (hero, bullets, FAQ, apprendre, intro « À toi de jouer »)
J2  Ads md Ad1–Ad3 + disclaimers finance
J3  P1 : process 3 steps + strip comparatif + sticky (si temps)
J3  QA mobile 375 + checklist §7
```

Pas de commit dans ce mandat spec.

---

## 6. Dépendances shell vs spécifique

| Spécifique #15 (ship sans attendre) | Shell / multi-campagnes |
|-------------------------------------|-------------------------|
| `MraFitTool.jsx` score/CTA/piliers | `postResultCta` / PDF outline générique |
| Props form pour MRa | Sticky form pour tous `ctaType:'form'` |
| Copy `programme-mra` data | `PageHero` atmosphère custom (si design system) |
| Lien croisé #11 | — |

**Décision PM :** P0 100 % shippable **sans** refacto shell. Shell = P1 parallèle catalogue.

---

## 7. Critères d’acceptation « effet WOW + Lead »

- [ ] Climax : badge fit + `~n` XL + phrase qui cite **contrib** — impossible à manquer mobile
- [ ] CTA Lead visible dans les **2 s** après climax (bouton in-tool)
- [ ] PDF n’est plus le seul / primaire post-résultat
- [ ] Submit form = `generate_lead` ; **zéro** lien Bookings comme CTA conversion
- [ ] Entreprise obligatoire ; Message non bloquant ; fit outil visible dans le lead
- [ ] Identité **décideur PME** (pas livret #11) ; lien employé seulement en secondaire
- [ ] Ami qui voit l’écran comprend en 5 s pourquoi « Recevoir une présentation » (rappel, pas calendrier)
- [ ] Conformité : sélection médicale + contrats individuels + pas de claim fiscal / acceptation garantie

---

## 8. QA scénarios

1. **Defaults** 8 · indéterminé · aucune · piliers off → badge attendu **Bon fit** (ou équivalent) + phrase sans cotiser / pas encore décidé  
2. **Contrib zero** vs **pct** → phrases différentes  
3. **n=120** → Moins prioritaire / À explorer (pas « Bon fit » agressif)  
4. Clic CTA outil → scroll `#demande` + message prérempli  
5. Submit sans message → OK ; sans entreprise → bloqué  
6. Aucun `trackRendezVousClick` sur interactions principales  
7. Lien « Employé + livret » → `/campagnes/assurance-collective`

---

## 9. Synthèse experts (ce qu’on garde)

| Expert | Décisions retenues |
|--------|-------------------|
| Visuel | Hero PME ; climax chiffre+badge ; process 3 ; PDF outline ; couper Apprendre collective |
| Script | H1 « sans usine à gaz » ; soft close dynamique ; FAQ confidentialité ; Ads form court ; pas Bookings |
| Outil | Score 3 entrées ; piliers off ; bridge form ; events `tool_to_form` ; files JSX listés |
| Finance | Individuel + sélection médicale ; pas fiscal ; fit ≠ admissibilité ; disclaimers ads/outil/PDF/form |

---

## 10. Definition of Done (spec)

- [x] Dossier `docs/campagnes-wow-rebuild/15-programme-mra/` avec 5 fichiers  
- [x] CTA Lead explicite partout  
- [x] Différenciation #11 documentée  
- [x] Backlog P0/P1/P2 + ordre + AC  
- [ ] Implémentation code (hors mandat)  
- [ ] Commit (non demandé)
