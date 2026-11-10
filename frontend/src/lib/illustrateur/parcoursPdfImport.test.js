import fs from 'fs';
import path from 'path';
import { parcoursTextToPlan, parseMoney } from './parcoursPdfImport';

const FIXTURE = path.resolve(
  __dirname,
  '../../../../tools/parcours-pdf-to-plan/fixtures/sample-parcours-extract.txt',
);

describe('parcoursPdfImport', () => {
  test('parseMoney handles FR formatting and pdf.js ? separators', () => {
    expect(parseMoney('24 112 $')).toBe(24112);
    expect(parseMoney('80\u00a0000\u00a0$')).toBe(80000);
    expect(parseMoney('80?000?$')).toBe(80000);
    expect(parseMoney('24?112?$')).toBe(24112);
    expect(parseMoney('-')).toBeNull();
  });

  test('maps pdf.js spaced extract with ? thousand separators', () => {
    const pdfjsLike = `
Votre profil Page 5 de 51 PIERRE-OLIVIER CAOUETTE Vos informations Date de naissance 1997-10-30 Sexe Homme État civil Conjoint de fait Usage du tabac Non Courriel personnel test@example.com Revenu annuel brut 80?000?$
Actifs Valeur ($) REER 24?112?$ 1 REER collectif 11?490?$ 1 Résidence principale 290?000?$ Prêt hypothécaire 210?941?$ 1
Assurance vie Temporaire 1 PIERRE-OLIVIER Beneva 400?000?$ 600?$ 2023-05-18 Conjoint Entière PIERRE-OLIVIER Empire Vie 50?000?$ 400?$ 2023-05-17 Conjoint
Individuel PIERRE-OLIVIER Beneva 700?$ 150?$ 2023-05-17 30 jours
Assurance maladie grave Individuel PIERRE-OLIVIER Beneva 50?000?$ 200?$ 2023-05-17
Marge de crédit 8?000?$
Revenus annuels nets visés 38?948?$ Moment de la retraite 11-2062 (65 ans) Droits CELI inutilisés 78?000?$ Sources de revenu annuel RRQ 25?958?$ 11-2062 (65 ans) SV 8?908?$ 11-2062 (65 ans)
`;
    const { plan, warnings } = parcoursTextToPlan(pdfjsLike);
    expect(plan.revenues[0].monthlyAmount).toBeCloseTo(80000 / 12, 0);
    expect(plan.assets.filter((a) => a.type === 'reer').reduce((s, a) => s + a.currentBalance, 0)).toBe(
      24112 + 11490,
    );
    expect(plan.debts[0].currentBalance).toBe(210941);
    expect(plan.deathNeeds.policies.reduce((s, p) => s + p.amount, 0)).toBe(450000);
    expect(warnings.some((w) => /Aucun actif/i.test(w))).toBe(false);
  });

  test('maps sample Mon parcours financier extract', () => {
    if (!fs.existsSync(FIXTURE)) {
      console.warn('skip: fixture PDF extract missing');
      return;
    }
    const text = fs.readFileSync(FIXTURE, 'utf8');
    const { plan, warnings } = parcoursTextToPlan(text);

    expect(plan.person.firstName.toUpperCase()).toContain('PIERRE');
    expect(plan.person.birthYear).toBe(1997);
    expect(plan.person.maritalStatus).toBe('conjoint');
    expect(plan.scope.conjoint).toBe(true);

    expect(plan.revenues[0].monthlyAmount).toBeCloseTo(80000 / 12, 0);
    const reerTotal = plan.assets
      .filter((a) => a.type === 'reer')
      .reduce((s, a) => s + a.currentBalance, 0);
    expect(reerTotal).toBe(24112 + 11490);
    expect(plan.assets.some((a) => a.type === 'immobilier' && a.currentBalance === 290000)).toBe(true);
    expect(plan.debts[0].currentBalance).toBe(210941);

    expect(plan.deathNeeds.policies.reduce((s, p) => s + p.amount, 0)).toBe(450000);
    expect(plan.disabilityNeeds.policies[0].amount).toBe(700);
    expect(plan.criticalIllnessNeeds.policies[0].amount).toBe(50000);
    expect(plan.emergency.creditLine).toBe(8000);
    expect(plan.contributionRoom.celi).toBe(78000);
    expect(plan.retirement.publicPensions.some((p) => p.type === 'RRQ' && p.annualAmount > 0)).toBe(true);
    expect(plan.objectives.length).toBeGreaterThan(3);
    expect(Array.isArray(warnings)).toBe(true);
  });
});
