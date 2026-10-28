/**
 * Mini-formation convention entre actionnaires — niveau avancé.
 * Contenu éducatif ; ne constitue pas un avis juridique ou fiscal.
 */
export const module = {
  id: 'convention-actionnaires',
  audiences: ['prive'],
  category: 'corpo',
  title: 'Convention entre actionnaires',
  subtitle: 'Rachat, évaluation et assurance',
  shortDescription:
    'Qui rachète les parts, à quel prix, et comment l’assurance vie peut financer l’entente sans vider la trésorerie.',
  readMinutes: 14,
  keyFacts: [
    { label: 'But', value: 'Prévoir qui rachète et à quel prix' },
    { label: 'Déclencheurs', value: 'Décès, invalidité, départ, désaccord' },
    { label: 'Financement', value: 'Souvent assurance vie en société' },
  ],
  sections: [
    {
      heading: 'Pourquoi rédiger une convention',
      paragraphs: [
        'Sans convention entre actionnaires (CEA), le décès ou le départ d’un associé laisse souvent la société et la succession dans le flou : qui devient propriétaire des parts ? À quel prix ? Avec quel argent ?',
        'La CEA fixe ces règles à l’avance : événements déclencheurs, méthode d’évaluation, modalités de paiement et, souvent, obligation de maintenir une assurance.',
        'Ce n’est pas un document cosmétique. Un avocat ou un notaire le rédige ; un fiscaliste valide les effets du montage choisi.',
      ],
    },
    {
      heading: 'Quels événements déclenchent un rachat',
      paragraphs: [
        'Les déclencheurs courants : décès, invalidité permanente, retraite, congédiement, volonté de vendre, ou impasse entre associés (mécanisme « shotgun »). Chaque événement peut prévoir un prix ou une formule différente.',
        'Deux structures reviennent souvent. Soit la société rachète et annule les actions (rachat corporatif). Soit les actionnaires survivants rachètent eux-mêmes (rachat croisé).',
        'Le choix change la fiscalité, qui doit trouver les liquidités, et qui contrôle la police d’assurance. On ne le décide pas le jour du décès.',
      ],
    },
    {
      heading: 'Comment fixer la valeur des parts',
      paragraphs: [
        'La convention définit comment on obtient la juste valeur marchande (JVM) : formule écrite, expert indépendant, ou dernier état financier ajusté. Sans méthode claire, le conflit porte sur le chiffre autant que sur le principe du rachat.',
        'Le capital d’assurance vise en pratique à couvrir la part à racheter. Sous-assurer force un emprunt ou une vente d’actifs ; sur-assurer alourdit les primes sans besoin réel.',
        'Revoyez formule et capital quand la valeur grimpe, après une acquisition, ou quand l’actionnariat change. Une CEA figée sur une vieille JVM crée un trou de financement.',
      ],
    },
    {
      heading: 'Qui possède la police, qui reçoit le capital',
      paragraphs: [
        'En rachat corporatif, la société est souvent titulaire (elle possède le contrat) et bénéficiaire (elle reçoit la prestation). Elle paie les primes, encaisse le capital-décès, puis rachète les actions de la succession.',
        'La prestation reçue par une société canadienne peut, dans plusieurs cas, créditer le compte de dividendes en capital (CDC) — un compte fiscal qui peut faciliter une sortie plus efficace vers les actionnaires. Les détails dépendent du contrat et du coût de base de la police.',
        'Clarifiez toujours trois rôles : titulaire, payeur de primes, bénéficiaire. Une mauvaise désignation verse l’argent à la mauvaise partie au pire moment.',
      ],
      bullets: [
        'Alignez le capital d’assurance sur la formule d’évaluation de la CEA.',
        'Mettez à jour polices et convention après une hausse majeure de la JVM.',
        'Vérifiez titulaire, payeur et bénéficiaire sur chaque police.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — 50/50, JVM 2 000 000 $',
    intro:
      'Alex et Sam détiennent chacun 50 %. Leur CEA prévoit un rachat corporatif financé par assurance vie. Chiffres pédagogiques seulement.',
    steps: [
      {
        label: 'JVM convenue',
        detail: 'L’entreprise vaut 2 000 000 $ selon la formule écrite dans la CEA.',
      },
      {
        label: 'Part à racheter',
        detail: '50 % × 2 000 000 $ = 1 000 000 $. C’est le montant à liquider au décès.',
      },
      {
        label: 'Polices en place',
        detail:
          'La société détient 1 000 000 $ d’assurance sur chaque actionnaire. Elle est titulaire et bénéficiaire.',
      },
      {
        label: 'Au décès',
        detail:
          'Le capital arrive à la société, qui rachète et annule les actions de la succession. Le survivant détient 100 %, sans financer personnellement le million.',
      },
    ],
    result:
      '1 000 000 $ de capital par tête pour financer le rachat de 50 % d’une JVM de 2 000 000 $.',
  },
  timeline: {
    title: 'Ligne du temps — rachat au décès',
    caption: 'JVM 2 000 000 $ → part 1 000 000 $ → capital 1 000 000 $ → rachat.',
    events: [
      {
        at: 'CEA',
        title: 'JVM convenue',
        amount: '2 000 000 $',
        note: 'Alex et Sam · 50 / 50',
      },
      {
        at: 'Police',
        title: 'Capital par tête',
        amount: '1 000 000 $',
        note: '≈ part à racheter',
        emphasis: true,
      },
      {
        at: 'Décès',
        title: 'Prestation à la société',
        amount: '1 000 000 $',
        note: 'Liquidités pour le rachat',
      },
      {
        at: 'Rachat',
        title: 'Parts de la succession',
        amount: '1 000 000 $',
        note: 'Survivant détient 100 %',
        emphasis: true,
      },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'montant', name: 'Montant ($)' }],
      points: [
        { at: 'JVM', montant: 2000000 },
        { at: 'Part 50 %', montant: 1000000 },
        { at: 'Capital', montant: 1000000 },
      ],
    },
  },
  takeaways: [
    'La CEA évite l’improvisation au décès ou au départ.',
    'Le capital d’assurance doit coller à la valeur à racheter.',
    'Titulaire et bénéficiaire déterminent qui reçoit les liquidités.',
    'Faites valider le montage par un avocat et un fiscaliste.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'cea-q1',
        prompt:
          'Dans l’exemple 50/50 sur une JVM de 2 000 000 $, le capital typique par actionnaire est…',
        choices: ['2 000 000 $', '1 000 000 $', '500 000 $'],
        correctIndex: 1,
        explanation: 'La moitié de la JVM = 1 000 000 $ à racheter.',
      },
      {
        id: 'cea-q2',
        prompt: 'Une CEA sert surtout à…',
        choices: [
          'Remplacer les états financiers',
          'Prévoir rachat, prix et financement en cas d’événement',
          'Éliminer tout besoin d’assurance',
        ],
        correctIndex: 1,
        explanation: 'C’est le mode d’emploi du transfert d’actions.',
      },
      {
        id: 'cea-q3',
        prompt: 'En rachat corporatif financé par assurance, la société est souvent…',
        choices: [
          'Sans lien avec la police',
          'Titulaire et bénéficiaire de la police',
          'Interdite de détenir de l’assurance',
        ],
        correctIndex: 1,
        explanation: 'Elle reçoit le capital puis rachète les actions.',
      },
    ],
  },
  diagram: {
    title: 'Chaîne au décès',
    type: 'flow',
    nodes: [
      { id: 'e', label: 'Événement', hint: 'Décès / départ' },
      { id: 'a', label: 'Assurance', hint: 'Capital disponible', emphasis: true },
      { id: 'r', label: 'Rachat', hint: 'Selon la CEA' },
      { id: 'c', label: 'Contrôle', hint: 'Survivant / société' },
    ],
    edges: [
      { from: 'e', to: 'a' },
      { from: 'a', to: 'r' },
      { from: 'r', to: 'c' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple 50/50',
    type: 'flow',
    nodes: [
      { id: 'j', label: 'JVM 2 000 000 $', hint: 'Alex et Sam · 50 / 50' },
      {
        id: 'p',
        label: 'Police 1 000 000 $',
        hint: 'Société titulaire / bénéficiaire',
        emphasis: true,
      },
      {
        id: 'd',
        label: 'Prestation 1 000 000 $',
        hint: 'Versée à la société',
      },
      {
        id: 'x',
        label: 'Rachat 50 %',
        hint: 'Survivant à 100 %',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'j', to: 'p', label: '50 %' },
      { from: 'p', to: 'd', label: 'Décès' },
      { from: 'd', to: 'x', label: 'Rachat' },
    ],
  },
  sources: [
    {
      name: 'AMF — Assurance et entreprise',
      url: 'https://lautorite.qc.ca/grand-public/assurance',
    },
  ],
  relatedServiceIds: ['entreprise', 'assurance-vie'],
  relatedFormationIds: ['protections-corpo', 'fiscalite-epargne-corpo'],
  seoTitle: 'Convention entre actionnaires | Apprendre',
  seoDescription:
    'CEA : déclencheurs, évaluation, rachat et financement par assurance vie.',
};
