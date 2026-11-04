# [#01] Comparateur rendements — Expert finances & fiscalité

**Slug :** `/campagnes/comparateur-rendements`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Signé :** Expert finances & fiscalité (QC)  
**Périmètre V2 :** valider **nouveaux** claims / micro-copy fold / process / typo climax — pas de nouveau champ fiscal (pas SCEE, matching, plafonds REER/CELI).

---

## Rescore post-P0

| Dimension | Avant P0 | Après P0 | Cible V2 |
|-----------|----------|----------|----------|
| Expérience | 5,5 | **7,2** | **9,0** |
| WOW outil | 6,5 | **7,4** | **9,0** |
| Env. booker | 4,5 | **7,0** | **8,5** |

**Top 1 gap conformité restant :** climax plus agressif (écart XXL + SoftClose collé) → risque perçu « pub qui promet un gain » si « illustratif » / Classique 75/75 / produits différents ne restent pas **adjacents** au chiffre.

---

## Verdict

Cadre P0 sain (illustration, passés ≠ futurs, soft close « écart illustratif »). Vague 2 **n’ajoute pas** de math fiscale nouvelle — elle **amplifie** le chiffre. Green light si : (1) label « Écart illustratif » inchangé ; (2) heroExtras Banque|Modèles restent descriptifs ; (3) process step 3 dit « Illustration — pas une garantie » ; (4) typo XXL ≠ claim « tu vas gagner ».

---

## 1. Nouveaux éléments V2 — validation

| Élément V2 | Statut | Condition |
|------------|--------|-----------|
| heroExtras `Banque` / `Modèles` | **OK** | Hints « préréglage / relevé » et « moyenne 5 ans nette » — **pas** « ta banque te donne X » |
| atmosphere split-compare | **OK** | Teinte CSS, aucun chiffre claims |
| Process step 3 « L’écart » + hint illustration | **OK** | Garder « pas une garantie » |
| Écart-first + text-3xl/4xl | **OK** | Label reste « Écart illustratif » ; detail garde ≈ % · années |
| Pulse motion | **OK** | Cosmétique |
| SoftClose sous climax (même copy) | **OK** | Headline déjà « écart illustratif » |
| Portrait mid + CSF · Victoriaville | **OK** | Obligatoire titre |
| Module preuve 5 profils (P1) | **OK si** | % live `getIaPct` / préréglages banque · projection 20 ans **calculée** · disclaimer C adjacent |
| Invite « saisis le taux de ton relevé » | **OK** | Clarifie que le préréglage ≠ relevé réel |
| Chip mythe 50k·20ans | **OK** (déjà) | Illustration ; pas de $ figé en ads sans date |

### Hors sujet #01 (ne pas introduire)
SCEE, droits CELI, plafonds REER, matching employeur, « meilleur que ta banque », garanties de rendement.

---

## 2. Claims OK / Interdits

### Claims OK (garder / V2)
- « Illustration / illustratif »
- « À profil égal » = mêmes montants + même confort risque
- « Moyenne 5 ans nette » modèles + `asOfLabel`
- « Préréglage illustratif » banque
- « 2–3 points… ça a l’air d’un détail » **si** suivi de l’écart illustratif calculé
- Soft close « on colle ça à ton relevé » (clarification, pas promesse de battre)

### Interdits (V2 inclus)
- « Tu vas gagner / tu perds / manque à gagner »
- « Garanti », « sans risque », « meilleur que ta banque »
- Hardcoder un écart 20 ans en copy permanente sans « illustration · taux affichés · date »
- Présenter préréglage banque comme moyenne officielle des banques canadiennes
- Impliquer conseil personnalisé ou recommandation de transfert

---

## 3. Disclaimers — état & gaps

| Zone | Texte requis | Statut post-P0 |
|------|--------------|----------------|
| Outil `disclaimer` | Illustration · Classique 75/75 · produits différents · passés ≠ futurs · pas conseil | Présent (raccourci OK si Classique 75/75 y est) |
| SoftClose headline | Contient « illustratif » | OK — ne pas retirer en V2 |
| Page bas | Contenu éducatif · CSF · pas conseil | Présent — renforcer Classique 75/75 si encore générique |
| heroExtras | Pas de disclaimer dédié | OK — descriptif seulement |
| Process step 3 | « pas une garantie » | **Requis V2** |
| Module preuve (P1) | Disclaimer adjacent immédiat | Gate P1 |

### Disclaimer outil cible (si on aligne au long format)
> Illustration seulement. Côté modèles : moyenne 5 ans nette des portefeuilles modèles iA (série Classique 75/75), selon le profil et la date affichée. Côté banque : préréglage illustratif ou taux saisi. Produits différents (frais, structure, garanties). Les taux ne sont pas garantis. Passés ≠ futurs. Pas un conseil personnalisé.

---

## Spec Avant → Après (finance)

| Zone | Avant | Après V2 | Fichiers |
|------|-------|----------|----------|
| Label écart | Écart illustratif | **Inchangé** (critique) | tool |
| heroExtras | — | Labels descriptifs validés | data |
| Process hint #3 | — | « Illustration — pas une garantie » | data |
| Typo XXL | — | OK si label illustratif adjacent | tool |
| FAQ produits / taux | À vérifier | Ajouter si absentes | `campagneAdsLandings.js` |
| Preuve 5 profils | Absent | Live + disclaimer C | landing / data P1 |

---

## Backlog (finance)

| ID | Item | Effort | Priorité |
|----|------|--------|----------|
| F-1 | Review heroExtras + process hints (gate copy) | S | **P0-v2** |
| F-2 | FAQ « mêmes produits ? » / « d’où les taux ? » | S | **P0-v2** |
| F-3 | Aligner disclaimer outil long format Classique 75/75 | S | **P0-v2** |
| F-4 | Gate module preuve (live + adjacent) | S | P1 |
| F-5 | Review Ad2 catalog 20 ans | S | P1 |

---

## Checklist ship V2

- [ ] Aucun « gagner / battre / garanti » dans nouveaux micro-textes
- [ ] « Illustratif » visible au climax (label + SoftClose)
- [ ] Classique 75/75 dans disclaimer outil ou page
- [ ] Process step 3 = non-garantie
- [ ] Pas de montant 20 ans hardcodé stale en UI
- [ ] Uniformité : pas de claim one-off hors système catalogue
