# [#04] Expert finances & fiscalité — Assurance invalidité

**Slug :** `/campagnes/assurance-invalidite`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Juridiction :** Québec / Canada (salarié, assurance collective employeur)  
**Périmètre :** **nouveaux** claims / champs / micro-copy Vague 2 seulement  
**Différenciation :** ≠ #06 maladie grave · ≠ #11 collective carte · ≠ #12 autonome

---

## 1. Verdict conformité post-P0

P0 a corrigé le risque majeur (`!gapWarn` → définition/durée, pas « t’es correct ») + disclaimers PDF/RDV. Vague 2 n’ajoute **pas** de formule ni de plafond fiscal. Nouveautés à valider = micro-signaux fold (`Livret · paie · délai`, chips `% remplacé` / `Jours d’attente`), process strip, tone SoftClose `warn`, pulse ambre, typo plus grande sur écarts illustratifs. **GO** si on garde le cadrage éducatif.

---

## 2. Nouveaux éléments V2 — GO / NO-GO

| Élément V2 | Décision | Condition |
|------------|----------|-----------|
| Atmosphere CSS livret/paie (pas photo) | **GO** | Aucune implication « vraie paie / vrai contrat scanné » |
| Kicker `Livret · paie · délai` | **GO** | Vocabulaire sujet, pas claim |
| Chips `% remplacé` · `Jours d’attente` | **GO** | Labels de concepts — pas « 60 % » / « 90 j » figés dans le hero |
| Process `4 chiffres → trou + coussin → livret en 15 min` | **GO** | Promet lecture livret, pas produit |
| SoftClose sous duo (même copy P0) | **GO** | Placement UX ≠ nouveau claim |
| `tone="warn"` SoftClose | **GO** | Signal UI ; ne pas écrire « alerte couverture insuffisante » |
| Pulse ambre chiffres | **GO** | Motion ; montants restent illustratifs |
| Typo text-3xl/4xl sur trou/coussin | **GO** | Échelle visuelle ; `~` / formatCad déjà approx |
| Portrait + libellé CSF catalogue | **GO** | Titre autorisé ; pas « expert invalidité certifié » custom |
| Chip hero avec montants defaults (500 $ / 9 600 $) | **NO-GO** | Ressemble à une statistique client |
| Emeraude SoftClose `tone="ok"` si marge ≥ 0 | **NO-GO** | Fausse sécurité (définition/durée) |
| Hint net vs brut dans hero | **Hors V2** | Option P1 FAQ seulement |

---

## 3. Rappels exactitude (inchangés, toujours vrais)

| Concept | Dire | Ne pas dire |
|---------|------|-------------|
| % | Part remplacée — souvent 50–70 %, **ton livret** | « 60 % standard » / « on te garantit X % » |
| Délai | Souvent 30 / 90 / 120 — teste | « C’est toujours 90 jours » |
| Trou | Dépenses − prestation illustrée | Preuve d’insuffisance contractuelle |
| Coussin | `(jours/30)×dépenses` approx éducative | Budget formel / exigence réglementaire |
| Définition | « ta job » vs « n’importe quelle job » (vulgarisation) | Avis juridique sur le contrat |
| Base net | Outil pédagogique sur **net** | Affirmer que le livret part du net |

Defaults dramatiques (500 $ / 9 600 $) : **OK** préremplis **dans l’outil** avec hint livret ; **interdit** comme claim ads / heroExtras.

---

## 4. Disclaimers — état

| Surface | Statut V2 |
|---------|-----------|
| Outil shell | Garder : éducatif + valide avec ton livret |
| SoftClose | Garder sublines P0 (livret / définition) |
| PDF notes | Garder + « aucun % promis » |
| Mid / ads | Garder |
| Hero atmosphere | Pas de disclaimer extra si copy reste non-promesse |

**Fiscalité :** ne pas ajouter de règle prime employeur / impôt prestations en V2.

---

## 5. Ce qu’on ne promet toujours pas

1. % de remplacement garanti ou « typique pour tous »  
2. Qu’une individuelle comble automatiquement le trou  
3. Que marge $ ≥ 0 = couverture réelle  
4. Durée / définition / acceptation médicale  
5. Que l’outil remplace le livret  
6. Délais universels  
7. Confusion avec maladie grave (#06) ou checklist #11  

---

## 6. Checklist review copy V2

- [ ] `heroExtras` sans montants / sans « 60 % » / « 90 j » présentés comme norme  
- [ ] Process promet « livret en 15 min » (éducation), pas « on te vend une police »  
- [ ] SoftClose copy P0 intacte (gapWarn / !gapWarn)  
- [ ] Pas de `tone="ok"` SoftClose sur marge  
- [ ] Portrait = titre CSF catalogue seulement  
- [ ] Différenciation MG toujours en FAQ  
- [ ] Defaults outil = exemple ajustable (hint existant)

---

## 7. Note PM

Vague 2 = **chrome + placement** ; conformité reste portée par copy P0. Priorité finance = empêcher les micro-signaux hero de figer 60 % / 90 j comme vérité, et bloquer SoftClose émeraude. Ship V2 **GO** sous ces gardes.
