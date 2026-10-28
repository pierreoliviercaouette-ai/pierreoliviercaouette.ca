/**
 * Mini-formation FNB — niveau institutionnel.
 * Sources : AMF (FNB, aperçu, frais). Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'fnb',
  audiences: ['particulier'],
  category: 'placements',
  title: 'Les fonds négociés en bourse (FNB)',
  subtitle: 'Cotation, spread, gestion et liquidité intraday',
  shortDescription:
    'Comprendre un FNB : parts cotées en bourse, écart acheteur-vendeur, gestion souvent indicielle, frais souvent plus bas que beaucoup de fonds actifs (pas une règle absolue), et liquidité pendant la séance face à un fonds commun.',
  readMinutes: 13,
  keyFacts: [
    { label: 'Cotation', value: 'Parts négociées en bourse comme des actions' },
    { label: 'Spread', value: 'Écart entre prix acheteur et vendeur' },
    { label: 'Sous-jacents', value: 'Souvent panier d’actions ou d’obligations' },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’un FNB?',
      paragraphs: [
        'Un fonds négocié en bourse (FNB) est un fonds d’investissement dont les parts se négocient en bourse, comme des actions. Vous achetez ou vendez via un courtier pendant les heures d’ouverture du marché.',
        'Sous le capot, le FNB détient un panier de titres — souvent des actions, des obligations, ou un mélange — selon son mandat. Votre part vous donne une exposition proportionnelle à ce panier, sans que vous ayez à acheter chaque titre un par un.',
        'Le FNB n’est ni un CPG ni une garantie de capital. La valeur peut monter ou baisser selon les marchés sous-jacents, la demande pour les parts et les frais du fonds.',
      ],
    },
    {
      heading: 'Lire le cours et l’écart acheteur-vendeur',
      paragraphs: [
        'Pendant la séance, un FNB affiche un cours de marché. Ce cours peut différer légèrement de la valeur liquidative (VL) — la valeur estimée du panier divisée par le nombre de parts. Les mainteneurs de marché aident à garder le cours près de la VL.',
        'L’écart acheteur-vendeur (spread) est la différence entre le prix auquel vous pouvez vendre immédiatement (offre d’achat) et celui auquel vous pouvez acheter (offre de vente). Plus le spread est large, plus le coût implicite d’entrer ou de sortir est élevé.',
        'Un ordre au marché s’exécute au meilleur prix disponible ; un ordre à cours limité fixe un plafond ou un plancher. En période agitée ou sur un FNB peu liquide, le spread peut s’élargir : le prix payé n’est plus seulement « le cours » affiché au milieu.',
      ],
    },
    {
      heading: 'Gestion indicielle et frais',
      paragraphs: [
        'Beaucoup de FNB sont indiciels : le gestionnaire vise à reproduire un indice de référence (actions, obligations, etc.), pas à « battre » le marché. D’autres sont gérés activement : le mandat cherche un objectif précis, souvent avec des frais plus élevés.',
        'Les frais du FNB réduisent le rendement net sans toujours apparaître comme une facture séparée. On regarde surtout le ratio des frais de gestion (RFG) dans l’aperçu du fonds. Des courtages peuvent aussi s’appliquer à chaque transaction, selon votre plateforme.',
        'Les FNB indiciels affichent souvent des frais plus bas que beaucoup de fonds communs à gestion active — qualitative et relative, pas une règle absolue. Comparez toujours le même type d’exposition et lisez l’aperçu avant d’investir.',
      ],
    },
    {
      heading: 'Liquidité : FNB ou fonds commun?',
      paragraphs: [
        'Avec un FNB, vous pouvez en principe acheter ou vendre pendant la séance, au cours du moment. Un fonds commun de placement se négocie en général à la VL calculée en fin de journée : votre ordre du jour reçoit ce prix unique.',
        'Cette liquidité intraday n’efface pas le risque de marché. Si les sous-jacents chutent, le cours du FNB suit. Un FNB peu négocié peut aussi être plus difficile à vendre rapidement sans élargir le spread.',
        'Le choix FNB / fonds commun dépend aussi du compte (CELI, REER, non enregistré), des frais totaux, de la facilité d’achat périodique et de l’accompagnement. Ce texte est général et ne constitue pas un conseil personnalisé.',
      ],
    },
    {
      heading: 'Relier sous-jacents et documents à lire',
      paragraphs: [
        'Le risque d’un FNB d’actions ressemble à celui d’un panier d’actions ; celui d’un FNB d’obligations, à un panier de titres de créance. L’effet de levier, le rendement inverse ou certaines stratégies spécialisées ajoutent des risques distincts, souvent destinés à des investisseurs avertis.',
        'Avant d’acheter, consultez l’aperçu du FNB (frais, risque, distributions, opérations) et, au besoin, le prospectus. Posez-vous notamment :',
      ],
      bullets: [
        'Quel indice ou mandat le FNB suit-il, et quels titres détient-il?',
        'Quel RFG et quel spread observez-vous en conditions normales?',
        'Avez-vous besoin de liquidité intraday, ou une VL de fin de journée suffit-elle?',
        'Le niveau de risque collé à votre horizon et à votre tolérance?',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Léa, 20 000 $ en FNB indiciel',
    intro:
      'Illustration pédagogique des mécaniques bourse / spread / frais. Montants et RFG fictifs mais réalistes ; ce n’est pas une cotation ni un conseil personnalisé.',
    steps: [
      {
        label: 'Ordre d’achat en séance',
        detail:
          'Léa place environ 20 000 $ dans un FNB d’actions canadiennes coté. Cours milieu ≈ 50,00 $ ; elle achète 400 parts au prix vendeur 50,05 $ (spread 0,10 $ entre 49,95 $ et 50,05 $), soit 20 020 $.',
      },
      {
        label: 'Coût implicite du spread',
        detail:
          'Si elle revendait aussitôt au prix acheteur 49,95 $, elle encaisserait 19 980 $. Écart immédiat : 40 $ par rapport à l’achat — soit le spread plein sur 400 parts — avant même le mouvement du marché. Le demi-spread à l’entrée seule ≈ 20 $.',
      },
      {
        label: 'Frais annuels du fonds',
        detail:
          'Le RFG du FNB indiciel est de 0,20 % : environ 40 $ par an sur ~20 000 $ (valeur stable). Un fonds commun comparable à 1,50 % coûterait environ 300 $ par an sur le même capital — écart typique illustratif, pas une prédiction de rendement.',
      },
      {
        label: 'Sortie possible le même jour',
        detail:
          'Deux mois plus tard, Léa vend en séance au cours du moment. Contrairement à un fonds commun (VL de fin de journée), elle choisit le moment dans la séance — en acceptant le spread et le risque que le marché ait bougé.',
      },
    ],
    result:
      'Léa a compris trois leviers : le prix d’exécution (spread), les frais récurrents (RFG) et la liquidité intraday. Le panier d’actions sous-jacent reste le vrai moteur du risque et du rendement.',
  },
  takeaways: [
    'Un FNB se négocie en bourse pendant la séance, comme une action.',
    'Le spread est un coût implicite à l’achat et à la vente.',
    'La gestion est souvent indicielle ; les frais sont souvent plus bas que beaucoup de fonds actifs, pas toujours.',
    'Le risque suit surtout le panier sous-jacent (actions, obligations, etc.).',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'fnb-q1',
        prompt:
          'Dans l’exemple de Léa, que représente surtout l’écart entre 49,95 $ et 50,05 $?',
        choices: [
          'Le RFG annuel du FNB',
          'Le spread (écart acheteur-vendeur) au moment de l’ordre',
          'La garantie de capital du fonds',
        ],
        correctIndex: 1,
        explanation:
          '49,95 $ et 50,05 $ illustrent le prix acheteur et le prix vendeur. Leur différence est le spread, un coût implicite de transaction.',
      },
      {
        id: 'fnb-q2',
        prompt:
          'Sur 20 000 $, un RFG de 0,20 % représente environ combien de frais de fonds par an (valeur stable)?',
        choices: ['Environ 4 $', 'Environ 40 $', 'Environ 400 $'],
        correctIndex: 1,
        explanation:
          '0,20 % × 20 000 $ = 40 $. Ces frais réduisent le rendement net sans toujours apparaître comme une facture séparée.',
      },
      {
        id: 'fnb-q3',
        prompt:
          'En quoi la liquidité d’un FNB diffère-t-elle en général de celle d’un fonds commun?',
        choices: [
          'Le FNB se négocie pendant la séance au cours du marché ; le fonds commun, souvent à la VL de fin de journée',
          'Le fonds commun se négocie minute par minute ; le FNB seulement le 1er janvier',
          'Ni l’un ni l’autre ne peut être vendu avant dix ans',
        ],
        correctIndex: 0,
        explanation:
          'Les parts de FNB s’échangent en bourse pendant les heures de marché. Un fonds commun est en général souscrit ou racheté à la valeur liquidative calculée en fin de journée.',
      },
    ],
  },
  diagram: {
    title: 'Parcours — acheter un FNB',
    type: 'flow',
    nodes: [
      { id: 'cash', label: 'Argent au courtier', hint: 'Compte enregistré ou non' },
      { id: 'order', label: 'Ordre en bourse', hint: 'Prix + spread' },
      { id: 'shares', label: 'Parts de FNB', hint: 'Cotées comme une action', emphasis: true },
      { id: 'basket', label: 'Panier sous-jacent', hint: 'Actions, obligations…' },
    ],
    edges: [
      { from: 'cash', to: 'order', label: 'Placer' },
      { from: 'order', to: 'shares', label: 'Exécuter' },
      { from: 'shares', to: 'basket', label: 'Expose à' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Léa — 20 000 $',
    type: 'flow',
    nodes: [
      {
        id: 'start',
        label: '20 000 $ à investir',
        hint: 'FNB actions indiciel',
      },
      {
        id: 'buy',
        label: 'Achat à 50,05 $',
        hint: 'Spread 49,95–50,05 $',
        emphasis: true,
      },
      {
        id: 'hold',
        label: 'RFG 0,20 % ≈ 40 $/an',
        hint: 'Sur capital stable',
      },
      {
        id: 'sell',
        label: 'Vente en séance',
        hint: 'Cours du moment + spread',
      },
    ],
    edges: [
      { from: 'start', to: 'buy', label: 'Jour 0' },
      { from: 'buy', to: 'hold', label: 'Détention' },
      { from: 'hold', to: 'sell', label: 'Plus tard' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Léa et son FNB',
    caption:
      'Friction à l’entrée (spread), puis frais annuels du fonds. La valeur de marché du panier n’est pas projetée ici : seuls les coûts pédagogiques sont chiffrés.',
    events: [
      {
        at: 'Jour 0',
        title: 'Achat en séance',
        amount: '20 000 $',
        note: 'Prix vendeur 50,05 $ · demi-spread ≈ 20 $',
        emphasis: true,
      },
      {
        at: 'An 1',
        title: 'Frais de fonds (RFG)',
        amount: '≈ 40 $',
        note: '0,20 % si la valeur reste ~20 000 $',
      },
      {
        at: 'An 2',
        title: 'Frais de fonds (cumul)',
        amount: '≈ 80 $',
        note: 'Toujours hors mouvement de marché',
      },
      {
        at: 'An 3',
        title: 'Frais de fonds (cumul)',
        amount: '≈ 120 $',
        note: 'Comparer à un RFG plus élevé sur le même capital',
        emphasis: true,
      },
    ],
    chart: {
      type: 'bar',
      series: [
        { key: 'fnb', name: 'Frais cumulés FNB 0,20 %' },
        { key: 'fonds', name: 'Frais cumulés fonds 1,50 %' },
      ],
      points: [
        { at: 'An 1', fnb: 40, fonds: 300 },
        { at: 'An 2', fnb: 80, fonds: 600 },
        { at: 'An 3', fnb: 120, fonds: 900 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Fonds négociés en bourse (FNB)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-negocies-en-bourse-fnb',
    },
    {
      name: 'AMF — Aperçu du fonds négocié en bourse (FNB)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/apercu-du-fonds/apercu-du-fonds-negocies-en-bourse-fnb',
    },
    {
      name: 'AMF — Aperçu du fonds',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/apercu-du-fonds',
    },
    {
      name: 'AMF — Frais liés aux placements',
      url: 'https://lautorite.qc.ca/grand-public/investissements/conseils-cles-avant-dinvestir/frais-lies-aux-placements',
    },
    {
      name: 'AMF — Investir par soi-même (FNB)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/investir-par-soi-meme',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin.',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: [
    'fonds-communs',
    'actions-dividendes',
    'obligations',
    'non-enregistre',
  ],
  seoTitle: 'FNB : cotation, spread et liquidité | Apprendre',
  seoDescription:
    'Mini-formation sur les fonds négociés en bourse : cotation, écart acheteur-vendeur, gestion indicielle, frais et liquidité intraday face aux fonds communs.',
};
