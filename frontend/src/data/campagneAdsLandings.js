/**
 * Landings de conversion pour la campagne Meta CBO multi-sujets.
 * Slug = segment d’URL /campagnes/:slug
 */

export const CAMPAGNE_ADS_UTM_CAMPAIGN = 'cbo_catalog_2026';

export const campagneAdsLandings = [
  {
    slug: 'celiapp',
    badge: 'CELIAPP',
    title: 'CELIAPP et première propriété',
    seoTitle: 'CELIAPP et achat d’une première propriété | Conseiller en sécurité financière',
    seoDescription:
      'Comprendre le CELIAPP pour une mise de fonds : plafonds, admissibilité et prochaines étapes. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Voir combien ta mise de fonds peut grandir avec le CELIAPP — chiffres clairs, sans jargon.',
    bullets: [
      'Projeter ta mise de fonds avec les plafonds (8 000 $ / an, 40 000 $ à vie — illustratifs)',
      'Comprendre que CELIAPP ≠ CELI : règles et retraits différents',
      'Repérer ce qu’il faut vérifier avant d’ouvrir ou de cotiser (qui a le droit, retrait)',
    ],
    faq: [
      {
        question: 'Est-ce que le CELIAPP remplace le CELI ?',
        answer:
          'Non. Ce sont deux comptes différents. Le CELIAPP vise surtout une 1re propriété ; le CELI est plus souple pour d’autres projets. Selon ton horizon, on peut les combiner — à clarifier selon ta situation.',
      },
      {
        question: 'Qui peut ouvrir un CELIAPP ?',
        answer:
          'En général : résident canadien, âge admissible, et critères de « premier acheteur » selon les règles en vigueur. Les détails évoluent — valide toujours avant d’ouvrir ou de cotiser. Cette page ne remplace pas une vérification personnalisée.',
      },
      {
        question: 'C’est un conseil personnalisé ?',
        answer:
          'Cette page est éducative et générale. Une recommandation adaptée à ton dossier se fait seulement après une analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/celiapp',
    apprendreLabel: 'Lire la capsule CELIAPP',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'hypotheque-assurance-vie',
    badge: 'Assurance vie',
    title: 'Couvrir l’hypothèque avec l’assurance vie',
    seoTitle: 'Assurance vie et hypothèque | Conseiller en sécurité financière',
    seoDescription:
      'Estimer un capital pour la maison, les dettes et le quotidien — et comparer avec « juste le solde » (logique banque). Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Chiffrer ce qu’il faudrait aux proches pour garder la maison — au-delà du seul solde du prêt.',
    bullets: [
      'Banque vs personnel : protéger le prêt n’est pas la même chose que protéger la famille',
      'Estimateur : solde + dettes + revenu de transition + imprévus → un montant illustratif',
      'PDF à garder : comparer « juste le solde » et le total pour les proches',
    ],
    faq: [
      {
        question: 'L’assurance de la banque suffit-elle ?',
        answer:
          'Parfois non. Elle est souvent liée au prêt, au créancier, et aux conditions de la banque. Une couverture personnelle peut offrir plus de flexibilité pour la famille — à évaluer au cas par cas.',
      },
      {
        question: 'Faut-il assurer 100 % du solde ?',
        answer:
          'Pas automatiquement. On regarde le solde, les revenus du conjoint, les autres dettes et les objectifs. L’outil ci-dessus est une illustration : pas un conseil personnalisé.',
      },
    ],
    apprendrePath: '/apprendre/assurance-vie-temporaire',
    apprendreLabel: 'Lire la capsule assurance vie temporaire',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'assurance-invalidite',
    badge: 'Invalidité',
    title: 'Si le salaire s’arrête : le trou de ton assurance collective',
    seoTitle: 'Assurance invalidité | Conseiller en sécurité financière',
    seoDescription:
      'Mesure le trou entre ce que ton assurance collective t’offre et tes dépenses : %, délai d’attente, coussin. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Voir ce que ton assurance collective t’offre vraiment — %, délai, et le trou vs tes dépenses qui continuent.',
    bullets: [
      'Ce que ton assurance collective t’offre : % du salaire et délai avant le premier chèque',
      'Le trou mensuel vs tes dépenses qui, elles, n’arrêtent pas',
      'Le coussin à prévoir pendant l’attente — souvent 30 à 90 jours sans chèque',
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
    ],
    apprendrePath: '/apprendre/assurance-invalidite',
    apprendreLabel: 'Lire la capsule invalidité',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'retraite-reer-celi',
    /** Alias URL (ex. /campagnes/reer-ou-celi → même landing). */
    aliases: ['reer-ou-celi', 'reer-celi'],
    badge: 'Retraite',
    title: 'REER ou CELI : où va le prochain dollar ?',
    seoTitle: 'REER et CELI pour la retraite | Conseiller en sécurité financière',
    seoDescription:
      'Clarifier l’ordre REER / CELI selon impôts, horizon et liquidité. Outil illustratif + PDF. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Quatre réponses → un ordre illustratif (et un partage du montant mensuel). Pas de jargon, pas de pression.',
    bullets: [
      'REER = déduction maintenant, impôt plus tard · CELI = cotise après impôt, retire sans impôt',
      'Horizon court ou besoin d’accès → souvent CELI d’abord ; tranche élevée + long terme → souvent REER',
      'Tu repars avec un résumé PDF à garder — base claire pour 15 minutes',
    ],
    faq: [
      {
        question: 'Faut-il toujours maximiser le REER en premier ?',
        answer:
          'Pas toujours. Ça dépend de ton taux d’imposition, de tes projets à court terme et de ton besoin de liquidité. L’outil donne une piste éducative — pas une recommandation personnalisée.',
      },
      {
        question: 'Le PDF, c’est un conseil de placement ?',
        answer:
          'Non. C’est un résumé illustratif de tes réponses. Les choix de produits et de montants se font après analyse de ton dossier.',
      },
    ],
    apprendrePath: '/apprendre/reer-ferr',
    apprendreLabel: 'Lire la capsule REER / FERR',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'maladie-grave',
    badge: 'Maladie grave',
    title: 'Maladie grave ≠ invalidité — un capital à part',
    seoTitle: 'Assurance maladie grave | Conseiller en sécurité financière',
    seoDescription:
      'Estimer un capital maladie grave et le distinguer de l’invalidité. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Estimer un capital : remplacer le revenu du conjoint, les soins non couverts, et un surplus pour la qualité de vie.',
    bullets: [
      'Remplacement du revenu du/de la conjoint(e) pendant X mois',
      'Soins non couverts (ordre de grandeur ~33 000 $ — SCC 2024, ajustable)',
      'Surplus qualité de vie (voyage, bucket list…) + ce que tu as déjà couvert',
    ],
    faq: [
      {
        question: 'C’est la même chose que l’assurance invalidité ?',
        answer:
          'Non. L’invalidité remplace une partie du revenu pendant que tu ne peux plus travailler. La maladie grave peut verser un capital forfaitaire si le diagnostic et les conditions du contrat s’alignent. Deux jobs différentes — et pas interchangeables.',
      },
      {
        question: 'Est-ce que ça remplace l’assurance vie ?',
        answer:
          'Non. La maladie grave te verse un montant de ton vivant si les conditions du contrat sont remplies. L’assurance vie protège surtout tes proches à ton décès.',
      },
      {
        question: 'Tout le monde en a besoin ?',
        answer:
          'Non. Ça dépend de tes liquidités, de ce que ton assurance collective couvre déjà, et de ta tolérance au risque. On le regarde ensemble, sans pression.',
      },
    ],
    apprendrePath: '/apprendre/assurance-maladie-grave',
    apprendreLabel: 'Lire la capsule maladie grave',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'reee',
    badge: 'REEE',
    title: 'Études des enfants : le gouvernement peut ajouter ~20 %',
    seoTitle: 'REEE et subventions études | Conseiller en sécurité financière',
    seoDescription:
      'Voir ce que tu mets, ce que le gouvernement ajoute (SCEE), et ce qui reste avant le max. Outil + PDF. Victoriaville.',
    promise:
      'Entre l’âge et combien tu mets — vois les subventions, le total, et un PDF à garder. Sans jargon.',
    bullets: [
      'REEE = compte pour les études · SCEE = ~20 ¢ de plus par dollar (max ~500 $ / an)',
      'Repère le rythme ~2 500 $ / an qui maximise souvent la subvention fédérale',
      'Tu repars avec un résumé PDF — base claire pour 15 minutes',
    ],
    faq: [
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
        question: 'Les chiffres de l’outil sont-ils un conseil ?',
        answer:
          'Non. C’est une illustration éducative. Les programmes et montants évoluent ; une recommandation adaptée se fait après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/reee',
    apprendreLabel: 'Lire la capsule REEE',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'comparateur-rendements',
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
    apprendrePath: '/outils/comparateur-rendements',
    apprendreLabel: 'Voir mon écart',
    ctaLabel: 'Réserver 15 minutes',
    secondaryIsTool: true,
  },
  {
    slug: 'fonds-urgence',
    badge: 'Fonds d’urgence',
    title: 'Le filet avant d’accélérer l’investissement',
    seoTitle: 'Fonds d’urgence | Conseiller en sécurité financière',
    seoDescription:
      'Calcule combien viser pour ton fonds d’urgence, ce qu’il te manque, et en combien de mois. Contenu éducatif. Victoriaville.',
    promise:
      'Chiffrer ton coussin : cible, écart, délai — avant d’accélérer CELI, REER ou placements.',
    bullets: [
      'Cible claire : dépenses essentielles × 3 à 12 mois selon la stabilité du revenu',
      'Écart et délai : ce qu’il manque, et en combien de mois au rythme que tu indiques',
      'Rappel : argent accessible (pas le REER, pas un portefeuille volatil) — PDF à garder',
    ],
    faq: [
      {
        question: 'Combien de mois viser ?',
        answer:
          'Souvent 3 à 6 mois de dépenses essentielles. Plus (9–12) si le revenu est variable, autonome, contractuel, ou s’il n’y a qu’un salaire au ménage. L’outil ci-dessus reste une illustration — pas un plan sur mesure.',
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
  },
  {
    slug: 'celi-droits',
    badge: 'CELI',
    title: 'Des droits CELI qui dorment, ça coûte cher en silence',
    seoTitle: 'Droits CELI inutilisés | Conseiller en sécurité financière',
    seoDescription:
      'Estimer la place restante dans ton CELI : droits cumulés, plafond annuel, et à quoi servirait vraiment cet argent. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Voir ce qu’il te reste vraiment à cotiser — et coller un objectif avant de « maxer ».',
    bullets: [
      'Droits cumulés vs plafond de l’année : ce n’est pas la même chose',
      'Estimer la place restante en 3 chiffres, avec un PDF à comparer à Mon Dossier ARC',
      'Urgence, projet ou long terme : décider à quoi sert l’argent avant de cotiser',
    ],
    faq: [
      {
        question: 'Les droits inutilisés disparaissent-ils en décembre ?',
        answer:
          'Non. En général, ils s’accumulent d’une année à l’autre. Le plafond annuel, c’est une tranche ; ta place totale peut être plus grande si tu n’as pas cotisé avant. Le solde officiel est dans Mon Dossier ARC.',
      },
      {
        question: 'Je dois tout maximiser cette année ?',
        answer:
          'Pas forcément. Ça dépend de ta trésorerie, de tes dettes et de tes priorités. « Maxer » sans objectif, c’est une intention — pas un plan. On le regarde ensemble.',
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
  },
  {
    slug: 'trop-jeune-assurance',
    badge: 'Assurance vie',
    title: '« Je suis trop jeune pour m’assurer » — vraiment ?',
    seoTitle: 'Assurance vie jeune adulte | Conseiller en sécurité financière',
    seoDescription:
      'Score illustratif : besoins d’aujourd’hui et projets déjà connus (hypothèque, famille) — pas l’âge. Contenu éducatif. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Teste le mythe : score sur tes obligations actuelles et tes projets déjà connus (hypothèque, famille) — l’âge n’entre pas dans le calcul.',
    bullets: [
      'Aujourd’hui : maison, enfants, qui dépend de ta paye, dettes',
      'Demain déjà connu : hypothèque prévue, famille prévue — ça compte aussi',
      'Montant illustratif + PDF — temporaire, pas une « prison » à vie',
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
          'Parce que le mythe « trop jeune » regarde la carte d’identité. Le vrai filtre, c’est qui dépend de ton revenu et ce qu’il reste à payer. L’âge reste un contexte (santé, coût relatif) — on le discute en rencontre, pas dans ce mini-score.',
      },
      {
        question: 'C’est un conseil personnalisé ?',
        answer:
          'Non. Page éducative et illustration seulement. Toute recommandation se fait après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre/assurance-vie-temporaire',
    apprendreLabel: 'Lire la capsule assurance vie temporaire',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'assurance-collective',
    badge: 'Assurance collective',
    title: 'Ce que ton assurance collective t’offre',
    seoTitle: 'Ce que ton assurance collective t’offre | Conseiller en sécurité financière',
    seoDescription:
      'Mini résumé de ton assurance collective : invalidité, vie, dentaire, départ — téléchargeable en PDF. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Ouvre ton livret. Remplis les cases. Tu repars avec un mini résumé clair de ton assurance collective — en PDF, à garder.',
    bullets: [
      'Invalidité : combien de ton salaire, après combien de jours, et selon quelle règle',
      'Vie, dentaire, médicaments : les vrais plafonds de ton assurance collective — pas « ça me couvre »',
      'Si tu quittes : ce qui reste, ce qui tombe, et les trous à combler de ton bord',
    ],
    faq: [
      {
        question: 'Je dois vraiment ouvrir le livret de mon assurance collective ?',
        answer:
          'Oui, au moins les pages qui comptent (invalidité, vie, santé, départ). L’outil te guide case par case : tu remplis, tu sors avec un mini résumé PDF. Ou on le fait ensemble en 15 minutes.',
      },
      {
        question: 'Où est mon livret ?',
        answer:
          'Souvent sur le portail RH ou chez l’assureur de ton employeur — pas seulement la petite carte. Cherche le PDF avec les montants et les délais. Sans ça, tu devines ; avec, tu sais ce que ton assurance collective t’offre vraiment.',
      },
      {
        question: 'Ajouter une assurance = doubler pour rien ?',
        answer:
          'Non : l’idée c’est de combler les trous de ce que ton assurance collective t’offre déjà, pas d’empiler pour empiler. On regarde ce qui manque vraiment.',
      },
    ],
    apprendrePath: '/apprendre/assurance-collective',
    apprendreLabel: 'Lire la capsule sur l’assurance collective',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'travailleur-autonome',
    badge: 'Autonome',
    title: 'Travailleur autonome : pas d’assurance collective fournie',
    seoTitle: 'Protections travailleur autonome | Conseiller en sécurité financière',
    seoDescription:
      'Checklist filet minimal : urgence, revenu, proches et hypothèque quand tu n’as pas d’assurance collective fournie. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Voir ce qui est en place — et la prochaine étape — quand tu es ton propre boss.',
    bullets: [
      'Pas d’assurance collective fournie : chaque trou, c’est toi qui assumes',
      'Ordre clair : liquidité → revenu → proches / hypothèque → structure',
      'Checklist + PDF : état du filet et prochaines cases à cocher',
    ],
    faq: [
      {
        question: 'Je peux me « payer » les mêmes protections qu’avec une assurance collective ?',
        answer:
          'On parle plutôt d’assurances de ton bord, adaptées à ta situation. Le détail dépend de ton revenu net et de ta structure — pas d’un régime employeur.',
      },
      {
        question: 'Par où commencer ?',
        answer:
          'Souvent liquidité (urgence + factures), puis protection du revenu, puis proches / hypothèque. L’outil te donne l’ordre des trous. 15 minutes pour y voir clair.',
      },
    ],
    apprendrePath: '/apprendre/assurance-invalidite',
    apprendreLabel: 'Lire la capsule invalidité',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'plan-global',
    badge: 'Vision globale',
    title: 'Arrêter d’empiler des produits sans plan',
    seoTitle: 'Planification financière globale | Conseiller en sécurité financière',
    seoDescription:
      'Coche ce qui est vrai chez toi et reçois un ordre d’attaque simple : urgent, important, plus tard. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Des produits côte à côte ≠ une feuille de route. Coche ce qui est vrai — on te propose un ordre d’attaque.',
    bullets: [
      'Coche les situations qui te parlent (urgence, dettes, salaire, hypothèque, épargne…)',
      'Reçois un ordre d’attaque : quoi faire en premier, quoi ensuite',
      'PDF à garder — brouillon éducatif, pas un plan sur mesure',
    ],
    faq: [
      {
        question: 'C’est long une planification ?',
        answer:
          'La première rencontre exploratoire dure souvent 15–30 minutes. Le plan se construit ensuite, étape par étape — pas en une seule vente de produits.',
      },
      {
        question: 'Pourquoi un « ordre d’attaque » ?',
        answer:
          'Parce que tout faire en même temps mène souvent nulle part. Urgence, dettes chères et protection du revenu passent souvent avant d’optimiser l’épargne. L’outil illustre une logique éducative — pas un conseil personnalisé.',
      },
      {
        question: 'Tu vends un produit précis ici ?',
        answer:
          'Non. Cette page est éducative. Les recommandations viennent après analyse de ta situation.',
      },
    ],
    apprendrePath: '/apprendre',
    apprendreLabel: 'Voir les capsules Apprendre',
    ctaLabel: 'Réserver 15 minutes',
  },
  {
    slug: 'succession-bases',
    /** Alias URL (ex. /campagnes/succession → même landing). */
    aliases: ['succession'],
    badge: 'Succession',
    title: 'Succession : liquidité et clarté avant le « plus tard »',
    seoTitle: 'Bases de la succession | Conseiller en sécurité financière',
    seoDescription:
      'Liquidité, bénéficiaires et questions à se poser avant le notaire. Contenu éducatif. Conseiller en sécurité financière à Victoriaville.',
    promise:
      'Repérer les trous de liquidité et de transmission — sans improviser le jour J, et sans remplacer le notaire.',
    bullets: [
      'Qui a besoin d’argent vite si tu manques ? (liquidité ≠ actifs)',
      'Bénéficiaires à jour — polices, REER, CELI, collective',
      'Testament et contrats : est-ce qu’ils se parlent ?',
    ],
    faq: [
      {
        question: 'Tu remplaces le notaire ?',
        answer:
          'Non. On clarifie le volet sécurité financière / liquidité. Le notaire reste central pour les documents juridiques.',
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
 * Lien RDV avec UTM. Si la landing a déjà des UTM Meta (clic pub), on les conserve.
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
  return `/rendez-vous?${params.toString()}`;
}
