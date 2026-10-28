/**
 * Mini-formation bases successorales — niveau intermédiaire.
 * Contenu éducatif ; pas un avis notarial, fiscal ou personnalisé.
 */
export const module = {
  id: 'succession-bases',
  audiences: ['particulier', 'prive'],
  category: 'assurance',
  title: 'Bases de la succession',
  subtitle: 'Liquidité, bénéficiaires et testament',
  shortDescription:
    'Pourquoi la liquidité au décès compte, rôle des bénéficiaires et de l’assurance vie, et limites d’un texte éducatif face au notaire.',
  readMinutes: 12,
  keyFacts: [
    { label: 'Enjeu', value: 'Liquidités vs actifs peu vendables' },
    { label: 'Outils', value: 'Testament, bénéficiaires, assurance vie' },
    { label: 'Limite', value: 'Pas un avis notarial ou fiscal' },
  ],
  sections: [
    {
      heading: 'Que se passe-t-il concrètement au décès?',
      paragraphs: [
        'Au Québec, la succession règle les dettes, les impôts et le transfert des biens. Elle suit le testament ou, à défaut, le Code civil. Même avec un texte clair, il faut souvent de l’argent rapidement : frais funéraires, impôts latents, dettes, maintien d’un logement.',
        'La liquidité, c’est l’argent disponible sans vendre à la hâte. Une maison, un chalet ou des parts d’entreprise peuvent valoir cher sans être liquides. Sans cash, la succession peut devoir vendre au mauvais moment ou emprunter.',
      ],
    },
    {
      heading: 'Pourquoi revoir les désignations de bénéficiaire?',
      paragraphs: [
        'Sur une assurance vie, un REER ou un FERR, vous pouvez nommer un bénéficiaire — la personne qui reçoit le capital ou le produit. En général, ce versement peut se faire hors de la succession, souvent plus rapidement, selon les règles applicables. Attention : contrairement à l’assurance vie (souvent libre d’impôt pour le bénéficiaire), la valeur d’un REER ou d’un FERR est en général imposable au décès du rentier — sauf roulement admissible (ex. conjoint).',
        'Une désignation mal alignée avec le testament crée des frictions : un ex-conjoint encore nommé, un enfant oublié, ou un partage différent de celui prévu ailleurs. Le contrat et le testament ne se « corrigent » pas l’un l’autre automatiquement.',
        'Revoyez ces désignations après un mariage, une séparation, une naissance ou un changement majeur de patrimoine. C’est un geste simple qui évite bien des surprises.',
      ],
    },
    {
      heading: 'Quel rôle joue l’assurance vie?',
      paragraphs: [
        'L’assurance vie peut fournir un capital, en général libre d’impôt pour le bénéficiaire. Ce capital sert souvent à payer des impôts au décès, éteindre une hypothèque, égaliser des héritages — un enfant reçoit l’entreprise, l’autre l’assurance — ou simplement laisser une liquidité familiale.',
        'Elle ne remplace pas le testament : elle comble un besoin d’argent au bon moment. Le montant dépend de vos dettes, de vos actifs peu liquides et de vos objectifs familiaux — pas d’une règle unique.',
        'Sans analyse de besoins, on sous-estime souvent le trou (dettes + frais + coussin) ou on ignore ce qui est déjà liquide (CELI, comptes, autres polices).',
      ],
    },
    {
      heading: 'Quand faire appel à un notaire?',
      paragraphs: [
        'Un testament notarié clarifie qui reçoit quoi et qui liquide la succession. Sans testament, la loi décide — ce qui surprend souvent les conjoints de fait ou les familles recomposées.',
        'Cette capsule ne remplace pas un notaire, un fiscaliste ou une analyse de besoins d’assurance. Elle sert à poser les bonnes questions avant ces rendez-vous.',
      ],
      bullets: [
        'Estimez les besoins de liquidité au décès : dettes, impôts latents, frais et coussin familial.',
        'Alignez testament et désignations de bénéficiaire après chaque changement de vie.',
        'Évaluez si l’assurance vie comble l’écart — et formalisez les cas complexes chez le notaire.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — liquidité manquante',
    intro: 'Patrimoine illustratif. Pas une évaluation successorale.',
    steps: [
      {
        label: 'Actifs',
        detail: 'Maison 450 000 $ (peu liquide à court terme) + CELI 40 000 $ + compte 15 000 $.',
      },
      {
        label: 'Besoins au décès',
        detail:
          'Hypothèque 180 000 $ + funérailles et frais estimés 35 000 $ + coussin familial 25 000 $ → 240 000 $.',
      },
      {
        label: 'Liquidités dispo',
        detail: 'CELI + compte = 55 000 $ (hors résidence).',
      },
      {
        label: 'Écart',
        detail:
          '240 000 $ − 55 000 $ = 185 000 $. Une assurance vie peut viser cet ordre de grandeur — analyse réelle requise.',
      },
    ],
    result:
      'Besoins 240 000 $ − liquidités 55 000 $ ≈ 185 000 $ de trou de liquidité illustratif.',
  },
  timeline: {
    title: 'Ligne du temps — besoin de liquidité',
    caption: 'Du patrimoine total au trou à financer.',
    events: [
      { at: 'Actifs', title: 'Maison + épargne', amount: '505 000 $', note: 'Dont maison 450 k$' },
      { at: 'Besoins', title: 'Dettes + frais + coussin', amount: '240 000 $', emphasis: true },
      { at: 'Liquidités', title: 'CELI + compte', amount: '55 000 $' },
      { at: 'Écart', title: 'Trou illustratif', amount: '185 000 $', emphasis: true },
    ],
    chart: {
      type: 'bar',
      series: [{ key: 'montant', name: 'Montant ($)' }],
      points: [
        { at: 'Besoins', montant: 240000 },
        { at: 'Liquidités', montant: 55000 },
        { at: 'Trou', montant: 185000 },
      ],
    },
  },
  takeaways: [
    'La valeur du patrimoine n’égale pas les liquidités au décès.',
    'Testament et bénéficiaires doivent être alignés.',
    'L’assurance vie peut combler un trou de liquidité.',
    'Le notaire reste essentiel pour formaliser.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'suc-q1',
        prompt: 'Dans l’exemple, le trou de liquidité illustratif est d’environ…',
        choices: ['55 000 $', '185 000 $', '450 000 $'],
        correctIndex: 1,
        explanation: '240 000 − 55 000 = 185 000 $.',
      },
      {
        id: 'suc-q2',
        prompt: 'Une désignation de bénéficiaire sur une assurance vie sert surtout à…',
        choices: [
          'Éviter toute planification',
          'Verser un capital, souvent hors succession, selon les règles',
          'Remplacer le testament dans tous les cas',
        ],
        correctIndex: 1,
        explanation: 'Elle oriente le versement du capital ; elle ne remplace pas un testament complet.',
      },
      {
        id: 'suc-q3',
        prompt: 'Pourquoi une maison de grande valeur ne règle pas toujours les besoins au décès ?',
        choices: [
          'Parce qu’elle est toujours imposable à 100 %',
          'Parce qu’elle n’est pas liquide immédiatement',
          'Parce qu’elle ne fait jamais partie de la succession',
        ],
        correctIndex: 1,
        explanation: 'Il faut souvent du cash avant de pouvoir vendre ou refinancer.',
      },
    ],
  },
  diagram: {
    title: 'Aligner les pièces',
    type: 'flow',
    nodes: [
      { id: 'b', label: 'Besoin de liquidité', hint: 'Dettes + impôts + frais' },
      { id: 't', label: 'Testament', hint: 'Qui reçoit quoi' },
      { id: 'd', label: 'Bénéficiaires', hint: 'Assurance / REER', emphasis: true },
      { id: 'a', label: 'Assurance vie', hint: 'Capital au décès' },
    ],
    edges: [
      { from: 'b', to: 'a', label: 'Combler' },
      { from: 't', to: 'd', label: 'Aligner' },
      { from: 'd', to: 'a' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple — écart 185 000 $',
    type: 'flow',
    nodes: [
      { id: 'bes', label: 'Besoins 240 000 $', emphasis: true },
      { id: 'liq', label: 'Liquidités 55 000 $' },
      { id: 'tr', label: 'Trou 185 000 $', emphasis: true },
    ],
    edges: [
      { from: 'bes', to: 'tr' },
      { from: 'liq', to: 'tr', label: 'Soustraire' },
    ],
  },
  sources: [
    {
      name: 'Éducaloi — Succession et testament',
      url: 'https://educaloi.qc.ca/capsules/la-succession/',
    },
    {
      name: 'AMF — Assurance vie',
      url: 'https://lautorite.qc.ca/grand-public/assurance/assurance-vie',
    },
  ],
  relatedServiceIds: ['assurance-vie', 'planification'],
  relatedFormationIds: ['assurance-vie-temporaire', 'assurance-vie-permanente'],
  seoTitle: 'Bases de la succession | Apprendre',
  seoDescription:
    'Liquidité au décès, bénéficiaires, testament et rôle de l’assurance vie — bases éducatives au Québec.',
};
