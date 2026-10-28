/**
 * Mini-formation — Fonds communs de placement.
 * Sources : AMF (FCP, RFG, prospectus, aperçu du fonds, FNB).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'fonds-communs',
  audiences: ['particulier'],
  category: 'placements',
  title: 'Les fonds communs de placement',
  subtitle: 'Mise en commun, parts, frais et documents',
  shortDescription:
    'Comment un fonds met l’épargne en commun, ce que sont les parts, le rôle typique de la gestion active, le RFG, le prospectus, et une comparaison courte avec les FNB.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Principe', value: 'Argent mis en commun, géré selon un objectif' },
    { label: 'Titre détenu', value: 'Parts (valeur liquidative, souvent quotidienne)' },
    { label: 'Frais clés', value: 'RFG prélevé sur l’actif du fonds' },
  ],
  sections: [
    {
      heading: 'Comprendre la mise en commun',
      paragraphs: [
        'Un fonds commun de placement — aussi appelé organisme de placement collectif — regroupe l’argent de plusieurs investisseurs. Un gestionnaire utilise ces sommes pour acheter des titres selon l’objectif du fonds : revenus, croissance, ou une combinaison des deux.',
        'En échange de votre dépôt, vous recevez des parts. Chaque part représente une fraction du fonds. La valeur liquidative d’une part est en général calculée une fois par jour ouvrable : c’est le prix auquel on rachète ou on émet des parts auprès du fonds.',
        'Vous n’achetez pas directement chaque action ou obligation du portefeuille. Vous achetez une part d’un panier déjà constitué et géré. Le risque dépend des titres détenus : un fonds d’actions n’a pas le même profil qu’un fonds d’obligations.',
      ],
    },
    {
      heading: 'Voir ce que le fonds peut détenir',
      paragraphs: [
        'Un même fonds peut détenir des actions, des obligations, des titres du marché monétaire ou d’autres placements admissibles — selon sa politique. Un fonds « équilibré » combine souvent actions et obligations pour viser à la fois croissance et stabilité relative.',
        'La gestion est souvent active : l’équipe choisit les titres et ajuste le portefeuille dans le but d’atteindre l’objectif annoncé, plutôt que de simplement reproduire un indice. Ce travail a un coût, reflété dans les frais.',
        'Lire la composition et l’objectif avant d’investir évite les surprises. Deux fonds « équilibrés » peuvent avoir des pondérations, des styles et des frais très différents.',
      ],
    },
    {
      heading: 'Lire le RFG sans le confondre avec le rendement',
      paragraphs: [
        'Le ratio des frais de gestion (RFG) mesure les frais de gestion et d’exploitation du fonds par rapport à son actif net moyen. Ces frais sont prélevés à même l’actif : ils réduisent le rendement net, même s’ils n’apparaissent pas comme un prélèvement séparé sur votre relevé.',
        'Un RFG plus élevé n’implique pas un meilleur résultat. Comparez le RFG entre fonds de même catégorie, et lisez aussi les frais d’achat éventuels. Les rendements publiés sont en général déjà nets des frais de gestion et d’exploitation.',
        'D’autres frais peuvent exister selon le fonds ou le compte (opérations, série de parts). L’aperçu du fonds résume RFG, commissions de suivi et impact illustratif sur 1 000 $ — c’est le point de départ avant le prospectus.',
      ],
    },
    {
      heading: 'Utiliser l’aperçu et le prospectus',
      paragraphs: [
        'Avant l’achat, votre représentant doit vous remettre l’aperçu du fonds. Ce document court résume l’objectif, le risque, les frais et vos droits. Pour le détail juridique et la politique de placement, consultez le prospectus simplifié.',
        'Ces documents ne garantissent pas le rendement. Ils vous permettent de vérifier si le fonds correspond à votre horizon, à votre tolérance au risque et aux frais que vous acceptez de payer.',
      ],
    },
    {
      heading: 'Comparer brièvement avec un FNB',
      paragraphs: [
        'Un fonds négocié en bourse (FNB) est aussi un fonds d’investissement. La différence pratique : ses parts se négocient en bourse comme des actions, à un cours qui peut varier pendant la séance. Un fonds commun se rachète en général auprès du fonds, à la valeur liquidative du jour.',
        'Beaucoup de FNB suivent un indice (gestion passive) et affichent souvent un RFG plus bas. Des FNB à gestion active existent aussi. Fonds commun et FNB peuvent tous deux détenir actions et obligations ; ce qui change, c’est surtout la façon d’acheter, de vendre et, souvent, le niveau de frais.',
      ],
      bullets: [
        'Lisez l’objectif et la composition avant le rendement passé.',
        'Comparez le RFG entre fonds de même catégorie.',
        'Gardez aperçu du fonds et prospectus sous la main.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Sam, fonds équilibré et RFG',
    intro:
      'Illustration pédagogique : 10 000 $ dans un fonds équilibré (environ 60 % actions, 40 % obligations). Rendement brut illustratif de 5 % par année avant RFG. Deux RFG hypothétiques — 2,0 % et 0,25 % — sur cinq ans. Ce n’est pas un conseil personnalisé ni une prévision.',
    steps: [
      {
        label: 'Mise en place',
        detail:
          'Sam investit 10 000 $. Sous le capot, le fonds détient environ 6 000 $ en actions et 4 000 $ en obligations. Sam détient des parts, pas chaque titre individuellement.',
      },
      {
        label: 'Fonds A — RFG 2,0 %',
        detail:
          'Rendement net illustratif ≈ 3 % par année (5 % − 2 %). Après cinq ans : environ 11 593 $. La première année, les frais sur un solde d’environ 10 000 $ représentent près de 200 $.',
      },
      {
        label: 'Fonds B — RFG 0,25 %',
        detail:
          'Même brut de 5 %, RFG plus bas : net illustratif ≈ 4,75 %. Après cinq ans : environ 12 613 $.',
      },
      {
        label: 'Écart',
        detail:
          'Différence après cinq ans : environ 1 020 $ pour le même capital de départ et le même rendement brut. L’écart vient des frais, pas d’un « meilleur marché ».',
      },
    ],
    result:
      'Sam voit qu’un fonds peut détenir actions et obligations à la fois, et que le RFG gruge le rendement net même sans ligne « frais » sur le relevé. Choisir un fonds, c’est aussi choisir un niveau de frais — à comparer dans l’aperçu du fonds.',
  },
  takeaways: [
    'Un fonds met l’épargne en commun ; vous détenez des parts, pas chaque titre.',
    'Le même fonds peut détenir actions, obligations et autres titres.',
    'Le RFG réduit le rendement net ; un RFG élevé n’assure pas un meilleur résultat.',
    'Lisez l’aperçu du fonds et le prospectus avant d’investir.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'fonds-communs-q1',
        prompt:
          'Dans l’exemple de Sam, d’où vient surtout l’écart d’environ 1 020 $ après cinq ans?',
        choices: [
          'D’une garantie de rendement du fonds A',
          'De la différence de RFG (frais) à rendement brut identique',
          'Du fait que seul le fonds B peut détenir des obligations',
        ],
        correctIndex: 1,
        explanation:
          'Les deux scénarios partent du même brut illustratif de 5 %. Seul le RFG change (2,0 % vs 0,25 %), ce qui produit l’écart de solde après cinq ans.',
      },
      {
        id: 'fonds-communs-q2',
        prompt: 'Que représente principalement le RFG?',
        choices: [
          'Un bonus garanti ajouté à votre compte chaque année',
          'Les frais de gestion et d’exploitation en % de l’actif du fonds',
          'Le rendement brut avant tout investissement',
        ],
        correctIndex: 1,
        explanation:
          'Le RFG exprime les frais de gestion et d’exploitation par rapport à l’actif net moyen. Ils sont prélevés sur l’actif et réduisent le rendement net.',
      },
      {
        id: 'fonds-communs-q3',
        prompt:
          'Quelle différence pratique distingue souvent un fonds commun d’un FNB?',
        choices: [
          'Seul le FNB peut détenir des actions',
          'Les parts d’un FNB se négocient en bourse ; le fonds commun se rachète surtout auprès du fonds',
          'Un fonds commun n’a jamais de frais',
        ],
        correctIndex: 1,
        explanation:
          'Les deux peuvent détenir actions et obligations. En pratique, le FNB se négocie en bourse ; le fonds commun se rachète en général auprès du fonds à la valeur liquidative.',
      },
    ],
  },
  diagram: {
    title: 'Parcours — fonds commun',
    type: 'flow',
    nodes: [
      { id: 'investors', label: 'Investisseurs', hint: 'Épargne mise en commun' },
      { id: 'fund', label: 'Fonds commun', hint: 'Parts · valeur liquidative', emphasis: true },
      { id: 'stocks', label: 'Actions', hint: 'Selon l’objectif' },
      { id: 'bonds', label: 'Obligations', hint: 'Selon l’objectif' },
    ],
    edges: [
      { from: 'investors', to: 'fund', label: 'Acheter des parts' },
      { from: 'fund', to: 'stocks', label: 'Peut détenir' },
      { from: 'fund', to: 'bonds', label: 'Peut détenir' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Sam — 10 000 $ sur 5 ans',
    type: 'flow',
    nodes: [
      {
        id: 'start',
        label: '10 000 $ investis',
        hint: '~6 000 $ actions · 4 000 $ obl.',
      },
      {
        id: 'mer-high',
        label: 'RFG 2,0 % → ~11 593 $',
        hint: 'Net illustratif ≈ 3 %/an',
        emphasis: true,
      },
      {
        id: 'mer-low',
        label: 'RFG 0,25 % → ~12 613 $',
        hint: 'Net illustratif ≈ 4,75 %/an',
      },
      {
        id: 'gap',
        label: 'Écart ≈ 1 020 $',
        hint: 'Même brut 5 %, frais différents',
      },
    ],
    edges: [
      { from: 'start', to: 'mer-high', label: 'Fonds A' },
      { from: 'start', to: 'mer-low', label: 'Fonds B' },
      { from: 'mer-high', to: 'gap', label: 'Après 5 ans' },
      { from: 'mer-low', to: 'gap', label: 'Après 5 ans' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Sam, cinq ans',
    caption:
      'Même placement initial et même rendement brut illustratif de 5 %. Seul le RFG change. Soldes arrondis ; illustration seulement.',
    events: [
      {
        at: 'An 0',
        title: 'Investissement',
        amount: '10 000 $',
        note: 'Fonds équilibré ~60 / 40',
        emphasis: true,
      },
      {
        at: 'An 1',
        title: 'Effet des frais',
        amount: '~200 $',
        note: 'Ordre de grandeur RFG 2 % sur ~10 000 $',
      },
      {
        at: 'An 5 — RFG 2 %',
        title: 'Solde fonds A',
        amount: '~11 593 $',
        note: 'Net illustratif ≈ 3 %/an',
      },
      {
        at: 'An 5 — RFG 0,25 %',
        title: 'Solde fonds B',
        amount: '~12 613 $',
        note: 'Net illustratif ≈ 4,75 %/an',
        emphasis: true,
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'rfg20', name: 'Solde RFG 2,0 %' },
        { key: 'rfg025', name: 'Solde RFG 0,25 %' },
      ],
      points: [
        { at: 'An 0', rfg20: 10000, rfg025: 10000 },
        { at: 'An 1', rfg20: 10300, rfg025: 10475 },
        { at: 'An 2', rfg20: 10609, rfg025: 10973 },
        { at: 'An 3', rfg20: 10927, rfg025: 11494 },
        { at: 'An 4', rfg20: 11255, rfg025: 12040 },
        { at: 'An 5', rfg20: 11593, rfg025: 12613 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Fonds communs de placement',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-communs-de-placement',
    },
    {
      name: 'AMF — Frais liés aux fonds communs de placement',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/frais-lies-aux-fonds-communs-de-placement',
    },
    {
      name: 'AMF — Aperçu du fonds commun de placement',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/apercu-du-fonds/apercu-du-fonds-commun-de-placement',
    },
    {
      name: 'AMF — Prospectus : pourquoi le lire',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/prospectus',
    },
    {
      name: 'AMF — Fonds négociés en bourse (FNB)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-negocies-en-bourse-fnb',
    },
    {
      name: 'AMF — Frais liés aux placements',
      url: 'https://lautorite.qc.ca/grand-public/investissements/conseils-cles-avant-dinvestir/frais-lies-aux-placements',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin.',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: [
    'fnb',
    'actions-dividendes',
    'obligations',
    'fonds-distincts',
  ],
  seoTitle: 'Fonds communs : parts, RFG et prospectus | Apprendre',
  seoDescription:
    'Mini-formation sur les fonds communs de placement : mise en commun, parts, gestion active, RFG, prospectus et comparaison courte avec les FNB.',
};
