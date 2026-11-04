# [#10] Trop jeune — Spec SCRIPT (textes finaux)

**Rôle :** Expert script marketing  
**Slug :** `/campagnes/trop-jeune-assurance`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, tu, mythe-killer, soft close — pas vendeur  
**Conformité :** éducatif · score/capital illustratifs · pas de prime chiffrée · pas « plus cheap garanti »

---

## 0. Intent émotionnel

Prospect 22–35 : « j’attends, je suis en santé ». On le fait **posséder** son score (geste toggle), puis on lui offre 15 min pour **lire** ce score — pas pour signer. Phrase nord : *clarifier ≠ acheter*.

---

## 1. Landing — textes à coller

### Hero (`campagneAdsLandings.js`)

| Champ | Texte final |
|-------|-------------|
| `badge` | `Assurance vie` |
| `title` | `« Je suis trop jeune pour m’assurer » — vraiment ?` *(garder)* |
| `promise` | `L’âge sur la carte, c’est pas le filtre. Tes obligations — et ce que tu sais déjà qui s’en vient — oui. Score gratuit, sans compte.` |
| `trustLine` *(nouveau optionnel)* | `Score gratuit · sans compte · Victoriaville` |
| `ctaLabel` | `Voir mon score` |
| `ctaHref` *(nouveau)* | `#outil` |
| `ctaSecondaryLabel` *(nouveau)* | `Ou réserver 15 min` |
| *(si shell ne gère pas encore dual CTA)* garder `ctaLabel: 'Réserver 15 minutes'` en fallback et brancher dual CTA en code | |

### Bullets En bref

1. `Aujourd’hui : maison, enfants, qui dépend de ta paye, dettes`  
2. `Demain déjà connu : hypothèque prévue, famille prévue — ça compte aussi`  
3. `Score /100 + montant (présent + projets) + PDF — sans compte`  
   - **Remplace** « temporaire / prison » (dissonance Ad2 = score+montant)

### Intro section outil (shell landing ~L133–135)

| Avant | Après |
|-------|-------|
| Remplis l’outil — tu repars avec un résumé clair et un PDF à garder. | Coche ton présent + tes projets connus. Le score bouge en live — sans compte. |

### Mid CTA RDV (`ctaHeadline` / `ctaSubline` — brancher aussi mode RDV)

| Champ | Texte |
|-------|-------|
| `ctaHeadline` | `Ton score te chicotte ?` |
| `ctaSubline` | `15 min pour lire présent + projets connus ensemble. Clarifier ≠ acheter.` |
| Bouton mid | Garder label RDV : `Réserver 15 minutes` **ou** `Lire mon score en 15 min` (préféré post-outil) |

### Soft close **dans l’outil** (sous Lecture — templates dynamiques)

**Si score ≥ 40 :**  
> Score {n}/100 · ~{capital} illustratifs (surtout tes projets connus). 15 min pour lire ça ensemble — clarifier ≠ acheter.

CTA : `Lire mon score en 15 min`

**Si score 15–39 :**  
> Score {n}/100 · y’a déjà de quoi regarder. 15 min pour clarifier présent + projets — sans pression.

CTA : `Clarifier mon score · 15 min`

**Si score < 15 :**  
> Besoin plus léger pour l’instant. Garde le PDF — ou 15 min si tu veux valider que t’oublies rien.

CTA primaire PDF ; lien texte : `Ou 15 min avec un conseiller`

### Microcopy outil (JSX)

| Emplacement | Texte |
|-------------|-------|
| Coach futur (sous titre step 2 ou hint YesNo hypo) | `Coche tes projets connus — c’est souvent ça qui fait bouger le score.` |
| Label contrib (était « Salaire ») | `Proche dépend de toi` |
| `statusDetail` score élevé | `Apporte ce résumé en RDV — on le lit ensemble.` *(plus « Garde le PDF. » seul)* |
| `statusDetail` moyen/bas | `Ajuste tes projets (maison, famille) — souvent c’est ça qui change le portrait.` *(OK)* |
| PDF note finale | `Apporte ce PDF — 15 min pour le lire ensemble. Illustration éducative seulement.` |

### Proof strip

`Conseiller en sécurité financière · Victoriaville · clarifier ≠ acheter`

---

## 2. FAQ (max 5) — coller dans `faq[]`

1. **Sans enfants, ai-je besoin d’assurance vie ?**  
   Parfois oui (hypothèque, conjoint, dettes, entreprise), parfois non. On regarde les obligations réelles — pas un réflexe de produit.

2. **Pourquoi mon âge n’entre pas dans le score ?**  
   Parce que le mythe « trop jeune » regarde la carte d’identité. Le vrai filtre, c’est qui dépend de ton revenu et ce qu’il reste à payer — plus les projets que tu connais déjà. L’âge reste un contexte (santé, coût relatif) — on le discute en rencontre, pas dans ce mini-score.

3. **C’est plus cher / plus difficile si j’attends ?** *(NOUVEAU — objection #1)*  
   Souvent, l’âge et la santé pèsent dans le coût et l’admissibilité — mais ça se discute au cas par cas, pas avec un chiffre magique ici. Le score ne calcule pas une prime. En 15 minutes, on clarifie ce qui est déjà « connu » chez toi (présent + projets) sans te pousser à acheter.

4. **J’ai déjà de l’assurance via mon job / collective — ça compte ?** *(NOUVEAU — sync Ad3)*  
   Oui, ça peut couvrir une partie. La collective change souvent si tu changes d’employeur, et les montants / définitions ne collent pas toujours à ton hypothèque ou à ta famille à venir. Le score ici n’inclut pas ta collective : en RDV, on peut croiser les deux sans payer deux fois pour rien.

5. **C’est un conseil personnalisé ?**  
   Non. Page éducative et illustration seulement. Toute recommandation se fait après analyse de ta situation.

---

## 3. Ads Meta — ajustements (alignement outil-first)

Les Ad1–Ad3 actuelles sont déjà score-first. Ajustements **légers** seulement :

### Ad1 — titre/desc (inchangés OK)
- Titre : `Trop jeune… vraiment ?`  
- Desc : `Score gratuit · sans compte`  
- Corps : OK. Soft close déjà « si le score te chicotte ».

### Ad2 — renforcer le split (1 phrase)
Après « Le score bouge. Le montant illustratif aussi. », ajouter :  
> Tu vois souvent : aujourd’hui léger · projets connus qui pèsent.

### Ad3 — collective explicite (matrice CBO « Prix vs risque » → vérité douce)
Remplacer la parenthèse soft close par :  
> Si après ça t’as encore des questions — collective vs perso, ce qui manquerait, si attendre change vraiment quelque chose chez toi — on prend 15 minutes.

**Interdit en ads :** « assure-toi jeune = moins cher » chiffré · « économise X % » · promesse d’admissibilité.

### Sync catalogue CBO
Matrice Ad3 « Prix vs risque » ≠ copy landing score-first : la FAQ #3 porte le sujet **éducatif** sans claim prime. Pas besoin d’une 4e ad « prix » agressive.

---

## 4. Events / labels tracking (copy côté CTA)

| CTA | `trackRendezVousClick` id |
|-----|---------------------------|
| Hero secondaire RDV | `campagne_trop-jeune-assurance_rdv` |
| Mid shell | `campagne_trop-jeune-assurance_rdv_mid` |
| Soft close outil | `campagne_trop-jeune-assurance_rdv_outil` |
| PDF | déjà `campagne_trop-jeune-assurance_pdf` |

Hero primaire `#outil` : `trackEvent('select_content', { item_id: 'campagne_trop-jeune-assurance_hero_outil' })`

---

## 5. Capsule apprendre (lien existant)

Garder : `/apprendre/assurance-vie-temporaire` · `Lire la capsule assurance vie temporaire`  
Pas de rewrite capsule dans ce livrable.

---

## 6. Checklist copy ship

- [ ] Hero outil-first + promesse sans compte  
- [ ] Bullet #3 = score/montant (plus « prison »)  
- [ ] Soft close outil cite `{score}` + `{capital}`  
- [ ] Mid = « Ton score te chicotte ? »  
- [ ] FAQ attendre + collective  
- [ ] Zéro claim prime / « plus cheap »  
- [ ] Label « Proche dépend de toi »
)
