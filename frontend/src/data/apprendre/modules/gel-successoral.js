/**
 * Mini-formation gel successoral — niveau avancé.
 * Éducatif uniquement — pas un avis fiscal ou juridique.
 */
export const module = {
  id: 'gel-successoral',
  audiences: ['prive'],
  category: 'corpo',
  title: 'Gel successoral',
  subtitle: 'Figer la valeur, laisser croître la relève',
  shortDescription:
    'Idée du gel (estate freeze), actions préférentielles vs ordinaires, et lien avec la liquidité d’impôt au décès — hors conseil personnalisé.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Idée', value: 'Figer la valeur actuelle pour le parent' },
    { label: 'Croissance', value: 'Future appréciation vers la relève' },
    { label: 'Attention', value: 'Structure juridique et fiscale sur mesure' },
  ],
  sections: [
    {
      heading: 'Quel problème le gel vise-t-il ?',
      paragraphs: [
        'Si votre société prend de la valeur année après année, cette croissance gonfle souvent la facture d’impôt au décès — on parle de disposition réputée de vos actions. Plus l’entreprise croît, plus l’exposition fiscale potentielle augmente.',
        'Un gel successoral (estate freeze) cherche à « figer » la valeur actuelle pour vous, et à faire profiter la relève — enfants, holding ou fiducie — de la croissance future.',
        'Ce n’est pas une magie anti-impôt : c’est une réorganisation planifiée. Mal exécuté, le gel coûte cher ou crée des conflits familiaux.',
      ],
    },
    {
      heading: 'Comment ça fonctionne en pratique',
      paragraphs: [
        'Typiquement, vous échangez vos actions ordinaires (qui croissent) contre des actions préférentielles. Leur valeur est fixée à la juste valeur marchande (JVM) — le prix de marché estimé — du jour du gel.',
        'De nouvelles actions ordinaires sont émises à la relève pour une mise de fonds modeste. Ce sont elles qui captureront la hausse de valeur à venir.',
        'Les détails techniques — échanges d’actions, articles du droit fiscal — appartiennent à vos conseillers. Cette capsule décrit seulement la logique.',
      ],
    },
    {
      heading: 'Qui garde le contrôle, qui prend la hausse',
      paragraphs: [
        'Vous conservez souvent un contrôle via des droits de vote, et un droit à la valeur figée (rachat des préférentielles). La relève détient la « hausse » à venir sur les nouvelles ordinaires.',
        'Préférentielles = valeur fixe pour le parent. Ordinaires = croissance pour la relève. Les deux coexistent après le gel.',
        'Clarifiez aussi la gouvernance : qui vote quoi, qui peut vendre, comment on fixe un futur rachat. Sans ça, la structure crée plus de tension que de clarté.',
      ],
    },
    {
      heading: 'Prévoir la liquidité d’impôt',
      paragraphs: [
        'Même après un gel, la valeur figée reste imposable un jour — à votre décès ou au rachat. L’impôt porte sur le gain (valeur figée moins le prix de base rajusté, ou ACB), pas sur le montant gelé en entier.',
        'L’assurance vie corporative ou personnelle est souvent étudiée pour financer cette facture sans forcer une vente d’actifs. Le gel ne remplace ni une convention entre actionnaires, ni une volonté claire sur qui reprend l’entreprise.',
      ],
    },
    {
      heading: 'Quand le gel n’est pas adapté',
      paragraphs: [
        'Entreprise sans relève intéressée, valeur encore faible, actionnaire unique jeune sans enjeu successoral, ou situation familiale conflictuelle non clarifiée : le gel apporte peu — ou aggrave les tensions.',
        'Un gel impose aussi de la gouvernance : la relève devient actionnaire. Toute opération doit être validée par un fiscaliste et un avocat en droit des sociétés. Cette formation est strictement éducative.',
      ],
      bullets: [
        'Clarifiez d’abord la relève, le contrôle et la JVM au moment du gel.',
        'Prévoyez la liquidité d’impôt sur le gain (valeur figée − ACB).',
        'Alignez testament, convention et structure d’actions.',
        'Ne signez rien sans avis fiscal et juridique.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — geler à 3 000 000 $',
    intro: 'Chiffres pédagogiques. Aucune structure réelle n’est recommandée ici.',
    steps: [
      {
        label: 'Avant',
        detail:
          'Vos ordinaires valent 3 000 000 $. Toute croissance future augmenterait votre exposition au décès.',
      },
      {
        label: 'Gel',
        detail:
          'Vous recevez des préférentielles de 3 000 000 $. La relève souscrit les nouvelles ordinaires.',
      },
      {
        label: 'Plus tard',
        detail:
          'L’entreprise vaut 5 000 000 $. Votre gel reste 3 000 000 $ ; 2 000 000 $ de croissance sont du côté de la relève.',
      },
      {
        label: 'Liquidité',
        detail:
          'Il faudra quand même financer l’impôt sur le gain lié au gel (jusqu’à ~3 000 000 $ moins votre ACB) le moment venu — d’où l’étude d’assurance.',
      },
    ],
    result:
      'Gel à 3 000 000 $ ; croissance ultérieure de 2 000 000 $ attribuée à la relève dans l’illustration.',
  },
  timeline: {
    title: 'Ligne du temps — valeur figée vs croissance',
    caption: 'Répartition illustrative après appréciation de 2 000 000 $.',
    events: [
      { at: 'Gel', title: 'Valeur figée (préf.)', amount: '3 000 000 $', emphasis: true },
      { at: 'Plus tard', title: 'JVM totale', amount: '5 000 000 $' },
      { at: 'Relève', title: 'Croissance captée', amount: '2 000 000 $', emphasis: true },
      { at: 'Décès', title: 'Impôt sur le gain', amount: 'Jusqu’à ~3 M$ − ACB', note: 'Liquidité à prévoir' },
    ],
    chart: {
      type: 'bar',
      series: [
        { key: 'gel', name: 'Valeur figée' },
        { key: 'croissance', name: 'Croissance relève' },
      ],
      points: [
        { at: 'Au gel', gel: 3000000, croissance: 0 },
        { at: 'Plus tard', gel: 3000000, croissance: 2000000 },
      ],
    },
  },
  takeaways: [
    'Le gel fige votre valeur actuelle et oriente la croissance future vers la relève.',
    'Préférentielles = valeur fixe ; ordinaires = croissance.',
    'La liquidité d’impôt sur le gain (valeur figée − ACB) reste un enjeu.',
    'Structure sur mesure : fiscaliste + avocat indispensables.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'gel-q1',
        prompt:
          'Dans l’exemple, si la JVM passe de 3 M$ à 5 M$ après le gel, la croissance côté relève est…',
        choices: ['5 000 000 $', '2 000 000 $', '3 000 000 $'],
        correctIndex: 1,
        explanation: '5 M − 3 M gelés = 2 M de croissance.',
      },
      {
        id: 'gel-q2',
        prompt: 'Un gel successoral vise surtout à…',
        choices: [
          'Éliminer tout impôt à jamais',
          'Limiter votre exposition à la croissance future de la société',
          'Remplacer le testament',
        ],
        correctIndex: 1,
        explanation: 'On fige votre valeur ; la suite peut aller à la relève.',
      },
      {
        id: 'gel-q3',
        prompt: 'Après un gel, l’impôt lié à la valeur figée…',
        choices: [
          'Disparaît automatiquement',
          'Reste un enjeu de liquidité au décès ou au rachat (sur le gain, pas sur tout le montant)',
          'Est payé uniquement par les enfants sans planification',
        ],
        correctIndex: 1,
        explanation: 'L’impôt porte sur le gain (valeur figée − ACB), pas sur le montant gelé en entier.',
      },
    ],
  },
  diagram: {
    title: 'Avant / après (concept)',
    type: 'fork',
    source: { id: 'soc', label: 'Valeur de la société', hint: 'JVM du jour' },
    branches: [
      {
        id: 'pref',
        label: 'Actions préférentielles',
        hint: 'Valeur figée — parent',
        edgeLabel: 'Gel',
      },
      {
        id: 'ord',
        label: 'Nouvelles ordinaires',
        hint: 'Croissance — relève',
        edgeLabel: 'Futur',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — 3 M$ + 2 M$',
    type: 'flow',
    nodes: [
      { id: 'g', label: 'Gel 3 000 000 $', emphasis: true },
      { id: 'c', label: 'Croissance 2 000 000 $' },
      { id: 't', label: 'Total 5 000 000 $' },
    ],
    edges: [
      { from: 'g', to: 't' },
      { from: 'c', to: 't' },
    ],
  },
  sources: [
    {
      name: 'ARC — Transferts et réorganisations (survol)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/entreprises/sujets/societes.html',
    },
  ],
  relatedServiceIds: ['entreprise', 'planification'],
  relatedFormationIds: ['convention-actionnaires', 'fiscalite-epargne-corpo'],
  seoTitle: 'Gel successoral | Apprendre',
  seoDescription:
    'Comprendre l’idée d’un gel successoral : valeur figée, croissance pour la relève et liquidité d’impôt.',
};
