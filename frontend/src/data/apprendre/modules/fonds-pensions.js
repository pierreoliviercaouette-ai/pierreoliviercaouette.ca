/**
 * Mini-formation fonds de pension (RPA / RCR) — RRPD, RRCD.
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'fonds-pensions',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Les fonds de pension (RRCD, RRPD, RPA)',
  subtitle: 'Formule ou compte, acquisition, départ et facteur d’équivalence',
  shortDescription:
    'Comprendre un régime de pension agréé au Québec : prestations vs cotisations déterminées, rente différée, options au départ et impact sur le REER.',
  readMinutes: 12,
  keyFacts: [
    {
      label: 'Deux familles',
      value: 'RRPD = rente par formule ; RRCD = compte',
    },
    {
      label: 'Acquisition (Qc)',
      value: 'Rente différée dès la cessation active',
    },
    {
      label: 'Au départ',
      value: 'Comparer rente différée et valeur de rachat',
    },
  ],
  sections: [
    {
      heading: 'Qu’est-ce qu’un fonds de pension ?',
      paragraphs: [
        'Un régime de pension agréé (RPA) est un régime de retraite privé enregistré auprès de l’Agence du revenu du Canada (ARC). L’employeur — et souvent vous — y verse des cotisations dans une caisse distincte de l’entreprise.',
        'Au Québec, on parle aussi de régime complémentaire de retraite (RCR). Dans le langage courant, « fonds de pension », « régime de l’employeur » et « RPA » désignent souvent la même chose.',
        'Deux cadres s’appliquent en parallèle : la loi québécoise fixe les droits des participants ; l’ARC fixe les règles fiscales (agrément, plafonds, facteur d’équivalence, transferts). Les droits sont en général immobilisés jusqu’à la retraite, sauf exceptions prévues.',
      ],
    },
    {
      heading: 'Formule ou compte : qui porte le risque ?',
      paragraphs: [
        'Dans un régime à prestations déterminées (RRPD), la rente suit une formule — souvent un pourcentage du salaire multiplié par les années de service. Vous cotisez souvent un pourcentage fixe ; l’employeur assume le solde. Tant que le régime honore la formule, votre rente ne dépend pas du rendement d’un compte à votre nom.',
        'Dans un régime à cotisations déterminées (RRCD), ce qui est fixé, ce sont les cotisations — pas la rente. Les sommes vont dans un compte à votre nom ; le revenu dépend du capital, des frais et des rendements. Vous portez surtout le risque de placement.',
        'Un RRCD n’est pas un REER collectif ni un RVER : ce sont d’autres enveloppes. Lisez votre relevé : formule ou solde, âge de retraite normale, réduction anticipée, options au décès. Certains régimes sont hybrides (volet PD + volet CD).',
      ],
    },
    {
      heading: 'Quand vos droits sont-ils acquis ?',
      paragraphs: [
        'L’acquisition des droits (souvent appelée « vesting ») est le moment où vos droits deviennent irrévocables : l’employeur ne peut plus les retirer parce que vous quittez. Depuis 2001, la loi québécoise prévoit l’acquisition immédiate du droit à une rente différée dès la cessation de participation active.',
        'Acquisition ne signifie pas liquidité. Une rente différée, c’est le droit de recevoir plus tard la rente prévue par le régime — pas un chèque comptant. Sur le relevé de cessation, repérez la rente différée estimée, l’âge sans réduction, et la valeur de rachat si elle est offerte.',
      ],
    },
    {
      heading: 'Que faire si vous quittez l’employeur ?',
      paragraphs: [
        'Vos droits acquis ne disparaissent pas. Selon le régime, vous pouvez souvent laisser une rente différée en place, ou demander un transfert de la valeur de rachat (valeur actualisée de vos droits) vers un véhicule admissible.',
        'Parmi ces véhicules : un compte de retraite immobilisé (CRI), un fonds de revenu viager (FRV), un autre RPA, ou un contrat de rente. Un CRI s’apparente à un REER immobilisé ; un FRV, à un FERR immobilisé avec plafond de retrait annuel.',
        'Un transfert hors d’un RRPD fait perdre les garanties de la formule. Un transfert direct admissible se fait en général avec report d’impôt ; pour un RRPD, le montant vers un REER ou un FERR est plafonné. Le relevé de cessation indique options, montants et date limite.',
      ],
    },
    {
      heading: 'Comment le régime touche votre REER',
      paragraphs: [
        'Participer à un RPA réduit vos droits REER via le facteur d’équivalence (FE), déclaré sur votre feuillet T4. Le FE représente la valeur des crédits de pension de l’année et diminue le maximum déductible REER de l’année suivante.',
        'En RRCD, le FE correspond surtout aux cotisations portées au compte (employeur + employé). En RRPD, il suit une formule réglementaire liée à l’accroissement de la rente — ce n’est pas le montant de cotisation salariale sur votre paie.',
      ],
      bullets: [
        'Au départ : comparez rente différée et valeur de rachat avant tout transfert hors RRPD.',
        'Chaque année : lisez le FE sur le T4 et le maximum REER sur l’avis de cotisation.',
        'Au Québec : le droit à la rente différée s’acquiert dès la cessation active.',
        'Hors RRPD : un transfert fait perdre les garanties de la formule.',
      ],
    },
  ],
  workedExample: {
    title: 'Même carrière, deux régimes : RRPD vs RRCD',
    intro:
      'Alex et Sam : salaire moyen de fin de carrière de 80 000 $, 30 années de service, retraite à 65 ans. L’un a un RRPD, l’autre un RRCD. Chiffres illustratifs — pas des projections garanties.',
    steps: [
      {
        label: 'Alex — RRPD (1,75 %)',
        detail:
          'Rente à 65 ans = 1,75 % × 80 000 $ × 30 = 42 000 $ par année. Tant que le régime honore la formule, ce montant ne dépend pas des marchés.',
      },
      {
        label: 'Sam — RRCD (10 % au total)',
        detail:
          'Cotisations combinées de 8 000 $ par année pendant 30 ans. À 5 % net hypothétique, le compte atteint environ 531 500 $.',
      },
      {
        label: 'Revenu de Sam à 4 %',
        detail:
          'Un retrait initial de 4 % sur 531 500 $ donne environ 21 260 $ la première année — nettement moins que les 42 000 $ d’Alex — et le capital reste exposé aux marchés.',
      },
      {
        label: 'Pour égaler la rente PD',
        detail:
          'Viser ~42 000 $ à 4 % exigerait environ 1 050 000 $ à 65 ans. Il faudrait cotiser davantage, mieux performer, ou prolonger l’épargne — sans garantie.',
      },
    ],
    result:
      'Même carrière : Alex reçoit 42 000 $/an par formule ; Sam dispose d’environ 531 500 $ et d’un revenu initial d’environ 21 260 $/an à 4 %. Le type de régime change l’ordre de grandeur et qui porte le risque.',
  },
  takeaways: [
    'RRPD : rente par formule ; RRCD : cotisations fixées, risque côté participant.',
    'Au Québec, la rente différée s’acquiert dès la cessation active.',
    'Au départ, comparez rente différée et transfert avant de quitter un RRPD.',
    'Le facteur d’équivalence sur le T4 réduit vos droits REER l’année suivante.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'fp-q1',
        prompt:
          'Dans l’exemple, Alex (RRPD, 1,75 % × 80 000 $ × 30) reçoit quelle rente annuelle à 65 ans ?',
        choices: ['21 260 $', '42 000 $', '80 000 $'],
        correctIndex: 1,
        explanation:
          '1,75 % × 80 000 $ × 30 = 42 000 $ par année. En RRPD, la rente suit la formule, pas le solde d’un compte.',
      },
      {
        id: 'fp-q2',
        prompt: 'Qui porte surtout le risque de placement dans un RRCD ?',
        choices: [
          'L’employeur via la caisse',
          'La personne participante',
          'L’Agence du revenu du Canada',
        ],
        correctIndex: 1,
        explanation:
          'En RRCD, seules les cotisations sont fixées ; le compte et les rendements déterminent le revenu.',
      },
      {
        id: 'fp-q3',
        prompt:
          'Au Québec, depuis 2001, quand le droit à une rente différée est-il généralement acquis ?',
        choices: [
          'Après dix années de service continu seulement',
          'Dès la cessation de participation active',
          'Uniquement à l’âge normal de la retraite',
        ],
        correctIndex: 1,
        explanation:
          'La loi québécoise prévoit l’acquisition immédiate du droit à la rente différée dès la cessation de participation active.',
      },
    ],
  },
  diagram: {
    title: 'Du RPA aux deux grandes familles',
    type: 'fork',
    source: {
      id: 'rpa',
      label: 'RPA / RCR (fonds de pension)',
      hint: 'Employeur + caisse · droits au Québec',
    },
    branches: [
      {
        id: 'rrpd',
        label: 'RRPD — prestations déterminées',
        hint: 'Rente par formule · risque employeur',
        edgeLabel: 'Rente fixée',
      },
      {
        id: 'rrcd',
        label: 'RRCD — cotisations déterminées',
        hint: 'Compte individuel · risque participant',
        edgeLabel: 'Cotisations fixées',
      },
    ],
  },
  exampleDiagram: {
    title: 'Exemple : Alex (RRPD) vs Sam (RRCD)',
    type: 'flow',
    nodes: [
      {
        id: 'carriere',
        label: '30 ans · salaire 80 000 $',
        hint: 'Même parcours pour Alex et Sam',
        emphasis: true,
      },
      {
        id: 'alex',
        label: 'Alex — RRPD 1,75 %',
        hint: 'Rente = 42 000 $/an',
      },
      {
        id: 'sam',
        label: 'Sam — RRCD 10 %',
        hint: 'Capital ≈ 531 500 $ (5 % net)',
      },
      {
        id: 'revenu-sam',
        label: 'Revenu Sam ≈ 21 260 $/an',
        hint: 'Retrait initial 4 %',
      },
      {
        id: 'ecart',
        label: 'Dans l’exemple : ~2× côté PD',
        hint: 'Hypothèses illustratives seulement',
        emphasis: true,
      },
    ],
    edges: [
      { from: 'carriere', to: 'alex', label: 'Formule' },
      { from: 'carriere', to: 'sam', label: 'Compte' },
      { from: 'sam', to: 'revenu-sam', label: '4 %' },
      { from: 'alex', to: 'ecart', label: '42 000 $' },
      { from: 'revenu-sam', to: 'ecart', label: '≈ 21 260 $' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — même carrière, deux régimes',
    caption:
      'Alex (RRPD) et Sam (RRCD) : 30 ans, salaire moyen 80 000 $. À 65 ans, la forme du revenu diverge.',
    events: [
      {
        at: 'Départ',
        title: 'Même parcours',
        amount: '80 000 $',
        note: 'Salaire moyen de fin de carrière',
      },
      {
        at: '30 ans',
        title: 'Alex — RRPD',
        amount: '42 000 $/an',
        note: '1,75 % × 80 000 $ × 30',
        emphasis: true,
      },
      {
        at: '30 ans',
        title: 'Sam — capital RRCD',
        amount: '≈ 531 500 $',
        note: '8 000 $/an · 5 % net illustratif',
      },
      {
        at: '65 ans',
        title: 'Sam — revenu 4 %',
        amount: '≈ 21 260 $/an',
        note: 'Dans l’exemple ≈ la moitié d’Alex',
        emphasis: true,
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'alex', name: 'Alex — rente RRPD ($/an)' },
        { key: 'sam', name: 'Sam — revenu 4 % ($/an)' },
      ],
      points: [
        { at: '0 an', alex: 0, sam: 0 },
        { at: '10 ans', alex: 14000, sam: 4000 },
        { at: '20 ans', alex: 28000, sam: 10500 },
        { at: '30 ans', alex: 42000, sam: 21260 },
      ],
    },
  },
  sources: [
    {
      name: 'Retraite Québec — Régime à prestations déterminées',
      url: 'https://www.retraitequebec.gouv.qc.ca/fr/programmes/regimes-retraite-secteurs-prive-municipal-et-universitaires/regime-retraite-prestations-determinees',
    },
    {
      name: 'Retraite Québec — Régimes de retraite offerts par l’employeur',
      url: 'https://www.retraitequebec.gouv.qc.ca/fr/citoyens/retraite-et-planification/planifiez-retraite/planifier-5-etapes/determinez-revenus/regimes-retraite-offerts-employeur',
    },
    {
      name: 'Retraite Québec — Commentaires, art. 69 (acquisition de la rente différée)',
      url: 'https://www.retraitequebec.gouv.qc.ca/fr/loi-et-reglements-rcr-extraits-commentes/chapitre-6-remboursement-et-prestations/loi-regimes-complementaires-retraite/prestations-68-90/rente-differee-68-69/article-69-droit-rente-differee/commentaires',
    },
    {
      name: 'Retraite Québec — Délais de transfert (art. 99)',
      url: 'https://www.retraitequebec.gouv.qc.ca/fr/loi-et-reglements-rcr-extraits-commentes/chapitre-7-transfert-droits-et-actifs/loi-regimes-complementaires-retraite/transfert-droits-et-actifs-98-106/article-99-delais-transfert/commentaires',
    },
    {
      name: 'ARC — Plafonds CD, PD, REER et MGAP',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/administrateurs-regimes-enregistres/fesp/plafonds-cd-reer-rpdb-celi-mgap.html',
    },
    {
      name: 'ARC — Facteur d’équivalence (FE)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/administrateurs-regimes-enregistres/fesp/facteur-equivalence.html',
    },
    {
      name: 'ARC — Manuel technique RPA, transferts (art. 147.3)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/administrateurs-regimes-enregistres/manuel-technique-direction-regimes-enregistres-3.html',
    },
    {
      name: 'Institut de planification financière — Situation à la retraite',
      url: 'https://institutpf.org/la-planification-financiere-cest-quoi/les-6-situations-analysees-par-les-planificateurs-financiers/votre-situation-a-la-retraite',
    },
    {
      name: 'AMF — 7 documents à l’approche de la retraite',
      url: 'https://lautorite.qc.ca/grand-public/finances-personnelles/retraite/7-documents-incontournables-a-lapproche-de-la-retraite',
    },
    {
      name: 'AMF — Régimes d’épargne',
      url: 'https://lautorite.qc.ca/grand-public/investissements/regimes-depargne',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['reer-ferr', 'celi'],
  seoTitle: 'Fonds de pension (RRCD, RRPD, RPA) | Mini-formation',
  seoDescription:
    'RPA / RCR au Québec : RRPD vs RRCD, acquisition de la rente différée, valeur de rachat, CRI-FRV et facteur d’équivalence, avec exemple chiffré.',
};
