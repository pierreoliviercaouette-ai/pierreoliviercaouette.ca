/**
 * Mini-formation CELIAPP — niveau base.
 * Sources : ARC (plafonds annuels / à vie non indexés : 8 000 $ / 40 000 $).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'celiapp',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Le CELIAPP',
  subtitle: 'Compte d’épargne libre d’impôt pour l’achat d’une première propriété',
  shortDescription:
    'Admissibilité, plafonds de cotisation, retrait libre d’impôt pour l’achat, fermeture du compte, et différences simples avec le RAP et le CELI.',
  readMinutes: 14,
  keyFacts: [
    { label: 'Plafond annuel', value: '8 000 $ (2025 et 2026, ARC)' },
    { label: 'Plafond à vie', value: '40 000 $ de cotisations' },
    { label: 'Retrait admissible', value: 'Libre d’impôt ; pas de remboursement' },
  ],
  sections: [
    {
      heading: 'Qui peut ouvrir un CELIAPP',
      paragraphs: [
        'Le compte d’épargne libre d’impôt pour l’achat d’une première propriété (CELIAPP) sert à épargner pour acheter ou faire construire une habitation admissible au Canada. Les cotisations sont en général déductibles, comme un REER. La croissance reste à l’abri de l’impôt, et un retrait admissible pour l’achat est libre d’impôt.',
        'Pour ouvrir un compte, il faut être résident du Canada, avoir un NAS valide, avoir au moins 18 ans, et être acheteur d’une première habitation. En pratique : vous n’avez pas habité, l’année d’ouverture ni les quatre années civiles précédentes, une habitation dont vous (ou votre conjoint) étiez propriétaire.',
        'Les droits de cotisation démarrent l’année où vous ouvrez votre premier CELIAPP — pas automatiquement à 18 ans. Vous pouvez avoir plusieurs comptes, mais les plafonds s’appliquent au total. Il n’existe pas de CELIAPP « de conjoint ».',
      ],
    },
    {
      heading: 'Comprendre plafonds, report et surplus',
      paragraphs: [
        'Deux plafonds s’appliquent en 2025 comme en 2026 (non indexés) : 8 000 $ de cotisations par année civile, et 40 000 $ à vie. Vérifiez les pages CELIAPP avant de cotiser : les règles administratives peuvent évoluer.',
        'Les droits inutilisés se reportent seulement après l’ouverture du compte, au maximum de 8 000 $ d’une année à l’autre. Dans une année donnée, le plafond effectif peut donc atteindre 16 000 $ (8 000 $ + report max.), sans jamais dépasser 40 000 $ à vie.',
        'Les cotisations en argent sont généralement déductibles. Un transfert direct REER → CELIAPP compte dans les plafonds CELIAPP, sans seconde déduction. Un surplus entraîne 1 % d’impôt par mois sur l’excédent : retirez-le dès que possible.',
      ],
    },
    {
      heading: 'Retirer pour l’achat, puis fermer',
      paragraphs: [
        'Un retrait admissible pour l’achat ou la construction d’une habitation au Canada est libre d’impôt, croissance incluse. Contrairement au régime d’accession à la propriété (RAP) du REER, vous n’avez pas à le rembourser. Il n’y a pas de plafond de retrait si les conditions sont remplies.',
        'Conditions typiques : rester acheteur d’une première habitation ; avoir une entente écrite d’achat ou de construction avant le 1er octobre de l’année suivant le retrait ; avoir l’intention d’occuper l’habitation comme résidence principale dans l’année. Vous ne devez pas y avoir emménagé plus de 30 jours avant le retrait.',
        'Après un premier retrait admissible, fermez tous vos CELIAPP au plus tard le 31 décembre de l’année suivante. Sans achat, la participation se termine au plus tôt à 71 ans ou au 15e anniversaire du premier compte. Vous pouvez souvent transférer le solde vers un REER ou un FERR sans utiliser vos droits REER.',
      ],
    },
    {
      heading: 'Choisir entre CELIAPP, RAP et CELI',
      paragraphs: [
        'Le RAP permet de retirer du REER (jusqu’à la limite en vigueur — vérifiez le montant courant) pour une première habitation, sans impôt immédiat, à condition de rembourser selon un calendrier. Le CELIAPP offre une déduction à l’entrée et un retrait admissible sans remboursement. Les deux peuvent se combiner pour le même achat.',
        'Le CELI ordinaire n’exige pas d’être acheteur d’une première propriété et n’offre pas de déduction, mais permet des retraits libres d’impôt pour n’importe quel projet. Le CELIAPP est plus puissant pour une mise de fonds si vous êtes admissible ; le CELI reste souvent préférable pour la flexibilité ou un fonds d’urgence.',
        'Pensez au CELIAPP si une première propriété au Canada est réaliste dans les prochaines années et si une déduction vous aide aujourd’hui. Sinon, maximisez plutôt le CELI ou le REER hors RAP. Ce texte est général et ne constitue pas un conseil personnalisé.',
      ],
      bullets: [
        'Ouvrez un CELIAPP seulement si vous êtes acheteur d’une première habitation.',
        'Les droits de cotisation commencent à l’ouverture du premier compte.',
        'Retrait admissible : libre d’impôt, sans remboursement — contrairement au RAP.',
        'Après le premier retrait admissible, fermez le compte au plus tard le 31 décembre de l’année suivante.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Léa (2025–2027)',
    intro:
      'Illustration pédagogique des plafonds (8 000 $ / année, 40 000 $ à vie) et d’un retrait admissible. Chiffres fictifs de rendement ; ce n’est pas un conseil personnalisé.',
    steps: [
      {
        label: 'Ouverture et cotisation 2025',
        detail:
          'Léa, acheteuse d’une première habitation, ouvre un CELIAPP en janvier 2025 et cotise 8 000 $. Elle déduit ce montant dans sa déclaration 2025.',
      },
      {
        label: 'Cotisation 2026 et croissance',
        detail:
          'En 2026, elle cotise encore 8 000 $ (cumul cotisé : 16 000 $). Ses placements génèrent environ 1 200 $ : solde ≈ 17 200 $. La croissance n’utilise aucun droit.',
      },
      {
        label: 'Retrait admissible',
        detail:
          'En mars 2027, elle signe une promesse d’achat et retire 17 200 $ pour sa mise de fonds. Aucun impôt, aucun remboursement exigé.',
      },
      {
        label: 'Fermeture',
        detail:
          'Après ce premier retrait admissible, elle doit fermer son CELIAPP au plus tard le 31 décembre 2028.',
      },
    ],
    result:
      'Léa a déduit 16 000 $ sur deux ans, retiré ~17 200 $ libres d’impôt pour l’achat, et évite le calendrier de remboursement du RAP — si les critères d’admissibilité sont respectés au retrait.',
  },
  takeaways: [
    'Cotisations déductibles : 8 000 $ par an, 40 000 $ à vie.',
    'Les droits commencent à l’ouverture ; report max. de 8 000 $ d’une année à l’autre.',
    'Un retrait admissible est libre d’impôt et sans remboursement.',
    'Après ce retrait, fermez le compte au plus tard le 31 décembre de l’année suivante.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'celiapp-q1',
        prompt:
          'Dans l’exemple, Léa retire environ 17 200 $ en retrait admissible. Doit-elle rembourser ce montant dans son CELIAPP?',
        choices: [
          'Oui, sur 15 ans comme pour un REER',
          'Non : un retrait admissible n’a pas à être remboursé',
          'Oui, mais seulement la croissance de 1 200 $',
        ],
        correctIndex: 1,
        explanation:
          'Contrairement au RAP (REER), un retrait admissible du CELIAPP pour l’achat d’une première propriété n’a pas à être remboursé.',
      },
      {
        id: 'celiapp-q2',
        prompt:
          'Quand vos droits de cotisation CELIAPP commencent-ils à s’accumuler?',
        choices: [
          'Automatiquement dès vos 18 ans, même sans compte',
          'L’année où vous ouvrez votre premier CELIAPP',
          'Seulement l’année où vous achetez une propriété',
        ],
        correctIndex: 1,
        explanation:
          'Contrairement au CELI, les droits CELIAPP démarrent l’année d’ouverture du premier compte, pas automatiquement à 18 ans.',
      },
      {
        id: 'celiapp-q3',
        prompt:
          'Quelle différence principale distingue le CELIAPP du CELI ordinaire pour un acheteur admissible?',
        choices: [
          'Le CELIAPP offre en général une déduction à la cotisation et un retrait libre d’impôt ciblé sur la première propriété',
          'Le CELI ordinaire est toujours déductible, pas le CELIAPP',
          'Le CELIAPP n’a aucune date limite de participation',
        ],
        correctIndex: 0,
        explanation:
          'Le CELIAPP combine souvent déduction (comme un REER) et retrait admissible libre d’impôt pour une première habitation, avec une période de participation limitée ; le CELI est plus flexible mais non déductible.',
      },
    ],
  },
  diagram: {
    title: 'Parcours de l’argent — CELIAPP',
    type: 'flow',
    nodes: [
      {
        id: 'open',
        label: 'Ouverture',
        hint: 'Acheteur d’une 1re habitation',
      },
      {
        id: 'contrib',
        label: 'Cotisations',
        hint: 'Déductibles · plafonds',
      },
      {
        id: 'grow',
        label: 'CELIAPP',
        hint: 'Croissance à l’abri de l’impôt',
        emphasis: true,
      },
      {
        id: 'out',
        label: 'Retrait admissible',
        hint: 'Libre d’impôt · sans remboursement',
      },
    ],
    edges: [
      { from: 'open', to: 'contrib', label: 'Droits débutent' },
      { from: 'contrib', to: 'grow', label: 'Placer' },
      { from: 'grow', to: 'out', label: 'Achat' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Léa — 2025 à 2027',
    type: 'flow',
    nodes: [
      {
        id: 'y25',
        label: '2025 : +8 000 $',
        hint: 'Déduction · ouverture',
      },
      {
        id: 'y26',
        label: '2026 : +8 000 $',
        hint: 'Cumul cotisé 16 000 $',
        emphasis: true,
      },
      {
        id: 'bal',
        label: 'Solde ≈ 17 200 $',
        hint: 'Dont ~1 200 $ de croissance',
      },
      {
        id: 'buy',
        label: 'Retrait 17 200 $',
        hint: 'Mars 2027 · mise de fonds',
      },
      {
        id: 'close',
        label: 'Fermeture ≤ déc. 2028',
        hint: 'Après 1er retrait admissible',
      },
    ],
    edges: [
      { from: 'y25', to: 'y26', label: 'Année suivante' },
      { from: 'y26', to: 'bal', label: 'Croissance' },
      { from: 'bal', to: 'buy', label: 'Promesse d’achat' },
      { from: 'buy', to: 'close', label: 'Délai légal' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Léa 2025–2028',
    caption:
      'Les cotisations consomment le plafond ; la croissance augmente le solde sans consommer de droits. Le retrait admissible vide le compte sans remboursement, puis une date limite de fermeture s’applique.',
    events: [
      {
        at: 'Janv. 2025',
        title: 'Ouverture + cotisation',
        amount: '8 000 $',
        note: 'Droits de l’année utilisés · déduction possible',
        emphasis: true,
      },
      {
        at: '2026',
        title: '2e cotisation',
        amount: '8 000 $',
        note: 'Cumul cotisé 16 000 $ · solde ≈ 17 200 $',
      },
      {
        at: 'Mars 2027',
        title: 'Retrait admissible',
        amount: '−17 200 $',
        note: 'Libre d’impôt · pas de remboursement',
        emphasis: true,
      },
      {
        at: '≤ 31 déc. 2028',
        title: 'Fermeture du compte',
        note: 'Au plus tard l’année suivant le 1er retrait admissible',
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'cotise', name: 'Cumul cotisé' },
        { key: 'solde', name: 'Solde CELIAPP' },
      ],
      points: [
        { at: 'Ouverture', cotise: 0, solde: 0 },
        { at: 'Fin 2025', cotise: 8000, solde: 8000 },
        { at: 'Fin 2026', cotise: 16000, solde: 17200 },
        { at: 'Retrait', cotise: 16000, solde: 0 },
        { at: 'Fermeture', cotise: 16000, solde: 0 },
      ],
    },
  },
  sources: [
    {
      name: 'ARC — Compte d’épargne libre d’impôt pour l’achat d’une première propriété (CELIAPP)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot-achat-premiere-propriete.html',
    },
    {
      name: 'ARC — Ouvrir vos CELIAPP (admissibilité)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot-achat-premiere-propriete/ouvrir-celiapp.html',
    },
    {
      name: 'ARC — Participer à vos CELIAPP (plafonds et report)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot-achat-premiere-propriete/participer-celiapp.html',
    },
    {
      name: 'ARC — Retraits et transferts de vos CELIAPP',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot-achat-premiere-propriete/retraits-transferts-celiapp.html',
    },
    {
      name: 'ARC — Fermer vos CELIAPP',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot-achat-premiere-propriete/fermer-celiapp.html',
    },
    {
      name: 'ARC — Régime d’accession à la propriété (RAP)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/reers-regimes-connexes/regime-accession-propriete.html',
    },
    {
      name: 'AMF — CELIAPP',
      url: 'https://lautorite.qc.ca/grand-public/investissements/regimes-depargne/celiapp-compte-depargne-libre-dimpot-pour-lachat-dune-premiere-propriete',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['celi', 'reer-ferr'],
  seoTitle: 'CELIAPP : plafonds, retrait et RAP | Apprendre',
  seoDescription:
    'Mini-formation sur le CELIAPP : admissibilité, plafonds 8 000 $ / 40 000 $, retrait admissible, fermeture, et différences avec le RAP et le CELI.',
};
