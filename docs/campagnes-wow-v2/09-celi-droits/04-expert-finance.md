# [#09] CELI droits — Expert finances & fiscalité

**Slug :** `/campagnes/celi-droits`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Rôle :** Expert finances & fiscalité  
**Périmètre V2 :** valider **nouveaux** claims / micro-copy fold + process + motion décoratif — pas re-auditer le moteur P0 sauf drift.

---

## 1. Verdict post-P0 (1 paragraphe)

Le moteur (cumul plafonds depuis année 18 → moins cotisations à vie → min avec plafond annuel) reste **pédagogiquement OK** ; table `PLAFONDS_ANNUELS` 2009–2026 **validée ARC** (7 000 $ en 2026). Chips usage = intentions OK. Soft close soft OK. Pour Vague 2, le risque est surtout **fold décoratif** : chips `7 000 $` vs `?` et kicker « tranche » — acceptables **si** clairement non-live et si on ne fige pas 7 000 $ comme vérité éternelle sans année. Badge Exemple renforce la conformité (defaults ≠ dossier perso).

---

## 2. Nouveaux claims V2 — verdict

| Claim / surface | Verdict | Action |
|-----------------|---------|--------|
| heroExtras `Plafond année · 7 000 $` | OK **2026** illustratif | Preférer label `Plafond 2026` dans data **ou** noter en FAQ que le plafond annuel change ; ne pas dire « toujours 7 000 $ » |
| heroExtras `Place restante · ?` | Excellent | Garder `?` — interdit d’afficher 84 k$ au fold |
| Kicker « Le plafond de l’année, c’est juste une tranche. » | Exact pédagogiquement | OK |
| Process « déjà cotisé (pas le solde) » | Exact | OK — renforce anti-confusion |
| Process « intention, pas engagement » | Excellent cadre | OK |
| Process « Clarifier ≠ cotiser demain » | OK | Déjà mid — cohérence OK |
| Atmosphere CSS « place vide / slot » | Non-claim chiffré | OK |
| Motion reveal gros $ | Pas un claim | OK |
| Badge « Exemple » | Fortement recommandé | OK conformité |

---

## 3. Plafonds — rappel (inchangé)

| Année | Plafond | Statut |
|-------|---------|--------|
| 2024–2026 | 7 000 $ | OK ARC |
| Cumul max 2009→2026 | 109 000 $ | OK |
| Default 1992 → depuis 2010 | 104 000 $ cumulés ; ~84 000 $ place si déjà 20 000 $ | OK scénario Exemple |

**Fallback code 2027+ :** ne pas inventer sans source ARC ; revalider à chaque indice annuel.

---

## 4. Disclaimers — état & V2

### Déjà en outil (garder)
> Illustration seulement. Plafonds approximatifs. Le vrai solde est dans Mon Dossier ARC. Retraits non modélisés. Pas un conseil personnalisé.

### PDF notes (garder)
Retraits rétablis l’année suivante — non saisis ; cotisations ≠ valeur du compte ; ARC fait foi.

### Fold V2
Aucun disclaimer long au hero. Si kicker présent, suffisant. Ne **pas** promettre sync ARC.

---

## 5. Vocabulaire obligatoire (rappel)

| Dire | Ne pas dire |
|------|-------------|
| Place restante **estimée** | Solde ARC = X $ |
| Cotisations à vie | Solde / valeur du compte |
| Plafond **annuel** vs droits **cumulés** | « Le max CELI = 7 000 $ » sans nuance |
| Usage = intention | Allocation recommandée / % |
| Exemple / illustration | Chiffre personnel du prospect au load |

---

## 6. Ce qu’on ne promet **pas** (V2 inclus)

- Que le `7 000 $` fold = plafond futur permanent  
- Que `?` se résoudra à un montant ARC exact dans l’outil  
- Que coller un usage = conseil d’investir / cotiser  
- Rendement ou « argent qui dort = perte de X % »  
- Cumul 109 k$ comme chiffre du default 1992 (son cas = 104 k$)

---

## 7. SoftClose / mid — pas de retouche finance

Copy P0 déjà conforme (« Clarifier ≠ cotiser », estimation, soft). **Aucun** rewrite V2 requis.

---

## 8. Checklist pre-ship V2

- [ ] heroExtras plafond daté ou contextualisé année courante  
- [ ] Pas de 84 k$ au fold  
- [ ] Process hint « pas le solde » présent  
- [ ] Badge Exemple si defaults Meta restent  
- [ ] Disclaimer retraits toujours visible outil/PDF  
- [ ] Lien ARC cliquable intact  

**Note conformité cible V2 :** ≥ 9/10 si fold décoratif + Exemple + zéro claim coût.
