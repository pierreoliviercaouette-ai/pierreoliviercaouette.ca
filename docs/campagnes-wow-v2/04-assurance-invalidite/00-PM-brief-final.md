# [#04] PM — Brief final Vague 2 (post-P0) — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**URL :** https://www.pierreoliviercaouette.ca/campagnes/assurance-invalidite  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**CTA :** RDV Bookings  
**Livrables :** `01-expert-visuel` · `02-expert-script` · `03-expert-outil` · `04-expert-finance`  
**Commit / code :** non (docs seulement)

---

## 1. Vision Vague 2 (1 paragraphe)

P0 a fermé la fuite PDF-only et aligné Ad3 (outil-first) + mid chiffré. Vague 2 différencie le **sujet** sans casser le **système catalogue** : teinte CSS livret/paie (zéro photo), micro-signaux fold, process 3 steps, SoftClose **collé sous le duo** Trou \| Coussin, pulse ambre warn, portrait CSF au mid. Résultat : en 5 s un ami reconnaît « invalidité / livret » — et le booker est au pic, pas sous Block 2.

---

## 2. Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 6 | 7,5 | **8,5+** |
| WOW outil | 7 | 8 | **9** |
| Env. booker | 5 | 7 | **8+** |

**Top 1 gap WOW restant :** SoftClose encore footer-only (loin du duo) **+** hero sans identité livret/paie (CSS).

---

## 3. Spec Avant → Après (synthèse)

| Zone | Avant (code actuel) | Après (Vague 2) | Fichiers |
|------|---------------------|-----------------|----------|
| Hero | Orbs navy génériques | `atmosphere="livret-paie"` CSS tint/lignes/grain | `PageHero.jsx`, landing, data |
| Fold extras | Aucun | `heroExtras` kicker + 2 chips | data + `CampagneAdsLanding.jsx` |
| Process | Absent | Strip 3 steps catalogue | landing + data |
| SoftClose outil | `footer` shell sous Block 2 | Sous duo snapshot ; `ToolSoftClose` only | `InvaliditeTool.jsx` |
| Climax typo | `text-2xl` | `text-3xl md:text-4xl` | `InvaliditeTool.jsx` |
| Motion | Barre only | + warn pulse + fade SoftClose (helpers shell) | tool + shell |
| Mid | Copy P0 OK | + portrait `/seo/portrait.jpg` + libellé CSF | landing |
| Soft close / dual CTA / mid copy | P0 livré | **Ne pas re-spécifier** | — |

---

## 4. Backlog shippable

### P0-v2 — ship Vague 2 cette campagne

| ID | Item | Effort | Rôle |
|----|------|--------|------|
| V2-04-1 | SoftClose sous duo snapshot (`footer` → climax) | **S** | Outil |
| V2-04-2 | Warn pulse + typo climax 3xl/4xl | **S** | Outil + Visuel |
| V2-04-3 | `atmosphere: 'livret-paie'` + overlays CSS | **M** | Visuel *(shell)* |
| V2-04-4 | `heroExtras` + `processSteps` data + landing | **S** | Script + Visuel *(shell)* |
| V2-04-5 | Portrait mid SoftClose catalogue | **S** | Visuel *(shell)* |

### P1

| ID | Item | Effort |
|----|------|--------|
| V2-04-P1a | Chip rapide 60 % + hint net vs brut FAQ | S |
| V2-04-P1b | Ads catalogue micro-align process/atmosphere | S |

### P2

| ID | Item | Effort |
|----|------|--------|
| V2-04-P2a | Compresser redondance Block 2 vs snapshot | S |
| V2-04-P2b | Mock aperçu livret CSS (pas photo) | M |

---

## 5. Uniformité catalogue (OBLIGATOIRE)

Le PM garantit le **même squelette / mêmes composants shell** que les 14 autres campagnes. On différencie le sujet (#04 livret-paie, duo trou/coussin, pulse warn) sans reinventer le système.

| Contrat shell | OK ? | Note #04 |
|---------------|------|----------|
| Ordre sections Hero → En bref → Process 3 steps → Outil → Mid soft-close → FAQ | **Oui** | Process ajouté V2 ; ordre catalogue strict |
| Hero CTAs primaire outil / secondaire RDV — mêmes variantes boutons | **Oui** | Déjà P0 ; ne pas changer styles |
| SoftClose = `ToolSoftClose` uniquement (RDV primary + PDF ghost) | **Oui** | Placement sous duo seulement — **pas** bandeau custom |
| Portrait `/seo/portrait.jpg` + libellé CSF · Victoriaville | **Oui** | Mid navy ; taille 48–64 ; libellé identique catalogue |
| Process strip même composant / classes ; seuls 3 libellés changent | **Oui** | `4 chiffres` · `Trou + coussin` · `Livret en 15 min` |
| Typo climax `font-heading` text-3xl/4xl (pas échelle orpheline) | **Oui** | Snapshot duo monte à 3xl/4xl |
| Spacing / cards tokens prestige ; pas palette solo hors teinte atmosphere | **Oui** | Ambre = warn existant + tint hero only |
| Motion helpers shell (fade SoftClose, keyed/pulse reveal) — pas lib solo | **Oui** | Warn pulse + fade partagés |

**Autorisé à diverger :** `atmosphere="livret-paie"`, `heroExtras`, chiffres/climaxes outil (duo + pulse), copy sujet.  
**Interdit :** reinventer mid CTA, footer outil custom, FAQ layout, SoftClose one-off, photos full-bleed.

### Checklist PM avant ship code

- [ ] Page #04 lit comme une sœur des 14 autres (même chrome)  
- [ ] En 5 s on sent **invalidité** via atmosphere + process + duo — pas via un layout unique  
- [ ] Aucun SoftClose / mid / FAQ « édition spéciale invalidité »  
- [ ] Portrait + process = composants shell, pas forks  

---

## 6. Dépendances shell vs spécifique

| Type | Items | Bloque #04 ? |
|------|-------|--------------|
| **Shell** (V2-S1…S5) | `PageHero` atmosphere, `heroExtras`, `processSteps`, portrait mid, motion helpers | V2-04-3/4/5 attendent shell **ou** feature-flag data |
| **Spécifique** | SoftClose sous duo + pulse + typo snapshot | V2-04-1/2 shippables **seuls** dans `InvaliditeTool.jsx` |
| **Shell V2-S6** | SoftClose sous climax (Comparateur + Invalidité) | Pattern documenté ; #04 = pilote placement |

**Ordre recommandé :**  
1) `InvaliditeTool` placement + pulse (P0-v2 spécifique) → 2) shell atmosphere/process/portrait (PR partagée) → 3) brancher data #04.

---

## 7. Finance / conformité (synthèse)

- **Claims OK :** kicker/chips conceptuels ; process livret 15 min ; SoftClose copy P0 ; écarts illustratifs plus grands visuellement.  
- **Interdits :** montants defaults dans hero ; SoftClose `tone="ok"` ; %/délai figés comme norme hero ; photos.  
- **Disclaimer :** garder P0 outil/PDF/ads.  
Détail : `04-expert-finance.md`.

---

## 8. Copy figée V2 à brancher (extrait)

| Clé | Valeur |
|-----|--------|
| `atmosphere` | `livret-paie` |
| `heroExtras.kicker` | Livret · paie · délai |
| `heroExtras.chips` | `% remplacé` · `Jours d’attente` |
| `processSteps` | `4 chiffres` · `Trou + coussin` · `Livret en 15 min` |
| SoftClose / mid | **P0 inchangé** |

---

## 9. Critères d’acceptation « ami en 5 s »

- [ ] Fold = teinte livret/paie + chips sujet (pas orbs clone)  
- [ ] Process catalogue visible sous En bref  
- [ ] Duo trou+coussin + SoftClose collé dessous (RDV < 2 s après climax)  
- [ ] Pulse warn perceptible au change  
- [ ] Portrait mid catalogue  
- [ ] Uniformité : même squelette que les 14 autres  
- [ ] Zéro nouvelle photo  
- [ ] Events P0 SoftClose toujours OK  

---

## 10. Risques & décisions

| Risque | Mitigation |
|--------|------------|
| Shell atmosphere retarde SoftClose placement | Ship V2-04-1/2 **sans** attendre shell |
| Divergence SoftClose custom « plus beau » | **Interdit** — `ToolSoftClose` only |
| Pulse trop agressif / accessibilité | One-shot court ; respecter `prefers-reduced-motion` si helper shell |
| Confusion #06 MG | FAQ P0 + atmosphere ≠ capital MG |

**Décision :** P0-v2 prioritaire = **SoftClose sous duo** + **atmosphere livret-paie** ; portrait/process via shell catalogue.

---

## 11. Definition of Done

1. 5 md Vague 2 complets (ce pack).  
2. Checklist Uniformité catalogue cochée au ship code.  
3. Revue finance §6 GO.  
4. Test manuel : defaults → pulse → SoftClose sous duo → Bookings UTM.  
5. Pas de commit tant que non demandé.

---

## 12. Synthèse exécutive

**Ship P0-v2 spécifique (S) :** SoftClose sous duo + warn pulse + typo climax.  
**Ship shell (S–M) :** atmosphere `livret-paie`, process, portrait — **même composants** que le reste du catalogue.  
**Ne pas** re-spécifier pont RDV / dual CTA / mid copy / photos.
