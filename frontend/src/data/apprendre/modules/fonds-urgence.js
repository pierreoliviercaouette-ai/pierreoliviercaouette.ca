/**
 * Mini-formation — Fonds d’urgence (niveau base).
 * Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'fonds-urgence',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Fonds d’urgence',
  subtitle: 'Liquidité avant d’investir',
  shortDescription:
    'Combien mettre de côté, où le ranger, et pourquoi ce coussin vient avant un CELI de placement ou un REER plus agressif.',
  readMinutes: 12,
  keyFacts: [
    { label: 'Ordre de grandeur', value: '3 à 6 mois de dépenses essentielles' },
    { label: 'Où le garder', value: 'Compte accessible, faible risque' },
    { label: 'Priorité', value: 'Avant l’investissement volatil' },
  ],
  sections: [
    {
      heading: 'Pourquoi bâtir ce coussin d’abord',
      paragraphs: [
        'Un fonds d’urgence est une réserve pour les imprévus qui menacent le budget : perte d’emploi, réparation majeure, frais médicaux non remboursés, bris de voiture. Ce n’est ni l’épargne vacances ni la mise de fonds d’une maison.',
        'Sans ce coussin, un coup dur pousse souvent vers la carte de crédit, une marge de crédit ou un retrait du régime enregistré d’épargne-retraite (REER) — imposable, avec des droits de cotisation perdus. Le fonds protège le reste de votre plan.',
        'Tant que le coussin est trop mince, placer tout le surplus en placements volatils augmente le risque de devoir vendre au mauvais moment. La liquidité vient avant le rendement.',
      ],
    },
    {
      heading: 'Combien viser selon votre situation',
      paragraphs: [
        'La cible la plus courante : trois à six mois de dépenses essentielles — logement, nourriture, transport, assurances, minimums de dettes. Un revenu stable à deux salaires peut viser plutôt trois mois ; un travail autonome ou un seul revenu, plutôt six mois ou plus.',
        'Calculez à partir de vos dépenses réelles (relevés), pas du revenu brut. Multipliez ce montant mensuel par trois ou six selon la fourchette qui vous convient.',
        'Vous n’avez pas besoin d’atteindre la cible d’un coup. Un premier palier (par exemple un mois) réduit déjà le stress ; vous augmentez ensuite jusqu’à la fourchette choisie.',
      ],
    },
    {
      heading: 'Où ranger l’argent sans le risquer',
      paragraphs: [
        'L’objectif n’est pas le rendement maximal : c’est la disponibilité et la stabilité. Un compte d’épargne à intérêt élevé, un certificat de placement garanti (CPG) rachetable ou un compte d’épargne libre d’impôt (CELI) en liquidités conviennent souvent.',
        'Évitez d’immobiliser tout le coussin dans des actions ou des fonds qui peuvent baisser juste quand vous en avez besoin. Un peu d’intérêt, oui ; une chute marquée au mauvais moment, non.',
        'Si le coussin est dans un CELI : un retrait ne recrée des droits de cotisation qu’au 1er janvier suivant. Gardez assez de droits — ou acceptez d’attendre — si vous pourriez devoir recontribuer la même année.',
      ],
    },
    {
      heading: 'Comment le bâtir mois après mois',
      paragraphs: [
        'Virez un montant fixe à chaque paie, même modeste. Traitez-le comme une facture : le virement part avant le reste. Une fois la cible atteinte, orientez le surplus vers le REER, le CELI de placement ou le remboursement de dettes à intérêt élevé — selon votre situation.',
        'Une prime ou un remboursement d’impôt peut accélérer le coussin sans toucher au budget courant. Après chaque utilisation, reconstituez le fonds avant d’augmenter d’autres cotisations.',
      ],
      bullets: [
        'Listez vos dépenses essentielles mensuelles avant de fixer un montant.',
        'Séparez urgence, projets et retraite — idéalement en comptes distincts.',
        'Automatisez un virement à chaque paie, même modeste.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Sam vise six mois',
    intro:
      'Sam dépense 3 500 $ par mois en essentiels. Travail autonome : cible de six mois. Chiffres illustratifs.',
    steps: [
      {
        label: 'Cible',
        detail: '3 500 $ × 6 = 21 000 $.',
      },
      {
        label: 'Déjà de côté',
        detail: 'Sam a 6 000 $ en compte d’épargne accessible.',
      },
      {
        label: 'Écart',
        detail: '21 000 $ − 6 000 $ = 15 000 $ à accumuler.',
      },
      {
        label: 'Rythme',
        detail:
          'À 625 $ par mois, l’écart se comble en 24 mois. Ensuite, Sam pourra augmenter les cotisations CELI ou REER.',
      },
    ],
    result:
      'Cible 21 000 $, écart 15 000 $, plan sur 24 mois à 625 $/mois — sans toucher aux placements volatils pour les imprévus.',
  },
  timeline: {
    title: 'Ligne du temps — constitution du coussin',
    caption: 'De 6 000 $ à 21 000 $ à raison de 625 $ par mois.',
    events: [
      { at: 'Départ', title: 'Solde actuel', amount: '6 000 $', note: 'Compte accessible' },
      { at: '12 mois', title: 'À mi-parcours', amount: '13 500 $', note: '6 000 + 12 × 625' },
      {
        at: '24 mois',
        title: 'Cible atteinte',
        amount: '21 000 $',
        note: 'Six mois d’essentiels',
        emphasis: true,
      },
      { at: 'Ensuite', title: 'Surplus', amount: '→ CELI / REER', note: 'Ou dettes à taux élevé' },
    ],
    chart: {
      type: 'line',
      series: [{ key: 'solde', name: 'Fonds d’urgence ($)' }],
      points: [
        { at: '0', solde: 6000 },
        { at: '6 mois', solde: 9750 },
        { at: '12 mois', solde: 13500 },
        { at: '18 mois', solde: 17250 },
        { at: '24 mois', solde: 21000 },
      ],
    },
  },
  takeaways: [
    'Visez 3 à 6 mois de dépenses essentielles, selon la stabilité du revenu.',
    'Priorité : accessibilité et stabilité, pas le rendement maximal.',
    'Bâtissez par virements automatiques, puis orientez le surplus ailleurs.',
    'Reconstituez le coussin après chaque retrait d’urgence.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'fu-q1',
        prompt: 'Dans l’exemple, la cible de Sam (3 500 $/mois × 6) est de…',
        choices: ['10 500 $', '21 000 $', '42 000 $'],
        correctIndex: 1,
        explanation: '3 500 × 6 = 21 000 $.',
      },
      {
        id: 'fu-q2',
        prompt: 'Le fonds d’urgence sert surtout à…',
        choices: [
          'Maximiser le rendement boursier',
          'Absorber des imprévus sans s’endetter ou raider le REER',
          'Remplacer le CELI et le REER',
        ],
        correctIndex: 1,
        explanation: 'C’est un coussin de liquidité, pas un véhicule de rendement.',
      },
      {
        id: 'fu-q3',
        prompt: 'Où ranger typiquement ce coussin ?',
        choices: [
          '100 % en actions individuelles',
          'Compte accessible à faible risque (épargne, CPG liquide, CELI liquide)',
          'Uniquement dans un FERR',
        ],
        correctIndex: 1,
        explanation: 'La disponibilité prime sur le potentiel de gain.',
      },
    ],
  },
  diagram: {
    title: 'Ordre de construction',
    type: 'flow',
    nodes: [
      { id: 'budget', label: 'Dépenses essentielles', hint: 'Montant mensuel réel' },
      { id: 'cible', label: 'Cible 3–6 mois', hint: 'Selon stabilité du revenu', emphasis: true },
      { id: 'compte', label: 'Compte accessible', hint: 'Faible risque' },
      { id: 'suite', label: 'Surplus → objectifs', hint: 'CELI, REER, dettes' },
    ],
    edges: [
      { from: 'budget', to: 'cible' },
      { from: 'cible', to: 'compte', label: 'Virements' },
      { from: 'compte', to: 'suite', label: 'Cible atteinte' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Sam — 21 000 $',
    type: 'flow',
    nodes: [
      { id: 'dep', label: '3 500 $/mois', hint: 'Essentiels' },
      { id: 'cible', label: 'Cible 21 000 $', hint: '× 6 mois', emphasis: true },
      { id: 'ecart', label: 'Écart 15 000 $', hint: 'Après 6 000 $ déjà là' },
      { id: 'plan', label: '625 $/mois', hint: 'Sur 24 mois' },
    ],
    edges: [
      { from: 'dep', to: 'cible' },
      { from: 'cible', to: 'ecart' },
      { from: 'ecart', to: 'plan' },
    ],
  },
  sources: [
    {
      name: 'AMF — Budgétiser et épargner',
      url: 'https://lautorite.qc.ca/grand-public/finances-personnelles',
    },
    {
      name: 'ARC — CELI (si le coussin est dans un CELI)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot.html',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['celi', 'reer-ferr'],
  seoTitle: 'Fonds d’urgence | Mini-formation',
  seoDescription:
    'Combien viser pour un fonds d’urgence, où le placer et comment le bâtir avant d’investir.',
};
