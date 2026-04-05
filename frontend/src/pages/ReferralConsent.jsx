import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShieldCheck, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Checkbox } from '../components/ui/checkbox';
import { toast } from 'sonner';
import { supabase } from '../lib/supabaseClient';

const CONSENT_TEXT =
  "J'accepte que Pierre-Olivier Caouette, conseiller en sécurité financière, communique avec moi par téléphone ou par courriel au sujet de ses services de conseil, en se basant sur les renseignements que je fournis ci-dessous. Je comprends que je peux retirer ce consentement en tout temps en le lui signalant directement.";

const errorMessages = {
  consent_required: 'Vous devez accepter le consentement pour continuer.',
  required_fields: 'Veuillez remplir tous les champs obligatoires.',
  invalid_code: 'Ce lien de parrainage n’est pas valide. Demandez un nouveau lien à la personne qui vous a invité.',
  duplicate: 'Une demande avec cette adresse courriel existe déjà pour ce parrainage.'
};

export const ReferralConsent = () => {
  const [searchParams] = useSearchParams();
  const refCode = (searchParams.get('ref') || '').trim();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!refCode) {
      toast.error('Lien incomplet : il manque le code de parrainage.');
    }
  }, [refCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!refCode) {
      toast.error(errorMessages.invalid_code);
      return;
    }
    if (!consent) {
      toast.error(errorMessages.consent_required);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('submit_referral_consent', {
        p_referral_code: refCode,
        p_first_name: firstName.trim(),
        p_last_name: lastName.trim(),
        p_phone: phone.trim(),
        p_email: email.trim(),
        p_consent: true
      });

      if (error) throw error;

      if (!data?.ok) {
        const key = data?.error || 'invalid_code';
        toast.error(errorMessages[key] || 'Une erreur est survenue.');
        return;
      }

      setDone(true);
      toast.success('Merci! Votre demande a été transmise.');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <main className="pt-20 min-h-screen flex items-center justify-center bg-gray-50 px-4" data-testid="referral-consent-success">
        <div className="w-full max-w-lg text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-heading text-2xl md:text-3xl font-bold text-dark mb-4">
            Merci pour votre confiance
          </h1>
          <p className="text-prestige-taupe mb-8">
            Pierre-Olivier Caouette communiquera avec vous sous peu en fonction du consentement que vous avez accordé.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary inline-flex items-center justify-center gap-2">
              Retour à l’accueil
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/rendez-vous" className="btn-secondary inline-flex items-center justify-center gap-2">
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-20 min-h-screen bg-gray-50" data-testid="referral-consent-page">
      <section className="section-padding gradient-hero">
        <div className="container-max text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full mb-4">
            <ShieldCheck className="w-5 h-5 text-secondary" />
            <span className="text-white/90 text-sm font-medium">Invitation personnelle</span>
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-4">
            Une personne de votre entourage vous recommande
          </h1>
          <p className="text-white/80 text-lg">
            Remplissez le formulaire ci-dessous pour que Pierre-Olivier Caouette puisse vous joindre de façon conforme et respectueuse.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-max max-w-xl mx-auto">
          {!refCode ? (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex gap-3">
              <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-dark mb-2">Lien invalide</p>
                <p className="text-prestige-taupe text-sm mb-4">
                  Ce lien ne contient pas de code de parrainage. Utilisez le lien complet qui vous a été envoyé, ou{' '}
                  <Link to="/contact" className="text-primary font-medium hover:underline">
                    écrivez-nous
                  </Link>
                  .
                </p>
                <Link to="/" className="text-primary font-medium text-sm hover:underline">
                  Retour à l’accueil
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-ia p-6 md:p-8 border border-prestige-beige/30">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ref-first">Prénom *</Label>
                    <Input
                      id="ref-first"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      autoComplete="given-name"
                      placeholder="Jean"
                      data-testid="referral-consent-first-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ref-last">Nom *</Label>
                    <Input
                      id="ref-last"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      autoComplete="family-name"
                      placeholder="Tremblay"
                      data-testid="referral-consent-last-name"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="ref-phone">Numéro de téléphone *</Label>
                  <Input
                    id="ref-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    placeholder="819 555-1234"
                    data-testid="referral-consent-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="ref-email">Courriel *</Label>
                  <Input
                    id="ref-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    placeholder="vous@exemple.com"
                    data-testid="referral-consent-email"
                  />
                </div>

                <div className="rounded-xl bg-light/80 border border-prestige-beige p-4 space-y-3">
                  <p className="text-sm font-medium text-dark">Consentement aux communications</p>
                  <p className="text-sm text-prestige-taupe leading-relaxed">{CONSENT_TEXT}</p>
                  <label className="flex items-start gap-3 cursor-pointer pt-1">
                    <Checkbox
                      checked={consent}
                      onCheckedChange={(v) => setConsent(v === true)}
                      id="ref-consent"
                      className="mt-0.5"
                      data-testid="referral-consent-checkbox"
                    />
                    <span className="text-sm text-dark leading-snug">
                      J’ai lu et j’accepte ce consentement. *
                    </span>
                  </label>
                </div>

                <p className="text-xs text-prestige-taupe">
                  Consultez notre{' '}
                  <Link to="/confidentialite" className="text-primary hover:underline">
                    politique de confidentialité
                  </Link>
                  .
                </p>

                <Button type="submit" className="w-full btn-primary" disabled={loading} data-testid="referral-consent-submit">
                  {loading ? 'Envoi…' : 'Envoyer ma demande'}
                </Button>
              </form>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
