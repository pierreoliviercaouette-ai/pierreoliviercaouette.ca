import { useEffect, useState } from 'react';
import { Check, Send } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { trackEvent } from '../../lib/analytics';
import { getMetaClickCookies } from '../../lib/metaCookies';
const MRA_FIT_STORAGE_KEY = 'campagne_programme-mra_fit';

const inputClass =
  'w-full rounded-xl border-0 bg-white px-3.5 py-2.5 text-sm text-dark shadow-[inset_0_0_0_1px_rgba(1,35,63,0.08)] transition focus:outline-none focus:shadow-[inset_0_0_0_2px_rgba(6,77,217,0.45)]';

const labelClass = 'mb-1.5 block text-xs font-medium text-prestige-taupe';

function readFitBridge(storageKey) {
  if (!storageKey || typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(storageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Formulaire lead embarqué sur une landing campagne (Meta Lead via generate_lead).
 */
export function CampagneLeadForm({
  slug,
  subjectDefault = 'Demande d’information',
  messagePlaceholder = 'Parle-moi un peu de ta situation…',
  submitLabel = 'Envoyer ma demande',
  successTitle = 'Demande envoyée',
  successBody = 'Merci. Je te recontacte rapidement.',
  title = 'Laisse tes coordonnées',
  subline = 'Je te recontacte pour une présentation adaptée à ta PME. Sans engagement.',
  requireCompany = false,
  requireMessage = true,
  companyLabel = 'Entreprise (approx. d’employés)',
  companyPlaceholder = 'Ex. Atelier XYZ — ~12 employés',
  messageLabel,
  phoneHint,
  trustLine = 'Tes infos servent uniquement à te recontacter. Contenu éducatif — pas un conseil personnalisé.',
  initialMessage = '',
  initialCompany = '',
  teamSize: teamSizeProp,
  fitStorageKey,
}) {
  const bridgeKey = fitStorageKey || (slug === 'programme-mra' ? MRA_FIT_STORAGE_KEY : null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: initialCompany,
    message: initialMessage,
    teamSize: teamSizeProp != null ? String(teamSizeProp) : '',
  });
  const [fitMeta, setFitMeta] = useState({ fitScore: null, teamSize: teamSizeProp ?? null });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const applyBridge = () => {
    const bridge = readFitBridge(bridgeKey);
    if (!bridge) return;
    setFitMeta({
      fitScore: bridge.fitScore || null,
      teamSize: bridge.teamSize ?? teamSizeProp ?? null,
    });
    setFormData((prev) => {
      const next = { ...prev };
      if (bridge.message && (!prev.message.trim() || prev.message.startsWith('Fit outil :'))) {
        next.message = bridge.message;
      }
      if (bridge.teamSize != null && !prev.teamSize) {
        next.teamSize = String(bridge.teamSize);
      }
      return next;
    });
  };

  useEffect(() => {
    applyBridge();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- mount + slug bridge only
  }, [bridgeKey]);

  const update = (key) => (e) =>
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const bridge = readFitBridge(bridgeKey);
    const fitScore = bridge?.fitScore || fitMeta.fitScore || null;
    const teamSize =
      formData.teamSize.trim() ||
      (bridge?.teamSize != null ? String(bridge.teamSize) : '') ||
      (fitMeta.teamSize != null ? String(fitMeta.teamSize) : '');

    const companyLine = formData.company.trim()
      ? `Entreprise : ${formData.company.trim()}\n`
      : '';
    const sizeLine = teamSize ? `Taille équipe (approx.) : ~${teamSize}\n` : '';
    const fitLine = fitScore ? `Score fit outil : ${fitScore}\n` : '';
    const bridgeBlock = [companyLine, sizeLine, fitLine].filter(Boolean).join('');
    let messageBody = formData.message.trim();
    if (bridge?.message && !messageBody.includes('Fit outil :')) {
      messageBody = messageBody
        ? `${messageBody}\n\n${bridge.message}`
        : bridge.message;
    }
    messageBody = `${bridgeBlock}${bridgeBlock && messageBody ? '\n' : ''}${messageBody}`.trim();

    try {
      const { fbp, fbc } = getMetaClickCookies();
      const { error } = await supabase.rpc('create_contact_submission', {
        p_name: formData.name.trim(),
        p_email: formData.email.trim(),
        p_phone: formData.phone.trim() || null,
        p_subject: subjectDefault,
        p_message: messageBody || '(sans message — lead campagne)',
        p_referral_code: null,
        p_meta_fbp: fbp,
        p_meta_fbc: fbc,
      });
      if (error) throw error;

      setSubmitted(true);
      trackEvent('generate_lead', {
        method: 'campagne_lead_form',
        item_id: `campagne_${slug}`,
        has_phone: Boolean(formData.phone.trim()),
        has_company: Boolean(formData.company.trim()),
        ...(fitScore ? { fit_score: fitScore } : {}),
        ...(teamSize ? { team_size: Number(teamSize) || teamSize } : {}),
      });
      toast.success('Demande envoyée — je te recontacte bientôt.');
    } catch (err) {
      console.error(err);
      trackEvent('contact_form_error', {
        source: `campagne_${slug}`,
      });
      toast.error(err.message || 'Erreur lors de l’envoi. Réessaie dans un instant.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="rounded-3xl border border-primary/15 bg-white px-6 py-10 text-center shadow-[0_8px_32px_rgba(1,35,63,0.06)]"
        data-testid="campagne-lead-success"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
          <Check className="h-7 w-7 text-green-600" strokeWidth={2.5} />
        </div>
        <h3 className="font-heading text-xl font-bold text-dark md:text-2xl">{successTitle}</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-prestige-taupe md:text-base">
          {successBody}
        </p>
      </div>
    );
  }

  const resolvedMessageLabel =
    messageLabel || (requireMessage ? 'Message *' : 'Message (optionnel)');

  return (
    <form
      id="demande"
      onSubmit={handleSubmit}
      className="scroll-mt-28 space-y-5 rounded-3xl border border-prestige-beige bg-white px-5 py-6 shadow-[0_8px_32px_rgba(1,35,63,0.06)] md:px-8 md:py-8"
      data-testid="campagne-lead-form"
      onFocusCapture={() => {
        applyBridge();
        trackEvent('select_content', {
          content_type: 'lead_form',
          item_id: `campagne_${slug}_form`,
        });
      }}
    >
      <div>
        <h3 className="font-heading text-xl font-bold text-dark md:text-2xl">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-prestige-taupe">{subline}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor={`${slug}-name`} className={labelClass}>
            Nom complet *
          </label>
          <input
            id={`${slug}-name`}
            required
            autoComplete="name"
            value={formData.name}
            onChange={update('name')}
            className={inputClass}
            placeholder="Marie Tremblay"
          />
        </div>
        <div>
          <label htmlFor={`${slug}-email`} className={labelClass}>
            Courriel *
          </label>
          <input
            id={`${slug}-email`}
            type="email"
            required
            autoComplete="email"
            value={formData.email}
            onChange={update('email')}
            className={inputClass}
            placeholder="vous@entreprise.com"
          />
        </div>
        <div>
          <label htmlFor={`${slug}-phone`} className={labelClass}>
            Téléphone
            {phoneHint ? (
              <span className="ml-1 font-normal text-prestige-taupe/80">· {phoneHint}</span>
            ) : null}
          </label>
          <input
            id={`${slug}-phone`}
            type="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={update('phone')}
            className={inputClass}
            placeholder="(819) 123-4567"
          />
        </div>
        <div>
          <label htmlFor={`${slug}-company`} className={labelClass}>
            {requireCompany ? (companyLabel.includes('*') ? companyLabel : `${companyLabel} *`) : companyLabel}
          </label>
          <input
            id={`${slug}-company`}
            required={requireCompany}
            autoComplete="organization"
            value={formData.company}
            onChange={update('company')}
            className={inputClass}
            placeholder={companyPlaceholder}
          />
        </div>
        {slug === 'programme-mra' || teamSizeProp != null || formData.teamSize ? (
          <div className="sm:col-span-2">
            <label htmlFor={`${slug}-team-size`} className={labelClass}>
              Nombre d’employés (approx.)
            </label>
            <input
              id={`${slug}-team-size`}
              type="number"
              min={1}
              max={500}
              value={formData.teamSize}
              onChange={update('teamSize')}
              className={inputClass}
              placeholder="Ex. 8"
            />
          </div>
        ) : null}
      </div>

      <div>
        <label htmlFor={`${slug}-message`} className={labelClass}>
          {resolvedMessageLabel}
        </label>
        <textarea
          id={`${slug}-message`}
          required={requireMessage}
          rows={requireMessage ? 4 : 2}
          value={formData.message}
          onChange={update('message')}
          className={`${inputClass} ${requireMessage ? 'min-h-[6.5rem]' : 'min-h-[4rem]'} resize-y`}
          placeholder={messagePlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 font-semibold text-white transition-colors hover:bg-secondary disabled:opacity-60 sm:w-auto"
        data-testid="campagne-lead-submit"
      >
        {loading ? 'Envoi…' : submitLabel}
        <Send className="h-4 w-4" />
      </button>

      <p className="text-xs leading-relaxed text-prestige-taupe/80">{trustLine}</p>
    </form>
  );
}
