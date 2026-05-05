import { useEffect, useRef, useState } from 'react';
import {
  Users,
  CheckCircle2,
  Copy,
  MessageSquare,
  UserCheck,
  Send,
  ExternalLink,
  AlertCircle,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { getReferralConsentUrl } from '../../lib/referralLink';

function statusBadge(status) {
  switch (status) {
    case 'qualified':
    case 'verified':
      return <Badge className="border-green-200 bg-green-100 text-green-700">Vérifié</Badge>;
    case 'rejected':
      return <Badge className="border-red-200 bg-red-100 text-red-700">Rejeté</Badge>;
    default:
      return <Badge className="border-yellow-200 bg-yellow-100 text-yellow-700">En attente</Badge>;
  }
}

/**
 * Bloc membre : actions concrètes (lien, avis, client, formulaire, liste).
 * Même esthétique que le reste de la page (cartes bordure prestige-beige).
 */
export const ReferralMemberActions = ({ user, program, hideReferralLinkCard = false }) => {
  const referralSuccessTick = program?.referralSuccessTick ?? 0;
  const [showReferralSentBanner, setShowReferralSentBanner] = useState(false);
  const lastTickRef = useRef(0);

  useEffect(() => {
    if (referralSuccessTick > lastTickRef.current) {
      lastTickRef.current = referralSuccessTick;
      setShowReferralSentBanner(true);
      const t = setTimeout(() => setShowReferralSentBanner(false), 9000);
      return () => clearTimeout(t);
    }
  }, [referralSuccessTick]);

  if (!user) return null;

  const {
    loading,
    copied,
    googleReview,
    existingClient,
    existingClientForm,
    setExistingClientForm,
    referralForm,
    setReferralForm,
    submittingClient,
    submittingReferral,
    submittingReview,
    copyReferralLink,
    handleReferralSubmit,
    handleGoogleReviewSubmit,
    handleExistingClientSubmit,
    referrals,
    googleReviewLink,
  } = program;

  const link = user.referral_code ? getReferralConsentUrl(user.referral_code) : '';
  const googleIsQualified = googleReview?.status === 'verified' || googleReview?.status === 'qualified';
  const existingClientIsQualified = existingClient?.status === 'verified' || existingClient?.status === 'qualified';

  const shareBody =
    link.trim() &&
    `Bonjour ! Je vous recommande Pierre-Olivier Caouette, conseiller en sécurité financière. Vous pouvez confirmer votre consentement pour la mise en relation ici : ${link}`;
  const whatsappHref =
    shareBody && `https://wa.me/?text=${encodeURIComponent(shareBody)}`;
  const smsHref = shareBody && `sms:?&body=${encodeURIComponent(shareBody)}`;

  if (loading) {
    return (
      <div className="flex justify-center py-12" data-testid="referral-dashboard-loading">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div
      className="mx-auto max-w-3xl space-y-6"
      data-testid="referral-member-actions"
    >
      {!hideReferralLinkCard ? (
        <p className="text-center text-sm text-slate-600">
          Vue rapide : 1) vos points, 2) ajouter une référence, 3) client existant, 4) avis Google, 5) partager votre lien.
        </p>
      ) : (
        <p className="text-center text-sm text-slate-600">
          Continuez avec les étapes ci-dessous pour obtenir plus de points.
        </p>
      )}

      <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
        <div className="border-b border-prestige-beige bg-light/50 px-4 py-3 md:px-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Ajouter une référence</h2>
          <p className="text-xs text-slate-600">Formulaire simplifié : nom et numéro de téléphone en priorité.</p>
        </div>
        <div className="p-4 md:p-6">
          {showReferralSentBanner ? (
            <div
              className="animate-fade-in mb-4 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-900 shadow-sm"
              role="status"
              aria-live="polite"
            >
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
              <div>
                <p className="font-semibold text-green-900">Référence enregistrée</p>
                <p className="mt-0.5 text-green-800/90">Merci ! La personne apparaît dans votre liste dès validation.</p>
              </div>
            </div>
          ) : null}
          <form onSubmit={handleReferralSubmit} className="space-y-5">
            <fieldset className="space-y-3 rounded-xl border border-prestige-beige/80 bg-light/20 p-4">
              <legend className="px-1 font-heading text-sm font-semibold text-dark">Coordonnées de la personne</legend>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ref_name" className="text-sm font-medium text-slate-700">
                    Nom complet *
                  </Label>
                  <Input
                    id="ref_name"
                    value={referralForm.referred_name}
                    onChange={(e) => setReferralForm((p) => ({ ...p, referred_name: e.target.value }))}
                    required
                    autoComplete="name"
                    className="h-11 text-sm"
                    data-testid="referral-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ref_phone" className="text-sm font-medium text-slate-700">
                    Numéro de téléphone *
                  </Label>
                  <Input
                    id="ref_phone"
                    type="tel"
                    value={referralForm.referred_phone}
                    onChange={(e) => setReferralForm((p) => ({ ...p, referred_phone: e.target.value }))}
                    required
                    autoComplete="tel"
                    className="h-11 text-sm"
                    data-testid="referral-phone"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ref_email" className="text-sm font-medium text-slate-700">
                  Courriel <span className="font-normal text-slate-500">(optionnel)</span>
                </Label>
                <Input
                  id="ref_email"
                  type="email"
                  value={referralForm.referred_email}
                  onChange={(e) => setReferralForm((p) => ({ ...p, referred_email: e.target.value }))}
                  autoComplete="email"
                  className="h-11 text-sm"
                  data-testid="referral-email"
                />
              </div>
            </fieldset>
            <Button
              type="submit"
              disabled={submittingReferral}
              className="btn-primary min-h-[44px] text-sm"
              data-testid="submit-referral"
            >
              <Send className="mr-2 h-4 w-4" />
              {submittingReferral ? 'Envoi…' : 'Envoyer la référence'}
            </Button>
          </form>
        </div>
      </div>

      <div className="space-y-4">
        {!googleIsQualified && (
          <div className="overflow-hidden rounded-2xl border-2 border-green-200/80 bg-gradient-to-br from-green-50/90 to-white p-4 shadow-sm md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-sm font-semibold text-dark md:text-base">Avis Google</h3>
                <Badge className="border-0 bg-green-500 text-xs text-white">+1 pt</Badge>
                {googleReview && statusBadge(googleReview.status)}
              </div>
              {googleReview ? (
                <div className="text-xs md:text-sm">
                  {googleReview.status === 'verified' && (
                    <p className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      Votre avis a été vérifié. Merci !
                    </p>
                  )}
                  {googleReview.status === 'pending' && (
                    <p className="flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      Vérification en cours.
                    </p>
                  )}
                  {googleReview.status === 'rejected' && (
                    <p className="text-red-600">Avis rejeté. Contactez-nous si besoin.</p>
                  )}
                </div>
              ) : (
                <div className="mt-1 space-y-2">
                  <p className="text-xs text-slate-600 md:text-sm">Étape 2 : laissez un avis Google, puis confirmez-le ici.</p>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <a
                      href={googleReviewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg border-2 border-green-300/80 bg-white px-3 py-2 text-xs font-medium text-green-800 hover:bg-green-50/80 sm:w-auto"
                    >
                      <ExternalLink className="h-4 w-4 shrink-0" />
                      Ouvrir la page d’avis
                    </a>
                    <Button
                      type="button"
                      onClick={handleGoogleReviewSubmit}
                      disabled={submittingReview}
                      className="min-h-[44px] w-full bg-green-600 px-4 text-xs text-white hover:bg-green-700 sm:w-auto"
                      data-testid="confirm-google-review"
                    >
                      {submittingReview ? 'Envoi…' : "J'ai laissé mon avis"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          </div>
        )}

        {!existingClientIsQualified && (
          <div className="overflow-hidden rounded-2xl border-2 border-purple-200/80 bg-gradient-to-br from-purple-50/90 to-white p-4 shadow-sm md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-sm font-semibold text-dark md:text-base">Client existant</h3>
                <Badge className="border-0 bg-purple-500 text-xs text-white">+1 pt</Badge>
                {existingClient && statusBadge(existingClient.status)}
              </div>
              {existingClient ? (
                <div className="text-xs md:text-sm">
                  {existingClient.status === 'verified' && (
                    <p className="flex items-center gap-2 text-green-600">
                      <CheckCircle2 className="h-4 w-4" />
                      Statut vérifié.
                    </p>
                  )}
                  {existingClient.status === 'pending' && (
                    <p className="text-amber-700">Dossier en traitement…</p>
                  )}
                  {existingClient.status === 'rejected' && (
                    <p className="text-red-600">Non vérifié. Écrivez-nous en cas d’erreur.</p>
                  )}
                </div>
              ) : (
                <form onSubmit={handleExistingClientSubmit} className="mt-2 space-y-2">
                  <p className="text-xs text-slate-600">Étape 3 : confirmez votre statut de client existant.</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <Input
                      value={existingClientForm.first_name}
                      onChange={(e) => setExistingClientForm((p) => ({ ...p, first_name: e.target.value }))}
                      placeholder="Prénom"
                      required
                      className="h-9 text-sm"
                      data-testid="existing-client-firstname"
                    />
                    <Input
                      value={existingClientForm.last_name}
                      onChange={(e) => setExistingClientForm((p) => ({ ...p, last_name: e.target.value }))}
                      placeholder="Nom"
                      required
                      className="h-9 text-sm"
                      data-testid="existing-client-lastname"
                    />
                    <Input
                      type="date"
                      value={existingClientForm.date_of_birth}
                      onChange={(e) => setExistingClientForm((p) => ({ ...p, date_of_birth: e.target.value }))}
                      required
                      className="h-9 text-sm"
                      data-testid="existing-client-dob"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={submittingClient}
                    className="h-9 bg-purple-600 text-sm hover:bg-purple-700"
                    data-testid="submit-existing-client"
                  >
                    {submittingClient ? 'Envoi…' : 'Soumettre'}
                  </Button>
                </form>
              )}
            </div>
          </div>
          </div>
        )}
      </div>

      {!hideReferralLinkCard && (
        <div className="overflow-hidden rounded-2xl border-2 border-blue-200/80 bg-gradient-to-br from-blue-50/90 to-white p-4 shadow-sm md:p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h3 className="font-heading text-sm font-semibold text-dark md:text-base">Partager votre lien personnalisé</h3>
                <Badge className="border-0 bg-blue-500 text-xs text-white">Référence directe</Badge>
              </div>
              <p className="mb-2 text-xs text-slate-600 md:text-sm">
                Envoyez votre lien par message : la personne confirme son consentement en quelques clics.
              </p>
              <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-prestige-beige bg-white p-2.5 font-mono text-[10px] text-dark md:text-xs">
                  {link}
                </div>
                <Button
                  type="button"
                  onClick={copyReferralLink}
                  className="h-11 w-11 shrink-0 bg-blue-500 p-0 hover:bg-blue-600"
                  data-testid="copy-referral-link"
                  aria-label="Copier le lien"
                >
                  {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {whatsappHref && smsHref ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-green-600/30 bg-white px-3 py-2 text-xs font-semibold text-green-800 transition-colors hover:bg-green-50 sm:flex-initial sm:px-4"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                    WhatsApp
                  </a>
                  <a
                    href={smsHref}
                    className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 sm:flex-initial sm:px-4"
                  >
                    <Smartphone className="h-4 w-4 shrink-0" aria-hidden />
                    SMS
                  </a>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
        <div className="border-b border-prestige-beige bg-light/50 px-4 py-3 md:px-6">
          <h2 className="font-heading text-lg font-semibold text-dark">Suivi des personnes</h2>
        </div>
        <div className="p-4 md:p-5">
          {referrals.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-600">Aucune référence enregistrée.</p>
          ) : (
            <ul className="space-y-2">
              {referrals.map((ref) => (
                <li
                  key={ref.id}
                  className="flex items-center justify-between gap-2 rounded-xl bg-light px-3 py-2.5"
                  data-testid={`referral-item-${ref.id}`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-dark">{ref.referred_name}</p>
                    <p className="truncate text-xs text-slate-600">{ref.referred_email}</p>
                  </div>
                  <div className="flex flex-shrink-0 flex-col items-end">
                    {statusBadge(ref.status)}
                    <span className="text-[10px] text-slate-600">
                      {new Date(ref.created_at).toLocaleDateString('fr-CA')}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};
