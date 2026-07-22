import { Shield, Heart, Umbrella, PiggyBank, FileText, Users } from 'lucide-react';

export const services = [
  {
    id: 'assurance-vie',
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
    id: 'entreprise',
    icon: Users,
    title: 'Protéger mon entreprise',
    subtitle: 'Solutions entrepreneur',
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
];

export function getServiceById(id) {
  return services.find((service) => service.id === id) ?? null;
}

export function getOtherServices(id) {
  return services.filter((service) => service.id !== id);
}
