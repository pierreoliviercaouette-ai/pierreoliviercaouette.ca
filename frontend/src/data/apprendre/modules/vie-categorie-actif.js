/**
 * Mini-formation — L’assurance vie comme catégorie d’actif.
 * Sources : AMF, IQPF, ia.ca. Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'vie-categorie-actif',
  audiences: ['prive'],
  category: 'corpo',
  title: 'L’assurance vie comme catégorie d’actif',
  subtitle: 'Protection d’abord, lecture patrimoniale ensuite',
  shortDescription:
    'Quand un contrat permanent peut s’intégrer à un patrimoine — besoin d’assurance, valeurs de rachat, liquidité et comparaison honnête avec un placement taxable.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Priorité', value: 'Besoin d’assurance d’abord' },
    { label: 'Lecture', value: 'VR garantie ≠ VR illustrée' },
    { label: 'Horizon', value: 'Décennies, pas un cycle' },
  ],
  sections: [
    {
      heading: 'Que veut dire « catégorie d’actif »?',
      paragraphs: [
        'Cette expression ne transforme pas le contrat en fonds commun, en CPG ou en portefeuille d’actions. Vous détenez toujours une police : primes, frais, règles d’exonération fiscale et prestation de décès.',
        'La valeur de rachat (VR) est le montant que vous pourriez recevoir si vous résiliez le contrat avant le décès, selon le tableau et les conditions. Ce n’est pas un solde de courtier librement retirable comme un CELI.',
        'On n’adopte cette lecture qu’après un besoin de protection clairement établi. Les valeurs s’examinent alors dans le bilan — à côté des placements, jamais à leur place.',
      ],
    },
    {
      heading: 'Quand cette lecture a du sens',
      paragraphs: [
        'Elle convient surtout si vous avez déjà un besoin d’assurance permanent : liquidité au décès, impôts sur des actifs peu liquides, continuité d’entreprise, convention entre actionnaires ou legs. Il faut aussi des liquidités durables que vous n’aurez pas à retirer à court ou moyen terme.',
        'Sans besoin réel, comparer une police permanente à un placement taxable revient souvent à payer un coût d’assurance pour une croissance partielle. Ce coût (la portion de la prime qui finance la protection) n’est pas un « dépôt » : c’est le prix de la couverture.',
        'Chez une société, la même logique s’applique : besoin permanent, surplus stables hors du fonds de roulement, et horizon long. Les attributs fiscaux possibles ne remplacent pas cette condition de départ.',
      ],
    },
    {
      heading: 'Séparer VR garantie et VR illustrée',
      paragraphs: [
        'Sur une illustration, deux colonnes comptent. La VR garantie est ce que le contrat promet si les conditions sont respectées — souvent basse les premières années, parfois nulle au début.',
        'La VR illustrée ajoute des hypothèses : participations (sommes que l’assureur peut déclarer, non garanties), rendement du compte ou frais futurs. Ce n’est pas une promesse. Le capital-décès suit la même logique : un montant de base garanti, puis des montants illustrés.',
        'Avant de signer, demandez un scénario défavorable et une lecture ligne à ligne de ce qui reste si les hypothèses ne se réalisent pas. Mettez à jour l’illustration si les taux ou votre situation ont changé.',
      ],
    },
    {
      heading: 'Comparer liquidité et placement taxable',
      paragraphs: [
        'Un contrat permanent engage sur un long horizon. Accéder aux valeurs de rachat (retrait, avance sur police, cession en garantie) a des conditions, des coûts et parfois des incidences fiscales. Ce n’est ni une réserve d’urgence ni un substitut au CELI, au REER ou à une allocation actions / revenu fixe.',
        'La comparaison honnête avec un placement taxable ne se résume pas à « quel rendement gagne ». D’un côté : liquidité relative, imposition courante, aucun capital-décès assurantiel. De l’autre : protection, croissance possible sous contraintes, et projections non garanties.',
        'Gardez en tête la déchéance (le contrat tombe si les primes ne sont plus payées ou si, en universelle, le compte ne couvre plus le coût d’assurance), la hausse possible de ce coût, et la dépendance aux projections.',
      ],
    },
    {
      heading: 'Quelles questions poser avant d’avancer?',
      paragraphs: [
        'Clarifiez d’abord le besoin de protection, indépendamment des courbes illustrées. Ensuite seulement, lisez le contrat comme une brique patrimoniale parmi d’autres.',
        'Une illustration favorable ne remplace pas les scénarios de stress. Posez notamment :',
      ],
      bullets: [
        'Quel besoin permanent d’assurance ce contrat couvre-t-il, sans compter sur les projections?',
        'Quelles lignes sont garanties, et lesquelles ne le sont pas — y compris en scénario défavorable?',
        'Comment un retrait, un prêt sur police ou un changement d’hypothèses affecterait-il les garanties?',
        'Disposez-vous déjà d’une réserve liquide et d’une allocation distincte hors de cette police?',
      ],
    },
  ],
  workedExample: {
    title: 'Comparaison sobre — surplus sur 20 ans',
    intro:
      'Illustration pédagogique uniquement. Aucun rendement n’est promis. Les montants « illustrés » sont des ordres de grandeur pour apprendre à lire une proposition, pas une cotation d’assureur.',
    steps: [
      {
        label: 'Contexte',
        detail:
          'Besoin permanent de protection d’environ 500 000 $ et surplus stables (personnel ou corporatif). Engagement envisagé : 10 000 $/an × 20 ans = 200 000 $ de primes cumulées.',
      },
      {
        label: 'Voie A — revenu fixe taxable',
        detail:
          'Même effort d’épargne hors police. Les revenus de placement sont imposables au fil du temps. Liquidité relative plus élevée. Aucun capital-décès assurantiel.',
      },
      {
        label: 'Voie B — police permanente (après 20 ans)',
        detail:
          'Exemple de lecture : VR garantie ~65 000 $ ; VR illustrée (non garantie) ~330 000 $ ; capital-décès garanti ~240 000 $ ; capital-décès illustré (non garanti) ~920 000 $. Les montants illustrés reposent sur des hypothèses révisables.',
      },
      {
        label: 'Critère de décision',
        detail:
          'Retenir ce qui est garanti, tester un scénario défavorable, vérifier la liquidité et confirmer que le besoin assurantiel existe sans les projections. La question utile n’est pas « quel rendement gagne ».',
      },
    ],
    result:
      'La voie B n’« bat » pas la voie A par un rendement annoncé : elle combine protection et dynamiques de valeurs sous contraintes de liquidité et d’hypothèses non garanties. Sans besoin permanent d’assurance, la lecture « catégorie d’actif » ne tient pas.',
  },
  takeaways: [
    'Besoin d’assurance permanent d’abord ; lecture d’actif ensuite.',
    'Séparez toujours VR et capital garantis des montants illustrés.',
    'Ce n’est pas un substitut liquide à un portefeuille taxable ou enregistré.',
    'Testez un scénario défavorable avant de retenir une illustration.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'actif-q1',
        prompt:
          'Dans l’exemple (200 000 $ de primes cumulées sur 20 ans), que faut-il traiter comme non garanti?',
        choices: [
          'Le seul fait qu’une police permanente existe',
          'La valeur de rachat et le capital-décès « illustrés » (~330 000 $ et ~920 000 $)',
          'L’obligation de payer les primes selon le contrat',
        ],
        correctIndex: 1,
        explanation:
          'Les montants illustrés reposent sur des hypothèses (participations, rendements, frais). Seules les garanties du contrat lient l’assureur.',
      },
      {
        id: 'actif-q2',
        prompt: 'Quand peut-on parler d’assurance vie comme « catégorie d’actif » de façon prudente?',
        choices: [
          'Dès qu’une illustration montre un rendement implicite élevé',
          'Lorsqu’un besoin permanent d’assurance est établi, puis qu’on analyse les valeurs dans le patrimoine',
          'Lorsqu’on veut remplacer entièrement son portefeuille actions / obligations',
        ],
        correctIndex: 1,
        explanation:
          'La protection vient en premier. La lecture patrimoniale est secondaire et ne remplace pas une allocation diversifiée ni une réserve liquide.',
      },
      {
        id: 'actif-q3',
        prompt: 'Quel risque est typique d’un contrat permanent mal dimensionné ou sous-financé?',
        choices: [
          'Une liquidité quotidienne égale à celle d’un compte d’épargne',
          'La déchéance si les primes cessent ou si le compte ne couvre plus le coût d’assurance',
          'La garantie automatique que les projections se réaliseront',
        ],
        correctIndex: 1,
        explanation:
          'Sans paiement suffisant (ou avec un compte trop bas en universelle), le contrat peut déchoir. Les projections ne protègent pas contre ce risque.',
      },
    ],
  },
  diagram: {
    title: 'Lecture patrimoniale prudente',
    type: 'flow',
    nodes: [
      {
        id: 'besoin',
        label: 'Besoin permanent',
        hint: 'Protection d’abord',
        emphasis: true,
      },
      {
        id: 'garanties',
        label: 'Garanties du contrat',
        hint: 'Primes, capital de base, VR',
      },
      {
        id: 'proj',
        label: 'Projections',
        hint: 'Non garanties — scénario bas',
      },
      {
        id: 'place',
        label: 'Place dans le patrimoine',
        hint: 'Une brique — pas un substitut',
      },
    ],
    edges: [
      { from: 'besoin', to: 'garanties', label: 'Cadre contractuel' },
      { from: 'garanties', to: 'proj', label: 'Puis illustrations' },
      { from: 'proj', to: 'place', label: 'Vs alternatives' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — lecture à 20 ans (illustratif)',
    type: 'fork',
    source: {
      id: 'primes',
      label: '200 000 $ de primes cumulées',
      hint: '10 000 $/an × 20 ans',
    },
    branches: [
      {
        id: 'voie-a',
        label: 'Voie A — revenu fixe taxable',
        hint: 'Imposable · liquide · sans décès',
        edgeLabel: 'Hors police',
      },
      {
        id: 'voie-b',
        label: 'Voie B — police permanente',
        hint: 'VR ~65 k$ gar. / ~330 k$ ill.',
        edgeLabel: 'Avec besoin d’assurance',
      },
    ],
  },
  timeline: {
    title: 'Ligne du temps — 20 ans de primes',
    caption:
      '200 000 $ de primes cumulées : à l’an 20, VR garantie ~65 000 $ vs VR illustrée ~330 000 $ (ordre de grandeur pédagogique).',
    events: [
      {
        at: 'An 0',
        title: 'Mise en place',
        amount: '10 000 $/an',
        note: 'Besoin d’assurance réel d’abord',
      },
      {
        at: 'An 10',
        title: 'À mi-parcours',
        amount: '100 000 $ primes',
        note: 'VR gar. ~32 k$ · ill. ~120 k$',
      },
      {
        at: 'An 20',
        title: 'Primes cumulées',
        amount: '200 000 $',
        note: 'Point de comparaison pédagogique',
        emphasis: true,
      },
      {
        at: 'An 20',
        title: 'Lecture prudente',
        amount: 'VR ~65 k$ vs ~330 k$',
        note: 'Garanti vs illustré — seul le contrat fixe le plancher',
      },
    ],
    chart: {
      type: 'line',
      series: [
        {
          key: 'primes',
          name: 'Primes cumulées',
        },
        {
          key: 'vrGar',
          name: 'VR garantie (ordre)',
        },
        {
          key: 'vrIll',
          name: 'VR illustrée (ordre)',
        },
      ],
      points: [
        {
          at: '0',
          primes: 0,
          vrGar: 0,
          vrIll: 0,
        },
        {
          at: '5',
          primes: 50000,
          vrGar: 15000,
          vrIll: 45000,
        },
        {
          at: '10',
          primes: 100000,
          vrGar: 32000,
          vrIll: 120000,
        },
        {
          at: '15',
          primes: 150000,
          vrGar: 48000,
          vrIll: 220000,
        },
        {
          at: '20',
          primes: 200000,
          vrGar: 65000,
          vrIll: 330000,
        },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Assurance vie entière et avec participation (garanties, projections, participations)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie/lassurance-vie-entiere-et-avec-participation',
    },
    {
      name: 'AMF — Assurance vie (utilisations patrimoniales et successorales)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie',
    },
    {
      name: 'Institut de planification financière — Normes d’hypothèses de projection',
      url: 'https://institutpf.org/normes-hypotheses-projection',
    },
    {
      name: 'iA Groupe financier — Assurance comme catégorie d’actif (stratégies cas avancés)',
      url: 'https://ia.ca/solutions-cas-avances/strategies-et-concepts',
    },
    {
      name: 'iA Groupe financier — Document Assurance comme catégorie d’actif (PDF)',
      url: 'https://files.ia.ca/-/media/files/solutions-cas-avances/pdf/f13-1227_assurance-actif_20240510.pdf',
    },
  ],
  relatedServiceIds: ['patrimoine', 'optimisation-fiscale'],
  relatedFormationIds: ['assurance-vie-permanente', 'pfi-participative'],
  seoTitle: 'Assurance vie comme catégorie d’actif | Mini-formation privée',
  seoDescription:
    'Besoin d’assurance d’abord, VR garantie vs illustrée, liquidité, comparaison avec un placement taxable et risques — parcours éducatif.',
};
