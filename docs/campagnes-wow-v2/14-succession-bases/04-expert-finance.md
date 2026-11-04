# [#14] Succession — bases — Expert finances & fiscalité (QC)

**Slug :** `/campagnes/succession-bases`  
**Vague :** 2 (post-P0)  
**Date :** 2026-11-04  
**Périmètre :** valider **nouveaux** claims / modules P1 Vague 2 (pas re-auditer tout le P0)  
**Sources :** outil post-P0, landing, ads, rebuild finance, spec V2 visuel/script/outil

---

## Rescore post-P0 (conformité)

| Dimension | Après P0 | Cible V2 |
|-----------|----------|----------|
| Frontière CSF \| notaire | 8 (FAQ + SoftClose + next-step) | 9 (module visuel explicite) |
| Risque claims chiffrés | 9 (aucun simulateur) | 9 (garder No-go) |
| Disclaimers | 9 | 9 |

**Top 1 risque V2 :** le module CSF \| Notaire et les chips fold pourraient **trop** coller CSF au « juridique » si la copy droite est faible — le script proposé est **Go**.

---

## Verdict (1 paragraphe)

P0 a renforcé la frontière métiers sans inventer de chiffres. Vague 2 ajoute atmosphère « dossier », process, portrait, et un **split CSF \| Notaire** : conforme **si** la colonne notaire reste explicite et qu’on ne promet pas d’acte / succession « réglée ». Aucun nouveau plafond, matching ou écart $ à valider — le climax reste checklist qualitative. **No-go** inchangé : simulateur liquidité $ / impôts décès.

---

## Nouveaux éléments V2 — Go / No-go

| Élément V2 | Claim implicite | Verdict |
|------------|-----------------|---------|
| Atmosphere CSS « dossier » | Sujet documents / clarté | **Go** — pas funéraire |
| Chip `Liquidité ≠ papier` | Maison/REER ≠ cash premiers mois | **Go** — exact éducatif |
| Chip `CSF · Notaire` | Deux acteurs | **Go** — à condition module + FAQ #1 |
| Process step 3 « 15 min CSF ou notaire » | Choix selon trou | **Go** — ne pas lire « ou = CSF fait le notarial » |
| Module gauche CSF | Liquidité, revenu/dettes, bénéficiaires | **Go** — cœur permis CSF |
| Module droite notaire | Testament / cadre légal | **Go** — obligatoire |
| Portrait mid `/seo/portrait.jpg` | Identité CSF Victoriaville | **Go** — titre exact |
| Trous typo XXL | Urgence douce visuelle | **Go** — pas de montant inventé |
| SoftClose tone warn | Cases vides | **Go** — copy P0 déjà OK |
| Simulateur liquidité $ / impôts | Précision fausse | **No-go** |
| « On finalise ta succession » | Faux + hors permis | **No-go** |
| Retirer Scale / disclaimer notaire | Allègement trompeur | **No-go** |

---

## Finance / conformité

### Claims OK (V2)

- Liquidité ≠ patrimoine sur papier  
- Bénéficiaires contrats (vie, REER, CELI, collective) = volet CSF  
- Testament / cadre légal = notaire  
- Clarifier ≠ acheter  
- 15 min = découverte / priorisation, pas acte notarié  

### Interdits

- Impliquer que le CSF rédige ou valide un testament  
- « Succession en ordre » après checklist ou RDV  
- Montants d’impôt au décès, droits successoraux, liquidité minimale universelle  
- Collective / police = montant garanti  
- Imagerie ou copy funéraire choc  

### Disclaimers (checklist ship V2)

- [ ] Shell outil : éducatif + ne remplace pas notaire / avis juridique *(déjà)*  
- [ ] Bloc Scale dans l’outil *(déjà)*  
- [ ] Module CSF \| Notaire : phrase « ne remplace pas » côté notaire *(script V2)*  
- [ ] Pied landing + ads inchangés  
- [ ] SoftClose P0 : testament = notaire *(déjà — ne pas diluer)*  
- [ ] FAQ #1 notaire en tête *(déjà)*  

---

## Vocabulaire QC — rappel V2

| Préférer | Éviter |
|----------|--------|
| Conseiller en sécurité financière | Planificateur successoral / « on s’occupe du testament » |
| Liquidité / argent accessible | Cash héritage garanti |
| Bénéficiaires désignés | « Héritiers » seul |
| Cadre légal / notaire | « On formalise chez nous » |

---

## Impacts sur les 3 autres experts

| Expert | Contrainte |
|--------|------------|
| Visuel | Split 2 colonnes obligatoire ; pas de rouge « mort » ; pas photo funéraire |
| Script | Process step 3 + module doivent nommer notaire ; chips OK |
| Outil | Amplification Trous OK sans $ ; SoftClose `ToolSoftClose` only |

---

## Hors scope

- Revue fiscale simulateur (toujours No-go sprint)  
- Commit / code
