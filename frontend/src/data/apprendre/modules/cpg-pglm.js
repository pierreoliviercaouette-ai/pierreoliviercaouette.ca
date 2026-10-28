/**
 * Mini-formation CPG et PGLM — niveau institutionnel.
 * Sources : AMF, SADC (protection des dépôts ; CPG et dépôts liés au marché).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'cpg-pglm',
  audiences: ['particulier'],
  category: 'placements',
  title: 'CPG et PGLM',
  subtitle: 'Placements garantis et liés au marché',
  shortDescription:
    'CPG à taux fixe versus CPG liés au marché (PGLM) : capital, rendement, plafonds, liquidité et protection des dépôts — sans confondre avec une obligation.',
  readMinutes: 14,
  keyFacts: [
    { label: 'CPG classique', value: 'Capital + taux fixe jusqu’à l’échéance' },
    { label: 'PGLM', value: 'Capital souvent garanti ; rendement lié à un indice' },
    { label: 'Protection dépôt', value: 'SADC / AMF — jusqu’à 100 000 $ (vérifier)' },
  ],
  sections: [
    {
      heading: 'Comprendre le CPG classique',
      paragraphs: [
        'Un certificat de placement garanti (CPG) est un dépôt à terme : vous prêtez une somme à une institution financière pour une durée convenue. En échange, elle s’engage à vous rembourser le capital à l’échéance et à verser un intérêt au taux fixé à l’achat.',
        'Le taux peut être simple ou composé, versé périodiquement ou à l’échéance. La durée va souvent de quelques mois à plusieurs années. Tant que vous conservez le CPG jusqu’à l’échéance, le rendement est connu à l’avance — c’est la force du produit.',
        'La liquidité est limitée. Beaucoup de CPG ne sont pas rachetables avant l’échéance ; d’autres le sont avec une pénalité ou un taux réduit. Avant d’immobiliser l’argent, assurez-vous de ne pas en avoir besoin plus tôt.',
      ],
    },
    {
      heading: 'Qu’est-ce qu’un PGLM ou CPG lié au marché?',
      paragraphs: [
        'Un placement garanti lié au marché (PGLM) — souvent appelé CPG lié au marché — lie le rendement à la performance d’un indice, d’un panier de titres ou d’un autre sous-jacent. Le capital est souvent remboursé intégralement à l’échéance, même si le marché a baissé.',
        'Le rendement n’est pas un taux fixe. Il dépend de la formule du produit : taux de participation (vous ne touchez qu’une fraction de la hausse), plafond maximal, parfois un rendement minimum. Une forte hausse de l’indice ne se traduit pas toujours dollar pour dollar.',
        'Entre l’achat et l’échéance, la valeur de revente ou de rachat peut être inférieure au capital, selon les modalités. La « garantie » s’applique en général à l’échéance, pas en tout temps. Lisez le document du produit : participation, plafond, dates de calcul et conditions de sortie.',
      ],
    },
    {
      heading: 'Différence courte avec une obligation',
      paragraphs: [
        'Une obligation est un titre de créance émis par un gouvernement ou une société. Son prix peut fluctuer sur le marché secondaire avant l’échéance ; vous assumez le risque de crédit de l’émetteur. Ce n’est pas un dépôt bancaire.',
        'Un CPG est un dépôt auprès d’une institution. Le taux classique est fixé à l’achat ; la liquidité dépend surtout des règles de rachat de l’émetteur. Les obligations de marché se négocient souvent plus facilement, mais leur valeur marchande bouge avec les taux d’intérêt.',
        'En résumé : obligation = titre dont le prix peut varier ; CPG = dépôt à terme ; PGLM = dépôt (ou produit voisin) dont le rendement suit une formule liée au marché, avec capital souvent garanti seulement à l’échéance.',
      ],
    },
    {
      heading: 'Protection des dépôts et limites utiles',
      paragraphs: [
        'Pour les CPG émis par une institution membre de la Société d’assurance-dépôts du Canada (SADC), les dépôts admissibles — y compris certains CPG — sont protégés en cas de faillite de l’institution. Au Québec, l’Autorité des marchés financiers (AMF) offre une protection analogue pour les dépôts faits auprès d’institutions de dépôts autorisées.',
        'En 2026, le plafond officiel souvent cité est de 100 000 $ par catégorie de dépôts et par institution (capital et intérêts courus). Vérifiez toujours le site de la SADC ou de l’AMF : catégories, membres et conditions évoluent. Les fonds, actions et obligations ne sont pas protégés comme des dépôts.',
        'La SADC précise que les dépôts liés à un indice sont assurables seulement si le capital est entièrement garanti (à l’échéance ou à un autre moment prévu). Un billet à capital protégé qui n’est pas un dépôt assurable repose sur la solvabilité de l’émetteur — ce n’est pas la même chose.',
      ],
      bullets: [
        'Vérifiez si l’émetteur est membre SADC ou institution autorisée AMF.',
        'Lisez participation, plafond et règles de rachat avant d’acheter un PGLM.',
        'Gardez l’argent dont vous pourriez avoir besoin avant l’échéance hors CPG non rachetable.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Alex, 10 000 $ sur 5 ans',
    intro:
      'Illustration pédagogique : même capital, deux formules. Taux et plafonds fictifs pour comparer la logique — ce n’est pas une offre réelle ni un conseil personnalisé.',
    steps: [
      {
        label: 'Option A — CPG classique',
        detail:
          'Alex place 10 000 $ dans un CPG à 3,2 % composé annuellement, non rachetable, échéance 5 ans. À l’échéance : environ 11 706 $ (intérêts ≈ 1 706 $). Le résultat est connu dès l’achat.',
      },
      {
        label: 'Option B — PGLM',
        detail:
          'Même capital, même échéance. Capital remboursé à 100 % à l’échéance. Participation de 75 % à la hausse d’un indice, plafond de 20 % sur toute la durée. Pas de taux fixe.',
      },
      {
        label: 'Scénario marché en hausse',
        detail:
          'L’indice grimpe de 28 % sur 5 ans. 28 % × 75 % = 21 %, mais le plafond coupe à 20 %. À l’échéance : 12 000 $. Alex gagne plus qu’avec le CPG classique — grâce au marché, dans la limite du plafond.',
      },
      {
        label: 'Scénario marché en baisse',
        detail:
          'L’indice baisse de 15 %. Le capital garanti à l’échéance revient à 10 000 $ ; rendement lié au marché : 0 $. Le CPG classique aurait quand même versé ≈ 1 706 $.',
      },
    ],
    result:
      'Même capital, deux profils : le CPG fixe offre un résultat certain (≈ 11 706 $) ; le PGLM peut faire mieux (12 000 $ si le marché monte assez) ou seulement rembourser le capital (10 000 $) si le marché baisse — la garantie joue à l’échéance, pas comme un taux fixe.',
  },
  takeaways: [
    'CPG classique : capital et taux connus jusqu’à l’échéance ; liquidité souvent limitée.',
    'PGLM : capital souvent garanti à l’échéance ; rendement lié à une formule (participation, plafond).',
    'Ce n’est pas une obligation de marché : dépôt vs titre dont le prix peut varier.',
    'Protection dépôt SADC/AMF : qualitative ; plafond 100 000 $ (2026) — vérifiez les conditions.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'cpg-pglm-q1',
        prompt:
          'Dans l’exemple, si l’indice monte de 28 % avec une participation de 75 % et un plafond de 20 %, que reçoit Alex à l’échéance sur 10 000 $?',
        choices: [
          '12 800 $ (28 % sans plafond)',
          '12 000 $ (plafond de 20 %)',
          '11 706 $ (comme le CPG à 3,2 %)',
        ],
        correctIndex: 1,
        explanation:
          '28 % × 75 % = 21 %, puis le plafond limite le rendement à 20 % : 10 000 $ × 1,20 = 12 000 $.',
      },
      {
        id: 'cpg-pglm-q2',
        prompt:
          'Si l’indice baisse de 15 % sur la durée du PGLM de l’exemple, que se passe-t-il à l’échéance?',
        choices: [
          'Alex reçoit 8 500 $',
          'Alex récupère 10 000 $ de capital, sans rendement lié au marché',
          'Alex reçoit automatiquement les intérêts du CPG classique',
        ],
        correctIndex: 1,
        explanation:
          'Avec capital entièrement garanti à l’échéance, la baisse du marché n’érode pas ce capital ; le rendement lié peut être nul.',
      },
      {
        id: 'cpg-pglm-q3',
        prompt:
          'Selon la SADC, un dépôt lié à un indice est assurable à quelles conditions principales?',
        choices: [
          'Dès qu’il est vendu par une banque, sans autre condition',
          'Seulement si le capital est entièrement garanti (à l’échéance ou à un autre moment prévu)',
          'Uniquement s’il est détenu dans un fonds commun de placement',
        ],
        correctIndex: 1,
        explanation:
          'La SADC indique que les dépôts liés à un indice sont assurables uniquement si le capital est entièrement garanti, sous réserve des autres règles d’admissibilité.',
      },
    ],
  },
  diagram: {
    title: 'Deux chemins — CPG et PGLM',
    type: 'fork',
    source: {
      id: 'argent',
      label: 'Somme à placer',
      hint: 'Horizon jusqu’à l’échéance',
    },
    branches: [
      {
        id: 'cpg',
        label: 'CPG classique',
        hint: 'Taux fixe · résultat connu',
        edgeLabel: 'Certitude',
      },
      {
        id: 'pglm',
        label: 'PGLM / CPG lié',
        hint: 'Formule · plafond possible',
        edgeLabel: 'Exposition',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Alex — 10 000 $ / 5 ans',
    type: 'fork',
    source: {
      id: 'start',
      label: '10 000 $ · 5 ans',
      hint: 'Même capital, deux formules',
    },
    branches: [
      {
        id: 'fixe',
        label: 'CPG → ≈ 11 706 $',
        hint: '3,2 % composé · certain',
        edgeLabel: 'Taux fixe',
      },
      {
        id: 'lie',
        label: 'PGLM → 10 à 12 000 $',
        hint: '0 % si baisse · max 20 %',
        edgeLabel: 'Marché',
      },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Alex sur 5 ans',
    caption:
      'Le CPG classique accumule un intérêt certain. Le PGLM ne révèle son rendement qu’à l’échéance, selon la formule (ici : participation 75 %, plafond 20 %).',
    events: [
      {
        at: 'Achat',
        title: 'Mise de fonds',
        amount: '10 000 $',
        note: 'Deux options, même échéance 5 ans',
        emphasis: true,
      },
      {
        at: 'Années 1–4',
        title: 'Immobilisation',
        amount: '—',
        note: 'Peu ou pas de liquidité sans pénalité',
      },
      {
        at: 'Échéance · hausse',
        title: 'PGLM (indice +28 %)',
        amount: '12 000 $',
        note: 'Plafond 20 % · CPG aurait ≈ 11 706 $',
        emphasis: true,
      },
      {
        at: 'Échéance · baisse',
        title: 'PGLM (indice −15 %)',
        amount: '10 000 $',
        note: 'Capital garanti · CPG aurait ≈ 11 706 $',
      },
    ],
    chart: {
      type: 'bar',
      series: [
        { key: 'cpg', name: 'CPG classique' },
        { key: 'pglmHaut', name: 'PGLM (marché +)' },
        { key: 'pglmBas', name: 'PGLM (marché −)' },
      ],
      points: [
        { at: 'Achat', cpg: 10000, pglmHaut: 10000, pglmBas: 10000 },
        { at: 'Échéance', cpg: 11706, pglmHaut: 12000, pglmBas: 10000 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Titres d’emprunt (CPG et CPG indiciels)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/titres-demprunt',
    },
    {
      name: 'AMF — Protection des dépôts',
      url: 'https://lautorite.qc.ca/grand-public/indemnisation-et-protection-des-depots/protection-des-depots',
    },
    {
      name: 'SADC — Certificats de placement garanti (CPG)',
      url: 'https://www.sadc.ca/deposants/ce-qui-est-protege/certificats-de-placement-garanti-cpg/',
    },
    {
      name: 'SADC — Débentures, billets à capital protégé et dépôts à terme',
      url: 'https://www.sadc.ca/deposants/ce-qui-est-protege/debentures-billets-a-capital-protege-et-depots-a-terme/',
    },
    {
      name: 'SADC — Dépôts au nom d’une seule personne',
      url: 'https://www.sadc.ca/deposants/ce-qui-est-protege/depots-au-nom-dune-seule-personne/',
    },
    {
      name: 'Canada.ca — Assurance-dépôts au Canada',
      url: 'https://www.canada.ca/fr/agence-consommation-matiere-financiere/services/activites-bancaires/assurance-depots.html',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: [
    'obligations',
    'fonds-urgence',
    'fonds-distincts',
    'fonds-communs',
  ],
  seoTitle: 'CPG et PGLM : taux fixe vs lié au marché | Apprendre',
  seoDescription:
    'Mini-formation sur les CPG classiques et les placements garantis liés au marché : capital, participation, plafond, liquidité, obligations et protection SADC/AMF.',
};
