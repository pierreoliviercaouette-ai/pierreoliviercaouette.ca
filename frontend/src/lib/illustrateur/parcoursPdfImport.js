/**
 * Convertit le texte d’un PDF « Mon parcours financier » (outil interne)
 * en plan JSON importable dans l’illustrateur patrimonial (session locale).
 */

import { DEFAULT_TAX_RATES } from './investmentPlanningService';
import { newId } from './ids';
import { OBJECTIVE_CATEGORIES } from './objectivesCatalog';
import { emptyBudgetState } from './budgetCatalog';
import {
  emptyContributionRoom,
  emptyCriticalIllnessNeeds,
  emptyDeathNeeds,
  emptyDisabilityNeeds,
  emptyEmergency,
  emptyPerson,
  emptyRetirement,
  emptyScope,
  emptySpouse,
} from './planDefaults';
import { emptyModulesState } from './planningModules';
import { extractPdfText } from '../portfolioFicheParse';

/** Capture d’un montant avant $ (espaces FR + glitch pdf.js « ? »). */
const MONEY_CAP = String.raw`([\d\s\u00a0\u202f\u2009?.,]+)`;

/** Parse montants FR : 24 112 $, 80 000 $, 80?000?$ (pdf.js), 210941$ */
export function parseMoney(raw) {
  if (raw == null) return null;
  let s = String(raw).trim();
  if (!s || s === '-' || s === '—') return null;
  // pdf.js remplace souvent l’espace fine / insécable par « ? »
  s = s.replace(/\?(?=\d)/g, '').replace(/\?(?=\$)/g, '');
  s = s
    .replace(/\s/g, '')
    .replace(/\u00a0|\u202f|\u2009/g, '')
    .replace(/\?/g, '')
    .replace(/\$/g, '')
    .replace(/[^\d,.-]/g, '')
    .replace(/\.(?=\d{3}(?:\D|$))/g, '')
    .replace(/,/g, '.');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

function norm(text) {
  return String(text || '')
    .replace(/\u00a0|\u202f|\u2009/g, ' ')
    .replace(/\u2019|\u2018|\x92/g, "'")
    // pdf.js : séparateur milliers rendu « ? » → espace (ex. 24?112?$ → 24 112 $)
    .replace(/(\d)\?(?=\d)/g, '$1 ')
    .replace(/\?(?=\s*\$)/g, ' ')
    .replace(/\s+/g, ' ');
}

function moneyRe(labelPattern, flags = 'i') {
  return new RegExp(`${labelPattern}\\s*${MONEY_CAP}\\s*\\$`, flags);
}

function grab(text, re) {
  const m = text.match(re);
  return m ? m[1] : null;
}

function grabMoney(text, re) {
  return parseMoney(grab(text, re));
}

function splitName(full) {
  const parts = String(full || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function mapMarital(status) {
  const s = (status || '').toLowerCase();
  if (s.includes('conjoint')) return 'conjoint';
  if (s.includes('mari')) return 'marie';
  if (s.includes('divorc')) return 'divorce';
  if (s.includes('veuf') || s.includes('veuve')) return 'veuf';
  return 'celibataire';
}

function mapSex(sex) {
  const s = (sex || '').toLowerCase();
  if (s.startsWith('f') || s.includes('femme')) return 'F';
  return 'M';
}

function parseBirth(iso) {
  const m = String(iso || '').match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return { birthYear: '', birthMonth: '', birthDay: '' };
  return {
    birthYear: Number(m[1]),
    birthMonth: String(Number(m[2])),
    birthDay: Number(m[3]),
  };
}

function matchObjectives(text) {
  const found = [];
  for (const cat of OBJECTIVE_CATEGORIES) {
    for (const item of cat.items) {
      const needle = item.label.replace(/[’']/g, "'").slice(0, 28);
      if (text.includes(needle) || text.toLowerCase().includes(needle.toLowerCase())) {
        found.push({
          id: newId('obj'),
          catalogId: item.id,
          categoryId: cat.id,
          label: item.label,
          notes: '',
        });
      }
    }
  }
  return found;
}

function extractPersonal(text) {
  const fullName =
    grab(text, /Pr[ée]par[ée]\s+à\s+l['']intention\s+de\s*:\s*([A-ZÀ-Ü][A-ZÀ-Ü\s-]+?)(?:\s+Votre|\s+Parcours|$)/i) ||
    grab(text, /Monsieur\s+([A-ZÀ-Ü][A-ZÀ-Ü\s-]+?),\s*Monparcours/i) ||
    grab(text, /PIERRE-OLIVIER\s+CAOUETTE/);

  // Prefer "Vos informations" block (collé ou espacé)
  const infoIdx = text.search(/Vos\s*informations/i);
  const block = infoIdx >= 0 ? text.slice(infoIdx, infoIdx + 900) : text;

  const birthIso = grab(block, /Date de naissance\s*(\d{4}-\d{2}-\d{2})/i);
  const sex = grab(block, /Sexe\s+(Homme|Femme|M|F)/i);
  const marital = grab(block, /[ÉE]tat civil\s*([^U]+?)(?:Usage du tabac|Cellulaire)/i);
  const tobacco = /Usage du tabac\s*Oui/i.test(block);
  const email = grab(block, /Courriel personnel\s*([^\s]+@[^\s]+)/i);
  const phone = grab(block, /Cellulaire\s*([\d\s-]+)/i);
  const province = /Province d'imposition\s*Qu[ée]bec/i.test(block) ? 'QC' : 'QC';
  const job = grab(block, /Emploi\s*(.+?)(?:Revenu annuel brut|Employeur)/i);
  const employer = grab(block, /Employeur\s*(.+?)(?:Autres d[ée]ductions|Date de l'emploi|$)/i);
  const gross = grabMoney(block, moneyRe('Revenu annuel brut'));

  const name =
    (fullName || '')
      .replace(/Votre conseiller.*/i, '')
      .replace(/Conseiller.*/i, '')
      .trim() || 'Client importé';

  return {
    ...splitName(name),
    ...parseBirth(birthIso),
    sex: mapSex(sex),
    maritalStatus: mapMarital(marital),
    tobacco,
    email: email || '',
    phone: (phone || '').replace(/\s+/g, ' ').trim(),
    province,
    job: (job || '').trim(),
    employer: (employer || '').trim(),
    grossAnnual: gross || 0,
    clientLabel: name,
  };
}

function extractBilan(text) {
  const assets = [];
  const debts = [];

  // Page bilan résumé
  const reer = grabMoney(text, moneyRe('REER(?!\\s*collectif)'));
  const reerColl = grabMoney(text, moneyRe('REER collectif'));
  const home = grabMoney(text, moneyRe('R[ée]sidence principale'));
  const mortgage = grabMoney(text, moneyRe('Pr[êe]t hypoth[ée]caire'));

  // Détail placements (page inventaire)
  const reerReturn = grab(text, /REER(?:\s*REER)?\s*1[^%]*?\(([\d.,]+)\s*%\)/i);
  const reerCollReturn = grab(text, /REER collectif\s*1[^%]*?\(([\d.,]+)\s*%\)/i);
  const mortgageRate = grab(text, /Pr[êe]t hypoth[ée]caire\s*1[^%]*?([\d.,]+)\s*%/i);
  const mortgageAmort = grab(
    text,
    new RegExp(String.raw`([\d]+)\s*ans\s*${MONEY_CAP}\s*\$\s*/\s*aux deux`, 'i'),
  );
  const mortgagePayment = grabMoney(
    text,
    new RegExp(String.raw`ans\s*${MONEY_CAP}\s*\$\s*/\s*aux deux`, 'i'),
  );

  if (reer != null) {
    assets.push({
      key: 'reer',
      name: 'REER',
      type: 'reer',
      currentBalance: reer,
      avgAnnualReturn: parseFloat(String(reerReturn || '3.8').replace(',', '.')) || 3.8,
      institution: /Desjardins/.test(text) ? 'Desjardins' : '',
    });
  }
  if (reerColl != null) {
    assets.push({
      key: 'reer_coll',
      name: 'REER collectif',
      type: 'reer',
      currentBalance: reerColl,
      avgAnnualReturn: parseFloat(String(reerCollReturn || '4.1').replace(',', '.')) || 4.1,
      institution: 'iA Groupe financier',
    });
  }
  if (home != null) {
    assets.push({
      key: 'home',
      name: 'Résidence principale',
      type: 'immobilier',
      currentBalance: home,
      avgAnnualReturn: 3,
      principalResidence: true,
      _acb: home,
    });
  }

  // Credit line from emergency page
  const creditLine = grabMoney(text, moneyRe('Marge de cr[ée]dit'));

  if (mortgage != null) {
    const biweekly = mortgagePayment || 0;
    debts.push({
      key: 'mortgage',
      name: 'Prêt hypothécaire',
      type: 'hypotheque',
      currentBalance: mortgage,
      interestRate: parseFloat(String(mortgageRate || '5.9').replace(',', '.')) || 5.9,
      amortizationRemaining: mortgageAmort ? Number(mortgageAmort[1]) : 24,
      monthlyPayment: biweekly ? Math.round(biweekly * 26) / 12 : 0,
    });
  }
  if (creditLine != null && creditLine > 0) {
    // Disponible — pas nécessairement utilisé; stocké pour urgence seulement
  }

  return { assets, debts, creditLine: creditLine || 0 };
}

function extractInsurance(text) {
  const life = [];
  const disability = [];
  const ci = [];

  // Temporaire / Entière (collé pypdf ou espacé pdf.js)
  const lifeRe = new RegExp(
    String.raw`(Temporaire|Enti[eèé]re)\s*\d*\s*[A-ZÀ-Ü][A-ZÀ-Ü\s-]*?(Beneva|Desjardins|Empire\s*Vie|iA|Sun\s*Life|Manuvie)[^\d]*${MONEY_CAP}\s*\$\s*${MONEY_CAP}\s*\$\s*(\d{4}-\d{2}-\d{2})`,
    'gi',
  );
  let lifeMatch;
  while ((lifeMatch = lifeRe.exec(text)) !== null) {
    const kind = lifeMatch[1].toLowerCase();
    life.push({
      type: kind.startsWith('temp') ? 'temporaire' : 'permanente',
      insurer: lifeMatch[2].replace(/\s+/g, ' ').trim(),
      amount: parseMoney(lifeMatch[3]) || 0,
      annualPremium: parseMoney(lifeMatch[4]) || 0,
      issueDate: lifeMatch[5],
    });
  }

  // Fallback: "Assurance vie 50 000 $" on death available
  const lifeAvail = grabMoney(text, moneyRe('Assurance vie'));

  const dis = text.match(
    new RegExp(
      String.raw`Individuel[A-ZÀ-Ü\s-]*?(Beneva|Desjardins|Empire\s*Vie|iA)[^\d]*${MONEY_CAP}\s*\$\s*${MONEY_CAP}\s*\$\s*(\d{4}-\d{2}-\d{2})\s*(\d+)\s*jours`,
      'i',
    ),
  );
  if (dis) {
    disability.push({
      insurer: dis[1],
      amount: parseMoney(dis[2]) || 0,
      annualPremium: parseMoney(dis[3]) || 0,
      issueDate: dis[4],
      waitingDays: Number(dis[5]) || 30,
    });
  } else {
    const disAmt = grabMoney(text, moneyRe('Assurance invalidit[ée](?:\\s*long\\s*terme)?'));
    if (disAmt != null) disability.push({ amount: disAmt, annualPremium: 0, waitingDays: 30 });
  }

  const ciMatch = text.match(
    new RegExp(
      String.raw`Assurance\s*maladie\s*grave[\s\S]{0,280}?Individuel[A-ZÀ-Ü\s-]*?(Beneva|Desjardins|Empire\s*Vie|iA)[^\d]*${MONEY_CAP}\s*\$\s*${MONEY_CAP}\s*\$\s*(\d{4}-\d{2}-\d{2})`,
      'i',
    ),
  );
  if (ciMatch) {
    ci.push({
      insurer: ciMatch[1],
      amount: parseMoney(ciMatch[2]) || 0,
      annualPremium: parseMoney(ciMatch[3]) || 0,
      issueDate: ciMatch[4],
    });
  } else {
    const ciAmt = grabMoney(text, moneyRe('Assurance maladie grave'));
    if (ciAmt != null) ci.push({ amount: ciAmt, annualPremium: 0 });
  }

  return { life, disability, ci, lifeAvail };
}

function extractDeathNeeds(text) {
  const expensesDeath = grabMoney(text, moneyRe('Frais li[ée]s au d[ée]c[èe]s')) || 15000;
  const rrq = grabMoney(text, moneyRe('Prestation de d[ée]c[èe]s RPC\\/RRQ')) || 2500;
  const replacePct = grabMoney(text, /Revenu cible\s*\((\d+)\s*%/) || 70;
  const years =
    grabMoney(text, /Revenu manquant\s*projet[ée]\s+pendant\s+(\d+)\s+ans/i) ||
    grabMoney(text, /pendant\s+(\d+)\s+ans/i) ||
    25;
  const discount = grabMoney(text, /taux de rendement de\s*([\d.,]+)\s*%/i) || 3.4;
  return { expensesDeath, rrq, replacePct, years, discount };
}

function extractDisability(text) {
  const needsMonthly = grabMoney(text, moneyRe('Remplacement du revenu'));
  const available = grabMoney(text, moneyRe('Assurance invalidit[ée](?:\\s*long\\s*terme)?'));
  return { needsMonthly, available };
}

function extractCriticalIllness(text) {
  const clientMonths = /Remplacement du revenu de[^\d]*\((\d+)\s*mois\)/i.exec(text);
  const clientIncome = grabMoney(
    text,
    new RegExp(String.raw`Remplacement du revenu de[^\d]*\(\d+\s*mois\)\s*${MONEY_CAP}\s*\$`, 'i'),
  );
  const caregiverMatch = text.match(
    new RegExp(
      String.raw`Remplacement du revenu de\s*l'aidant\s*\((\d+)\s*mois\)\s*${MONEY_CAP}\s*\$`,
      'i',
    ),
  );
  const caregiver = caregiverMatch ? parseMoney(caregiverMatch[2]) : null;
  const caregiverMonths = caregiverMatch?.[1] || grab(text, /aidant\s*\((\d+)\s*mois\)/i);
  const monthlyExtra = grabMoney(
    text,
    new RegExp(String.raw`D[ée]penses mensuelles li[ée]es[^\d]*\(\d+\s*mois\)\*?\s*${MONEY_CAP}\s*\$`, 'i'),
  );
  const uniqueExtra = grabMoney(
    text,
    new RegExp(String.raw`D[ée]penses uniques li[ée]es[^\d]*\*?\*?\s*${MONEY_CAP}\s*\$`, 'i'),
  );
  return {
    clientMonths: clientMonths ? Number(clientMonths[1]) : 12,
    clientIncomeTotal: clientIncome,
    caregiverMonths: caregiverMonths ? Number(caregiverMonths) : 6,
    caregiverTotal: caregiver,
    monthlyExtra,
    uniqueExtra,
  };
}

function extractEmergency(text) {
  const required = grabMoney(text, moneyRe('3 mois de d[ée]penses mensuelles'));
  const credit = grabMoney(text, moneyRe('Marge de cr[ée]dit'));
  return {
    months: 3,
    monthlyAmount: required != null ? Math.round(required / 3) : 1500,
    creditLine: credit || 0,
  };
}

function extractRetirement(text) {
  const targetNet =
    grabMoney(text, moneyRe('Revenus\\s*annuels\\s*nets\\s*vis[ée]s')) ||
    grabMoney(text, moneyRe('Revenusannuelsnetsvis[ée]s'));
  const retireAge =
    grabMoney(text, /\((\d+)\s*ans\)\s*[ÂA]ge\s*actuel/i) ||
    grabMoney(text, /Moment\s*de\s*la\s*retraite[^\d]*\((\d+)\s*ans\)/i) ||
    grabMoney(text, /Momentdelaretraite[^\d]*\((\d+)\s*ans\)/i);
  const lifeExp =
    grabMoney(text, /Esp[ée]rance\s*de\s*vie\s*(\d+)\s*ans/i) ||
    grabMoney(text, /Esp[ée]rancedevie\s*(\d+)\s*ans/i);
  const reerRoom =
    grabMoney(text, moneyRe('Droits\\s*REER\\/RPAC\\s*inutilis[ée]s')) ||
    grabMoney(text, moneyRe('DroitsREER\\/RPACinutilis[ée]s'));
  const celiRoom =
    grabMoney(text, moneyRe('Droits\\s*CELI\\s*inutilis[ée]s')) ||
    grabMoney(text, moneyRe('DroitsCELIinutilis[ée]s'));
  const celiappRoom =
    grabMoney(text, moneyRe('Droits\\s*CELIAPP\\s*inutilis[ée]s')) ||
    grabMoney(text, moneyRe('DroitsCELIAPPinutilis[ée]s'));
  const rrq =
    grabMoney(text, moneyRe('Sources\\s*de\\s*revenu\\s*annuel\\s*RRQ')) ||
    grabMoney(text, moneyRe('SourcesderevenuannuelRRQ'));
  const sv = grabMoney(text, new RegExp(String.raw`SV\s*${MONEY_CAP}\s*\$\s*\d{1,2}-\d{4}`, 'i'));
  const profile =
    grab(text, /Avant\s*la\s*retraite\s+([A-Za-zÉéèàùâêîôûç]+)\s*\(([\d.,]+)\s*%\)/i) ||
    grab(text, /Avantlaretraite\s+([A-Za-zÉéèàùâêîôûç]+)\s*\(([\d.,]+)\s*%\)/i);
  const returnPct = profile ? parseFloat(String(profile[2]).replace(',', '.')) : 4.1;
  return {
    targetNet: targetNet || 0,
    retireAge: retireAge || 65,
    lifeExpectancy: lifeExp || 95,
    reerRoom: reerRoom || 0,
    celiRoom: celiRoom || 0,
    celiappRoom: celiappRoom || 0,
    rrq: rrq || 0,
    sv: sv || 0,
    returnPct: Number.isFinite(returnPct) ? returnPct : 4.1,
  };
}

function extractRecommendations(text) {
  const recs = [];
  const chunk = text.includes('Assurance auto et habitation')
    ? text.slice(text.indexOf('Assurance auto et habitation'), text.indexOf('Assurance auto et habitation') + 1200)
    : '';
  const blocks = [
    ['assurance_auto', /Assurance auto et habitation(.+?)(?=Testament|Personnes-ressources|Taux|$)/i],
    ['testament', /Testament(.+?)(?=Personnes-ressources|Taux|Assurance|$)/i],
    ['hypotheque', /Taux hypoth[ée]caires(.+?)(?=Assurance|$)/i],
  ];
  for (const [domain, re] of blocks) {
    const m = (chunk || text).match(re);
    if (m) {
      recs.push({
        id: newId('rec'),
        domain,
        text: m[1].replace(/\s+/g, ' ').trim().slice(0, 500),
      });
    }
  }
  return recs;
}

/**
 * @param {string} rawText — texte extrait du PDF parcours
 * @returns {{ plan: object, warnings: string[], meta: object }}
 */
export function parcoursTextToPlan(rawText) {
  const text = norm(rawText);
  const warnings = [];

  if (!/parcours|PIERRE-OLIVIER|Vos\s*informations|Date de naissance/i.test(text)) {
    warnings.push('Le PDF ne ressemble pas à un « Mon parcours financier » — import best-effort.');
  }

  const personal = extractPersonal(text);
  const bilan = extractBilan(text);
  const insurance = extractInsurance(text);
  const death = extractDeathNeeds(text);
  const disability = extractDisability(text);
  const ci = extractCriticalIllness(text);
  const emergency = extractEmergency(text);
  const retirement = extractRetirement(text);
  const objectives = matchObjectives(text);
  const recommendations = extractRecommendations(text);

  const personId = newId('ent');
  const now = new Date().toISOString();
  const hasSpouse = personal.maritalStatus === 'conjoint' || personal.maritalStatus === 'marie';

  const assets = bilan.assets.map((a) => ({
    id: newId('ast'),
    name: a.name,
    type: a.type,
    entityId: personId,
    currentBalance: a.currentBalance,
    monthlyContribution: 0,
    avgAnnualReturn: a.avgAnnualReturn,
    principalResidence: Boolean(a.principalResidence),
    ...(a._acb != null ? { _acb: a._acb } : {}),
    ...(a.institution ? { institution: a.institution } : {}),
  }));

  const debts = bilan.debts.map((d) => ({
    id: newId('debt'),
    name: d.name,
    type: d.type,
    entityId: personId,
    currentBalance: d.currentBalance,
    interestRate: d.interestRate,
    monthlyPayment: d.monthlyPayment,
    amortizationRemaining: d.amortizationRemaining,
  }));

  const lifePolicies = (insurance.life.length
    ? insurance.life
    : insurance.lifeAvail
      ? [{ type: 'permanente', amount: insurance.lifeAvail, annualPremium: 0 }]
      : []
  ).map((p) => ({
    id: newId('pol'),
    type: p.type || 'temporaire',
    insured: personal.clientLabel,
    amount: p.amount || 0,
    annualPremium: p.annualPremium || 0,
    insurer: p.insurer || '',
  }));

  const monthlyGross = (personal.grossAnnual || 0) / 12;
  const revenues =
    monthlyGross > 0
      ? [
          {
            id: newId('rev'),
            name: personal.job || 'Salaire',
            type: 'salaire',
            entityId: personId,
            monthlyAmount: Math.round(monthlyGross * 100) / 100,
            growthRate: 0,
          },
        ]
      : [];

  if (!assets.length) warnings.push('Aucun actif détecté dans le PDF.');
  if (!personal.grossAnnual) warnings.push('Revenu annuel brut non détecté.');
  if (!lifePolicies.length) warnings.push('Polices d’assurance vie non détectées clairement.');

  const deathNeeds = {
    ...emptyDeathNeeds(),
    policies: lifePolicies,
    rrqDeathBenefit: death.rrq,
    expenses: [
      { id: newId('exp'), description: 'Frais liés au décès', amount: death.expensesDeath, indexed: false },
    ],
    incomeReplacePct: death.replacePct,
    incomeReplaceYears: death.years,
    discountRate: death.discount,
    repayDebtIds: debts.map((d) => d.id),
    liquidateAssetIds: assets.filter((a) => a.type === 'reer' || a.type === 'celi').map((a) => a.id),
    spousalRollover: hasSpouse ? true : false,
    principalResidenceAssetIds: assets.filter((a) => a.principalResidence).map((a) => a.id),
  };

  const disabilityNeeds = {
    ...emptyDisabilityNeeds(),
    policies: (insurance.disability.length ? insurance.disability : [{ amount: disability.available || 0 }]).map(
      (p) => ({
        id: newId('pol'),
        amount: p.amount || 0,
        annualPremium: p.annualPremium || 0,
        insurer: p.insurer || '',
      }),
    ),
    replacePct: 70,
    waitingDays: insurance.disability[0]?.waitingDays || 30,
  };

  const criticalIllnessNeeds = {
    ...emptyCriticalIllnessNeeds(),
    policies: (insurance.ci.length ? insurance.ci : []).map((p) => ({
      id: newId('pol'),
      amount: p.amount || 0,
      annualPremium: p.annualPremium || 0,
      insurer: p.insurer || '',
    })),
    clientMonths: ci.clientMonths || 12,
    clientMonthlyIncome:
      ci.clientIncomeTotal && ci.clientMonths
        ? Math.round(ci.clientIncomeTotal / ci.clientMonths)
        : Math.round(((personal.grossAnnual || 0) * 0.7) / 12),
    caregiverMonths: ci.caregiverMonths || 6,
    caregiverMonthly:
      ci.caregiverTotal && ci.caregiverMonths ? Math.round(ci.caregiverTotal / ci.caregiverMonths) : 0,
    protectionLevel: 'confort',
    extras: {
      ...emptyCriticalIllnessNeeds().extras,
      uninsuredTreatment: ci.uniqueExtra || 0,
      other: ci.monthlyExtra && ci.clientMonths ? Math.round(ci.monthlyExtra) : 0,
    },
  };

  const plan = {
    meta: {
      name: personal.clientLabel || 'Import parcours',
      clientLabel: personal.clientLabel,
      notes: `Importé depuis PDF « Mon parcours financier » le ${now.slice(0, 10)}. Illustration — vérifier les montants.`,
      createdAt: now,
      updatedAt: now,
      source: 'parcours-financier-pdf',
    },
    horizonYears: 25,
    deathScenarioYear: null,
    scope: { ...emptyScope(), conjoint: hasSpouse, corporatif: false },
    entities: [
      {
        id: personId,
        name: 'Personnel',
        type: 'personnel',
        province: personal.province || 'QC',
        marginalTaxRate: DEFAULT_TAX_RATES.personnel,
      },
    ],
    assets,
    debts,
    revenues,
    events: [],
    needs: {
      hypotheque: debts.find((d) => d.type === 'hypotheque')?.currentBalance || 0,
      pret_auto: 0,
      cartes: 0,
      marge_credit: 0,
      autres_dettes: 0,
      revenu_net: Math.round(monthlyGross * 0.7),
      pct_remplacer: death.replacePct,
      nb_annees: death.years,
      revenu_conjoint: 0,
      etudes: 30000,
      nb_enfants: 0,
      urgence: emergency.monthlyAmount * emergency.months,
      funerailles: death.expensesDeath,
      legs: 0,
      av_actuelle: lifePolicies.reduce((s, p) => s + (p.amount || 0), 0),
      av_groupe: 0,
      epargnes: 0,
      invalidite_revenu: monthlyGross,
      invalidite_remplacement_pct: 70,
      invalidite_collective_pct: 0,
      maladie_grave_cible: criticalIllnessNeeds.policies.reduce((s, p) => s + (p.amount || 0), 0) || 50000,
    },
    scenarios: [],
    workflow: { step: 'hub' },
    priorities: ['assurance_vie', 'invalidite', 'maladie_grave'],
    nextStepsNotes: recommendations.map((r) => r.text).join('\n\n'),
    person: {
      ...emptyPerson(),
      firstName: personal.firstName,
      lastName: personal.lastName,
      birthDay: personal.birthDay,
      birthMonth: personal.birthMonth,
      birthYear: personal.birthYear,
      sex: personal.sex,
      maritalStatus: personal.maritalStatus,
      province: personal.province,
      email: personal.email,
      tobacco: personal.tobacco,
      planType: hasSpouse ? 'conjoint' : 'individuel',
      spouse: emptySpouse(),
      children: [],
    },
    objectives,
    contributionRoom: {
      ...emptyContributionRoom(),
      reer: retirement.reerRoom,
      celi: retirement.celiRoom,
      celiapp: retirement.celiappRoom,
    },
    emergency: {
      ...emptyEmergency(),
      base: 'depenses',
      months: emergency.months,
      monthlyAmount: emergency.monthlyAmount,
      creditLine: emergency.creditLine || bilan.creditLine || 0,
      allocatedAssetIds: [],
    },
    deathNeeds,
    disabilityNeeds,
    criticalIllnessNeeds,
    projects: [],
    retirement: {
      ...emptyRetirement(),
      replacePct: personal.grossAnnual
        ? Math.round(((retirement.targetNet || 0) / (personal.grossAnnual * 0.7 || 1)) * 100)
        : 70,
      replaceAmount: retirement.targetNet,
      incomeUnit: 'cad',
      targetAge: retirement.retireAge,
      profileBefore: 'audacieux',
      profileDuring: 'audacieux',
      publicPensions: [
        {
          id: newId('pen'),
          type: 'RRQ',
          annualAmount: retirement.rrq,
          frequency: 'annuel',
          indexed: true,
          startAge: retirement.retireAge,
        },
        {
          id: newId('pen'),
          type: 'SV',
          annualAmount: retirement.sv,
          frequency: 'annuel',
          indexed: true,
          startAge: retirement.retireAge,
        },
      ],
      decumulationAssetIds: assets.filter((a) => a.type === 'reer' || a.type === 'celi').map((a) => a.id),
    },
    recommendations,
    savings: [],
    modules: emptyModulesState(),
    budget: emptyBudgetState(),
  };

  // Seed budget net income
  plan.budget.netIncomeAnnual = Math.round((personal.grossAnnual || 0) * 0.7);

  return {
    plan,
    warnings,
    meta: {
      source: 'Mon parcours financier',
      importedAt: now,
      clientLabel: personal.clientLabel,
    },
  };
}

/** Lit un File/Blob PDF parcours → plan importable. */
export async function importParcoursPdfFile(file) {
  const buffer = await file.arrayBuffer();
  const text = await extractPdfText(buffer);
  if (!text || text.trim().length < 80) {
    throw new Error('Impossible d’extraire le texte du PDF parcours.');
  }
  const result = parcoursTextToPlan(text);
  return result;
}

/** Envelope JSON compatible exportPlanJson / parseImportedPlan. */
export function wrapPlanExport(plan, extra = {}) {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    product: 'illustrateur-patrimonial',
    source: 'parcours-financier-pdf',
    ...extra,
    plan,
  };
}
