# [#14] Succession — bases — Brief final PM (WOW → RDV)

**Slug :** `/campagnes/succession-bases` (alias `/campagnes/succession`)  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/succession-bases  
**Date :** 2026-11-04  
**CTA :** RDV Bookings (`buildCampagneRdvPath` → `/rendez-vous/campagne`)  
**Livrables experts :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit :** non (spec only)

---

## 1. Vision WOW (1 paragraphe)

Le prospect Meta arrive avec Ad1 « Plus tard, c’est souvent trop tard ». La page rejoue ce mythe dès le H1, le pousse d’abord dans la checklist (sans compte), lui révèle *ses* trous seulement après avoir coché, puis — au pic « damn, j’ai des cases vides » — lui offre 15 minutes CSF pour liquidité & bénéficiaires, en laissant le testament au notaire. Le PDF devient un trophy secondaire. Résultat : continuité émotionnelle pub → outil → humain, sans cannibaliser le notaire ni vendre la peur.

**Scores cibles :** expérience 5,5 → **8** · WOW outil 6 → **8,5** · envie booker 4,5 → **7,5**.

---

## 2. Diagnostic (synthèse 4 experts)

| Problème | Impact booker | Owner |
|----------|---------------|-------|
| H1 produit ≠ Ad1 + CTA RDV froid | Message match cassé ; fuite vs promesse outil | Script + Visuel + shell |
| Trous warn dès 0/6 | Jugement à froid ; spoil l’aha | Outil + Visuel |
| Sortie PDF + notaire | Pic émotionnel → télécharger, pas CSF | Outil + Finance |
| Mid générique « Prêt à clarifier… » | Soft close catalogue, pas Ad3 | Script + shell |
| Pas de FAQ 15 min / payant | Peur pitch / remplace-notaire intacte | Script + Finance |
| Double PDF + ASCII | Dilue CTA ; polish ↓ | Outil |
| Identité visuelle clone PageHero | Sujet succession / liquidité absent | Visuel |

**Force à préserver :** 6 items ads↔outil 1:1 ; disclaimer notaire ; angle liquidité ≠ actifs.

---

## 3. Backlog shippable

### P0 — Bridge climax → RDV (ship this week)

| ID | Quoi | Pourquoi | Où | Effort | Dépendance |
|----|------|----------|----|--------|------------|
| P0-1 | Soft-close RDV si `missingCount ≥ 1` (+ variante complet) + `…_rdv_tool` | Booker au pic trous | `SuccessionChecklistTool.jsx` | S–M | Script copy |
| P0-2 | H1 Ad1 + promise checklist | Message match Meta | `campagneAdsLandings.js` | S | — |
| P0-3 | Portrait / Trous seulement si `count ≥ 1` (invite à froid) | Aha réel, pas jugement | `SuccessionChecklistTool.jsx` | M | Visuel motion |
| P0-4 | Next-step branché CSF vs notaire (fini `PDF + notaire`) | Pourquoi *toi* | Tool `statusDetail` / `nextValue` / PDF | S | Finance OK |
| P0-5 | Mid `ctaHeadline` / `ctaSubline` Ad3 | Soft close succession | data + `CampagneAdsLanding.jsx` (~L181–187) | S | Shell props |

### P1 — Alignement & confiance

| ID | Quoi | Où | Effort |
|----|------|----|--------|
| P1-1 | Hero dual CTA : primaire `#outil` « Remplir la checklist » + secondaire RDV texte | `CampagneAdsLanding.jsx` + `id="outil"` | S–M *(shell #1)* |
| P1-2 | FAQ + « En 15 min ? » + « C’est payant ? » (garder notaire #1) | `campagneAdsLandings.js` | S |
| P1-3 | Un PDF footer + accents FR + punch liquidité Ad2 | `SuccessionChecklistTool.jsx` | S |
| P1-4 | Bloc split CSF \| Notaire sous l’outil | Tool ou section landing | S–M |
| P1-5 | Ligne confiance CSF · Victoriaville (hero ou mid) | landing / shell | S |

### P2 — Premium (sprint visuel catalogue)

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Accent hero « dossier / liquidité » (watermark, pas funéraire) | M |
| P2-2 | Process 3 steps coche → portrait → 15 min\|notaire | S |
| P2-3 | Cases avant portrait sur mobile | S |
| P2-4 | Events optionnels first_check / gaps_reveal | S |
| P2-5 | Ads Ad2 micro-ligne « portrait après tes coches » | S |

**Shell budget :** max **2** items génériques — (1) dual CTA hero outil-first, (2) mid headline/subline depuis data. Soft-close outil = **spécifique campagne** (inline OK si pas encore de slot `CampagneToolShell`).

---

## 4. Ordre d’implémentation

```text
1. campagneAdsLandings.js     → title, promise, bullets, faq×5, ctaHeadline, ctaSubline
2. SuccessionChecklistTool    → invite + reveal + next-step + soft-close RDV + 1 PDF FR
3. CampagneAdsLanding.jsx     → id="outil", dual CTA hero, mid props (si pas hardcodé)
4. (P1) split CSF|Notaire + confiance
5. (P2) atmosphère hero + process + mobile order
6. QA live URL + events GA
```

**Ne pas** ouvrir un simulateur $ liquidité / impôts décès (Finance No-go).

---

## 5. Critères d’acceptation « effet WOW + booker »

- [ ] H1 visible = **Plus tard, c’est souvent trop tard** (match Ad1)
- [ ] Hero primaire mène à `#outil` ; RDV n’est pas le seul CTA froid
- [ ] Ouverture outil : **zéro** carte Trous ambre
- [ ] Après ≥1 coche : Trous prioritaires impossibles à manquer (reveal)
- [ ] CTA RDV dans les **2 secondes** du climax (`campagne_succession-bases_rdv_tool`)
- [ ] Copy climax cite CSF liquidité/bénéficiaires **et** notaire pour testament
- [ ] Mid = « Des cases vides te chicottent ? » (pas « Prêt à clarifier… »)
- [ ] FAQ explique les 15 min + gratuité découverte
- [ ] Un ami comprend en 5 s : trous → 15 min CSF, pas remplace-notaire
- [ ] Disclaimers notaire (outil + Scale + pied) toujours présents
- [ ] Aucune promesse « succession réglée » / imagerie funéraire

---

## 6. Dépendances & risques

| Type | Détail | Mitigation |
|------|--------|------------|
| Shell | Mid RDV hardcodé L182–187 | Brancher `item.ctaHeadline \|\| …` / `ctaSubline` (réutilisable catalogue) |
| Shell | Hero single CTA | Dual CTA pattern partagé (≤2 shell) |
| Conformité | Flou CSF / notaire si soft close trop « on s’occupe de tout » | Relecture Finance ; split obligatoire |
| Analytics | Pas d’event `…_rdv_tool` aujourd’hui | Ajouter dès P0-1 |
| Contenu | Capsule Apprendre concurrence mid | Apprendre = lien secondaire |

---

## 7. Copy board (référence rapide)

| Slot | Après |
|------|-------|
| H1 | Plus tard, c’est souvent trop tard |
| Promise | Checklist liquidité / succession… Sans compte. Le notaire reste essentiel… |
| Soft close outil | T’as {N} cases vides… 15 min… notaire pour le testament. Clarifier ≠ acheter. |
| Mid | Des cases vides te chicottent ? |
| Hero CTA | Remplir la checklist |

Détail complet → `02-expert-script.md`.

---

## 8. Definition of Done (équipe)

| Rôle | Done quand |
|------|------------|
| Visuel | Dual CTA + reveal Trous + split CSF\|Notaire spécifiés et testables mobile |
| Script | Textes collés dans data + ads alignées outil-first |
| Outil | P0-1…P0-4 + PDF unique + events |
| Finance | Disclaimers OK ; aucun claim No-go |
| PM | Critères §5 cochés en QA sur URL prod/staging |

---

## 9. Hors scope

- Commit / push  
- Implémentation code (ce dossier = brief)  
- Refonte globale PageHero catalogue  
- Calculateur fiscal successoral  
- Changement des 6 items checklist (alignement ads conservé)
