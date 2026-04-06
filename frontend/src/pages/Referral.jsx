import { Link } from 'react-router-dom';
import { Gift, Users, CheckCircle2, ArrowRight, Trophy, Star, Sparkles, Heart, MessageSquare, UserCheck, Crown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../lib/analytics';

export const Referral = () => {
  const { user } = useAuth();
  
  const tiers = [
    {
      threshold: 10,
      reward: '25 $',
      name: 'Bronze',
      icon: Trophy,
      color: 'text-orange-700',
      bg: 'bg-orange-100',
      gradient: 'from-orange-600 to-orange-400',
      description: 'Carte cadeau de 25 $'
    },
    {
      threshold: 20,
      reward: '50 $',
      name: 'Argent',
      icon: Trophy,
      color: 'text-gray-500',
      bg: 'bg-gray-100',
      gradient: 'from-gray-500 to-gray-300',
      description: 'Carte cadeau de 50 $'
    },
    {
      threshold: 40,
      reward: '100 $',
      name: 'Or',
      icon: Trophy,
      color: 'text-yellow-600',
      bg: 'bg-yellow-100',
      gradient: 'from-yellow-500 to-yellow-300',
      description: 'Carte cadeau de 100 $'
    },
    {
      threshold: 75,
      reward: '250 $',
      name: 'Platine',
      icon: Star,
      color: 'text-cyan-600',
      bg: 'bg-cyan-100',
      gradient: 'from-cyan-500 to-cyan-300',
      description: 'Carte cadeau de 250 $'
    },
    {
      threshold: 100,
      reward: 'Coffret Privilège',
      name: 'Privilège',
      icon: Crown,
      color: 'text-purple-600',
      bg: 'bg-purple-100',
      gradient: 'from-purple-600 to-purple-400',
      description: 'Coffret Privilège exclusif'
    }
  ];

  const pointsMethods = [
    {
      icon: Users,
      title: 'Référez quelqu\'un',
      points: 1,
      description: 'Recevez 1 point pour chaque mise en relation valide. La personne invitée remplit une page de consentement (coordonnées + accord pour être contactée).',
      color: 'bg-blue-500'
    },
    {
      icon: MessageSquare,
      title: 'Avis Google',
      points: 2,
      description: 'Recevez 2 points en laissant un avis Google reconnu. Votre témoignage peut aider d\'autres personnes.',
      color: 'bg-green-500'
    },
    {
      icon: UserCheck,
      title: 'Client existant',
      points: 2,
      description: 'Vous êtes déjà client? Confirmez votre statut et recevez 2 points de remerciement.',
      color: 'bg-purple-500'
    }
  ];

  const benefits = [
    {
      icon: Gift,
      title: 'Remerciements appréciés',
      description: 'Des avantages de remerciement sont offerts pour reconnaître les mises en relation admissibles.'
    },
    {
      icon: Heart,
      title: 'Aidez vos proches',
      description: 'Faites bénéficier votre entourage de conseils financiers personnalisés et gratuits.'
    },
    {
      icon: Users,
      title: 'Paliers cumulatifs',
      description: 'Les niveaux s\'additionnent: à 100 points, les avantages cumulés peuvent atteindre 425$ + un coffret Privilège.'
    },
    {
      icon: Sparkles,
      title: 'Simple et transparent',
      description: 'Suivez vos points et références en temps réel dans votre espace personnel.'
    }
  ];

  const steps = [
    {
      number: '01',
      title: 'Inscrivez-vous',
      description: 'Créez votre compte gratuit et obtenez votre lien de référencement unique.'
    },
    {
      number: '02',
      title: 'Mises en relation et interactions',
      description: 'Recommandez des proches, laissez un avis Google, ou confirmez votre statut de client existant.'
    },
    {
      number: '03',
      title: 'Validation',
      description: 'Une référence est considérée valide lorsqu’une mise en relation est effectuée avec le consentement de la personne référée.'
    },
    {
      number: '04',
      title: 'Remerciement',
      description: 'Les points de remerciement sont appliqués selon les critères du programme.'
    }
  ];

  const faqs = [
    {
      question: 'Comment fonctionne le système de points?',
      answer: 'Vous recevez 1 point par mise en relation valide, 2 points pour un avis Google reconnu, et 2 points en confirmant votre statut de client existant. Les points s\'accumulent pour les niveaux de reconnaissance du programme.'
    },
    {
      question: 'Les paliers sont-ils cumulatifs?',
      answer: 'Oui. À 100 points, les avantages cumulés incluent 25$ + 50$ + 100$ + 250$ + coffret Privilège = 425$ en cartes-cadeaux, plus le coffret.'
    },
    {
      question: 'Comment laisser un avis Google?',
      answer: 'Connectez-vous à votre profil et cliquez sur "Laisser un avis Google". Vous serez redirigé vers Google My Business. Après avoir laissé votre avis, confirmez-le dans votre profil.'
    },
    {
      question: 'Comment prouver que je suis un client existant?',
      answer: 'Dans votre profil, remplissez le formulaire avec votre prénom, nom et date de naissance. Notre équipe vérifiera votre statut dans nos dossiers.'
    },
    {
      question: 'Combien de temps prend la vérification?',
      answer: 'Les vérifications sont généralement traitées dans les 48 heures ouvrables.'
    },
    {
      question: 'Est-ce que je dois vendre ou expliquer des produits?',
      answer: 'Non. Votre role est uniquement de mettre en relation. Vous ne devez pas fournir de conseils ni presenter des produits financiers.'
    },
    {
      question: 'Les points dépendent-ils d’une vente?',
      answer: 'Non. Les points sont attribués pour la mise en relation, peu importe qu’une transaction ait lieu ou non.'
    }
  ];

  // Calculate cumulative rewards
  const cumulativeReward = tiers.reduce((acc, tier, index) => {
    const previousTotal = index > 0 ? acc[index - 1].total : 0;
    const currentValue = tier.name === 'Privilège' ? 0 : parseInt(tier.reward.replace(' $', '').replace(',', ''));
    return [...acc, { total: previousTotal + currentValue, tier: tier.name }];
  }, []);

  return (
    <main className="pt-20" data-testid="referral-page">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 bg-secondary rounded-full blur-3xl opacity-20" />
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl opacity-10" />
        </div>
        
        <div className="relative section-padding">
          <div className="container-max text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-6">
              <Gift className="w-5 h-5 text-secondary" />
              <span className="text-white font-medium">Programme de référencement</span>
            </div>
            
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              Recommandez des proches. <span className="text-secondary">Recevez des remerciements.</span>
            </h1>
            
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              3 facons de recevoir des points de remerciement. 5 paliers de reconnaissance.
              Jusqu'a 425$ en cartes-cadeaux + un coffret Privilège.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Link 
                  to="/profil" 
                  onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_profile' })}
                  className="bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-light transition-all inline-flex items-center justify-center gap-2"
                  data-testid="referral-cta-profile"
                >
                  Voir mes points
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link 
                    to="/inscription" 
                    onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_register' })}
                    className="bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-light transition-all inline-flex items-center justify-center gap-2"
                    data-testid="referral-cta-register"
                  >
                    Créer mon compte
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link 
                    to="/connexion" 
                    onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'referral_hero_login' })}
                    className="border-2 border-white text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 transition-all inline-flex items-center justify-center"
                    data-testid="referral-cta-login"
                  >
                    J'ai déjà un compte
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Points Methods Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              3 facons de recevoir des points de remerciement
            </h2>
            <p className="text-prestige-taupe text-lg">
              Programme de reconnaissance pour les mises en relation personnelles
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pointsMethods.map((method, index) => (
              <div 
                key={method.title}
                className="relative bg-white rounded-2xl p-8 shadow-ia hover:shadow-ia-hover transition-all group overflow-hidden"
                data-testid={`points-method-${index}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${method.color} ${method.color.replace('bg-', 'to-').replace('500', '300')}`} />
                
                <div className={`w-16 h-16 rounded-2xl ${method.color} flex items-center justify-center mb-6`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-heading text-xl font-semibold text-dark">
                    {method.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-bold ${method.color}`}>
                    +{method.points} pt{method.points > 1 ? 's' : ''}
                  </span>
                </div>
                
                <p className="text-prestige-taupe">
                  {method.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl mx-auto bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-5">
            <p className="text-sm md:text-base text-dark">
              Les points sont attribués pour une mise en relation valide uniquement, sans obligation de souscription.
            </p>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="section-padding gradient-prestige">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              Les paliers de récompenses
            </h2>
            <p className="text-prestige-taupe text-lg">
              Les paliers representent des niveaux de reconnaissance et non une remuneration liee a la vente ou a la performance.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {tiers.map((tier, index) => (
              <div 
                key={tier.name}
                className="bg-white rounded-2xl p-6 shadow-ia hover:shadow-ia-hover transition-shadow text-center relative overflow-hidden"
                data-testid={`tier-card-${index}`}
              >
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.gradient}`} />
                
                <div className={`w-14 h-14 mx-auto rounded-full ${tier.bg} flex items-center justify-center mb-3`}>
                  <tier.icon className={`w-7 h-7 ${tier.color}`} />
                </div>
                
                <h3 className="font-heading text-lg font-bold text-dark mb-1">
                  {tier.name}
                </h3>
                <p className="text-prestige-taupe text-sm mb-3">
                  {tier.threshold} points
                </p>
                
                <div className="bg-light rounded-xl py-3 px-4">
                  <p className="font-heading text-2xl font-bold text-primary">
                    {tier.reward}
                  </p>
                  <p className="text-prestige-taupe text-xs mt-1">
                    {tier.description}
                  </p>
                </div>
                
                {index < cumulativeReward.length && cumulativeReward[index].total > 0 && (
                  <p className="text-xs text-green-600 mt-2 font-medium">
                    Total cumulé: {cumulativeReward[index].total}$
                  </p>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-8 text-center bg-white/50 rounded-xl p-6 max-w-2xl mx-auto">
            <p className="text-dark font-medium">
              <strong>Exemple:</strong> A 40 points, les avantages cumules sont 25$ + 50$ + 100$ = <strong className="text-primary">175$</strong>
            </p>
          </div>
          <div className="mt-4 text-center bg-white/70 border border-prestige-beige rounded-xl p-5 max-w-3xl mx-auto">
            <p className="text-dark text-sm md:text-base">
              Les récompenses ne sont en aucun cas liées à la conclusion d’un contrat ou à l’achat d’un produit financier.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              Pourquoi participer?
            </h2>
            <p className="text-prestige-taupe text-lg">
              Un programme simple, transparent et utile pour vos recommandations personnelles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div 
                key={benefit.title}
                className="card-feature text-center group"
                data-testid={`benefit-card-${index}`}
              >
                <div className="w-16 h-16 mx-auto rounded-2xl bg-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                  <benefit.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-dark mb-3">
                  {benefit.title}
                </h3>
                <p className="text-prestige-taupe">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-4xl mx-auto bg-amber-50 border border-amber-200 rounded-xl p-4 md:p-5">
            <p className="text-sm md:text-base text-dark">
              Ce programme vise uniquement a remercier les recommandations personnelles, sans implication dans la presentation ou le conseil de produits financiers.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-padding bg-light">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              Comment ça fonctionne?
            </h2>
            <p className="text-prestige-taupe text-lg">
              Un processus simple en 4 étapes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative text-center" data-testid={`step-${index}`}>
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-prestige-beige" />
                )}
                
                <div className="relative z-10 mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-white shadow-ia flex items-center justify-center">
                    <span className="font-heading text-3xl font-bold text-primary">{step.number}</span>
                  </div>
                </div>
                <h3 className="font-heading text-xl font-semibold text-dark mb-3">{step.title}</h3>
                <p className="text-prestige-taupe">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 max-w-3xl mx-auto text-center bg-white rounded-xl border border-prestige-beige p-4">
            <p className="text-sm text-prestige-taupe">
              Les points sont attribues pour la mise en relation uniquement, independamment des suites donnees.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-white">
        <div className="container-max">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-dark mb-4">
              Questions fréquentes
            </h2>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index}
                className="bg-light rounded-xl p-6"
                data-testid={`faq-${index}`}
              >
                <h3 className="font-heading font-semibold text-dark mb-2">
                  {faq.question}
                </h3>
                <p className="text-prestige-taupe">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="section-padding bg-light">
        <div className="container-max">
          <div className="max-w-4xl mx-auto bg-white border border-prestige-beige rounded-2xl p-6 md:p-8">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark mb-4">
              Conditions du programme
            </h2>
            <div className="space-y-3 text-prestige-taupe">
              <p>
                Ce programme est offert a titre de reconnaissance pour des mises en relation.
              </p>
              <p>
                Il ne constitue pas une activite de distribution de produits ou services financiers.
              </p>
              <p>
                Les participants ne sont pas autorises a conseiller, recommander ou presenter des produits financiers.
              </p>
              <p>
                Une compensation peut etre versee pour certaines mises en relation.
              </p>
              <p>
                Les récompenses sont indépendantes de toute décision financière prise par la personne référée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding gradient-hero">
        <div className="container-max text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <Gift className="w-16 h-16 mx-auto text-secondary" />
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white">
              {user ? 'Consultez vos points' : 'Prêt à commencer?'}
            </h2>
            <p className="text-white/80 text-lg md:text-xl">
              {user 
                ? 'Accédez à votre tableau de bord pour suivre vos points et récompenses!'
                : 'Créez votre compte maintenant et commencez à accumuler des points!'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to={user ? "/profil" : "/inscription"}
                onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: user ? 'referral_final_profile' : 'referral_final_register' })}
                className="bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-light transition-all inline-flex items-center justify-center gap-2"
              >
                {user ? 'Voir mes points' : 'Créer mon compte'}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-6 bg-dark">
        <div className="container-max px-4 md:px-8">
          <p className="text-white/50 text-xs text-center">
            Programme de référencement sujet à conditions. Les récompenses sont accordées sous forme de cartes-cadeaux. 
            Pierre-Olivier Caouette se réserve le droit de modifier les conditions du programme à tout moment.
          </p>
        </div>
      </section>
    </main>
  );
};
