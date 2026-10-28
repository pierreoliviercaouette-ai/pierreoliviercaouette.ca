export const module = {
  id: 'protections-corpo',
  audiences: ['prive'],
  category: 'corpo',
  title: 'Protections corporatives',
  subtitle: 'Personne clé, convention entre actionnaires, frais généraux et maladie grave',
  shortDescription:
    'Comment une société se protège contre le décès, l’invalidité ou une maladie grave d’une personne essentielle — et comment financer un rachat de parts prévu à la convention entre actionnaires.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Personne clé', value: 'Indemnise la société (continuité)' },
    { label: 'Rachat (CEA)', value: 'Capital ≈ valeur des parts' },
    { label: 'MG en société', value: 'Liquidités du vivant, sans CDC' },
  ],
  sections: [
    {
      heading: 'Pourquoi protéger l’entreprise',
      paragraphs: [
        'Dans une PME, une grande part de la valeur repose souvent sur des personnes : savoir-faire, clients, signature bancaire. Un décès, une invalidité prolongée ou une maladie grave peut freiner les ventes et créer un besoin urgent de liquidités.',
        'Les protections corporatives ne remplacent ni la gouvernance ni une convention entre actionnaires (CEA) rédigée par un juriste. Elles fournissent le capital et le temps pour traverser l’événement.',
        'Quatre leviers reviennent souvent : assurance personne clé, financement d’un rachat prévu à la CEA, assurance frais généraux, et maladie grave détenue par la société.',
      ],
    },
    {
      heading: 'Comment fonctionne la personne clé',
      paragraphs: [
        'L’assurance personne clé couvre la vie — et parfois l’invalidité — d’un dirigeant ou d’un employé dont le départ mettrait l’entreprise en difficulté. L’objectif n’est pas de payer la succession : c’est d’indemniser la société pour la perte financière.',
        'Habituellement, la société est titulaire et bénéficiaire : elle possède le contrat, paie les primes et reçoit la prestation. Au Canada, cette prestation d’assurance vie est généralement non imposable ; les primes ne sont en règle générale pas déductibles.',
        'Une portion du capital-décès (au-delà du coût de base rajusté de la police) peut créditer le compte de dividendes en capital (CDC) — un compte fiscal qui peut ensuite permettre un dividende en capital libre d’impôt vers les actionnaires.',
      ],
    },
    {
      heading: 'Comment financer le rachat prévu à la CEA',
      paragraphs: [
        'Dès qu’il y a plus d’un actionnaire, la CEA encadre le sort des actions en cas de décès, d’invalidité, de retrait ou de mésentente. Au décès, les survivants n’ont en général pas intérêt à coexister avec la succession comme coactionnaire.',
        'Deux structures fréquentes : rachat par les survivants (cross-purchase) ou rachat par la société. L’assurance vie finance alors l’obligation sans vider la trésorerie. En rachat corporatif, la société souscrit souvent une police sur chaque actionnaire.',
        'Le capital assuré vise en pratique la part de juste valeur marchande (JVM) à racheter — selon la formule de la CEA. Personne clé et rachat répondent à deux questions distinctes : perte opérationnelle vs valeur des parts.',
      ],
    },
    {
      heading: 'Que couvrent frais généraux et maladie grave',
      paragraphs: [
        'L’assurance frais généraux (overhead) couvre un risque du vivant : l’invalidité d’une personne essentielle pendant laquelle l’entreprise continue de payer des dépenses fixes (loyer, salaires de soutien). Elle se distingue de l’assurance salaire, qui remplace le revenu de l’individu.',
        'Si la police limite le remboursement aux frais réellement engagés, les primes peuvent être déductibles et les prestations imposables côté entreprise. Une assurance maladies graves (MG) détenue par la société verse un forfait après diagnostic couvert et période d’attente — sans créditer typiquement le CDC.',
        'En résumé : vie corporative → prestation souvent hors revenu + possible crédit CDC ; MG → hors revenu mais sans CDC ; frais généraux (si structure admissible) → primes potentiellement déductibles et prestations imposables. Un CPA valide les détails.',
      ],
    },
    {
      heading: 'Quels pièges éviter avant de souscrire',
      paragraphs: [
        'Avant de choisir un produit, clarifiez trois rôles sur chaque police : le titulaire (qui possède le contrat), le payeur des primes, et le bénéficiaire (qui reçoit la prestation). Une mauvaise désignation crée des frictions au pire moment.',
        'Faites rédiger ou réviser la CEA par un avocat ou un notaire ; validez le montage fiscal avec un CPA. Réévaluez les montants lors d’un refinancement, d’une hausse de valeur ou d’un changement d’actionnariat.',
      ],
      bullets: [
        'Confondre « valeur des parts » et « perte opérationnelle » — deux besoins, deux montants.',
        'Oublier l’assurabilité : un actionnaire non assurable bloque souvent tout le montage.',
        'Laisser titulaire, payeur et bénéficiaire mal alignés sur la police.',
        'Calibrer le capital une fois pour toutes, sans revoir la JVM.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — rachat 50/50 financé par assurance',
    intro:
      'Alex et Sam détiennent chacun 50 % d’une société privée. La JVM convenue aux fins de la CEA est de 2 000 000 $. Au décès d’un actionnaire, la société rachète les actions de la succession. Chaque tête est assurée pour 1 000 000 $ ; la société est titulaire et bénéficiaire.',
    steps: [
      {
        label: 'Valeur à racheter',
        detail: 'Part de l’actionnaire décédé : 50 % × 2 000 000 $ = 1 000 000 $.',
      },
      {
        label: 'Capital-décès',
        detail:
          'La société reçoit 1 000 000 $ en franchise d’impôt. Sous réserve du coût de base rajusté, l’excédent peut être porté au CDC.',
      },
      {
        label: 'Rachat',
        detail:
          'Avec ces liquidités, la société rachète et annule les actions de la succession. Le survivant détient 100 %, sans financer personnellement le 1 000 000 $.',
      },
      {
        label: 'Sans assurance',
        detail:
          'Sans police, il faudrait puiser dans la trésorerie, vendre des actifs ou emprunter — au risque de fragiliser les opérations.',
      },
    ],
    result:
      '1 000 000 $ d’assurance vie corporative par tête aligne le capital sur la part à racheter. Les choix fiscaux précis se valident avec un fiscaliste.',
  },
  takeaways: [
    'Personne clé indemnise la continuité ; le rachat paie les actions.',
    'La CEA fixe le mécanisme avant de calibrer les polices.',
    'Frais généraux et MG couvrent des risques du vivant.',
    'Le CDC est un levier de l’assurance vie corporative — pas de la MG.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'prot-corpo-q1',
        prompt:
          'Dans l’exemple 50/50 (JVM 2 000 000 $), quel capital-décès minimal viser sur chaque actionnaire pour financer le rachat ?',
        choices: [
          '2 000 000 $ sur un seul actionnaire',
          '1 000 000 $ sur chaque actionnaire',
          '500 000 $ au total, partagé entre les deux',
        ],
        correctIndex: 1,
        explanation:
          'Chaque part vaut 1 000 000 $. Une police de 1 000 000 $ sur chaque tête finance le rachat quel que soit l’actionnaire qui décède en premier.',
      },
      {
        id: 'prot-corpo-q2',
        prompt:
          'Quelle affirmation distingue correctement l’assurance personne clé du financement d’une CEA ?',
        choices: [
          'Les deux versent toujours la prestation à la succession de l’assuré',
          'La personne clé indemnise surtout la perte opérationnelle ; le montage CEA finance le rachat des actions',
          'Seule la maladie grave peut créditer le compte de dividendes en capital',
        ],
        correctIndex: 1,
        explanation:
          'Ce sont deux besoins distincts. Le CDC est lié au produit d’assurance vie, pas à la maladie grave.',
      },
      {
        id: 'prot-corpo-q3',
        prompt:
          'Sur le plan fiscal typique, que se passe-t-il lorsqu’une société reçoit une prestation d’assurance maladies graves ?',
        choices: [
          'La prestation crédite automatiquement le CDC et sort libre d’impôt vers l’actionnaire',
          'La prestation ne crédite pas le CDC ; une sortie vers l’actionnaire doit être planifiée',
          'Les primes sont toujours déductibles et la prestation est toujours imposable dans la société',
        ],
        correctIndex: 1,
        explanation:
          'Contrairement à l’assurance vie, la MG corporative n’alimente pas le CDC. La sortie des fonds vers l’actionnaire a généralement des conséquences fiscales.',
      },
    ],
  },
  diagram: {
    title: 'Quatre leviers de protection corporative',
    type: 'fork',
    source: {
      id: 'besoin',
      label: 'Risque humain en société',
      hint: 'Décès, invalidité, maladie grave',
    },
    branches: [
      {
        id: 'cle',
        label: 'Personne clé',
        hint: 'Liquidités pour la continuité',
        edgeLabel: 'Indemnise la société',
      },
      {
        id: 'cea',
        label: 'Rachat (CEA)',
        hint: 'Payer les actions de la succession',
        edgeLabel: 'Finance le transfert',
      },
      {
        id: 'fg',
        label: 'Frais généraux',
        hint: 'Dépenses fixes en invalidité',
        edgeLabel: 'Maintien des opérations',
      },
      {
        id: 'mg',
        label: 'Maladie grave',
        hint: 'Capital du vivant (sans CDC)',
        edgeLabel: 'Diagnostic couvert',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple chiffré — rachat 50/50',
    type: 'flow',
    nodes: [
      {
        id: 'jvm',
        label: 'JVM 2 000 000 $',
        hint: 'Alex et Sam · 50 / 50',
      },
      {
        id: 'police',
        label: 'Capital 1 000 000 $ / tête',
        hint: 'Société titulaire et bénéficiaire',
        emphasis: true,
      },
      {
        id: 'deces',
        label: 'Prestation 1 000 000 $',
        hint: 'Versée à la société',
      },
      {
        id: 'rachat',
        label: 'Rachat des parts',
        hint: 'Survivant à 100 %',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'jvm', to: 'police', label: 'CEA + polices' },
      { from: 'police', to: 'deces', label: 'Capital-décès' },
      { from: 'deces', to: 'rachat', label: 'Liquidités' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — rachat 50/50',
    caption:
      'JVM 2 000 000 $ : chaque tête vise 1 000 000 $ de capital-décès pour financer le rachat.',
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
  sources: [
    {
      name: 'AMF — Glossaire financier (assurance « personne-clé »)',
      url: 'https://lautorite.qc.ca/grand-public/glossaire-financier',
    },
    {
      name: 'AMF — Assurance vie',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin. (assurances et gestion des risques)',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
    {
      name: 'iA Groupe financier — Stratégies et concepts (financement du rachat d’actions)',
      url: 'https://ia.ca/solutions-cas-avances/strategies-et-concepts',
    },
    {
      name: 'iA Groupe financier — Convention entre actionnaires et assurance vie (PDF)',
      url: 'https://files.ia.ca/-/media/files/solutions-cas-avances/pdf/13-1206_conventionactionnaires-acc_20240510.pdf',
    },
    {
      name: 'Revenu Québec — Bulletin IMP. 128-2 / assurance frais généraux (PDF)',
      url: 'https://www.publicationsduquebec.gouv.qc.ca/fileadmin/produits_en_ligne/Fiscalite/pdf/I3F128T2RABULB.pdf',
    },
  ],
  relatedServiceIds: ['entreprise', 'assurances-employes'],
  relatedFormationIds: ['fiscalite-epargne-corpo', 'mg-propriete-partagee'],
  seoTitle: 'Protections corporatives | Mini-formation',
  seoDescription:
    'Personne clé, convention entre actionnaires, frais généraux et maladie grave en société : mécanismes, qui paie et qui reçoit, avec exemple de rachat 50/50.',
};
