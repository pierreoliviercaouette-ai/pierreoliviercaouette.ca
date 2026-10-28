import {
  Shield,
  Heart,
  Umbrella,
  PiggyBank,
  FileText,
  Users,
  Landmark,
  Scale,
  Building2,
} from 'lucide-react';

export const AUDIENCE_PARTICULIER = 'particulier';
export const AUDIENCE_PRIVE = 'prive';

export const services = [
  {
    id: 'assurance-vie',
    audiences: [AUDIENCE_PARTICULIER],
    icon: Shield,
    title: 'Protéger ma famille',
    subtitle: 'Assurance vie',
    shortDescription: 'Aidez à sécuriser financièrement vos proches avec une couverture adaptée.',
    features: [
      'Protection du conjoint survivant',
      "Remboursement de l'hypothèque",
      "Fonds d'études pour les enfants",
    ],
    fullDescription: [
      "L'assurance vie est une base importante de protection financière. Elle peut aider vos proches à maintenir leur stabilité financière si vous n'êtes plus là pour subvenir à leurs besoins.",
      'Plusieurs types de couvertures existent: temporaire, permanente, universelle. Ensemble, nous déterminons celle qui correspond le mieux à votre situation et vos objectifs.',
    ],
    whoIsItFor: [
      'Parents avec enfants à charge',
      'Propriétaires avec hypothèque',
      "Entrepreneurs avec partenaires d'affaires",
      'Couples souhaitant protéger le survivant',
    ],
    examples: [
      "Marie, 35 ans, mère de 2 enfants, assure le remboursement de l'hypothèque",
      "Jean et Pierre, associés, protègent leur entreprise avec une assurance vie croisée",
      "Sophie utilise l'assurance vie permanente comme outil de planification successorale",
    ],
    whyMe: [
      "J'évalue d'abord vos obligations réelles (hypothèque, enfants, revenu) avant de parler de produit.",
      'Je vous explique clairement la différence entre temporaire et permanente — sans jargon inutile.',
      'Je vise une couverture proportionnée : assez pour protéger, sans surpayer.',
      'Je révise avec vous quand votre situation change (naissance, achat, nouvelle dettes).',
    ],
    seoTitle: 'Assurance vie | Protéger sa famille',
    seoDescription:
      'Assurance vie adaptée à votre situation : protection du conjoint, hypothèque et avenir des enfants. Analyse claire avec Pierre-Olivier Caouette.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'epargne',
    audiences: [AUDIENCE_PARTICULIER],
    icon: PiggyBank,
    title: 'Épargner pour la retraite',
    subtitle: 'REER, CELI, Fonds',
    shortDescription: "Stratégies d'épargne adaptées à vos objectifs et votre situation fiscale.",
    features: [
      'Optimisation fiscale REER/CELI',
      'Planification retraite personnalisée',
      'Suivi et ajustements réguliers',
    ],
    fullDescription: [
      "Épargner pour la retraite, c'est investir dans votre liberté future. REER, CELI, REEE... chaque véhicule d'épargne a ses avantages selon votre situation.",
      'Je vous aide à maximiser vos avantages fiscaux et à choisir les placements adaptés à votre profil de risque et vos objectifs.',
    ],
    whoIsItFor: [
      'Jeunes professionnels voulant commencer tôt',
      'Familles épargnant pour les études des enfants',
      'Personnes approchant de la retraite',
      'Entrepreneurs cherchant à optimiser leur fiscalité',
    ],
    examples: [
      "Julie, 28 ans, maximise son CELI pour son fonds d'urgence et son REER pour la retraite",
      'François et Marie ouvrent un REEE pour financer les études de leurs enfants',
      'Robert, 55 ans, ajuste sa stratégie pour préparer sa retraite dans 10 ans',
    ],
    whyMe: [
      "Je structure votre épargne selon votre capacité réelle — pas un montant « idéal » impossible à tenir.",
      'REER, CELI, REEE : on choisit le bon outil pour le bon objectif, avec la fiscalité en tête.',
      'Je reste concret : échéanciers, montants cibles et ajustements quand la vie change.',
      'Le suivi régulier permet de garder le cap sans stresser à chaque fluctuation.',
    ],
    seoTitle: 'Épargne et retraite | REER, CELI',
    seoDescription:
      'Stratégies REER, CELI et retraite adaptées à votre fiscalité et vos objectifs. Accompagnement personnalisé avec Pierre-Olivier Caouette.',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'planification',
    audiences: [AUDIENCE_PARTICULIER],
    icon: FileText,
    title: 'Planifier mon avenir',
    subtitle: 'Vision globale',
    shortDescription: 'Un plan financier personnalisé pour atteindre vos ambitions de vie.',
    features: [
      'Analyse complète de votre situation',
      'Objectifs court, moyen et long terme',
      'Révision annuelle du plan',
    ],
    fullDescription: [
      "La planification financière va au-delà des produits individuels. C'est une vision d'ensemble de votre situation qui intègre protection, épargne, fiscalité et succession.",
      'Ensemble, nous créons un plan personnalisé qui évolue avec vous et vos objectifs de vie.',
    ],
    whoIsItFor: [
      'Personnes en période de transition (mariage, achat de maison, naissance)',
      'Entrepreneurs en croissance',
      'Familles voulant optimiser leurs finances',
      'Personnes planifiant leur succession',
    ],
    examples: [
      'Un couple nouvellement marié établit un plan financier complet incluant assurances, épargne et objectifs à court terme',
      "Une entrepreneure révise sa planification suite à l'expansion de son entreprise",
    ],
    whyMe: [
      'Je regarde le portrait global avant de recommander un produit isolé.',
      'On priorise ensemble : ce qui est urgent, ce qui est important, ce qui peut attendre.',
      'Le plan reste lisible — des étapes claires que vous pouvez suivre.',
      'On le révise quand vos objectifs évoluent, pour que le plan reste utile.',
    ],
    seoTitle: 'Planification financière | Vision globale',
    seoDescription:
      'Plan financier personnalisé qui intègre protection, épargne et objectifs de vie. Accompagnement clair avec Pierre-Olivier Caouette.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'invalidite',
    audiences: [AUDIENCE_PARTICULIER],
    icon: Umbrella,
    title: 'Prévenir les imprévus',
    subtitle: 'Assurance invalidité',
    shortDescription: "Protection de votre revenu en cas de maladie ou d'accident.",
    features: [
      "Remplacement de revenu jusqu'à 70%",
      'Protection court et long terme',
      'Couverture personnalisée',
    ],
    fullDescription: [
      "Votre capacité à gagner un revenu est votre actif le plus précieux. L'assurance invalidité remplace une partie de votre salaire si vous ne pouvez plus travailler en raison d'une maladie ou d'un accident.",
      'Elle vous permet de maintenir votre niveau de vie et de continuer à payer vos obligations financières pendant votre convalescence.',
    ],
    whoIsItFor: [
      'Professionnels et travailleurs autonomes',
      "Personnes sans protection d'employeur adéquate",
      'Propriétaires avec obligations financières importantes',
      "Toute personne dépendant de son revenu d'emploi",
    ],
    examples: [
      'Marc, électricien, se blesse au dos et reçoit 70% de son revenu pendant sa récupération',
      'Isabelle, comptable, développe un trouble musculosquelettique et peut réduire ses heures sans impact financier majeur',
    ],
    whyMe: [
      "J'évalue d'abord ce que vous perdrez vraiment si votre revenu s'arrête — pas seulement le « combien d'assurance ».",
      "Je compare votre couverture existante (employeur ou non) pour éviter les trous et les doublons.",
      'Je vous explique délais, exclusions et montant de façon claire avant de recommander.',
      'L’objectif : protéger votre budget et vos obligations, simplement et concrètement.',
    ],
    seoTitle: 'Assurance invalidité | Protéger son revenu',
    seoDescription:
      "Assurance invalidité pour protéger votre revenu en cas de maladie ou d'accident. Analyse adaptée avec Pierre-Olivier Caouette.",
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    id: 'maladie-grave',
    audiences: [AUDIENCE_PARTICULIER],
    icon: Heart,
    title: 'Faire face à la maladie',
    subtitle: 'Assurance maladie grave',
    shortDescription: 'Capital forfaitaire pour vous concentrer sur votre guérison.',
    features: [
      'Versement unique à diagnostic',
      'Couverture des cancers, AVC, crises cardiaques',
      "Liberté d'utilisation des fonds",
    ],
    fullDescription: [
      "Un diagnostic de cancer, de crise cardiaque ou d'AVC peut bouleverser votre vie. L'assurance maladie grave vous verse un montant forfaitaire pour faire face aux dépenses imprévues et vous permettre de vous concentrer sur votre guérison.",
      "Cette protection vous donne la liberté de prendre les meilleures décisions pour votre santé sans vous soucier de l'impact financier.",
    ],
    whoIsItFor: [
      'Personnes avec des antécédents familiaux de maladies graves',
      "Travailleurs autonomes sans régime d'employeur",
      'Familles avec un seul revenu principal',
      'Personnes souhaitant un filet de sécurité additionnel',
    ],
    examples: [
      'Luc reçoit un montant forfaitaire suite à un diagnostic de cancer, lui permettant de prendre un congé prolongé',
      'Amélie utilise son versement pour accéder à des traitements non couverts par la RAMQ',
    ],
    whyMe: [
      'Je clarifie d’abord ce que couvre réellement le contrat — maladies, délais, montants — sans surprise.',
      'On calibre le capital selon votre besoin de liquidité en cas de diagnostic, pas un montant « standard ».',
      'Je situe cette protection par rapport à vos autres assurances pour éviter les chevauchements inutiles.',
      'Vous repartez avec une décision éclairée, proportionnée à votre budget et à vos risques.',
    ],
    seoTitle: 'Assurance maladie grave | Capital forfaitaire',
    seoDescription:
      'Assurance maladie grave : capital à diagnostic pour vous concentrer sur votre guérison. Accompagnement clair avec Pierre-Olivier Caouette.',
    color: 'from-red-500 to-red-600',
  },
  {
    id: 'patrimoine',
    audiences: [AUDIENCE_PRIVE],
    icon: Landmark,
    title: 'Maximiser mon patrimoine',
    subtitle: 'Stratégies patrimoniales',
    shortDescription:
      'Structurer et faire croître vos actifs avec des solutions d’assurance et d’épargne adaptées aux situations plus complexes.',
    features: [
      'Vision globale des actifs personnels et corporatifs',
      'Protection et croissance du capital',
      'Planification successorale claire',
    ],
    fullDescription: [
      'Quand le patrimoine se complexifie — plusieurs actifs, société, immobilier, objectifs de transmission — une approche isolée produit par produit ne suffit plus.',
      'Nous structurons ensemble une stratégie qui protège ce qui compte, vise une croissance stable et prépare la transmission, avec des concepts d’assurance et d’épargne adaptés à votre réalité.',
    ],
    whoIsItFor: [
      'Professionnels et dirigeants à revenu élevé ou en forte croissance',
      'Propriétaires d’entreprise — déjà établis ou en expansion',
      'Personnes en voie de constituer un patrimoine plus élevé',
      'Familles préparant une transmission ou une sortie d’affaires',
    ],
    examples: [
      'Un couple d’entrepreneurs aligne protection, épargne corporative et objectifs de transmission',
      'Un professionnel incorporé clarifie la répartition entre actifs personnels et actifs de société',
      'Une famille en croissance de patrimoine met en place une liquidité successorale avant que le besoin soit urgent',
    ],
    whyMe: [
      'Je commence par le portrait global — cash-flow, actifs, obligations — avant de parler de produit.',
      'Les solutions restent proportionnées : assez pour protéger et structurer, sans complexité inutile.',
      'Je travaille en cohérence avec vos autres experts (comptable, fiscaliste, notaire) lorsque le dossier le demande.',
      'Vous repartez avec des prochaines étapes concrètes, pas seulement une présentation.',
    ],
    seoTitle: 'Maximisation du patrimoine | Stratégies avancées',
    seoDescription:
      'Structurer et faire croître votre patrimoine — déjà élevé ou en construction. Assurance, épargne et transmission avec Pierre-Olivier Caouette.',
    color: 'from-zinc-700 to-zinc-900',
  },
  {
    id: 'optimisation-fiscale',
    audiences: [AUDIENCE_PRIVE],
    icon: Scale,
    title: 'Optimiser ma fiscalité',
    subtitle: 'Stratégies fiscales',
    shortDescription:
      'Explorer les véhicules d’épargne, d’assurance et de détention corporative pour une fiscalité mieux organisée.',
    features: [
      'REER, CELI et structures d’épargne adaptées',
      'Assurance comme outil de planification',
      'Détention personnelle vs corporative',
    ],
    fullDescription: [
      'L’optimisation fiscale, c’est choisir les bons outils au bon endroit — pas promettre d’éviter l’impôt. REER, CELI, assurance et détention corporative peuvent chacun jouer un rôle selon votre situation.',
      'Nous identifions les pistes pertinentes pour votre profil. Les stratégies avancées sont toujours validées avec vous et, au besoin, avec un fiscaliste ou un comptable.',
    ],
    whoIsItFor: [
      'Professionnels incorporés ou en voie de l’être',
      'Propriétaires d’entreprise avec surplus (ou bientôt) de liquidités',
      'Personnes dont la fiscalité se complexifie à mesure que le patrimoine croît',
      'Familles préparant une transmission d’actifs',
    ],
    examples: [
      'Un dirigeant compare l’épargne personnelle et corporative avant de déployer un surplus',
      'Une famille évalue l’assurance permanente dans une logique de liquidité successorale',
      'Un professionnel qui maximise REER/CELI explore les prochaines étapes patrimoniales',
    ],
    whyMe: [
      'Je présente des options claires, avec avantages et limites — sans jargon ni promesses irréalistes.',
      'Chaque piste reste ancrée dans les règles en vigueur et dans votre capacité réelle.',
      'Je collabore avec vos experts fiscaux quand le dossier le justifie.',
      'L’objectif : une structure lisible que vous comprenez et que vous pouvez suivre.',
    ],
    seoTitle: 'Optimisation fiscale | Épargne et assurance',
    seoDescription:
      'Pistes d’optimisation fiscale via REER, CELI, assurance et détention corporative — pour aujourd’hui et pour la suite. Pierre-Olivier Caouette.',
    color: 'from-stone-600 to-stone-800',
  },
  {
    id: 'entreprise',
    audiences: [AUDIENCE_PRIVE],
    icon: Users,
    title: 'Protéger mon entreprise',
    subtitle: 'Stratégie corporative',
    shortDescription: 'Sécurisez votre entreprise et vos associés avec les bonnes protections.',
    features: [
      'Assurance personne clé',
      'Convention entre actionnaires',
      "Protection du patrimoine d'entreprise",
    ],
    fullDescription: [
      "En tant qu'entrepreneur, votre entreprise est souvent votre actif le plus précieux. Des protections spécifiques existent pour sécuriser votre investissement et celui de vos associés.",
      "De l'assurance personne clé à la convention entre actionnaires, nous mettons en place les protections adaptées à votre réalité d'affaires.",
    ],
    whoIsItFor: [
      "Propriétaires d'entreprise avec associés",
      'Entrepreneurs avec employés clés',
      'Professionnels incorporés',
      'Investisseurs immobiliers',
    ],
    examples: [
      "Deux associés protègent leur partenariat avec une convention d'actionnaires financée",
      'Une PME assure son directeur des ventes, personne clé de l’organisation',
    ],
    whyMe: [
      'Je comprends le langage d’affaires : cash-flow, associés, personnes clés — avant de proposer une solution.',
      'On structure les protections pour soutenir la continuité, pas seulement pour « avoir une police ».',
      'Je reste transparent sur les options et les coûts, pour que la décision soit rentable pour l’entreprise.',
      'Approche concrète, adaptée à la taille et à la réalité de votre organisation.',
    ],
    seoTitle: "Solutions entrepreneur | Protection d'entreprise",
    seoDescription:
      "Personne clé, convention entre actionnaires et protection du patrimoine d'entreprise. Solutions adaptées avec Pierre-Olivier Caouette.",
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'assurances-employes',
    audiences: [AUDIENCE_PRIVE],
    icon: Building2,
    title: 'Assurer mes employés',
    subtitle: 'Régimes pour employés',
    shortDescription:
      'Attirer et retenir les talents avec des régimes d’assurance adaptés à votre organisation.',
    features: [
      'Assurance collective et régimes complémentaires',
      'Protection invalidité et vie pour l’équipe',
      'Solutions pour cadres et employés clés',
    ],
    fullDescription: [
      'Un bon régime d’avantages sociaux aide à attirer et conserver les employés et cadres importants. Il protège aussi l’organisation face à la perte d’une personne clé.',
      'Nous évaluons les besoins de votre équipe et de votre structure pour proposer une couverture claire, proportionnée et simple à administrer.',
    ],
    whoIsItFor: [
      'PME en croissance qui recrutent',
      'Entreprises voulant retenir des cadres clés',
      'Organisations sans régime collectif adéquat',
      'Dirigeants qui souhaitent protéger l’équipe et la continuité',
    ],
    examples: [
      'Une PME met en place une couverture collective pour stabiliser son offre d’emploi',
      'Un dirigeant complète la protection d’un cadre clé au-delà du régime de base',
    ],
    whyMe: [
      'Je clarifie d’abord ce que vous avez déjà (ou non) avant d’ajouter de la complexité.',
      'On calibre le régime selon la taille de l’équipe et les priorités réelles, pas un modèle générique.',
      'Je vous explique coûts, exclusions et options en langage clair.',
      'L’objectif : un outil de rétention utile pour l’entreprise et compréhensible pour vos employés.',
    ],
    seoTitle: 'Assurances employés | Régimes collectifs',
    seoDescription:
      'Régimes d’assurance pour employés et cadres : collective, invalidité, vie. Solutions d’entreprise avec Pierre-Olivier Caouette.',
    color: 'from-neutral-600 to-neutral-800',
  },
];

export function getServiceById(id) {
  return services.find((service) => service.id === id) ?? null;
}

export function getServicesForAudience(audience) {
  return services.filter((service) => (service.audiences || [AUDIENCE_PARTICULIER]).includes(audience));
}

export function getOtherServices(id, audience) {
  const others = services.filter((service) => service.id !== id);
  if (!audience) return others;
  return others.filter((service) => (service.audiences || [AUDIENCE_PARTICULIER]).includes(audience));
}
