import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, TrendingUp, Users, Heart, Umbrella, PiggyBank, ArrowRight, CheckCircle2, Star, Quote, ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { getPublicSiteOrigin } from '../lib/referralLink';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { IA_GROUPE_FINANCIER_LOGO } from '../lib/branding';

const Hero = () => (
  <section className="relative min-h-[90vh] overflow-hidden">
    {/* Background with gradient */}
    <div className="absolute inset-0 gradient-hero" />
    
    {/* Animated background shapes */}
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-secondary/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px]" />
      <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-primary/30 rounded-full blur-[60px]" />
    </div>
    
    {/* Grid pattern overlay */}
    <div className="absolute inset-0 opacity-[0.03]" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
    }} />
    
    <div className="container-max relative z-10 min-h-[90vh] flex items-center px-4 md:px-8">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center w-full py-20">
        {/* Content */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="w-2 h-2 bg-secondary rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">Maximisez vos profits, sans compromis</span>
          </div>
          
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1]">
            Parce qu'il est temps d'avoir{' '}
            <span className="relative">
              <span className="text-secondary">les meilleurs conseils.</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                <path d="M1 5.5C47 2 153 2 199 5.5" stroke="#C9A227" strokeWidth="3" strokeLinecap="round"/>
              </svg>
            </span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl max-w-xl leading-relaxed">
            Maximisez vos gains, réduisez vos coûts, optimisez vos protections et atteignez vos objectifs. 
            Avec mon accompagnement, vos projets financiers prennent une nouvelle dimension.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/rendez-vous" 
              onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'home_hero_rendez_vous' })}
              className="group bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-secondary hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg shadow-white/20"
              data-testid="hero-cta-rdv"
            >
              Prendre rendez-vous
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/contact" 
              onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'home_hero_contact' })}
              className="group border-2 border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
              data-testid="hero-cta-contact"
            >
              Faire une demande
            </Link>
          </div>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap items-center gap-6 pt-4">
            {[
              { text: 'Certifié AMF', icon: CheckCircle2 },
              { text: 'Service personnalisé', icon: CheckCircle2 },
              { text: 'Basé au Québec', icon: CheckCircle2 }
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2 text-white/70">
                <badge.icon className="w-5 h-5 text-secondary" />
                <span className="text-sm">{badge.text}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Hero Image - Enhanced */}
        <div className="hidden lg:block relative">
          {/* Decorative elements */}
          <div className="absolute -top-10 -right-10 w-32 h-32 border-2 border-secondary/30 rounded-3xl rotate-12" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 border-2 border-white/20 rounded-2xl -rotate-12" />
          
          {/* Glowing orb behind photo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-br from-secondary/40 to-primary/20 rounded-full blur-3xl" />
          
          {/* Main photo container */}
          <div className="relative">
            {/* Photo frame with gradient border */}
            <div className="relative bg-gradient-to-br from-white/20 to-transparent p-[2px] rounded-[2rem] overflow-hidden">
              <div className="bg-gradient-to-br from-primary/80 to-dark/90 rounded-[2rem] p-4">
                <img
                  src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/677952146419fdc38392dfcd.png"
                  alt="Pierre-Olivier Caouette - Conseiller en sécurité financière"
                  className="w-full h-[480px] object-cover object-top rounded-[1.5rem]"
                />
              </div>
            </div>
            
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3 animate-float">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-dark">Certifié AMF</p>
                <p className="text-xs text-prestige-taupe">Conseiller autorisé</p>
              </div>
            </div>
            
            {/* Stats badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-2xl p-3 border border-prestige-beige flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
              <img
                src={IA_GROUPE_FINANCIER_LOGO}
                alt="iA Groupe financier"
                className="h-10 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    {/* Bottom wave — svg en block pour éviter la ligne fantôme sous la courbe (espace inline) */}
    <div className="absolute bottom-0 left-0 right-0 leading-none">
      <svg
        viewBox="0 0 1440 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-auto translate-y-px"
        aria-hidden
      >
        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
      </svg>
    </div>
  </section>
);

const ServicesSection = () => {
  const services = [
    {
      icon: TrendingUp,
      title: 'Augmentation du patrimoine',
      description: 'Avec des stratégies d\'assurances et d\'épargnes, vous gardez plus d\'argent dans vos poches.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: PiggyBank,
      title: 'Optimisation des épargnes',
      description: 'La mise à jour d\'épargnes systématique ainsi que la révision des portefeuilles d\'investissement.',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Shield,
      title: 'Stratégie d\'assurances',
      description: 'Protégez-vous et vos proches avec des stratégies avantageuses d\'assurance vie, maladie grave.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Umbrella,
      title: 'Optimisation fiscale',
      description: 'Analysons les meilleures solutions afin de payer le moins d\'impôts possible.',
      color: 'from-orange-500 to-orange-600'
    }
  ];

  return (
    <section className="section-padding bg-white relative overflow-hidden" data-testid="services-section">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="container-max relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            Mes services
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
            Une offre globale pour un service complet sur mesure
          </h2>
          <p className="text-prestige-taupe text-lg">
            Des solutions adaptées à vos besoins pour protéger et faire fructifier votre patrimoine
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <div
              key={service.title}
              className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-prestige-beige hover:border-primary/20 hover:-translate-y-2"
              data-testid={`service-card-${index}`}
            >
              {/* Gradient bar on top */}
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${service.color} rounded-t-2xl transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`} />
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-dark mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-prestige-taupe text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AdvantageSection = () => (
  <section className="section-padding bg-gradient-to-br from-gray-50 to-white relative overflow-hidden" data-testid="advantage-section">
    {/* Decorative shapes */}
    <div className="absolute top-20 left-10 w-20 h-20 border-2 border-primary/10 rounded-full" />
    <div className="absolute bottom-20 right-10 w-32 h-32 border-2 border-secondary/10 rounded-2xl rotate-45" />
    
    <div className="container-max relative">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-6">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            Pourquoi un conseiller?
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
            L'avantage d'avoir des conseils financiers
          </h2>
          <div className="bg-white rounded-2xl p-6 shadow-lg border-l-4 border-primary">
            <Quote className="w-8 h-8 text-primary/20 mb-3" />
            <p className="text-prestige-taupe italic leading-relaxed">
              "Des chercheurs ont démontré que les investisseurs qui font affaire avec un conseiller accumulent une valeur nette 
              <strong className="text-dark"> 1,7 fois plus élevée au bout de 4 ans</strong>, et 
              <strong className="text-dark"> 4 fois plus élevée après 15 ans</strong>."
            </p>
            <a 
              href="https://www.chambresf.com/fr/actualites/article/conseil-financier-professionnel-mapporte-quoi" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary text-sm mt-4 hover:underline font-medium"
            >
              Source: Chambre de la sécurité financière
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        <div className="space-y-4">
          {[
            'Apprendre à épargner plus et plus régulièrement',
            'Faire des choix éclairés et éviter les erreurs coûteuses',
            'Améliorer son niveau de littératie financière',
            'Ne pas se laisser influencer par les rumeurs',
            'Réduire sa charge fiscale',
            'Atteindre une tranquillité d\'esprit'
          ].map((item, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-prestige-beige"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <p className="text-dark font-medium">{item}</p>
            </div>
          ))}
          
          <Link 
            to="/rendez-vous" 
            className="btn-primary inline-flex items-center gap-2 mt-4"
          >
            Prendre rendez-vous
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const AboutPreview = () => (
  <section className="section-padding bg-white overflow-hidden relative" data-testid="about-preview-section">
    <div className="container-max">
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Photo Section - Enhanced */}
        <div className="relative">
          {/* Background decorations */}
          <div className="absolute -top-8 -left-8 w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 rounded-[3rem] transform -rotate-3" />
          <div className="absolute -bottom-4 -right-4 w-3/4 h-3/4 bg-secondary/10 rounded-[2rem] transform rotate-3" />
          
          {/* Main photo */}
          <div className="relative z-10">
            <div className="relative overflow-hidden rounded-[2rem] shadow-2xl">
              {/* Gradient overlay on photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark/40 via-transparent to-transparent z-10" />
              <img
                src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/677aa86c6e3c74bb201c6cde.png"
                alt="Pierre-Olivier Caouette"
                className="w-full h-[500px] object-cover object-top"
              />
              
              {/* Name overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                <p className="text-white font-heading text-2xl font-bold">Pierre-Olivier Caouette</p>
                <p className="text-white/80">Conseiller en sécurité financière</p>
              </div>
            </div>
            
            {/* Floating certification badge */}
            <div className="absolute -bottom-6 -right-6 z-20">
              <div className="bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 border border-prestige-beige">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="font-bold text-dark">Certifié AMF</p>
                  <p className="text-sm text-prestige-taupe">Conseiller autorisé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-6 lg:pl-8">
          <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
            À propos de moi
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark leading-tight">
            Parce qu'il est temps d'avoir les meilleurs conseils.
          </h2>
          <p className="text-prestige-taupe text-lg leading-relaxed">
            Après avoir passé des années à conseiller mon entourage sur tout et rien, je me suis tourné vers une carrière 
            où je pourrai étendre cette passion avec encore plus de monde.
          </p>
          <p className="text-prestige-taupe leading-relaxed">
            Mon but est de vous accompagner dans vos objectifs tout en tenant compte de vos valeurs et de votre situation.
            Étant dûment certifié auprès de l'Autorité des marchés financiers, je vous invite à{' '}
            <a 
              href="https://lautorite.qc.ca/grand-public/registres/registre-des-entreprises-et-des-individus-autorises-a-exercer/"
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              vérifier la validité de mon certificat
            </a>.
          </p>
          
          {/* Quick benefits instead of fake stats */}
          <div className="flex flex-wrap gap-3 py-4">
            {[
              { icon: '🎯', label: 'Conseils personnalisés' },
              { icon: '🛡️', label: 'Certifié AMF' },
              { icon: '🤝', label: 'Accompagnement humain' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 px-4 py-2 bg-light rounded-full">
                <span>{item.icon}</span>
                <p className="text-sm font-medium text-dark">{item.label}</p>
              </div>
            ))}
          </div>
          
          <Link 
            to="/a-propos" 
            className="btn-primary inline-flex items-center gap-2"
          >
            En savoir plus sur moi
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  </section>
);

const DifferentiatorSection = () => {
  const differentiators = [
    {
      icon: Heart,
      title: 'L\'envie réelle d\'aider',
      description: 'Mon objectif est simple : vous accompagner avec sincérité et dévouement pour construire un avenir financier à votre image.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: CheckCircle2,
      title: 'L\'honnêteté',
      description: 'Grâce à une étude détaillée de vos finances, je vous offre des conseils basés sur des faits concrets.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'La résolution de problèmes',
      description: 'Avec un entêtement à trouver des solutions adaptées, je m\'engage à surmonter vos défis financiers.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <section className="section-padding bg-gradient-to-br from-dark via-primary to-dark relative overflow-hidden" data-testid="differentiator-section">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }} />
      
      <div className="container-max relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-white/10 text-secondary rounded-full text-sm font-medium mb-4">
            Ma différence
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Comment je me démarque
          </h2>
          <p className="text-white/70 text-lg">
            Des valeurs qui guident chacune de mes actions
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {differentiators.map((item, index) => (
            <div 
              key={item.title} 
              className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
              data-testid={`differentiator-${index}`}
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-white mb-3">
                {item.title}
              </h3>
              <p className="text-white/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ProcessSection = () => {
  const steps = [
    { number: '01', title: 'Analyse financière', description: 'Évaluation approfondie de vos finances', icon: '🔍' },
    { number: '02', title: 'Planification', description: 'Stratégies pour une retraite sereine', icon: '📋' },
    { number: '03', title: 'Investissement', description: 'Solutions adaptées à vos objectifs', icon: '📈' },
    { number: '04', title: 'Sécurité', description: 'Protection de votre patrimoine', icon: '🛡️' }
  ];

  return (
    <section className="section-padding bg-white relative" data-testid="process-section">
      <div className="container-max">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Mon approche
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
            Là pour vous aider à atteindre vos objectifs
          </h2>
          <p className="text-prestige-taupe text-lg">
            Un processus simple et transparent en 4 étapes
          </p>
        </div>
        
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-primary to-primary/20 -translate-y-1/2" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center group" data-testid={`process-step-${index}`}>
                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-xl border-4 border-primary/20 flex items-center justify-center group-hover:border-primary group-hover:scale-110 transition-all duration-300">
                    <span className="text-4xl">{step.icon}</span>
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-heading text-lg font-semibold text-dark mb-2">{step.title}</h3>
                <p className="text-prestige-taupe text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Link to="/contact" className="btn-primary inline-flex items-center gap-2">
            Contactez-moi
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(20);
        if (error) throw error;
        setTestimonials(data || []);
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        // Fallback testimonial
        setTestimonials([{
          id: 'default',
          author_name: 'Jacob Moreau',
          rating: 5,
          text: "Service exceptionnel, une approche humaine et une priorisation de la satisfaction de ces clients... On voit qu'il prend cela à cœur et je le recommande fortement pour ces services.",
          time: 'Il y a 3 mois'
        }]);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  // Auto-rotate testimonials
  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex] || testimonials[0];

  return (
    <section className="section-padding bg-light relative overflow-hidden" data-testid="testimonial-section">
      {/* Decorative quotes */}
      <div className="absolute top-10 left-10 text-[200px] font-serif text-primary/5 leading-none">"</div>
      <div className="absolute bottom-10 right-10 text-[200px] font-serif text-primary/5 leading-none rotate-180">"</div>
      
      <div className="container-max relative">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
            Témoignages
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
            Ce que mes clients disent
          </h2>
          <p className="text-prestige-taupe">Avis partagés sur mon profil Google</p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-3xl p-8 shadow-xl animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : currentTestimonial ? (
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-prestige-beige relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <Star 
                      key={star} 
                      className={`w-6 h-6 ${star <= currentTestimonial.rating ? 'fill-secondary text-secondary' : 'fill-gray-200 text-gray-200'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <Quote className="w-12 h-12 text-primary/10 mb-6" />
              <p className="text-dark text-lg md:text-xl leading-relaxed mb-8 font-medium">
                "{currentTestimonial.text}"
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {currentTestimonial.profile_photo_url ? (
                    <img 
                      src={currentTestimonial.profile_photo_url} 
                      alt={currentTestimonial.author_name}
                      className="w-14 h-14 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {currentTestimonial.author_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-heading font-semibold text-dark">{currentTestimonial.author_name}</p>
                    {currentTestimonial.time && (
                      <p className="text-sm text-prestige-taupe">{currentTestimonial.time}</p>
                    )}
                  </div>
                </div>
                
                {/* Google logo */}
                <div className="flex items-center gap-2 text-prestige-taupe">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
              </div>
              
              {/* Pagination dots */}
              {testimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex ? 'bg-primary w-6' : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : null}
          
          {/* Link to leave review */}
          <div className="text-center mt-8">
            <a
              href="https://g.page/r/CewlYHqUvuLyEAI/review"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
            >
              <Star className="w-4 h-4" />
              Laissez votre avis sur Google
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const PartnersSection = () => {
  const partners = [
    {
      name: 'iA Groupe financier',
      logo: IA_GROUPE_FINANCIER_LOGO,
      url: 'https://ia.ca/fr/fiche-conseiller/conseiller/pierre-olivier-caouette'
    },
    {
      name: 'Tugo Assurance Voyage',
      logo: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/67658c1c37faab7caff071db.webp',
      url: 'https://shop.tugo.com/store/IAJ19165'
    }
  ];

  return (
    <section className="py-16 bg-white border-t border-prestige-beige" data-testid="partners-section">
      <div className="container-max">
        <p className="text-center text-prestige-taupe mb-8">Partenaires de confiance</p>
        <div className="flex flex-wrap justify-center items-center gap-16">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <img src={partner.logo} alt={partner.name} className="h-14 w-auto object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => (
  <section className="section-padding relative overflow-hidden" data-testid="cta-section">
    {/* Gradient background */}
    <div className="absolute inset-0 gradient-hero" />
    
    {/* Animated shapes */}
    <div className="absolute inset-0">
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
    </div>
    
    <div className="container-max relative text-center">
      <div className="max-w-3xl mx-auto space-y-8">
        <span className="inline-block px-4 py-1 bg-white/10 text-white rounded-full text-sm font-medium">
          Prêt à commencer?
        </span>
        <h2 className="font-heading text-3xl md:text-5xl font-bold text-white">
          Prêt à maximiser vos profits?
        </h2>
        <p className="text-white/80 text-lg md:text-xl max-w-xl mx-auto">
          Prenez rendez-vous pour une consultation gratuite et sans engagement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link 
            to="/rendez-vous" 
            onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'home_final_rendez_vous' })}
            className="group bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-secondary hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg"
            data-testid="cta-final-rdv"
          >
            Prendre rendez-vous
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            to="/contact" 
            onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'home_final_contact' })}
            className="border-2 border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center backdrop-blur-sm"
            data-testid="cta-final-contact"
          >
            Poser une question
          </Link>
        </div>
      </div>
    </div>
  </section>
);

export const Home = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const refFromQuery = searchParams.get('ref');
  useSeoMeta({
    title: 'Conseiller financier au Quebec | Assurance vie, retraite et placements',
    description: 'Conseiller en securite financiere a Victoriaville: assurance vie, invalidite, REER, CELI et planification financiere personnalisee.',
    canonicalPath: '/',
  });

  useEffect(() => {
    if (!refFromQuery?.trim()) return;
    const ref = encodeURIComponent(refFromQuery.trim());
    const path = `/recommandations/consentement?ref=${ref}`;
    const publicOrigin = getPublicSiteOrigin();
    if (typeof window !== 'undefined' && publicOrigin && publicOrigin !== window.location.origin) {
      window.location.replace(`${publicOrigin}${path}`);
      return;
    }
    navigate(path, { replace: true });
  }, [refFromQuery, navigate]);

  return (
    <main data-testid="home-page">
      <Hero />
      <ServicesSection />
      <AdvantageSection />
      <AboutPreview />
      <DifferentiatorSection />
      <ProcessSection />
      <TestimonialSection />
      <PartnersSection />
      <CTASection />
    </main>
  );
};
