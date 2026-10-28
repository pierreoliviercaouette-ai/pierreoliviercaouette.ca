/**
 * Mini-formation assurance collective — niveau base.
 */
export const module = {
  id: 'assurance-collective',
  audiences: ['particulier'],
  category: 'assurance',
  title: 'Assurance collective',
  subtitle: 'Lire les garanties de l’employeur',
  shortDescription:
    'Vie, invalidité, médicaments : plafonds, fiscalité, fin d’emploi et quand compléter avec une police individuelle.',
  readMinutes: 12,
  keyFacts: [
    { label: 'Portée', value: 'Souvent vie + invalidité + santé/dentaire' },
    { label: 'Limite', value: 'Plafonds et définitions du contrat collectif' },
    { label: 'Emploi', value: 'La couverture peut cesser si vous quittez' },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’un régime collectif ?',
      paragraphs: [
        'Un régime d’assurance collective (souvent via l’employeur) regroupe plusieurs garanties sous un même contrat : assurance vie de base, invalidité de courte ou longue durée, médicaments, soins dentaires, parfois maladies graves.',
        'Les montants et pourcentages sont fixés par le régime, pas par votre besoin individuel. Vous entrez dans une grille déjà écrite.',
        'C’est un excellent socle, surtout si l’employeur paie une part des primes. Pour une famille avec hypothèque et enfants, ce n’est rarement une couverture complète à elle seule.',
      ],
    },
    {
      heading: 'Lisez les plafonds, pas seulement le pourcentage',
      paragraphs: [
        'L’invalidité collective verse souvent un pourcentage du salaire jusqu’à un maximum mensuel en dollars. Si votre salaire est élevé, ce plafond peut laisser un trou important — même quand le pourcentage paraît généreux.',
        'La définition d’invalidité compte autant que le montant. Beaucoup de régimes passent de « propre emploi » (votre poste) à « toute occupation » (tout emploi raisonnablement compatible) après une période. Le délai de carence, lui, décale la date du premier versement.',
        'L’assurance vie collective offre souvent un multiple du salaire. Face à une hypothèque importante, ce capital peut être insuffisant — d’où une temporaire individuelle en complément.',
      ],
    },
    {
      heading: 'Qui paie la prime change l’impôt',
      paragraphs: [
        'Si l’employeur paie la prime d’invalidité, les prestations sont souvent imposables. Si vous payez la prime avec de l’argent déjà imposé, elles peuvent être non imposables — selon la structure du régime.',
        'Cette nuance change le montant net réellement disponible pour le ménage. Un même plafond brut ne donne pas le même filet selon qui finance la prime.',
        'Pour l’assurance vie collective, le capital-décès est en général versé libre d’impôt au bénéficiaire désigné, comme une police individuelle typique.',
      ],
    },
    {
      heading: 'Anticipez la fin d’emploi',
      paragraphs: [
        'En quittant l’employeur, la plupart des garanties cessent. Certaines offrent une conversion rapide en police individuelle, parfois sans nouvelles preuves médicales, mais à une prime plus élevée. Les délais figurent dans la brochure du régime.',
        'Avant de dépendre uniquement du collectif, demandez-vous ce qui arrive si vous changez d’emploi, devenez travailleur autonome, ou si l’employeur modifie le régime.',
        'Repérez d’abord ce que le livret couvre vraiment, puis mesurez l’écart avec le besoin du ménage. Le complément individuel, s’il y a lieu, vise ce trou — pas un doublement inutile.',
      ],
      bullets: [
        'Plafond d’invalidité et multiple de salaire en vie',
        'Qui paie la prime (effet sur l’impôt des prestations)',
        'Définition d’invalidité et délai de carence',
        'Règles et délais de conversion à la fin d’emploi',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — trou d’invalidité',
    intro:
      'Salaire annuel 90 000 $. Collective : 67 % jusqu’à 4 000 $ bruts/mois. Besoin net du ménage : 4 500 $/mois. Illustration pédagogique.',
    steps: [
      {
        label: 'Prestation max',
        detail:
          'Plafond collectif : 4 000 $ bruts / mois (même si 67 % de 7 500 $ serait plus élevé).',
      },
      {
        label: 'Après impôt',
        detail:
          'Si la prestation est imposable, net illustratif ≈ 3 000 $ (hypothèse). Votre taux réel peut différer.',
      },
      {
        label: 'Besoin',
        detail: 'Le ménage estime avoir besoin de 4 500 $ nets.',
      },
      {
        label: 'Trou',
        detail:
          '4 500 $ − 3 000 $ = 1 500 $ / mois à couvrir autrement (individuelle, épargne).',
      },
    ],
    result:
      'Plafond 4 000 $ bruts → ≈ 3 000 $ nets illustratifs → trou de 1 500 $/mois face à un besoin de 4 500 $.',
  },
  timeline: {
    title: 'Ligne du temps — mesurer le trou',
    caption: 'Du plafond collectif au besoin net du ménage.',
    events: [
      { at: 'Contrat', title: 'Plafond collectif', amount: '4 000 $ bruts', emphasis: true },
      { at: 'Fiscalité', title: 'Net illustratif', amount: '≈ 3 000 $' },
      { at: 'Budget', title: 'Besoin ménage', amount: '4 500 $ nets' },
      { at: 'Écart', title: 'Trou mensuel', amount: '1 500 $', emphasis: true },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'montant', name: '$ / mois' }],
      points: [
        { at: 'Besoin net', montant: 4500 },
        { at: 'Collective nette', montant: 3000 },
        { at: 'Trou', montant: 1500 },
      ],
    },
  },
  takeaways: [
    'Le collectif est un socle, rarement une couverture complète.',
    'Plafonds et définitions comptent plus que le « % du salaire » affiché.',
    'Qui paie la prime peut rendre l’invalidité imposable.',
    'Anticipez la fin d’emploi et les conversions.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'ac-q1',
        prompt: 'Dans l’exemple, le trou mensuel net illustratif est de…',
        choices: ['4 000 $', '1 500 $', '90 000 $'],
        correctIndex: 1,
        explanation: '4 500 − 3 000 = 1 500 $.',
      },
      {
        id: 'ac-q2',
        prompt: 'Si l’employeur paie la prime d’invalidité, les prestations sont souvent…',
        choices: ['Non imposables', 'Imposables', 'Versées en CELI'],
        correctIndex: 1,
        explanation: 'Prime employeur → prestations souvent imposables.',
      },
      {
        id: 'ac-q3',
        prompt: 'À la fin d’un emploi, la couverture collective…',
        choices: [
          'Continue automatiquement à vie',
          'Cesse souvent ou doit être convertie rapidement',
          'Se transforme en REER',
        ],
        correctIndex: 1,
        explanation: 'La portabilité est limitée ; la conversion a des délais.',
      },
    ],
  },
  diagram: {
    title: 'Lire puis compléter',
    type: 'flow',
    nodes: [
      { id: 'l', label: 'Lire le livret', hint: 'Plafonds & définitions' },
      { id: 't', label: 'Mesurer les trous', hint: 'Vie & invalidité', emphasis: true },
      { id: 'c', label: 'Compléter', hint: 'Police individuelle' },
      { id: 'f', label: 'Fin d’emploi', hint: 'Conversion / délai' },
    ],
    edges: [
      { from: 'l', to: 't' },
      { from: 't', to: 'c' },
      { from: 'c', to: 'f', label: 'Anticiper' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — trou 1 500 $',
    type: 'flow',
    nodes: [
      { id: 'p', label: 'Plafond 4 000 $', hint: 'Bruts / mois' },
      { id: 'n', label: 'Net ≈ 3 000 $', hint: 'Après impôt illustratif' },
      { id: 'b', label: 'Besoin 4 500 $', hint: 'Nets ménage', emphasis: true },
      { id: 'e', label: 'Trou 1 500 $', hint: 'Écart à combler' },
    ],
    edges: [
      { from: 'p', to: 'n' },
      { from: 'n', to: 'e' },
      { from: 'b', to: 'e' },
    ],
  },
  sources: [
    {
      name: 'AMF — Assurance collective',
      url: 'https://lautorite.qc.ca/grand-public/assurance',
    },
  ],
  relatedServiceIds: ['invalidite', 'assurance-vie'],
  relatedFormationIds: ['assurance-invalidite', 'assurance-vie-temporaire'],
  seoTitle: 'Assurance collective | Apprendre',
  seoDescription:
    'Comprendre vie et invalidité collectives : plafonds, fiscalité, fin d’emploi et compléments individuels.',
};
