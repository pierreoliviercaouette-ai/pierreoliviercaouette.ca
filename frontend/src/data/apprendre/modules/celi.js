/**
 * Mini-formation CELI — niveau institutionnel.
 * Sources vérifiées : ARC, AMF, Revenu Québec, IQPF, ia.ca (plafonds 2024–2026).
 * Contenu éducatif général ; ne constitue pas un conseil personnalisé.
 */
export const module = {
  id: 'celi',
  audiences: ['particulier'],
  category: 'epargne',
  title: 'Le CELI',
  subtitle: 'Compte d’épargne libre d’impôt',
  shortDescription:
    'Droits de cotisation, report, retraits N vs N+1, surplus, placements dans l’enveloppe et comparaison simple avec le REER.',
  readMinutes: 12,
  keyFacts: [
    { label: 'Plafond 2026', value: '7 000 $ (ARC)' },
    { label: 'Retraits', value: 'Non imposables ; droits au 1er janv. suivant' },
    { label: 'Surplus', value: '1 % par mois, sans marge de 2 000 $' },
  ],
  sections: [
    {
      heading: 'Comprendre l’enveloppe CELI',
      paragraphs: [
        'Le compte d’épargne libre d’impôt (CELI) est une enveloppe fiscale enregistrée. Vous y déposez de l’argent déjà imposé : la cotisation ne réduit pas votre revenu. Les intérêts, dividendes et gains qui restent dans le compte ne sont pas imposés.',
        'Un retrait de CELI n’est pas imposable non plus. Il n’augmente pas votre revenu fédéral ni québécois, ni le revenu utilisé pour plusieurs prestations fondées sur le revenu — contrairement à un retrait de REER ou de FERR.',
        'Pour ouvrir et cotiser, il faut en principe résider au Canada, avoir un NAS valide et avoir atteint la majorité (18 ans au Québec). Le CELI n’est pas un placement : c’est le cadre fiscal dans lequel vous placez, selon ce que permet votre émetteur.',
      ],
    },
    {
      heading: 'Calculer vos droits de cotisation',
      paragraphs: [
        'Le plafond annuel est le même pour tous les titulaires. Pour 2024, 2025 et 2026, il est de 7 000 $, fixé chaque 1er janvier. Il ne dépend pas de votre revenu — contrairement au REER.',
        'Vos droits = plafond de l’année + droits inutilisés des années antérieures + retraits de l’année civile précédente − cotisations déjà versées cette année. Les droits inutilisés se reportent indéfiniment.',
        'Avec plusieurs CELI, le plafond s’applique au total de toutes vos cotisations. Consultez Mon dossier de l’ARC, puis comparez avec vos relevés : les institutions déclarent avec un délai.',
      ],
    },
    {
      heading: 'Retirer sans créer un surplus',
      paragraphs: [
        'Vous pouvez retirer en tout temps, sous réserve des délais liés aux placements eux-mêmes (par exemple un CPG non échu). Le retrait n’est pas imposable. Le montant retiré s’ajoute à vos droits — mais seulement le 1er janvier de l’année suivante.',
        'Si vous retirez en septembre et voulez remettre le même montant avant le 31 décembre, il faut déjà avoir assez de droits inutilisés. Sinon, vous créez un surplus.',
        'Attendre le 1er janvier libère le droit de recontribuer, en plus du nouveau plafond et de tout report. La croissance à l’intérieur du CELI n’utilise aucun droit : seules les cotisations réduisent le compteur.',
      ],
    },
    {
      heading: 'Corriger un excédent de cotisation',
      paragraphs: [
        'Toute cotisation au-delà de vos droits est un surplus. Contrairement au REER, le CELI n’offre pas de marge de 2 000 $ : chaque dollar en trop coûte 1 % d’impôt par mois, tant que l’excédent reste dans un CELI.',
        'Dès que vous constatez un surplus, retirez-le sans attendre et produisez la déclaration CELI exigée. Plus l’excédent reste longtemps, plus la pénalité mensuelle s’accumule.',
        'Un transfert direct d’un CELI à un autre ne consomme en principe pas de droits. Un retrait suivi d’une nouvelle cotisation, lui, en consomme — d’où le risque de surplus la même année.',
      ],
    },
    {
      heading: 'Choisir placements et rôle face au REER',
      paragraphs: [
        'Dans un CELI, vous pouvez souvent détenir épargne liquide, CPG, fonds, FNB, actions ou obligations admissibles, selon l’émetteur. La valeur peut baisser ; les pertes dans le CELI ne sont pas déductibles.',
        'Le REER donne souvent une déduction à l’entrée et impose les retraits. Le CELI n’offre pas de déduction, mais croissance et retraits sont libres d’impôt. Beaucoup de personnes utilisent les deux : REER pour la retraite, CELI pour la flexibilité.',
        'Restez dans les placements admissibles pour éviter des pénalités. Ce texte est général et ne constitue pas un conseil personnalisé.',
      ],
      bullets: [
        'Vérifiez vos droits dans Mon dossier avant chaque cotisation importante.',
        'Ne recontribuez pas un retrait de l’année N avant le 1er janvier N+1, sauf droits déjà disponibles.',
        'Retirez tout surplus dès que possible pour limiter la pénalité de 1 % par mois.',
      ],
    },
  ],
  workedExample: {
    title: 'Exemple — Camille (2025–2026)',
    intro:
      'Illustration des règles de l’ARC : droits, retrait reporté à N+1, plafond annuel. Plafonds 2025 et 2026 : 7 000 $ chacun. Ce n’est pas un conseil personnalisé.',
    steps: [
      {
        label: 'Début 2025 — droits',
        detail:
          'Camille a 3 000 $ de droits reportés et reçoit le plafond 2025 de 7 000 $. Droits disponibles : 10 000 $.',
      },
      {
        label: 'Cotisation, croissance, retrait',
        detail:
          'Elle cotise 8 000 $ (reste 2 000 $ de droits). Ses placements génèrent 480 $ : cette croissance n’utilise aucun droit. En septembre, elle retire 3 000 $ ; les droits restent à 2 000 $ jusqu’à N+1.',
      },
      {
        label: 'Piège — recontribuer trop tôt',
        detail:
          'Si elle reverse 3 000 $ en octobre 2025, seuls 2 000 $ sont couverts. Surplus : 1 000 $, imposé à 1 % par mois. Elle attend donc 2026.',
      },
      {
        label: '2026 — recontribution',
        detail:
          'Au 1er janvier 2026 : 2 000 $ inutilisés + 3 000 $ (retrait 2025) + 7 000 $ (plafond) = 12 000 $. Elle reverse 3 000 $ ; il reste 9 000 $ de droits.',
      },
    ],
    result:
      'Camille a financé son projet sans impôt sur le retrait, a évité un surplus en attendant N+1, et conserve des droits. Le rendement de 480 $ n’a ni consommé de droits ni généré d’impôt.',
  },
  takeaways: [
    'Cotisations non déductibles ; croissance et retraits libres d’impôt.',
    'Vérifiez vos droits dans Mon dossier avant de cotiser.',
    'Un retrait N ne se recontribue sans risque qu’au 1er janvier N+1.',
    'Un surplus coûte 1 % par mois, sans marge de 2 000 $.',
  ],
  quiz: {
    title: 'Testez vos connaissances',
    questions: [
      {
        id: 'celi-q1',
        prompt:
          'Dans l’exemple, après un retrait alors qu’il reste 2 000 $ de droits, que se passe-t-il si Camille recontribue 3 000 $ la même année?',
        choices: [
          'Rien : le retrait libère immédiatement de nouveaux droits',
          'Elle crée un surplus de 1 000 $',
          'Elle obtient une déduction d’impôt de 3 000 $',
        ],
        correctIndex: 1,
        explanation:
          'Le retrait ne s’ajoute aux droits qu’au 1er janvier suivant. Avec 2 000 $ de droits restants, recontribuer 3 000 $ la même année produit un excédent de 1 000 $.',
      },
      {
        id: 'celi-q2',
        prompt:
          'Quand un retrait du CELI s’ajoute-t-il à vos droits de cotisation?',
        choices: [
          'Immédiatement, le jour du retrait',
          'Le 1er janvier de l’année civile suivante',
          'Seulement au moment de la déclaration de revenus',
        ],
        correctIndex: 1,
        explanation:
          'Le montant retiré s’ajoute aux droits de cotisation seulement au 1er janvier de l’année suivante.',
      },
      {
        id: 'celi-q3',
        prompt: 'Où consultez-vous en priorité vos droits de cotisation CELI?',
        choices: [
          'Uniquement sur le relevé de votre banque',
          'Dans Mon dossier de l’ARC, en les comparant à vos propres relevés',
          'Sur votre avis de cotisation REER seulement',
        ],
        correctIndex: 1,
        explanation:
          'Mon dossier de l’ARC affiche vos droits CELI ; comparez toujours avec vos relevés, car la mise à jour officielle n’est pas instantanée.',
      },
    ],
  },
  diagram: {
    title: 'Parcours de l’argent — CELI',
    type: 'flow',
    nodes: [
      { id: 'net', label: 'Argent déjà imposé', hint: 'Pas de déduction' },
      { id: 'room', label: 'Droits de cotisation', hint: 'Plafond + report + retraits N-1' },
      { id: 'celi', label: 'CELI', hint: 'Croissance non imposable', emphasis: true },
      { id: 'out', label: 'Retrait libre d’impôt', hint: 'Droits au 1er janvier suivant' },
    ],
    edges: [
      { from: 'net', to: 'room', label: 'Vérifier' },
      { from: 'room', to: 'celi', label: 'Cotiser' },
      { from: 'celi', to: 'out', label: 'Retirer' },
    ],
  },
  exampleDiagram: {
    title: 'Exemple Camille — 2025–2026',
    type: 'flow',
    nodes: [
      {
        id: 'start',
        label: 'Janv. 2025 : 10 000 $',
        hint: '3 000 $ report + 7 000 $ plafond',
      },
      {
        id: 'contrib',
        label: 'Cotisation 8 000 $',
        hint: 'Reste 2 000 $ de droits',
        emphasis: true,
      },
      {
        id: 'withdraw',
        label: 'Retrait 3 000 $',
        hint: 'Droits inchangés cette année',
      },
      {
        id: 'next',
        label: 'Janv. 2026 : 12 000 $',
        hint: 'Inutilisés + retrait N-1 + plafond',
      },
      {
        id: 'recontrib',
        label: 'Recontribution 3 000 $',
        hint: 'Reste 9 000 $ de droits',
      },
    ],
    edges: [
      { from: 'start', to: 'contrib', label: 'Mars 2025' },
      { from: 'contrib', to: 'withdraw', label: 'Sept. 2025' },
      { from: 'withdraw', to: 'next', label: '1er janv. N+1' },
      { from: 'next', to: 'recontrib', label: 'Janv. 2026' },
    ],
  },
  timeline: {
    title: 'Ligne du temps — Camille 2025–2026',
    caption:
      'Deux compteurs évoluent séparément : les droits et le solde. Un retrait baisse le solde sans remonter les droits avant le 1er janvier suivant.',
    events: [
      {
        at: '1er janv. 2025',
        title: 'Droits ouverts',
        amount: '10 000 $',
        note: '3 000 $ reportés + 7 000 $ plafond',
      },
      {
        at: 'Mars 2025',
        title: 'Cotisation',
        amount: '8 000 $',
        note: 'Droits restants 2 000 $ · solde 8 000 $',
        emphasis: true,
      },
      {
        at: 'Sept. 2025',
        title: 'Retrait projet',
        amount: '−3 000 $',
        note: 'Droits toujours 2 000 $ · solde ≈ 5 480 $',
      },
      {
        at: '1er janv. 2026',
        title: 'Droits renouvelés',
        amount: '12 000 $',
        note: '2 000 + retrait N-1 3 000 + plafond 7 000',
        emphasis: true,
      },
      {
        at: 'Janv. 2026',
        title: 'Recontribution',
        amount: '3 000 $',
        note: 'Droits restants 9 000 $ · solde ≈ 8 480 $',
      },
    ],
    chart: {
      type: 'line',
      series: [
        { key: 'droits', name: 'Droits disponibles' },
        { key: 'solde', name: 'Solde CELI' },
      ],
      points: [
        { at: 'Janv. 25', droits: 10000, solde: 0 },
        { at: 'Mars 25', droits: 2000, solde: 8000 },
        { at: 'Sept. 25', droits: 2000, solde: 5480 },
        { at: 'Janv. 26', droits: 12000, solde: 5480 },
        { at: 'Après', droits: 9000, solde: 8480 },
      ],
    },
  },
  sources: [
    {
      name: 'ARC — Calculer vos droits de cotisation aux CELI',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot/cotiser/calculer-droits.html',
    },
    {
      name: 'ARC — Avant de cotiser à un CELI (plafonds annuels)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot/cotiser/avant.html',
    },
    {
      name: 'ARC — Retirer un montant d’un CELI',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot/retirer.html',
    },
    {
      name: 'ARC — Si vous cotisez en trop à un CELI',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/particuliers/sujets/compte-epargne-libre-impot/cotiser/en-trop.html',
    },
    {
      name: 'ARC — Plafonds des régimes enregistrés (CELI)',
      url: 'https://www.canada.ca/fr/agence-revenu/services/impot/administrateurs-regimes-enregistres/fesp/plafonds-cd-reer-rpdb-celi-mgap.html',
    },
    {
      name: 'AMF — CELI : compte d’épargne libre d’impôt',
      url: 'https://lautorite.qc.ca/grand-public/investissements/regimes-depargne/celi-compte-depargne-libre-dimpot',
    },
    {
      name: 'Revenu Québec — Montants non imposables (CELI)',
      url: 'https://www.revenuquebec.ca/fr/citoyens/declaration-de-revenus/produire-votre-declaration-de-revenus/comment-remplir-votre-declaration-de-revenus/aide-par-ligne/96-a-164-revenu-total/',
    },
    {
      name: 'IQPF — Guide des compétences des Pl. Fin.',
      url: 'https://iqpf.org/assets/Documents/InstitutPF_Guide-des-competences.pdf',
    },
    {
      name: 'iA Groupe financier — Plafonds REER, CELI et CELIAPP',
      url: 'https://ia.ca/zone-conseils/finances/plafond-de-cotisation-reer-celi-celiapp',
    },
  ],
  relatedServiceIds: ['epargne', 'planification'],
  relatedFormationIds: ['reer-ferr', 'non-enregistre'],
  seoTitle: 'CELI : droits, retraits et plafonds | Apprendre',
  seoDescription:
    'Mini-formation sur le CELI : plafonds, droits de cotisation, retraits N+1, pénalité de surplus, placements et comparaison avec le REER.',
};
