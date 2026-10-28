/**
 * Mini-formation Actions et dividendes — niveau institutionnel.
 * Sources : AMF, OSC (GetSmarterAboutMoney), ARC, Revenu Québec.
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'actions-dividendes',
  audiences: ['particulier'],
  category: 'placements',
  title: 'Actions et dividendes',
  subtitle: 'Titres de participation et revenus de sociétés',
  shortDescription:
    'Actions ordinaires, plus-value versus dividende, risque de marché, dilution de base, crédit d’impôt pour dividendes canadiens, et accès via fonds, FNB ou titres individuels.',
  readMinutes: 13,
  keyFacts: [
    { label: 'Action', value: 'Part de propriété d’une société' },
    { label: 'Rendement', value: 'Dividendes et/ou variation du cours' },
    { label: 'Risque', value: 'Le cours peut baisser, parfois fortement' },
  ],
  sections: [
    {
      heading: 'Comprendre une action ordinaire',
      paragraphs: [
        'Une action ordinaire est un titre de participation : vous détenez une part de propriété d’une société. En principe, elle confère un droit de vote aux assemblées et un droit aux dividendes lorsque la société en verse.',
        'Les actions privilégiées existent aussi : elles reçoivent souvent un dividende avant les actions ordinaires, mais rarement un droit de vote. Cette formation se concentre sur les actions ordinaires, la forme la plus courante pour les particuliers.',
        'Acheter une action, ce n’est pas prêter de l’argent comme avec une obligation. Vous partagez le sort économique de l’entreprise : bénéfices, pertes, et valeur que le marché attribue à ce titre.',
      ],
    },
    {
      heading: 'Distinguer plus-value et dividende',
      paragraphs: [
        'Le rendement d’une action peut venir de deux sources distinctes. La plus-value (ou gain en capital) apparaît lorsque vous vendez plus cher que votre coût fiscal. Une perte en capital survient si vous vendez moins cher.',
        'Le dividende est une partie des profits, après impôt, que la société verse aux actionnaires. Certaines entreprises en versent régulièrement ; d’autres réinvestissent tout, ou n’ont pas de profits à distribuer. Un dividende n’est jamais garanti.',
        'Vous pouvez recevoir des dividendes sans vendre, et réaliser une plus-value (ou une perte) seulement à la disposition du titre. Les deux mécanismes n’ont pas le même moment ni, hors régimes enregistrés, le même traitement fiscal.',
      ],
    },
    {
      heading: 'Risque de marché et dilution',
      paragraphs: [
        'Le cours d’une action peut monter ou baisser rapidement selon les résultats de la société, le secteur, l’économie ou le simple sentiment du marché. Sur un horizon court, la valeur peut baisser nettement, même si l’entreprise reste saine.',
        'La dilution survient lorsqu’une société émet de nouvelles actions : chaque action existante représente alors une plus petite part de l’ensemble. Votre nombre d’actions ne change pas, mais votre poids relatif diminue, ce qui peut peser sur le cours.',
        'Diversifier — plusieurs titres, secteurs ou régions, ou un fonds / FNB — ne supprime pas le risque actions, mais limite l’effet d’un seul titre ou d’un seul événement sur votre portefeuille.',
      ],
    },
    {
      heading: 'Dividendes canadiens hors régime enregistré',
      paragraphs: [
        'Dans un CELI ou un REER, les dividendes canadiens reçus à l’intérieur du compte suivent les règles de l’enveloppe : en général, pas d’impôt courant sur ces distributions tant qu’elles restent dans le régime. Les dividendes étrangers peuvent toutefois subir une retenue à la source à l’étranger (ex. États-Unis), souvent non récupérable dans un CELI.',
        'Dans un compte non enregistré, les dividendes de sociétés canadiennes imposables sont déclarés avec une majoration, puis vous demandez un crédit d’impôt pour dividendes (fédéral et, au Québec, provincial). L’idée : la société a déjà payé de l’impôt sur ses profits.',
        'Les taux et facteurs de majoration sont fixés par les administrations fiscales et évoluent. Les dividendes étrangers ne donnent en général pas droit à ce crédit canadien. Consultez vos feuillets et les guides de l’ARC et de Revenu Québec pour l’année visée.',
      ],
    },
    {
      heading: 'Accéder aux actions : trois voies courantes',
      paragraphs: [
        'Vous n’êtes pas obligé d’acheter titre par titre. Un fonds commun de placement regroupe l’argent de plusieurs investisseurs ; un gestionnaire choisit les titres selon l’objectif du fonds. Un FNB est aussi un fonds, mais ses parts se négocient en bourse comme une action.',
        'Les titres individuels offrent un contrôle direct, mais exigent de suivre chaque société et concentrent le risque. Fonds et FNB facilitent souvent la diversification ; comparez objectifs, frais et aperçu du fonds avant d’investir. Ce texte est général et ne constitue pas un conseil personnalisé.',
      ],
      bullets: [
        'Fonds communs : rachat auprès du fonds, valeur souvent quotidienne.',
        'FNB : achat et vente en bourse via un courtier.',
        'Titres individuels : une société à la fois, risque plus concentré.',
        'Vérifiez toujours que le courtier ou le représentant est autorisé.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — 10 000 $ en actions (Camille)',
    intro:
      'Illustration pédagogique uniquement. Aucun rendement n’est promis. Frais, impôts et fluctuations réelles sont simplifiés pour isoler plus-value et dividendes.',
    steps: [
      {
        label: 'Achat initial',
        detail:
          'Camille place 10 000 $ : 200 actions à 50 $ chacune, dans un compte de placement. Aucun dividende n’est encore reçu.',
      },
      {
        label: 'Année 1 — dividende seulement',
        detail:
          'La société verse 1,00 $ par action. Camille reçoit 200 $. Le cours reste à 50 $ : la valeur marchande des actions est toujours 10 000 $.',
      },
      {
        label: 'Année 2 — dividende et hausse du cours',
        detail:
          'Nouveau dividende de 1,00 $ par action (encore 200 $). Le cours passe à 55 $ : la valeur marchande devient 11 000 $. Dividendes cumulés : 400 $.',
      },
      {
        label: 'Vente en fin d’année 2',
        detail:
          'Elle vend à 55 $. Plus-value brute : 11 000 $ − 10 000 $ = 1 000 $. Avec les 400 $ de dividendes, le résultat total avant frais et impôts est de 1 400 $.',
      },
    ],
    result:
      'Sur deux ans, Camille a combiné 400 $ de liquidités (dividendes) et 1 000 $ de plus-value à la vente. Le cours aurait aussi pu baisser : le même mécanisme fonctionne à l’envers. Hors régimes enregistrés, dividendes et gain en capital se déclarent selon des règles distinctes.',
  },
  takeaways: [
    'Une action ordinaire est une part de propriété ; le cours n’est pas garanti.',
    'Dividende et plus-value sont deux sources de rendement, distinctes fiscalement hors régime.',
    'Le risque de marché et la dilution peuvent réduire la valeur de votre participation.',
    'Fonds, FNB ou titres individuels : comparez diversification, frais et suivi requis.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'actions-q1',
        prompt:
          'Dans l’exemple, Camille achète 200 actions à 50 $. Après deux ans de dividendes de 1,00 $ et une vente à 55 $, quel est le total avant frais et impôts?',
        choices: [
          '400 $ (dividendes seulement)',
          '1 000 $ (plus-value seulement)',
          '1 400 $ (400 $ de dividendes + 1 000 $ de plus-value)',
        ],
        correctIndex: 2,
        explanation:
          'Dividendes : 200 $ × 2 ans = 400 $. Plus-value : (55 $ − 50 $) × 200 = 1 000 $. Total : 1 400 $ avant frais et impôts.',
      },
      {
        id: 'actions-q2',
        prompt:
          'Dans un compte non enregistré, que se passe-t-il en général pour des dividendes de sociétés canadiennes imposables?',
        choices: [
          'Ils ne sont jamais déclarés',
          'Ils sont majorés puis ouvrent droit à un crédit d’impôt pour dividendes',
          'Ils sont traités exactement comme des intérêts, sans crédit',
        ],
        correctIndex: 1,
        explanation:
          'On majore le dividende dans le revenu, puis on demande le crédit d’impôt pour dividendes (fédéral et, au Québec, provincial). Les taux officiels s’appliquent ; les dividendes étrangers n’ouvrent en général pas ce crédit.',
      },
      {
        id: 'actions-q3',
        prompt: 'Qu’est-ce que la dilution, de façon simple?',
        choices: [
          'Une baisse garantie du dividende chaque année',
          'L’émission de nouvelles actions qui réduit la part relative de chaque action existante',
          'Un frais de courtage obligatoire à chaque achat',
        ],
        correctIndex: 1,
        explanation:
          'Lorsque la société émet de nouvelles actions, chaque action existante représente une plus petite fraction de l’ensemble — c’est la dilution.',
      },
    ],
  },
  diagram: {
    title: 'Deux voies de rendement — actions',
    type: 'fork',
    source: {
      id: 'action',
      label: 'Action ordinaire',
      hint: 'Part de propriété',
    },
    branches: [
      {
        id: 'div',
        label: 'Dividendes',
        hint: 'Profits versés (non garantis)',
        edgeLabel: 'Sans vendre',
      },
      {
        id: 'gain',
        label: 'Plus-value / perte',
        hint: 'À la vente du titre',
        edgeLabel: 'Disposition',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Camille — 10 000 $',
    type: 'flow',
    nodes: [
      {
        id: 'buy',
        label: 'Achat 10 000 $',
        hint: '200 × 50 $',
        emphasis: true,
      },
      {
        id: 'y1',
        label: 'An 1 : +200 $',
        hint: 'Dividende ; cours 50 $',
      },
      {
        id: 'y2',
        label: 'An 2 : 11 000 $',
        hint: '+200 $ div. ; cours 55 $',
      },
      {
        id: 'sell',
        label: 'Vente : +1 400 $',
        hint: '1 000 $ gain + 400 $ div.',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'buy', to: 'y1', label: 'Année 1' },
      { from: 'y1', to: 'y2', label: 'Année 2' },
      { from: 'y2', to: 'sell', label: 'Disposition' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Camille, 10 000 $',
    caption:
      'Les dividendes arrivent en liquidités ; la plus-value n’existe qu’à la vente. Montants pédagogiques, hors frais et impôts.',
    events: [
      {
        at: 'Jour 0',
        title: 'Achat',
        amount: '10 000 $',
        note: '200 actions × 50 $',
        emphasis: true,
      },
      {
        at: 'Fin année 1',
        title: 'Dividende',
        amount: '200 $',
        note: 'Cours toujours 50 $ · valeur titres 10 000 $',
      },
      {
        at: 'Fin année 2',
        title: 'Dividende + hausse',
        amount: '200 $ + cours 55 $',
        note: 'Valeur titres 11 000 $ · div. cumulés 400 $',
        emphasis: true,
      },
      {
        at: 'Vente',
        title: 'Résultat total',
        amount: '1 400 $',
        note: 'Plus-value 1 000 $ + dividendes 400 $',
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'valeur', name: 'Valeur des titres' },
        { key: 'divCumules', name: 'Dividendes cumulés' },
      ],
      points: [
        { at: 'Achat', valeur: 10000, divCumules: 0 },
        { at: 'Fin an 1', valeur: 10000, divCumules: 200 },
        { at: 'Fin an 2', valeur: 11000, divCumules: 400 },
        { at: 'Après vente', valeur: 0, divCumules: 400 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Actions (ordinaires, privilégiées, etc.)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/actions',
    },
    {
      name: 'AMF — Diversifier ses placements',
      url: 'https://lautorite.qc.ca/grand-public/investissements/conseils-cles-avant-dinvestir/diversifier-ses-placements',
    },
    {
      name: 'AMF — Fonds communs de placement',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-communs-de-placement',
    },
    {
      name: 'AMF — Fonds négociés en bourse (FNB)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-negocies-en-bourse-fnb',
    },
    {
      name: 'OSC — GetSmarterAboutMoney : actions (stocks)',
      url: 'https://www.getsmarteraboutmoney.ca/learning-path/stocks/',
    },
    {
      name: 'ARC — Crédit d’impôt fédéral pour dividendes (ligne 40425)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/tout-votre-declaration-revenus/declaration-revenus/remplir-declaration-revenus/deductions-credits-depenses/ligne-40425-credit-impot-federal-dividendes.html',
    },
    {
      name: 'ARC — Folio S3-F2-C2, dividendes imposables (sociétés résidant au Canada)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/renseignements-techniques/impot-revenu/folios-impot-revenu/serie-3-biens-placements-regimes-epargne/serie-3-biens-placements-regimes-epargne-folio-2-dividendes/folio-impot-revenu-s3-f2-c2-dividendes-imposables-provenant-societes-qui-resident-canada.html',
    },
    {
      name: 'Revenu Québec — Crédit d’impôt pour dividendes',
      url: 'https://www.revenuquebec.ca/fr/citoyens/credits-dimpot/credit-dimpot-pour-dividendes/',
    },
    {
      name: 'Revenu Québec — Ligne 415, crédit d’impôt pour dividendes',
      url: 'https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/400-a-447-impot-et-cotisations/ligne-415/',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['obligations', 'fonds-communs', 'fnb', 'non-enregistre'],
  seoTitle: 'Actions et dividendes : bases pour investisseurs | Apprendre',
  seoDescription:
    'Mini-formation sur les actions ordinaires : plus-value, dividendes, risque de marché, dilution, crédit d’impôt canadien et accès via fonds, FNB ou titres individuels.',
};
