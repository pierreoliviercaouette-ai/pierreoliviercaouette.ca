/**
 * Mini-formation REEE — niveau base (Québec / Canada).
 * Sources : ARC, EDSC, Revenu Québec (SCEE, IQEE, PAE).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'reee',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Le REEE',
  subtitle: 'Épargne-études, subventions et retraits',
  shortDescription:
    'Souscripteur et bénéficiaire, cotisations, SCEE et IQEE, report de droits, PAE versus retraits de cotisations, et place du REEE face au CELI et au REER.',
  readMinutes: 12,
  keyFacts: [
    { label: 'SCEE (base)', value: '20 % des premiers 2 500 $ / an' },
    { label: 'IQEE (base)', value: '10 % des cotisations nettes, plafond annuel' },
    { label: 'Cotisations à vie', value: '50 000 $ par bénéficiaire (ARC)' },
  ],
  sections: [
    {
      heading: 'À quoi sert un REEE ?',
      paragraphs: [
        'Le régime enregistré d’épargne-études (REEE) aide à financer des études postsecondaires admissibles. Vous cotisez avec de l’argent déjà imposé : la cotisation ne réduit pas votre revenu. Les revenus de placement ne sont pas imposés tant qu’ils restent dans le régime.',
        'Le souscripteur ouvre le compte et cotise (souvent un parent ou un grand-parent). Le bénéficiaire est l’enfant pour qui l’épargne est destinée. Les plafonds de cotisations et de subventions s’appliquent à tous les REEE au nom du même enfant.',
        'Régime individuel (un bénéficiaire) ou familial (souvent frères et sœurs) : le REEE est le cadre fiscal. Les placements — fonds, certificats de placement garanti (CPG), etc. — se choisissent selon l’horizon jusqu’aux études.',
      ],
    },
    {
      heading: 'Comment obtenir SCEE et IQEE',
      paragraphs: [
        'Depuis 2007, il n’y a plus de plafond annuel de cotisation. Le plafond à vie reste de 50 000 $ par bénéficiaire (tous REEE confondus, hors subventions). Un excédent peut coûter 1 % par mois. Les subventions ont leurs propres plafonds.',
        'La Subvention canadienne pour l’épargne-études (SCEE) de base ajoute 20 % sur les premiers 2 500 $ cotisés par année, soit jusqu’à 500 $. Plafond à vie (base + supplémentaire) : 7 200 $. Elle peut être versée jusqu’à la fin de l’année où le bénéficiaire a 17 ans, sous conditions.',
        'Au Québec, l’incitatif québécois à l’épargne-études (IQEE) ajoute en principe 10 % des cotisations nettes, jusqu’à 250 $ de base par année (plus, selon le revenu). Avec des droits reportés, jusqu’à 500 $ de base par année ; cumul à vie : 3 600 $.',
      ],
    },
    {
      heading: 'Peut-on rattraper des droits inutilisés ?',
      paragraphs: [
        'Même sans REEE ouvert, un enfant admissible accumule des droits à la SCEE de base (500 $ par année admissible). Ces droits se reportent : une cotisation jusqu’à 5 000 $ une année peut faire entrer jusqu’à 1 000 $ de SCEE de base — un an de rattrapage à la fois.',
        'L’IQEE suit une logique semblable : les droits non utilisés peuvent majorer le montant de base jusqu’à 500 $ par année. Ce sont les cotisations nettes (cotisations moins retraits de cotisations de la même année) qui comptent.',
        'Ordre utile : d’abord viser les cotisations qui maximisent les subventions de l’année (souvent autour de 2 500 $), puis décider si un rattrapage (jusqu’à environ 5 000 $) convient à vos liquidités.',
      ],
    },
    {
      heading: 'Retirer : PAE ou cotisations ?',
      paragraphs: [
        'Quand le bénéficiaire suit un programme admissible, le régime peut verser un paiement d’aide aux études (PAE) : subventions et revenus de placement. Ce montant est imposable pour l’étudiant. Le promoteur vérifie l’admissibilité.',
        'Vos cotisations personnelles peuvent en général vous revenir sans impôt. Hors PAE admissible, un retrait de cotisations force souvent le remboursement des subventions liées. Avec un PAE, vous pouvez aussi retirer des cotisations pour financer les études.',
        'Si les études n’ont pas lieu : remboursement des subventions, parfois transfert vers un REER (conditions strictes), ou revenus imposables avec pénalité. Cotiser assez tôt (avant 15–16 ans) préserve la SCEE aux 16–17 ans.',
      ],
    },
    {
      heading: 'Où placer le REEE face au CELI et au REER',
      paragraphs: [
        'Le REEE sert les études d’un enfant : pas de déduction à l’entrée, mais subventions et croissance à l’abri de l’impôt jusqu’au PAE. Le compte d’épargne libre d’impôt (CELI) reste votre enveloppe flexible. Le régime enregistré d’épargne-retraite (REER) vise surtout votre retraite.',
        'Logique fréquente : coussin d’urgence, puis cotisations qui captent SCEE et IQEE, puis arbitrer CELI et REER selon votre taux d’impôt et vos objectifs. Surcotiser hors subvention a encore un intérêt fiscal, mais chaque dollar a un coût d’opportunité. Texte général, pas un conseil personnalisé.',
      ],
      bullets: [
        'Priorisez les cotisations qui déclenchent SCEE et IQEE.',
        'PAE = subventions + revenus (imposables à l’étudiant).',
        'Cotisations = en principe remboursables sans impôt au souscripteur.',
        'CELI et REER restent vos enveloppes pour vos objectifs personnels.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Alexe ouvre un REEE pour Léa',
    intro:
      'Alexe cotise pour sa fille Léa. Illustration pédagogique des ordres de grandeur SCEE et IQEE de base (sans montant supplémentaire). Ce n’est pas un conseil personnalisé.',
    steps: [
      {
        label: 'Année 1 — cotisation ciblée',
        detail:
          'Alexe verse 2 500 $. SCEE de base : 500 $. IQEE de base : 250 $. Subventions : 750 $. Solde avant rendement : 3 250 $.',
      },
      {
        label: 'Années 2 et 3 — même rythme',
        detail:
          'Même cotisation de 2 500 $ chaque année. Sur trois ans : cotisations 7 500 $, SCEE 1 500 $, IQEE 750 $. Total subventions : 2 250 $.',
      },
      {
        label: 'Année 4 — rattrapage partiel',
        detail:
          'Droits SCEE reportés de 500 $. Alexe verse 5 000 $. SCEE jusqu’à 1 000 $ ; IQEE jusqu’à 500 $. Cotisation 5 000 $ + subventions jusqu’à 1 500 $.',
      },
      {
        label: 'Aux études — composition du retrait',
        detail:
          'Au cégep, un PAE de 4 000 $ (subventions + revenus) est imposable pour Léa. Alexe retire aussi 3 000 $ de cotisations sans impôt pour elle.',
      },
    ],
    result:
      'En cotisant d’abord 2 500 $/an, Alexe capture SCEE et IQEE de base ; le rattrapage à 5 000 $ utilise des droits reportés. Aux études, le PAE va à Léa ; les cotisations reviennent à Alexe sans impôt.',
  },
  timeline: {
    title: 'Ligne du temps — cotisations et subventions',
    caption:
      'Cotisations d’Alexe, SCEE et IQEE de base (sans montant supplémentaire). Rendements non modélisés.',
    events: [
      {
        at: 'Année 1',
        title: 'Cotisation 2 500 $',
        amount: '+750 $ subv.',
        note: 'SCEE 500 $ + IQEE 250 $',
        emphasis: true,
      },
      {
        at: 'Années 2–3',
        title: 'Même rythme 2 500 $',
        amount: '+750 $/an',
        note: 'Cumul cotis. 7 500 $ · subv. 2 250 $',
      },
      {
        at: 'Année 4',
        title: 'Rattrapage 5 000 $',
        amount: '+1 500 $ subv.',
        note: 'SCEE ≤ 1 000 $ + IQEE ≤ 500 $',
        emphasis: true,
      },
      {
        at: 'Études',
        title: 'PAE + cotisations',
        amount: '4 000 $ + 3 000 $',
        note: 'PAE à Léa · cotis. à Alexe',
      },
    ],
    chart: {
      type: 'bar',
      series: [
        { key: 'cotisations', name: 'Cotisations cumulées' },
        { key: 'subventions', name: 'Subventions cumulées' },
      ],
      points: [
        { at: 'An 1', cotisations: 2500, subventions: 750 },
        { at: 'An 2', cotisations: 5000, subventions: 1500 },
        { at: 'An 3', cotisations: 7500, subventions: 2250 },
        { at: 'An 4', cotisations: 12500, subventions: 3750 },
      ],
    },
  },
  takeaways: [
    'Pas de déduction à l’entrée ; SCEE et IQEE s’ajoutent aux cotisations admissibles.',
    'Plafond à vie : 50 000 $ de cotisations par bénéficiaire ; droits de subvention reportables.',
    'PAE imposable à l’étudiant ; cotisations en principe non imposables pour le souscripteur.',
    'REEE pour les études ; CELI et REER pour vos objectifs personnels.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'reee-q1',
        prompt:
          'Dans l’exemple, sur une cotisation de 2 500 $ (SCEE et IQEE de base seulement), combien de subventions entrent au total ?',
        choices: ['500 $', '750 $', '1 000 $'],
        correctIndex: 1,
        explanation:
          'SCEE de base 500 $ (20 % × 2 500 $) + IQEE de base 250 $ (10 % × 2 500 $) = 750 $.',
      },
      {
        id: 'reee-q2',
        prompt: 'Qu’est-ce qu’un paiement d’aide aux études (PAE) ?',
        choices: [
          'Le remboursement libre d’impôt de vos cotisations au souscripteur',
          'Un retrait composé surtout des subventions et des revenus, imposable pour l’étudiant admissible',
          'Une déduction d’impôt pour le parent qui cotise',
        ],
        correctIndex: 1,
        explanation:
          'Le PAE tire des subventions et des revenus du REEE ; il est généralement imposable entre les mains du bénéficiaire étudiant.',
      },
      {
        id: 'reee-q3',
        prompt:
          'Si vous retirez des cotisations du REEE alors qu’aucun bénéficiaire n’est admissible à un PAE, que se passe-t-il souvent pour les subventions ?',
        choices: [
          'Rien : les subventions restent toujours dans le compte',
          'Elles doivent souvent être remboursées au gouvernement',
          'Elles sont transférées automatiquement dans votre CELI',
        ],
        correctIndex: 1,
        explanation:
          'Hors situation de PAE admissible, un retrait de cotisations entraîne généralement le remboursement des subventions liées.',
      },
    ],
  },
  diagram: {
    title: 'Parcours de l’argent — REEE',
    type: 'flow',
    nodes: [
      {
        id: 'cotis',
        label: 'Cotisations',
        hint: 'Argent déjà imposé',
      },
      {
        id: 'subv',
        label: 'SCEE + IQEE',
        hint: 'Subventions selon plafonds',
        emphasis: true,
      },
      {
        id: 'reee',
        label: 'REEE',
        hint: 'Croissance à l’abri de l’impôt',
      },
      {
        id: 'out',
        label: 'PAE ou cotisations',
        hint: 'PAE à l’étudiant · cotis. au souscripteur',
      },
    ],
    edges: [
      { from: 'cotis', to: 'reee', label: 'Versement' },
      { from: 'subv', to: 'reee', label: 'Ajout' },
      { from: 'reee', to: 'out', label: 'Retrait' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Alexe — année 1, rattrapage, études',
    type: 'flow',
    nodes: [
      {
        id: 'y1',
        label: 'An 1 : 2 500 $',
        hint: 'SCEE 500 $ + IQEE 250 $',
        emphasis: true,
      },
      {
        id: 'y23',
        label: 'Ans 2–3 : +2 500 $/an',
        hint: 'Cumul cotis. 7 500 $',
      },
      {
        id: 'y4',
        label: 'An 4 : rattrapage 5 000 $',
        hint: 'Subv. jusqu’à 1 500 $',
      },
      {
        id: 'etudes',
        label: 'PAE 4 000 $ + cotis. 3 000 $',
        hint: 'Léa (PAE) · Alexe (cotis.)',
      },
    ],
    edges: [
      { from: 'y1', to: 'y23', label: 'Même rythme' },
      { from: 'y23', to: 'y4', label: 'Droits reportés' },
      { from: 'y4', to: 'etudes', label: 'Études' },
    ],
  },
  sources: [
    {
      name: 'ARC — Régimes enregistrés d’épargne-études (REEE)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/regimes-enregistres-epargne-etudes-reee.html',
    },
    {
      name: 'ARC — Publication RC4092 (REEE)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/formulaires-publications/publications/rc4092/regimes-enregistres-epargne-etudes-reee.html',
    },
    {
      name: 'Canada.ca — Subvention canadienne pour l’épargne-études (SCEE)',
      url: 'https://www.canada.ca/fr/services/prestations/education/epargne-etudes/subvention.html',
    },
    {
      name: 'EDSC — Droits à subvention et droits de report (infocapsule)',
      url: 'https://www.canada.ca/content/dam/canada/employment-social-development/migration/documents/assets/portfolio/docs/fr/rapports/promoteurs_reee/infocapsules/ic-12-droit-a-subvention-et-droit-de-report.pdf',
    },
    {
      name: 'Revenu Québec — Incitatif québécois à l’épargne-études (IQEE)',
      url: 'https://www.revenuquebec.ca/fr/citoyens/credits-dimpot/incitatif-quebecois-a-lepargne-etudes/',
    },
    {
      name: 'Revenu Québec — Détermination du montant de l’IQEE',
      url: 'https://www.revenuquebec.ca/fr/citoyens/credits-dimpot/incitatif-quebecois-a-lepargne-etudes/determination-du-montant/',
    },
    {
      name: 'AMF — REEE',
      url: 'https://lautorite.qc.ca/grand-public/investissements/regimes-depargne/reee-regime-enregistre-depargne-etudes',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['celi', 'reer-ferr'],
  seoTitle: 'REEE : SCEE, IQEE, PAE et cotisations | Apprendre',
  seoDescription:
    'Mini-formation sur le REEE au Québec : souscripteur et bénéficiaire, SCEE et IQEE, report de droits, PAE versus retraits de cotisations, et comparaison avec CELI et REER.',
};
