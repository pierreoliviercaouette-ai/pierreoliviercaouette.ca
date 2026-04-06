import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Shield, Heart, Umbrella, PiggyBank, FileText, ChevronRight, Users, CheckCircle2, X, Calendar } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const services = [
  {
    id: 'assurance-vie',
    icon: Shield,
    title: 'Protéger ma famille',
    subtitle: 'Assurance vie',
    shortDescription: 'Garantissez la sécurité financière de vos proches avec une couverture adaptée.',
    features: [
      'Protection du conjoint survivant',
      'Remboursement de l\'hypothèque',
      'Fonds d\'études pour les enfants'
    ],
    fullDescription: [
      "L'assurance vie est la pierre angulaire de toute stratégie de protection financière. Elle garantit que vos proches seront à l'abri financièrement si vous n'êtes plus là pour subvenir à leurs besoins.",
      "Plusieurs types de couvertures existent: temporaire, permanente, universelle. Ensemble, nous déterminons celle qui correspond le mieux à votre situation et vos objectifs."
    ],
    whoIsItFor: [
      'Parents avec enfants à charge',
      'Propriétaires avec hypothèque',
      'Entrepreneurs avec partenaires d\'affaires',
      'Couples souhaitant protéger le survivant'
    ],
    examples: [
      'Marie, 35 ans, mère de 2 enfants, assure le remboursement de l\'hypothèque',
      'Jean et Pierre, associés, protègent leur entreprise avec une assurance vie croisée',
      'Sophie utilise l\'assurance vie permanente comme outil de planification successorale'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'epargne',
    icon: PiggyBank,
    title: 'Épargner pour la retraite',
    subtitle: 'REER, CELI, Fonds',
    shortDescription: 'Stratégies d\'épargne adaptées à vos objectifs et votre situation fiscale.',
    features: [
      'Optimisation fiscale REER/CELI',
      'Planification retraite personnalisée',
      'Suivi et ajustements réguliers'
    ],
    fullDescription: [
      "Épargner pour la retraite, c'est investir dans votre liberté future. REER, CELI, REEE... chaque véhicule d'épargne a ses avantages selon votre situation.",
      "Je vous aide à maximiser vos avantages fiscaux et à choisir les placements adaptés à votre profil de risque et vos objectifs."
    ],
    whoIsItFor: [
      'Jeunes professionnels voulant commencer tôt',
      'Familles épargnant pour les études des enfants',
      'Personnes approchant de la retraite',
      'Entrepreneurs cherchant à optimiser leur fiscalité'
    ],
    examples: [
      'Julie, 28 ans, maximise son CELI pour son fonds d\'urgence et son REER pour la retraite',
      'François et Marie ouvrent un REEE pour financer les études de leurs enfants',
      'Robert, 55 ans, ajuste sa stratégie pour préparer sa retraite dans 10 ans'
    ],
    color: 'from-green-500 to-green-600'
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
      'Révision annuelle du plan'
    ],
    fullDescription: [
      "La planification financière va au-delà des produits individuels. C'est une vision d'ensemble de votre situation qui intègre protection, épargne, fiscalité et succession.",
      "Ensemble, nous créons un plan personnalisé qui évolue avec vous et vos objectifs de vie."
    ],
    whoIsItFor: [
      'Personnes en période de transition (mariage, achat de maison, naissance)',
      'Entrepreneurs en croissance',
      'Familles voulant optimiser leurs finances',
      'Personnes planifiant leur succession'
    ],
    examples: [
      'Un couple nouvellement marié établit un plan financier complet incluant assurances, épargne et objectifs à court terme',
      'Une entrepreneure révise sa planification suite à l\'expansion de son entreprise'
    ],
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'invalidite',
    icon: Umbrella,
    title: 'Prévenir les imprévus',
    subtitle: 'Assurance invalidité',
    shortDescription: 'Protection de votre revenu en cas de maladie ou d\'accident.',
    features: [
      'Remplacement de revenu jusqu\'à 70%',
      'Protection court et long terme',
      'Couverture personnalisée'
    ],
    fullDescription: [
      "Votre capacité à gagner un revenu est votre actif le plus précieux. L'assurance invalidité remplace une partie de votre salaire si vous ne pouvez plus travailler en raison d'une maladie ou d'un accident.",
      "Elle vous permet de maintenir votre niveau de vie et de continuer à payer vos obligations financières pendant votre convalescence."
    ],
    whoIsItFor: [
      'Professionnels et travailleurs autonomes',
      'Personnes sans protection d\'employeur adéquate',
      'Propriétaires avec obligations financières importantes',
      'Toute personne dépendant de son revenu d\'emploi'
    ],
    examples: [
      'Marc, électricien, se blesse au dos et reçoit 70% de son revenu pendant sa récupération',
      'Isabelle, comptable, développe un trouble musculosquelettique et peut réduire ses heures sans impact financier majeur'
    ],
    color: 'from-cyan-500 to-cyan-600'
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
      'Liberté d\'utilisation des fonds'
    ],
    fullDescription: [
      "Un diagnostic de cancer, de crise cardiaque ou d'AVC peut bouleverser votre vie. L'assurance maladie grave vous verse un montant forfaitaire pour faire face aux dépenses imprévues et vous permettre de vous concentrer sur votre guérison.",
      "Cette protection vous donne la liberté de prendre les meilleures décisions pour votre santé sans vous soucier de l'impact financier."
    ],
    whoIsItFor: [
      'Personnes avec des antécédents familiaux de maladies graves',
      'Travailleurs autonomes sans régime d\'employeur',
      'Familles avec un seul revenu principal',
      'Personnes souhaitant un filet de sécurité additionnel'
    ],
    examples: [
      'Luc reçoit un montant forfaitaire suite à un diagnostic de cancer, lui permettant de prendre un congé prolongé',
      'Amélie utilise son versement pour accéder à des traitements non couverts par la RAMQ'
    ],
    color: 'from-red-500 to-red-600'
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
      'Protection du patrimoine d\'entreprise'
    ],
    fullDescription: [
      "En tant qu'entrepreneur, votre entreprise est souvent votre actif le plus précieux. Des protections spécifiques existent pour sécuriser votre investissement et celui de vos associés.",
      "De l'assurance personne clé à la convention entre actionnaires, nous mettons en place les protections adaptées à votre réalité d'affaires."
    ],
    whoIsItFor: [
      'Propriétaires d\'entreprise avec associés',
      'Entrepreneurs avec employés clés',
      'Professionnels incorporés',
      'Investisseurs immobiliers'
    ],
    examples: [
      'Deux associés protègent leur partenariat avec une convention d\'actionnaires financée',
      'Une PME assure son directeur des ventes, personne clé de l\'organisation'
    ],
    color: 'from-amber-500 to-amber-600'
  }
];

const ServiceCard = ({ service, onOpenDetail }) => {
  const Icon = service.icon;
  
  return (
    <div 
      id={service.id}
      className="group bg-white border border-prestige-beige rounded-2xl p-6 hover:border-primary hover:shadow-ia-hover transition-all duration-300 cursor-pointer relative overflow-hidden scroll-mt-24"
      onClick={() => onOpenDetail(service)}
      data-testid={`service-card-${service.id}`}
    >
      {/* Top gradient bar on hover */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${service.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`} />
      
      {/* Icon */}
      <div className="w-14 h-14 rounded-2xl bg-light flex items-center justify-center mb-5 group-hover:bg-primary transition-colors duration-300">
        <Icon className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
      </div>
      
      {/* Content */}
      <div className="space-y-3">
        <div>
          <h3 className="font-heading text-xl font-semibold text-dark group-hover:text-primary transition-colors">
            {service.title}
          </h3>
          <p className="text-primary text-sm font-medium">{service.subtitle}</p>
        </div>
        
        <p className="text-prestige-taupe text-sm leading-relaxed">
          {service.shortDescription}
        </p>
        
        {/* Features preview */}
        <ul className="space-y-2 pt-2">
          {service.features.slice(0, 2).map((feature, idx) => (
            <li key={idx} className="flex items-center gap-2 text-sm text-prestige-taupe">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        
        {/* CTA */}
        <button className="inline-flex items-center gap-1 text-primary font-medium text-sm pt-2 group-hover:gap-2 transition-all">
          En savoir plus <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ServiceDetailModal = ({ service, isOpen, onClose }) => {
  if (!service) return null;
  
  const Icon = service.icon;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-0 [&>button]:hidden">
        {/* Header with gradient */}
        <div className={`bg-gradient-to-r ${service.color} p-8 text-white relative`}>
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
            data-testid="close-modal"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className="font-heading text-2xl md:text-3xl font-bold text-white m-0">
                {service.title}
              </DialogTitle>
              <p className="text-white/80 font-medium">{service.subtitle}</p>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Description */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-dark mb-3">
              C'est quoi?
            </h4>
            <div className="space-y-3 text-prestige-taupe leading-relaxed">
              {service.fullDescription.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </div>
          
          {/* Key Features */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-dark mb-3">
              Points clés
            </h4>
            <div className="grid md:grid-cols-3 gap-3">
              {service.features.map((feature, idx) => (
                <div key={idx} className="flex items-center gap-2 p-3 bg-light rounded-xl">
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-dark font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Who is it for */}
          <div className="bg-light rounded-2xl p-6">
            <h4 className="font-heading text-lg font-semibold text-dark mb-4">
              À qui ça s'adresse?
            </h4>
            <ul className="space-y-2">
              {service.whoIsItFor.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <ChevronRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-prestige-taupe">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Examples */}
          <div>
            <h4 className="font-heading text-lg font-semibold text-dark mb-4">
              Exemples concrets
            </h4>
            <div className="space-y-3">
              {service.examples.map((example, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 border border-prestige-beige rounded-xl">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${service.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{idx + 1}</span>
                  </div>
                  <p className="text-prestige-taupe text-sm">{example}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-light border border-prestige-beige rounded-xl p-4">
            <p className="text-xs text-prestige-taupe text-center">
              <strong>Note:</strong> Ces exemples sont à titre illustratif seulement et ne constituent pas des conseils financiers personnalisés.
            </p>
          </div>
          
          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              to="/rendez-vous" 
              className="btn-primary flex-1 inline-flex items-center justify-center gap-2"
              onClick={onClose}
              data-testid="modal-cta-rdv"
            >
              <Calendar className="w-5 h-5" />
              Prendre rendez-vous
            </Link>
            <Link 
              to="/contact" 
              className="btn-secondary flex-1 inline-flex items-center justify-center gap-2"
              onClick={onClose}
            >
              En parler ensemble
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const Services = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();

  // Handle scroll to anchor with offset for fixed navbar
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Small delay to ensure the page is rendered
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          const navbarHeight = 80; // Height of fixed navbar
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          const offsetPosition = elementPosition - navbarHeight - 20; // Extra 20px padding
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }, 100);
    }
  }, [location]);

  const handleOpenDetail = (service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  return (
    <main className="pt-20" data-testid="services-page">
      {/* Hero Section */}
      <section className="section-padding gradient-hero relative overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
        </div>
        
        <div className="container-max text-center relative z-10">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6">
            Comment puis-je vous aider?
          </h1>
          <p className="text-white/80 text-lg md:text-xl max-w-3xl mx-auto">
            Chaque situation est unique. Cliquez sur un service pour découvrir 
            comment il peut répondre à vos besoins spécifiques.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onOpenDetail={handleOpenDetail}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-light">
        <div className="container-max px-4 md:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark mb-4">
              Vous ne savez pas par où commencer?
            </h2>
            <p className="text-prestige-taupe mb-8">
              Pas de souci! Lors de notre première rencontre gratuite, nous analyserons 
              ensemble votre situation pour identifier les solutions les plus pertinentes pour vous.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/rendez-vous" 
                className="btn-primary inline-flex items-center justify-center gap-2"
                data-testid="services-cta-rdv"
              >
                <Calendar className="w-5 h-5" />
                Consultation gratuite
              </Link>
              <Link 
                to="/contact" 
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                Poser une question
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-white border-t border-prestige-beige">
        <div className="container-max px-4 md:px-8">
          <p className="text-xs text-prestige-taupe text-center max-w-4xl mx-auto">
            <strong>Information importante:</strong> Les informations présentées sur cette page sont de nature générale 
            et ne constituent pas des conseils financiers personnalisés. Chaque situation étant unique, 
            il est recommandé de consulter un conseiller qualifié avant de prendre toute décision financière.
          </p>
        </div>
      </section>

      {/* Modal */}
      <ServiceDetailModal 
        service={selectedService}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </main>
  );
};
