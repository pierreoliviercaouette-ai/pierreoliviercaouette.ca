import { HOME_DESCRIPTION, HOME_TITLE, SITE_ORIGIN } from './seoCopy';

const PORTRAIT = `${SITE_ORIGIN}/seo/portrait.jpg`;

/**
 * Pages statiques dont le texte n’est pas déjà dans un module de données.
 * Le mode « privé » de /services et /apprendre reste géré dans les pages :
 * le document canonique est la version grand public.
 */
export const staticSeoPages = [
  {
    path: '/',
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    h1: 'Conseiller en sécurité financière à Victoriaville',
    enBref: HOME_DESCRIPTION,
    llmsSection: 'Pages principales',
    priority: '1.0',
    changefreq: 'weekly',
    sections: [
      {
        heading: 'Ce que couvre l’accompagnement',
        paragraphs: [
          'Pierre-Olivier Caouette est conseiller en sécurité financière à Victoriaville. Le travail relie assurance vie, protection du revenu, épargne (REER, CELI) et préparation de la retraite.',
          'Les textes du site sont éducatifs. Une recommandation adaptée à un dossier se fait seulement après une rencontre.',
        ],
        links: [
          { href: '/services', label: 'Services' },
          { href: '/apprendre', label: 'Capsules Apprendre' },
          { href: '/rendez-vous', label: 'Prendre rendez-vous' },
        ],
      },
    ],
  },
  {
    path: '/patrimoine',
    title: 'Patrimoine et stratégies avancées | En chemin ou déjà là',
    description:
      'Stratégies patrimoniales pour professionnels et entrepreneurs : en voie d’un haut niveau d’actifs ou déjà sur place. Exemples concrets et consultation gratuite.',
    h1: 'Patrimoine et stratégies avancées',
    enBref:
      'Page pour les professionnels et entrepreneurs qui bâtissent ou protègent un patrimoine élevé : fiscalité, entreprise et stratégies d’assurance. Le contenu présente des exemples. Il ne remplace pas une analyse de votre société.',
    llmsSection: 'Pages principales',
    priority: '0.95',
    changefreq: 'weekly',
    sections: [
      {
        heading: 'Pour qui',
        paragraphs: [
          'La page s’adresse aux personnes en chemin vers un patrimoine important ou déjà à cette étape. Les sujets touchent l’entreprise, la fiscalité de l’épargne incorporée et la protection des associés.',
        ],
        links: [{ href: '/services', label: 'Voir les services' }],
      },
    ],
  },
  {
    path: '/a-propos',
    title: 'À propos | Conseiller en sécurité financière au Québec',
    description:
      'Découvrez le parcours, les valeurs et l’approche de Pierre-Olivier Caouette, conseiller en sécurité financière à Victoriaville.',
    h1: 'À propos de Pierre-Olivier Caouette',
    enBref:
      'Pierre-Olivier Caouette est conseiller en sécurité financière à Victoriaville, inscrit au registre de l’Autorité des marchés financiers. La page décrit son parcours, ses valeurs et sa façon de travailler.',
    image: PORTRAIT,
    imageAlt: 'Portrait de Pierre-Olivier Caouette, conseiller en sécurité financière',
    llmsSection: 'Pages principales',
    priority: '0.85',
    sections: [
      {
        heading: 'Titre et approche',
        paragraphs: [
          'Le titre exercé est conseiller en sécurité financière. L’approche commence par la situation réelle — famille, dettes, revenu, protections déjà en place — avant de parler d’un produit.',
        ],
        links: [
          { href: '/conseiller-financier-victoriaville', label: 'Conseiller en sécurité financière à Victoriaville' },
          { href: '/contact', label: 'Contact' },
        ],
      },
    ],
  },
  {
    path: '/services',
    title: 'Services financiers | Assurance vie, retraite, invalidité',
    description:
      'Découvrez les services : assurance vie, épargne retraite, planification financière, invalidité et stratégies de protection au Québec.',
    h1: 'Services financiers',
    enBref:
      'Services de conseil en sécurité financière : assurance vie, épargne et retraite, planification, assurance invalidité et assurance maladie grave. Chaque fiche décrit à qui le service s’adresse, sans recommander un produit précis.',
    llmsSection: 'Services',
    priority: '0.9',
    sections: [
      {
        heading: 'Fiches',
        paragraphs: [
          'Les pages de détail reprennent le besoin, les points clés et des exemples. Elles restent générales : le choix d’un contrat dépend du dossier.',
        ],
        links: [
          { href: '/services/assurance-vie', label: 'Assurance vie' },
          { href: '/services/epargne', label: 'Épargne et retraite' },
          { href: '/services/planification', label: 'Planification' },
          { href: '/services/invalidite', label: 'Assurance invalidité' },
          { href: '/services/maladie-grave', label: 'Assurance maladie grave' },
        ],
      },
    ],
  },
  {
    path: '/apprendre',
    title: 'Apprendre | Épargne et protections — capsules courtes',
    description:
      'Sujets courts pour comprendre le CELI, le REER et les assurances — éducation claire, sans jargon.',
    h1: 'Apprendre',
    enBref:
      'Capsules éducatives sur le CELI, le REER, les placements et les assurances. Chaque texte cite ses sources et ne constitue pas un conseil personnalisé.',
    llmsSection: 'Apprendre',
    priority: '0.85',
    sections: [
      {
        heading: 'Comment lire ces capsules',
        paragraphs: [
          'Chaque sujet tient en une lecture courte : définition, règles utiles, exemple et sources (ARC, AMF, Revenu Québec, selon le cas). Les plafonds changent : la capsule renvoie vers la source officielle.',
        ],
        links: [
          { href: '/apprendre/celi', label: 'CELI' },
          { href: '/apprendre/reer-ferr', label: 'REER et FERR' },
          { href: '/apprendre/assurance-vie-temporaire', label: 'Assurance vie temporaire' },
        ],
      },
    ],
  },
  {
    path: '/outils',
    title: 'Outils financiers | Simulateurs REER, CELI et budget',
    description:
      'Simulateurs indicatifs pour le budget, le REER, le CELI, l’assurance vie et le fonds d’urgence. Les calculs détaillés sont réservés à l’espace membre.',
    h1: 'Outils financiers',
    enBref:
      'La page présente des simulateurs indicatifs (budget, épargne, assurance). Les résultats ne garantissent pas un rendement et ne remplacent pas une consultation. Les calculateurs eux-mêmes ne sont pas indexés.',
    llmsSection: 'Pages principales',
    priority: '0.6',
    sections: [
      {
        heading: 'À quoi servent les outils',
        paragraphs: [
          'Ils aident à mettre des chiffres sur une question avant une rencontre : épargne mensuelle, couverture, coussin de sécurité. L’accès complet à un calcul demande un compte membre.',
        ],
        links: [{ href: '/apprendre', label: 'Lire d’abord les capsules' }],
      },
    ],
  },
  {
    path: '/contact',
    title: 'Contact conseiller en sécurité financière | Victoriaville et Québec',
    description:
      'Contactez un conseiller en sécurité financière pour vos besoins en assurance, épargne, retraite et planification.',
    h1: 'Contact',
    enBref:
      'Pour joindre Pierre-Olivier Caouette, conseiller en sécurité financière à Victoriaville : formulaire du site, courriel p-o.caouette@agc.ia.ca ou téléphone 819 806-1164.',
    llmsSection: 'Pages principales',
    priority: '0.8',
    sections: [
      {
        heading: 'Coordonnées',
        paragraphs: [
          'Courriel : p-o.caouette@agc.ia.ca. Téléphone : 819 806-1164. Un rendez-vous se prend aussi sur la page dédiée.',
        ],
        links: [{ href: '/rendez-vous', label: 'Prendre rendez-vous' }],
      },
    ],
  },
  {
    path: '/rendez-vous',
    title: 'Prendre rendez-vous | Conseiller en sécurité financière',
    description:
      'Prenez rendez-vous pour une consultation en assurance vie, retraite, REER, CELI et planification financière.',
    h1: 'Prendre rendez-vous',
    enBref:
      'La prise de rendez-vous sert à une consultation en assurance vie, retraite, REER, CELI ou planification. Elle ne constitue pas encore un conseil : le dossier est regardé pendant la rencontre.',
    llmsSection: 'Pages principales',
    priority: '0.8',
    sections: [
      {
        heading: 'Avant la rencontre',
        paragraphs: [
          'Ayez en tête votre revenu, vos dettes principales et les assurances déjà en place. Ces trois éléments suffisent pour commencer.',
        ],
        links: [{ href: '/contact', label: 'Écrire plutôt que réserver' }],
      },
    ],
  },
  {
    path: '/recommandations',
    title: 'Programme de recommandations | Victoriaville',
    description:
      'Un programme de recommandations attractif et moderne : lien de consentement, points cumulatifs et tirage trimestriel d’une valeur d’environ 300 $.',
    h1: 'Programme de recommandations',
    enBref:
      'Le programme permet de recommander Pierre-Olivier Caouette avec un lien de consentement. La personne recommandée n’est jointe qu’après avoir accepté. Des points et un tirage trimestriel sont décrits sur la page.',
    llmsSection: 'Pages principales',
    priority: '0.7',
    sections: [
      {
        heading: 'Consentement',
        paragraphs: [
          'Sans consentement explicite, aucun contact n’est fait. Le détail du consentement est sur une page séparée.',
        ],
        links: [
          { href: '/recommandations/consentement', label: 'Page de consentement' },
          { href: '/recommander-conseiller-financier', label: 'Comment recommander un conseiller' },
        ],
      },
    ],
  },
  {
    path: '/recommandations/consentement',
    title: 'Consentement | Programme de recommandations',
    description:
      'Consentement pour être contacté par Pierre-Olivier Caouette, conseiller en sécurité financière, à la suite d’une recommandation.',
    h1: 'Consentement à être contacté',
    enBref:
      'Cette page recueille le consentement d’une personne recommandée avant tout appel ou courriel. Le consentement peut être retiré. Aucun conseil n’est donné sur ce formulaire.',
    llmsSection: 'Pages principales',
    priority: '0.4',
    sections: [
      {
        heading: 'Ce que vous acceptez',
        paragraphs: [
          'Vous acceptez que Pierre-Olivier Caouette communique avec vous au sujet de ses services de conseil, à partir des renseignements que vous inscrivez. Vous pouvez retirer ce consentement en le lui signalant.',
        ],
      },
    ],
  },
  {
    path: '/jemcee',
    title: 'Pilotez votre patrimoine | Pierre-Olivier Caouette',
    description:
      'Performance, protection et accompagnement : une approche rallye de la sécurité financière. Rendements, optimisation fiscale, gestion du risque et planification de retraite.',
    h1: 'Pilotez votre patrimoine',
    enBref:
      'Page de présentation de l’approche : performance, protection et accompagnement. Les rendements illustrés ne sont pas une promesse. Le titre exercé reste conseiller en sécurité financière.',
    llmsSection: 'Pages principales',
    priority: '0.7',
    sections: [
      {
        heading: 'Lecture',
        paragraphs: [
          'La page met en scène une métaphore de pilotage pour parler de protection, de risque et de retraite. Elle ne décrit pas un produit précis et ne garantit pas un résultat.',
        ],
        links: [{ href: '/services', label: 'Revenir aux services' }],
      },
    ],
  },
  {
    path: '/confidentialite',
    title: 'Politique de confidentialité | Pierre-Olivier Caouette',
    description:
      'Politique de confidentialité : renseignements collectés, utilisations, tiers (Supabase, Resend, Microsoft) et responsable de la protection des renseignements personnels.',
    h1: 'Politique de confidentialité',
    enBref:
      'Pierre-Olivier Caouette, conseiller en sécurité financière, est responsable des renseignements personnels collectés via ce site. La page décrit ce qui est collecté, pourquoi, et quels prestataires peuvent les traiter.',
    llmsSection: 'Pages principales',
    priority: '0.3',
    sections: [
      {
        heading: 'Responsable',
        paragraphs: [
          'Courriel : p-o.caouette@agc.ia.ca. Téléphone : 819 806-1164. Dernière mise à jour indiquée sur la page : 2026-08-20.',
          'Les renseignements fournis dans les formulaires, le compte membre et les outils servent à répondre aux demandes, à fournir les services et, si vous l’acceptez, à mesurer l’usage du site.',
          'Des prestataires peuvent traiter ces renseignements : Supabase (authentification et base de données), Resend (courriels) et Microsoft Outlook Bookings (rendez-vous).',
        ],
      },
    ],
  },
  {
    path: '/conditions',
    title: 'Conditions d’utilisation | Pierre-Olivier Caouette',
    description:
      'Conditions d’utilisation du site : services informatifs, outils indicatifs et absence de conseil financier personnalisé.',
    h1: 'Conditions d’utilisation',
    enBref:
      'En utilisant le site, vous acceptez ces conditions. Les informations sont informatives et ne constituent pas des conseils financiers personnalisés. Les outils de calcul sont indicatifs et ne garantissent pas les rendements futurs.',
    llmsSection: 'Pages principales',
    priority: '0.3',
    sections: [
      {
        heading: 'Services et outils',
        paragraphs: [
          'Le site présente les services de conseil en sécurité financière de Pierre-Olivier Caouette. L’accès complet aux outils demande un compte membre. Les résultats ne remplacent pas une consultation.',
        ],
      },
    ],
  },
];

export function getStaticSeo(path) {
  return staticSeoPages.find((page) => page.path === path) ?? null;
}
