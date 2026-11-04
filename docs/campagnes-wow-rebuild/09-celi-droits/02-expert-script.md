# [#09] CELI droits — Spec SCRIPT (textes finaux)

**Slug :** `/campagnes/celi-droits`  
**Rôle :** Expert script marketing  
**Date :** 2026-11-04  
**Ton :** québécois parlé, éducatif, soft close — zéro pitch « maxe demain »  
**CTA final :** RDV Bookings 15 min (`/rendez-vous/campagne`)

---

## 1. Landing — copy data (`campagneAdsLandings.js` · `celi-droits`)

### Hero
| Champ | Texte final |
|-------|-------------|
| `badge` | `CELI` |
| `title` | Des droits CELI qui dorment — t’as vraiment regardé ce qu’il te reste ? |
| `promise` | Estime ta place restante en 2 minutes. Ensuite, colle un usage (urgence, projet, long terme) — ou pas. |
| `ctaLabel` (mid / secondaire) | Réserver 15 minutes |
| Label CTA primaire hero *(shell)* | Estimer ma place |

### Pastille trust (fold — si champ data ou JSX)
`Sans compte · sans formulaire · estimation`

### En bref (`bullets`)
1. Droits cumulés vs plafond de l’année : ce n’est pas la même chose  
2. Estime ta place en 3 chiffres — PDF à comparer avec Mon Dossier ARC  
3. Urgence, projet ou long terme : choisis un usage avant de « maxer »

### Mid CTA (brancher `ctaHeadline` / `ctaSubline` sur path RDV)
| Champ | Texte final |
|-------|-------------|
| `ctaHeadline` | Ta place restante, c’est un chiffre. L’usage, c’est le plan. |
| `ctaSubline` | Clarifier ≠ cotiser demain. 15 minutes soft — CSF · Victoriaville. |
| `ctaLabel` | Réserver 15 minutes |

### SEO (léger refresh)
| Champ | Texte |
|-------|-------|
| `seoTitle` | Droits CELI inutilisés — place restante \| Victoriaville |
| `seoDescription` | Estime la place restante dans ton CELI (droits cumulés vs plafond annuel), choisis un usage, puis clarifie en 15 min. Contenu éducatif. Conseiller en sécurité financière à Victoriaville. |

---

## 2. Soft close post-outil (microcopy dynamique)

### Si usage sélectionné
> ~{X} $ estimés · usage {urgence \| projet \| long terme}.  
> Avant de maxer pour maxer — on colle ça à ton plan en 15 minutes. Soft. Zéro pression de cotiser demain.

**CTA :** Coller un usage — 15 min  
**PDF ghost :** Garder mon résumé PDF

### Si usage pas encore choisi (placeRestante > 0)
> T’as ~{X} $ de place estimée. Choisis un usage ci-dessus — ou on le tranche ensemble en 15 minutes.

**CTA :** Trancher l’usage — 15 min

### Si dépassement / place ≤ 0
> Chiffre à vérifier avec Mon Dossier ARC. 15 minutes pour comparer l’ordre de grandeur — sans cotiser dans le vide.

**CTA :** Vérifier avec quelqu’un — 15 min

### Labels usage (chips + PDF + soft close)
| id | Label chip | Phrase soft |
|----|------------|-------------|
| `urgence` | Fonds d’urgence | fonds d’urgence |
| `projet` | Projet court terme | projet court terme |
| `long_terme` | Long terme / retraite | long terme / retraite |

---

## 3. Copy outil (`CeliDroitsTool.jsx`)

| Surface | Texte |
|---------|-------|
| Title shell | Combien de place te reste dans ton CELI ? |
| Intro | Les droits inutilisés s’accumulent. Entre ton année de naissance, ce que tu as déjà cotisé (pas le solde), et ce que tu vises cette année — on estime la place. Ensuite, tu peux coller un usage. |
| Badge defaults | Exemple — modifie pour que ce soit toi |
| Reset | Partir de zéro |
| Prompt chips | À quoi servirait cette place ? |
| Hint chips | Une intention, pas un engagement à cotiser demain. |
| Disclaimer | Illustration seulement. Plafonds approximatifs. Le vrai solde est dans [Mon Dossier ARC](lien). Pas un conseil personnalisé. |
| statusDetail (prêt + usage) | ~{X} $ estimés · usage {Y}. Compare avec ARC — ou colle le plan en 15 min. |
| statusDetail (prêt sans usage) | Estimation prête. Choisis un usage, télécharge le PDF, ou réserve 15 min. |

### Lecture branchée usage (`buildLecture` — points additionnels)
- **urgence :** « Avec ~{X} $ de place, un fonds d’urgence liquide dans le CELI peut précéder le “maxer pour maxer”. »
- **projet :** « Place estimée ~{X} $ : utile pour un projet à horizon court — sans confondre solde et droits. »
- **long_terme :** « ~{X} $ de place : horizon long / retraite possible — l’ordre avec REER se regarde au cas par cas. »
- Remplace le point string actuel « urgence, projet, long terme » quand un chip est actif.

---

## 4. FAQ (max 5) — remplacer / enrichir `faq[]`

1. **Les droits inutilisés disparaissent-ils en décembre ?**  
   Non. En général, ils s’accumulent. Le plafond annuel, c’est une tranche ; ta place totale peut être plus grande si tu n’as pas cotisé avant. Le solde officiel : Mon Dossier ARC.

2. **Où trouver mon « déjà cotisé » ?** *(NOUVEAU — friction champ #1)*  
   Dans Mon Dossier ARC (section CELI) et/ou tes relevés d’émetteur. C’est la **somme des cotisations**, pas la valeur du compte : les gains ne consomment pas de droits. Si tu as fait des retraits, l’ARC recalcule — notre outil est une estimation d’ordre de grandeur.

3. **Je dois tout maximiser cette année ?**  
   Pas forcément. Ça dépend de ta trésorerie, de tes dettes et de tes priorités. « Maxer » sans objectif, c’est une intention — pas un plan.

4. **CELI ou REER en premier ?**  
   Ça dépend de ton horizon, de ta liquidité et de ta tranche d’imposition. Voir aussi la landing retraite REER/CELI — ou 15 minutes pour trancher selon ton dossier.

5. **C’est un conseil personnalisé ?**  
   Non. Contenu éducatif et estimation illustrative. Une recommandation adaptée se fait après analyse de ta situation.

---

## 5. Ads Meta — ajustements alignement outil-first

Ads déjà solides (outil d’abord, soft RDV). **Tweaks mineurs** pour coller au sélecteur livré :

### Ad1 — Mythe plafond (garder squelette)
- Conserver mythe « juste le plafond de l’année ».
- Ajouter 1 phrase post-outil : « Sur la page, tu peux aussi coller un usage : urgence, projet, long terme — sans compte. »
- Ne **pas** reprendre « coûte cher ».

### Ad2 — Année de naissance (garder)
- OK tel quel ; CTA soft inchangé.

### Ad3 — Essaie d’abord (renforcer livré)
Remplacer la promesse vague « coller un objectif » par :
> Si après ça tu veux coller un usage (fonds d’urgence, projet court, long terme) — l’outil te laisse choisir. Ensuite, 15 minutes si tu veux. Soft. À toi.  
> Essaie d’abord. Parle ensuite — ou pas.

**Titres / descriptions Ads :** inchangés (déjà outil-first).

---

## 6. PDF — titres FR + note soft

| Avant (ASCII) | Après |
|---------------|-------|
| Resume — place restante CELI | Résumé — place restante CELI |
| Tes entrees | Tes entrées |
| Annee de naissance | Année de naissance |
| Deja cotise a vie… | Déjà cotisé à vie (cotisations) |
| Cotisation prevue… | Cotisation prévue cette année |
| Droits cumules… | Droits cumulés (estimés) |
| Place apres… | Place après cotisation |
| A retenir | À retenir |

**Section nouvelle :** Usage choisi → label chip (ou « Non choisi »).  
**Note PDF ajoutée :** « Clarifier l’usage en 15 min — soft. Pas une obligation de cotiser. »

---

## 7. Phrases interdites / à éviter

- « Ça coûte cher en silence » / coût d’opportunité non chiffré  
- « Maxe ton CELI maintenant » / rendement inventé  
- « Solde exact ARC » / « montant officiel » pour le résultat outil  
- « On va te faire cotiser » / pression  
- Confondre **solde du compte** et **droits de cotisation**

---

## 8. Critères acceptation SCRIPT

- [ ] Hero + ads parlent la même langue (place / mythe / outil d’abord)
- [ ] Soft close cite `{X} $` + usage quand dispo
- [ ] FAQ « déjà cotisé » présente
- [ ] « Clarifier ≠ cotiser demain » visible (outil ou mid)
- [ ] PDF accents FR + usage
