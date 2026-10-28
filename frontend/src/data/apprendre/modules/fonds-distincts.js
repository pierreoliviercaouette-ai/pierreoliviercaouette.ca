/**
 * Mini-formation — Fonds distincts (assurance).
 * Sources : AMF (fonds distincts, garanties), ia.ca.
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'fonds-distincts',
  audiences: ['particulier'],
  category: 'placements',
  title: 'Les fonds distincts',
  subtitle: 'Contrat d’assurance, garanties et frais',
  shortDescription:
    'Un fonds distinct est un placement dans un contrat d’assurance : garanties à l’échéance et au décès, frais, bénéficiaires, et différences clés avec un fonds commun.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Nature', value: 'Contrat d’assurance + placement' },
    { label: 'Garanties', value: 'Échéance et décès (ex. structure 75/100)' },
    { label: 'Contrepartie', value: 'Frais souvent plus élevés qu’un fonds commun' },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’un fonds distinct?',
      paragraphs: [
        'Un fonds distinct regroupe l’épargne de plusieurs personnes dans un portefeuille géré selon un objectif — actions, obligations, ou un mélange. Sur ce point, il ressemble à un fonds commun de placement.',
        'La différence essentielle : vous détenez des unités dans un contrat d’assurance (souvent appelé contrat individuel à capital variable). Ce contrat ajoute des garanties écrites à l’échéance et au décès, en échange de frais qui incluent le coût de ces protections.',
        'L’actif du fonds est géré séparément du patrimoine de l’assureur — d’où le nom « distinct ». Le rendement du portefeuille n’est pas garanti ; seules les garanties du contrat le sont, aux conditions prévues.',
      ],
    },
    {
      heading: 'Lire les garanties échéance et décès',
      paragraphs: [
        'Les contrats décrivent souvent les garanties avec deux chiffres, par exemple 75/100. Le premier indique le pourcentage minimal des dépôts protégés à l’échéance du contrat ; le second, le pourcentage minimal protégé au décès.',
        'À l’échéance ou au décès, vous (ou vos bénéficiaires) recevez en général le plus élevé entre la valeur marchande des unités et le montant garanti. D’autres structures existent (75/75, 100/100, parfois une protection liée à l’inflation) : lisez toujours votre contrat.',
        'Pour profiter de la garantie, il faut en principe conserver le placement jusqu’à l’échéance ou jusqu’au décès, selon la première éventualité. Un retrait anticipé ne déclenche en général pas la garantie ; vous récupérez alors surtout la valeur marchande, moins les frais applicables.',
      ],
    },
    {
      heading: 'Frais, horizon et comparaison avec un fonds commun',
      paragraphs: [
        'Les frais d’un fonds distinct sont souvent plus élevés que ceux d’un fonds commun comparable, parce qu’ils financent aussi les garanties d’assurance. Comme pour un fonds commun, ces frais réduisent le rendement net sans toujours apparaître comme un prélèvement séparé sur votre relevé.',
        'Un fonds commun n’offre pas ces garanties contractuelles d’échéance et de décès. Il peut convenir si vous acceptez la volatilité sans plancher d’assurance, ou si l’horizon et le besoin de liquidité ne justifient pas le coût des garanties.',
        'Le fonds distinct vise surtout un horizon long (souvent dix ans ou plus selon le contrat) et une volonté de payer pour un plancher à l’échéance ou au décès. Comparez le niveau de garantie, la durée, les frais et votre besoin réel de liquidité avant d’immobiliser l’épargne.',
      ],
    },
    {
      heading: 'Bénéficiaires et limites utiles',
      paragraphs: [
        'Parce qu’il s’agit d’un contrat d’assurance, vous désignez en général un ou des bénéficiaires. Au décès, la prestation prévue peut être versée directement au bénéficiaire désigné, ce qui peut simplifier le règlement par rapport à un actif qui passe entièrement par la succession — sous réserve des règles fiscales et juridiques applicables.',
        'Désigner un bénéficiaire ne remplace pas un testament pour le reste du patrimoine. Vérifiez aussi l’effet d’un retrait, d’une réinitialisation de garantie (si le contrat le permet) ou d’un changement de série : chaque geste peut modifier le montant garanti ou reporter l’échéance.',
        'Ce n’est ni un CPG à taux fixe ni une promesse de rendement. Les marchés peuvent baisser pendant la durée ; la garantie agit aux moments prévus au contrat, pas comme un filet quotidien.',
      ],
      bullets: [
        'Conservez jusqu’à l’échéance (ou au décès) pour déclencher la garantie.',
        'Comparez frais et niveau de garantie (ex. 75/100) au besoin réel.',
        'Tenez à jour la désignation de bénéficiaire et lisez le contrat.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Sophie, garantie 75/100',
    intro:
      'Illustration pédagogique inspirée de la logique des garanties (structure 75/100). Montants fictifs pour montrer le plancher, pas une cotation ni un conseil personnalisé. Aucun rendement n’est promis.',
    steps: [
      {
        label: 'Mise en place',
        detail:
          'Sophie dépose 40 000 $ dans un fonds distinct avec une garantie 75/100 et une échéance de 10 ans. Plancher à l’échéance : 75 % × 40 000 $ = 30 000 $. Plancher au décès : 100 % × 40 000 $ = 40 000 $.',
      },
      {
        label: 'Pendant le contrat',
        detail:
          'La valeur marchande fluctue. À l’an 5, elle vaut environ 35 000 $ ; à l’an 8, environ 31 000 $. Tant que Sophie ne rachète pas, ces baisses ne déclenchent pas encore la garantie.',
      },
      {
        label: 'À l’échéance — marché bas',
        detail:
          'À 10 ans, la valeur marchande est de 28 000 $. Sophie reçoit le plus élevé entre 28 000 $ et le plancher de 30 000 $ → 30 000 $. La garantie comble l’écart de 2 000 $.',
      },
      {
        label: 'Si décès avant l’échéance',
        detail:
          'Supposons un décès à l’an 8, valeur marchande 31 000 $. Les bénéficiaires reçoivent le plus élevé entre 31 000 $ et 40 000 $ → 40 000 $. Avec un fonds commun sans garantie, ils auraient reçu la valeur marchande seule.',
      },
    ],
    result:
      'Sophie voit que la structure 75/100 fixe des planchers (30 000 $ à l’échéance, 40 000 $ au décès), pas un rendement. Si la valeur marchande dépasse le plancher, c’est la valeur marchande qui compte. Un retrait anticipé aurait en général annulé cet avantage.',
  },
  takeaways: [
    'Un fonds distinct combine placement et contrat d’assurance avec garanties.',
    'Structure du type 75/100 : plancher à l’échéance, puis au décès — lire le contrat.',
    'Les frais financent aussi les garanties ; un retrait anticipé les fait souvent perdre.',
    'Les bénéficiaires désignés peuvent recevoir la prestation selon les règles du contrat.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'fonds-distincts-q1',
        prompt:
          'Dans l’exemple de Sophie (40 000 $, garantie 75/100), que reçoit-elle à l’échéance si la valeur marchande est de 28 000 $?',
        choices: [
          '28 000 $ seulement, sans plancher',
          '30 000 $ (le plus élevé entre la valeur marchande et 75 % des dépôts)',
          '40 000 $ automatiquement, comme un CPG',
        ],
        correctIndex: 1,
        explanation:
          'À l’échéance, le contrat verse le plus élevé entre la valeur marchande (28 000 $) et 75 % des dépôts (30 000 $). Sophie reçoit donc 30 000 $.',
      },
      {
        id: 'fonds-distincts-q2',
        prompt:
          'Que signifie surtout une structure de garantie écrite « 75/100 »?',
        choices: [
          'Un rendement annuel garanti de 75 %, puis de 100 %',
          '75 % des dépôts protégés à l’échéance et 100 % au décès (aux conditions du contrat)',
          'Que les frais sont fixés à 75 % ou 100 % du capital',
        ],
        correctIndex: 1,
        explanation:
          'Le premier chiffre porte sur la garantie à l’échéance ; le second, sur la garantie au décès. Ce n’est ni un taux de rendement ni un pourcentage de frais.',
      },
      {
        id: 'fonds-distincts-q3',
        prompt:
          'Quelle différence pratique distingue souvent un fonds distinct d’un fonds commun?',
        choices: [
          'Seul le fonds commun peut détenir des actions',
          'Le fonds distinct est un contrat d’assurance avec garanties d’échéance et/ou de décès ; le fonds commun n’offre pas ces garanties contractuelles',
          'Un fonds distinct n’a jamais de frais',
        ],
        correctIndex: 1,
        explanation:
          'Les deux peuvent investir dans des titres similaires. Le fonds distinct ajoute des garanties d’assurance (et souvent des frais plus élevés) ; le fonds commun n’a pas ces planchers contractuels.',
      },
    ],
  },
  diagram: {
    title: 'Parcours — fonds distinct',
    type: 'flow',
    nodes: [
      { id: 'depot', label: 'Dépôts', hint: 'Épargne dans le contrat' },
      {
        id: 'contrat',
        label: 'Contrat d’assurance',
        hint: 'Unités de fonds distinct',
        emphasis: true,
      },
      { id: 'marche', label: 'Valeur marchande', hint: 'Fluctue avec les marchés' },
      {
        id: 'garanties',
        label: 'Garanties',
        hint: 'Échéance et / ou décès',
      },
    ],
    edges: [
      { from: 'depot', to: 'contrat', label: 'Investir' },
      { from: 'contrat', to: 'marche', label: 'Portefeuille' },
      { from: 'contrat', to: 'garanties', label: 'Protection écrite' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Sophie — 40 000 $, 75/100',
    type: 'fork',
    source: {
      id: 'start',
      label: '40 000 $ déposés',
      hint: 'Garantie 75/100 · 10 ans',
    },
    branches: [
      {
        id: 'maturity',
        label: 'Échéance : plancher 30 000 $',
        hint: 'Si marché 28 000 $ → 30 000 $',
        edgeLabel: 'À l’échéance',
      },
      {
        id: 'death',
        label: 'Décès : plancher 40 000 $',
        hint: 'Si marché 31 000 $ → 40 000 $',
        edgeLabel: 'Au décès',
        emphasis: true,
      },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Sophie, dix ans',
    caption:
      'Valeur marchande illustrée vs planchers 75 % (échéance) et 100 % (décès). Montants pédagogiques seulement.',
    events: [
      {
        at: 'An 0',
        title: 'Dépôt',
        amount: '40 000 $',
        note: 'Garantie 75/100',
        emphasis: true,
      },
      {
        at: 'An 5',
        title: 'Valeur marchande',
        amount: '~35 000 $',
        note: 'Garantie non encore déclenchée',
      },
      {
        at: 'An 8',
        title: 'Scénario décès',
        amount: '40 000 $',
        note: 'Max(31 000 $, 40 000 $)',
      },
      {
        at: 'An 10',
        title: 'Échéance (marché bas)',
        amount: '30 000 $',
        note: 'Max(28 000 $, 30 000 $)',
        emphasis: true,
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'marche', name: 'Valeur marchande ($)' },
        { key: 'plancherEch', name: 'Plancher échéance 75 % ($)' },
      ],
      points: [
        { at: 'An 0', marche: 40000, plancherEch: 30000 },
        { at: 'An 2', marche: 42000, plancherEch: 30000 },
        { at: 'An 5', marche: 35000, plancherEch: 30000 },
        { at: 'An 8', marche: 31000, plancherEch: 30000 },
        { at: 'An 10', marche: 28000, plancherEch: 30000 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Les fonds distincts',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-distincts',
    },
    {
      name: 'AMF — Fonds communs de placement (comparaison)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-communs-de-placement',
    },
    {
      name: 'iA Groupe financier — Fonds distincts',
      url: 'https://ia.ca/particuliers/produits-placement/fonds-distincts',
    },
    {
      name: 'iA Groupe financier — Garanties de fonds distincts',
      url: 'https://ia.ca/particuliers/produits-placement/fonds-garantis/garanties',
    },
  ],
  relatedServiceIds: ['epargne', 'assurance-vie'],
  relatedFormationIds: [
    'fonds-communs',
    'assurance-vie-permanente',
    'cpg-pglm',
    'succession-bases',
  ],
  seoTitle: 'Fonds distincts : garanties, frais et bénéficiaires | Apprendre',
  seoDescription:
    'Mini-formation sur les fonds distincts : contrat d’assurance, garanties à l’échéance et au décès (structure 75/100), frais, bénéficiaires et comparaison avec les fonds communs.',
};
