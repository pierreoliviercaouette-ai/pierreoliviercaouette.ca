/**
 * Mini-formation — Assurance invalidité.
 * Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'assurance-invalidite',
  audiences: ['particulier', 'prive'],
  category: 'assurance',
  title: 'Assurance invalidité',
  subtitle: 'Remplacer le revenu quand on ne peut plus travailler',
  shortDescription:
    'Définition d’invalidité, délai de carence, durée et pourcentage des prestations, collective vs individuelle, fiscalité selon qui paie la prime, et distinction avec le CIPH.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Actif protégé', value: 'Capacité de gagner un revenu' },
    { label: 'Levier principal', value: 'Prestation périodique selon le contrat' },
    { label: 'Point de départ', value: 'Besoin net − couverture existante' },
  ],
  sections: [
    {
      heading: 'Remplacer un revenu qui s’arrête',
      paragraphs: [
        'Pour la plupart des ménages, la capacité de travailler est l’actif économique le plus important. Une maladie ou un accident peut interrompre ce flux alors que le logement, les dettes et la famille continuent.',
        'L’assurance invalidité (souvent appelée assurance salaire) verse des prestations périodiques pour remplacer une partie du revenu si vous êtes incapable de travailler selon la définition du contrat. Un diagnostic médical ne déclenche pas automatiquement le paiement : l’assureur applique les critères écrits.',
        'Les régimes publics (assurance-emploi, RRQ, CNESST, SAAQ, etc.) ont leurs propres règles et ne couvrent pas tous les scénarios de la même façon. Lisez aussi votre police privée ou collective.',
      ],
    },
    {
      heading: 'Quelle définition, quelle carence, quelle durée?',
      paragraphs: [
        'Deux familles de définitions reviennent. « Propre emploi » : vous êtes incapable d’exécuter les tâches essentielles de votre emploi habituel — en général plus protecteur, surtout pour les métiers spécialisés.',
        '« Toute occupation » : vous êtes incapable d’exercer tout emploi pour lequel vous êtes raisonnablement qualifié. Le seuil est plus strict. Beaucoup de polices commencent en « propre emploi » (souvent jusqu’à deux ans), puis passent à « toute occupation ».',
        'Le délai de carence est le temps entre le début de l’invalidité et le premier versement. Plus il est long, plus la prime est souvent basse — à condition d’avoir assez d’épargne pour tenir jusque-là. La durée des prestations est plafonnée (un, deux ou cinq ans, ou jusqu’à un âge prévu, souvent 65 ans).',
      ],
    },
    {
      heading: 'Mesurer le pourcentage et le plafond',
      paragraphs: [
        'Les contrats remplacent une fraction du revenu brut — souvent autour des deux tiers — et appliquent un plafond mensuel en dollars. Un pourcentage élevé sur le papier peut laisser un trou important dès que le salaire dépasse le plafond, ou dès que les prestations sont imposables.',
        'La couverture collective (employeur, syndicat, association) est souvent standardisée : vous ne choisissez généralement ni le pourcentage, ni la définition, ni le plafond. C’est un bon socle, mais insuffisant pour plusieurs revenus élevés ou travailleurs autonomes.',
        'L’assurance individuelle se souscrit personne par personne. Elle permet de cibler le montant, la durée et la carence, et d’être portable d’un emploi à l’autre, sous réserve d’admissibilité. Une complémentaire vise typiquement l’écart restant, pas un doublement inutile.',
      ],
    },
    {
      heading: 'Qui paie la prime change l’impôt',
      paragraphs: [
        'Si l’employeur (ou le syndicat) paie une partie de la prime, les prestations sont en général imposables. Si vous payez 100 % de la prime vous-même, elles sont généralement non imposables.',
        'Prestations imposables → raisonner en revenu brut. Prime entièrement à votre charge → partir du revenu net dont le ménage a besoin. Les exclusions (conditions préexistantes, activités à haut risque, coordination avec d’autres prestations) limitent aussi le filet réel.',
        'L’assurance maladie grave et l’assurance invalidité ne jouent pas le même rôle : capital forfaitaire lié à un diagnostic listé d’un côté, flux de revenu lié à l’incapacité de travailler de l’autre. L’une ne remplace pas l’autre.',
      ],
    },
    {
      heading: 'Le CIPH remplace-t-il une rente?',
      paragraphs: [
        'Le crédit d’impôt pour personnes handicapées (CIPH) de l’Agence du revenu du Canada est un crédit non remboursable. Il exige une déficience grave et prolongée attestée (formulaire T2201). Au Québec, un montant distinct peut être demandé à Revenu Québec.',
        'Recevoir une rente d’invalidité ne garantit pas l’admissibilité au CIPH, et inversement : les critères ne sont pas les mêmes. Ces crédits peuvent réduire l’impôt ; ils ne versent pas un revenu mensuel de remplacement.',
      ],
      bullets: [
        'De quel montant net le ménage a-t-il besoin si le salaire s’arrête?',
        'Après collective, carence et imposabilité, quel trou reste-t-il?',
        'Quelle définition, quel plafond et quelle durée restent au contrat?',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple : besoin net, collective et trou à combler',
    intro:
      'Illustration simplifiée pour un salarié québécois. Les taux d’impôt et les plafonds varient ; l’objectif est de montrer la méthode.',
    steps: [
      {
        label: 'Besoin net du ménage',
        detail:
          'Alex et sa famille estiment qu’il leur faut 4 800 $ nets par mois pour maintenir le logement, les dettes et le minimum d’épargne — soit 57 600 $ par année.',
      },
      {
        label: 'Salaire et collective',
        detail:
          'Salaire brut : 90 000 $ / an (7 500 $ / mois). La collective verse 66,67 % du brut, plafonné à 5 000 $ / mois. Prestation brute : 5 000 $ / mois. L’employeur paie une part de la prime : prestations traitées comme imposables ici.',
      },
      {
        label: 'Passage au net',
        detail:
          'Après un impôt approximatif de 25 % sur la prestation (hypothèse pédagogique), il reste environ 3 750 $ nets / mois.',
      },
      {
        label: 'Trou à combler',
        detail:
          'Besoin 4 800 $ − net collectif ≈ 3 750 $ = trou de 1 050 $ nets / mois. Une individuelle dont Alex paierait 100 % des primes viserait typiquement cet écart — sous réserve d’admissibilité et du contrat.',
      },
    ],
    result:
      'Même avec une collective « à 66,67 % », le plafond et l’impôt laissent ici un trou d’environ 1 050 $ nets par mois. Sans ce calcul, on aurait pu croire à tort que « l’employeur couvre déjà tout ».',
  },
  takeaways: [
    'Partir du besoin net, puis vérifier %, plafond, définition, carence et imposabilité.',
    'Qui paie la prime oriente souvent le traitement fiscal des prestations.',
    'CIPH et crédits québécois ≠ prestation mensuelle d’assurance invalidité.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'inv-q1',
        prompt:
          'Dans l’exemple (besoin 4 800 $ nets, collective plafonnée à 5 000 $ bruts imposables ≈ 3 750 $ nets), quel est le trou mensuel approximatif?',
        choices: [
          'Aucun trou : 66,67 % suffit toujours',
          'Environ 1 050 $ nets par mois',
          'Exactement 5 000 $ bruts par mois à assurer en plus',
        ],
        correctIndex: 1,
        explanation:
          '4 800 $ − 3 750 $ ≈ 1 050 $ nets. Le pourcentage brut ne dit rien tant qu’on n’a pas passé au net après plafond et impôt.',
      },
      {
        id: 'inv-q2',
        prompt:
          'Si l’employeur paie une partie de la prime d’invalidité collective, que faut-il souvent anticiper?',
        choices: [
          'Que les prestations seront automatiquement non imposables',
          'Que les prestations peuvent être imposables, ce qui réduit le net disponible',
          'Que le CIPH remplacera la prestation après 90 jours',
        ],
        correctIndex: 1,
        explanation:
          'Quand l’employeur (ou le syndicat) paie une part de la prime, les prestations sont en général imposables — d’où l’importance de raisonner en net.',
      },
      {
        id: 'inv-q3',
        prompt: 'Le crédit d’impôt pour personnes handicapées (ARC)…',
        choices: [
          'Remplace une assurance invalidité dès qu’un médecin confirme un arrêt de travail',
          'Est un crédit fiscal distinct, soumis à des critères d’admissibilité propres (ex. T2201)',
          'Est versé chaque mois comme une rente égale à 66,67 % du salaire',
        ],
        correctIndex: 1,
        explanation:
          'Le CIPH (et le montant québécois connexe) réduit l’impôt si vous êtes admissible ; ce n’est pas un substitut au remplacement de revenu assurantiel.',
      },
    ],
  },
  diagram: {
    title: 'Logique — assurance invalidité',
    type: 'flow',
    nodes: [
      {
        id: 'revenu',
        label: 'Revenu de travail',
        hint: 'Capacité de gain interrompue',
      },
      {
        id: 'contrat',
        label: 'Contrat collectif / individuel',
        hint: 'Définition, carence, % et plafond',
        emphasis: true,
      },
      {
        id: 'prestation',
        label: 'Prestation périodique',
        hint: 'Remplacement partiel, parfois imposable',
      },
      {
        id: 'niveau',
        label: 'Maintien du niveau de vie',
        hint: 'Dépenses et épargne qui continuent',
      },
    ],
    edges: [
      { from: 'revenu', to: 'contrat', label: 'Risque d’interruption' },
      { from: 'contrat', to: 'prestation', label: 'Si admissible' },
      { from: 'prestation', to: 'niveau', label: 'Flux mensuel' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple chiffré — trou à combler',
    type: 'flow',
    nodes: [
      {
        id: 'besoin',
        label: 'Besoin net 4 800 $ / mois',
        hint: 'Budget ménage à maintenir',
      },
      {
        id: 'coll',
        label: 'Collective 5 000 $ bruts',
        hint: 'Plafond ; part employeur → imposable',
      },
      {
        id: 'net',
        label: '≈ 3 750 $ nets',
        hint: 'Après impôt (hypothèse 25 %)',
        emphasis: true,
      },
      {
        id: 'trou',
        label: 'Trou ≈ 1 050 $ / mois',
        hint: 'Cible possible pour une individuelle',
      },
    ],
    edges: [
      { from: 'besoin', to: 'coll', label: 'Sources existantes' },
      { from: 'coll', to: 'net', label: 'Passage au net' },
      { from: 'net', to: 'trou', label: '4 800 − 3 750' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — trou mensuel à combler',
    caption:
      'Besoin net du ménage vs prestation collective nette : l’écart guide une couverture individuelle complémentaire.',
    events: [
      {
        at: 'Mensuel',
        title: 'Besoin du ménage',
        amount: '4 800 $ nets',
        note: 'Dépenses fixes + essentielles',
      },
      {
        at: 'Collective',
        title: 'Prestation brute',
        amount: '5 000 $',
        note: 'Souvent imposable si l’employeur paie',
      },
      {
        at: 'Après impôt',
        title: 'Collective nette',
        amount: '≈ 3 750 $',
        note: 'Hypothèse pédagogique',
      },
      {
        at: 'Écart',
        title: 'Trou mensuel',
        amount: '≈ 1 050 $',
        note: 'Cible fréquente d’une individuelle',
        emphasis: true,
      },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'montant', name: '$ / mois' }],
      points: [
        { at: 'Besoin net', montant: 4800 },
        { at: 'Collective nette', montant: 3750 },
        { at: 'Trou', montant: 1050 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — L’assurance invalidité (assurance salaire)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/lassurance-invalidite-assurance-salaire',
    },
    {
      name: 'AMF — Assurance invalidité (collective)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurances-collectives/assurance-invalidite',
    },
    {
      name: 'Institut de planification financière — Situation en matière de protection',
      url: 'https://institutpf.org/la-planification-financiere-cest-quoi/les-6-situations-analysees-par-les-planificateurs-financiers/votre-situation-en-matiere-de-protection',
    },
    {
      name: 'ARC — Crédit d’impôt pour personnes handicapées (CIPH)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/segments/deductions-credits-impot-personnes-handicapees/credit-impot-personnes-handicapees.html',
    },
    {
      name: 'Revenu Québec — Montant pour déficience grave et prolongée (ligne 376)',
      url: 'https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/350-a-398-1-credits-dimpot-non-remboursables/ligne-376/',
    },
  ],
  relatedServiceIds: ['invalidite'],
  relatedFormationIds: ['assurance-maladie-grave', 'assurance-vie-temporaire'],
  seoTitle: 'Assurance invalidité | Mini-formation',
  seoDescription:
    'Remplacement de revenu, définition propre emploi vs toute occupation, carence, collective vs individuelle, fiscalité des prestations et CIPH — repères concrets pour un particulier.',
};
