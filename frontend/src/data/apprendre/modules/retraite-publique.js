/**
 * Mini-formation retraite publique — RRQ / SV — niveau base.
 */
export const module = {
  id: 'retraite-publique',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Retraite publique',
  subtitle: 'RRQ, Sécurité de la vieillesse et SRG',
  shortDescription:
    'Comprendre la RRQ et la SV, l’effet de l’âge de début, la récupération fiscale, et le rôle de l’épargne personnelle.',
  readMinutes: 12,
  keyFacts: [
    { label: 'RRQ', value: 'Dès 60 ans ; montant selon l’âge de début' },
    { label: 'SV', value: 'Dès 65 ans (fédéral), sous conditions de résidence' },
    { label: 'Complément', value: 'REER, FERR, CELI, pension' },
  ],
  sections: [
    {
      heading: 'Quels programmes forment le socle public',
      paragraphs: [
        'Au Québec, la retraite de base combine surtout deux programmes distincts : le Régime de rentes du Québec (RRQ) et la Sécurité de la vieillesse (SV) fédérale. Caisses, règles et critères d’admissibilité ne se confondent pas.',
        'La RRQ dépend de vos cotisations pendant la vie active. La SV dépend surtout de votre résidence au Canada et de votre âge, pas des cotisations d’employeur.',
        'Si le revenu est faible, le Supplément de revenu garanti (SRG) peut s’ajouter à la SV. C’est un complément ciblé, pas un troisième régime universel.',
      ],
    },
    {
      heading: 'Comment l’âge de début change la RRQ',
      paragraphs: [
        'Vous pouvez demander la RRQ dès 60 ans, ou attendre jusqu’à 70 ans. Plus tôt vous commencez, plus le montant mensuel est réduit ; plus tard, plus il est majoré.',
        'Autrement dit : un chèque plus petit plus longtemps, ou un plus grand plus tard. Demander tôt n’est pas une erreur si vous avez besoin du revenu maintenant.',
        'Le « bon » âge dépend de votre santé, de vos autres revenus, de votre besoin de liquidités et de votre espérance de vie — pas seulement du taux de majoration.',
      ],
    },
    {
      heading: 'Que retenir sur la SV et la récupération',
      paragraphs: [
        'La SV commence en général à 65 ans. Reporter après 65 ans est possible et majore la prestation, selon des règles précises. Vérifiez auprès de Service Canada avant de décider.',
        'Si votre revenu net est élevé, une partie de la SV peut être récupérée par un impôt de récupération (souvent appelé « clawback »). Les retraits de REER ou de FERR augmentent ce revenu ; les retraits de CELI, en principe non.',
      ],
    },
    {
      heading: 'Pourquoi le public ne suffit pas seul',
      paragraphs: [
        'Pour la plupart des ménages, RRQ + SV ne remplacent qu’une fraction du revenu de travail. Le reste vient d’un régime de pension d’employeur (RPA), du REER ou FERR, du CELI, et parfois d’un compte non enregistré.',
        'Estimez d’abord vos prestations publiques (estimateurs Retraite Québec et Service Canada), puis comparez avec vos dépenses cibles à la retraite. L’écart, c’est ce que l’épargne personnelle doit combler.',
      ],
    },
    {
      heading: 'Par où commencer concrètement',
      paragraphs: [
        'Consultez votre relevé de participation RRQ et votre estimation SV. Notez les âges possibles de début et l’effet approximatif sur le montant mensuel.',
        'Ensuite, placez ces montants à côté de votre budget cible. Vous verrez tout de suite si le socle public suffit — ou ce qu’il reste à bâtir.',
      ],
      bullets: [
        'Séparez RRQ (cotisations) et SV (âge + résidence).',
        'Testez l’âge de début RRQ avant de fixer une date.',
        'Surveillez l’effet des retraits REER/FERR sur la SV.',
        'Comblez l’écart avec pension, REER/FERR ou CELI.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — même rente de base, deux âges',
    intro:
      'Illustration pédagogique. Montants ronds, pas votre relevé officiel. Facteurs de réduction et de majoration simplifiés.',
    steps: [
      {
        label: 'Rente à 65 ans',
        detail: 'Supposons une RRQ de 1 000 $ par mois si démarrée à 65 ans.',
      },
      {
        label: 'À 60 ans',
        detail:
          'Réduction d’environ 30 % à 36 % (0,5 % à 0,6 % par mois × 60 mois, selon le montant de la rente) → ≈ 640 $ à 700 $ / mois, mais cinq ans plus tôt.',
      },
      {
        label: 'À 70 ans',
        detail:
          'Majoration d’environ 42 % (0,7 % par mois × 60 mois) → ≈ 1 420 $ / mois, en attendant cinq ans de plus.',
      },
      {
        label: 'Lecture',
        detail:
          'Ce n’est pas seulement « le plus gros chèque » : c’est liquidité, santé et autres revenus. Vérifiez vos facteurs sur Retraite Québec.',
      },
    ],
    result:
      'Même base 1 000 $ à 65 ans → ≈ 640 $ à 700 $ dès 60 ans ou ≈ 1 420 $ à 70 ans (ordres de grandeur). Votre relevé RRQ fait foi.',
  },
  timeline: {
    title: 'Ligne du temps — âge de début RRQ',
    caption:
      'Ordres de grandeur à partir d’une rente de 1 000 $/mois à 65 ans (barre 60 ans = réduction max. ~36 %).',
    events: [
      { at: '60 ans', title: 'Début anticipé', amount: '≈ 640–700 $/mois', note: 'Réduction ~30–36 %' },
      { at: '65 ans', title: 'Âge de référence', amount: '1 000 $/mois', emphasis: true },
      { at: '70 ans', title: 'Début reporté', amount: '≈ 1 420 $/mois', note: 'Majoration ~42 %' },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'mensuel', name: 'Prestation mensuelle ($)' }],
      points: [
        { at: '60 ans', mensuel: 640 },
        { at: '65 ans', mensuel: 1000 },
        { at: '70 ans', mensuel: 1420 },
      ],
    },
  },
  takeaways: [
    'RRQ et SV sont deux programmes distincts.',
    'L’âge de début change le montant mensuel.',
    'Un revenu élevé peut faire récupérer une partie de la SV.',
    'REER, CELI et pension complètent le socle public.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'rp-q1',
        prompt: 'Dans l’exemple, une rente de 1 000 $ à 65 ans devient environ combien à 60 ans ?',
        choices: ['1 000 $', '640 $ à 700 $', '1 420 $'],
        correctIndex: 1,
        explanation: 'Réduction d’environ 30 % à 36 % (0,5 % à 0,6 %/mois selon le montant) → ~640 $ à 700 $.',
      },
      {
        id: 'rp-q2',
        prompt: 'La Sécurité de la vieillesse…',
        choices: [
          'Est payée par Retraite Québec selon vos cotisations RRQ',
          'Est un programme fédéral lié surtout à l’âge et à la résidence',
          'Remplace entièrement le REER',
        ],
        correctIndex: 1,
        explanation: 'SV = fédéral ; RRQ = régime québécois cotisé.',
      },
      {
        id: 'rp-q3',
        prompt: 'Quel retrait n’augmente en principe pas le revenu pour la récupération de la SV ?',
        choices: ['Retrait REER', 'Retrait FERR', 'Retrait CELI'],
        correctIndex: 2,
        explanation: 'Les retraits CELI ne s’ajoutent pas au revenu imposable.',
      },
    ],
  },
  diagram: {
    title: 'Sources de revenu à la retraite',
    type: 'fork',
    source: { id: 'rev', label: 'Revenu à la retraite', hint: 'Besoin mensuel' },
    branches: [
      { id: 'pub', label: 'Public', hint: 'RRQ + SV (± SRG)', edgeLabel: 'Socle' },
      { id: 'emp', label: 'Employeur', hint: 'RPA / RRCD', edgeLabel: 'Si disponible' },
      { id: 'perso', label: 'Personnel', hint: 'REER, CELI, autres', edgeLabel: 'À bâtir' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — 60 vs 65 vs 70',
    type: 'flow',
    nodes: [
      { id: 'b', label: 'Base 1 000 $ à 65 ans', emphasis: true },
      { id: 't', label: '≈ 640–700 $ à 60 ans', hint: 'Plus tôt' },
      { id: 's', label: '≈ 1 420 $ à 70 ans', hint: 'Plus tard' },
    ],
    edges: [
      { from: 'b', to: 't', label: '−30–36 % env.' },
      { from: 'b', to: 's', label: '+42 % env.' },
    ],
  },
  sources: [
    {
      name: 'Retraite Québec —Rente de retraite',
      url: 'https://www.rrq.gouv.qc.ca/fr/retraite/',
    },
    {
      name: 'Service Canada — Sécurité de la vieillesse',
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse.html',
    },
  ],
  relatedServiceIds: ['planification', 'epargne'],
  relatedFormationIds: ['reer-ferr', 'decaissement-retraite'],
  seoTitle: 'RRQ et Sécurité de la vieillesse | Apprendre',
  seoDescription:
    'Comprendre la RRQ, la SV, l’âge de début et le rôle de l’épargne personnelle.',
};
