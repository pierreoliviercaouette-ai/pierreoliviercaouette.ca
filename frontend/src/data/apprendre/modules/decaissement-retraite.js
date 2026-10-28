/**
 * Mini-formation décaissement — niveau avancé (particulier / privé).
 * Contenu éducatif ; pas un conseil personnalisé.
 */
export const module = {
  id: 'decaissement-retraite',
  audiences: ['particulier', 'prive'],
  category: 'epargne',
  title: 'Décaissement à la retraite',
  subtitle: 'Dans quel ordre retirer CELI, REER et non enregistré',
  shortDescription:
    'Effet des retraits sur l’impôt et la SV, minimum FERR, et logique pour ordonner vos sources de revenu.',
  readMinutes: 14,
  keyFacts: [
    { label: 'CELI', value: 'Retrait sans hausser le revenu imposable' },
    { label: 'REER / FERR', value: 'Retrait imposable (+ min. FERR)' },
    { label: 'Enjeu', value: 'Impôt + récupération SV + liquidité' },
  ],
  sections: [
    {
      heading: 'Pourquoi l’ordre de retrait compte',
      paragraphs: [
        'À la retraite, vous transformez des épargnes en revenu mensuel. Chaque enveloppe n’a pas le même effet fiscal.',
        'Un dollar sorti du compte d’épargne libre d’impôt (CELI) n’augmente pas votre revenu imposable. Un dollar sorti du régime enregistré d’épargne-retraite (REER) ou du fonds enregistré de revenu de retraite (FERR), si.',
        'Ce revenu imposable influence votre taux d’imposition. Au-delà des seuils de récupération en vigueur (vérifiez pour l’année), il peut aussi faire récupérer une partie de la Sécurité de la vieillesse (SV). L’ordre de décaissement change donc le net dans votre poche — et parfois vos prestations.',
      ],
    },
    {
      heading: 'Comparer CELI, FERR et non enregistré',
      paragraphs: [
        'Le CELI est flexible : un retrait n’est pas imposable et n’augmente pas le revenu utilisé pour la SV. Utile pour combler un besoin sans faire monter la facture fiscale.',
        'Le REER se convertit souvent en FERR. Après l’année d’ouverture, un retrait minimum obligatoire s’applique chaque année, selon l’âge et la valeur au 1er janvier. Tout ce que vous sortez est imposable — minimum compris.',
        'Le compte non enregistré traite intérêts, dividendes et gains différemment. Vendre un placement peut créer un gain en capital : souvent moins « brut » qu’un retrait REER du même montant, mais avec plus de suivi.',
      ],
    },
    {
      heading: 'Quelle logique suivre sans règle unique',
      paragraphs: [
        'Beaucoup de plans commencent ainsi : couvrir les besoins avec la RRQ, la SV et le minimum FERR. Pour les projets, ils puisent ensuite au CELI ou au non enregistré, afin de ne pas faire exploser le revenu imposable.',
        'Des retraits REER ou FERR supplémentaires se planifient au cas par cas — par exemple lorsqu’une tranche d’imposition plus basse, un besoin de liquidité ou un lissage pluriannuel le justifie.',
        'Vider le REER trop vite peut créer une année d’impôt élevée et une récupération de SV inutile. Ne jamais y toucher laisse croître un solde qui imposera des minimums FERR plus lourds plus tard. L’équilibre dépend de votre situation.',
      ],
    },
    {
      heading: 'Quels pièges éviter',
      paragraphs: [
        'Oublier le minimum FERR dans le budget. Cumuler un gros retrait REER la même année qu’une vente immobilière imposable. Ignorer le conjoint — fractionnement de pension, âge du conjoint pour le facteur FERR.',
        'Traiter le CELI comme un dernier recours alors qu’il peut lisser le revenu. Un plan de décaissement se revoit quand les marchés, la santé ou les règles fiscales changent.',
      ],
      bullets: [
        'Cartographiez CELI, FERR et non enregistré avant de fixer un ordre.',
        'Intégrez le minimum FERR et l’effet des retraits sur la SV.',
        'Évitez de cumuler plusieurs revenus imposables la même année sans plan.',
        'Revoir l’ordre quand la situation ou les règles changent.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — besoin de 8 000 $ nets un mois donné',
    intro:
      'Illustration. Ignore les cotisations sociales et simplifie l’impôt. Taux marginal illustratif 30 % sur un retrait REER.',
    steps: [
      {
        label: 'Besoin',
        detail: 'Vous avez besoin de 8 000 $ pour un projet (rénovation).',
      },
      {
        label: 'Via REER',
        detail:
          'Pour netter ≈ 8 000 $ à 30 % d’impôt, il faudrait retirer ≈ 11 430 $ (8 000 / 0,70). Le revenu imposable grimpe d’autant.',
      },
      {
        label: 'Via CELI',
        detail: 'Retrait de 8 000 $ : aucun impôt additionnel, revenu inchangé pour la SV.',
      },
      {
        label: 'Lecture',
        detail:
          'Dans cet exemple, le CELI évite la facture d’impôt et la pression sur la SV pour ce besoin ponctuel. Ce n’est pas un ordre universel : le REER reste utile pour d’autres années ou le minimum FERR.',
      },
    ],
    result:
      'Même besoin 8 000 $ : ≈ 11 430 $ bruts du REER à 30 %, ou 8 000 $ nets du CELI sans hausser le revenu.',
  },
  timeline: {
    title: 'Comparaison chiffrée — même besoin net',
    caption: 'Coût en capital retiré selon l’enveloppe (taux marginal illustratif 30 %).',
    events: [
      { at: 'Besoin', title: 'Net désiré', amount: '8 000 $', emphasis: true },
      { at: 'REER', title: 'Retrait brut', amount: '≈ 11 430 $', note: 'Impôt ~30 %' },
      { at: 'CELI', title: 'Retrait', amount: '8 000 $', note: 'Sans impôt', emphasis: true },
      { at: 'Écart', title: 'Capital préservé', amount: '≈ 3 430 $', note: 'Si CELI disponible' },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'brut', name: 'Capital à retirer ($)' }],
      points: [
        { at: 'Via CELI', brut: 8000 },
        { at: 'Via REER', brut: 11430 },
      ],
    },
  },
  takeaways: [
    'CELI et REER/FERR n’ont pas le même effet sur l’impôt et la SV.',
    'Le FERR impose un minimum annuel imposable.',
    'L’ordre de retrait peut réduire la facture et protéger des prestations.',
    'Évitez les retraits REER massifs sans plan.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'dec-q1',
        prompt: 'Dans l’exemple (30 % d’impôt), pour obtenir 8 000 $ nets du REER il faut retirer environ…',
        choices: ['8 000 $', '11 430 $', '5 600 $'],
        correctIndex: 1,
        explanation: '8 000 / 0,70 ≈ 11 430 $.',
      },
      {
        id: 'dec-q2',
        prompt: 'Un retrait CELI…',
        choices: [
          'Augmente toujours le revenu pour la SV',
          'N’augmente pas le revenu imposable',
          'Est interdit après 71 ans',
        ],
        correctIndex: 1,
        explanation: 'Le CELI ne s’ajoute pas au revenu imposable.',
      },
      {
        id: 'dec-q3',
        prompt: 'Le minimum FERR…',
        choices: [
          'Est optionnel si vous avez un CELI',
          'Doit être retiré chaque année et est imposable',
          'N’existe qu’avant 65 ans',
        ],
        correctIndex: 1,
        explanation: 'Après l’année d’ouverture, un minimum annuel imposable s’applique.',
      },
    ],
  },
  diagram: {
    title: 'Effet d’un retrait',
    type: 'fork',
    source: { id: 'besoin', label: 'Besoin de liquidités', hint: 'Projet ou niveau de vie' },
    branches: [
      { id: 'celi', label: 'CELI', hint: 'Revenu imposable inchangé', edgeLabel: 'Souple' },
      { id: 'ferr', label: 'REER / FERR', hint: 'Imposable ± min. FERR', edgeLabel: 'Surveille SV' },
      { id: 'non', label: 'Non enregistré', hint: 'Selon type de revenu', edgeLabel: 'Cas par cas' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — 8 000 $ nets',
    type: 'flow',
    nodes: [
      { id: 'n', label: 'Besoin 8 000 $', emphasis: true },
      { id: 'c', label: 'CELI 8 000 $', hint: 'Sans impôt' },
      { id: 'r', label: 'REER ≈ 11 430 $', hint: 'À 30 %' },
    ],
    edges: [
      { from: 'n', to: 'c' },
      { from: 'n', to: 'r' },
    ],
  },
  sources: [
    {
      name: 'ARC — FERR',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/fonds-enregistre-revenu-retraite-ferr.html',
    },
    {
      name: 'Service Canada — Récupération de la SV',
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/recuperation-impot.html',
    },
  ],
  relatedServiceIds: ['planification', 'epargne'],
  relatedFormationIds: ['reer-ferr', 'celi', 'retraite-publique'],
  seoTitle: 'Décaissement à la retraite | Apprendre',
  seoDescription:
    'Ordre de retrait CELI, REER/FERR et non enregistré : impôt, minimum FERR et SV.',
};
