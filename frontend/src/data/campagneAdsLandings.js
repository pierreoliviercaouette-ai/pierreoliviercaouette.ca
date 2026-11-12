/**
 * Landings de conversion pour la campagne Meta CBO multi-sujets.
 * Slug = segment d’URL /campagnes/:slug
 */

export const CAMPAGNE_ADS_UTM_CAMPAIGN = 'cbo_catalog_2026';

export const campagneAdsLandings = [
  {
    slug: 'celiapp',
    atmosphere: 'foyer',
    heroChips: ['1ʳᵉ propriété', 'Plafonds illustratifs', 'Sans compte'],
    processSteps: ['Projeter', 'Lire le chiffre', '15 min si doute'],
    badge: 'CELIAPP',
    title: 'Ta mise de fonds, en clair avec le CELIAPP',
    seoTitle: 'CELIAPP : projeter ta mise de fonds | Conseiller en sécurité financière',
    seoDescription:
      'Simulateur gratuit CELIAPP : rythme, horizon, plafonds illustratifs. Ensuite 15 min pour admissibilité et prochain pas. Victoriaville.',
    promise:
      'Projette ce que ton rythme donne avec les plafonds illustratifs 2026. Gratuit, sans compte. Si ça chicotte ensuite, on peut en parler 15 minutes.',
    bullets: [
      'Projette ta mise de fonds avec les plafonds illustratifs : 8 000 $ de nouveaux droits par année, 40 000 $ à vie.',
      'Le CELIAPP n’est pas le CELI : objectifs, retraits et plafonds sont différents.',
      'Vérifie qui a le droit d’ouvrir un compte et comment les retraits fonctionnent avant de cotiser.',
    ],
    legalNote:
      'Ce contenu est informatif et ne constitue pas une opinion personnalisée. Les rendements ne sont pas garantis. Pierre-Olivier Caouette est conseiller en sécurité financière avec iA Groupe financier.',
    faq: [
      {
        question: 'Est-ce que le CELIAPP remplace le CELI ?',
        answer:
          'Non. Deux comptes, deux jobs. Le CELIAPP vise surtout une 1ʳᵉ propriété ; le CELI est plus souple pour d’autres projets. Selon ton horizon, on peut les combiner — à clarifier selon ta situation.',
      },
      {
        question: 'Qui peut ouvrir un CELIAPP ?',
        answer:
          'En général : résident canadien, âge admissible, et critères de « premier acheteur » selon les règles en vigueur. Les détails évoluent — valide toujours avant d’ouvrir ou de cotiser. Cette page ne remplace pas une vérification personnalisée.',
      },
      {
        question: 'Si j’achète plus tard — ou pas du tout ?',
        answer:
          'Les règles de participation et de retrait ont des échéanciers. Si ton achat glisse, faut savoir ce qui se passe avec le compte. C’est exactement le genre de point qu’on démêle en 15 minutes — sans pression.',
      },
      {
        question: 'CELIAPP ou RAP (REER) — dans quel ordre ?',
        answer:
          'Ça dépend de ton dossier, de tes droits et de ton horizon. L’outil ici projette le CELIAPP seulement (cotisations). L’ordre avec REER / RAP / CELI se clarifie au cas par cas.',
      },
      {
        question: 'C’est un conseil personnalisé ?',
        answer:
          'Non. Page éducative et générale. Une recommandation adaptée à ton dossier se fait seulement après une analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/celiapp',
    apprendreLabel: 'Lire la capsule CELIAPP',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Projeter ma mise de fonds',
    /** RDV une seule fois — section « Tu veux valider ton cas ? » plus bas. */
    hideHeroRdv: true,
    ctaHeadline: 'Tu veux valider ton cas ?',
    ctaSubline: 'Un conseiller peut revoir ta situation avec toi en 15 minutes.',
    toolIntro: '',
  },
  {
    slug: 'assurance-invalidite',
    atmosphere: 'invalidite',
    heroChips: ['Trou vs dépenses', 'Coussin d’attente', 'Délai 30/90/120'],
    processSteps: ['Entrer tes %', 'Voir le trou', 'Clarifier le livret'],
    badge: 'Invalidité',
    title: 'Si le salaire s’arrête : le trou de ton assurance collective',
    seoTitle: 'Assurance invalidité | Conseiller en sécurité financière',
    seoDescription:
      'Mesure le trou entre ce que ton assurance collective t’offre et tes dépenses : %, délai d’attente, coussin. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Quatre chiffres — tu vois le trou vs tes dépenses, et ce qu’il faut tenir pendant l’attente. Sans compte.',
    bullets: [
      'Ce que ton assurance collective t’offre : % du salaire et délai avant le premier chèque',
      'Le trou mensuel vs tes dépenses qui, elles, n’arrêtent pas',
      'Le coussin à prévoir pendant l’attente — souvent 30, 90 ou 120 jours sans chèque',
    ],
    faq: [
      {
        question: 'J’ai déjà une assurance collective. Pourquoi regarder ailleurs ?',
        answer:
          'Ton assurance collective, c’est utile — mais souvent limitée (montant, durée, définition). Beaucoup de gens voient les trous seulement le jour d’une réclamation. Mieux vaut les voir avant.',
      },
      {
        question: 'Est-ce la même chose que la maladie grave ?',
        answer:
          'Non. L’invalidité remplace un revenu dans le temps — via ton assurance collective ou une protection de ton bord. La maladie grave verse un capital si le diagnostic correspond au contrat. Les deux répondent à des risques différents.',
      },
      {
        question: '« Ta job » vs « n’importe quelle job » — c’est quoi la différence ?',
        answer:
          'Certaines définitions regardent si tu peux faire ton métier ; d’autres, si tu peux faire un métier. Ça change beaucoup ce que « être couvert » veut dire. C’est écrit dans ton livret — on le lit ensemble en 15 min. Contenu éducatif, pas un avis sur ton contrat.',
      },
      {
        question: 'Les prestations, ça dure jusqu’à quand ?',
        answer:
          'Ça dépend du contrat : quelques années, jusqu’à un âge précis, parfois plus court qu’on croit. L’outil ici illustre le % et le délai — pas la durée max. À valider dans ton livret.',
      },
      {
        question: 'Est-ce que je peux avoir une invalidité individuelle en plus de la collective ?',
        answer:
          'Oui, c’est parfois pertinent — pour combler un trou de montant, de délai, de durée ou de définition. Ça se regarde au cas par cas, sans pression et sans promesse de % garanti.',
      },
    ],
    apprendrePath: '/apprendre/assurance-invalidite',
    apprendreLabel: 'Lire la capsule invalidité',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Voir mon trou',
    ctaHeadline: 'Ton trou vs dépenses, c’est clair sur papier.',
    ctaSubline:
      '15 min : on valide le %, le délai, et la définition (« ta job » vs « n’importe quelle job »). Sans pression.',
  },
  {
    slug: 'retraite-reer-celi',
    atmosphere: 'retraite',
    heroChips: ['REER · CELI', 'Ordre du prochain dollar'],
    processSteps: ['Répondre', 'Voir l’ordre', 'Valider en 15 min'],
    /** Alias URL (ex. /campagnes/reer-ou-celi → même landing). */
    aliases: ['reer-ou-celi', 'reer-celi'],
    badge: 'Retraite',
    title: 'REER ou CELI : où va le prochain dollar ?',
    seoTitle: 'REER et CELI pour la retraite | Conseiller en sécurité financière',
    seoDescription:
      'Clarifier l’ordre REER / CELI selon impôts, horizon et liquidité. Outil illustratif. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'En quelques réponses, tu vois où part ton prochain dollar entre REER et CELI. Gratuit, sans compte. Ensuite 15 min si tu veux coller ça à ton matching.',
    bullets: [
      'Tu sors avec un ordre illustratif REER / CELI — et le partage de ton prochain dollar.',
      'Un match employeur peut tout changer : on le chiffre souvent avant le débat perso.',
      'En 15 minutes, on colle l’ordre à tes plafonds, ton matching et ce que t’as déjà.',
    ],
    legalNote:
      'Ce contenu est informatif et ne constitue pas une opinion personnalisée. Les rendements ne sont pas garantis. Pierre-Olivier Caouette est conseiller en sécurité financière avec iA Groupe financier.',
    faq: [
      {
        question: 'Faut-il toujours maximiser le REER en premier ?',
        answer:
          'Pas toujours. Ça dépend de ton taux d’imposition, de tes projets à court terme et de ton besoin de liquidité. L’outil donne une piste éducative — pas une recommandation personnalisée.',
      },
      {
        question: 'Et si mon employeur matche mon REER ?',
        answer:
          'Un match employeur, c’est souvent de l’argent « gratuit » sur la portion cotisée — ça peut peser lourd dans l’ordre du prochain dollar. L’outil ne calcule pas ton % de match : en 15 minutes, on regarde les règles de ton régime. Illustration seulement — pas un conseil sur mesure.',
      },
      {
        question: 'CELI et CELIAPP, c’est la même chose ?',
        answer:
          'Non. Le CELI est une enveloppe générale (droits annuels, retraits non imposables). Le CELIAPP vise l’achat d’une première propriété, avec ses propres règles et plafonds. Si ton projet c’est surtout la maison, regarde aussi la campagne CELIAPP — ici on priorise REER vs CELI « classique » pour la retraite / l’épargne flexible.',
      },
      {
        question: 'Le PDF, c’est un conseil de placement ?',
        answer:
          'Non. C’est un résumé illustratif de tes réponses. Les choix de produits et de montants se font après analyse de ton dossier.',
      },
    ],
    apprendrePath: '/apprendre/reer-ferr',
    apprendreLabel: 'Capsules REER · CELI',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Voir où va mon prochain dollar',
    /** RDV seulement après le résultat de l’outil. */
    hideHeroRdv: true,
    hideMidCta: true,
    /** Mobile : pas de landing — wizard direct + CTA à la fin. */
    mobileToolFirst: true,
    ctaHeadline: 'Tu veux valider ton ordre ?',
    ctaSubline:
      'Un conseiller colle ton ordre à ton matching et tes plafonds en 15 minutes.',
    toolIntro: '',
  },
  {
    slug: 'maladie-grave',
    atmosphere: 'capital',
    heroChips: ['Invalidité ≠ MG', 'Capital illustratif'],
    processSteps: ['Estimer', 'Lire l’écart', 'Clarifier la brochure'],
    badge: 'Maladie grave',
    title: 'Maladie grave ≠ invalidité — un capital à part',
    seoTitle: 'Assurance maladie grave | Conseiller en sécurité financière',
    seoDescription:
      'Estimer un capital maladie grave (3 blocs) et le distinguer de l’invalidité. Outil gratuit · Victoriaville.',
    promise:
      'Trois blocs concrets pour un ordre de grandeur — sans compte. L’invalidité paie un revenu ; la MG, un capital.',
    bullets: [
      'Remplacer un moment le revenu du/de la conjoint(e) — s’il ou elle coupe ses heures',
      'Soins non couverts — ordre de grandeur ~33 000 $ (SCC 2024, ajustable)',
      'Surplus qualité de vie + ce que t’as déjà (collective ou individuel)',
    ],
    faq: [
      {
        question: 'C’est la même chose que l’assurance invalidité ?',
        answer:
          'Non. L’invalidité remplace une partie du revenu pendant que tu ne peux plus travailler. La maladie grave peut verser un capital forfaitaire si le diagnostic et les conditions du contrat s’alignent. Deux jobs différentes — et pas interchangeables.',
      },
      {
        question: 'Ma collective couvre déjà la maladie grave ?',
        answer:
          'Parfois un petit capital, souvent avec conditions (maladies listées, délai de survie, exclusions). « J’ai déjà quelque chose » ≠ « c’est réglé ». En 15 min on ouvre ta brochure et on regarde ce qu’elle couvre vraiment.',
      },
      {
        question: 'Quelles maladies / quel délai de survie ?',
        answer:
          'Ça dépend entièrement du contrat. Pas une liste universelle. On le lit ensemble — Clarifier ≠ acheter.',
      },
      {
        question: 'Est-ce que ça remplace l’assurance vie ?',
        answer:
          'Non. La maladie grave te verse un montant de ton vivant si les conditions sont remplies. L’assurance vie protège surtout tes proches à ton décès.',
      },
      {
        question: 'Tout le monde en a besoin ?',
        answer:
          'Non. Ça dépend de tes liquidités, de ce que ton collectif couvre déjà, et de ta tolérance au risque. On le regarde ensemble, sans pression.',
      },
    ],
    apprendrePath: '/apprendre/assurance-maladie-grave',
    apprendreLabel: 'Lire la capsule maladie grave',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Estimer mon capital',
    ctaHeadline: 'Ton capital illustratif, on le lit ensemble',
    ctaSubline:
      '15 min — ta brochure collective, les exclusions, si un capital a du sens chez toi. Clarifier ≠ acheter.',
  },
  {
    slug: 'reee',
    atmosphere: 'reee',
    heroChips: ['SCEE', 'Subventions sur la table'],
    processSteps: ['Simuler', 'Voir ce qui reste', 'Relier au budget'],
    badge: 'REEE',
    title: 'REEE ouvert ≠ subventions maximisées',
    seoTitle: 'REEE et subventions (SCEE) | Outil gratuit | Victoriaville',
    seoDescription:
      'Compte ouvert ≠ maximisé. Entre l’âge et ton rythme : SCEE illustrative, reste avant le max à vie, PDF. Ensuite 15 min si tu veux. Pas un conseil personnalisé.',
    promise:
      'Âge + rythme → tu vois la SCEE, le reste avant ~7 200 $, et ce que tu laisses sur la table. PDF à garder ; 15 min si tu veux caler le cadre.',
    bullets: [
      'Compte ouvert ≠ subventions maximisées — le rythme compte autant que le compte.',
      'SCEE illustratif : ~20 ¢ par dollar sur les premiers ~2 500 $ / an (souvent ~500 $ / an), plafond à vie ~7 200 $.',
      'Tu repars avec un PDF clair — base pour 15 minutes si tu veux caler âge, budget, déjà en place.',
    ],
    faq: [
      {
        question: 'J’ai déjà un REEE à la banque — pourquoi un outil / un RDV ?',
        answer:
          'Ouvrir le compte, c’est une étape. Maximiser les aides publiques (SCEE, et au Québec parfois l’IQEE), ça dépend souvent du rythme et de ce qui est déjà reçu. L’outil te donne une photo nette illustrative. En 15 minutes, on relie ça à ton vrai compte — sans te vendre quelque chose sous pression.',
      },
      {
        question: 'Est-ce trop tard si mon enfant a déjà 10 ans ?',
        answer:
          'Pas forcément. Il reste souvent des années avant les études : tu peux encore cotiser et recevoir des subventions selon les règles en vigueur. L’outil te montre un ordre de grandeur ; on affine ton cas en rencontre.',
      },
      {
        question: 'C’est quoi la différence entre REEE et SCEE ?',
        answer:
          'Le REEE, c’est le compte. La SCEE, c’est la subvention fédérale (~20 % sur ce que tu mets, jusqu’à ~500 $ / an, plafond à vie illustratif ~7 200 $). Au Québec, d’autres aides (ex. IQEE) peuvent s’ajouter — à revalider.',
      },
      {
        question: 'Je mets plutôt 100–200 $ / mois — ça marche ?',
        answer:
          'Oui. L’outil peut raisonner en annuel (ex. 200 $/mois ≈ 2 400 $/an). L’idée, c’est de voir si tu t’approches du rythme qui maximise souvent la SCEE de base — pas de te culpabiliser.',
      },
      {
        question: 'Les chiffres de l’outil sont-ils un conseil ?',
        answer:
          'Non. C’est une illustration éducative (SCEE fédérale de base). Les programmes et montants évoluent ; une recommandation adaptée se fait après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/reee',
    apprendreLabel: 'Lire la capsule REEE',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Voir ce que je laisse sur la table',
    ctaHeadline: 'Tu laisses encore des subventions sur la table ?',
    ctaSubline:
      '15 min pour caler âge, budget, déjà en place. Calme. Concret. Zéro pression.',
  },
  {
    slug: 'comparateur-rendements',
    atmosphere: 'compare',
    heroChips: ['Banque | Modèles', 'Écart illustratif'],
    processSteps: ['Comparer', 'Voir l’écart', 'Coller à ton relevé'],
    badge: 'Rendements',
    title: 'À profil égal, l’écart se compose',
    seoTitle: 'Comparateur de rendements | Conseiller en sécurité financière',
    seoDescription:
      'Illustre banque vs portefeuilles modèles à même style de placement. Projection simple, PDF à garder. Pas un conseil personnalisé. Victoriaville.',
    promise:
      'Même montant, mêmes cotisations, même confort avec le risque — vois l’écart illustratif côte à côte.',
    bullets: [
      'Projection gratuite, sans compte : tu entres tes chiffres, tu vois les deux côtés',
      'Même style de placement des deux côtés — c’est ça « à profil égal »',
      'Illustration seulement (passés ≠ futurs), puis 15 minutes si tu veux coller ça à ton relevé',
    ],
    faq: [
      {
        question: 'Les chiffres garantissent-ils mon rendement futur ?',
        answer:
          'Non. Ce sont des illustrations à partir de taux d’exemple. Les produits et les marchés diffèrent ; rien n’est garanti. Passés ≠ futurs.',
      },
      {
        question: 'C’est quoi « à profil égal » ?',
        answer:
          'On compare deux projections avec le même confort face aux hauts et aux bas (prudent, équilibré ou croissance) et les mêmes montants. Ça isole l’effet du rendement illustratif — pas une recommandation de produit.',
      },
      {
        question: 'Dois-je passer par l’outil avant le rendez-vous ?',
        answer:
          'Utile pour arriver avec un chiffre en tête, mais pas obligatoire. On peut commencer directement par 15 minutes de clarification.',
      },
    ],
    apprendrePath: '/apprendre',
    apprendreLabel: 'Ajuster mon écart',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Comparer mon écart',
    ctaHeadline: 'Ton écart est clair — on le colle à ton relevé ?',
    ctaSubline: '15 minutes, sans pression. Illustration seulement — pas une garantie de rendement.',
    secondaryIsTool: true,
  },
  {
    slug: 'fonds-urgence',
    atmosphere: 'filet',
    heroChips: ['Filet d’abord', 'Écart · délai · rythme'],
    processSteps: ['Calculer', 'Lire l’écart', 'Planifier le rythme'],
    badge: 'Fonds d’urgence',
    title: 'Le filet avant d’accélérer l’investissement',
    seoTitle: 'Fonds d’urgence | Conseiller en sécurité financière',
    seoDescription:
      'Calcule combien viser pour ton fonds d’urgence, ce qu’il te manque, et en combien de mois. Contenu éducatif. Victoriaville.',
    promise:
      'En 2 minutes : ta cible, ce qui manque, et en combien de mois — avant d’accélérer CELI ou REER.',
    bullets: [
      'Cible claire : dépenses essentielles × 3 à 12 mois selon la stabilité du revenu',
      'Écart et délai : ce qu’il manque, et en combien de mois au rythme que tu indiques',
      'Accessible d’abord : pas le REER, pas un portefeuille volatil — ensuite on regarde le surplus',
    ],
    faq: [
      {
        question: 'Combien de mois viser ?',
        answer:
          'Souvent 3 à 6 mois de dépenses essentielles. Plus (9–12) si le revenu est variable, autonome, contractuel, ou s’il n’y a qu’un salaire au ménage. L’outil ci-dessus reste une illustration — pas un plan sur mesure.',
      },
      {
        question: 'La carte de crédit, c’est un fonds d’urgence ?',
        answer:
          'Non. La carte, c’est un prêt cher déguisé en solution rapide. Un vrai filet, c’est de l’argent à toi, accessible, calé sur tes dépenses — pas une limite de crédit.',
      },
      {
        question: 'Où garder cet argent ?',
        answer:
          'L’objectif, c’est la disponibilité : compte d’épargne, CPG rachetable, ou CELI en liquidités. Évite d’immobiliser le coussin dans des placements qui peuvent baisser juste quand tu en as besoin. Les détails dépendent de ta situation.',
      },
      {
        question: 'Je peux investir et construire le fonds en même temps ?',
        answer:
          'Souvent oui, avec des priorités. Sans filet accessible, un imprévu pousse vers la carte ou la vente au mauvais moment. Le bon dosage dépend du revenu, des dettes et du stress — on le regarde ensemble si tu veux.',
      },
      {
        question: 'C’est un conseil personnalisé ?',
        answer:
          'Non. Contenu éducatif et général. Une recommandation adaptée se fait après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/fonds-urgence',
    apprendreLabel: 'Lire la capsule fonds d’urgence',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Calculer mon filet',
    ctaHeadline: 'Ton écart est clair — et après ?',
    ctaSubline:
      'Où garer le coussin, quel rythme, quoi faire du surplus. 15 minutes, sans pression.',
  },
  {
    slug: 'celi-droits',
    atmosphere: 'celi',
    heroChips: ['Place restante', 'Urgence · Projet · LT'],
    processSteps: ['Estimer', 'Choisir l’usage', 'Planifier'],
    badge: 'CELI',
    title: 'Des droits CELI qui dorment — t’as vraiment regardé ce qu’il te reste ?',
    seoTitle: 'Droits CELI inutilisés — place restante | Victoriaville',
    seoDescription:
      'Estime la place restante dans ton CELI (droits cumulés vs plafond annuel), choisis un usage, puis clarifie en 15 min. Contenu éducatif. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Estime ta place restante en 2 minutes. Ensuite, colle un usage (urgence, projet, long terme) — ou pas.',
    bullets: [
      'Droits cumulés vs plafond de l’année : ce n’est pas la même chose',
      'Estime ta place en 3 chiffres — PDF à comparer avec Mon Dossier ARC',
      'Urgence, projet ou long terme : choisis un usage avant de « maxer »',
    ],
    faq: [
      {
        question: 'Les droits inutilisés disparaissent-ils en décembre ?',
        answer:
          'Non. En général, ils s’accumulent. Le plafond annuel, c’est une tranche ; ta place totale peut être plus grande si tu n’as pas cotisé avant. Le solde officiel : Mon Dossier ARC.',
      },
      {
        question: 'Où trouver mon « déjà cotisé » ?',
        answer:
          'Dans Mon Dossier ARC (section CELI) et/ou tes relevés d’émetteur. C’est la somme des cotisations, pas la valeur du compte : les gains ne consomment pas de droits. Si tu as fait des retraits, l’ARC recalcule — notre outil est une estimation d’ordre de grandeur.',
      },
      {
        question: 'Je dois tout maximiser cette année ?',
        answer:
          'Pas forcément. Ça dépend de ta trésorerie, de tes dettes et de tes priorités. « Maxer » sans objectif, c’est une intention — pas un plan.',
      },
      {
        question: 'CELI ou REER en premier ?',
        answer:
          'Ça dépend de ton horizon, de ta liquidité et de ta tranche d’imposition. Voir aussi la landing retraite REER/CELI — ou 15 minutes pour trancher selon ton dossier.',
      },
      {
        question: 'C’est un conseil personnalisé ?',
        answer:
          'Non. Contenu éducatif et estimation illustrative. Une recommandation adaptée se fait après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/celi',
    apprendreLabel: 'Lire la capsule CELI',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Estimer ma place',
    ctaHeadline: 'Ta place restante, c’est un chiffre. L’usage, c’est le plan.',
    ctaSubline: 'Clarifier ≠ cotiser demain. 15 minutes soft — CSF · Victoriaville.',
  },
  {
    slug: 'trop-jeune-assurance',
    atmosphere: 'score',
    heroChips: ['Score', 'Aujourd’hui · Projets'],
    processSteps: ['Cocher', 'Lire le score', 'Clarifier en 15 min'],
    aliases: ['trop-jeune-pour-assurer', 'trop-jeune'],
    badge: 'Assurance vie',
    title: '« Je suis trop jeune pour m’assurer » — vraiment ?',
    seoTitle: 'Assurance vie jeune adulte | Conseiller en sécurité financière',
    seoDescription:
      'Score illustratif : besoins d’aujourd’hui et projets déjà connus (hypothèque, famille) — pas l’âge. Contenu éducatif. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'L’âge sur la carte, c’est pas le filtre. Tes obligations — et ce que tu sais déjà qui s’en vient — oui. Score gratuit, sans compte.',
    bullets: [
      'Aujourd’hui : maison, enfants, qui dépend de ta paye, dettes',
      'Demain déjà connu : hypothèque prévue, famille prévue — ça compte aussi',
      'Score /100 + montant (présent + projets) + PDF — sans compte',
    ],
    faq: [
      {
        question: 'Sans enfants, ai-je besoin d’assurance vie ?',
        answer:
          'Parfois oui (hypothèque, conjoint, dettes, entreprise), parfois non. On regarde les obligations réelles — pas un réflexe de produit.',
      },
      {
        question: 'Pourquoi mon âge n’entre pas dans le score ?',
        answer:
          'Parce que le mythe « trop jeune » regarde la carte d’identité. Le vrai filtre, c’est qui dépend de ton revenu et ce qu’il reste à payer — plus les projets que tu connais déjà. L’âge reste un contexte (santé, coût relatif) — on le discute en rencontre, pas dans ce mini-score.',
      },
      {
        question: 'C’est plus cher / plus difficile si j’attends ?',
        answer:
          'Souvent, l’âge et la santé pèsent dans le coût et l’admissibilité — mais ça se discute au cas par cas, pas avec un chiffre magique ici. Le score ne calcule pas une prime. En 15 minutes, on clarifie ce qui est déjà « connu » chez toi (présent + projets) sans te pousser à acheter.',
      },
      {
        question: 'J’ai déjà de l’assurance via mon job / collective — ça compte ?',
        answer:
          'Oui, ça peut couvrir une partie. La collective change souvent si tu changes d’employeur, et les montants / définitions ne collent pas toujours à ton hypothèque ou à ta famille à venir. Le score ici n’inclut pas ta collective : en RDV, on peut croiser les deux sans payer deux fois pour rien.',
      },
      {
        question: 'C’est un conseil personnalisé ?',
        answer:
          'Non. Page éducative et illustration seulement. Toute recommandation se fait après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/assurance-vie-temporaire',
    apprendreLabel: 'Lire la capsule assurance vie temporaire',
    ctaLabel: 'Lire mon score en 15 min',
    heroToolLabel: 'Voir mon score',
    ctaHeadline: 'Ton score te chicotte ?',
    ctaSubline: '15 min pour lire présent + projets connus ensemble. Clarifier ≠ acheter.',
    toolIntro: 'Coche ton présent + tes projets connus. Le score bouge en live — sans compte.',
  },
  {
    slug: 'assurance-collective',
    atmosphere: 'livret',
    heroChips: ['Livret RH', 'Invalidité en 1er'],
    processSteps: ['Ouvrir le livret', 'Coche les cases', 'Démêler les flous'],
    badge: 'Assurance collective',
    title: 'Ton assurance collective te couvre… vraiment ?',
    seoTitle: 'Ton assurance collective te couvre vraiment ? | Conseiller en sécurité financière',
    seoDescription:
      'Checklist gratuite : invalidité (paliers), vie, départ. Mini résumé PDF. 15 min seulement si une case reste floue. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Ouvre le PDF RH. Coche invalidité (un % ou plusieurs paliers), vie, départ. Mini résumé sans compte — 15 min seulement si une case reste floue.',
    bullets: [
      'Invalidité : un %… ou plusieurs paliers (court / long terme), délai avant le premier chèque, et la vraie définition dans ton livret',
      'Vie, dentaire, médicaments : les plafonds réels — pas « ça me couvre »',
      'Si tu quittes : ce qui reste, ce qui tombe, et les trous à clarifier de ton bord',
    ],
    faq: [
      {
        question: 'Je dois vraiment ouvrir le livret de mon assurance collective ?',
        answer:
          'Oui — au moins invalidité, vie, santé, départ. L’outil te guide case par case ; tu sors avec un mini résumé PDF. Ou on le fait ensemble en 15 minutes, livret sous les yeux.',
      },
      {
        id: 'faq-livret',
        question: 'Où est mon livret ?',
        answer:
          'Souvent sur le portail RH ou chez l’assureur de ton employeur — pas seulement la petite carte. Cherche le PDF avec les montants et les délais. Sans ça, tu devines ; avec, tu sais.',
      },
      {
        question: 'Court terme / long terme — pourquoi deux % ?',
        answer:
          'Beaucoup de livrets ont des paliers : un % (et parfois une définition) pour les premiers mois, puis un autre plus tard. La checklist te force à noter ce que dit ton contrat — un seul % ou plusieurs paliers. Chaque régime est différent.',
      },
      {
        question: 'Ajouter une assurance = doubler pour rien ?',
        answer:
          'Non : l’idée c’est de combler les trous de ce que ton assurance collective t’offre déjà — pas d’empiler pour empiler. On regarde ce qui manque vraiment pour toi (employé).',
      },
      {
        question: 'À quoi ressemblent les 15 minutes ?',
        answer:
          'Tu arrives avec le livret (ou le PDF résumé). On ouvre les cases floues — surtout invalidité et départ. On clarifie. Pas de pitch produit obligatoire. Clarifier, c’est pas acheter.',
      },
    ],
    apprendrePath: '/apprendre/assurance-collective',
    apprendreLabel: 'Lire la capsule sur l’assurance collective',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Remplir la checklist',
    heroRdvLabel: 'Ou 15 min avec le livret',
    ctaHeadline: 'Des cases encore floues ? On ouvre le livret ensemble.',
    ctaSubline:
      '15 minutes, sans pression. Apporte ton PDF RH (ou ton résumé) — on clarifie, clarifier ≠ acheter.',
  },
  {
    slug: 'travailleur-autonome',
    atmosphere: 'autonome',
    heroChips: ['Pas de RH', 'Filet minimal'],
    processSteps: ['Coche le filet', 'Voir le trou', 'Clarifier la case'],
    badge: 'Autonome',
    title: 'Travailleur autonome : pas d’assurance collective fournie',
    seoTitle: 'Protections travailleur autonome | Conseiller en sécurité financière',
    seoDescription:
      'Checklist filet minimal : urgence, revenu, proches et hypothèque quand tu n’as pas d’assurance collective fournie. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Coche ton filet : liquidité, revenu, proches — quand le revenu varie et qu’il n’y a pas d’assurance collective fournie.',
    bullets: [
      'Les bons mois font oublier les mauvais — le filet, c’est toi qui le bâtis (pas de RH)',
      'Ordre clair : liquidité → revenu → proches / hypothèque → structure',
      'Checklist + PDF optionnel : état du filet et prochaine case à cocher',
    ],
    faq: [
      {
        question: 'Je peux me « payer » les mêmes protections qu’avec une assurance collective ?',
        answer:
          'On parle plutôt d’assurances de ton bord, adaptées à ta situation. Le détail dépend de ton revenu net et de ta structure — pas d’un régime employeur. Ce n’est pas « remplacer la collective ».',
      },
      {
        question: 'Par où commencer ?',
        answer:
          'Souvent liquidité (urgence + factures qui tiennent), puis protection du revenu, puis proches / hypothèque. L’outil te donne l’ordre des trous. 15 minutes pour y voir clair — Clarifier ≠ acheter.',
      },
      {
        question: 'C’est gratuit ? Il faut un compte ?',
        answer:
          'La checklist est gratuite. Pas de compte. Pas d’obligation de laisser ton courriel pour l’utiliser. Le PDF est optionnel.',
      },
      {
        question: 'Tu vends une assurance ici ?',
        answer:
          'Non. La page est éducative : tu coches, tu vois ton filet. Si une case te chicotte, on clarifie en 15 minutes. Clarifier ≠ acheter.',
      },
      {
        question: 'Mon revenu varie beaucoup — l’ordre change ?',
        answer:
          'L’ordre de base reste liquidité → revenu → proches → structure. Avec un revenu variable, la liquidité compte souvent encore plus (tenir les mauvais mois). On ajuste les montants et les priorités à ta situation — pas avec une formule magique sur la page.',
      },
    ],
    apprendrePath: '/apprendre/fonds-urgence',
    apprendreLabel: 'Lire la capsule fonds d’urgence',
    ctaLabel: 'Clarifier ces trous en 15 min',
    heroToolLabel: 'Coche ton filet',
    ctaHeadline: 'Une case te chicotte — revenu qui stoppe, hypo qui continue ?',
    ctaSubline:
      '15 min pour prioriser liquidité puis protection du revenu. Clarifier ≠ acheter.',
  },
  {
    slug: 'plan-global',
    atmosphere: 'plan',
    heroChips: ['Commence ici', 'Ordre clair'],
    processSteps: ['Cocher', 'Voir le n°1', 'Ancrer en 15 min'],
    aliases: ['plan-financier-global', 'plan-financier'],
    badge: 'Vision globale',
    title: 'Arrêter d’empiler des produits sans plan',
    seoTitle: 'Planification financière globale | Conseiller en sécurité financière',
    seoDescription:
      'Coche ce qui est vrai chez toi et reçois un ordre d’attaque simple : urgent, important, plus tard. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Des produits côte à côte, c’est un tiroir — pas une feuille de route. Coche : on range urgent → important → plus tard.',
    bullets: [
      'Arrêter de tout faire un peu — un seul front à la fois',
      'Voir quoi est urgent, quoi peut attendre sans culpabilité',
      'Repartir avec un ordre clair — brouillon éducatif, pas un plan sur mesure',
    ],
    faq: [
      {
        question: 'Je peux utiliser seulement l’outil, sans rendez-vous ?',
        answer:
          'Oui. L’ordre d’attaque est gratuit, sans compte et sans formulaire. Le RDV est optionnel — seulement si tu veux coller ça à ta vraie vie.',
      },
      {
        question: 'C’est un plan personnalisé / sur mesure ?',
        answer:
          'Non. C’est un brouillon éducatif qui illustre une logique (urgent → important → plus tard). Un plan réel part de ton portrait complet, en rencontre.',
      },
      {
        question: 'Pourquoi un « ordre d’attaque » ?',
        answer:
          'Parce que tout faire en même temps mène souvent nulle part. Filet, dettes chères et protection du revenu passent souvent avant d’optimiser l’épargne. Logique éducative — pas un conseil personnalisé.',
      },
      {
        question: 'C’est long une planification ?',
        answer:
          'La première rencontre exploratoire dure souvent 15–30 minutes. Ensuite, étape par étape — pas une vente de pile de produits en une shot.',
      },
      {
        question: 'Tu vends un produit précis ici ?',
        answer:
          'Non. Cette page est éducative. Les recommandations viennent après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre',
    apprendreLabel: 'Voir les capsules Apprendre',
    heroToolLabel: 'Voir mon ordre d’attaque',
    ctaLabel: 'Ancrer mon n°1 — 15 min',
    ctaHeadline: 'Tu as un n°1 — on l’attaque ensemble ?',
    ctaSubline:
      '15 minutes, soft, zéro pitch. On colle ton ordre à ta vraie vie. Tu peux apporter ton PDF.',
  },
  {
    slug: 'succession-bases',
    atmosphere: 'succession',
    heroChips: ['Liquidité', 'CSF · notaire'],
    processSteps: ['Cocher', 'Voir les trous', 'Prioriser'],
    /** Alias URL (ex. /campagnes/succession → même landing). */
    aliases: ['succession'],
    badge: 'Succession',
    title: 'Ton portrait successoral gratuit, en 6 questions',
    seoTitle: 'Bases de la succession | Conseiller en sécurité financière',
    seoDescription:
      'Checklist liquidité et succession : trous à voir avant le « plus tard ». Contenu éducatif. Conseiller en sécurité financière à Victoriaville. Ne remplace pas un notaire.',
    promise:
      'Coche ce qui est vrai aujourd’hui. Tu vois tout de suite les trous à combler. Sans compte, sans rendez-vous. Le notaire reste essentiel pour le juridique.',
    ctaMicro: 'Tu verras les trous en 2 minutes.',
    bullets: [
      'Qui a besoin d’argent vite les premiers mois ? La liquidité n’est pas la même chose qu’une maison ou un REER sur papier.',
      'Les bénéficiaires sont-ils à jour ? Vérifie polices, REER, CELI et régime collectif.',
      'Le testament et les contrats se parlent-ils ?',
    ],
    legalNote:
      'Ce contenu est informatif et ne constitue pas une opinion personnalisée. Les rendements ne sont pas garantis. Pierre-Olivier Caouette est conseiller en sécurité financière avec iA Groupe financier.',
    faq: [
      {
        question: 'Tu remplaces le notaire ?',
        answer:
          'Non. On clarifie le volet sécurité financière : liquidité, revenu / dettes, bénéficiaires. Le notaire reste central pour le testament et le cadre légal.',
      },
      {
        question: 'En 15 minutes, on fait quoi ?',
        answer:
          'On lit ta checklist ensemble : ce qui est flou côté argent accessible et bénéficiaires, et ce qui doit aller chez le notaire. Pas de pitch produit. Clarifier, c’est pas acheter.',
      },
      {
        question: 'C’est payant, l’appel ?',
        answer:
          'L’appel découverte de 15 minutes est sans frais et sans pression. Si une suite est pertinente, on te l’explique clairement avant.',
      },
      {
        question: 'Avoir une maison et des placements, ça suffit ?',
        answer:
          'Pas forcément. Sur le papier ça fait « en ordre » ; dans la vraie vie, la famille a souvent besoin d’argent accessible tout de suite. Liquidité ≠ patrimoine sur papier.',
      },
      {
        question: 'C’est seulement pour les grandes fortunes ?',
        answer:
          'Non. Une hypothèque, des enfants ou une entreprise suffisent souvent à justifier de la clarté.',
      },
    ],
    apprendrePath: '/apprendre/succession-bases',
    apprendreLabel: 'Lire la capsule succession',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Remplir la checklist',
    /** RDV seulement après le résultat de la checklist. */
    hideHeroRdv: true,
    hideMidCta: true,
    toolIntro: '',
  },
  {
    slug: 'hypotheque-assurance-vie',
    atmosphere: 'hypo',
    heroChips: ['Banque vs famille', 'Écart au-delà du prêt'],
    processSteps: ['Estimer', 'Voir l’écart', 'Clarifier en 15 min'],
    /** Variantes courtes → même landing fusionnée. */
    aliases: [
      'assurance-hypothecaire',
      'assurance-hypotheque',
      'assurance-creancier',
      'hypothecaire-banque-vs-privee',
    ],
    badge: 'Assurance hypothécaire',
    title: 'Assurance de la banque ou protection pour la famille ?',
    seoTitle:
      'Assurance hypothécaire banque vs personnelle | Conseiller en sécurité financière',
    seoDescription:
      'Comparer l’assurance du prêteur et une protection personnelle : coût relatif, bénéficiaire, flexibilité — puis estimer un capital pour la famille. Contenu éducatif. Victoriaville.',
    promise:
      'D’abord, estime ce qu’il faudrait vraiment aux proches — au-delà du solde. Ensuite, compare banque vs perso.',
    bullets: [
      'Banque / prêteur : couverture souvent liée au solde qui diminue ; le coût « par dollar » peut grimper — et la prime peut être revue aux renouvellements*',
      'Personnel : bénéficiaires choisis, capital que tu contrôles, souvent portable après l’hypothèque',
      'Estimateur : solde + dettes + revenu de transition + imprévus → montant illustratif pour la famille',
    ],
    faq: [
      {
        question: 'C’est la même chose que l’assurance vie ?',
        answer:
          'Pas exactement. L’assurance créancier vise surtout à rembourser le prêteur. Une protection personnelle est pensée pour tes bénéficiaires, avec d’autres règles de durée, de montant et de portabilité.',
      },
      {
        question: 'Pourquoi le coût « augmente » si ma prime ne change pas ?',
        answer:
          'Si la prime reste semblable pendant que le solde (et donc souvent la couverture) diminue, tu paies un prix relatif plus élevé pour chaque dollar de protection. Illustration éducative — ton contrat peut différer.',
      },
      {
        question: 'La prime du prêteur peut-elle monter aux renouvellements ?',
        answer:
          'Selon le contrat et le prêteur, la prime peut rester semblable ou être revue au renouvellement*. Ce n’est pas automatique partout — d’où l’intérêt de lire ta police et de comparer les deux logiques avant de décider.',
      },
      {
        question: 'Faut-il assurer 100 % du solde seulement ?',
        answer:
          'Pas automatiquement. On regarde aussi le quotidien des proches : autres dettes, revenu de transition, imprévus. L’outil compare « juste le solde » et un total illustratif pour la famille.',
      },
      {
        question: 'Je dois annuler celle de la banque ?',
        answer:
          'Pas automatiquement. On compare d’abord les deux logiques, puis ta situation. Remplacer ou modifier une protection liée au prêt dépend du prêteur et du contrat* — cette page ne remplace pas la lecture de ta police ni un conseil personnalisé.',
      },
    ],
    apprendrePath: '/apprendre/assurance-vie-temporaire',
    apprendreLabel: 'Lire la capsule assurance vie temporaire',
    ctaLabel: 'Réserver 15 minutes',
    heroToolLabel: 'Voir mon écart solde → famille',
    ctaHeadline: 'On regarde ton écart solde → famille',
    ctaSubline: '15 minutes, éducatif — tu gardes ton PDF. Sans pression.',
  },
  {
    slug: 'programme-mra',
    atmosphere: 'mra',
    heroChips: ['PME', 'Collective ≠ MRa', 'Contrats individuels'],
    processSteps: ['Voir le fit', 'Lire le score', 'Demander une présentation'],
    aliases: ['mra', 'assurance-mra', 'mra-pme', 'collective-alternative-pme'],
    badge: 'Programme MRa',
    title: 'Offrir de l’assurance à ton équipe — sans usine à gaz',
    seoTitle:
      'Programme MRa | Alternative collective pour PME — Victoriaville',
    seoDescription:
      'Fit check gratuit pour décideurs PME. Offre l’accès à des protections individuelles au choix, peu de gestion. Demande une présentation — conseiller en sécurité financière.',
    promise:
      'Tu proposes l’accès. Tes employés choisissent avec un conseiller. Toi : peu de gestion, contribution optionnelle. Pensé pour les décideurs PME — pas une collective traditionnelle.',
    bullets: [
      'Flexibilité : tu cotises ou non (%, plafond, catégories) — eux choisissent leurs protections',
      'Simplicité : tu ne construis pas un régime complexe ; preuves d’assurabilité réduites*',
      'Rapidité : ~2 rencontres entreprise + 30–45 min / personne intéressée',
    ],
    faq: [
      {
        question: 'C’est la même chose qu’une assurance collective ?',
        answer:
          'Non. MRa repose sur des contrats individuels proposés via l’entreprise. L’employé choisit ses protections avec un conseiller ; ton rôle reste surtout l’offre (et éventuellement une contribution).',
      },
      {
        question: 'Est-ce que je dois cotiser obligatoirement ?',
        answer:
          'Non. La formule peut être offerte sans contribution. Tu peux aussi choisir un % ou un plafond par personne.',
      },
      {
        question: 'Mes employés vont-ils me coller leurs infos médicales ?',
        answer:
          'Non côté employeur : les dossiers et la sélection médicale se gèrent avec le conseiller / l’assureur, pas dans ton bureau RH. Tu offres l’accès ; eux discutent de leur situation en privé.',
      },
      {
        question: 'C’est long à mettre en place ?',
        answer:
          'Typiquement ~2 rencontres avec l’entreprise, puis 30 à 45 minutes par personne intéressée. Entrée en vigueur souvent le 1er du mois suivant — sous conditions et acceptation du dossier.',
      },
      {
        question: 'Pour quelle taille d’équipe ?',
        answer:
          'Pensé surtout pour les petites entreprises (souvent ~8–20, parfois plus petit ou un peu plus grand). L’outil te donne une lecture fit ; on valide ensemble à la présentation. Ce n’est pas un régime collectif traditionnel « usine ».',
      },
    ],
    apprendrePath: '/campagnes/assurance-collective',
    apprendreLabel: 'Employé avec un livret RH ?',
    ctaType: 'form',
    ctaLabel: 'Recevoir une présentation',
    ctaMicro: 'Je te rappelle — sans Bookings ni pression',
    heroToolLabel: 'Voir si MRa colle à ma PME',
    ctaHeadline: 'Demande une présentation MRa',
    ctaSubline:
      'Présentation → ~2 rencontres entreprise → 30–45 min / personne. Infos médicales ≠ côté employeur.',
    toolIntro:
      'Remplis l’outil — tu vois ton fit, puis tu demandes une présentation.',
    leadSubject: 'Campagne MRa — présentation PME',
    leadMessagePlaceholder:
      'Ex. : on est ~10, pas de collective / trop chère — je veux voir si MRa colle…',
    leadFormTitle: 'Tes coordonnées pour le rappel',
    leadFormSubline:
      'Je te recontacte pour une présentation adaptée à ta PME. Sans engagement.',
    leadRequireCompany: true,
    leadRequireMessage: false,
    leadCompanyLabel: 'Nom de l’entreprise',
    leadCompanyPlaceholder: 'Ex. Atelier XYZ',
    leadPhoneHint: 'Idéal pour le rappel',
    leadSuccessTitle: 'Demande reçue',
    leadSuccessBody:
      'Merci. Je te rappelle rapidement pour caler une présentation MRa — sans Bookings.',
    leadTrustLine:
      'Tes infos servent uniquement au rappel. Contenu éducatif — pas un conseil personnalisé. CSF · Victoriaville.',
  },
];

export function getCampagneAdsLanding(slug) {
  if (!slug) return null;
  const direct = campagneAdsLandings.find((item) => item.slug === slug);
  if (direct) return direct;
  return (
    campagneAdsLandings.find((item) => (item.aliases || []).includes(slug)) ||
    null
  );
}

/**
 * Lien RDV campagne (page dédiée + iframe Bookings ads) avec UTM.
 * Si la landing a déjà des UTM Meta (clic pub), on les conserve.
 */
export function buildCampagneRdvPath(slug, incomingSearch = '') {
  const incoming = new URLSearchParams(
    typeof incomingSearch === 'string' ? incomingSearch.replace(/^\?/, '') : ''
  );
  const params = new URLSearchParams({
    utm_source: incoming.get('utm_source') || 'meta',
    utm_medium: incoming.get('utm_medium') || 'paid',
    utm_campaign: incoming.get('utm_campaign') || CAMPAGNE_ADS_UTM_CAMPAIGN,
    utm_content: incoming.get('utm_content') || `${slug}_landing`,
  });
  return `/rendez-vous/campagne?${params.toString()}`;
}
