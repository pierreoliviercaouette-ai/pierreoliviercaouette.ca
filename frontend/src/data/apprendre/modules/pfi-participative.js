/**
 * Mini-formation — Plan de financement immédiat (PFI).
 * Sources : AMF, iA, Institut de planification financière. Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'pfi-participative',
  audiences: ['prive'],
  category: 'corpo',
  title: 'Plan de financement immédiat (PFI)',
  subtitle: 'Levier sur une assurance vie participative — cadre prudent',
  shortDescription:
    'Comprendre la mécanique d’un PFI lié à une assurance vie permanente participative : besoin d’assurance réel, valeur de rachat en garantie, prêt, intérêts, et les risques du levier.',
  readMinutes: 15,
  keyFacts: [
    { label: 'Priorité', value: 'Besoin d’assurance réel d’abord' },
    { label: 'Garantie', value: 'Valeur de rachat cédée au prêteur' },
    { label: 'Risques', value: 'Taux, participations, marge, liquidité' },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’un PFI ?',
      paragraphs: [
        'Un plan de financement immédiat (PFI) combine une assurance vie permanente — souvent une vie entière avec participation — et un emprunt auprès d’une institution financière. La valeur de rachat (le montant que vous pourriez recevoir en résiliant le contrat) est cédée en garantie au prêteur.',
        'Les liquidités empruntées sont réinvesties dans une activité ou un bien qui doit produire un revenu. Ce n’est ni un produit unique ni une solution standard : police, primes, entente de prêt, cession de garantie et révision des ratios forment une structure pluriannuelle.',
        'L’assureur n’est en général pas partie au prêt : il est avisé de la cession, mais le crédit relève du prêteur. On ne souscrit jamais une assurance dans le seul but d’obtenir un prêt.',
      ],
    },
    {
      heading: 'Partir du besoin d’assurance',
      paragraphs: [
        'Le point de départ est un besoin d’assurance vie permanent réel : protection d’entreprise, rachat d’actions, personnes clés, ou transmission patrimoniale. Tant que ce besoin n’est pas établi indépendamment du financement, un PFI n’est pas à l’étude.',
        'La valeur de rachat sert de garantie. Le prêteur accepte en général une avance correspondant à une fraction de cette valeur — rarement la totalité. Le ratio exact dépend de ses politiques, du type de contrat et de la portion garantie versus illustrée des valeurs.',
        'Une police participative comporte souvent un capital de base (généralement garanti) et une valeur de rachat qui peut croître avec les primes et les participations. Les participations versées par l’assureur ne sont pas garanties : elles peuvent être réduites ou absentes selon les résultats du fonds de participation.',
      ],
    },
    {
      heading: 'Comment fonctionne le levier',
      paragraphs: [
        'Souvent, la société est titulaire et bénéficiaire d’une police sur la vie d’un actionnaire ou d’une personne clé. Elle verse les primes dans les limites du contrat exonéré. Une entente de prêt et de garantie est conclue avec un prêteur externe.',
        'L’emprunteur paie les intérêts — souvent à taux variable. Le levier amplifie les résultats favorables et défavorables : si les fonds empruntés rapportent moins que le coût du prêt, ou si les taux montent, le coût net se détériore vite.',
        'Il faut pouvoir payer primes et intérêts avec des liquidités propres, sans dépendre exclusivement de nouvelles avances. La déductibilité des intérêts et le traitement au décès (prestation, compte de dividende en capital) ne sont jamais automatiques : ils exigent un suivi fiscal annuel.',
      ],
    },
    {
      heading: 'Quels risques exiger avant de signer',
      paragraphs: [
        'Un PFI n’est pas une panacée. Avant toute décision, exigez des scénarios de stress — pas seulement l’illustration « de base » du représentant ou de l’assureur.',
        'Si l’un des points ci-dessous n’est pas acceptable pour votre trésorerie, la structure n’est pas appropriée.',
      ],
      bullets: [
        'Taux souvent variables et participations non garanties : le service de la dette et la valeur de rachat peuvent se détériorer ensemble.',
        'Le prêteur peut exiger des garanties additionnelles, un remboursement partiel ou un rachat de police.',
        'La fiscalité (intérêts, avantage à l’actionnaire, rachat anticipé) exige un suivi annuel.',
        'Primes et intérêts doivent tenir avec des liquidités propres, sans compter sur de nouvelles avances.',
      ],
    },
    {
      heading: 'Pour qui ce n’est pas adapté',
      paragraphs: [
        'Le PFI ne convient pas si vous cherchez une solution simple, sans suivi, ou présentée comme « sans risque ». Il ne convient pas non plus si le besoin d’assurance n’est pas réel, ou si vous n’avez pas de liquidités pour tenir primes et intérêts sans emprunter.',
        'Avant d’aller plus loin, écartez les alternatives plus simples : protection seule, remboursement de dettes, épargne, financement d’entreprise classique. Exigez des illustrations sobres — taux en hausse, participations réduites, arrêt des avances.',
        'Si la présentation promet un résultat net sans exposer ces risques, ce n’est pas le bon cadre de décision.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple illustratif (société, chiffres hypothétiques)',
    intro:
      'Les montants ci-dessous sont fictifs et servent uniquement à illustrer la mécanique. Ils ne constituent ni une illustration d’assureur, ni une offre de crédit, ni une projection de rendement net.',
    steps: [
      {
        label: 'Contexte',
        detail:
          'Holding OpCo Ltée, actionnaire clé 52 ans. Besoin d’assurance permanente corporative établi. Police vie entière participative ; prime annuelle illustrée de 100 000 $. Société titulaire et bénéficiaire.',
      },
      {
        label: 'Année 5 (illustration non garantie)',
        detail:
          'Valeur de rachat illustrée : 420 000 $ (dont une portion liée aux participations — non garantie). Le prêteur accepte, à titre d’exemple, jusqu’à 90 % de cette valeur, soit environ 378 000 $ de marge utilisée pour financer des actifs productifs de revenu.',
      },
      {
        label: 'Coût du levier',
        detail:
          'Taux variable illustratif 6 % : intérêts annuels ≈ 22 700 $ sur 378 000 $. Une partie pourrait être déductible si toutes les conditions fiscales sont remplies. La société continue de payer la prime de 100 000 $ à même ses liquidités.',
      },
      {
        label: 'Scénario défavorable',
        detail:
          'Taux à 9 % → intérêts ≈ 34 000 $/an. Participations révisées à la baisse : valeur de rachat à 360 000 $ au lieu de 420 000 $. Le prêteur exige 50 000 $ de garanties additionnelles ou un remboursement partiel. Aucun rendement net n’est promis.',
      },
    ],
    result:
      'À l’année 5 : protection permanente en place, ~378 000 $ empruntés réinvestis, et un service d’intérêts sensible aux taux. Le bénéfice dépend du rendement réel des fonds empruntés, du maintien des participations et des règles fiscales — trois variables non garanties. Si le stress-test n’est pas tenable, le PFI n’est pas approprié.',
  },
  takeaways: [
    'Besoin d’assurance réel d’abord ; le prêt sur valeur de rachat n’est qu’un accessoire.',
    'Participations, illustrations et taux de prêt ne sont pas garantis.',
    'Le levier et la marge peuvent forcer un remboursement ou un rachat coûteux.',
    'Sans liquidités propres pour primes et intérêts, la structure n’est pas appropriée.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'pfi-q1',
        prompt:
          'Dans l’exemple illustratif (année 5), si le prêteur limite le crédit à 90 % d’une valeur de rachat de 420 000 $, le plafond approximatif est…',
        choices: [
          '420 000 $ (100 % de la valeur illustrée)',
          'Environ 378 000 $',
          '100 000 $ (une seule prime)',
        ],
        correctIndex: 1,
        explanation:
          '90 % × 420 000 $ ≈ 378 000 $. Le ratio exact dépend du prêteur et peut être inférieur ; ce n’est pas un droit acquis.',
      },
      {
        id: 'pfi-q2',
        prompt: 'Les participations d’une assurance vie entière avec participation…',
        choices: [
          'Sont toujours garanties au montant illustré',
          'Peuvent être réduites ou ne pas être versées',
          'Remplacent entièrement le besoin de capital assuré',
        ],
        correctIndex: 1,
        explanation:
          'Les participations ne sont pas garanties. L’assureur peut les réduire ou n’en verser aucune ; les projections ne sont pas des promesses.',
      },
      {
        id: 'pfi-q3',
        prompt: 'Pourquoi un PFI exige-t-il un besoin d’assurance réel avant toute structure de prêt ?',
        choices: [
          'Parce que l’assureur garantit alors le rendement du levier',
          'Parce qu’on ne souscrit pas une police dans le seul but d’emprunter sur ses valeurs',
          'Parce que la déductibilité des intérêts est alors automatique',
        ],
        correctIndex: 1,
        explanation:
          'La protection vient d’abord. Le prêt sur valeurs est un accessoire conditionnel ; sans besoin assurantiel, la structure n’a pas de fondement prudent.',
      },
    ],
  },
  diagram: {
    title: 'Logique — plan de financement immédiat',
    type: 'flow',
    nodes: [
      {
        id: 'need',
        label: 'Besoin d’assurance',
        hint: 'Permanent, réel',
        emphasis: true,
      },
      {
        id: 'pol',
        label: 'Police participative',
        hint: 'VR partiellement non garantie',
      },
      {
        id: 'loan',
        label: 'Prêt / marge',
        hint: 'Cession · taux variable',
      },
      {
        id: 'use',
        label: 'Réinvestissement',
        hint: 'Actifs producteurs de revenu',
      },
      {
        id: 'risk',
        label: 'Suivi & stress-tests',
        hint: 'Taux · participations · liquidité',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'need', to: 'pol', label: 'Souscription' },
      { from: 'pol', to: 'loan', label: 'Garantie' },
      { from: 'loan', to: 'use', label: 'Levier' },
      { from: 'use', to: 'risk', label: 'Revue annuelle' },
      { from: 'risk', to: 'loan', label: 'Ajustements' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple illustratif — année 5 (hypothétique)',
    type: 'flow',
    nodes: [
      {
        id: 'prem',
        label: 'Prime annuelle 100 000 $',
        hint: 'Payée par la société',
        emphasis: true,
      },
      {
        id: 'csv',
        label: 'VR illustrée 420 000 $',
        hint: 'Part non garantie',
      },
      {
        id: 'credit',
        label: 'Marge ≈ 378 000 $',
        hint: 'Ex. 90 % · politiques prêteur',
      },
      {
        id: 'int',
        label: 'Intérêts ≈ 22 700 $',
        hint: 'À 6 % ; à 9 % ≈ 34 000 $',
      },
      {
        id: 'stress',
        label: 'Stress : VR ↓ / taux ↑',
        hint: 'Garanties ou remboursement',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'prem', to: 'csv', label: 'Accumulation' },
      { from: 'csv', to: 'credit', label: 'Cession garantie' },
      { from: 'credit', to: 'int', label: 'Service dette' },
      { from: 'csv', to: 'stress', label: 'Si participations ↓' },
      { from: 'int', to: 'stress', label: 'Si taux ↑' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — levier sur valeur de rachat',
    caption:
      'À l’année 5 (illustration) : VR 420 000 $ → crédit ≈ 378 000 $ (90 %) ; intérêts variables selon le taux.',
    events: [
      {
        at: 'An 0–5',
        title: 'Accumulation',
        amount: '100 000 $/an',
        note: 'Prime annuelle illustrée',
      },
      {
        at: 'An 5',
        title: 'Valeur de rachat',
        amount: '420 000 $',
        note: 'Base de garantie (illustration)',
        emphasis: true,
      },
      {
        at: 'An 5',
        title: 'Crédit max illustré',
        amount: '378 000 $',
        note: '90 % × 420 000 $',
      },
      {
        at: 'Ensuite',
        title: 'Intérêts du prêt',
        amount: '≈ 22 700 $',
        note: 'Ex. 6 % ; à 9 % ≈ 34 000 $',
      },
    ],
    chart: {
      type: 'bar',
      series: [
        {
          key: 'montant',
          name: 'Montant ($)',
        },
      ],
      points: [
        {
          at: 'VR an 5',
          montant: 420000,
        },
        {
          at: 'Crédit 90 %',
          montant: 378000,
        },
        {
          at: 'Intérêts 6 %',
          montant: 22700,
        },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — L’assurance vie entière et avec participation',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie/lassurance-vie-entiere-et-avec-participation',
    },
    {
      name: 'AMF — Utiliser une valeur de rachat sans mettre fin à son assurance',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/comment-utiliser-une-valeur-de-rachat-sans-mettre-fin-a-son-assurance',
    },
    {
      name: 'iA Groupe financier — Plan de financement immédiat (stratégies et concepts)',
      url: 'https://ia.ca/solutions-cas-avances/strategies-et-concepts',
    },
    {
      name: 'iA Groupe financier — Guide de mise en œuvre du PFI (PDF)',
      url: 'https://files.ia.ca/-/media/files/solutions-cas-avances/pdf/plan_de_financement_immdiat_pfifr.pdf',
    },
    {
      name: 'Institut de planification financière — Normes professionnelles',
      url: 'https://institutpf.org/assets/Documents/InstitutPF-normes-professionnelles-rev2023-fr.pdf',
    },
  ],
  relatedServiceIds: ['patrimoine', 'optimisation-fiscale'],
  relatedFormationIds: ['assurance-vie-permanente', 'vie-categorie-actif'],
  seoTitle: 'PFI et assurance participative | Mini-formation',
  seoDescription:
    'Plan de financement immédiat avec assurance vie participative : besoin d’assurance, valeur de rachat en garantie, prêt, risques de taux et levier. Cadre institutionnel prudent.',
};
