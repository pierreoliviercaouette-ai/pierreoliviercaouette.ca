# [#01] Expert finances & fiscalité — Validation conformité

**Campagne :** `/campagnes/comparateur-rendements`  
**Signé :** Expert finances & fiscalité (QC)  
**Date :** 2026-11-04  
**Périmètre :** copy landing + outil + ads catalog + PDF notes — **pas** de conseil personnalisé, **pas** de recommandation produit.

---

## Verdict (1 paragraphe)

Le cadre éducatif est globalement sain (illustration, passés ≠ futurs, profil égal). Les risques sont : (1) le chiffre d’écart agressif sans méthodo Classique 75/75 / produits différents **adjacent** ; (2) Ad2 / module preuve « ~150 k$ » ou tout montant 20 ans **sans** date `asOf` + disclaimer ; (3) préréglages banque présentés comme « ton rendement » ; (4) PDF ASCII + notes trop courtes. Green light ship **si** les textes ci-dessous et les interdits sont respectés.

---

## 1. Ce qui est exact / OK à garder

| Élément | Statut | Note |
|---------|--------|------|
| Vocabulaire « illustration / illustratif » | OK | Garder partout (hero, écart, ads, PDF) |
| « À profil égal » = mêmes montants + même confort risque | OK | FAQ claire |
| Côté modèles = moyenne 5 ans **nette** portefeuilles modèles | OK | Toujours afficher `asOfLabel` |
| Formule capitalisation mensuelle + cotisations fin de mois | OK éducatif | Même formule des deux côtés = bonne pratique comparative |
| Préréglages banque `BANQUE_5Y_BY_PROFIL` (4,0 → 11,4) | OK **si** labellés « illustratifs » | Jamais « rendement moyen des banques canadiennes » sans source |
| Titre CSF + iA Groupe financier | Obligatoire | Ads + page + PDF |
| REER / CELI mentionnés comme contexte « à la banque » | OK | Ne pas promettre avantage fiscal dans cette campagne |

---

## 2. Chiffres & plafonds — règles de publication

### Taux modèles
- Source unique : `useModelPortfolioReturns` / `getIaPct(profil)` — **jamais** hardcoder un % dans copy marketing durable.
- Toujours préciser : **moyenne 5 ans nette**, **série Classique 75/75**, **date `asOf`**.
- Live 2026-11-04 observé : équilibré **9,2 %** au **30 juin 2026** (peut différer d’un audit antérieur ~9,6 % / oct. 2026) — les docs internes peuvent citer des ordres de grandeur ; **la page live doit être dynamique**.

### Taux banque
- Source : `getBanqueAvgForProfil` — libellé obligatoire : **préréglage illustratif** pour le profil.
- Alternative utilisateur : taux **saisi** depuis relevé — libellé « saisi — à valider avec tes relevés ».
- Ne **pas** affirmer que le préréglage = « la moyenne des banques » ou « ce que ta banque te donne ».

### Scénario 50 000 $ · 0 $/mois · 20 ans
- Autorisé comme **illustration** (post organique / Ad2 / chip / module preuve).
- Tout montant d’écart affiché doit être **calculé** avec les taux courants de la page, pas un « ~150 000 $ » figé en copy permanente **sans** « illustration · selon taux affichés · date ».
- Si copy ads cite un ordre de grandeur : « l’écart illustratif peut devenir une vraie somme » **préférable** à un $ exact stale ; si $ exact → disclaimer épinglé + « selon les taux de l’outil à la date X ».

### Écart live defaults (référence QA, pas claim pub)
- 10 k$ / 200 $ / 10 ans / équilibré / banque 6,3 % / modèles 9,2 % → écart **~12 088 $** (2026-11-04).  
- Ne pas utiliser ce chiffre dans les ads (il bougera avec `asOf`).

---

## 3. Claims risqués — Avant → Après

| Claim / zone | Risque | Correction |
|--------------|--------|------------|
| « 2–3 % de plus » comme gain attendu | Implication promesse | Toujours « points de % **illustratifs** » / « sur un relevé, ça *peut* avoir l’air d’un détail » |
| Écart $ sans « illustratif » | Sureprésentation | Label UI déjà « Écart illustratif » — **ne pas** renommer en « ton manque à gagner » / « ce que tu perds » |
| « Portefeuilles modèles » sans série | Ambiguïté produit | Ajouter Classique 75/75 dans disclaimer outil + page + PDF |
| Comparaison banque vs modèles | Apples/oranges | FAQ « pas les mêmes produits » + mention frais / structure / garanties |
| Soft close « on colle ça à ton relevé » | OK si soft | Garder « clarification / illustration → on valide ensemble » — **pas** « on va battre ta banque » |
| PDF « Resume — banque vs modeles » | Qualité + accents | FR + notes méthodo complètes |
| Module preuve sans disclaimer adjacent | Non-conformité perçue | Disclaimer **immédiatement sous** la table |

### Formulations **interdites**
- « Garanti », « sans risque », « meilleur que ta banque », « tu vas gagner X $ », « rendement futur de… »
- « Conseil personnalisé » implicite (« ce qu’il te faut », « tu dois transférer »)
- Présenter les modèles iA comme seuls véhicules ou comme recommandation
- Utiliser SCEE, droits CELI, plafonds REER dans **cette** campagne (hors sujet — risque de confusion)

---

## 4. Disclaimers obligatoires (textes finaux)

### A. Outil (`ComparateurRendementsTool` prop `disclaimer`)
Illustration seulement. Côté modèles : moyenne 5 ans nette des portefeuilles modèles iA (série Classique 75/75), selon le profil et la date affichée. Côté banque : préréglage illustratif ou taux saisi. Produits différents (frais, structure, garanties). Les taux ne sont pas garantis. Passés ≠ futurs. Pas un conseil personnalisé.

### B. Page (bas de landing — slug spécifique)
Illustration éducative. Rendements nets annualisés 5 ans côté modèles (portefeuilles modèles iA, série Classique 75/75). Préréglages bancaires illustratifs — ou taux saisi. Produits différents. Passés ≠ futurs. Pas un conseil personnalisé. Titre autorisé : conseiller en sécurité financière. Produits d’assurance de iA Groupe financier. Victoriaville.

### C. Module preuve (adjacent table)
Table illustrative à profil égal. Les % modèles suivent la moyenne 5 ans nette affichée dans l’outil (Classique 75/75). Les % banque sont des préréglages, pas ton relevé. Passés ≠ futurs. Pas un conseil personnalisé.

### D. Ads — commentaire épinglé *(garder)*
Illustration. Rendements nets annualisés 5 ans. Moyennes bancaires vs Portefeuilles Modèles iA (série Classique 75/75). Produits différents. Passés ≠ futurs. Pas un conseil personnalisé. Titre : conseiller en sécurité financière. Produits d’assurance de iA Groupe financier.

### E. PDF `notes[]` (remplacer L273–280)
1. Illustration seulement — taux non garantis. Même formule des deux côtés.  
2. Côté modèles = moyenne 5 ans nette des portefeuilles modèles iA (série Classique 75/75), selon le profil — date : `{asOfLabel}`.  
3. Taux banque = préréglage illustratif **ou** taux saisi (à valider avec les relevés).  
4. Produits différents (frais, structure, garanties) — la comparaison isole un écart de rendement illustratif, pas une recommandation.  
5. Passés ≠ futurs. Pas un conseil personnalisé. Titre : conseiller en sécurité financière.

---

## 5. Alignement copy experts (corrections ciblées)

| Livrable | Point à respecter |
|----------|-------------------|
| Visuel — module preuve | Chiffre 20 ans **live** + disclaimer C adjacent |
| Script — Ad2 | Préférer formulation « vraie somme » ; si $ exact → renvoyer à l’outil + disclaimer D |
| Script — soft close | « écart illustratif » + « zéro pression » + pas « battre la banque » |
| Outil — narration « 2–3 % » | OK si suivi de « illustration montre ≈ {écart} » |
| Outil — chip mythe | Label « (mythe) » / « illustration du post » OK — pas « preuve que tu perds 150 k$ » |

---

## 6. Checklist conformité avant ship

- [ ] Aucun claim de rendement futur garanti sur page, ads, PDF.
- [ ] « Écart illustratif » partout (UI + soft close + PDF).
- [ ] Classique 75/75 + `asOf` visibles (outil et/ou disclaimer).
- [ ] FAQ « mêmes produits ? » + « d’où viennent les taux ? » en ligne.
- [ ] Préréglage banque ≠ « ton taux réel » sans mention saisie possible.
- [ ] Titre CSF + iA sur page et ads.
- [ ] Soft close = clarification relevé, pas pitch transfert.
- [ ] Montants 20 ans non stale en copy permanente.

---

## 7. Fichiers à toucher (finance / légal copy)

| Fichier | Quoi |
|---------|------|
| `ComparateurRendementsTool.jsx` | `disclaimer`, PDF `notes`, titres sections FR |
| `campagneAdsLandings.js` | faq×2 nouvelles, disclaimer page si champ dédié |
| `CampagneAdsLanding.jsx` | disclaimer bas si slug-specific |
| `emails/campagne-meta-catalog/comparateur-rendements.md` | Ad2 + garder épinglé |
| Module preuve (si ajouté) | disclaimer C adjacent |

**Risque résiduel accepté :** toute projection composée peut être perçue comme « pub agressive » — mitigé par FAQ + disclaimer + ton « on valide ensemble ». Ne **pas** augmenter l’agressivité du claim pour « forcer » le book.
