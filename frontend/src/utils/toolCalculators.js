// Comprehensive Financial Tool Calculators for Quebec
// Fiscal constants are centralized in fiscalConfig2026.js
import { INCOME_TAX_2026, REEE_2026, REER_2026 } from './fiscalConfig2026';
import {
  getBanqueAvgForProfil,
  getIaPctForProfil,
  PROFIL_RISQUE_LABELS,
} from '../data/comparateurRendementsRates';

// =============================================================================
// Tax rate tables — Quebec + Federal 2026 (see fiscalConfig2026.js)
// =============================================================================

const FEDERAL_BRACKETS = INCOME_TAX_2026.federalBrackets;
const QUEBEC_BRACKETS = INCOME_TAX_2026.quebecBrackets;
const QUEBEC_ABATEMENT = INCOME_TAX_2026.quebecAbatement;

// SCHL premium rates by loan-to-value ratio (insured mortgages).
const SCHL_RATES = [
  { minLTV: 0.95, maxLTV: 1.00, rate: 0.04 },
  { minLTV: 0.90, maxLTV: 0.95, rate: 0.031 },
  { minLTV: 0.85, maxLTV: 0.90, rate: 0.028 },
  { minLTV: 0.80, maxLTV: 0.85, rate: 0.024 },
  { minLTV: 0, maxLTV: 0.80, rate: 0 }
];

const MAX_INSURABLE_PROPERTY_VALUE = 1500000;

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

// Calculate marginal tax rate (federal)
const getFederalMarginalRate = (income) => {
  for (const bracket of FEDERAL_BRACKETS) {
    if (income <= bracket.max) return bracket.rate;
  }
  return FEDERAL_BRACKETS[FEDERAL_BRACKETS.length - 1].rate;
};

// Calculate marginal tax rate (Quebec)
const getQuebecMarginalRate = (income) => {
  for (const bracket of QUEBEC_BRACKETS) {
    if (income <= bracket.max) return bracket.rate;
  }
  return QUEBEC_BRACKETS[QUEBEC_BRACKETS.length - 1].rate;
};

// Calculate combined marginal rate (Federal effective + Quebec)
const getCombinedMarginalRate = (income) => {
  const federalRate = getFederalMarginalRate(income);
  const quebecRate = getQuebecMarginalRate(income);
  const federalEffective = federalRate * (1 - QUEBEC_ABATEMENT);
  return federalEffective + quebecRate;
};

// Calculate total federal tax
const calculateFederalTax = (income) => {
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of FEDERAL_BRACKETS) {
    const taxableInBracket = Math.min(remainingIncome, bracket.max - (bracket.min || 0));
    if (taxableInBracket <= 0) break;
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  // Apply Quebec abatement
  return tax * (1 - QUEBEC_ABATEMENT);
};

// Calculate total Quebec tax
const calculateQuebecTax = (income) => {
  let tax = 0;
  let remainingIncome = income;
  
  for (const bracket of QUEBEC_BRACKETS) {
    const taxableInBracket = Math.min(remainingIncome, bracket.max - (bracket.min || 0));
    if (taxableInBracket <= 0) break;
    tax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
  }
  
  return tax;
};

// Calculate SCHL premium
const calculateSCHLPremium = (loanAmount, propertyValue) => {
  const ltv = loanAmount / propertyValue;
  // Boundary-safe mapping so 95% and 90% LTV are handled correctly.
  if (ltv >= 0.95) return loanAmount * 0.04;
  if (ltv >= 0.90) return loanAmount * 0.031;
  if (ltv >= 0.85) return loanAmount * 0.028;
  if (ltv > 0.80) return loanAmount * 0.024;
  for (const rate of SCHL_RATES) { // fallback to table for future edits
    if (ltv >= rate.minLTV && ltv <= rate.maxLTV) return loanAmount * rate.rate;
  }
  return 0;
};

const calculateMinimumDownPayment = (propertyValue) => {
  if (propertyValue <= 0) return 0;
  if (propertyValue <= 500000) return propertyValue * 0.05;
  if (propertyValue <= MAX_INSURABLE_PROPERTY_VALUE) {
    return 500000 * 0.05 + (propertyValue - 500000) * 0.10;
  }
  return propertyValue * 0.20;
};

// Future value calculation
const futureValue = (presentValue, rate, years) => {
  return presentValue * Math.pow(1 + rate, years);
};

// PMT calculation (loan payment)
const calculatePMT = (principal, annualRate, years, paymentsPerYear = 12) => {
  const periodicRate = annualRate / paymentsPerYear;
  const totalPayments = years * paymentsPerYear;
  
  if (periodicRate === 0) return principal / totalPayments;
  
  return principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments)) / 
         (Math.pow(1 + periodicRate, totalPayments) - 1);
};

// =============================================================================
// 1. BUDGET MENSUEL COMPLET
// =============================================================================
export const calculateBudget = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  // Revenus
  const salaire = get('salaire');
  const revenusSecondaires = get('revenus_sec');
  const allocations = get('allocations');
  const autresRevenus = get('autres_rev');
  const totalRevenus = salaire + revenusSecondaires + allocations + autresRevenus;
  
  // Revenus annuels bruts estimés (pour calculs fiscaux)
  const revenuAnnuelBrut = salaire * 12 / 0.7; // Estimation brut à partir du net
  
  // Logement
  const loyer = get('loyer');
  const electricite = get('electricite');
  const assuranceHab = get('assur_hab');
  const taxesMunicipales = get('taxes');
  const telecom = get('telecom');
  const totalLogement = loyer + electricite + assuranceHab + taxesMunicipales + telecom;
  
  // Transport
  const paiementAuto = get('auto_paiement');
  const essence = get('essence');
  const assuranceAuto = get('assur_auto');
  const entretienAuto = get('entretien_auto');
  const transportCommun = get('transport_commun');
  const totalTransport = paiementAuto + essence + assuranceAuto + entretienAuto + transportCommun;
  
  // Alimentation & Quotidien
  const epicerie = get('epicerie');
  const restaurants = get('restaurants');
  const vetements = get('vetements');
  const soins = get('soins');
  const totalQuotidien = epicerie + restaurants + vetements + soins;
  
  // Santé & Assurances
  const assuranceVie = get('assur_vie');
  const assuranceMaladie = get('assur_maladie');
  const medicaments = get('medicaments');
  const dentiste = get('dentiste');
  const totalSante = assuranceVie + assuranceMaladie + medicaments + dentiste;
  
  // Dettes
  const carteCredit = get('carte_credit');
  const pretEtudiant = get('pret_etudiant');
  const margeCredit = get('marge');
  const pensionAlimentaire = get('pension');
  const totalDettes = carteCredit + pretEtudiant + margeCredit + pensionAlimentaire;
  
  // Épargne
  const reer = get('reer');
  const celi = get('celi');
  const reee = get('reee');
  const fondsUrgence = get('urgence');
  const totalEpargne = reer + celi + reee + fondsUrgence;
  
  // Loisirs
  const abonnements = get('abonnements');
  const loisirs = get('loisirs');
  const vacances = get('vacances');
  const cadeaux = get('cadeaux');
  const totalLoisirs = abonnements + loisirs + vacances + cadeaux;
  
  // Calculs totaux
  const totalDepenses = totalLogement + totalTransport + totalQuotidien + totalSante + totalDettes + totalLoisirs;
  const soldeDisponible = totalRevenus - totalDepenses - totalEpargne;
  
  // Ratios financiers
  const tauxEpargne = totalRevenus > 0 ? (totalEpargne / totalRevenus * 100) : 0;
  const ratioLogement = totalRevenus > 0 ? (totalLogement / totalRevenus * 100) : 0;
  const ratioEndettement = totalRevenus > 0 ? (totalDettes / totalRevenus * 100) : 0;
  
  // Économie d'impôt REER
  const tauxMarginal = getCombinedMarginalRate(revenuAnnuelBrut);
  const economieImpotREER = reer * 12 * tauxMarginal;
  
  // Conseil personnalisé
  let conseil = '';
  let sante_financiere = '';
  
  if (soldeDisponible < 0) {
    conseil = '⚠️ ATTENTION: Vos dépenses dépassent vos revenus de ' + Math.abs(soldeDisponible).toLocaleString() + ' $. Révisez vos dépenses en priorité.';
    sante_financiere = 'critique';
  } else if (tauxEpargne < 10) {
    conseil = '💡 Votre taux d\'épargne de ' + tauxEpargne.toFixed(0) + '% est sous la recommandation de 15-20%. Essayez d\'augmenter vos cotisations REER/CELI.';
    sante_financiere = 'attention';
  } else if (ratioLogement > 35) {
    conseil = '🏠 Vos coûts de logement représentent ' + ratioLogement.toFixed(0) + '% de vos revenus. La norme recommandée est de max 30-35%.';
    sante_financiere = 'attention';
  } else if (tauxEpargne >= 20) {
    conseil = '✨ Excellent! Votre taux d\'épargne de ' + tauxEpargne.toFixed(0) + '% est au-dessus des recommandations. Vous êtes sur la bonne voie!';
    sante_financiere = 'excellent';
  } else {
    conseil = '👍 Votre budget est équilibré avec un taux d\'épargne de ' + tauxEpargne.toFixed(0) + '%. Continuez à optimiser!';
    sante_financiere = 'bon';
  }
  
  return {
    // Revenus
    total_revenus: totalRevenus,
    
    // Dépenses par catégorie
    total_logement: totalLogement,
    total_transport: totalTransport,
    total_quotidien: totalQuotidien,
    total_sante: totalSante,
    total_dettes: totalDettes,
    total_loisirs: totalLoisirs,
    total_epargne: totalEpargne,
    
    // Résumé
    res_revenus: totalRevenus,
    res_depenses: totalDepenses,
    res_epargne: totalEpargne,
    res_solde: soldeDisponible,
    
    // Ratios
    taux_epargne: tauxEpargne,
    ratio_logement: ratioLogement,
    ratio_endettement: ratioEndettement,
    
    // Fiscal
    economie_reer: economieImpotREER,
    taux_marginal: (tauxMarginal * 100),
    
    // Conseil
    conseil,
    sante_financiere
  };
};

// =============================================================================
// 2. SIMULATEUR REER QUÉBEC
// =============================================================================
export const calculateREER = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  const revenuBrut = get('revenu');
  const cotisation = get('cotisation');
  const situation = values['situation'] || 'celibataire';
  const enfants = parseInt(values['enfants']) || 0;
  
  // Calcul des droits de cotisation max (18% du revenu, plafonné selon année fiscale)
  const droitsMax = Math.min(revenuBrut * REER_2026.contributionRate, REER_2026.deductionLimitMax);
  
  // Taux marginaux
  const tauxFederal = getFederalMarginalRate(revenuBrut);
  const tauxQuebec = getQuebecMarginalRate(revenuBrut);
  const tauxFederalEffectif = tauxFederal * (1 - QUEBEC_ABATEMENT);
  const tauxCombine = tauxFederalEffectif + tauxQuebec;
  
  // Économies d'impôt
  const economieFederale = cotisation * tauxFederalEffectif;
  const economieQuebec = cotisation * tauxQuebec;
  const economieTotal = cotisation * tauxCombine;
  const abattementQuebec = cotisation * tauxFederal * QUEBEC_ABATEMENT;
  
  // Revenu imposable après REER
  const revenuApresREER = revenuBrut - cotisation;
  const nouveauTauxCombine = getCombinedMarginalRate(revenuApresREER);
  
  // Impôt total avant et après REER
  const impotAvant = calculateFederalTax(revenuBrut) + calculateQuebecTax(revenuBrut);
  const impotApres = calculateFederalTax(revenuApresREER) + calculateQuebecTax(revenuApresREER);
  const economieReelle = impotAvant - impotApres;
  
  // Projection sur 25 ans avec rendement de 5%
  const rendementAnnuel = 0.05;
  const annees = 25;
  const valeurFuture = cotisation * ((Math.pow(1 + rendementAnnuel, annees) - 1) / rendementAnnuel);
  
  // Conseil personnalisé
  let conseil = '';
  if (cotisation > droitsMax) {
    conseil = '⚠️ Attention: Votre cotisation dépasse vos droits estimés de ' + droitsMax.toLocaleString() + ' $. Vérifiez votre avis de cotisation.';
  } else if (revenuBrut < 50000) {
    conseil = '💡 À ce niveau de revenu, un CELI pourrait être plus avantageux car votre taux marginal (' + (tauxCombine * 100).toFixed(1) + '%) est relativement bas. Le REER sera plus avantageux si votre revenu augmente.';
  } else if (revenuBrut > 100000) {
    conseil = '✨ Excellent choix! Avec un taux marginal de ' + (tauxCombine * 100).toFixed(1) + '%, le REER vous offre une économie immédiate significative. Maximisez vos cotisations!';
  } else {
    conseil = '👍 Le REER est une bonne stratégie. Réinvestissez votre remboursement de ' + Math.round(economieReelle).toLocaleString() + ' $ pour maximiser la croissance composée.';
  }
  
  return {
    // Inputs reflétés
    r_cotisation: cotisation,
    droits_max: droitsMax,
    
    // Taux
    r_taux: (tauxCombine * 100).toFixed(1),
    taux_federal: (tauxFederalEffectif * 100).toFixed(1),
    taux_quebec: (tauxQuebec * 100).toFixed(1),
    
    // Économies
    r_economie: economieReelle,
    r_federal: economieFederale,
    r_quebec: economieQuebec,
    r_abattement: abattementQuebec,
    
    // Impact fiscal
    revenu_avant: revenuBrut,
    revenu_apres: revenuApresREER,
    impot_avant: impotAvant,
    impot_apres: impotApres,
    
    // Projection
    valeur_future: valeurFuture,
    annees_projection: annees,
    
    // Conseil
    conseil
  };
};

// =============================================================================
// 3. CALCULATEUR ASSURANCE VIE
// =============================================================================
export const calculateAssuranceVie = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  // Section Dettes
  const hypotheque = get('hypotheque');
  const pretAuto = get('pret_auto');
  const cartes = get('cartes');
  const margeCredit = get('marge_credit');
  const autresDettes = get('autres_dettes');
  const totalDettes = hypotheque + pretAuto + cartes + margeCredit + autresDettes;
  
  // Section Remplacement de revenu
  const revenuNet = get('revenu_net');
  const pctRemplacer = get('pct_remplacer') || 70;
  const nbAnnees = get('nb_annees') || 10;
  const revenuConjoint = get('revenu_conjoint') || 0;
  
  // Calcul du besoin de remplacement de revenu
  const revenuARemplacer = revenuNet * (pctRemplacer / 100);
  const revenuManquant = Math.max(0, revenuARemplacer - revenuConjoint);
  
  // Utiliser la valeur présente actualisée (taux d'actualisation 3%)
  const tauxActualisation = 0.03;
  const facteurActualisation = (1 - Math.pow(1 + tauxActualisation, -nbAnnees)) / tauxActualisation;
  const besoinRevenu = revenuManquant * 12 * facteurActualisation;
  
  // Section Éducation des enfants
  const coutEtudesParEnfant = get('etudes') || 30000;
  const nbEnfants = parseInt(values['nb_enfants']) || 0;
  const totalEducation = coutEtudesParEnfant * nbEnfants;
  
  // Section Fonds d'urgence & Final
  const fondsUrgence = get('urgence') || 0;
  const fraisFuneraires = get('funerailles') || 15000;
  const legsDesire = get('legs') || 0;
  const totalFinal = fondsUrgence + fraisFuneraires + legsDesire;
  
  // Section Actifs existants
  const assuranceActuelle = get('av_actuelle') || 0;
  const assuranceGroupe = get('av_groupe') || 0;
  const epargnes = get('epargnes') || 0;
  const totalActifs = assuranceActuelle + assuranceGroupe + epargnes;
  
  // Calcul du besoin total
  const besoinBrut = totalDettes + besoinRevenu + totalEducation + totalFinal;
  const besoinNet = Math.max(0, besoinBrut - totalActifs);
  
  // Arrondir au 50 000$ supérieur pour la recommandation
  const besoinRecommande = Math.ceil(besoinNet / 50000) * 50000;
  
  // Type d'assurance recommandé
  let typeAssurance = '';
  let conseil = '';
  
  if (besoinNet <= 0) {
    typeAssurance = 'Aucune';
    conseil = '✨ Vos actifs actuels couvrent vos besoins. Réévaluez si votre situation change.';
  } else if (besoinNet < 100000) {
    typeAssurance = 'Temporaire 10 ans';
    conseil = '💡 Un besoin modeste - une assurance temporaire de 10 ans serait économique et suffisante.';
  } else if (besoinNet < 500000) {
    typeAssurance = 'Temporaire 20 ans';
    conseil = '👍 Une assurance temporaire de 20 ans couvrirait la période critique pendant que vos enfants grandissent et vos dettes diminuent.';
  } else {
    typeAssurance = 'Temporaire 20 ans + Permanent';
    conseil = '📋 Votre besoin important suggère une combinaison: temporaire 20 ans pour la majorité et une portion permanente pour les frais finaux et legs.';
  }
  
  return {
    // Dettes
    total_dettes: totalDettes,
    
    // Revenu
    total_revenu: besoinRevenu,
    revenu_a_remplacer: revenuARemplacer,
    revenu_manquant: revenuManquant,
    
    // Éducation
    total_education: totalEducation,
    
    // Final
    total_heritage: totalFinal,
    
    // Actifs
    total_actifs: totalActifs,
    
    // Résultats
    r_dettes: totalDettes,
    r_revenu: besoinRevenu,
    r_heritage: totalFinal,
    r_education: totalEducation,
    besoin_brut: besoinBrut,
    r_actifs: totalActifs,
    r_total: besoinNet,
    besoin_recommande: besoinRecommande,
    
    // Recommandation
    type_assurance: typeAssurance,
    conseil
  };
};

// =============================================================================
// 4. SIMULATEUR REEE QUÉBEC
// =============================================================================
export const calculateREEE = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  const cotisation = get('cotisation');
  const nbEnfants = parseInt(values['nb_enfants']) || 1;
  const revenuFamilial = get('revenu');
  const droitsAccumules = Math.max(0, get('droits_inutilises') || 0);
  
  const cotisationParEnfant = cotisation / nbEnfants;
  
  // ===================
  // SCEE (Subvention canadienne pour l'épargne-études)
  // ===================
  // Base: 20% sur premiers 2 500$ par enfant (max 500$/an/enfant, max vie 7 200$)
  const sceeBase = Math.min(cotisationParEnfant, REEE_2026.cesg.annualContributionCapPerChild) * REEE_2026.cesg.baseRate * nbEnfants;
  
  // Supplément SCEE selon revenu familial
  let sceeSupp = 0;
  if (revenuFamilial > 0 && revenuFamilial <= REEE_2026.cesg.additionalLowIncomeThreshold) {
    // 20% additionnel sur premiers 500$
    sceeSupp = Math.min(cotisationParEnfant, REEE_2026.cesg.additionalContributionBasePerChild) * REEE_2026.cesg.additionalLowIncomeRate * nbEnfants;
  } else if (revenuFamilial <= REEE_2026.cesg.additionalMidIncomeThreshold) {
    // 10% additionnel sur premiers 500$
    sceeSupp = Math.min(cotisationParEnfant, REEE_2026.cesg.additionalContributionBasePerChild) * REEE_2026.cesg.additionalMidIncomeRate * nbEnfants;
  }
  
  const sceeTotal = sceeBase + sceeSupp;
  
  // ===================
  // IQEE (Incitatif québécois à l'épargne-études)
  // ===================
  // Base: 10% sur premiers 2 500$ par enfant (max 250$/an/enfant, max vie 3 600$)
  const iqeeBase = Math.min(cotisationParEnfant, REEE_2026.iqee.annualContributionCapPerChild) * REEE_2026.iqee.baseRate * nbEnfants;
  
  // Supplément IQEE selon revenu familial
  let iqeeSupp = 0;
  if (revenuFamilial > 0 && revenuFamilial <= REEE_2026.iqee.additionalLowIncomeThreshold) {
    // 10% additionnel sur premiers 500$
    iqeeSupp = Math.min(cotisationParEnfant, REEE_2026.iqee.additionalContributionBasePerChild) * REEE_2026.iqee.additionalLowIncomeRate * nbEnfants;
  } else if (revenuFamilial <= REEE_2026.iqee.additionalMidIncomeThreshold) {
    // 5% additionnel sur premiers 500$
    iqeeSupp = Math.min(cotisationParEnfant, REEE_2026.iqee.additionalContributionBasePerChild) * REEE_2026.iqee.additionalMidIncomeRate * nbEnfants;
  }
  
  const iqeeTotal = iqeeBase + iqeeSupp;
  
  // ===================
  // BEC (Bon d'études canadien) - familles à faible revenu seulement
  // ===================
  let bec = 0;
  if (revenuFamilial > 0 && revenuFamilial <= REEE_2026.bec.estimatedEligibilityThreshold) {
    // 100$ par enfant admissible par an (max 2 000$ vie)
    bec = REEE_2026.bec.annualAmountPerChild * nbEnfants;
  }
  // Simplified rattrapage model: only one extra year of grant room can be used annually.
  const rattrapageEligibleParEnfant = Math.min(
    droitsAccumules / nbEnfants,
    REEE_2026.cesg.annualContributionCapPerChild
  );
  const cotisationRattrapage = Math.max(0, Math.min(cotisationParEnfant - REEE_2026.cesg.annualContributionCapPerChild, rattrapageEligibleParEnfant));
  const sceeRattrapage = cotisationRattrapage * REEE_2026.cesg.baseRate * nbEnfants;
  const iqeeRattrapage = cotisationRattrapage * REEE_2026.iqee.baseRate * nbEnfants;
  
  // Total des subventions
  const totalSubventions = sceeTotal + iqeeTotal + sceeRattrapage + iqeeRattrapage + bec;
  
  // Rendement des subventions
  const rendementSubventions = cotisation > 0 ? (totalSubventions / cotisation * 100) : 0;
  
  // ===================
  // Projections sur 18 ans
  // ===================
  const rendementAnnuel = 0.05;
  const annees = 18;
  
  // Projection avec cotisations et subventions annuelles constantes
  let projCotisations = 0;
  let projSubventions = 0;
  let projRendement = 0;
  let soldeAccumule = 0;
  
  for (let i = 0; i < annees; i++) {
    // Ajouter cotisation et subventions de l'année
    soldeAccumule += cotisation + totalSubventions;
    // Calculer rendement sur le solde
    const rendementAnnee = soldeAccumule * rendementAnnuel;
    soldeAccumule += rendementAnnee;
    
    projCotisations += cotisation;
    projSubventions += totalSubventions;
    projRendement += rendementAnnee;
  }
  
  const projTotal = soldeAccumule;
  
  // Conseil
  let conseil = '';
  if (cotisation < 2500) {
    conseil = '💡 Cotisez au moins 2 500$ par enfant pour maximiser la SCEE de base (500$/enfant).';
  } else if (rendementSubventions > 30) {
    conseil = '✨ Excellent! Avec les subventions supplémentaires pour familles à revenu modeste, vous obtenez un rendement immédiat de ' + rendementSubventions.toFixed(0) + '%!';
  } else {
    conseil = '👍 Vous maximisez les subventions de base. Continuez à cotiser régulièrement pour bénéficier de la croissance composée.';
  }
  
  return {
    // Subventions
    scee: sceeTotal + sceeRattrapage,
    scee_base: sceeBase,
    scee_bonus: sceeSupp,
    iqee: iqeeTotal + iqeeRattrapage,
    iqee_base: iqeeBase,
    iqee_bonus: iqeeSupp,
    bec: bec,
    scee_rattrapage: sceeRattrapage,
    iqee_rattrapage: iqeeRattrapage,
    total_sub: totalSubventions,
    rendement_sub: rendementSubventions.toFixed(1),
    
    // Projections
    proj_cotis: projCotisations,
    proj_sub: projSubventions,
    proj_rend: projRendement,
    proj_total: projTotal,
    
    // Conseil
    conseil
  };
};

// =============================================================================
// 5. CALCULATEUR FONDS D'URGENCE
// =============================================================================
export const calculateFondsUrgence = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  // Dépenses mensuelles essentielles
  const logement = get('logement');
  const alimentation = get('alimentation');
  const transport = get('transport');
  const assurances = get('assurances');
  const dettes = get('dettes');
  const autres = get('autres');
  
  const depensesMensuelles = logement + alimentation + transport + assurances + dettes + autres;
  
  // Situation personnelle
  const stabilite = values['stabilite'] || 'stable';
  const nbPersonnes = parseInt(values['personnes']) || 1;
  const secteurActivite = values['secteur'] || 'prive';
  
  // Épargne actuelle
  const epargneActuelle = get('epargne_actuelle');
  
  // Déterminer le nombre de mois recommandé
  let moisMin = 3;
  let moisMax = 6;
  
  // Ajustements selon la stabilité d'emploi
  if (stabilite === 'moyen') {
    moisMin = 4;
    moisMax = 8;
  } else if (stabilite === 'variable' || stabilite === 'precaire') {
    moisMin = 6;
    moisMax = 12;
  }
  
  // Ajustements selon le secteur
  if (secteurActivite === 'autonome' || secteurActivite === 'contractuel') {
    moisMin += 2;
    moisMax += 3;
  }
  
  // Ajustements selon les personnes à charge
  if (nbPersonnes >= 3) {
    moisMin += 1;
    moisMax += 2;
  }
  
  // Calcul des objectifs
  const objectifMin = depensesMensuelles * moisMin;
  const objectifMax = depensesMensuelles * moisMax;
  const objectifMoyen = (objectifMin + objectifMax) / 2;
  
  // Progression
  const progression = objectifMoyen > 0 ? Math.min(100, (epargneActuelle / objectifMoyen * 100)) : 0;
  const manquant = Math.max(0, objectifMoyen - epargneActuelle);
  
  // Épargne mensuelle suggérée (pour atteindre l'objectif en 12 mois)
  const epargneSuggereeMensuelle = manquant > 0 ? manquant / 12 : 0;
  
  // Conseil
  let conseil = '';
  let priorite = '';
  
  if (progression >= 100) {
    conseil = '✨ Félicitations! Votre fonds d\'urgence est complet. Vous pouvez maintenant investir le surplus dans votre CELI ou REER.';
    priorite = 'Investissement';
  } else if (progression >= 75) {
    conseil = '👍 Vous êtes proche de l\'objectif! Continuez à épargner ' + Math.round(epargneSuggereeMensuelle).toLocaleString() + '$/mois pour terminer.';
    priorite = 'Compléter';
  } else if (progression >= 50) {
    conseil = '📈 Bon progrès! Vous avez atteint la moitié. Maintenez vos efforts d\'épargne.';
    priorite = 'Continuer';
  } else if (progression >= 25) {
    conseil = '💪 Bon début! Essayez d\'épargner automatiquement chaque paie pour atteindre votre objectif plus rapidement.';
    priorite = 'Accélérer';
  } else {
    conseil = '⚠️ Priorité: Constituez votre fonds d\'urgence avant d\'investir. Visez ' + Math.round(epargneSuggereeMensuelle).toLocaleString() + '$/mois.';
    priorite = 'Urgent';
  }
  
  return {
    // Dépenses
    depenses_mois: depensesMensuelles,
    
    // Objectifs
    objectif_min: objectifMin,
    objectif_max: objectifMax,
    objectif_moyen: objectifMoyen,
    mois_recommandes: `${moisMin} à ${moisMax} mois`,
    montant_range: `${Math.round(objectifMin).toLocaleString()} $ - ${Math.round(objectifMax).toLocaleString()} $`,
    
    // Situation actuelle
    epargne_actuelle: epargneActuelle,
    epargne_restant: manquant,
    epargne_pct: progression.toFixed(0),
    progress_bar: progression,
    
    // Suggestion
    epargne_mensuelle: epargneSuggereeMensuelle,
    
    // Conseil
    conseil,
    priorite
  };
};

// =============================================================================
// 6. COMPARATEUR REER vs CELI
// =============================================================================
export const calculateComparateurREERCELI = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  const revenuActuel = get('revenu_actuel');
  const montantInvestir = get('montant');
  const revenuRetraite = get('revenu_retraite');
  const horizon = parseInt(values['horizon']) || 20;
  const rendement = (get('rendement') || 5) / 100;
  const reinvestirRemboursement = values['reinvestir'] === 'oui';
  
  // ===================
  // Taux marginaux
  // ===================
  const tauxActuel = getCombinedMarginalRate(revenuActuel);
  const tauxRetraite = getCombinedMarginalRate(revenuRetraite);
  
  // ===================
  // Scénario REER
  // ===================
  const remboursementREER = montantInvestir * tauxActuel;
  const cotisationTotaleREER = reinvestirRemboursement 
    ? montantInvestir + remboursementREER 
    : montantInvestir;
  
  // Valeur future du REER
  const valeurBruteREER = futureValue(cotisationTotaleREER, rendement, horizon);
  
  // Impôt au retrait (au taux de la retraite)
  const impotRetraitREER = valeurBruteREER * tauxRetraite;
  const valeurNetteREER = valeurBruteREER - impotRetraitREER;
  
  // ===================
  // Scénario CELI
  // ===================
  // Avec le CELI, vous investissez le même montant mais pas de remboursement
  const cotisationCELI = montantInvestir;
  const valeurFutureCELI = futureValue(cotisationCELI, rendement, horizon);
  
  // Pas d'impôt au retrait pour le CELI
  const valeurNetteCELI = valeurFutureCELI;
  
  // ===================
  // Comparaison équitable
  // ===================
  // Si on n'investit pas le remboursement REER, il faut voir où va cet argent
  let valeurRemboursementSiNonReinvesti = 0;
  if (!reinvestirRemboursement) {
    // Le remboursement investi dans un compte non-enregistré (imposé à 50% du gain)
    const gainRemboursement = remboursementREER * (Math.pow(1 + rendement, horizon) - 1);
    const impotGain = gainRemboursement * 0.5 * tauxRetraite;
    valeurRemboursementSiNonReinvesti = remboursementREER + gainRemboursement - impotGain;
  }
  
  const valeurTotaleREER = valeurNetteREER + valeurRemboursementSiNonReinvesti;
  
  // ===================
  // Verdict
  // ===================
  const difference = valeurTotaleREER - valeurNetteCELI;
  const diffPourcent = valeurNetteCELI > 0 ? Math.abs(difference / valeurNetteCELI * 100) : 0;
  
  let verdictTitre = '';
  let verdictTexte = '';
  let verdictClass = '';
  
  if (diffPourcent < 3) {
    verdictTitre = 'Résultats similaires';
    verdictTexte = 'Les deux options donnent des résultats comparables. Choisissez selon vos besoins de flexibilité (CELI) ou d\'économie immédiate (REER).';
    verdictClass = 'egal';
  } else if (difference > 0) {
    verdictTitre = 'REER recommandé';
    verdictTexte = `Votre taux marginal actuel (${(tauxActuel*100).toFixed(0)}%) est supérieur à celui prévu à la retraite (${(tauxRetraite*100).toFixed(0)}%). Vous économisez ${Math.round(Math.abs(difference)).toLocaleString()} $ avec le REER.`;
    verdictClass = 'reer';
  } else {
    verdictTitre = 'CELI recommandé';
    verdictTexte = `Votre taux à la retraite (${(tauxRetraite*100).toFixed(0)}%) est proche ou supérieur à l'actuel. La flexibilité du CELI est plus avantageuse. Avantage: ${Math.round(Math.abs(difference)).toLocaleString()} $.`;
    verdictClass = 'celi';
  }
  
  return {
    // REER
    reer_cotis: montantInvestir,
    reer_remb: remboursementREER,
    reer_cotis_total: cotisationTotaleREER,
    reer_taux_act: (tauxActuel * 100).toFixed(0),
    reer_taux_ret: (tauxRetraite * 100).toFixed(0),
    reer_valeur_brute: valeurBruteREER,
    reer_impot: impotRetraitREER,
    reer_final: valeurTotaleREER,
    
    // CELI
    celi_cotis: cotisationCELI,
    celi_valeur: valeurFutureCELI,
    celi_final: valeurNetteCELI,
    
    // Verdict
    verdict_titre: verdictTitre,
    verdict_texte: verdictTexte,
    verdict_class: verdictClass,
    difference: Math.abs(difference)
  };
};

// =============================================================================
// 7. CALCULATEUR HYPOTHÉCAIRE
// =============================================================================
export const calculateHypotheque = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  const prixPropriete = get('prix');
  const miseDeFonds = get('mise');
  const tauxInteret = get('taux') || 5.5;
  const amortissement = parseInt(values['amortissement']) || 25;
  const frequence = parseInt(values['frequence']) || 12;
  const inclureSCHL = values['schl'] || 'auto';
  
  // Calculs de base
  const montantPret = prixPropriete - miseDeFonds;
  const ratioMiseDeFonds = prixPropriete > 0 ? (miseDeFonds / prixPropriete) : 0;
  const ratioLTV = 1 - ratioMiseDeFonds;
  const miseMinimum = calculateMinimumDownPayment(prixPropriete);
  const respecteMiseMinimum = miseDeFonds >= miseMinimum;
  const proprieteAssurable = prixPropriete > 0 && prixPropriete <= MAX_INSURABLE_PROPERTY_VALUE;
  const estPretAssurable = ratioMiseDeFonds >= 0.05 && ratioMiseDeFonds < 0.20 && proprieteAssurable && respecteMiseMinimum;
  
  // Prime SCHL
  let primeSCHL = 0;
  const doitPayerSCHL = inclureSCHL === 'oui' || (inclureSCHL === 'auto' && estPretAssurable);

  if (doitPayerSCHL && estPretAssurable && montantPret > 0) {
    primeSCHL = calculateSCHLPremium(montantPret, prixPropriete);
  }
  
  const montantTotalPret = montantPret + primeSCHL;
  
  // Calcul du paiement
  const tauxAnnuel = tauxInteret / 100;
  const paiement = calculatePMT(montantTotalPret, tauxAnnuel, amortissement, frequence);
  
  // Calculs sur la durée
  const nombrePaiements = amortissement * frequence;
  const totalPaiements = paiement * nombrePaiements;
  const totalInterets = totalPaiements - montantTotalPret;
  
  // Pourcentages
  const pctCapital = totalPaiements > 0 ? (montantTotalPret / totalPaiements * 100) : 0;
  const pctInterets = totalPaiements > 0 ? (totalInterets / totalPaiements * 100) : 0;
  
  // Texte de fréquence
  let textePeriode = 'par mois';
  if (frequence === 26) textePeriode = 'aux 2 semaines';
  else if (frequence === 52) textePeriode = 'par semaine';
  else if (frequence === 24) textePeriode = '2x par mois';
  
  // Tableau d'amortissement simplifié (5 premières années)
  const tableauAmort = [];
  let solde = montantTotalPret;
  const paiementMensuel = calculatePMT(montantTotalPret, tauxAnnuel, amortissement, 12);
  
  for (let annee = 1; annee <= Math.min(5, amortissement); annee++) {
    let capitalAnnee = 0;
    let interetAnnee = 0;
    
    for (let mois = 0; mois < 12; mois++) {
      const interetMois = solde * (tauxAnnuel / 12);
      const capitalMois = paiementMensuel - interetMois;
      capitalAnnee += capitalMois;
      interetAnnee += interetMois;
      solde -= capitalMois;
    }
    
    tableauAmort.push({
      annee,
      capital: capitalAnnee,
      interet: interetAnnee,
      solde: Math.max(0, solde)
    });
  }
  
  // Conseil
  let conseil = '';
  if (!respecteMiseMinimum) {
    conseil = `⚠️ Mise de fonds insuffisante. Minimum estimé: ${Math.round(miseMinimum).toLocaleString()} $.`;
  } else if (prixPropriete > MAX_INSURABLE_PROPERTY_VALUE && ratioMiseDeFonds < 0.20) {
    conseil = '⚠️ Pour une propriété au-dessus de 1 500 000 $, une mise de fonds minimale de 20% est requise (non assurable SCHL).';
  } else if (inclureSCHL === 'non' && ratioMiseDeFonds < 0.20) {
    conseil = '⚠️ Avec moins de 20% de mise de fonds, l’assurance prêt hypothécaire est normalement requise.';
  } else if (ratioMiseDeFonds < 0.20) {
    conseil = `💡 Avec ${(ratioMiseDeFonds*100).toFixed(1)}% de mise de fonds, prime estimée: ${Math.round(primeSCHL).toLocaleString()} $. À 20%, vous l'évitez.`;
  } else {
    conseil = `✨ Excellente mise de fonds de ${(ratioMiseDeFonds*100).toFixed(0)}%! Vous évitez la prime SCHL et obtenez un meilleur taux.`;
  }
  
  return {
    // Résultat principal
    paiement: paiement,
    periode: textePeriode,
    
    // Détails du prêt
    montant_pret: montantTotalPret,
    pret_base: montantPret,
    prime_schl: primeSCHL,
    mise_min: miseMinimum,
    mise_pct: (ratioMiseDeFonds * 100).toFixed(0) + '%',
    
    // Coûts totaux
    total_capital: montantTotalPret,
    total_interets: totalInterets,
    cout_total: totalPaiements,
    
    // Barres de visualisation
    bar_cap: pctCapital,
    bar_int: pctInterets,
    pct_capital: pctCapital.toFixed(1),
    pct_interet: pctInterets.toFixed(1),
    
    // Tableau amortissement
    tableau_amort: tableauAmort,
    
    // Conseil
    conseil
  };
};

// =============================================================================
// 8. CALCULATEUR VALEUR NETTE
// =============================================================================
export const calculateValeurNette = (values) => {
  const get = (id) => parseFloat(values[id]) || 0;
  
  // ===================
  // ACTIFS
  // ===================
  
  // Liquidités
  const compteCheque = get('cheque');
  const compteEpargne = get('epargne');
  const celi = get('celi');
  const totalLiquidites = compteCheque + compteEpargne + celi;
  
  // Placements
  const reer = get('reer');
  const reee = get('reee');
  const placementsNonEnr = get('placements');
  const regimeRetraite = get('regime_retraite');
  const totalPlacements = reer + reee + placementsNonEnr + regimeRetraite;
  
  // Biens immobiliers
  const residencePrincipale = get('residence');
  const immeubleLocatif = get('locatif');
  const chalet = get('chalet');
  const totalImmobilier = residencePrincipale + immeubleLocatif + chalet;
  
  // Autres actifs
  const vehicules = get('vehicules');
  const entreprise = get('entreprise');
  const autresActifs = get('autres_actifs');
  const totalAutresActifs = vehicules + entreprise + autresActifs;
  
  const totalActifs = totalLiquidites + totalPlacements + totalImmobilier + totalAutresActifs;
  
  // ===================
  // PASSIFS
  // ===================
  
  // Hypothèques
  const hypoResidence = get('hypo_res');
  const hypoLocatif = get('hypo_loc');
  const margeHypothecaire = get('marge_hypo');
  const totalHypotheques = hypoResidence + hypoLocatif + margeHypothecaire;
  
  // Prêts
  const pretAuto = get('pret_auto');
  const pretEtudiant = get('pret_etudiant');
  const margeCredit = get('marge_credit');
  const totalPrets = pretAuto + pretEtudiant + margeCredit;
  
  // Dettes
  const cartesCredit = get('cartes');
  const autresDettes = get('autres_dettes');
  const totalDettes = cartesCredit + autresDettes;
  
  const totalPassifs = totalHypotheques + totalPrets + totalDettes;
  
  // ===================
  // CALCULS
  // ===================
  
  const valeurNette = totalActifs - totalPassifs;
  
  // Ratios
  const ratioEndettement = totalActifs > 0 ? (totalPassifs / totalActifs * 100) : 0;
  const ratioLiquidite = totalPassifs > 0 ? (totalLiquidites / totalPassifs * 100) : 100;
  
  // Barres de visualisation
  const total = totalActifs + totalPassifs;
  const pctActifs = total > 0 ? (totalActifs / total * 100) : 50;
  const pctPassifs = total > 0 ? (totalPassifs / total * 100) : 50;
  
  // Répartition des actifs
  const pctLiquidites = totalActifs > 0 ? (totalLiquidites / totalActifs * 100) : 0;
  const pctPlacements = totalActifs > 0 ? (totalPlacements / totalActifs * 100) : 0;
  const pctImmobilier = totalActifs > 0 ? (totalImmobilier / totalActifs * 100) : 0;
  
  // Conseil
  let conseil = '';
  let sante = '';
  
  if (valeurNette < 0) {
    conseil = '⚠️ Votre valeur nette est négative. Priorité: rembourser les dettes à taux élevé (cartes de crédit) avant d\'investir.';
    sante = 'critique';
  } else if (ratioEndettement > 80) {
    conseil = '📉 Votre ratio d\'endettement de ' + ratioEndettement.toFixed(0) + '% est élevé. Concentrez-vous sur le remboursement de vos dettes.';
    sante = 'attention';
  } else if (ratioEndettement > 50) {
    conseil = '💡 Ratio d\'endettement de ' + ratioEndettement.toFixed(0) + '%. Équilibrez remboursement de dettes et épargne.';
    sante = 'moyen';
  } else if (ratioEndettement > 30) {
    conseil = '👍 Bonne santé financière! Ratio d\'endettement de ' + ratioEndettement.toFixed(0) + '%. Continuez à bâtir votre patrimoine.';
    sante = 'bon';
  } else {
    conseil = '✨ Excellent! Ratio d\'endettement de seulement ' + ratioEndettement.toFixed(0) + '%. Vous pouvez maximiser vos investissements.';
    sante = 'excellent';
  }
  
  return {
    // Actifs
    total_liquidites: totalLiquidites,
    total_placements: totalPlacements,
    total_immobilier: totalImmobilier,
    total_autres_actifs: totalAutresActifs,
    total_actifs: totalActifs,
    
    // Passifs
    total_hypotheques: totalHypotheques,
    total_prets: totalPrets,
    total_dettes: totalDettes,
    total_passifs: totalPassifs,
    
    // Résultats
    valeur_nette: valeurNette,
    r_actifs: totalActifs,
    r_passifs: totalPassifs,
    r_ratio: ratioEndettement.toFixed(1),
    
    // Barres
    bar_actifs: pctActifs,
    bar_passifs: pctPassifs,
    pct_actifs: pctActifs.toFixed(0),
    pct_passifs: pctPassifs.toFixed(0),
    
    // Répartition
    pct_liquidites: pctLiquidites.toFixed(0),
    pct_placements: pctPlacements.toFixed(0),
    pct_immobilier: pctImmobilier.toFixed(0),
    
    // Conseil
    conseil,
    sante
  };
};

// =============================================================================
// EXPORT
// =============================================================================

/** Comparateur banques vs Portefeuilles Modèles iA (5 ans net, Classique 75/75). */
const PROFIL_LABELS = PROFIL_RISQUE_LABELS;

const fmtCad = (n) => `${Math.round(n).toLocaleString('fr-CA')} $`;
const fmtPct = (n) => n.toFixed(1).replace('.', ',');

const futureValueAnnuities = (capital, annualRate, years, annualContribution = 0) => {
  let value = capital;
  for (let i = 0; i < years; i += 1) {
    value = value * (1 + annualRate) + annualContribution;
  }
  return value;
};

export const calculateComparateurRendements = (values) => {
  const profil = values.profil || 'equilibre';
  const banqueAvg = getBanqueAvgForProfil(profil);
  const iaPct = getIaPctForProfil(profil);
  const usePerso = values.source_banque === 'perso';
  const perso = parseFloat(values.rendement_perso);
  const utilisePct = usePerso && !Number.isNaN(perso) ? perso : banqueAvg;
  const capital = parseFloat(values.capital) || 0;
  const versement = parseFloat(values.versement) || 0;
  const horizon = parseInt(values.horizon, 10) || 5;

  const valeurBanque = futureValueAnnuities(capital, utilisePct / 100, horizon, versement);
  const valeurIa = futureValueAnnuities(capital, iaPct / 100, horizon, versement);
  const ecartDollars = valeurIa - valeurBanque;
  const ecartPts = iaPct - utilisePct;

  let resume = '';
  if (capital > 0) {
    const signe = ecartDollars >= 0 ? 'supérieure' : 'inférieure';
    resume =
      `Sur ${horizon} an${horizon > 1 ? 's' : ''}, avec un capital de départ de ${fmtCad(capital)}` +
      (versement > 0 ? ` et ${fmtCad(versement)}/an` : '') +
      `, la projection au taux modèle iA est ${signe} d'environ ${fmtCad(Math.abs(ecartDollars))} ` +
      `par rapport au scénario ${usePerso ? 'de votre rendement' : 'moyenne bancaire'}.`;
  } else {
    resume =
      `Écart de rendement : ${fmtPct(ecartPts)} points de pourcentage ` +
      `(${PROFIL_LABELS[profil] || profil}). Entrez un capital pour voir l'impact en dollars.`;
  }

  return {
    r_profil: PROFIL_LABELS[profil] || profil,
    r_banque_pct: fmtPct(banqueAvg),
    r_utilise_pct: fmtPct(utilisePct),
    r_ia_pct: fmtPct(iaPct),
    r_ecart_pct: fmtPct(ecartPts),
    r_valeur_banque: fmtCad(valeurBanque),
    r_valeur_ia: fmtCad(valeurIa),
    r_ecart_dollars: fmtCad(ecartDollars),
    r_resume: resume,
    // Numeriques pour graphiques / tableaux React
    banque_avg: banqueAvg,
    utilise_pct: utilisePct,
    ia_pct: iaPct,
    ecart_pts: ecartPts,
    valeur_banque: valeurBanque,
    valeur_ia: valeurIa,
    ecart_dollars: ecartDollars,
    capital,
    horizon,
  };
};

export const calculators = {
  'budget-mensuel': calculateBudget,
  'simulateur-reer': calculateREER,
  'calculateur-assurance-vie-complet': calculateAssuranceVie,
  'simulateur-reee': calculateREEE,
  'fonds-urgence': calculateFondsUrgence,
  'comparateur-reer-celi': calculateComparateurREERCELI,
  'calculateur-hypothecaire': calculateHypotheque,
  'valeur-nette': calculateValeurNette,
  'comparateur-rendements': calculateComparateurRendements,
};

export const getCalculator = (slug) => calculators[slug] || null;
