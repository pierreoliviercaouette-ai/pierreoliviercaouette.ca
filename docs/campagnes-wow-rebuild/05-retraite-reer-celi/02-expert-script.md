# [#05] Expert script marketing — Retraite REER / CELI

**Slug :** `/campagnes/retraite-reer-celi`  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, soft close — zéro pitch  
**Sources :** audit · ads `emails/campagne-meta-catalog/retraite-reer-celi.md` · data landing actuelle  
**Objectif :** textes finaux collables → insight → envie de booker 15 min.

---

## 1. Landing — textes finaux

### Hero
| Champ | Texte |
|-------|--------|
| Badge | `Retraite` |
| Kicker (visuel) | `REER · CELI` |
| Titre (garder — aligné Ad2) | `REER ou CELI : où va le prochain dollar ?` |
| Variante A/B titre (Ad1) | `Toujours le REER d’abord ?` |
| Promesse | `Quatre réponses. Une piste d’ordre REER / CELI — et un PDF à apporter en 15 minutes. Sans compte.` |
| CTA primaire | `Essayer le prioriseur` → `#outil` |
| CTA secondaire | `Réserver 15 minutes` → Bookings |
| Ligne confiance | `Conseiller en sécurité financière · Victoriaville · éducatif · sans harcèlement` |

### En bref (3 bullets — remplacer)
1. `REER = déduction maintenant, impôt plus tard · CELI = cotise après impôt, retire sans impôt — deux jobs, pas un mythe.`
2. `Horizon court ou besoin d’accès → souvent CELI d’abord · tranche élevée + long terme → souvent REER · sinon un mix illustratif.`
3. `Tu sors avec un ordre + un partage du prochain dollar en PDF — base claire pour coller ça à ton matching employeur en 15 minutes.`

### Intro section outil
| Champ | Texte |
|-------|--------|
| Eyebrow | `Prioriseur REER · CELI` |
| Sous-ligne | `Réponds · vois où part le prochain dollar · garde le PDF pour les 15 minutes.` |

### Soft close mid (remplace le générique shell)
| Champ | Texte |
|-------|--------|
| `ctaHeadline` | `Ton ordre REER / CELI, on le valide en 15 minutes` |
| `ctaSubline` | `Apporte ton PDF — matching employeur, plafonds, prochain dollar. Zéro pitch.` |
| `ctaLabel` | `Réserver 15 minutes` |
| Réassurance sous CTA | `Prioriseur sans compte · PDF gratuit · 15 min soft` |
| Capsule label | `Capsules REER · CELI` |
| Lien 1 | `/apprendre/reer-ferr` — `REER / FERR` |
| Lien 2 | `/apprendre/celi` — `CELI` |

### Disclaimer page (garder / resserrer)
`Contenu éducatif et général. Titre autorisé : conseiller en sécurité financière. Ne constitue pas un conseil personnalisé. Chaque situation est unique.`

---

## 2. Copy outil (microcopy branchée)

### Shell outil
| Champ | Texte |
|-------|--------|
| Title | `REER ou CELI en premier ?` |
| Intro | `Quatre réponses. On te propose un ordre illustratif — et un partage du prochain dollar.` |
| Disclaimer | `Illustration éducative seulement. Pas un conseil personnalisé.` |

### Champ matching (nouveau)
| Champ | Texte |
|-------|--------|
| Label | `Ton employeur matche ou cotise déjà à un REER ?` |
| Hint | `Si oui, ça peut changer l’ordre du prochain dollar — on le quantifie en 15 min.` |
| Options | `Oui` / `Non` / `Je sais pas` |

### Status / footer selon `suggestion.key`
| Key | Microcopy footer | CTA RDV label |
|-----|------------------|---------------|
| `mixte` | `Pas de gagnant automatique — on colle l’ordre (~X $ CELI / Y $ REER) à tes projets et ton matching en 15 min.` | `Réserver 15 min avec mon résumé` |
| `celi` | `Piste CELI d’abord — en 15 min on vérifie avec tes plafonds, ton matching, et ce que t’as déjà.` | `Réserver 15 min avec mon résumé` |
| `reer` | `Piste REER d’abord — en 15 min on valide le levier fiscal avec ta vraie tranche et ton dossier.` | `Réserver 15 min avec mon résumé` |
| PDF | `Télécharger mon résumé PDF` (outline) | — |

Remplacer `X` / `Y` par `formatCad(celiAmt)` / `formatCad(reerAmt)` si `monthly > 0` ; sinon : `on colle l’ordre mixte à…`.

### Soft close post-PDF (toast / status)
`PDF prêt — 15 min pour le coller à ton dossier ?` + même lien RDV.

### Snapshot labels
| Cas | Dominant | Sous-ligne |
|-----|----------|------------|
| Mixte + $ | `250 $ / 250 $` (ex.) | `Mixte illustratif — CELI / REER` |
| Mixte sans $ | leanLabel (`≈ 50 / 50`…) | `Mixte — à affiner` |
| CELI / REER | `CELI` / `REER` | valeur longue existante |

### Raison matching (si Oui) — à injecter en tête des `raisons`
`Ton employeur matche souvent le REER : ce match-là se regarde souvent avant le débat perso CELI vs REER — on le chiffre en 15 minutes.`

Formulation **éducative** (« souvent ») — jamais ordre produit.

### Phrase soft close idéale (référence émotionnelle)
> Ton prioriseur dit Mixte — ~250 $ CELI / 250 $ REER sur ton prochain 500 $. En 15 minutes, on valide ça avec ton matching employeur, tes plafonds, et ce que t’as déjà. Zéro pitch — juste coller l’ordre à ta vraie vie.

---

## 3. FAQ (max 5 — 4 recommandées)

1. **Faut-il toujours maximiser le REER en premier ?**  
   Pas toujours. Ça dépend de ton taux d’imposition, de tes projets à court terme et de ton besoin de liquidité. L’outil donne une piste éducative — pas une recommandation personnalisée.

2. **Et si mon employeur matche mon REER ?**  
   Un match employeur, c’est souvent de l’argent « gratuit » sur la portion cotisée — ça peut peser lourd dans l’ordre du prochain dollar. L’outil ne calcule pas ton % de match : en 15 minutes, on regarde les règles de ton régime et on colle ça à ton PDF. Illustration seulement — pas un conseil sur mesure.

3. **CELI et CELIAPP, c’est la même chose ?**  
   Non. Le CELI est une enveloppe générale (droits annuels, retraits non imposables). Le CELIAPP vise l’achat d’une première propriété, avec ses propres règles et plafonds. Si ton projet c’est surtout la maison, regarde aussi la campagne CELIAPP — ici on priorise REER vs CELI « classique » pour la retraite / l’épargne flexible.

4. **Le PDF, c’est un conseil de placement ?**  
   Non. C’est un résumé illustratif de tes réponses. Les choix de produits et de montants se font après analyse de ton dossier.

---

## 4. Ads Meta — ajustements (outil-first)

Disclaimer commun (inchangé) :  
`Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Aucune promesse de rendement. L’outil donne une piste éducative, pas un conseil sur mesure.`

### Ad1 — Mythe « toujours le REER d’abord »
- **Titre :** `Toujours le REER d’abord ?` (garder)
- **Ajustement corps :** après « prioriseur gratuit », ajouter 1 ligne :  
  `Si ton employeur matche déjà, l’outil te le fait noter — on chiffre le match en 15 minutes si tu veux.`
- **CTA bouton :** En savoir plus  
- **Close :** garder soft 15 min / zéro pression  
- **UTM :** `retraite_ad1`

### Ad2 — Cotiser au feeling
- **Titre :** `Arrêter de cotiser au feeling` (garder)
- **Ajustement :** renforcer le pont $ :  
  `Tu vois même un partage illustratif du prochain dollar (ex. 250 $ CELI / 250 $ REER) — pas une formule magique, une piste.`
- Éviter tout % de rendement.  
- **UTM :** `retraite_ad2`

### Ad3 — Essaie le prioriseur (alignement hero)
- **Titre :** `Essaie le prioriseur` (garder — doit matcher hero primaire)
- **Ajustement fin :**  
  `Essaie d’abord. Le PDF est gratuit. Ensuite, 15 minutes soft pour coller l’ordre à ton matching et tes plafonds — zéro vente forcée.`
- **UTM :** `retraite_ad3`

### Brief visuel ads (rappel)
Feed : navy, typo bold `REER · CELI`, sous-texte `Prioriseur gratuit · sans compte`.  
Éviter : graphiques de rendement, « X % garantis », promesse de gain.

---

## 5. Objections → répliques (script RDV / page)

| Objection | Réplique page |
|-----------|----------------|
| « Mon employeur matche — ton 50/50 est naïf » | Toggle + raison « souvent le match d’abord » + CTA quantifier en 15 min |
| « Mixte = j’ai foiré » | Copy « Mixte — à affiner » / « pas de gagnant automatique » sans alerte |
| « On va me harceler / me vendre un compte » | Répéter au CTA : sans compte · 15 min soft · zéro pitch |

---

## 6. Ce qu’on ne dit pas

- Pas de « meilleur compte », « maximise toujours », « X % de rendement ».  
- Pas d’ordre produit définitif sur le matching.  
- Pas « conseil personnalisé » pour l’outil / le PDF.  
- Pas confondre CELI et CELIAPP dans le hero.
