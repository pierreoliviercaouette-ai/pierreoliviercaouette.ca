/**
 * Mini-formation — Assurance maladie grave.
 * Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'assurance-maladie-grave',
  audiences: ['particulier', 'prive'],
  category: 'assurance',
  title: 'Assurance maladie grave',
  subtitle: 'Un capital si le diagnostic correspond au contrat',
  shortDescription:
    'Maladies redoutées : liste couverte, délai de survie, exclusions, capital forfaitaire et différence avec l’invalidité et la vie.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Déclencheur', value: 'Diagnostic conforme au contrat' },
    { label: 'Prestation', value: 'Capital forfaitaire (souvent unique)' },
    { label: 'Survie', value: 'Période à respecter après le diagnostic' },
  ],
  sections: [
    {
      heading: 'Quelles maladies sont vraiment couvertes?',
      paragraphs: [
        'L’assurance maladies graves (aussi appelée maladies redoutées ou critiques) verse une somme si le diagnostic respecte exactement la définition écrite dans votre police. Ce n’est pas une couverture « toutes maladies graves ».',
        'Seules les affections listées — et qui répondent aux critères médicaux du libellé — ouvrent droit à une indemnité. Le sens courant de « cancer », « crise cardiaque » ou « AVC » ne suffit pas : stade, gravité et type de preuve comptent.',
        'Les assureurs proposent souvent une couverture « cœur » (quelques maladies majeures) ou une liste plus longue. Certaines affections ne versent qu’une fraction du capital. Lisez la grille et les pourcentages, pas seulement le montant en page couverture.',
      ],
    },
    {
      heading: 'Respecter le délai de survie',
      paragraphs: [
        'L’assurance paie de votre vivant. L’assuré doit généralement survivre une période après le diagnostic (délai de survie, souvent d’environ 30 jours) pour que l’indemnité soit versée. Si le décès survient avant, la prestation n’est en principe pas due — même si le diagnostic était couvert.',
        'D’autres délais existent. Une période moratoire (surtout pour le cancer) peut s’appliquer après la prise d’effet : un diagnostic pendant cette fenêtre peut rendre la réclamation inadmissible. Pour certaines conditions, des symptômes doivent aussi persister un temps minimal.',
        'Les exclusions de maladies préexistantes restreignent ou excluent les affections déjà présentes, diagnostiquées ou traitées avant la souscription. La déclaration de santé compte : une omission peut compromettre une réclamation future.',
      ],
    },
    {
      heading: 'Recevoir un capital, pas un salaire',
      paragraphs: [
        'Lorsque les conditions sont remplies, la prestation typique est un montant forfaitaire unique — un capital — et non un salaire mensuel. Le montant n’est pas calqué sur vos factures : une fois versé, vous l’utilisez comme bon vous semble.',
        'Des usages fréquents : soins non remboursés, heures réduites d’un conjoint, adaptation du domicile, aide à domicile, frais liés aux enfants, remboursement anticipé de dettes, ou simple coussin de liquidités.',
        'Plusieurs contrats se terminent après le versement ; d’autres offrent des options (deuxième événement, remboursement de primes). Vérifiez le libellé avant de comparer les primes seules.',
      ],
    },
    {
      heading: 'Comparer maladie grave, invalidité et vie',
      paragraphs: [
        'Ces trois outils répondent à des déclencheurs différents. La maladie grave se déclenche sur un diagnostic listé et verse un capital. L’invalidité se déclenche sur l’incapacité de travailler selon le contrat et verse souvent un revenu périodique. L’assurance vie se déclenche au décès et verse un capital aux bénéficiaires.',
        'Une dépression invalidante peut ouvrir l’invalidité sans figurer en maladies graves. Un cancer couvert peut verser le capital même si vous continuez à travailler. Un décès avant le délai de survie peut ouvrir l’assurance vie sans ouvrir la maladie grave.',
        'Certains contrats offrent un remboursement de primes (RP) : si vous atteignez une échéance sans avoir reçu de prestation, l’assureur peut rembourser tout ou partie des primes. Ce n’est pas un placement : c’est une option tarifée. En cas de réclamation, le RP est souvent éteint.',
      ],
    },
    {
      heading: 'Que vérifier avant de comparer les primes?',
      paragraphs: [
        'Avant de comparer les primes seules, inventoriez ce qui existe déjà : collective d’employeur, fonds d’urgence, invalidité, assurance vie, autres polices. Fixez ensuite le besoin résiduel de liquidités en cas de diagnostic.',
        'Cette mini-formation est éducative ; le choix dépend de votre situation, de l’admissibilité médicale et des libellés exacts. Les questions ci-dessous cadrent la lecture de la police.',
      ],
      bullets: [
        'Quelles maladies et quels stades sont couverts — et à quel pourcentage du capital?',
        'Quel délai de survie, période moratoire ou exclusion préexistante s’applique?',
        'Que se passe-t-il après un premier versement (fin du contrat, options, RP)?',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — capital de 75 000 $ et usages',
    intro:
      'Illustration simplifiée (chiffres arrondis, sans conseil personnalisé). Alex, 42 ans, détient une assurance maladies graves individuelle de 75 000 $. Un diagnostic de maladie couverte est posé ; Alex survit au délai prévu au contrat et la définition est respectée.',
    steps: [
      {
        label: 'Capital versé',
        detail:
          'L’assureur verse 75 000 $ en une fois (capital forfaitaire), sous réserve des conditions de la police.',
      },
      {
        label: 'Usage 1 — alléger le logement',
        detail:
          'Alex affecte 40 000 $ au remboursement anticipé d’une portion d’hypothèque, ce qui réduit les versements mensuels pendant la convalescence.',
      },
      {
        label: 'Usage 2 — soutien familial',
        detail:
          '15 000 $ permettent au conjoint de réduire temporairement ses heures et de couvrir garderie et transport liés aux traitements.',
      },
      {
        label: 'Usage 3 — liquidités et soins',
        detail:
          'Les 20 000 $ restants servent de coussin : soins non remboursés, adaptation du domicile et réserve pour imprévus.',
      },
    ],
    result:
      'Les 75 000 $ offrent une flexibilité immédiate ; ils ne remplacent pas un salaire mensuel d’invalidité. Si Alex ne peut plus travailler plusieurs mois, une assurance invalidité distincte viserait le remplacement de revenu — les deux outils restent complémentaires.',
  },
  takeaways: [
    'Seules les maladies (et définitions) du contrat ouvrent droit au capital.',
    'Délai de survie et exclusions décident de l’admissibilité.',
    'Capital forfaitaire ≠ invalidité (revenu) ≠ vie (décès).',
    'Comparer les primes sans lire la grille des maladies et les délais est trompeur.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'mg-q1',
        prompt:
          'Dans l’exemple, après un diagnostic admissible et le délai de survie, Alex reçoit…',
        choices: [
          'Un salaire mensuel indexé jusqu’à 65 ans',
          'Un capital forfaitaire de 75 000 $ utilisable librement',
          'Uniquement le remboursement des reçus médicaux publics',
        ],
        correctIndex: 1,
        explanation:
          'L’assurance maladies graves verse en général un montant forfaitaire unique lorsque les conditions du contrat sont remplies ; l’usage est libre.',
      },
      {
        id: 'mg-q2',
        prompt: 'Le délai de survie signifie surtout que…',
        choices: [
          'Vous devez attendre avant de consulter un médecin',
          'L’assuré doit généralement survivre une période après le diagnostic pour que l’indemnité soit versée',
          'La police ne prend effet que des décennies après la souscription',
        ],
        correctIndex: 1,
        explanation:
          'L’assurance paie de votre vivant : l’assuré doit généralement survivre une période suivant le diagnostic pour que l’assureur verse l’indemnité.',
      },
      {
        id: 'mg-q3',
        prompt:
          'Pourquoi maladie grave, invalidité et assurance vie sont-elles complémentaires plutôt qu’équivalentes?',
        choices: [
          'Parce qu’elles versent exactement le même type de prestation',
          'Parce que l’une se déclenche sur un diagnostic listé (capital), l’autre sur l’incapacité de travailler (revenu), et la vie sur le décès',
          'Parce qu’il est interdit de détenir plus d’un de ces produits',
        ],
        correctIndex: 1,
        explanation:
          'Déclencheurs et formes de prestation diffèrent : diagnostic listé → capital ; incapacité de travailler → revenu ; décès → capital aux bénéficiaires.',
      },
    ],
  },
  diagram: {
    title: 'Parcours — assurance maladie grave',
    type: 'flow',
    nodes: [
      {
        id: 'diag',
        label: 'Diagnostic couvert',
        hint: 'Conforme à la définition du contrat',
      },
      {
        id: 'survie',
        label: 'Délai de survie',
        hint: 'Assuré en vie à la fin de la période',
      },
      {
        id: 'cap',
        label: 'Capital forfaitaire',
        hint: 'Montant versé en une fois',
        emphasis: true,
      },
      {
        id: 'use',
        label: 'Libre usage',
        hint: 'Soins, dettes, temps, proches',
      },
    ],
    edges: [
      { from: 'diag', to: 'survie', label: 'Conditions médicales' },
      { from: 'survie', to: 'cap', label: 'Réclamation admissible' },
      { from: 'cap', to: 'use', label: 'Liquidités' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — 75 000 $ répartis',
    type: 'fork',
    source: {
      id: 'capital',
      label: 'Capital 75 000 $',
      hint: 'Après diagnostic + délai de survie',
    },
    branches: [
      {
        id: 'hypo',
        label: 'Hypothèque 40 000 $',
        hint: 'Alléger les versements',
        edgeLabel: '53 %',
      },
      {
        id: 'famille',
        label: 'Soutien familial 15 000 $',
        hint: 'Heures réduites, garde, transport',
        edgeLabel: '20 %',
      },
      {
        id: 'soins',
        label: 'Soins et réserve 20 000 $',
        hint: 'Non remboursé + imprévus',
        edgeLabel: '27 %',
      },
    ],
  },
  timeline: {
    title: 'Ligne du temps — du diagnostic à l’usage du capital',
    caption:
      'Après un diagnostic admissible et le délai de survie, un capital de 75 000 $ peut être réparti selon les priorités du ménage.',
    events: [
      {
        at: 'Jour 0',
        title: 'Diagnostic couvert',
        amount: '—',
        note: 'Maladie listée au contrat',
      },
      {
        at: 'Survie',
        title: 'Délai respecté',
        amount: '—',
        note: 'Condition fréquente avant paiement',
      },
      {
        at: 'Paiement',
        title: 'Capital reçu',
        amount: '75 000 $',
        note: 'Forfaitaire, libre d’affectation typique',
        emphasis: true,
      },
      {
        at: 'Usage',
        title: 'Répartition illustrée',
        amount: '40k / 15k / 20k',
        note: 'Hypothèque · famille · soins/réserve',
      },
    ],
    chart: {
      type: 'bar',
      series: [
        {
          key: 'montant',
          name: 'Usage ($)',
        },
      ],
      points: [
        {
          at: 'Hypothèque',
          montant: 40000,
        },
        {
          at: 'Famille',
          montant: 15000,
        },
        {
          at: 'Soins',
          montant: 20000,
        },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Assurance maladies redoutées (graves ou critiques)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-maladies-redoutees-graves',
    },
    {
      name: 'AMF — Comment choisir une assurance maladies redoutées?',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-maladies-redoutees-graves/comment-choisir-une-assurance-maladies-redoutees',
    },
    {
      name: 'AMF — Rapport de surveillance en assurance maladies graves (PDF)',
      url: 'https://lautorite.qc.ca/fileadmin/lautorite/grand_public/rapport-surveillance-maladies-graves.pdf',
    },
    {
      name: 'IQPF — Guide des compétences des planificateurs financiers (assurances et gestion des risques)',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
    {
      name: 'iA Groupe financier — Assurance maladie grave',
      url: 'https://ia.ca/particuliers/assurance/assurance-sante-invalidite/assurance-maladie-grave',
    },
    {
      name: 'iA Groupe financier — Critères d’admissibilité (réclamation maladie grave)',
      url: 'https://ia.ca/faire-une-reclamation/maladie-grave-criteres-admissibilite',
    },
  ],
  relatedServiceIds: ['maladie-grave'],
  relatedFormationIds: ['assurance-invalidite', 'mg-propriete-partagee'],
  seoTitle: 'Assurance maladie grave | Mini-formation',
  seoDescription:
    'Maladies redoutées : liste couverte, délai de survie, exclusions, capital forfaitaire, remboursement de primes et différence avec invalidité et vie.',
};
