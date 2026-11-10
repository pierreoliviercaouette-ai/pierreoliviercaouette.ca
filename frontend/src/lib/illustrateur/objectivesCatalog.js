export const OBJECTIVE_CATEGORIES = [
  {
    id: 'famille',
    label: 'Famille',
    items: [
      { id: 'marier', label: 'Se marier/s’unir (conjoint de fait)' },
      { id: 'enfants', label: 'Avoir des enfants' },
      { id: 'etudes_enfants', label: 'Financer les études des enfants' },
      { id: 'propriete', label: 'Acheter/vendre une propriété' },
      { id: 'cohabitation', label: 'Prévoir une cohabitation' },
      { id: 'projets_speciaux', label: 'Projets spéciaux' },
    ],
  },
  {
    id: 'travail',
    label: 'Travail',
    items: [
      { id: 'investir_carriere', label: 'Investir dans sa carrière' },
      { id: 'reprendre_etudes', label: 'Reprendre les études' },
      { id: 'promotion', label: 'Obtenir une promotion' },
      { id: 'changer_carriere', label: 'Changer de carrière' },
      { id: 'retirer_marche', label: 'Se retirer du marché du travail' },
      { id: 'retour_marche', label: 'Retourner sur le marché du travail' },
      { id: 'entreprise', label: 'Acheter/vendre une entreprise ou un commerce' },
    ],
  },
  {
    id: 'finances',
    label: 'Finances',
    items: [
      { id: 'diminuer_impots', label: 'Diminuer les impôts' },
      { id: 'revoir_placements', label: 'Revoir les placements actuels' },
      { id: 'rembourser_dettes', label: 'Rembourser les dettes' },
      { id: 'pret_etudiant', label: 'Rembourser le prêt/marge étudiant' },
      { id: 'securite_financiere', label: 'Réduire l’insécurité relative aux finances' },
      { id: 'fonds_urgence', label: 'Constituer un fonds d’urgence' },
      { id: 'methode_epargne', label: 'Revoir la méthode d’épargne' },
      { id: 'maximiser_fiscal', label: 'Maximiser fiscalement les revenus de placement' },
    ],
  },
  {
    id: 'loisirs',
    label: 'Loisirs',
    items: [
      { id: 'voyages', label: 'Planifier des voyages, sports et loisirs' },
      { id: 'benevolat', label: 'Faire du bénévolat' },
      { id: 'associations', label: 'S’engager dans des associations' },
    ],
  },
  {
    id: 'retraite',
    label: 'Retraite',
    items: [
      { id: 'age_retraite', label: 'Prévoir l’âge de retraite' },
      { id: 'niveau_vie', label: 'Maintenir le niveau de vie' },
      { id: 'inflation', label: 'Se protéger contre l’inflation' },
      { id: 'domicile', label: 'Rester à domicile le plus longtemps possible' },
      { id: 'occupation', label: 'Prévoir une occupation pour la retraite' },
      { id: 'propriete_retraite', label: 'Conserver, vendre ou transférer une propriété' },
      { id: 'diversifier_revenus', label: 'Diversifier vos sources de revenu' },
    ],
  },
  {
    id: 'protections',
    label: 'Protections',
    items: [
      { id: 'rembourser_deces', label: 'Rembourser les emprunts en cas de décès' },
      { id: 'depenses_deces', label: 'Prévoir les dépenses liées au décès' },
      { id: 'niveau_vie_deces', label: 'Maintenir le niveau de vie familial en cas de décès' },
      { id: 'heritage', label: 'Léguer un héritage' },
      { id: 'impots_deces', label: 'Prévoir les impôts au décès' },
      { id: 'dons', label: 'Planifier des dons' },
      { id: 'testament', label: 'Rédiger un testament' },
      { id: 'av_enfants', label: 'Prévoir une assurance vie pour enfant(s)' },
      { id: 'mandat', label: 'Rédiger un mandat de protection' },
      { id: 'niveau_vie_invalidite', label: 'Maintenir le niveau de vie en cas d’invalidité' },
      { id: 'niveau_vie_mg', label: 'Maintenir le niveau de vie en cas de maladie grave' },
      { id: 'frais_maladie', label: 'Couvrir les frais associés à la maladie' },
      { id: 'mg_enfants', label: 'Prévoir une couverture pour enfant(s) en cas de maladie grave' },
    ],
  },
  {
    id: 'autre',
    label: 'Autre',
    items: [],
  },
];

export function isObjectiveSelected(objectives, categoryId, objectiveId) {
  return (objectives || []).some((o) => o.categoryId === categoryId && o.objectiveId === objectiveId);
}

export function toggleObjective(objectives, categoryId, objectiveId, customLabel) {
  const list = Array.isArray(objectives) ? [...objectives] : [];
  const idx = list.findIndex((o) => o.categoryId === categoryId && o.objectiveId === objectiveId);
  if (idx >= 0) {
    list.splice(idx, 1);
    return list;
  }
  list.push({ categoryId, objectiveId, customLabel: customLabel || undefined });
  return list;
}
