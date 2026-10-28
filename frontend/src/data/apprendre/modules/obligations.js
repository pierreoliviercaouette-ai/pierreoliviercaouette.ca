/**
 * Mini-formation Obligations / revenu fixe — niveau institutionnel.
 * Sources vérifiées : AMF (titres d’emprunt, FNB, protection des dépôts), glossaire AMF.
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'obligations',
  audiences: ['particulier'],
  category: 'placements',
  title: 'Les obligations',
  subtitle: 'Revenu fixe : coupon, échéance et risques',
  shortDescription:
    'Émetteur, coupon, échéance, lien prix–taux d’intérêt, risques de crédit et de taux, différence avec un CPG, et accès via fonds d’obligations ou FNB obligataires.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Essence', value: 'Prêt à un émetteur jusqu’à l’échéance' },
    { label: 'Prix vs taux', value: 'En général : taux ↑ → prix ↓' },
    { label: 'Vs CPG', value: 'Valeur de marché ; pas une garantie dépôt' },
  ],
  sections: [
    {
      heading: 'Comprendre émetteur, coupon et échéance',
      paragraphs: [
        'Une obligation est un titre d’emprunt : vous prêtez de l’argent à un émetteur — gouvernement (fédéral, provincial, municipal) ou entreprise (obligation corporative). En échange, l’émetteur s’engage en principe à verser des intérêts et à rembourser une somme fixée à l’échéance.',
        'Le coupon est le taux d’intérêt prévu sur la valeur nominale (souvent 1 000 $ par titre). Les intérêts sont en général versés périodiquement, souvent deux fois par année. L’échéance est la date où l’émetteur doit rembourser la valeur nominale.',
        'Tant que vous détenez l’obligation jusqu’à l’échéance et que l’émetteur honore ses engagements, vous recevez les coupons prévus puis le capital nominal. Avant l’échéance, le titre peut se négocier à un prix différent de cette valeur nominale.',
      ],
    },
    {
      heading: 'Lier le prix de marché aux taux d’intérêt',
      paragraphs: [
        'Le rendement d’une obligation vient des intérêts versés et, si vous vendez avant l’échéance (ou si vous avez acheté hors pair), de l’écart entre le prix payé et le prix de revente ou la valeur nominale à l’échéance.',
        'Quand les taux d’intérêt du marché montent, une obligation déjà émise avec un coupon plus bas devient moins attrayante : son prix de marché tend à baisser. Quand les taux baissent, le même coupon devient plus intéressant et le prix tend à monter.',
        'Plus l’échéance est lointaine ou le coupon bas, plus le prix est en général sensible aux mouvements de taux. Si vous conservez jusqu’à l’échéance, les fluctuations de prix entre-temps n’annulent pas le remboursement nominal prévu — sous réserve du risque de crédit.',
      ],
    },
    {
      heading: 'Séparer risque de crédit et risque de taux',
      paragraphs: [
        'Le risque de crédit (ou de défaut) est la possibilité que l’émetteur ne verse plus les coupons ou ne rembourse plus le capital. Les obligations gouvernementales canadiennes sont souvent perçues comme à faible risque de crédit ; les obligations corporatives varient selon la solidité financière de l’émetteur.',
        'Le risque de taux, lui, touche surtout si vous devez vendre avant l’échéance : une hausse des taux peut faire baisser le prix de revente. Conserver jusqu’à l’échéance réduit cet effet de marché, mais ne protège pas contre un défaut de l’émetteur.',
        'Une cote de crédit publiée par une agence n’est qu’une opinion sur la capacité de payer ; elle peut changer. Un coupon plus élevé compense souvent un risque de crédit plus élevé — sans le faire disparaître.',
      ],
    },
    {
      heading: 'Comparer brièvement obligation et CPG',
      paragraphs: [
        'Avec un CPG, vous prêtez surtout à une institution financière : le taux est souvent fixe jusqu’à l’échéance, et la plupart des CPG doivent être conservés jusqu’à cette date (sauf versions rachetables, parfois avec pénalité).',
        'Une obligation négociable peut se vendre avant l’échéance au prix de marché — d’où le risque de taux. Un CPG admissible auprès d’une institution de dépôts autorisée peut être couvert par le régime de protection des dépôts ; une obligation, elle, n’est en principe pas un dépôt protégé.',
        'Les deux servent souvent de « revenu fixe », mais liquidité, garantie et sensibilité au marché ne sont pas les mêmes. Le choix dépend de l’horizon, du besoin de liquidité et de la tolérance aux fluctuations — pas d’une règle unique.',
      ],
    },
    {
      heading: 'Accéder via fonds d’obligations et FNB',
      paragraphs: [
        'Beaucoup d’épargnants n’achètent pas une obligation individuelle : ils passent par un fonds d’obligations (fonds commun) ou un FNB obligataire. Ces véhicules détiennent un panier de titres de dette et versent ou capitalisent des revenus selon leur politique.',
        'Un FNB se négocie en bourse comme une action ; un fonds commun s’achète et se rachète généralement via le réseau de distribution, à la valeur liquidative. Dans les deux cas, la valeur des parts peut baisser si les taux montent ou si la qualité de crédit du portefeuille se dégrade.',
        'Lisez l’aperçu du fonds : objectifs, composition (gouvernements vs corporatif, durée), frais et risques. Ce texte est général et ne constitue pas un conseil personnalisé.',
      ],
      bullets: [
        'Identifiez émetteur, coupon et échéance avant d’acheter.',
        'Anticipez le prix de marché si une vente anticipée est possible.',
        'Comparez liquidité et protection dépôt entre obligation et CPG.',
        'Dans un fonds ou FNB, regardez durée, crédit et frais.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Alex et l’obligation à 4 %',
    intro:
      'Illustration pédagogique du lien prix–taux. Alex achète une obligation de valeur nominale 10 000 $, coupon 4 %, échéance dans 5 ans, au pair (10 000 $). Les montants de prix après hausse des taux sont illustratifs, pas une cotation réelle.',
    steps: [
      {
        label: 'Achat au pair',
        detail:
          'Alex paie 10 000 $. Coupon annuel : 4 % × 10 000 $ = 400 $ (souvent versé en deux fois). À l’échéance, l’émetteur doit rembourser 10 000 $ si tout se déroule comme prévu.',
      },
      {
        label: 'Hausse des taux de marché',
        detail:
          'Deux ans plus tard, les taux pour des titres comparables ont monté. Le coupon de 4 % est moins attrayant : la valeur marchande estimée de son titre baisse à environ 9 200 $.',
      },
      {
        label: 'Vente anticipée vs conservation',
        detail:
          'S’il vend maintenant : environ 9 200 $, soit une perte de capital d’environ 800 $ (hors coupons déjà reçus). S’il conserve jusqu’à l’échéance : il vise le remboursement de 10 000 $ plus les coupons restants — sous réserve du risque de crédit.',
      },
      {
        label: 'Lecture du rendement',
        detail:
          'Sur 5 ans, les coupons totaux prévus au pair seraient 2 000 $ (5 × 400 $). La vente anticipée change le résultat : le prix de marché, pas seulement le coupon, compte dès qu’on sort avant l’échéance.',
      },
    ],
    result:
      'Alex voit que taux ↑ et prix ↓ vont souvent de pair avant l’échéance. Conserver jusqu’à l’échéance évite de cristalliser la baisse de prix, sans éliminer le risque que l’émetteur ne paie pas. Ce n’est pas un conseil d’achat.',
  },
  takeaways: [
    'Une obligation = prêt à un émetteur, avec coupon et échéance.',
    'En général, si les taux montent, le prix de marché baisse.',
    'Risque de crédit (émetteur) et risque de taux (vente anticipée) sont distincts.',
    'Fonds et FNB obligataires donnent un accès diversifié, avec frais et fluctuations.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'obligations-q1',
        prompt:
          'Dans l’exemple, Alex a une obligation à coupon 4 % achetée 10 000 $. Les taux de marché montent et la valeur marchande passe à environ 9 200 $. Que se passe-t-il s’il vend immédiatement?',
        choices: [
          'Il encaisse 10 000 $ comme à l’échéance',
          'Il encaisse environ 9 200 $, soit une perte de capital d’environ 800 $',
          'Le coupon passe automatiquement à 5 %',
        ],
        correctIndex: 1,
        explanation:
          'Avant l’échéance, la vente se fait au prix de marché. Avec la hausse des taux, ce prix a baissé à environ 9 200 $ dans l’exemple — d’où une perte de capital d’environ 800 $ hors coupons déjà reçus.',
      },
      {
        id: 'obligations-q2',
        prompt:
          'En règle générale, que se passe-t-il pour le prix d’une obligation déjà émise lorsque les taux d’intérêt du marché montent?',
        choices: [
          'Le prix tend à augmenter',
          'Le prix tend à baisser',
          'Le prix est figé par la protection des dépôts',
        ],
        correctIndex: 1,
        explanation:
          'Quand les taux montent, un coupon déjà fixé devient moins attrayant : le prix de marché de l’obligation tend à baisser. La protection des dépôts ne s’applique pas aux obligations comme à un CPG admissible.',
      },
      {
        id: 'obligations-q3',
        prompt:
          'Quelle différence courte est la plus juste entre une obligation négociable et un CPG typique?',
        choices: [
          'Les deux sont toujours couverts par la protection des dépôts de l’AMF',
          'L’obligation peut se vendre au prix de marché avant l’échéance ; le CPG est souvent à conserver jusqu’à l’échéance et peut être un dépôt protégé',
          'Le CPG n’a jamais de taux fixe, contrairement à l’obligation',
        ],
        correctIndex: 1,
        explanation:
          'Une obligation négociable a un prix de marché avant l’échéance. Un CPG typique se conserve jusqu’à l’échéance et, s’il est admissible auprès d’une institution de dépôts autorisée, peut être couvert par le régime de protection des dépôts — pas l’obligation.',
      },
    ],
  },
  diagram: {
    title: 'Parcours d’une obligation',
    type: 'flow',
    nodes: [
      { id: 'issuer', label: 'Émetteur', hint: 'Gouvernement ou entreprise' },
      { id: 'bond', label: 'Obligation', hint: 'Coupon + échéance', emphasis: true },
      { id: 'hold', label: 'Détention', hint: 'Coupons périodiques' },
      { id: 'end', label: 'Échéance ou vente', hint: 'Nominal ou prix marché' },
    ],
    edges: [
      { from: 'issuer', to: 'bond', label: 'Émet' },
      { from: 'bond', to: 'hold', label: 'Vous achetez' },
      { from: 'hold', to: 'end', label: 'Attendre ou vendre' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Alex — prix vs taux',
    type: 'flow',
    nodes: [
      {
        id: 'buy',
        label: 'Achat : 10 000 $',
        hint: 'Coupon 4 % · 400 $/an',
        emphasis: true,
      },
      {
        id: 'rates',
        label: 'Taux de marché ↑',
        hint: 'Coupon 4 % moins attrayant',
      },
      {
        id: 'mark',
        label: 'Prix ≈ 9 200 $',
        hint: 'Si vente anticipée',
      },
      {
        id: 'hold',
        label: 'Échéance : 10 000 $',
        hint: 'Si conservation + solvabilité',
      },
    ],
    edges: [
      { from: 'buy', to: 'rates', label: 'An 2' },
      { from: 'rates', to: 'mark', label: 'Vendre' },
      { from: 'rates', to: 'hold', label: 'Conserver' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Alex, 5 ans',
    caption:
      'Les coupons continuent tant que l’émetteur paie. Le prix de marché peut baisser si les taux montent ; à l’échéance, le remboursement vise la valeur nominale.',
    events: [
      {
        at: 'Achat',
        title: 'Achat au pair',
        amount: '10 000 $',
        note: 'Coupon 4 % · 400 $/an',
        emphasis: true,
      },
      {
        at: 'An 1',
        title: 'Coupons reçus',
        amount: '400 $',
        note: 'Prix de marché encore proche du pair',
      },
      {
        at: 'An 2',
        title: 'Hausse des taux',
        amount: '≈ 9 200 $',
        note: 'Valeur marchande illustrée si vente',
        emphasis: true,
      },
      {
        at: 'Ans 3–4',
        title: 'Coupons poursuivis',
        amount: '400 $/an',
        note: 'Si conservation : coupons + attente du nominal',
      },
      {
        at: 'Échéance',
        title: 'Remboursement nominal',
        amount: '10 000 $',
        note: 'Sous réserve que l’émetteur paie',
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'marche', name: 'Valeur de marché (illust.)' },
        { key: 'nominal', name: 'Valeur nominale' },
      ],
      points: [
        { at: 'Achat', marche: 10000, nominal: 10000 },
        { at: 'An 1', marche: 9800, nominal: 10000 },
        { at: 'An 2', marche: 9200, nominal: 10000 },
        { at: 'An 3', marche: 9400, nominal: 10000 },
        { at: 'An 4', marche: 9700, nominal: 10000 },
        { at: 'Échéance', marche: 10000, nominal: 10000 },
      ],
    },
  },
  sources: [
    {
      name: 'AMF — Titres d’emprunt (obligations, CPG)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/titres-demprunt',
    },
    {
      name: 'AMF — Glossaire financier (obligation, revenu fixe)',
      url: 'https://lautorite.qc.ca/grand-public/glossaire-financier',
    },
    {
      name: 'AMF — Entreprises et personnes au service des investisseurs',
      url: 'https://lautorite.qc.ca/grand-public/investissements/conseils-cles-avant-dinvestir/entreprises-et-personnes-au-service-des-investisseurs',
    },
    {
      name: 'AMF — Fonds d’investissement',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds',
    },
    {
      name: 'AMF — Fonds négociés en bourse (FNB)',
      url: 'https://lautorite.qc.ca/grand-public/investissements/fonds/fonds-negocies-en-bourse-fnb',
    },
    {
      name: 'AMF — Protection des dépôts',
      url: 'https://lautorite.qc.ca/grand-public/indemnisation-et-protection-des-depots/protection-des-depots',
    },
    {
      name: 'GetSmarterAboutMoney — How bonds work (OSC)',
      url: 'https://www.getsmarteraboutmoney.ca/learning-path/bonds/how-bonds-work/',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin.',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['actions-dividendes', 'cpg-pglm', 'fonds-communs', 'fnb'],
  seoTitle: 'Obligations et revenu fixe : coupon, prix et risques | Apprendre',
  seoDescription:
    'Mini-formation sur les obligations : émetteur, coupon, échéance, prix vs taux, risques de crédit et de taux, comparaison avec le CPG, fonds et FNB obligataires.',
};
