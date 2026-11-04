# [#11] PM — Brief final WOW → RDV (Assurance collective employé)

**Slug :** `/campagnes/assurance-collective`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/assurance-collective  
**CTA :** RDV Bookings 15 min (**pas** Lead MRa)  
**Date :** 2026-11-04  
**Livrables experts :** `01-expert-visuel` → `02-expert-script` → `03-expert-outil` → `04-expert-finance`  
**Pas de commit** — specs doc seulement.

**Scores audit (baseline) :** expérience 5.5 · WOW outil 5.5 · envie booker 4.5  
**Cible post-refonte :** expérience ≥ 8 · WOW ≥ 8 · envie booker ≥ 7.5

---

## 1. Vision WOW (1 paragraphe)

Le prospect employé arrive de Meta avec le mythe *« ma carte me couvre »* ou la curiosité *paliers*. La page doit **répéter le mythe en H1**, pousser d’abord la **checklist** (Ad3 respecté), et faire de l’outil un révélateur : cases encore floues — surtout invalidité (un % ou plusieurs paliers) — en ambre impossible à manquer. Le climax n’est pas le PDF : c’est *« T’as encore 2 flous — 15 min, livret ouvert, clarifier ≠ acheter »*. Zéro dérive PME/MRa. On booke pour démêler le livret, pas pour se faire vendre une collective d’entreprise.

---

## 2. Backlog shippable

### P0 — Ship WOW → RDV (obligatoire)

| ID | Quoi | Où | Effort | Source |
|----|------|-----|--------|--------|
| P0-1 | Soft close RDV sur `missingCount` / warn (PDF secondaire) | `CollectiveChecklistTool.jsx` footer | S | Outil #1, Audit TOP1 |
| P0-2 | Invalidité (paliers) en step 1 ; employeur optionnel en fin | même fichier + milestones | M | Outil #2 |
| P0-3 | Gate livret en tête d’outil + ancre FAQ | outil + `faq` id | S | Outil #3 |
| P0-4 | Copy hero mythe + promesse + bullets paliers | `campagneAdsLandings.js` | S | Script |
| P0-5 | Dual CTA hero : primaire scroll `#outil`, secondaire RDV | `CampagneAdsLanding.jsx` + data flags | M | Visuel + Shell |
| P0-6 | Insights émotionnels ResultCards | `CollectiveChecklistTool.jsx` details | S | Script + Outil |
| P0-7 | Climax UI : gros « n encore flous » ambre | Progression outil | S | Visuel + Outil |
| P0-8 | Mid CTA data-driven (`ctaHeadline` / `ctaSubline`) mode RDV | `CampagneAdsLanding.jsx` + data | S | Script + Shell |
| P0-9 | FAQ paliers + « 15 min + livret » | `faq[]` data | S | Script + Finance OK |

### P1 — Polish conversion

| ID | Quoi | Effort |
|----|------|--------|
| P1-1 | Chips trous MG + plafond $/mois (sans MRa) | M |
| P1-2 | Bandeau process 3 steps sous outil | S |
| P1-3 | PDF accents FR + rows chips | S |
| P1-4 | Réduire double PDF (header) | S |
| P1-5 | Ads Ad2/Ad3 align outil-first | S |
| P1-6 | Pulse ambre ResultCard Invalidité warn | S |
| P1-7 | Ligne confiance sous hero CTAs | S |

### P2 — Identité / nice-to-have

| ID | Quoi | Effort |
|----|------|--------|
| P2-1 | Theme hero « livret » (texture / anti-clone orbs) | M |
| P2-2 | `depart` milestone = select requis (pas trousNotes seul) | S |
| P2-3 | Events analytics paliers / livret / scroll CTA | S |

---

## 3. Ordre d’implémentation

```
1. Data copy (P0-4, P0-9, mid headlines)     — débloque QA copy
2. Shell dual CTA + id="outil" + mid data   — (P0-5, P0-8)  [shell partagé : feature-flag / opt-in]
3. Outil : reorder steps + gate             — (P0-2, P0-3)
4. Outil : climax flous UI + insights       — (P0-7, P0-6)
5. Outil : footer RDV soft close            — (P0-1)  ★ conversion
6. P1 chips / process / PDF / ads / motion
7. P2 theme + analytics fins
```

**Règle shell :** dual CTA et mid data-driven = **opt-in par slug** (`heroPrimaryCta: 'tool'`, présence de `ctaHeadline`) pour ne pas casser les 14 autres campagnes.

---

## 4. Dépendances shell vs campagne

| Changement | Scope | Risque |
|------------|-------|--------|
| `heroPrimaryCta: 'tool'` + bouton scroll | `CampagneAdsLanding.jsx` | Moyen — abstraire, défaut = comportement actuel RDV |
| Mid lit `ctaHeadline` en mode RDV | même fichier | Faible — fallback copy actuelle |
| `id="outil"` sur wrapper Tool | même fichier | Faible |
| Footer RDV dans outil | **seulement** `CollectiveChecklistTool.jsx` | Faible — pattern nouveau (aucun outil n’a encore le Link RDV) |
| Copy / FAQ | data `assurance-collective` only | Nul |

---

## 5. Critères d’acceptation « effet WOW + booker »

- [ ] **Climax** : `missingCount` / cards warn impossibles à manquer (taille + ambre + phrase)
- [ ] **CTA RDV** dans les ~2 s après le climax **dans le footer outil** (pas seulement mid page)
- [ ] **Hero** : mythe Ad1 + primaire checklist (Ad3) ; RDV secondaire
- [ ] **Step 1 outil** = Invalidité / paliers (Ad2)
- [ ] **Gate livret** visible avant les champs longs
- [ ] Ami qui regarde l’écran comprend en 5 s : *cases floues + livret employé*, pas vente PME
- [ ] Finance : pas de « t’es couvert » ; clarifier ≠ acheter ; zéro MRa
- [ ] Mobile : stack CTAs OK ; PDF n’écrase pas le RDV quand flous > 0

---

## 6. Hors scope (explicite)

- Refonte globale `PageHero` pour toutes les campagnes  
- Fusion avec `#15` programme MRa ou copy « ton équipe »  
- Calculateur de trou $ (reste `#04`)  
- Commit / deploy (attente validation humaine)  
- Nouveau design system / nouvelle palette brand  

---

## 7. QA manuelle (15 min)

1. Arrivée froide → H1 mythe → clic *Remplir la checklist* → land `#outil`  
2. Sans livret : gate visible ; cards « À trouver » avec insights émotionnels  
3. Bascule *Plusieurs paliers* → 2 % + délai ; event optionnel  
4. Laisser 2 blocs vides → gros « 2 encore flous » → CTA *Démêler…* → Bookings UTM  
5. PDF secondaire téléchargeable ; accents FR  
6. Mid : headline cases floues  
7. FAQ paliers + ancre « Où est mon livret ? »  
8. Grep mental : aucun « MRa », « PME », « ton équipe » sur la page  

---

## 8. Synthèse décisions PM

| Décision | Choix |
|----------|--------|
| Conversion | RDV only (Bookings) |
| Climax | Cases floues, pas PDF |
| Hero | Outil-first dual CTA |
| Ordre outil | Invalidité → … → Employeur optionnel |
| PME / MRa | Exclu à 100 % |
| Shell | Opt-in par campagne |
| Priorité ship | P0-1 + P0-2 + P0-5 = cœur WOW→RDV |

**Owner implémentation suggéré :** 1 dev frontend — estimé **~1 jour** P0, **+0,5–1 j** P1.
