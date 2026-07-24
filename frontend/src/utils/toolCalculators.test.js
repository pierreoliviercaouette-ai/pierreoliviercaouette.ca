import {
  calculateAssuranceVie,
  calculateBudget,
  calculateComparateurREERCELI,
  calculateComparateurRendements,
  calculateFondsUrgence,
  calculateHypotheque,
  calculateREER,
  calculateREEE,
  calculateValeurNette,
} from './toolCalculators';
import { getBanqueAvgForProfil, getIaPctForProfil } from '../data/comparateurRendementsRates';

describe('toolCalculators fiscal 2026', () => {
  test('REER applies 2026 deduction cap', () => {
    const result = calculateREER({
      revenu: '300000',
      cotisation: '10000',
      situation: 'celibataire',
      enfants: '0',
    });

    expect(result.droits_max).toBe(33810);
  });

  test('REER/CELI comparator reflects 2026 federal 14% bracket at low income', () => {
    const result = calculateComparateurREERCELI({
      revenu_actuel: '50000',
      montant: '10000',
      revenu_retraite: '40000',
      horizon: '20',
      rendement: '5',
      reinvestir: 'oui',
    });

    expect(Number(result.reer_taux_act)).toBeCloseTo(25.7, 0);
  });

  test('REEE grants include supplemental amounts at low income', () => {
    const result = calculateREEE({
      cotisation: '2500',
      nb_enfants: '1',
      revenu: '50000',
      droits_inutilises: '0',
    });

    expect(result.scee_base).toBe(500);
    expect(result.scee_bonus).toBe(100);
    expect(result.iqee_base).toBe(250);
    expect(result.iqee_bonus).toBe(50);
  });

  test('REEE catch-up grants are applied for unused rights', () => {
    const result = calculateREEE({
      cotisation: '5000',
      nb_enfants: '1',
      revenu: '70000',
      droits_inutilises: '2500',
    });

    expect(result.scee_rattrapage).toBe(500);
    expect(result.iqee_rattrapage).toBe(250);
    expect(result.total_sub).toBeGreaterThan(1200);
  });

  test('Hypotheque applies SCHL premium for 5% down payment tier', () => {
    const result = calculateHypotheque({
      prix: '500000',
      mise: '25000',
      taux: '5.5',
      amortissement: '25',
      frequence: '12',
      schl: 'auto',
    });

    expect(Math.round(result.prime_schl)).toBe(19000);
  });

  test('Hypotheque applies SCHL premium for 10% down payment tier', () => {
    const result = calculateHypotheque({
      prix: '500000',
      mise: '50000',
      taux: '5.5',
      amortissement: '25',
      frequence: '12',
      schl: 'auto',
    });

    expect(Math.round(result.prime_schl)).toBe(13950);
  });
});

describe('toolCalculators complete audit by tool', () => {
  test('Budget calculator aggregates revenues, expenses and savings correctly', () => {
    const result = calculateBudget({
      salaire: '4000',
      revenus_sec: '500',
      allocations: '200',
      autres_rev: '300',
      loyer: '1500',
      electricite: '100',
      assur_hab: '50',
      taxes: '0',
      telecom: '100',
      auto_paiement: '300',
      essence: '200',
      assur_auto: '100',
      entretien_auto: '50',
      transport_commun: '0',
      epicerie: '600',
      restaurants: '200',
      vetements: '100',
      soins: '100',
      assur_vie: '50',
      assur_maladie: '50',
      medicaments: '20',
      dentiste: '30',
      carte_credit: '100',
      pret_etudiant: '100',
      marge: '50',
      pension: '0',
      reer: '300',
      celi: '200',
      reee: '100',
      urgence: '100',
      abonnements: '50',
      loisirs: '100',
      vacances: '100',
      cadeaux: '50',
    });

    expect(result.res_revenus).toBe(5000);
    expect(result.res_depenses).toBe(4100);
    expect(result.res_epargne).toBe(700);
    expect(result.res_solde).toBe(200);
    expect(result.taux_epargne).toBeCloseTo(14, 4);
  });

  test('REER calculator tax savings equals before/after tax delta', () => {
    const result = calculateREER({
      revenu: '90000',
      cotisation: '10000',
      situation: 'couple',
      enfants: '2',
    });

    expect(result.r_economie).toBeCloseTo(result.impot_avant - result.impot_apres, 2);
    expect(result.r_economie).toBeGreaterThan(0);
  });

  test('Assurance vie calculator computes rounded recommendation bracket', () => {
    const result = calculateAssuranceVie({
      hypotheque: '300000',
      pret_auto: '15000',
      cartes: '5000',
      marge_credit: '10000',
      autres_dettes: '0',
      revenu_net: '6000',
      pct_remplacer: '70',
      nb_annees: '10',
      revenu_conjoint: '1000',
      etudes: '30000',
      nb_enfants: '2',
      urgence: '20000',
      funerailles: '15000',
      legs: '10000',
      av_actuelle: '100000',
      av_groupe: '50000',
      epargnes: '25000',
    });

    expect(result.r_total).toBeGreaterThan(0);
    expect(result.besoin_recommande % 50000).toBe(0);
    expect(result.besoin_recommande).toBeGreaterThanOrEqual(result.r_total);
  });

  test('REEE calculator handles multi-child scenario and positive projections', () => {
    const result = calculateREEE({
      cotisation: '5000',
      nb_enfants: '2',
      revenu: '80000',
      droits_inutilises: '0',
    });

    expect(result.scee_base).toBe(1000);
    expect(result.iqee_base).toBe(500);
    expect(result.total_sub).toBeGreaterThanOrEqual(1500);
    expect(result.proj_total).toBeGreaterThan(result.proj_cotis + result.proj_sub);
  });

  test('Fonds urgence calculator adjusts month range for risk profile', () => {
    const result = calculateFondsUrgence({
      logement: '2000',
      alimentation: '700',
      transport: '400',
      assurances: '300',
      dettes: '300',
      autres: '300',
      stabilite: 'variable',
      personnes: '4',
      secteur: 'autonome',
      epargne_actuelle: '5000',
    });

    expect(result.objectif_min).toBe(4000 * 9);
    expect(result.objectif_max).toBe(4000 * 17);
    expect(result.epargne_restant).toBeGreaterThan(0);
  });

  test('Comparateur REER CELI returns CELI if retirement rate is higher', () => {
    const result = calculateComparateurREERCELI({
      revenu_actuel: '40000',
      montant: '10000',
      revenu_retraite: '150000',
      horizon: '20',
      rendement: '5',
      reinvestir: 'oui',
    });

    expect(result.verdict_class).toBe('celi');
  });

  test('Hypotheque enforces mixed 5/10% minimum down payment above 500k', () => {
    const result = calculateHypotheque({
      prix: '600000',
      mise: '35000',
      taux: '5.5',
      amortissement: '25',
      frequence: '12',
      schl: 'auto',
    });

    expect(Math.round(result.mise_min)).toBe(35000);
    expect(Math.round(result.prime_schl)).toBeGreaterThan(0);
  });

  test('Hypotheque requires 20% down payment over 1.5M', () => {
    const result = calculateHypotheque({
      prix: '1600000',
      mise: '200000',
      taux: '5.5',
      amortissement: '25',
      frequence: '12',
      schl: 'auto',
    });

    expect(Math.round(result.mise_min)).toBe(320000);
    expect(result.prime_schl).toBe(0);
  });

  test('Valeur nette calculator computes assets, liabilities and net worth', () => {
    const result = calculateValeurNette({
      cheque: '10000',
      epargne: '20000',
      celi: '30000',
      reer: '50000',
      reee: '10000',
      placements: '5000',
      regime_retraite: '20000',
      residence: '400000',
      locatif: '0',
      chalet: '0',
      vehicules: '25000',
      entreprise: '0',
      autres_actifs: '0',
      hypo_res: '250000',
      hypo_loc: '0',
      marge_hypo: '10000',
      pret_auto: '12000',
      pret_etudiant: '0',
      marge_credit: '5000',
      cartes: '2000',
      autres_dettes: '1000',
    });

    expect(result.total_actifs).toBe(570000);
    expect(result.total_passifs).toBe(280000);
    expect(result.valeur_nette).toBe(290000);
    expect(Number(result.r_ratio)).toBeCloseTo(49.1, 1);
  });
});

describe('comparateur rendements par profil', () => {
  test('moyenne banques et iA suivent le profil de risque', () => {
    const prudent = calculateComparateurRendements({
      profil: 'prudent',
      rendement_perso: String(getBanqueAvgForProfil('prudent')),
      capital: '50000',
      horizon: '5',
      versement: '0',
    });
    const equilibre = calculateComparateurRendements({
      profil: 'equilibre',
      rendement_perso: String(getBanqueAvgForProfil('equilibre')),
      capital: '50000',
      horizon: '5',
      versement: '0',
    });

    expect(prudent.banque_avg).toBe(getBanqueAvgForProfil('prudent'));
    expect(prudent.ia_pct).toBe(getIaPctForProfil('prudent'));
    expect(equilibre.banque_avg).toBe(getBanqueAvgForProfil('equilibre'));
    expect(equilibre.ia_pct).toBe(getIaPctForProfil('equilibre'));
    expect(prudent.banque_avg).not.toBe(equilibre.banque_avg);
    expect(prudent.utilise_pct).toBe(prudent.banque_avg);
  });
});
