/** Catalogue aligné sur « Outil de budget.xlsx » (feuilles + Textes FR). */

export const BUDGET_FREQUENCIES = [
  { value: 'annuel', label: 'Annuel', perYear: 1 },
  { value: 'mensuel', label: 'Mensuel', perYear: 12 },
  { value: 'bimensuel', label: 'Bi-mensuel', perYear: 24 },
  { value: 'bihebdo', label: '2 semaines', perYear: 26 },
  { value: 'hebdo', label: 'Hebdo.', perYear: 52 },
  { value: 'quotidien', label: 'Quot.', perYear: 365 },
];

export function frequencyPerYear(freq) {
  return BUDGET_FREQUENCIES.find((f) => f.value === freq)?.perYear || 1;
}

export const BUDGET_CATEGORIES = [
  {
    id: 'residence',
    label: 'Résidence',
    lines: [
      { id: 'hypotheque_bail', label: 'Hypothèque / Bail', defaultFreq: 'mensuel' },
      { id: 'copropriete', label: 'Frais de copropriété', defaultFreq: 'mensuel' },
      { id: 'electricite', label: 'Électricité / Chauffage', defaultFreq: 'mensuel' },
      { id: 'telecom', label: 'Téléphone / Télévision / Internet', defaultFreq: 'mensuel' },
      { id: 'taxes_mun', label: 'Taxes municipales / Scolaires', defaultFreq: 'annuel' },
      { id: 'ameublement', label: 'Ameublement (achat et réparation)', defaultFreq: 'mensuel' },
      { id: 'reparations', label: 'Réparations / Améliorations', defaultFreq: 'mensuel' },
      { id: 'residence_sec', label: 'Résidence secondaire', defaultFreq: 'mensuel' },
      { id: 'residence_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
  {
    id: 'personnelles',
    label: 'Personnelles',
    lines: [
      { id: 'epicerie', label: 'Épicerie', defaultFreq: 'mensuel' },
      { id: 'garderie', label: 'Frais de garderie / Scolaire', defaultFreq: 'mensuel' },
      { id: 'medicaments', label: 'Médicaments / Suppléments', defaultFreq: 'mensuel' },
      { id: 'dentaire', label: 'Soins dentaires', defaultFreq: 'annuel' },
      { id: 'ortheses', label: 'Prothèses / Orthèses', defaultFreq: 'mensuel' },
      { id: 'esthetique', label: 'Soins esthétiques', defaultFreq: 'mensuel' },
      { id: 'coiffure', label: 'Coiffure', defaultFreq: 'mensuel' },
      { id: 'vetements', label: 'Vêtements', defaultFreq: 'annuel' },
      { id: 'entretien_menager', label: 'Entretien ménager', defaultFreq: 'annuel' },
      { id: 'perso_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    lines: [
      { id: 'auto_paiement', label: 'Paiement automobile', defaultFreq: 'mensuel' },
      { id: 'motorise', label: 'Paiement motorisé / bateau / moto / VTT', defaultFreq: 'mensuel' },
      { id: 'permis', label: 'Permis / Immatriculation', defaultFreq: 'annuel' },
      { id: 'essence', label: 'Essence / Recharge', defaultFreq: 'mensuel' },
      { id: 'entretien_auto', label: 'Entretien / Réparations', defaultFreq: 'annuel' },
      { id: 'stationnement', label: 'Stationnement', defaultFreq: 'annuel' },
      { id: 'taxi_bus', label: 'Taxis / Autobus', defaultFreq: 'mensuel' },
      { id: 'transport_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
  {
    id: 'assurance_epargne',
    label: 'Assurance et épargne',
    lines: [
      { id: 'ass_auto_hab', label: 'Assurance auto et habitation', defaultFreq: 'mensuel' },
      { id: 'ass_vie', label: 'Assurance vie', defaultFreq: 'mensuel' },
      { id: 'ass_mg', label: 'Assurance maladie grave / Soins longue durée', defaultFreq: 'mensuel' },
      { id: 'ass_invalidite', label: 'Assurance invalidité', defaultFreq: 'mensuel' },
      { id: 'reer', label: 'REER', defaultFreq: 'mensuel' },
      { id: 'reee', label: 'REEE', defaultFreq: 'mensuel' },
      { id: 'epargne_placements', label: 'Épargne / Placements', defaultFreq: 'mensuel' },
      { id: 'epargne_non_enr', label: 'Épargne non-enregistrée', defaultFreq: 'mensuel' },
      { id: 'ass_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
  {
    id: 'dettes',
    label: 'Dettes',
    lines: [
      { id: 'cartes', label: 'Cartes de crédit', defaultFreq: 'mensuel' },
      { id: 'marge', label: 'Marge de crédit', defaultFreq: 'mensuel' },
      { id: 'prets_perso', label: 'Prêts personnels', defaultFreq: 'mensuel' },
      { id: 'impots', label: 'Impôts fédéral et provincial', defaultFreq: 'mensuel' },
      { id: 'pension_alim', label: 'Pension alimentaire', defaultFreq: 'mensuel' },
      { id: 'pret_etudiant', label: 'Prêt étudiant', defaultFreq: 'mensuel' },
      { id: 'dettes_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
  {
    id: 'loisirs',
    label: 'Loisirs',
    lines: [
      { id: 'voyages', label: 'Voyages (incluant assurances)', defaultFreq: 'annuel' },
      { id: 'restaurant', label: 'Restaurant', defaultFreq: 'mensuel' },
      { id: 'divertissement', label: 'Divertissement (cinéma, théâtre, jeux)', defaultFreq: 'mensuel' },
      { id: 'abonnements', label: 'Abonnements', defaultFreq: 'mensuel' },
      { id: 'camping', label: 'Camping / Chasse / Pêche', defaultFreq: 'annuel' },
      { id: 'sport', label: 'Sport et équipement', defaultFreq: 'mensuel' },
      { id: 'livres', label: 'Livres / Revues / Journaux / Musique', defaultFreq: 'mensuel' },
      { id: 'loisirs_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
  {
    id: 'diverses',
    label: 'Diverses',
    lines: [
      { id: 'tabac_alcool', label: 'Tabac / Alcool / Loterie', defaultFreq: 'mensuel' },
      { id: 'cadeaux', label: 'Cadeaux', defaultFreq: 'mensuel' },
      { id: 'argent_poche', label: 'Argent de poche', defaultFreq: 'mensuel' },
      { id: 'dons', label: 'Don', defaultFreq: 'mensuel' },
      { id: 'animaux', label: 'Animaux', defaultFreq: 'mensuel' },
      { id: 'imprevus', label: 'Imprévus', defaultFreq: 'mensuel' },
      { id: 'divers_autre', label: 'Autres', defaultFreq: 'mensuel', custom: true },
    ],
  },
];

export function emptyBudgetState() {
  const lines = {};
  for (const cat of BUDGET_CATEGORIES) {
    for (const line of cat.lines) {
      lines[line.id] = {
        amount: 0,
        frequency: line.defaultFreq || 'mensuel',
        label: line.custom ? '' : undefined,
        scenarioToday: 0,
        scenarioDisability: 0,
        scenarioDeath: 0,
      };
    }
  }
  return {
    mode: 'individuel', // individuel | communs
    viewFrequency: 'mensuel',
    netIncomeAnnual: 0,
    lines,
  };
}
