export const module = {
  id: 'mg-propriete-partagee',
  audiences: ['prive'],
  category: 'corpo',
  title: 'Maladie grave en propriété partagée',
  subtitle: 'Qui paie, qui possède, qui reçoit — et pourquoi la convention compte',
  shortDescription:
    'Sur un même contrat de maladies graves, la société et l’actionnaire peuvent détenir des intérêts distincts : protection de base d’un côté, avenant de remboursement des primes de l’autre. Voici le mécanisme, la fiscalité de principe et les pièges.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Société', value: 'Paie la JVM de la protection MG' },
    { label: 'Individu', value: 'Paie la JVM de l’avenant RP' },
    { label: 'Sortie', value: 'Prestation MG ou RP — rarement les deux' },
  ],
  sections: [
    {
      heading: 'Partager un contrat, pas un produit clé en main',
      paragraphs: [
        'L’assurance maladies graves (MG) — aussi appelée maladies redoutées — verse un capital forfaitaire si l’assuré reçoit un diagnostic qui respecte exactement la définition du contrat, souvent après une période de survie. Elle ne remplace ni l’invalidité ni l’assurance vie.',
        'La propriété partagée (shared ownership) est une entente privée. Typiquement, la société détient la protection de base, et l’actionnaire (ou employé clé) détient l’avenant de remboursement des primes (RP). L’assureur émet la police et paie selon ses modalités ; il n’administre pas votre convention de partage.',
        'Si la police et l’entente privée ne disent pas la même chose, le montage se fissure au sinistre ou à l’échéance. Calibrez d’abord le besoin de liquidités corporatives (durée, montant), puis alignez police et partage.',
      ],
    },
    {
      heading: 'Qui paie la juste valeur marchande?',
      paragraphs: [
        'Chaque partie doit, en principe, payer la juste valeur marchande (JVM) de l’intérêt qu’elle détient. Ce n’est pas forcément le montant que l’illustration de l’assureur attribue à une « ligne RP ».',
        'La société paie la JVM de la protection MG de base : le prix économique de l’intérêt qui lui donne droit à la prestation. L’actionnaire ou l’employé clé paie la JVM de l’avenant RP : le prix de l’intérêt qui peut lui verser un remboursement de primes à l’échéance, au rachat ou selon le contrat, s’il n’y a pas eu de réclamation MG.',
        'Si la société paie plus que la JVM de sa part — ou finance en pratique l’intérêt de l’individu — un risque d’avantage actionnaire ou employé apparaît. La JVM du RP peut différer de la prime facturée ; une évaluation indépendante est souvent utile. Tracez les paiements année après année.',
      ],
    },
    {
      heading: 'Qui reçoit selon le scénario?',
      paragraphs: [
        'Deux chemins, rarement cumulables. Si un diagnostic couvert survient et que les conditions sont remplies (définition, période de survie), l’assureur verse en principe la prestation MG à la partie qui détient l’intérêt sur la protection de base — dans le montage typique, la société. L’avenant RP est alors généralement éteint pour l’individu.',
        'Si aucun diagnostic couvert n’intervient jusqu’à l’événement prévu pour le RP (échéance du terme, rachat ou autre déclencheur), la partie qui détient l’intérêt RP — souvent l’actionnaire — peut recevoir le remboursement des primes admissibles selon le libellé. Ce n’est pas un placement garanti : c’est un avenant d’assurance, avec conditions et exclusions.',
        'Dans les deux cas, la discipline « qui paie quoi » doit avoir été tenue. Un paiement corporatif qui a financé l’intérêt individuel affaiblit le montage au moment où on en a besoin.',
      ],
    },
    {
      heading: 'Convention écrite et fiscalité de principe',
      paragraphs: [
        'La convention écrite fixe ce que la police seule ne dit pas : qui possède quels intérêts, qui reçoit chaque somme, qui décide d’un rachat ou d’une résiliation, et que se passe-t-il en cas de départ, de vente d’actions ou de dissolution. Sans ce document, la structure repose sur des intentions — fragiles face à un conflit, un créancier ou une vérification.',
        'Les primes de maladies graves sont en général non déductibles pour la société. La prestation MG versée à la société est généralement non imposable. Contrairement à l’assurance vie, elle n’alimente pas le compte de dividendes en capital (CDC) : une sortie ultérieure vers l’actionnaire (dividende, salaire, boni) suit les règles habituelles et peut créer un impôt personnel.',
        'Le traitement du RP reçu par l’individu reste une question de fait (nature commerciale, caractère d’assurance, lien d’emploi vs actionnariat). Au Québec, ces contrats sont généralement classés comme assurance accident et maladie — cela oriente sans figer. Faites valider le montage avec un fiscaliste et un juriste ; ce module est informatif, pas un conseil personnalisé.',
      ],
    },
    {
      heading: 'Quels pièges éviter?',
      paragraphs: [
        'Le montage échoue souvent pour des raisons administratives ou fiscales, pas parce que le produit est « mauvais ». Les écarts reviennent surtout autour de la JVM, du CDC et de la convention.',
        'Calibrez le coût global (base + avenant RP) avant de signer, et gardez la trace des paiements. Les quatre points ci-dessous résument les erreurs les plus coûteuses.',
      ],
      bullets: [
        'S’appuyer sur le barème « RP » de l’illustration au lieu d’une JVM documentée.',
        'Compter sur un crédit CDC comme en assurance vie — la prestation MG n’en crée pas.',
        'Laisser la convention absente ou contradictoire avec la police.',
        'Oublier les créanciers de la société au moment du sinistre.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — qui paie, qui reçoit',
    intro:
      'Illustration pédagogique (montants fictifs, hors tarification réelle). Société OpéraTech inc. et son actionnaire-président Alex, 48 ans, non-fumeur. Police maladies graves 500 000 $ sur la tête d’Alex, terme jusqu’à 65 ans, avec avenant de remboursement des primes à l’échéance. Une évaluation de juste valeur marchande retient la répartition suivante des primes annuelles.',
    steps: [
      {
        label: 'Part société (protection MG)',
        detail:
          'OpéraTech paie 4 800 $ / an (JVM de l’intérêt MG). Elle est destinataire de la prestation 500 000 $ en cas de diagnostic couvert.',
      },
      {
        label: 'Part actionnaire (avenant RP)',
        detail:
          'Alex paie 2 400 $ / an (JVM retenue pour l’intérêt RP — ici supérieure à une simple « ligne RP » d’illustration assureur). Il est destinataire du RP s’il n’y a pas de réclamation MG.',
      },
      {
        label: 'Scénario diagnostic à 55 ans',
        detail:
          'Après 7 ans : primes cumulées société 33 600 $, Alex 16 800 $. Diagnostic couvert et période de survie respectée → OpéraTech reçoit 500 000 $ (généralement non imposables ; pas de crédit CDC). Si la société reverse ensuite des fonds à Alex, traitement salarial ou dividendes selon le mode choisi.',
      },
      {
        label: 'Scénario aucun diagnostic jusqu’à 65 ans',
        detail:
          'Sur 17 ans : société 81 600 $, Alex 40 800 $ ; total primes 122 400 $. À l’échéance RP, Alex reçoit 122 400 $ selon le contrat (remboursement des primes admissibles, sans intérêts). Le traitement fiscal du RP demeure une question de fait à faire valider.',
      },
    ],
    result:
      'Même police, deux chemins : maladie couverte → la société encaisse la prestation pour la continuité ; santé jusqu’à l’échéance → Alex récupère le RP. La cohérence JVM + convention écrite soutient le montage — pas le seul barème de l’assureur.',
  },
  takeaways: [
    'Société : JVM de la MG ; individu : JVM du RP.',
    'Diagnostic → prestation à la société ; aucun sinistre à l’échéance → RP à l’individu.',
    'Pas de CDC sur la prestation MG.',
    'Convention écrite et JVM documentée sont les garde-fous.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'mg-part-q1',
        prompt:
          'Dans l’exemple OpéraTech, si Alex reçoit un diagnostic couvert à 55 ans, qui reçoit en premier la prestation de 500 000 $?',
        choices: [
          'Alex, automatiquement, car il est l’assuré',
          'OpéraTech inc., destinataire de l’intérêt MG selon la structure',
          'L’assureur conserve la somme jusqu’à la retraite d’Alex',
        ],
        correctIndex: 1,
        explanation:
          'Dans le montage typique illustré, la société détient l’intérêt sur la protection de base et reçoit la prestation MG. Une sortie vers l’actionnaire est un geste distinct (salaire, dividende, etc.).',
      },
      {
        id: 'mg-part-q2',
        prompt:
          'Pourquoi une répartition fondée sur la juste valeur marchande (et non seulement sur la prime « RP » de l’illustration) est-elle centrale?',
        choices: [
          'Parce que l’assureur l’exige pour toute police individuelle',
          'Pour réduire le risque qu’un paiement corporatif excessif soit vu comme un avantage à l’actionnaire ou à l’employé',
          'Parce que le CDC crédite automatiquement toute prime MG',
        ],
        correctIndex: 1,
        explanation:
          'La prime facturée pour le RP peut ne pas égaler la JVM. Un écart au profit de l’individu peut soulever un avantage imposable.',
      },
      {
        id: 'mg-part-q3',
        prompt:
          'La prestation maladies graves versée à la société alimente-t-elle le compte de dividendes en capital (CDC)?',
        choices: [
          'Oui, comme une prestation d’assurance vie',
          'Non : elle est généralement non imposable, mais n’alimente pas le CDC',
          'Seulement si l’avenant RP est aussi détenu par la société',
        ],
        correctIndex: 1,
        explanation:
          'Contrairement à l’assurance vie, la prestation MG corporative n’alimente en principe pas le CDC. Une sortie vers l’actionnaire suit les règles habituelles (dividende, salaire, etc.).',
      },
    ],
  },
  diagram: {
    title: 'Propriété partagée — vue simplifiée',
    type: 'fork',
    source: {
      id: 'contract',
      label: 'Contrat MG + avenant RP',
      hint: 'Un contrat ; intérêts distincts',
    },
    branches: [
      {
        id: 'corp',
        label: 'Société',
        hint: 'Paie sa part · reçoit si diagnostic',
        edgeLabel: 'Intérêt MG',
      },
      {
        id: 'share',
        label: 'Actionnaire / employé clé',
        hint: 'Paie sa part · peut recevoir le RP',
        edgeLabel: 'Intérêt RP',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple OpéraTech — qui paie / qui reçoit',
    type: 'fork',
    source: {
      id: 'police',
      label: 'Police 500 000 $ · terme à 65 ans',
      hint: 'Alex assuré · convention JVM',
    },
    branches: [
      {
        id: 'soc-ex',
        label: 'OpéraTech · 4 800 $/an',
        hint: 'Si MG : 500 000 $ à la société',
        edgeLabel: 'Paie / reçoit MG',
      },
      {
        id: 'alex-ex',
        label: 'Alex · 2 400 $/an',
        hint: 'Si aucun MG : RP 122 400 $',
        edgeLabel: 'Paie / reçoit RP',
      },
    ],
  },
  timeline: {
    title: 'Ligne du temps — qui paie, qui reçoit',
    caption:
      'Police 500 000 $ jusqu’à 65 ans : un seul scénario se réalise (prestation MG ou RP), pas les deux.',
    events: [
      {
        at: 'Chaque année',
        title: 'OpéraTech (MG)',
        amount: '4 800 $',
        note: 'JVM de la protection maladies graves',
      },
      {
        at: 'Chaque année',
        title: 'Alex (RP)',
        amount: '2 400 $',
        note: 'JVM de l’avenant remboursement',
      },
      {
        at: 'Si MG',
        title: 'Prestation à la société',
        amount: '500 000 $',
        note: 'Alex n’empoche pas le RP',
        emphasis: true,
      },
      {
        at: 'Si aucun MG',
        title: 'RP à Alex (65 ans)',
        amount: '122 400 $',
        note: 'Illustration — pas une promesse',
        emphasis: true,
      },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'montant', name: 'Montant ($)' }],
      points: [
        { at: 'Prime soc./an', montant: 4800 },
        { at: 'Prime Alex/an', montant: 2400 },
        { at: 'Prestation MG', montant: 500000 },
        { at: 'RP illustré', montant: 122400 },
      ],
    },
  },
  sources: [
    {
      name: 'Autorité des marchés financiers — Assurance maladies redoutées (graves ou critiques)',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-maladies-redoutees-graves',
    },
    {
      name: 'AMF — Comment choisir une assurance maladies redoutées',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-maladies-redoutees-graves/comment-choisir-une-assurance-maladies-redoutees',
    },
    {
      name: 'iA Groupe financier — Offre globale (shared ownership critical illness)',
      url: 'https://ia.ca/global-offer',
    },
    {
      name: 'ARC — Interprétation technique 2006-0178561E5 (avantage imposable — assurance maladie grave)',
      url: 'https://taxinterpretations.com/cra/severed-letters/2006-0178561e5',
    },
  ],
  relatedServiceIds: ['entreprise', 'maladie-grave'],
  relatedFormationIds: ['assurance-maladie-grave', 'protections-corpo'],
  seoTitle: 'Maladie grave en propriété partagée | Apprendre',
  seoDescription:
    'Propriété partagée MG : JVM société vs avenant RP, qui reçoit au diagnostic ou à l’échéance, convention, CDC et pièges.',
};
