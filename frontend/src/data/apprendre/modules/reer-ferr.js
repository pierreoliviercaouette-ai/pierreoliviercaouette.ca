/**
 * Mini-formation REER et FERR — niveau institutionnel.
 * Sources vérifiées : ARC, Revenu Québec (plafonds et facteurs à jour).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'reer-ferr',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'REER et FERR',
  subtitle: 'Épargne-retraite enregistrée et décaissement',
  shortDescription:
    'Comprendre le REER (droits, cotisation, déduction, retraits) et le FERR (conversion à 71 ans, retrait minimum imposable). Formation institutionnelle, sans conseil personnalisé.',
  readMinutes: 12,
  keyFacts: [
    {
      label: 'Où voir vos droits',
      value: 'Avis de cotisation de l’ARC',
    },
    {
      label: 'Date limite REER',
      value: '31 décembre de l’année des 71 ans',
    },
    {
      label: 'FERR',
      value: 'Retrait minimum annuel imposable',
    },
  ],
  sections: [
    {
      heading: 'Accumuler au REER, retirer au FERR',
      paragraphs: [
        'Le régime enregistré d’épargne-retraite (REER) est une enveloppe fiscale pour mettre de côté en vue de la retraite. Une cotisation déductible réduit en général le revenu imposable de l’année où vous la demandez.',
        'Tant que l’argent reste dans le REER, intérêts, dividendes et gains ne sont pas imposés chaque année. Un retrait (hors transferts directs admissibles) s’ajoute habituellement à votre revenu.',
        'Le fonds enregistré de revenu de retraite (FERR) est l’étape suivante : on y transfère souvent le solde du REER pour en sortir un revenu. On ne cotise plus au FERR ; un transfert direct REER → FERR n’est pas imposable.',
      ],
    },
    {
      heading: 'Lisez vos droits avant de cotiser',
      paragraphs: [
        'Vos droits de cotisation — le maximum que vous pouvez verser sans créer d’excédent — figurent sur votre avis de cotisation de l’Agence du revenu du Canada (ARC), ou sur le formulaire T1028. C’est la référence à consulter, pas seulement le solde chez votre institution.',
        'La nouvelle portion annuelle dépend surtout de votre revenu gagné de l’année précédente, du plafond REER de l’année et des facteurs d’équivalence d’un régime d’employeur, plus les droits inutilisés reportés. Le plafond change chaque année ; vérifiez le tableau de l’ARC et votre solde personnel.',
        'Les cotisations versées tôt dans l’année civile peuvent souvent être déduites de l’année d’imposition précédente. Un excédent peut entraîner une pénalité mensuelle. Un REER de conjoint existe aussi : vous cotisez avec vos droits, le conjoint est le rentier.',
      ],
    },
    {
      heading: 'Cotiser n’est pas déduire',
      paragraphs: [
        'Deux horloges distinctes. La cotisation consomme des droits dès le versement. La déduction se demande dans votre déclaration de revenus — parfois une autre année, si votre taux marginal devrait être plus élevé plus tard.',
        'Les droits inutilisés se reportent : ne pas cotiser une année ne les efface pas. À l’inverse, cotiser sans déduire tout de suite ne crée pas de nouveaux droits : seuls ceux calculés par l’ARC comptent.',
        'Suivez vos reçus REER et le maximum déductible sur l’avis. Ne confondez pas solde de compte, droits restants et déduction déjà utilisée.',
      ],
    },
    {
      heading: 'Convertir au plus tard à 71 ans',
      paragraphs: [
        'Un retrait du REER (hors transferts directs admissibles) s’ajoute en principe au revenu imposable. Des retenues à la source s’appliquent souvent sur les paiements forfaitaires — un acompte ; l’impôt réel se règle à la déclaration.',
        'Au plus tard le 31 décembre de l’année où vous atteignez 71 ans, le REER doit être converti : transfert direct à un FERR, achat d’une rente admissible, ou retrait imposable. Passé cette date, vous ne cotisez plus à votre propre REER.',
        'Sous conditions, vous pouvez encore cotiser au REER de conjoint si celui-ci a 71 ans ou moins à la fin de l’année. Vous pouvez aussi convertir avant 71 ans si vous voulez un flux de retraits structurés.',
      ],
    },
    {
      heading: 'Au FERR, un minimum imposable chaque année',
      paragraphs: [
        'Chaque année après l’année d’ouverture, l’émetteur doit vous verser au moins un montant minimum. Ce minimum égale la valeur des biens au 1er janvier multipliée par un facteur selon votre âge — ou l’âge du conjoint, si ce choix irrévocable a été fait à l’ouverture.',
        'Le facteur suit une règle d’âge pour les plus jeunes, puis le tableau des facteurs prescrits de l’ARC. Il n’y a pas de plafond : vous pouvez retirer plus, au prix d’un revenu imposable plus élevé.',
      ],
      bullets: [
        'Vérifiez le maximum déductible sur l’avis ARC avant de cotiser.',
        'Choisissez l’année de déduction selon votre taux marginal.',
        'Ne ratez pas le 31 décembre de l’année des 71 ans.',
        'Prévoyez le retrait minimum FERR dans votre budget d’impôt.',
      ],
    },
  ],
  workedExample: {
    title: 'Cotisation REER, puis retrait minimum FERR',
    intro:
      'Illustration chiffrée à titre éducatif. Les montants et le taux marginal sont des hypothèses ; votre situation réelle peut différer.',
    steps: [
      {
        label: 'Cotisation',
        detail:
          'Votre avis indique 12 000 $ de maximum déductible. Vous versez 8 000 $ au REER et demandez la déduction pour l’année.',
      },
      {
        label: 'Économie d’impôt',
        detail:
          'Avec un taux marginal combiné de 37 %, l’économie liée à la déduction est d’environ 8 000 $ × 37 % = 2 960 $. Coût net approximatif : 5 040 $.',
      },
      {
        label: 'Conversion en FERR',
        detail:
          'Plus tard, le solde REER s’élève à 200 000 $. Vous le transférez en FERR par transfert direct : aucun impôt à ce moment-là.',
      },
      {
        label: 'Retrait minimum',
        detail:
          'L’année suivante, à 71 ans, la valeur au 1er janvier est de 200 000 $. Facteur prescrit : 5,28 %. Minimum : 200 000 $ × 5,28 % = 10 560 $, entièrement imposable.',
      },
    ],
    result:
      'En résumé : 8 000 $ cotisés → environ 2 960 $ d’économie à 37 % ; plus tard, un FERR de 200 000 $ à 71 ans impose un minimum d’environ 10 560 $. Vérifiez facteurs et soldes auprès de l’ARC et de votre émetteur.',
  },
  takeaways: [
    'Le maximum déductible REER se lit sur l’avis de cotisation de l’ARC.',
    'Cotiser consomme des droits ; déduire est un choix d’année.',
    'Convertissez le REER au plus tard le 31 décembre de l’année des 71 ans.',
    'Le FERR impose un retrait minimum annuel imposable.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'reer-ferr-q1',
        prompt:
          'Où trouve-t-on en général son maximum déductible au titre des REER ?',
        choices: [
          'Sur l’avis de cotisation de l’ARC',
          'Uniquement sur le relevé bancaire',
          'Il n’y a pas de maximum',
        ],
        correctIndex: 0,
        explanation:
          'L’avis de cotisation (ou le T1028) de l’ARC indique votre maximum déductible, y compris les droits reportés.',
      },
      {
        id: 'reer-ferr-q2',
        prompt:
          'Quelle distinction est exacte entre cotisation et déduction REER ?',
        choices: [
          'Cotiser et déduire sont toujours la même opération, la même année',
          'On peut cotiser une année et demander la déduction une autre année',
          'Déduire recrée automatiquement de nouveaux droits de cotisation',
        ],
        correctIndex: 1,
        explanation:
          'La cotisation consomme des droits dès le versement ; la déduction se demande dans la déclaration et peut être reportée.',
      },
      {
        id: 'reer-ferr-q3',
        prompt:
          'Dans l’exemple, un FERR de 200 000 $ à 71 ans (facteur 5,28 %) impose quel retrait minimum approximatif ?',
        choices: ['5 280 $', '10 560 $', '20 000 $'],
        correctIndex: 1,
        explanation:
          '200 000 $ × 5,28 % = 10 560 $. Ce minimum s’ajoute au revenu imposable ; le facteur exact figure dans le tableau de l’ARC.',
      },
    ],
  },
  diagram: {
    title: 'Du REER au FERR',
    type: 'flow',
    nodes: [
      {
        id: 'droits',
        label: 'Droits de cotisation',
        hint: 'Avis ARC et plafond annuel',
      },
      {
        id: 'cotiser',
        label: 'Cotiser au REER',
        hint: 'Puis déduire (année choisie)',
        emphasis: true,
      },
      {
        id: 'croissance',
        label: 'Croissance abritée',
        hint: 'Tant que les fonds restent',
      },
      {
        id: 'conversion',
        label: 'Conversion ≤ 71 ans',
        hint: '31 déc. année des 71 ans',
        emphasis: true,
      },
      {
        id: 'ferr',
        label: 'FERR',
        hint: 'Retraits min. imposables',
      },
    ],
    edges: [
      { from: 'droits', to: 'cotiser' },
      { from: 'cotiser', to: 'croissance' },
      { from: 'croissance', to: 'conversion', label: 'Transfert direct' },
      { from: 'conversion', to: 'ferr' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple : 8 000 $ → FERR 200 000 $',
    type: 'flow',
    nodes: [
      {
        id: 'ex-cotis',
        label: 'Cotisation 8 000 $',
        hint: 'Sur 12 000 $ de droits',
        emphasis: true,
      },
      {
        id: 'ex-eco',
        label: 'Économie ≈ 2 960 $',
        hint: 'Taux marginal 37 %',
      },
      {
        id: 'ex-conv',
        label: 'Transfert 200 000 $',
        hint: 'REER → FERR, non imposable',
        emphasis: true,
      },
      {
        id: 'ex-min',
        label: 'Minimum 10 560 $',
        hint: '× 5,28 % à 71 ans',
      },
    ],
    edges: [
      { from: 'ex-cotis', to: 'ex-eco', label: 'Déduction' },
      { from: 'ex-eco', to: 'ex-conv', label: 'Croissance' },
      { from: 'ex-conv', to: 'ex-min', label: 'Année suivante' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — cotisation puis FERR',
    caption:
      'La cotisation crée une économie d’impôt ; plus tard, le FERR impose un retrait minimum imposable.',
    events: [
      {
        at: 'Année N',
        title: 'Cotisation REER',
        amount: '8 000 $',
        note: 'Sur 12 000 $ de droits',
        emphasis: true,
      },
      {
        at: 'Année N',
        title: 'Économie d’impôt',
        amount: '≈ 2 960 $',
        note: 'Taux marginal 37 %',
      },
      {
        at: 'Plus tard',
        title: 'Transfert REER → FERR',
        amount: '200 000 $',
        note: 'Transfert direct : non imposable',
      },
      {
        at: '71 ans',
        title: 'Retrait minimum',
        amount: '10 560 $',
        note: '200 000 $ × 5,28 % — imposable',
        emphasis: true,
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
          at: 'Cotisation',
          montant: 8000,
        },
        {
          at: 'Économie',
          montant: 2960,
        },
        {
          at: 'Solde FERR',
          montant: 200000,
        },
        {
          at: 'Min. FERR',
          montant: 10560,
        },
      ],
    },
  },
  sources: [
    {
      name: 'ARC — REER et régimes connexes',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/reer-regimes-connexes.html',
    },
    {
      name: 'ARC — Cotiser à un REER, RPAC ou RPD',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/reer-regimes-connexes/cotiser-a-reer-a-rpac-a.html',
    },
    {
      name: 'ARC — Plafonds REER (dont 33 810 $ en 2026)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/administrateurs-regimes-enregistres/fesp/plafonds-cd-reer-rpdb-celi-mgap.html',
    },
    {
      name: 'ARC — Fonds enregistré de revenu de retraite (FERR)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/fonds-enregistre-revenu-retraite-ferr.html',
    },
    {
      name: 'ARC — Montant minimum d’un FERR',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/entreprises/sujets/remplir-feuillets-sommaires/declaration-renseignements-t4rsp-t4rif/paiements/montant-minimum-ferr.html',
    },
    {
      name: 'ARC — Tableau des facteurs prescrits',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/entreprises/sujets/remplir-feuillets-sommaires/declaration-renseignements-t4rsp-t4rif/paiements/tableau-facteurs-prescrits.html',
    },
    {
      name: 'Revenu Québec — Paiement provenant d’un REER, RVER, RPAC ou FERR',
      url: 'https://www.revenuquebec.ca/fr/entreprises/retenues-a-la-source-et-cotisations-de-lemployeur/calcul-des-retenues-et-des-cotisations/particularites-calcul-des-retenues-et-des-cotisations/paiement-provenant-dun-reer-dun-rver-dun-rpac-ou-dun-ferr/',
    },
    {
      name: 'AMF — Régimes d’épargne',
      url: 'https://lautorite.qc.ca/grand-public/investissements/regimes-depargne',
    },
    {
      name: 'Institut de planification financière (IQPF)',
      url: 'https://www.iqpf.org/',
    },
    {
      name: 'iA Groupe financier — REER',
      url: 'https://ia.ca/reer',
    },
    {
      name: 'iA Groupe financier — FERR',
      url: 'https://ia.ca/ferr',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['celi', 'fonds-pensions'],
  seoTitle: 'REER et FERR | Mini-formation | Pierre-Olivier Caouette',
  seoDescription:
    'Formation institutionnelle sur le REER et le FERR : droits de cotisation, déduction, conversion à 71 ans, retraits minimums et exemple chiffré. Sources ARC et Revenu Québec.',
};
