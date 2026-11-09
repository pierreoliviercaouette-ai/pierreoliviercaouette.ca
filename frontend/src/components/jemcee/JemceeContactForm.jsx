import { useState } from 'react';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { trackEvent } from '../../lib/analytics';
import { getMetaClickCookies } from '../../lib/metaCookies';

const fieldClass =
  'mt-1.5 w-full border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-secondary focus:outline-none';

const labelClass = 'block text-left text-xs font-medium tracking-wide text-white/70';

/**
 * Formulaire de contact embarqué (landing jemcee) — même RPC que /contact.
 */
export function JemceeContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { fbp, fbc } = getMetaClickCookies();
      const { error } = await supabase.rpc('create_contact_submission', {
        p_name: formData.name.trim(),
        p_email: formData.email.trim(),
        p_phone: formData.phone.trim() || null,
        p_subject: 'Jemcee — demande de contact',
        p_message: formData.message.trim(),
        p_referral_code: null,
        p_meta_fbp: fbp,
        p_meta_fbc: fbc,
      });
      if (error) throw error;

      setSubmitted(true);
      trackEvent('generate_lead', {
        method: 'contact_form',
        item_id: 'jemcee_contact_form',
        has_phone: Boolean(formData.phone.trim()),
      });
      toast.success('Message envoyé — je vous recontacte rapidement.');
    } catch (err) {
      console.error(err);
      trackEvent('contact_form_error', { source: 'jemcee' });
      toast.error(err.message || "Erreur lors de l'envoi. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="border border-white/10 bg-white/5 px-6 py-10 text-center"
        data-testid="jemcee-contact-success"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center border border-secondary/40 bg-secondary/10">
          <Send className="h-6 w-6 text-secondary" />
        </div>
        <h3 className="font-heading text-2xl text-white">Message envoyé</h3>
        <p className="mx-auto mt-3 max-w-md text-sm text-white/70">
          Merci. Je vous répondrai dans les plus brefs délais.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 border border-white/10 bg-white/[0.03] px-5 py-6 text-left md:px-8 md:py-8"
      data-testid="jemcee-contact-form"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="jemcee-contact-name" className={labelClass}>
            Nom complet *
          </label>
          <input
            id="jemcee-contact-name"
            className={fieldClass}
            value={formData.name}
            onChange={update('name')}
            placeholder="Jean Tremblay"
            required
            autoComplete="name"
            data-testid="jemcee-contact-name"
          />
        </div>
        <div>
          <label htmlFor="jemcee-contact-email" className={labelClass}>
            Courriel *
          </label>
          <input
            id="jemcee-contact-email"
            type="email"
            className={fieldClass}
            value={formData.email}
            onChange={update('email')}
            placeholder="vous@exemple.com"
            required
            autoComplete="email"
            data-testid="jemcee-contact-email"
          />
        </div>
      </div>

      <div>
        <label htmlFor="jemcee-contact-phone" className={labelClass}>
          Téléphone
        </label>
        <input
          id="jemcee-contact-phone"
          type="tel"
          className={fieldClass}
          value={formData.phone}
          onChange={update('phone')}
          placeholder="(819) 123-4567"
          autoComplete="tel"
          data-testid="jemcee-contact-phone"
        />
      </div>

      <div>
        <label htmlFor="jemcee-contact-message" className={labelClass}>
          Message *
        </label>
        <textarea
          id="jemcee-contact-message"
          className={`${fieldClass} min-h-[140px] resize-y`}
          value={formData.message}
          onChange={update('message')}
          placeholder="Parlez-moi un peu de votre situation…"
          rows={5}
          required
          data-testid="jemcee-contact-message"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 font-heading text-base tracking-widest transition hover:bg-secondary disabled:opacity-60 sm:w-auto"
        style={{ backgroundColor: '#ffffff', color: '#01233f' }}
        data-testid="jemcee-contact-submit"
      >
        {loading ? 'ENVOI…' : 'ENVOYER LE MESSAGE'}
        {!loading ? <Send className="h-4 w-4" /> : null}
      </button>
      <p className="text-xs text-white/45">
        Vos infos servent uniquement à vous recontacter. Contenu éducatif — pas un conseil
        personnalisé.
      </p>
    </form>
  );
}
