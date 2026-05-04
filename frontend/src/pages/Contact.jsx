import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Send, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';
import { PageHero } from '../components/layout/PageHero';

// Contact info centralisé
const CONTACT_INFO = {
  phone: '819 806-1164',
  phoneLink: 'tel:8198061164',
  email: 'p-o.caouette@agc.ia.ca',
  region: 'Victoriaville, Québec',
  bookingUrl: 'https://api.leadconnectorhq.com/widget/booking/8l6InqNxGKrSWjVMyHDJ'
};

export const Contact = () => {
  useSeoMeta({
    title: 'Contact conseiller financier | Victoriaville et Quebec',
    description: 'Contactez un conseiller en securite financiere pour vos besoins en assurance, epargne, retraite et planification.',
    canonicalPath: '/contact',
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    referral_code: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check for referral code in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referral_code: ref }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.rpc('create_contact_submission', {
        p_name: formData.name,
        p_email: formData.email,
        p_phone: formData.phone || null,
        p_subject: formData.subject,
        p_message: formData.message,
        p_referral_code: formData.referral_code || null
      });
      if (error) throw error;
      setSubmitted(true);
      trackEvent('generate_lead', {
        method: 'contact_form',
        has_phone: Boolean(formData.phone),
        has_referral_code: Boolean(formData.referral_code),
      });
      toast.success('Message envoyé avec succès!');
    } catch (error) {
      console.error(error);
      trackEvent('contact_form_error', {
        source: 'contact_page',
      });
      toast.error(error.message || 'Erreur lors de l\'envoi. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-light" data-testid="contact-success">
        <div className="text-center max-w-md mx-4">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <Send className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-dark mb-4">
            Message envoyé!
          </h1>
          <p className="text-prestige-taupe mb-8">
            Merci pour votre message. Je vous répondrai dans les plus brefs délais.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Retour à l'accueil
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-light" data-testid="contact-page">
      <PageHero
        badge="Contact"
        title="Contactez-moi"
        description="Une question? Une demande d analyse? N hesitez pas a me contacter, je vous repondrai rapidement."
      />

      {/* Contact Form */}
      <section className="section-padding">
        <div className="container-max">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-ia p-8">
                <h2 className="font-heading text-2xl font-bold text-dark mb-6">
                  Envoyez-moi un message
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Jean Tremblay"
                        required
                        data-testid="contact-name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Courriel *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="vous@exemple.com"
                        required
                        data-testid="contact-email"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="(819) 123-4567"
                        data-testid="contact-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Sujet *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                        placeholder="Demande d'information"
                        required
                        data-testid="contact-subject"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Comment puis-je vous aider?"
                      rows={6}
                      required
                      data-testid="contact-message"
                    />
                  </div>

                  {formData.referral_code && (
                    <div className="p-3 bg-light rounded-lg">
                      <p className="text-sm text-prestige-taupe">
                        Code de référencement: <strong>{formData.referral_code}</strong>
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full md:w-auto"
                    data-testid="contact-submit"
                  >
                    {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                    <Send className="w-4 h-4 ml-2" />
                  </Button>
                </form>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-ia p-6">
                <h3 className="font-heading text-xl font-semibold text-dark mb-4">
                  Informations de contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-prestige-taupe">Téléphone</p>
                      <a
                        href={CONTACT_INFO.phoneLink}
                        onClick={() => trackEvent('contact_click', { channel: 'phone', source: 'contact_page' })}
                        className="font-medium text-dark hover:text-primary"
                      >
                        {CONTACT_INFO.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-prestige-taupe">Courriel</p>
                      <a
                        href={`mailto:${CONTACT_INFO.email}`}
                        onClick={() => trackEvent('contact_click', { channel: 'email', source: 'contact_page' })}
                        className="font-medium text-dark hover:text-primary"
                      >
                        {CONTACT_INFO.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-light flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-prestige-taupe">Région</p>
                      <p className="font-medium text-dark">{CONTACT_INFO.region}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary to-dark rounded-2xl p-6 text-white">
                <h3 className="font-heading text-xl font-semibold mb-4">
                  Préférez-vous parler?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Prenez rendez-vous pour une consultation gratuite et sans engagement.
                </p>
                <Link 
                  to="/rendez-vous"
                  onClick={() => trackEvent('select_content', { content_type: 'cta', item_id: 'contact_to_rendez_vous' })}
                  className="inline-flex items-center gap-2 bg-white text-primary px-4 py-2 rounded-full font-medium hover:bg-light transition-colors"
                >
                  Prendre rendez-vous
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export const Appointment = () => {
  useSeoMeta({
    title: 'Prendre rendez-vous | Conseiller financier',
    description: 'Prenez rendez-vous pour une consultation en assurance vie, retraite, REER, CELI et planification financiere.',
    canonicalPath: '/rendez-vous',
  });

  useEffect(() => {
    trackEvent('view_item', { item_category: 'appointment', item_id: 'booking_page' });
    // Load GoHighLevel widget script
    const script = document.createElement('script');
    script.src = 'https://link.msgsndr.com/js/form_embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      const existingScript = document.querySelector('script[src="https://link.msgsndr.com/js/form_embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <main className="min-h-screen bg-light" data-testid="appointment-page">
      <PageHero
        badge="Rendez-vous"
        title="Prendre rendez-vous"
        description="Reservez une consultation gratuite et sans engagement. Choisissez le moment qui vous convient."
      />

      {/* GoHighLevel Calendar */}
      <section className="section-padding">
        <div className="container-max">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-ia p-8">
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl font-bold text-dark mb-2">
                  Calendrier de réservation
                </h2>
                <p className="text-prestige-taupe">
                  Sélectionnez une date et une heure qui vous conviennent
                </p>
              </div>
              
              {/* GoHighLevel Calendar Embed */}
              <div 
                className="min-h-[600px] rounded-xl overflow-hidden"
                data-testid="ghl-calendar"
              >
                <iframe
                  src={CONTACT_INFO.bookingUrl}
                  style={{
                    width: '100%',
                    height: '700px',
                    border: 'none',
                    overflow: 'hidden'
                  }}
                  scrolling="no"
                  title="Calendrier de rendez-vous"
                  allow="payment"
                />
              </div>

              {/* Info Steps */}
              <div className="mt-8 grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-light flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">1</span>
                  </div>
                  <h4 className="font-semibold text-dark">Choisissez</h4>
                  <p className="text-sm text-prestige-taupe">Sélectionnez une date et heure</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-light flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">2</span>
                  </div>
                  <h4 className="font-semibold text-dark">Confirmez</h4>
                  <p className="text-sm text-prestige-taupe">Entrez vos informations</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-light flex items-center justify-center mb-3">
                    <span className="text-xl font-bold text-primary">3</span>
                  </div>
                  <h4 className="font-semibold text-dark">Recevez</h4>
                  <p className="text-sm text-prestige-taupe">Confirmation par courriel</p>
                </div>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="mt-8 grid md:grid-cols-3 gap-4">
              <a 
                href={CONTACT_INFO.phoneLink}
                onClick={() => trackEvent('contact_click', { channel: 'phone', source: 'appointment_page' })}
                className="bg-white rounded-xl p-4 shadow-ia hover:shadow-ia-hover transition-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-prestige-taupe">Téléphone</p>
                  <p className="font-medium text-dark">{CONTACT_INFO.phone}</p>
                </div>
              </a>
              <a 
                href={`mailto:${CONTACT_INFO.email}`}
                onClick={() => trackEvent('contact_click', { channel: 'email', source: 'appointment_page' })}
                className="bg-white rounded-xl p-4 shadow-ia hover:shadow-ia-hover transition-shadow flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-prestige-taupe">Courriel</p>
                  <p className="font-medium text-dark text-sm">{CONTACT_INFO.email}</p>
                </div>
              </a>
              <div className="bg-white rounded-xl p-4 shadow-ia flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-prestige-taupe">Région</p>
                  <p className="font-medium text-dark">{CONTACT_INFO.region}</p>
                </div>
              </div>
            </div>

            {/* Alternative */}
            <div className="mt-8 text-center">
              <p className="text-prestige-taupe mb-4">
                Vous préférez envoyer un message? 
              </p>
              <Link 
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2"
              >
                Me contacter
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
