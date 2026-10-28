/**
 * Mini-formation — Assurance vie permanente.
 * Sources : AMF, IQPF, ia.ca. Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'assurance-vie-permanente',
  audiences: ['particulier', 'prive'],
  category: 'assurance',
  title: 'Assurance vie permanente',
  subtitle: 'Vie entière, universelle, participative',
  shortDescription:
    'Vie entière, universelle et participative : valeur de rachat, coût d’assurance, participations, et ce qui est garanti versus illustré.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Durée', value: 'Conçue pour la vie' },
    { label: 'Familles', value: 'Vie entière · universelle · participative' },
    { label: 'Lecture clé', value: 'Garanti ≠ illustré' },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’une assurance vie permanente?',
      paragraphs: [
        'Une assurance vie permanente est conçue pour rester en vigueur toute votre vie, tant que vous respectez le contrat — surtout le paiement des primes. Contrairement à une temporaire limitée dans le temps, elle vise un besoin de long horizon : liquidité au décès, impôts sur des actifs peu liquides, ou legs.',
        'La prime est souvent plus élevée, au départ, qu’une temporaire pour le même capital. Ce n’est pas un substitut au fonds d’urgence, au CELI ou au REER : c’est d’abord une protection.',
        'Beaucoup de contrats accumulent aussi une valeur de rachat — le montant que vous pourriez recevoir si vous résiliez avant le décès, selon le tableau du contrat. Trois familles dominent : vie entière (sans participation), vie universelle, et vie entière avec participation (participative).',
      ],
    },
    {
      heading: 'Comment fonctionnent les trois familles?',
      paragraphs: [
        'Vie entière (sans participation) : couverture pour la vie, primes souvent garanties et nivelées (fixes). Le capital de base et, dans la plupart des contrats, un tableau de valeurs de rachat sont écrits au contrat. Certains permettent de payer pendant une période fixe, puis de garder la protection de base sans nouvelles primes de base.',
        'Vie universelle : protection permanente plus un fonds de capitalisation. Vous versez des dépôts ; l’assureur prélève le coût d’assurance et des frais ; le surplus peut s’accumuler selon le crédit du compte. Si le compte ne suffit plus à couvrir ces prélèvements, le contrat peut déchoir — même après de gros versements initiaux.',
        'Vie entière avec participation (participative) : une base souvent garantie (capital et primes), plus des participations que l’assureur peut déclarer. Malgré le jargon « dividendes », ce ne sont pas des dividendes d’actions, mais des surplus redistribués selon l’expérience du fonds — parfois moins que prévu, ou nuls.',
      ],
    },
    {
      heading: 'Valeur de rachat, coût d’assurance et participations',
      paragraphs: [
        'La valeur de rachat n’est pas un compte bancaire libre. C’est une valeur contractuelle qui croît selon le type de police. En vie entière, un tableau garantit souvent des montants à des âges ou années donnés. En universelle, la valeur dépend du solde du compte après coût d’assurance et frais.',
        'En vie universelle, le coût d’assurance est le « moteur de risque » : l’assureur retire du compte ce qu’il faut pour couvrir le capital à risque. Si vous déposez le minimum et que le crédit du compte est faible, le solde peut s’éroder. Une illustration trop favorable peut masquer ce risque.',
        'Quand des participations sont déclarées, vous choisissez en général une option d’affectation : dépôt, assurance libérée, réduction de prime, ou espèces. Chaque option change le portrait futur. Une illustration suppose presque toujours une option précise — changez-la, et les chiffres changent.',
      ],
    },
    {
      heading: 'Que lire : garanti au contrat vs projeté?',
      paragraphs: [
        'Toute illustration digne de ce nom sépare ce qui est garanti (écrit au contrat) de ce qui est projeté (participations, crédit du compte, frais). Une courbe favorable n’est pas une promesse. Demandez un scénario réaliste et un scénario défavorable, et faites actualiser l’illustration si les taux ont changé.',
        'Avant de signer, retenez le capital de base, la prime, la durée de paiement, les valeurs de rachat garanties (s’il y en a), et ce qui arrive si vous cessez de payer. En universelle : coût d’assurance et crédit minimal. En participative : le plancher utile, c’est capital et primes sans aucune participation.',
        'Lisez les notes en bas de l’illustration : taux, frais, option d’affectation, colonnes « garanties » versus « illustrées ». Si une colonne disparaît dès qu’on met le crédit ou les participations à zéro, ce n’était pas une garantie.',
      ],
    },
    {
      heading: 'À quoi sert une permanente — et ses limites',
      paragraphs: [
        'Sur le plan patrimonial, une permanente peut fournir de la liquidité au décès (dettes, impôts sur des biens peu liquides, maintien du train de vie), soutenir un legs, ou compléter une planification où certains actifs ne se vendent pas facilement. La prestation versée au bénéficiaire désigné est en règle générale libre d’impôt ; un rachat anticipé, lui, peut créer un gain imposable.',
        'Ce n’est pas un outil de court terme ni un placement à comparer naïvement à un CELI. Une combinaison fréquente est une temporaire pour le besoin temporaire et une permanente pour une base à vie. Clarifiez d’abord le besoin de protection, puis la structure du contrat.',
      ],
      bullets: [
        'Mon besoin est-il vraiment à vie, ou une temporaire (avec ou sans conversion) suffirait-elle?',
        'Quels montants restent garantis sans participations / avec un crédit du compte nul?',
        'Que se passe-t-il si j’arrête de payer — et ai-je besoin d’une analyse de besoins?',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — prime vs capital de base',
    intro:
      'Illustration pédagogique (ordres de grandeur, non une cotation). Aucun rendement ni participation n’est promis. Seul le capital de base garanti compte comme plancher, si le contrat demeure en vigueur.',
    steps: [
      {
        label: 'Objectif',
        detail:
          'À 50 ans, vous souhaitez laisser un capital de 250 000 $ au décès pour liquidité successorale (impôts, dettes, legs), indépendamment des marchés.',
      },
      {
        label: 'Contrat de référence',
        detail:
          'Vie entière — capital-décès de base garanti : 250 000 $. Prime annuelle nivelée illustrative : 5 500 $ pendant 20 ans, puis plus de primes de base si les conditions sont respectées. Votre prime réelle dépend de l’âge, du sexe, de la santé, du produit et de l’assureur.',
      },
      {
        label: 'Primes totales versées',
        detail:
          '5 500 $ × 20 ans = 110 000 $ de primes de base. Ce n’est ni un rendement ni une valeur de rachat : c’est le coût de la protection.',
      },
      {
        label: 'Lecture garantie vs projection',
        detail:
          'Plancher : 250 000 $ au décès tant que le contrat est en vigueur. Toute hausse illustrée via participations ou crédits du compte reste une projection, pas une promesse.',
      },
    ],
    result:
      'Vous comparez 110 000 $ de primes sur 20 ans à un capital de base garanti de 250 000 $. L’écart n’est pas un « profit » : c’est le rôle mutualisé de l’assurance. Appuyez-vous sur les garanties écrites et un besoin permanent clairement défini.',
  },
  takeaways: [
    'La permanente vise la vie entière ; ce n’est pas le même outil qu’une temporaire.',
    'Vie entière, universelle et participative : structures et risques différents.',
    'Ce qui est garanti au contrat prime sur toute projection d’illustration.',
    'Clarifiez ce qui arrive si vous cessez de payer avant d’engager une prime élevée.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'avp-q1',
        prompt:
          'Dans l’exemple (prime 5 500 $/an × 20 ans, capital de base 250 000 $), que représente le 250 000 $?',
        choices: [
          'Un rendement annuel garanti de 250 000 $',
          'Le capital-décès de base garanti si le contrat demeure en vigueur',
          'La valeur de rachat certaine après 20 ans',
        ],
        correctIndex: 1,
        explanation:
          'Le 250 000 $ est le montant d’assurance de base (plancher), pas un rendement ni automatiquement la valeur de rachat.',
      },
      {
        id: 'avp-q2',
        prompt: 'Les participations d’une assurance vie entière avec participation…',
        choices: [
          'Sont garanties au même titre que la prime de base',
          'Ne sont pas garanties et peuvent diminuer ou être nulles',
          'Équivalent fiscalement à des dividendes d’actions',
        ],
        correctIndex: 1,
        explanation:
          'Les participations ne sont pas garanties ; malgré le jargon « dividendes », ce ne sont pas des dividendes d’actions.',
      },
      {
        id: 'avp-q3',
        prompt: 'Une illustration de vie universelle qui montre une forte accumulation…',
        choices: [
          'Constitue une promesse de rendement de l’assureur',
          'Remplace le contrat comme document juridique',
          'Repose sur des hypothèses non garanties ; un scénario défavorable est essentiel',
        ],
        correctIndex: 2,
        explanation:
          'Une projection n’est pas une garantie. Le coût d’assurance continue de prélever le compte ; un crédit ou des dépôts plus faibles peuvent faire déchoir le contrat.',
      },
    ],
  },
  diagram: {
    title: 'Trois familles de permanente',
    type: 'fork',
    source: {
      id: 'perm',
      label: 'Assurance vie permanente',
      hint: 'Besoin à vie · primes selon contrat',
    },
    branches: [
      {
        id: 've',
        label: 'Vie entière',
        hint: 'Prime nivelée · VR souvent au contrat',
        edgeLabel: 'Simplicité',
      },
      {
        id: 'vu',
        label: 'Universelle',
        hint: 'Compte + coût d’assurance · flexibilité',
        edgeLabel: 'Flexibilité',
      },
      {
        id: 'vp',
        label: 'Participative',
        hint: 'Base garantie · participations variables',
        edgeLabel: 'Participations',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — primes vs capital de base',
    type: 'flow',
    nodes: [
      {
        id: 'obj',
        label: 'Objectif succession',
        hint: 'Liquidité au décès',
      },
      {
        id: 'prime',
        label: 'Prime 5 500 $/an × 20 ans',
        hint: 'Total versé : 110 000 $',
        emphasis: true,
      },
      {
        id: 'cap',
        label: 'Capital de base 250 000 $',
        hint: 'Garanti au contrat (si en vigueur)',
        emphasis: true,
      },
      {
        id: 'proj',
        label: 'Tout surplus illustré',
        hint: 'Participations / crédits = non garantis',
      },
    ],
    edges: [
      { from: 'obj', to: 'prime', label: 'Financer' },
      { from: 'prime', to: 'cap', label: 'Plancher' },
      { from: 'cap', to: 'proj', label: '≠ promesse' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — primes vs capital de base',
    caption:
      'Sur 20 ans, les primes de base s’additionnent ; le plancher contractuel reste le capital-décès de base, pas un « rendement ».',
    events: [
      {
        at: 'Souscription',
        title: 'Capital de base',
        amount: '250 000 $',
        note: 'Plancher au décès (si contrat en vigueur)',
        emphasis: true,
      },
      {
        at: 'Chaque année',
        title: 'Prime nivelée',
        amount: '5 500 $',
        note: 'Illustration — prime réelle selon âge/santé',
      },
      {
        at: 'Après 10 ans',
        title: 'Primes cumulées',
        amount: '55 000 $',
        note: 'Coût de la protection, pas une VR',
      },
      {
        at: 'Après 20 ans',
        title: 'Primes cumulées',
        amount: '110 000 $',
        note: 'Fin de la période de paiement illustrée',
        emphasis: true,
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'primes', name: 'Primes cumulées' },
        { key: 'capital', name: 'Capital de base' },
      ],
      points: [
        { at: '0', primes: 0, capital: 250000 },
        { at: '5 ans', primes: 27500, capital: 250000 },
        { at: '10 ans', primes: 55000, capital: 250000 },
        { at: '15 ans', primes: 82500, capital: 250000 },
        { at: '20 ans', primes: 110000, capital: 250000 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — L’assurance vie entière et avec participation',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie/lassurance-vie-entiere-et-avec-participation',
    },
    {
      name: 'AMF — L’assurance vie universelle',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie/lassurance-vie-universelle',
    },
    {
      name: 'AMF — Principaux types d’assurance vie',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie',
    },
    {
      name: 'AMF — Coût de l’assurance vie universelle',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/le-cout-de-votre-assurance-vie-universelle-pourrait-il-augmenter-sans-avertissement',
    },
    {
      name: 'iA Groupe financier — L’assurance vie clarifiée',
      url: 'https://ia.ca/zone-conseils/mieux-etre/l-assurance-vie-clarifiee',
    },
    {
      name: 'iA Groupe financier — Assurance vie avec participation',
      url: 'https://ia.ca/assurance-vie-avec-participation',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin. (assurances et gestion des risques)',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
  ],
  relatedServiceIds: ['assurance-vie', 'patrimoine'],
  relatedFormationIds: [
    'assurance-vie-temporaire',
    'vie-categorie-actif',
    'pfi-participative',
  ],
  seoTitle: 'Assurance vie permanente | Vie entière, universelle, participative',
  seoDescription:
    'Mini-formation : vie entière, universelle et participative — valeur de rachat, coût d’assurance, participations, garanties vs illustrations. Sources AMF, IQPF et ia.ca.',
};
