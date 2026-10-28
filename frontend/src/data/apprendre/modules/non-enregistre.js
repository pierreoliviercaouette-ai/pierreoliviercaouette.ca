/**
 * Mini-formation compte non enregistré — niveau institutionnel.
 * Sources : ARC, Revenu Québec (inclusion gains 2026).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'non-enregistre',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Le compte non enregistré',
  subtitle: 'Fiscalité des placements hors CELI et REER',
  shortDescription:
    'Intérêts, dividendes canadiens et gains en capital dans un compte taxable : comment l’impôt s’applique, le prix de base rajusté, et quand ce compte complète CELI et REER.',
  readMinutes: 14,
  keyFacts: [
    {
      label: 'Intérêts',
      value: 'Inclus à 100 % dans le revenu',
    },
    {
      label: 'Dividendes canadiens',
      value: 'Majoration + crédit d’impôt',
    },
    {
      label: 'Gains en capital',
      value: 'Inclusion de 50 % (en vigueur en 2026)',
    },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’un compte non enregistré?',
      paragraphs: [
        'Un compte non enregistré — aussi appelé compte de placement taxable ou compte-titres — n’est ni un CELI ni un REER. Vous y détenez épargne ou titres sans plafond de cotisation fixé par la loi.',
        'Vous y déposez de l’argent déjà imposé : le dépôt lui-même ne crée pas d’impôt. Ce qui est imposable, ce sont les revenus et les gains réalisés pendant que l’argent y reste.',
        'Contrairement au CELI (croissance et retraits généralement libres d’impôt) et au REER (déduction à l’entrée, imposition au retrait), ce compte n’offre pas d’abri fiscal automatique. En échange, pas de plafond annuel, et les retraits ne sont pas imposés comme un retrait de REER.',
      ],
    },
    {
      heading: 'Comment l’impôt traite chaque type de revenu',
      paragraphs: [
        'Le type de revenu change l’impôt net, même si le rendement brut semble identique. Les intérêts (épargne, CPG, obligations, certains fonds monétaires) s’ajoutent en règle générale à 100 % à votre revenu de l’année — même sans feuillet, dès qu’ils sont gagnés.',
        'Les dividendes de sociétés canadiennes imposables suivent un autre chemin. On majore d’abord le dividende (on l’augmente fictivement dans le revenu), puis on demande un crédit d’impôt pour dividendes. L’intuition : la société a déjà payé de l’impôt sur ses profits. Les dividendes étrangers ne donnent en général pas droit à ce crédit canadien.',
        'Vous réalisez un gain en capital lorsque vous disposez d’une immobilisation (action, FNB, etc.) pour un produit supérieur à son coût fiscal. Seule une fraction — le taux d’inclusion — s’ajoute au revenu. Pour les particuliers, ce taux est en règle générale de 50 % en 2026 : la moitié du gain entre dans le revenu, puis votre taux marginal s’applique à cette moitié.',
      ],
    },
    {
      heading: 'Suivre le prix de base rajusté à la vente',
      paragraphs: [
        'Le prix de base rajusté (PBR) est le coût fiscal de vos titres. Il part en général du prix d’achat, majoré de frais d’acquisition admissibles, et se rajuste après certains événements (fonds, distributions de capital). C’est ce montant, et non le seul prix à l’écran, qui sert de référence.',
        'Une disposition, c’est le moment où vous cédez le titre : vente, échange, don, ou parfois un événement traité comme une disposition. Gain = produit de disposition (moins frais de vente admissibles) moins PBR. Si le résultat est négatif, vous avez une perte en capital, utilisable selon des règles précises pour compenser des gains.',
        'Sans suivi du PBR, vous risquez de surestimer le gain (et l’impôt) ou de sous-déclarer. Les plateformes affichent souvent un coût moyen : croisez-le avec vos relevés et feuillets, surtout après transferts ou achats échelonnés.',
      ],
    },
    {
      heading: 'Quand le non enregistré complète CELI et REER',
      paragraphs: [
        'On utilise souvent d’abord les régimes enregistrés (CELI, REER, et selon le cas CELIAPP ou REEE) parce qu’ils reportent ou éliminent l’impôt sur la croissance. Le compte non enregistré complète lorsque les droits sont limités, lorsqu’un objectif exige plus de flexibilité, ou pour des montants au-delà des plafonds.',
        'Ce n’est pas une règle absolue. Liquidité, horizon, type de revenu du placement et situation fiscale globale peuvent justifier un autre ordre. Comparez toujours le rendement après impôt — pas seulement le rendement brut hors régime.',
      ],
    },
    {
      heading: 'Garder le fil des frais et des feuillets',
      paragraphs: [
        'Les frais de compte, de transaction ou de gestion réduisent le rendement net. Certains frais liés à l’achat ou à la vente entrent dans le calcul du PBR ou du produit de disposition ; d’autres (tenue de compte) se traitent autrement. Lisez votre grille tarifaire et gardez les avis de transaction.',
        'Chaque année, les institutions produisent souvent des feuillets (T5, T3, T5013 au fédéral, et les relevés québécois correspondants) qui résument intérêts, dividendes et certaines distributions. Ils facilitent la déclaration, mais ne remplacent pas votre suivi du PBR ni la déclaration des intérêts sans feuillet.',
      ],
      bullets: [
        'Notez le PBR à chaque achat, transfert ou distribution de capital.',
        'Classez avis de transaction et feuillets avant la saison des impôts.',
        'Comparez rendements après impôt, pas seulement le brut hors régime.',
      ],
    },
  ],
  workedExample: {
    title: 'Intérêt de 8 000 $ vs gain en capital de 8 000 $',
    intro:
      'Vous réalisez 8 000 $ de rendement dans un compte non enregistré. Deux scénarios exclusifs : tout en intérêts, ou tout en gain en capital réalisé. Taux marginal combiné illustratif de 37 % (fédéral + Québec) — pédagogique seulement ; votre taux réel dépend de votre revenu et de l’année.',
    steps: [
      {
        label: 'Scénario A — intérêts',
        detail:
          'Intérêt de 8 000 $. Inclusion : 100 %. Revenu imposable ajouté : 8 000 $. Impôt illustratif : 8 000 $ × 37 % = 2 960 $.',
      },
      {
        label: 'Scénario B — gain en capital',
        detail:
          'Gain en capital de 8 000 $. Taux d’inclusion en vigueur en 2026 : 50 %. Gain en capital imposable : 4 000 $. Impôt illustratif : 4 000 $ × 37 % = 1 480 $.',
      },
      {
        label: 'Écart après impôt',
        detail:
          'Net illustratif : environ 5 040 $ (intérêts) contre environ 6 520 $ (gain). Écart : 1 480 $ — la moitié de l’impôt du scénario intérêt, ce qui reflète l’inclusion à 50 %.',
      },
    ],
    result:
      'Même rendement nominal, charge fiscale différente : l’intérêt est inclus en totalité ; le gain en capital (règles 2026) n’est inclus qu’à moitié. Ce n’est pas un conseil d’achat : risque, frais et timing de disposition comptent autant que la fiscalité.',
  },
  takeaways: [
    'Intérêts à 100 % ; dividendes canadiens via majoration et crédit ; gains inclus à 50 % en 2026.',
    'Le PBR et la disposition déterminent le gain : suivez coûts et feuillets.',
    'Le non enregistré complète souvent CELI et REER : comparez après impôt.',
    'Feuillets aident la déclaration ; ils ne remplacent pas le suivi du PBR.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'nonreg-q1',
        prompt:
          'Dans un compte non enregistré, comment les intérêts s’ajoutent-ils en général au revenu?',
        choices: [
          'Ils ne sont jamais imposables',
          'Ils sont inclus à 100 %',
          'Seule la moitié est incluse',
        ],
        correctIndex: 1,
        explanation:
          'Les intérêts font en principe partie du revenu à 100 %, contrairement au gain en capital dont seule une fraction est incluse.',
      },
      {
        id: 'nonreg-q2',
        prompt:
          'Avec un taux d’inclusion de 50 % (règles en vigueur en 2026), un gain en capital de 8 000 $ donne un gain imposable de…',
        choices: ['8 000 $', '5 333 $', '4 000 $'],
        correctIndex: 2,
        explanation:
          '8 000 $ × 50 % = 4 000 $ de gain en capital imposable. Ce n’est pas un taux d’impôt de 50 %.',
      },
      {
        id: 'nonreg-q3',
        prompt:
          'À quoi sert surtout le prix de base rajusté (PBR) d’un titre?',
        choices: [
          'À fixer le plafond de cotisation du compte',
          'À calculer le gain ou la perte à la disposition',
          'À éviter de déclarer les dividendes canadiens',
        ],
        correctIndex: 1,
        explanation:
          'Le PBR est le coût fiscal du titre. Gain (ou perte) ≈ produit de disposition moins PBR, après frais admissibles.',
      },
    ],
  },
  diagram: {
    title: 'Trois natures de revenu',
    type: 'fork',
    source: {
      id: 'compte',
      label: 'Compte non enregistré',
      hint: 'Revenus et gains à déclarer',
    },
    branches: [
      {
        id: 'interets',
        label: 'Intérêts',
        hint: 'Inclusion 100 %',
        edgeLabel: 'Pleinement imposables',
      },
      {
        id: 'dividendes',
        label: 'Dividendes canadiens',
        hint: 'Majoration + crédit',
        edgeLabel: 'Traitement distinct',
      },
      {
        id: 'gains',
        label: 'Gains en capital',
        hint: 'Inclusion 50 % (2026)',
        edgeLabel: 'À la disposition',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple : 8 000 $ d’intérêt vs 8 000 $ de gain',
    type: 'flow',
    nodes: [
      {
        id: 'brut',
        label: 'Rendement brut 8 000 $',
        hint: 'Même montant, deux scénarios',
        emphasis: true,
      },
      {
        id: 'int',
        label: 'Intérêt → inclus 8 000 $',
        hint: 'Impôt illustratif 2 960 $',
      },
      {
        id: 'gc',
        label: 'Gain → inclus 4 000 $',
        hint: 'Impôt illustratif 1 480 $',
      },
      {
        id: 'ecart',
        label: 'Écart après impôt 1 480 $',
        hint: 'Avantage relatif du gain',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'brut', to: 'int', label: 'Scénario A' },
      { from: 'brut', to: 'gc', label: 'Scénario B' },
      { from: 'int', to: 'ecart' },
      { from: 'gc', to: 'ecart' },
    ],
  },
  timeline: {
    title: 'Comparaison chiffrée — même rendement brut',
    caption:
      '8 000 $ d’intérêt vs 8 000 $ de gain réalisé ; taux marginal 37 % ; inclusion des gains à 50 % (2026).',
    events: [
      {
        at: 'Départ',
        title: 'Rendement brut',
        amount: '8 000 $',
        note: 'Même montant, deux scénarios',
      },
      {
        at: 'Intérêt',
        title: 'Impôt illustratif',
        amount: '2 960 $',
        note: 'Inclusion 100 % × 37 %',
        emphasis: true,
      },
      {
        at: 'Gain',
        title: 'Impôt illustratif',
        amount: '1 480 $',
        note: 'Inclusion 50 % → 4 000 $ × 37 %',
        emphasis: true,
      },
      {
        at: 'Écart',
        title: 'Après impôt',
        amount: '+1 480 $',
        note: 'Avantage net du scénario gain',
      },
    ],
    chart: {
      type: 'bar',
      series: [
        { key: 'brut', name: 'Brut' },
        { key: 'impot', name: 'Impôt' },
        { key: 'net', name: 'Net' },
      ],
      points: [
        { at: 'Intérêt', brut: 8000, impot: 2960, net: 5040 },
        { at: 'Gain', brut: 8000, impot: 1480, net: 6520 },
      ],
    },
  },
  sources: [
    {
      name: 'ARC — Ligne 12100 : intérêts et autres revenus de placement',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/tout-votre-declaration-revenus/declaration-revenus/remplir-declaration-revenus/revenu-personnel/ligne-12100-interets-autres-revenus-placement.html',
    },
    {
      name: 'ARC — Lignes 12000 et 12010 : dividendes de sociétés canadiennes',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/tout-votre-declaration-revenus/declaration-revenus/remplir-declaration-revenus/revenu-personnel/ligne-12000-montant-imposable-dividendes-determines-autres-determines-societes-canadiennes-imposables.html',
    },
    {
      name: 'ARC — Ligne 40425 : crédit d’impôt fédéral pour dividendes',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/tout-votre-declaration-revenus/declaration-revenus/remplir-declaration-revenus/deductions-credits-depenses/ligne-40425-credit-impot-federal-dividendes.html',
    },
    {
      name: 'ARC — Gains en capital (T4037) — taux d’inclusion',
      url: 'https://www.canada.ca/fr/agence-revenu/services/formulaires-publications/publications/t4037/gains-capital.html',
    },
    {
      name: 'Cabinet du Premier ministre — annulation de la hausse du taux d’inclusion (21 mars 2025)',
      url: 'https://www.pm.gc.ca/fr/nouvelles/communiques/2025/03/21/premier-ministre-mark-carney-annule-la-hausse-proposee-de-impot-gains-capital',
    },
    {
      name: 'Revenu Québec — Ligne 130 : intérêts et autres revenus de placement',
      url: 'https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/96-a-164-revenu-total/ligne-130/',
    },
    {
      name: 'Revenu Québec — Ligne 139 : gains en capital imposables',
      url: 'https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/96-a-164-revenu-total/ligne-139/',
    },
  ],
  relatedServiceIds: ['epargne', 'optimisation-fiscale'],
  relatedFormationIds: ['celi', 'reer-ferr'],
  seoTitle: 'Compte non enregistré : intérêts, dividendes et gains | Apprendre',
  seoDescription:
    'Mini-formation sur le compte non enregistré : intérêts, dividendes canadiens, gains en capital (inclusion 50 % en 2026), PBR et place après CELI/REER.',
};
