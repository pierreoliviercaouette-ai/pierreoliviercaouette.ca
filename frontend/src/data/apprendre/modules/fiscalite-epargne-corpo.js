/**
 * Mini-formation fiscalité de l’épargne corporative (SPCC, Qc).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'fiscalite-epargne-corpo',
  audiences: ['prive'],
  category: 'corpo',
  title: 'Fiscalité de l’épargne corporative',
  subtitle: 'Surplus, rémunération et placements en société',
  shortDescription:
    'Où déployer un surplus de SPCC : salaire ou dividende, revenus de placement, IMRTD, et extraction vers CELI/REER.',
  readMinutes: 12,
  keyFacts: [
    { label: 'Intégration', value: 'Société + particulier ≈ un seul fardeau' },
    { label: 'Placement SPCC (Qc)', value: 'Taux élevé, puis IMRTD remboursable' },
    { label: 'Décision clé', value: 'Sortir, cotiser perso, ou laisser fructifier' },
  ],
  sections: [
    {
      heading: 'Où placer le surplus ?',
      paragraphs: [
        'Quand une société privée sous contrôle canadien (SPCC) — une PME contrôlée par des particuliers résidents — a trop de liquidités, la vraie question n’est pas « quel titre acheter ». C’est : garder l’argent en société, le verser à l’actionnaire (salaire ou dividende), ou le faire passer vers REER/CELI après l’avoir sorti.',
        'Chaque voie change le moment de l’impôt, le type de revenu et les droits de cotisation futurs. Un surplus qui génère des intérêts bascule dans un régime distinct du revenu d’entreprise active.',
      ],
    },
    {
      heading: 'Choisir salaire ou dividende',
      paragraphs: [
        'Le salaire est déductible pour la société. Vous créez un revenu d’emploi : retenues, cotisations RRQ et RQAP, et du « revenu gagné » qui alimente vos droits REER. L’impôt personnel tombe tout de suite, mais la société réduit son bénéfice imposable.',
        'Le dividende sort du bénéfice déjà imposé en société. Vous le déclarez avec majoration et crédit d’impôt. Il ne crée pas de droits REER et n’alimente pas la RRQ comme un salaire.',
        'Le système vise l’intégration : société puis dividende ≈ même fardeau qu’un revenu gagné directement. Au Québec, sur le revenu admissible à la déduction pour petite entreprise (DPE), l’écart pur est souvent étroit. Ce qui tranche : RRQ, droits REER, besoin net, et le fait de laisser les fonds réellement investis.',
      ],
    },
    {
      heading: 'Pourquoi les intérêts n’ont pas le taux PME',
      paragraphs: [
        'La DPE cible le revenu d’entreprise active — ventes, services. Intérêts, loyers de placement et portion imposable des gains en capital sont en général des revenus de placement.',
        'Pour une SPCC, ces revenus suivent un régime distinct : taux corporatif nettement plus élevé (environ 50 % combiné au Québec hors dividendes canadiens — à vérifier chaque année). L’idée : décourager le report d’impôt en « parquant » de l’épargne passive en société.',
        'Conséquence : laisser fructifier un surplus en société n’équivaut ni à un CELI ni à un compte personnel au même taux. Vous acceptez d’abord une charge lourde, avec une portion remboursable plus tard via l’IMRTD.',
      ],
    },
    {
      heading: 'Comprendre l’IMRTD simplement',
      paragraphs: [
        'L’impôt en main remboursable au titre de dividendes (IMRTD) est un compte théorique. Quand la SPCC paie l’impôt élevé sur certains revenus de placement, une portion s’y ajoute — comme une retenue en attendant une distribution.',
        'Au versement de dividendes imposables, la société peut obtenir un remboursement, plafonné au solde et aux règles. Le fardeau corporatif net se rapproche alors d’environ 19,5 % — puis vous payez encore l’impôt personnel sur le dividende. Sans distribution, la portion remboursable reste bloquée.',
        'Depuis le dédoublement (IMRTD déterminé / non déterminé), le type de dividende doit coller au bon solde. La portion non imposable d’un gain en capital peut alimenter le compte de dividendes en capital (CDC). Trop de placement passif peut aussi « meuler » le plafond fédéral de la DPE.',
      ],
    },
    {
      heading: 'Extraire pour CELI ou REER',
      paragraphs: [
        'CELI et REER sont personnels : la société ne peut pas y cotiser à votre place. Il faut d’abord sortir de l’argent (salaire ou dividende), puis cotiser. Remplir des droits sous-utilisés bat souvent le régime de placement corporatif.',
        'Le REER exige du revenu gagné (souvent via salaire ou prime) ou des droits déjà accumulés. Un dividende seul n’ouvre pas de nouveaux droits. Le CELI demande seulement des droits disponibles et des fonds déjà dans vos mains.',
        'Une fois l’exploitation couverte, un ordre utile : besoin net perso, puis droits CELI/REER (portion salaire si REER), puis nature du revenu corporatif et soldes IMRTD/CDC, puis reliquat en société. Réinvestir dans l’actif reste souvent prioritaire avant l’épargne passive corporative.',
      ],
      bullets: [
        'De combien ai-je besoin en net cette année ?',
        'Quels droits REER et CELI restent disponibles ?',
        'Faut-il du salaire pour ouvrir ou financer le REER ?',
        'Que reste-t-il à laisser fructifier en société ?',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — surplus de 80 000 $ dans une SPCC québécoise',
    intro:
      'Hypothèses illustratives (à valider) : SPCC admissible à la DPE au Québec ; 80 000 $ déjà disponibles après impôt sur le revenu actif ; 18 000 $ de droits CELI, 22 000 $ de droits REER ; besoin net ≈ 15 000 $. Aucun solde IMRTD ni CDC en début d’année. Ce n’est pas une recommandation.',
    steps: [
      {
        label: 'Couvrir le besoin personnel',
        detail:
          'Sortir assez de fonds pour ≈ 15 000 $ nets. Salaire = revenu gagné + RRQ ; dividende = bénéfice déjà imposé puis impôt perso. Le brut à sortir dépasse 15 000 $.',
      },
      {
        label: 'Utiliser les droits CELI',
        detail:
          'Après extraction, cotisez 18 000 $ au CELI. Croissance et retraits admissibles échappent à l’impôt perso — contrairement au même capital laissé en société.',
      },
      {
        label: 'Arbitrer le REER',
        detail:
          'Financer jusqu’à 22 000 $ de cotisation peut justifier une portion salaire. Comparez l’économie d’impôt REER au coût d’extraction et à l’avantage de garder le capital en société.',
      },
      {
        label: 'Laisser le solde en société',
        detail:
          'Après extraction, il reste ≈ 25 000 $ investis. Des intérêts de 1 000 $ seraient imposés à ≈ 50 % (~502 $), dont ~307 $ crédités à l’IMRTD non déterminé — récupérables au versement ultérieur de dividendes.',
      },
    ],
    result:
      'Séquencer besoin perso → régimes sous-utilisés → solde corporatif. Le reliquat en société reste exposé au régime des revenus de placement et à l’IMRTD — pas au taux PME.',
  },
  takeaways: [
    'Localisation et mode de sortie du surplus comptent autant que le placement.',
    'Placements SPCC : régime élevé, puis IMRTD remboursable à la distribution.',
    'Extraire pour CELI/REER sous-utilisés vient souvent avant l’épargne passive en société.',
    'Réinvestir dans l’actif prime souvent sur le placement passif corporatif.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'fec-q1',
        prompt:
          'Pourquoi les intérêts gagnés sur un placement dans une SPCC ne sont-ils pas imposés au taux PME de l’entreprise active?',
        choices: [
          'Parce que tout revenu de SPCC est toujours exonéré après la DPE',
          'Parce que les revenus de placement d’une SPCC suivent un régime distinct (taux élevé + IMRTD), pas le taux des petites entreprises',
          'Parce que Revenu Québec convertit automatiquement les intérêts en dividendes déterminés',
        ],
        correctIndex: 1,
        explanation:
          'La DPE vise le revenu d’entreprise exploitée activement. Intérêts et autres revenus de placement d’une SPCC sont généralement imposés au régime de placement (taux combiné élevé au Québec), avec portion remboursable via l’IMRTD.',
      },
      {
        id: 'fec-q2',
        prompt:
          'Vous voulez cotiser à un CELI avec de l’argent encore dans la société. Quel énoncé est le plus juste?',
        choices: [
          'L’extraction est toujours sans impôt si vous êtes l’unique actionnaire',
          'Il faut d’abord financer la cotisation via salaire ou dividende (impôt personnel possible), puis cotiser au CELI',
          'Le CELI peut être cotisé directement par la société sans passer par l’actionnaire',
        ],
        correctIndex: 1,
        explanation:
          'Le CELI est un régime personnel. La société doit d’abord verser des fonds à l’actionnaire ; cette sortie a des conséquences fiscales selon qu’il s’agit d’un salaire ou d’un dividende.',
      },
      {
        id: 'fec-q3',
        prompt:
          'Dans l’exemple des 80 000 $, environ 307 $ d’impôt sur 1 000 $ d’intérêts vont à l’IMRTD. À quoi sert ce compte?',
        choices: [
          'À réduire automatiquement la TPS de la société',
          'À permettre un remboursement d’impôt lorsque la société verse des dividendes imposables (sous plafonds et règles applicables)',
          'À convertir les intérêts en gains en capital libres d’impôt',
        ],
        correctIndex: 1,
        explanation:
          'L’IMRTD accumule la portion remboursable de l’impôt sur certains revenus de placement. Le remboursement est généralement lié aux dividendes imposables versés, dans la limite du solde.',
      },
    ],
  },
  diagram: {
    title: 'Où va le surplus de la société ?',
    type: 'fork',
    source: { id: 'surplus', label: 'Surplus de société', hint: 'Liquidités post-exploitation' },
    branches: [
      {
        id: 'extraire',
        label: 'Extraire',
        hint: 'Salaire/dividende → perso, REER, CELI',
        edgeLabel: 'Impôt perso',
      },
      {
        id: 'conserver',
        label: 'Conserver en société',
        hint: 'Placements → IMRTD / CDC',
        edgeLabel: 'Revenus de placement',
      },
      {
        id: 'actif',
        label: 'Réinvestir dans l’actif',
        hint: 'Fonds de roulement, croissance',
        edgeLabel: 'Priorité ops',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — déploiement des 80 000 $',
    type: 'fork',
    source: { id: 's80', label: 'Surplus 80 000 $', hint: 'SPCC Qc, post-impôt actif' },
    branches: [
      {
        id: 'besoin',
        label: 'Perso ≈ 15 000 $ nets',
        hint: 'Salaire et/ou dividende',
        edgeLabel: 'Extraction',
      },
      {
        id: 'celi',
        label: 'CELI 18 000 $',
        hint: 'Après sortie vers l’actionnaire',
        edgeLabel: 'Droits perso',
      },
      {
        id: 'reer',
        label: 'REER jusqu’à 22 000 $',
        hint: 'Souvent lié au salaire',
        edgeLabel: 'Arbitrage',
      },
      {
        id: 'reliquat',
        label: 'Corpo ≈ 25 000 $',
        hint: 'Taux élevé + IMRTD',
        edgeLabel: 'Si conservé',
      },
    ],
  },
  timeline: {
    title: 'Ligne du temps — déploiement d’un surplus de 80 000 $',
    caption: 'Ordre illustratif : besoin perso, enveloppes enregistrées, puis reliquat en société.',
    events: [
      {
        at: 'Surplus',
        title: 'Liquidités en SPCC',
        amount: '80 000 $',
        note: 'Après besoins d’exploitation',
        emphasis: true,
      },
      {
        at: 'Extraction',
        title: 'Besoin personnel',
        amount: '≈ 15 000 $',
        note: 'Salaire et/ou dividende',
      },
      {
        at: 'Enveloppes',
        title: 'CELI + REER',
        amount: '18 000 $ + jusqu’à 22 000 $',
        note: 'Après sortie vers l’actionnaire',
      },
      {
        at: 'Reliquat',
        title: 'Conservé en société',
        amount: '≈ 25 000 $',
        note: 'Placement → taux élevé + IMRTD',
      },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'montant', name: 'Déploiement ($)' }],
      points: [
        { at: 'Perso', montant: 15000 },
        { at: 'CELI', montant: 18000 },
        { at: 'REER', montant: 22000 },
        { at: 'Corpo', montant: 25000 },
      ],
    },
  },
  sources: [
    {
      name: 'ARC — Folio S3-F2-C2, Dividendes imposables provenant de sociétés résidant au Canada (intégration, impôt remboursable)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/renseignements-techniques/impot-revenu/folios-impot-revenu/serie-3-biens-placements-regimes-epargne/serie-3-biens-placements-regimes-epargne-folio-2-dividendes/folio-impot-revenu-s3-f2-c2-dividendes-imposables-provenant-societes-qui-resident-canada.html',
    },
    {
      name: 'ARC — À propos des soldes d’impôt en main remboursable au titre de dividendes (IMRTD)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/services-electroniques/services-numeriques-entreprises/dossier-entreprise/a-propos-soldes-impot-main-remboursable-titre-dividendes-imrtd.html',
    },
    {
      name: 'ARC — Guide T2, chapitre 6 (IMRDD / IMRDND et remboursement au titre de dividendes)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/formulaires-publications/publications/t4012/guide-t2-declaration-revenus-societes-chapitre-6-pages-6-7-declaration-t2.html',
    },
    {
      name: 'Revenu Québec — Impôt des sociétés et déclaration des sociétés (CO-17)',
      url: 'https://www.revenuquebec.ca/fr/entreprises/impots/impot-des-societes/',
    },
    {
      name: 'IQPF — Normes professionnelles (situation fiscale, optimisation de la rémunération et de la structure)',
      url: 'https://institutpf.org/assets/Documents/InstitutPF-normes-professionnelles-rev2023-fr.pdf',
    },
  ],
  relatedServiceIds: ['optimisation-fiscale', 'patrimoine'],
  relatedFormationIds: ['vie-categorie-actif', 'protections-corpo'],
  seoTitle: 'Fiscalité de l’épargne corporative | Formation privée',
  seoDescription:
    'Mini-formation : salaire vs dividende, revenus de placement en SPCC, IMRTD et déploiement d’un surplus — mécanismes et ordre de décision pour dirigeants.',
};
