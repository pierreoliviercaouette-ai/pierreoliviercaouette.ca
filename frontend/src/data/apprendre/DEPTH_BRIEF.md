# Brief — approfondir les modules (information utile)

## Problème
Les capsules **survolent** et citent trop les **avis AMF / IQPF / iA** (« Selon l’AMF… », « L’IQPF recommande… »). Le lecteur veut des **faits utiles pour un individu**, pas un résumé d’autorités.

## Objectif
Réécrire le module pour qu’il soit **informationnel et concret** : mécanismes, règles, ordres de grandeur, pièges, décisions typiques — toujours **simple** pour quelqu’un sans formation financière.

## Règles de contenu
1. **Expliquer le mécanisme** (comment ça marche vraiment), pas seulement « à quoi ça sert ».
2. **Priorité à l’individu** : droits, impôts, retraits, primes, délais, qui paie / qui reçoit, quoi vérifier sur un relevé ou un contrat.
3. **Peu ou pas de méta-citations** dans le corps. Interdit ou rare : « Selon l’AMF… », « L’IQPF souligne… », « iA rappelle… ».  
   - Les règles restent **exactes** (ARC, RQ, lois).  
   - Les `sources[]` en bas restent ; on ne les récite pas dans chaque paragraphe.
4. **Profondeur** : 4–5 sections, **2–4 paragraphes** utiles chacune (pas 1 phrase vague). Inclure au moins : définition claire, fonctionnement, cas fréquents / pièges, place dans une situation réelle.
5. Garder le brief d’audit :
   - Max **1 liste de 3–4 puces** (hors takeaways).
   - Chiffres d’exemple **uniquement** dans `workedExample` + `exampleDiagram` (+ 1 quiz).
   - Plafonds / taux **officiels datés** OK dans le corps (ex. plafond CELI 2026).
   - Titres de section **sans** préfixe `1.` `2.` (la page numérote déjà).
   - 4 takeaways max ; quiz 3 questions (1 chiffrée max).
6. Vocabulaire accessible ; jargon expliqué à la 1ʳᵉ occurrence.
7. Toujours éducatif, pas un conseil personnalisé (1 phrase discrète suffit).

## Fichier
Réécrire **uniquement** `modules/<id>.js` (même `export const module`). Conserver `id`, audiences, diagrammes (labels cohérents avec le nouveau texte).
