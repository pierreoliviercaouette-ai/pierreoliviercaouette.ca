import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Award, Heart, Target, Star, Quote, ExternalLink, Shield, TrendingUp, Users } from 'lucide-react';
import { useSeoMeta } from '../lib/seo';
import { AMF_REGISTRE_URL, IA_AUTO_HABITATION_LOGO, IA_AUTO_HABITATION_URL } from '../lib/branding';

export const About = () => {
  useSeoMeta({
    title: 'A propos | Conseiller en securite financiere au Quebec',
    description: 'Decouvrez le parcours, les valeurs et l approche de Pierre-Olivier Caouette, conseiller en securite financiere a Victoriaville.',
    canonicalPath: '/a-propos',
  });

  const values = [
    {
      icon: Heart,
      title: 'L\'envie réelle d\'aider',
      description: 'Mon objectif est simple : vous accompagner avec sincérité et dévouement pour construire un avenir financier à votre image.',
      gradient: 'from-red-500 to-pink-500'
    },
    {
      icon: Target,
      title: 'L\'honnêteté',
      description: 'Grâce à une étude détaillée de vos finances, je vous offre des conseils basés sur des faits concrets, afin de garantir des décisions éclairées.',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Award,
      title: 'La résolution de problèmes',
      description: 'Avec un entêtement à trouver des solutions adaptées, je m\'engage à surmonter vos défis financiers et à vous guider vers des résultats durables.',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const partners = [
    {
      name: 'iA Auto et Habitation',
      logo: IA_AUTO_HABITATION_LOGO,
      url: IA_AUTO_HABITATION_URL,
    },
    {
      name: 'Tugo Assurance Voyage',
      logo: 'https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/67658c1c37faab7caff071db.webp',
      url: 'https://shop.tugo.com/store/IAJ19165'
    }
  ];

  const timeline = [
    { year: '2017', title: 'Formation McGill', description: 'Cours en finance personnelle complété' },
    { year: '2024', title: 'Changement de carrière', description: 'Transition vers le conseil financier' },
    { year: '2024', title: 'Certification AMF', description: 'Conseiller en sécurité financière certifié' },
    { year: 'Aujourd\'hui', title: 'À votre service', description: 'Accompagnement personnalisé' }
  ];

  return (
    <main className="pt-20" data-testid="about-page">
      {/* Hero Section - Enhanced */}
      <section className="relative min-h-[70vh] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-hero" />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-white/10 rounded-full blur-[60px]" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="container-max relative z-10 min-h-[70vh] flex items-center px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full py-20">
            <div className="space-y-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                <span className="w-2 h-2 bg-secondary rounded-full" />
                <span className="text-white/90 text-sm font-medium">À propos de moi</span>
              </span>
              
              <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Qui suis-je
              </h1>
              
              <p className="text-white/80 text-lg leading-relaxed max-w-xl">
                Après avoir passé des années à conseiller mon entourage sur tout et rien, je me suis tourné vers une carrière 
                où je pourrai étendre cette passion avec encore plus de monde. Mon but est de vous accompagner dans vos objectifs 
                tout en tenant compte de vos valeurs et de votre situation.
              </p>
              
              <div className="flex items-center gap-4">
                <a 
                  href={AMF_REGISTRE_URL}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm hover:bg-white/20 transition-colors"
                >
                  <Shield className="w-4 h-4 text-secondary" />
                  Vérifier mon certificat AMF
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
            
            {/* Photo - Enhanced circular design */}
            <div className="relative flex justify-center">
              {/* Animated rings */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] border-2 border-white/10 rounded-full animate-pulse" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] border-2 border-secondary/30 rounded-full" />
              
              {/* Photo container */}
              <div className="relative">
                <div className="w-72 h-72 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl">
                  <img
                    src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/677952146419fdc38392dfcd.png"
                    alt="Pierre-Olivier Caouette"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                
                {/* Floating badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full px-4 sm:px-6 py-2 shadow-xl flex items-center gap-2 max-w-[min(100%,calc(100vw-2rem))]">
                  <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                  <a
                    href={AMF_REGISTRE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-dark text-center text-sm sm:text-base hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded"
                  >
                    Certifié AMF
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Wave bottom — svg en block pour éviter la ligne fantôme sous la courbe */}
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

      {/* Story Section - Enhanced */}
      <section className="section-padding bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-48 h-48 bg-secondary/10 rounded-full blur-2xl" />
        
        <div className="container-max relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium">
                Mon histoire
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
                Passé du milieu industriel au milieu financier
              </h2>
              <div className="space-y-4 text-prestige-taupe leading-relaxed">
                <p>
                  Beaucoup de gens, comme moi, ont suivi une voie qu'ils croyaient faite pour eux. Pour moi, c'était le milieu de l'automatisation industrielle. 
                  Après un DEP en électromécanique, une technique en électronique industrielle, et 4 ans à travailler comme programmeur industriel, 
                  je me suis remis en question.
                </p>
                <p>
                  Non seulement j'avais de l'intérêt pour les finances, mais je m'étais même déjà engagé à me former sur le sujet grâce au cours en finance personnelle 
                  de McGill complété vers 2017-2018.
                </p>
                <p>
                  Il m'est donc venu comme envie de prendre en main ma vie et effectuer un changement d'emploi. C'est alors que j'ai lu sur le métier 
                  de conseiller en sécurité financière. La mission première : <strong className="text-dark">Conseiller sur les moyens à prendre pour veiller à la protection financière 
                  et à la croissance de leur patrimoine.</strong>
                </p>
              </div>
              <Link 
                to="/contact" 
                className="btn-primary inline-flex items-center gap-2"
              >
                Contactez-moi!
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            
            {/* Photo with enhanced styling */}
            <div className="relative">
              {/* Background shapes */}
              <div className="absolute -top-8 -right-8 w-full h-full bg-gradient-to-br from-primary/10 to-secondary/5 rounded-[3rem] transform rotate-3" />
              <div className="absolute -bottom-4 -left-4 w-2/3 h-2/3 bg-secondary/10 rounded-[2rem]" />
              
              {/* Main photo */}
              <div className="relative z-10 overflow-hidden rounded-[2rem] shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent z-10" />
                <img
                  src="https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/DPncC0gpI0OUcDSaMWVp/media/677aabaf6e3c7422d41c91c5.png"
                  alt="Pierre-Olivier parcours"
                  className="w-full h-[500px] object-cover object-[50%_18%]"
                />
                
                {/* Overlay text */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-white/80 text-sm">Victoriaville, Québec</p>
                  <p className="text-white font-heading text-xl font-semibold">Une passion devenue métier</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="section-padding bg-light">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
              Mon parcours
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark">
              Les étapes clés
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              {/* Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-primary/30" />
              
              {/* Items */}
              <div className="space-y-8">
                {timeline.map((item, index) => (
                  <div key={`${item.title}-${index}`} className="relative flex gap-6 items-start">
                    {/* Dot — min. largeur pour « Aujourd'hui » (ne dépasse pas du cercle) */}
                    <div
                      className={`relative z-10 shrink-0 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-primary px-1 ${
                        item.year.length > 4 ? 'min-w-[4.5rem] h-16' : 'w-16 h-16'
                      }`}
                    >
                      <span
                        className={`font-bold text-primary text-center leading-tight ${
                          item.year.length > 4 ? 'text-[11px] sm:text-xs' : 'text-sm'
                        }`}
                      >
                        {item.year}
                      </span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <h3 className="font-heading text-xl font-semibold text-dark mb-2">{item.title}</h3>
                      <p className="text-prestige-taupe">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - Enhanced */}
      <section className="section-padding bg-gradient-to-br from-dark via-primary to-dark relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
        
        <div className="container-max relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="inline-block px-4 py-1 bg-white/10 text-secondary rounded-full text-sm font-medium mb-4">
              Mes valeurs
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
              Comment je me démarque
            </h2>
            <p className="text-white/70 text-lg">
              Des valeurs qui guident chacune de mes actions
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div 
                key={value.title}
                className="group bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
                data-testid={`value-card-${index}`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-white/70 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="section-padding bg-white relative overflow-hidden">
        <div className="absolute top-10 left-10 text-[150px] font-serif text-primary/5 leading-none">"</div>
        
        <div className="container-max relative">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="inline-block px-4 py-1 bg-secondary/10 text-secondary rounded-full text-sm font-medium mb-4">
              Témoignages
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              Ce que mes clients disent
            </h2>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <div className="bg-light rounded-3xl p-8 md:p-10 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1">
                {[1,2,3,4,5].map((star) => (
                  <Star key={star} className="w-6 h-6 fill-secondary text-secondary" />
                ))}
              </div>
              
              <Quote className="w-12 h-12 text-primary/10 mb-4" />
              <p className="text-dark text-lg leading-relaxed mb-6">
                "Service exceptionnel, une approche humaine et une priorisation de la satisfaction de ces clients... 
                On voit qu'il prend cela à cœur et je le recommande fortement pour ces services."
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <span className="text-white font-bold">JM</span>
                </div>
                <div>
                  <p className="font-semibold text-dark">Jacob Moreau</p>
                  <p className="text-sm text-prestige-taupe">Client satisfait</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-12 bg-light border-t border-prestige-beige">
        <div className="container-max">
          <p className="text-center text-prestige-taupe mb-8">Partenaires de confiance</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-16">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all duration-300 hover:scale-105 inline-flex items-center justify-center min-h-[3rem] px-2"
              >
                <img
                  src={partner.logo}
                  alt={partner.name}
                  className="max-h-10 md:max-h-11 w-auto max-w-[min(220px,85vw)] object-contain object-center"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="relative bg-gradient-to-br from-dark via-primary to-dark rounded-3xl p-8 md:p-16 text-center overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
            
            <div className="relative">
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
                Envie d'en discuter?
              </h2>
              <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                Prenez rendez-vous pour une consultation gratuite et sans engagement. 
                Je serai heureux de répondre à vos questions.
              </p>
              <Link 
                to="/rendez-vous" 
                className="inline-flex items-center gap-2 bg-white text-primary px-8 py-4 rounded-full font-semibold hover:bg-secondary hover:text-white transition-all duration-300 shadow-lg"
                data-testid="about-cta-rdv"
              >
                Prendre rendez-vous
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
