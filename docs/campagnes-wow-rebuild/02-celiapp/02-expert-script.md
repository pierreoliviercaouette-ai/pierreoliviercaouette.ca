# [#02] CELIAPP — Textes finaux (prêts à coller)

**Rôle :** Expert script marketing  
**Slug :** `/campagnes/celiapp`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, zéro pression  
**Alignement :** ads outil-first → landing outil-first → soft close RDV

---

## 1. Hero (`campagneAdsLandings.js` → `celiapp`)

| Champ | Texte final |
|-------|-------------|
| `badge` | CELIAPP |
| `title` | Ta mise de fonds, en clair avec le CELIAPP |
| `promise` | Projette ce que ton rythme donne — plafonds illustratifs, zéro rendement inventé. Ensuite, si ça chicotte, on démêle ton cas en 15 minutes. |
| Eyebrow confiance *(nouveau, hors data si besoin)* | Conseiller en sécurité financière · Victoriaville — on clarifie avant que tu bouges de l’argent. |
| CTA primary hero | Projeter ma mise de fonds |
| CTA secondary hero / `ctaLabel` mid | Clarifier mon CELIAPP (15 min) |
| `seoTitle` | CELIAPP : projeter ta mise de fonds \| Conseiller en sécurité financière |
| `seoDescription` | Simulateur gratuit CELIAPP : rythme, horizon, plafonds illustratifs. Ensuite 15 min pour admissibilité et prochain pas. Victoriaville. |

---

## 2. En bref — 3 bullets

1. Projeter ta mise de fonds avec les plafonds illustratifs (8 000 $ / an de nouveaux droits, 40 000 $ à vie — 2026)
2. Voir clair : CELIAPP ≠ CELI — objectifs, retraits et plafonds différents
3. Repérer ce qu’il faut vérifier avant d’ouvrir ou de cotiser (qui a le droit, retrait, ordre avec le CELI)

---

## 3. Intro outil / shell

| Emplacement | Texte |
|-------------|-------|
| Label section landing | À toi de jouer |
| Sous-titre landing *(remplacer PDF-first)* | Entre ton rythme et ton horizon — tu vois la projection. Le PDF, c’est en bonus. |
| `CampagneToolShell` `title` | Combien pour ta mise de fonds ? |
| `intro` | Le CELIAPP, c’est un compte pour bâtir une mise de fonds (1ʳᵉ propriété). Jusqu’à 8 000 $ de nouveaux droits / an et 40 000 $ à vie (illustratifs 2026). Entre ce que tu mets, ce que t’as déjà, et dans combien d’années tu vises d’acheter. |

---

## 4. Soft close post-outil (chiffré — templates)

**Sous le climax (bandeau navy) — primary RDV :**

> T’as ~{totalProjete} $ de projetés (cotisations seulement) et encore {droitsRestantsApres} $ de place. En 15 minutes : droit d’ouvrir, rythme, et si le CELI reste à côté — zéro pression.

**Si plafond atteint :**

> Dans ce scénario, tu touches le max à vie ({PLAFOND_VIE} $ illustratif). En 15 min, on regarde si le rythme tient, l’admissibilité, et quoi faire du surplus ailleurs — zéro pression.

**Si écart vs cible (si champ cible rempli) :**

> Projection ~{totalProjete} $ · cible {cible} $ · écart ~{ecart} $. En 15 min, on démêle les leviers (rythme, horizon, autres comptes) — sans promesse magique.

**Status footer outil (remplace PDF-first) :**

| État | `statusDetail` |
|------|----------------|
| Infos manquantes | Dis-nous combien tu mets par année et dans combien d’années tu vises d’acheter. |
| Projection prête | Ta projection est prête. Clarifie le prochain vrai pas en 15 min — ou garde le PDF. |
| Max à vie | Max à vie dans ce scénario. 15 min pour valider la suite — PDF en bonus. |

**Labels boutons outil :**
- RDV primary : `Clarifier mon CELIAPP (15 min)`
- PDF outline : `Télécharger ma projection PDF`

---

## 5. Mid CTA (`CampagneAdsLanding` mode RDV)

| Champ | Texte |
|-------|-------|
| Headline | T’as une projection. On valide le prochain vrai pas ? |
| Subline | Admissibilité, rythme, CELI vs CELIAPP — 15 min, zéro pression. |
| CTA | Clarifier mon CELIAPP (15 min) |
| Secondaire | Lire la capsule CELIAPP |

*(Implémentation : `softCloseHeadline` / `softCloseSubline` dans data, lus par le shell — plus de hardcode « Prêt à clarifier ta situation ? ».)*

---

## 6. Checklist admissibilité (copy soft — non verdict)

**Titre bloc :** Avant de cotiser — un check rapide  
**Sous-titre :** Pas un verdict. Juste ce qu’on valide souvent en RDV.

| Toggle | Label | Hint |
|--------|-------|------|
| 1 | Je suis résident canadien | En général, oui pour ouvrir. |
| 2 | J’ai l’âge admissible | Les règles d’âge évoluent — on le confirme au dossier. |
| 3 | Je vise une 1ʳᵉ propriété admissible | Critères « premier acheteur » selon les règles en vigueur. |

**Pont si un « non » / doute / non coché :**  
`Un non ou un doute ? C’est souvent ça qu’on valide en 15 minutes — avant de bouger de l’argent.`

**Pont si tout coché :**  
`OK sur le papier. Reste le rythme, le retrait, et l’ordre avec ton CELI — on peut le verrouiller ensemble.`

---

## 7. Mini contraste CELI ≠ CELIAPP (3 lignes)

| | CELIAPP | CELI |
|--|---------|------|
| Job | Mise de fonds 1ʳᵉ propriété | Souplesse / autres projets |
| Retrait | Règles liées à l’achat admissible | Plus souple (selon ton but) |
| Plafonds | Annuels + à vie (illustratifs) | Droits CELI (autre logique) |

**Ligne de bas :** Deux jobs. Un ordre qui dépend de toi — pas d’un slogan.

---

## 8. FAQ (max 5) + disclaimer

1. **Est-ce que le CELIAPP remplace le CELI ?**  
   Non. Deux comptes, deux jobs. Le CELIAPP vise surtout une 1ʳᵉ propriété ; le CELI est plus souple pour d’autres projets. Selon ton horizon, on peut les combiner — à clarifier selon ta situation.

2. **Qui peut ouvrir un CELIAPP ?**  
   En général : résident canadien, âge admissible, et critères de « premier acheteur » selon les règles en vigueur. Les détails évoluent — valide toujours avant d’ouvrir ou de cotiser. Cette page ne remplace pas une vérification personnalisée.

3. **Si j’achète plus tard — ou pas du tout ?**  
   Les règles de participation et de retrait ont des échéanciers. Si ton achat glisse, faut savoir ce qui se passe avec le compte. C’est exactement le genre de point qu’on démêle en 15 minutes — sans pression.

4. **CELIAPP ou RAP (REER) — dans quel ordre ?**  
   Ça dépend de ton dossier, de tes droits et de ton horizon. L’outil ici projette le CELIAPP seulement (cotisations). L’ordre avec REER / RAP / CELI se clarifie au cas par cas.

5. **C’est un conseil personnalisé ?**  
   Non. Page éducative et générale. Une recommandation adaptée à ton dossier se fait seulement après une analyse de ta situation.

**Disclaimer outil (garder / resserrer) :**  
Illustration éducative seulement — pas un conseil personnalisé. Chiffres 2026 illustratifs (8 000 $ de nouveaux droits / année, 40 000 $ à vie ; les reports peuvent changer le max d’une année). Qui a le droit, les retraits et l’impôt : à revalider selon ta situation. Aucun rendement inventé.

**Disclaimer page / ads :**  
Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Aucune promesse de rendement ni de « tu auras ta mise ». Plafonds, admissibilité et règles fiscales évoluent — à revalider.

---

## 9. Ads Meta — ajustements outil-first (légers)

Les 3 ads sont déjà outil-first. **Garder** Ad1–Ad3 ; n’ajuster que le soft close pour matcher les labels landing.

| Ad | Titre (garder) | Soft close — remplacer la fin RDV par |
|----|----------------|----------------------------------------|
| Ad1 | CELIAPP : vois ta mise de fonds avant | Si après ça tu veux démêler ton cas : Clarifier mon CELIAPP — 15 min, zéro pression. |
| Ad2 | Projette ta mise de fonds (gratuit) | Ensuite, si tu veux qu’on regarde ton échéancier : 15 min — Clarifier mon CELIAPP. Soft. À toi. |
| Ad3 | Simulateur CELIAPP — sans compte | Ou 15 minutes après — Clarifier mon CELIAPP — si les chiffres te chicottent. |

**Descriptions :** inchangées (`Simulateur gratuit · sans compte` / éducatif / CSF).

**Ne pas promettre dans les ads :** « tu achètes plus vite », rendement, admissibilité garantie, « assez pour ta maison ».

---

## 10. Microcopy UI outil (compléments)

| Élément | Texte |
|---------|-------|
| Chip optionnel max | Viser le max 8 k $ × 5 ans |
| Hint cotisation (sans max input) | Au-delà de 8 000 $ de nouveaux droits / an, on retient le plafond illustratif — sauf reports (à valider au dossier). |
| Label climax (si pas headline) | — *(préférer toujours `lecture.headline`)* |
| KPI écart | Projection · Cible · Écart |
| Process 3 steps | 1. Projeter → 2. Lire le chiffre → 3. 15 min si doute |
