# Validation fiscale 2026 (Quebec + Canada)

Date de verification: 2026-04-06

## Portee
- Fichier de calcul: `frontend/src/utils/toolCalculators.js`
- Configuration fiscale centralisee: `frontend/src/utils/fiscalConfig2026.js`
- Contenu outil: `backend/update_tools.py`

## Valeurs 2026 implementees

### Impot sur le revenu (particuliers)
- Federal:
  - 14% jusqu'a 58 523
  - 20.5% jusqu'a 117 045
  - 26% jusqu'a 181 440
  - 29% jusqu'a 258 482
  - 33% au-dela
- Quebec:
  - 14% jusqu'a 54 345
  - 19% jusqu'a 108 680
  - 24% jusqu'a 132 245
  - 25.75% au-dela
- Abattement Quebec sur l'impot federal: 16.5%

### REER
- Plafond de deduction annuel utilise: 33 810
- Regle de base utilisee: 18% du revenu gagne, jusqu'au plafond annuel

### REEE
- SCEE:
  - Base 20% sur 2 500 par enfant
  - Bonification 20% jusqu'a 58 523
  - Bonification 10% jusqu'a 117 045
  - Maximum a vie: 7 200 par enfant
- IQEE:
  - Base 10% sur 2 500 par enfant
  - Bonification 10% jusqu'a 54 345
  - Bonification 5% jusqu'a 108 680
  - Maximum a vie: 3 600 par enfant
- BEC (mode estimateur simplifie):
  - 100 par enfant/an avec seuil proxy de 58 523
  - Maximum a vie: 2 000 par enfant

## Sources consultees
- [Canada.ca - Tax rates and income brackets for individuals](https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html)
- [Revenu Quebec - Taux d'imposition](https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/taux-dimposition/)
- [Canada.ca - RRSP deduction limit](https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/rrsps-related-plans/contributing-a-rrsp-prpp/contributions-affect-your-rrsp-prpp-deduction-limit.html)
- [Canada.ca - Notice #1114 (Additional CESG thresholds 2026)](https://www.canada.ca/en/employment-social-development/services/student-financial-aid/education-savings/resp/resp-promoters/bulletin/notice-2025-1114.html)

## Hypotheses et limites connues
- Les calculateurs ne remplacent pas un avis fiscal professionnel ni un calcul d'impot complet.
- Les credits d'impot non remboursables, surtaxes, prestations, cotisations sociales et situations familiales complexes ne sont pas modelises en detail.
- Le BEC est approxime par un seuil de revenu proxy pour garder une UX simple sans collecte additionnelle.
- Le rattrapage REEE est modele de facon prudente sur une annee additionnelle de droits de subvention.

## Checklist de mise a jour annuelle
1. Mettre a jour `fiscalConfig2026.js` (ou nouveau fichier annuel).
2. Ajuster les textes visibles utilisateur (`update_tools.py`) pour l'annee courante.
3. Executer les tests unitaires des calculateurs.
4. Valider des cas limites autour des paliers.
