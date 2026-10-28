/**
 * Mini-formation — Assurance vie temporaire.
 * Sources : AMF, IQPF, ia.ca. Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'assurance-vie-temporaire',
  audiences: ['particulier', 'prive'],
  category: 'assurance',
  title: 'Assurance vie temporaire',
  subtitle: 'Protection pour une période définie : durée, capital et primes',
  shortDescription:
    'Durée et renouvellement, capital (hypothèque et revenu), primes, conversion, et différences avec la permanente ou la collective.',
  readMinutes: 12,
  keyFacts: [
    { label: 'Durée typique', value: '10, 20 ou 30 ans' },
    { label: 'Volet épargne', value: 'Aucun — protection pure' },
    { label: 'Usage courant', value: 'Hypothèque, enfants, revenu' },
  ],
  sections: [
    {
      heading: 'Qu’est-ce que l’assurance vie temporaire?',
      paragraphs: [
        'L’assurance vie temporaire vous couvre pendant une période fixée au contrat — souvent 10, 20 ou 30 ans. Si le décès survient pendant cette période et que le contrat est en vigueur, l’assureur verse le capital assuré aux bénéficiaires.',
        'Il n’y a généralement pas de volet « épargne » ni de valeur de rachat (montant récupérable en résiliant avant le décès). Vous payez le coût de la protection. La prime est souvent plus basse, au départ, qu’une permanente pour un capital comparable.',
        'La prestation au décès est en règle générale libre d’impôt pour le bénéficiaire. Le contrat fixe la durée, le capital et les conditions de maintien — surtout le paiement des primes.',
      ],
    },
    {
      heading: 'Comment choisir durée, primes et conversion?',
      paragraphs: [
        'Alignez la durée sur l’horizon du besoin : amortissement restant d’un prêt, années de dépendance des enfants, ou période où un revenu doit être remplacé. Une durée trop courte laisse un trou de protection ou force un renouvellement à un âge plus avancé.',
        'À l’échéance, la protection prend fin sauf renouvellement ou transformation prévus au contrat. Le renouvellement se fait souvent sans nouvelle preuve médicale, mais la prime reflète alors votre âge plus élevé.',
        'Deux logiques de prime reviennent souvent : nivelée (montant stable pendant le terme) et croissante (basse au départ, puis nettement plus élevée). La conversion (transformabilité) permet, selon le contrat, de passer à une permanente sans nouvelle preuve de santé, dans un délai précis.',
      ],
    },
    {
      heading: 'Comment estimer le capital?',
      paragraphs: [
        'Caler le capital uniquement sur le solde hypothécaire est un piège fréquent. Même si le prêt est remboursé, le ménage peut encore avoir besoin de remplacer le revenu pendant des années.',
        'Une méthode pédagogique additionne les obligations qui survivraient au décès (dettes + remplacement de revenu), puis soustrait les ressources déjà disponibles (épargne, collective, autres assurances). On arrondit ensuite au palier offert par l’assureur.',
        'Durée et capital se choisissent ensemble : un capital « juste » sur un terme trop court, ou un long terme sur un capital trop bas, laisse le même type de trou.',
      ],
    },
    {
      heading: 'Temporaire ou permanente?',
      paragraphs: [
        'Ce ne sont pas deux versions du même produit. La temporaire convient à un besoin borné dans le temps — prêt, années de dépendance, remplacement de revenu. La permanente vise un besoin à long terme ou patrimonial : liquidité successorale, transmission, planification à vie.',
        'Demandez-vous : le risque a-t-il une date de fin prévisible? Une fois passé, voulez-vous encore une couverture? Comparez le coût sur toute la période où vous comptez conserver la protection, pas seulement la prime des premières années.',
      ],
    },
    {
      heading: 'Collective, individuelle et clauses à vérifier',
      paragraphs: [
        'L’assurance collective offre souvent un capital de base à faible coût. Elle est généralement standardisée, plafonnée et liée à l’emploi : en quittant l’employeur, la couverture peut cesser ou exiger une conversion rapide.',
        'Une police individuelle est portable d’un emploi à l’autre et permet de cibler capital, durée et options. Avant de signer, lisez exclusions et délais courants : suicide dans les premières années, fausse déclaration, délais de contestabilité, et conditions de maintien. Les libellés varient ; le contrat fait foi.',
      ],
      bullets: [
        'La durée couvre-t-elle l’horizon réel (prêt, enfants, revenu), pas seulement la prime initiale?',
        'Le capital combine-t-il dettes et remplacement de revenu, après collective et épargne?',
        'Renouvellement, conversion et exclusions sont-ils clairs au contrat?',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple chiffré — hypothèque + remplacement de revenu',
    intro:
      'Alex, 38 ans, est propriétaire. Solde hypothécaire : 325 000 $. Revenu annuel brut : 95 000 $. Deux enfants; le ménage estime qu’il faudrait remplacer ce revenu pendant 12 ans. Amortissement restant : ~23 ans. Chiffres illustratifs.',
    steps: [
      {
        label: 'Bloc hypothèque',
        detail: 'Capital destiné à libérer (ou réduire fortement) le prêt : 325 000 $.',
      },
      {
        label: 'Bloc remplacement de revenu',
        detail: '95 000 $ × 12 années = 1 140 000 $. Approximation du soutien sur l’horizon de dépendance.',
      },
      {
        label: 'Besoin brut combiné',
        detail: '325 000 $ + 1 140 000 $ = 1 465 000 $.',
      },
      {
        label: 'Capital et durée retenus',
        detail:
          'Arrondi au palier 1 500 000 $. Durée : temporaire 25 ans, pour couvrir l’hypothèque (~23 ans) et la dépendance des enfants. Épargne ou collective déjà en place réduirait ce besoin — ici négligeables pour simplifier.',
      },
    ],
    result:
      'Illustration : temporaire 25 ans, capital 1 500 000 $. Ce n’est pas un conseil personnalisé; primes, admissibilité et clauses dépendent de l’assureur et du dossier médical.',
  },
  takeaways: [
    'La temporaire protège une période définie; elle n’accumule généralement pas de valeur de rachat.',
    'Alignez durée et capital sur dettes + remplacement de revenu, pas seulement l’hypothèque.',
    'Renouvellement, prime nivelée ou croissante, et conversion changent le coût à l’échéance.',
    'Vérifiez plafonds, portabilité, exclusions et délais au contrat (collective vs individuelle).',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'avt-q1',
        prompt:
          'Quelle est la principale différence entre une assurance vie temporaire et une permanente?',
        choices: [
          'La temporaire n’offre généralement pas de valeur de rachat et couvre une période définie',
          'La temporaire dure obligatoirement toute la vie',
          'La temporaire accumule toujours une valeur de rachat',
        ],
        correctIndex: 0,
        explanation:
          'La temporaire est une protection pure pour une durée fixe. La permanente vise un horizon à vie et peut, selon le contrat, accumuler une valeur de rachat.',
      },
      {
        id: 'avt-q2',
        prompt: 'Pourquoi aligner la durée sur le besoin plutôt que sur la prime la plus basse?',
        choices: [
          'Parce qu’une durée trop courte peut laisser un trou de protection ou forcer un renouvellement coûteux',
          'Parce que toute temporaire dure obligatoirement 25 ans',
          'Parce que les termes de 10 ans sont interdits',
        ],
        correctIndex: 0,
        explanation:
          'Une durée trop courte laisse un trou ou impose un renouvellement à un âge plus élevé, souvent avec une prime nettement plus élevée.',
      },
      {
        id: 'avt-q3',
        prompt: 'Dans l’exemple, le capital illustré de 1 500 000 $ combine principalement :',
        choices: [
          'Le solde hypothécaire et le remplacement de revenu, arrondi',
          'Uniquement les frais funéraires',
          'La valeur de rachat garantie du contrat temporaire',
        ],
        correctIndex: 0,
        explanation:
          '325 000 $ + 1 140 000 $ = 1 465 000 $, arrondi à 1 500 000 $. Une temporaire n’offre généralement pas de valeur de rachat.',
      },
    ],
  },
  diagram: {
    title: 'Logique — assurance vie temporaire',
    type: 'flow',
    nodes: [
      {
        id: 'need',
        label: 'Besoin limité dans le temps',
        hint: 'Hypothèque, enfants, revenu',
      },
      {
        id: 'size',
        label: 'Capital et durée',
        hint: 'Dettes + années de revenu',
      },
      {
        id: 'pol',
        label: 'Temporaire',
        hint: 'Protection pendant X années',
        emphasis: true,
      },
      {
        id: 'end',
        label: 'Échéance',
        hint: 'Fin, renouvellement ou conversion',
      },
    ],
    edges: [
      { from: 'need', to: 'size', label: 'Analyse' },
      { from: 'size', to: 'pol', label: 'Prime ↔ capital' },
      { from: 'pol', to: 'end', label: 'À l’échéance' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — capital 1 500 000 $, terme 25 ans',
    type: 'flow',
    nodes: [
      {
        id: 'hyp',
        label: 'Hypothèque 325 000 $',
        hint: '~23 ans d’amortissement',
      },
      {
        id: 'rev',
        label: 'Revenu 95 000 $ × 12 ans',
        hint: '1 140 000 $ de remplacement',
      },
      {
        id: 'tot',
        label: 'Capital 1 500 000 $',
        hint: '1 465 000 $ arrondi',
        emphasis: true,
      },
      {
        id: 'term',
        label: 'Temporaire 25 ans',
        hint: 'Hypothèque + dépendance',
      },
    ],
    edges: [
      { from: 'hyp', to: 'tot', label: '+ 325 000 $' },
      { from: 'rev', to: 'tot', label: '+ 1 140 000 $' },
      { from: 'tot', to: 'term', label: 'Police illustrée' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — besoin et durée',
    caption:
      'Le capital additionne l’hypothèque et le remplacement de revenu; la durée suit l’horizon réel.',
    events: [
      {
        at: 'Aujourd’hui',
        title: 'Hypothèque',
        amount: '325 000 $',
        note: 'Solde à couvrir',
      },
      {
        at: 'Horizon 12 ans',
        title: 'Remplacement de revenu',
        amount: '1 140 000 $',
        note: '95 000 $ × 12',
      },
      {
        at: 'Besoin',
        title: 'Capital illustré',
        amount: '1 500 000 $',
        note: '1 465 000 $ arrondi',
        emphasis: true,
      },
      {
        at: '25 ans',
        title: 'Échéance du terme',
        amount: 'Sans VR',
        note: 'Prêt (~23 ans) + enfants',
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
          at: 'Hypothèque',
          montant: 325000,
        },
        {
          at: 'Revenu ×12',
          montant: 1140000,
        },
        {
          at: 'Capital',
          montant: 1500000,
        },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — L’assurance vie temporaire',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie/lassurance-vie-temporaire',
    },
    {
      name: 'AMF — Principaux types d’assurance vie',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie/principaux-types-dassurance-vie',
    },
    {
      name: 'AMF — Assurance vie (choix de la durée)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin. (assurances et gestion des risques)',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
    {
      name: 'iA Groupe financier — Assurance vie temporaire',
      url: 'https://ia.ca/assurance-vie-temporaire',
    },
    {
      name: 'iA Groupe financier — Zone conseils : assurance vie temporaire',
      url: 'https://ia.ca/zone-conseils/finances/assurance-vie-temporaire',
    },
  ],
  relatedServiceIds: ['assurance-vie', 'patrimoine'],
  relatedFormationIds: ['assurance-vie-permanente', 'assurance-invalidite'],
  seoTitle: 'Assurance vie temporaire | Mini-formation | Apprendre',
  seoDescription:
    'Mini-formation : durée et renouvellement, capital (hypothèque et revenu), primes, conversion, temporaire vs permanente, collective vs individuelle.',
};
