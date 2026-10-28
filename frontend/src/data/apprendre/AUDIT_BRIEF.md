# Brief d’audit — modules Apprendre

## Objectif
Rendre chaque module **simple et léger** pour quelqu’un **sans formation financière**, tout en restant **complet et précis**.

## Critiques à corriger
1. **Trop de listes à puces / « cartes à cocher »** — trop de `bullets` dans les sections. Préférer des **paragraphes courts**. Max **1 liste de 3–4 puces** dans tout le module (hors takeaways).
2. **Chiffres dédoublés** — les montants de l’exemple ne doivent **pas** être répétés dans les sections générales, les keyFacts, le diagram conceptuel ET l’exampleDiagram.  
   - Sections générales = explications **sans** scénario chiffré (ou un seul chiffre de plafond officiel daté si nécessaire).  
   - `workedExample` = **seul** endroit du récit chiffré détaillé.  
   - `exampleDiagram` = schéma de **cet** exemple (montants OK ici seulement).  
   - `diagram` (concept) = labels **qualitatifs**, pas les montants de l’exemple.  
   - Quiz : max **1 question** qui reprend un chiffre de l’exemple ; les 2 autres testent le concept.

## Structure cible (alléger)
- 4–5 sections max, surtout des paragraphes.
- `workedExample` : 4–5 étapes max (pas 7+).
- `takeaways` : 4 points max, phrases courtes.
- Vocabulaire accessible ; jargon expliqué à la 1re occurrence.
- Garder précision institutionnelle + `sources[]`.

## Fichier
Réécrire **uniquement** ton fichier `modules/<id>.js` (même `export const module`).
