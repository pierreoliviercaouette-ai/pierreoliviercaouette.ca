# [#04] Expert script marketing — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**Persona :** Salarié 28–45 ans, collective RH cochée, livret jamais ouvert. Objection #1 : « Ma collective me suffit. »  
**CTA final :** RDV Bookings  
**Date :** 2026-11-04  
**Ton :** québécois parlé, calme, éducatif — zéro peur hôpital, zéro pitch produit

---

## 1. Textes finaux landing (prêts à coller)

### Hero
| Élément | Texte |
|---------|-------|
| Badge | Invalidité |
| Titre (garder) | Si le salaire s’arrête : le trou de ton assurance collective |
| Promesse | Quatre chiffres — tu vois le trou vs tes dépenses, et ce qu’il faut tenir pendant l’attente. Sans compte. |
| CTA primary | Voir mon trou |
| CTA secondary | Réserver 15 minutes |
| Ligne confiance | Conseiller en sécurité financière · Victoriaville · contenu éducatif — on lit ton livret ensemble |

### En bref (3 bullets)
1. Ce que ton assurance collective t’offre : % du salaire et délai avant le premier chèque  
2. Le trou mensuel vs tes dépenses qui, elles, n’arrêtent pas  
3. Le coussin à prévoir pendant l’attente — souvent 30, 90 ou 120 jours sans chèque  

**Ligne process (sous En bref) :**  
`4 chiffres → trou + coussin → on ouvre ton livret en 15 min`

### Intro bloc outil (au-dessus du shell — shell copy)
| Élément | Texte |
|---------|-------|
| Eyebrow | À toi de jouer |
| Sous-titre zone | Ajuste les chiffres — le trou et le coussin se mettent à jour tout de suite. |
| Title outil (shell) | Le trou entre ton assurance collective et tes dépenses |
| Intro outil | Ton assurance collective remplace souvent seulement une partie du salaire — et le premier chèque arrive après un délai. Entre tes chiffres : tu vois ce qui manque chaque mois, et ce qu’il faut tenir pendant l’attente. |

### Labels / hints champs
| Champ | Label | Hint |
|-------|-------|------|
| Revenu | Ton revenu net mensuel | Ce qui rentre vraiment dans ton compte, après impôts. |
| % | Part remplacée par ton assurance collective | Ex. 60 % = 60 $ pour chaque 100 $ de revenu. C’est dans ton livret — souvent entre 50 et 70 %. |
| Délai | Jours d’attente avant le premier chèque | Pendant ce temps, ton assurance collective ne paie rien. C’est à toi de tenir. |
| Chips délai | 30 · 90 · 120 | — |
| Hint livret | — | Pas le livret sous la main ? Pars de 60 % / 90 j — on ajuste en RDV. |
| Dépenses | Tes dépenses fixes mensuelles | Loyer ou hypothèque, auto, garderie, épicerie… ce qui continue même si tu ne travailles plus. |

### Snapshot / résultats (labels)
| Zone | Label |
|------|-------|
| Snapshot A | Trou vs dépenses / mois *(ou Marge vs dépenses / mois si ≥ 0)* |
| Snapshot B | Coussin d’attente |
| Barre | {X} % de tes dépenses couvertes par ton assurance collective · {Y} j d’attente… |
| Card collective | Ton assurance collective / mois |
| Card trou | Trou vs tes dépenses |
| Card coussin | À avoir de côté pendant l’attente |
| Note définition | Le % et le délai, c’est une chose. La **définition d’invalidité** dans ton livret (« ta job » vs « n’importe quelle job »), c’en est une autre — à vérifier avant de conclure que ton assurance collective te couvre « pour vrai ». |

### Soft close post-outil (`statusDetail` + CTA)

**Si trou > 0 (gapWarn) ou coussin > 0 :**  
> ~{trou} $/mois à combler · ~{coussin} $ à tenir. On ouvre ton livret en 15 min — %, délai, définition.

**Si marge OK (`!gapWarn`) :**  
> Les $ tiennent sur papier. Reste la définition et la durée dans ton livret — c’est souvent ça qu’on clarifie en 15 min.

| CTA | Label |
|-----|-------|
| RDV outil | Clarifier mon trou en 15 min |
| PDF | Télécharger mon résumé PDF *(secondaire / ghost)* |

### Soft close mid (bandeau navy)
| Champ data | Texte |
|------------|-------|
| `ctaHeadline` | Ton trou vs dépenses, c’est clair sur papier. |
| `ctaSubline` | 15 min : on valide le %, le délai, et la définition (« ta job » vs « n’importe quelle job »). Sans pression. |
| `ctaLabel` | Réserver 15 minutes |
| Apprendre | Lire la capsule invalidité |

### Phrase idéale booker (référence PM / ads)
> T’as ~500 $ de trou par mois et ~9 600 $ à tenir pendant l’attente. En 15 min on valide ça avec ton livret — le %, le délai, pis la définition d’invalidité. Sans pression.

*(Les montants sont dynamiques ; 500 / 9 600 = defaults illustratifs.)*

---

## 2. FAQ (5 max)

1. **J’ai déjà une assurance collective. Pourquoi regarder ailleurs ?**  
   Ton assurance collective, c’est utile — mais souvent limitée (montant, durée, définition). Beaucoup de gens voient les trous seulement le jour d’une réclamation. Mieux vaut les voir avant.

2. **Est-ce la même chose que la maladie grave ?**  
   Non. L’invalidité remplace un revenu dans le temps — via ton assurance collective ou une protection de ton bord. La maladie grave verse un capital si le diagnostic correspond au contrat. Les deux répondent à des risques différents.

3. **« Ta job » vs « n’importe quelle job » — c’est quoi la différence ?**  
   Certaines définitions regardent si tu peux faire *ton* métier ; d’autres, si tu peux faire *un* métier. Ça change beaucoup ce que « être couvert » veut dire. C’est écrit dans ton livret — on le lit ensemble en 15 min. Contenu éducatif, pas un avis sur ton contrat.

4. **Les prestations, ça dure jusqu’à quand ?**  
   Ça dépend du contrat : quelques années, jusqu’à un âge précis, parfois plus court qu’on croit. L’outil ici illustre le % et le délai — pas la durée max. À valider dans ton livret.

5. **Est-ce que je peux avoir une invalidité individuelle en plus de la collective ?**  
   Oui, c’est parfois pertinent — pour combler un trou de montant, de délai, de durée ou de définition. Ça se regarde au cas par cas, sans pression et sans promesse de % garanti.

---

## 3. Disclaimer (landing + outil + PDF)

**Court (outil) :**  
Contenu éducatif seulement — pas un conseil personnalisé. Valide toujours avec ton livret.

**PDF / notes :**  
Illustration éducative seulement — pas un conseil personnalisé. Le % et le délai, c’est une chose. La définition d’invalidité dans ton livret, c’en est une autre. Aucun pourcentage de remplacement n’est promis comme garantie. Prochaine étape : 15 min pour valider %, délai, définition avec ton livret.

**Ads (garder esprit catalogue) :**  
Contenu éducatif et général. Titre : conseiller en sécurité financière. Pas un conseil personnalisé. Ce que ton assurance collective t’offre et ce que tu peux prendre de ton bord varient selon les contrats. Aucun pourcentage de remplacement de revenu n’est promis comme garantie.

---

## 4. Ads Meta — ajustements (alignement outil-first)

Garder structure Ad1 / Ad2 / Ad3. Micro-ajustements seulement :

### Ad1 — Mythe collective
- **Titre :** Et ton trou de revenu, lui ? *(garder)*  
- Ajouter en fin de body, avant URL :  
  > Sur la page, tu vois aussi le coussin pendant l’attente — pas juste le trou du mois.  
- Soft close RDV : garder « 15 minutes… confirmer que t’es déjà correct » + ajouter « on ouvre le livret : %, délai, définition ».

### Ad2 — Délai / coussin
- **Titre :** Combien tient l’attente ? *(garder)*  
- Renforcer : chips 30 / 90 / 120 sur la page (une ligne) :  
  > Sur la page, tu peux tester 30, 90 ou 120 jours — tu vois le coussin changer tout de suite.

### Ad3 — Avant le RDV
- **Titre :** Vois le trou avant le RDV *(garder — critique)*  
- Aligner hero : le premier bouton de la page = l’outil, pas le calendrier.  
- Body : remplacer toute implication « réserve d’abord » par « joue l’outil d’abord ».

**UTM :** `invalidite_ad1` / `invalidite_ad2` / `invalidite_ad3` — inchangés.

---

## 5. Mots à éviter / préférer

| Éviter | Préférer |
|--------|----------|
| Salaire garanti / 100 % remplacé | Ce que ton assurance collective t’offre |
| T’es correct / t’es couvert *(si marge OK)* | Les $ tiennent sur papier ; reste définition + durée |
| Hôpital, catastrophe, peur | Livret, paie, délai, trou, coussin |
| Conseil personnalisé / recommandation | Illustration / contenu éducatif |
| « 90 jours » comme vérité | « souvent 30, 90 ou 120 » + ton livret |

---

## 6. Mapping data (`campagneAdsLandings.js`)

```js
// assurance-invalidite — champs copy
title: 'Si le salaire s’arrête : le trou de ton assurance collective',
promise: 'Quatre chiffres — tu vois le trou vs tes dépenses, et ce qu’il faut tenir pendant l’attente. Sans compte.',
bullets: [ /* 3 ci-dessus */ ],
ctaLabel: 'Réserver 15 minutes',
ctaHeadline: 'Ton trou vs dépenses, c’est clair sur papier.',
ctaSubline: '15 min : on valide le %, le délai, et la définition (« ta job » vs « n’importe quelle job »). Sans pression.',
faq: [ /* 5 ci-dessus */ ],
```

Hero CTA primary « Voir mon trou » = label shell (pas forcément `ctaLabel` RDV).
