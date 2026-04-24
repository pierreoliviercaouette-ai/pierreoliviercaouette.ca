import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { computeReferralStats } from '../../lib/referralStats';
import { getReferralConsentUrl } from '../../lib/referralLink';
import {
  Users,
  Sparkles,
  CheckCircle2,
  Copy,
  MessageSquare,
  UserCheck,
  Send,
  ExternalLink,
  AlertCircle,
  Trophy,
  Star,
  Crown,
} from 'lucide-react';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';

const GOOGLE_REVIEW_LINK = 'https://g.page/r/CewlYHqUvuLyEAI/review';

const TIERS = [
  { points: 10, reward: '25 $', name: 'Bronze', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-100', gradient: 'from-orange-500 to-orange-600' },
  { points: 20, reward: '50 $', name: 'Argent', icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-100', gradient: 'from-gray-400 to-gray-500' },
  { points: 40, reward: '100 $', name: 'Or', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100', gradient: 'from-yellow-400 to-yellow-500' },
  { points: 75, reward: '250 $', name: 'Platine', icon: Star, color: 'text-cyan-500', bg: 'bg-cyan-100', gradient: 'from-cyan-400 to-cyan-500' },
  { points: 100, reward: 'Coffret VIP', name: 'VIP', icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100', gradient: 'from-purple-500 to-purple-600' },
];

/**
 * Espace membre : lien de consentement, avis Google, client existant, formulaire et liste des références.
 * Affiché sur /recommandations (plus dans le profil).
 */
export const ReferralProgramDashboard = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const [googleReview, setGoogleReview] = useState(null);
  const [googleReviewLink] = useState(GOOGLE_REVIEW_LINK);
  const [submittingReview, setSubmittingReview] = useState(false);

  const [existingClient, setExistingClient] = useState(null);
  const [existingClientForm, setExistingClientForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
  });
  const [submittingClient, setSubmittingClient] = useState(false);

  const [referralForm, setReferralForm] = useState({
    referred_name: '',
    referred_email: '',
    referred_phone: '',
    notes: '',
  });
  const [submittingReferral, setSubmittingReferral] = useState(false);

  const fetchData = async () => {
    if (!user?.id) return;
    try {
      const [ref, gRev, exCl] = await Promise.all([
        supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from('google_reviews').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('existing_clients').select('*').eq('user_id', user.id).maybeSingle(),
      ]);
      if (ref.error) throw ref.error;
      if (gRev.error) throw gRev.error;
      if (exCl.error) throw exCl.error;
      const referralsList = ref.data || [];
      setReferrals(referralsList);
      setReferralStats(computeReferralStats(referralsList, gRev.data || null, exCl.data || null));
      setGoogleReview(gRev.data);
      setExistingClient(exCl.data);
    } catch (error) {
      console.error('ReferralProgramDashboard fetch:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const copyReferralLink = () => {
    if (!user?.referral_code) return;
    const link = getReferralConsentUrl(user.referral_code);
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingReferral(true);
    try {
      const { error } = await supabase.from('referrals').insert({
        referrer_id: user.id,
        referrer_code: user.referral_code,
        referred_email: referralForm.referred_email.trim().toLowerCase(),
        referred_name: referralForm.referred_name.trim(),
        referred_phone: referralForm.referred_phone?.trim() || null,
        notes: referralForm.notes?.trim() || null,
        status: 'pending',
      });
      if (error) {
        if (error.code === '23505') {
          toast.error('Vous avez déjà référé cette personne');
        } else {
          throw error;
        }
        return;
      }
      toast.success('Référence envoyée!');
      setReferralForm({ referred_name: '', referred_email: '', referred_phone: '', notes: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'envoi");
    } finally {
      setSubmittingReferral(false);
    }
  };

  const handleGoogleReviewSubmit = async () => {
    if (!user) return;
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('google_reviews').insert({
        user_id: user.id,
        status: 'pending',
      });
      if (error) {
        if (error.code === '23505') {
          toast.error('Vous avez déjà soumis un avis Google');
        } else {
          throw error;
        }
        return;
      }
      toast.success('Avis soumis! Il sera vérifié sous peu.');
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la soumission');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleExistingClientSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmittingClient(true);
    try {
      const { error } = await supabase.from('existing_clients').insert({
        user_id: user.id,
        first_name: existingClientForm.first_name.trim(),
        last_name: existingClientForm.last_name.trim(),
        date_of_birth: existingClientForm.date_of_birth,
        status: 'pending',
      });
      if (error) {
        if (error.code === '23505') {
          toast.error('Vous avez déjà soumis une vérification de client existant');
        } else {
          throw error;
        }
        return;
      }
      toast.success('Vérification soumise! Elle sera traitée sous peu.');
      setExistingClientForm({ first_name: '', last_name: '', date_of_birth: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la soumission');
    } finally {
      setSubmittingClient(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'qualified':
      case 'verified':
        return <Badge className="bg-green-100 text-green-700 border-green-200">Vérifié</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 border-red-200">Rejeté</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">En attente</Badge>;
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center py-16" data-testid="referral-dashboard-loading">
        <div className="h-10 w-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div
      className="grid max-w-full gap-4 overflow-hidden md:gap-6 lg:grid-cols-3"
      data-testid="referral-program-dashboard"
    >
      <div className="min-w-0 space-y-4 overflow-hidden md:space-y-6 lg:col-span-2">
        <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
          <div className="border-b border-prestige-beige bg-light/50 px-4 py-4 md:px-6">
            <h2 className="font-heading text-lg font-semibold text-dark md:text-xl flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Gagner des points
            </h2>
            <p className="text-sm text-prestige-taupe mt-1">
              Lien, avis Google et vérification client — tout compte pour vos paliers.
            </p>
          </div>
          <div className="space-y-3 overflow-hidden p-3 md:space-y-4 md:p-6">
            <div className="relative overflow-hidden rounded-xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-3 md:rounded-2xl md:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-md md:h-14 md:w-14 md:rounded-2xl">
                  <Users className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="mb-1 flex flex-wrap items-center gap-1 md:mb-2 md:gap-2">
                    <h3 className="font-heading text-sm font-semibold text-dark md:text-base">Référez quelqu&apos;un</h3>
                    <Badge className="border-0 bg-blue-500 px-2 py-0.5 text-xs text-white">+1 pt/réf.</Badge>
                  </div>
                  <p className="mb-2 text-xs text-prestige-taupe md:mb-3 md:text-sm">
                    Ce lien ouvre une page de consentement. Vous pouvez aussi saisir une référence plus bas.
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="min-w-0 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white p-2 font-mono text-[10px] md:rounded-xl md:p-3 md:text-xs">
                      {getReferralConsentUrl(user.referral_code)}
                    </div>
                    <Button
                      onClick={copyReferralLink}
                      className="h-8 w-8 flex-shrink-0 bg-blue-500 p-0 hover:bg-blue-600 md:h-10 md:w-10"
                      data-testid="copy-referral-link"
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-green-200 bg-gradient-to-br from-green-50 to-white p-3 md:rounded-2xl md:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-md md:h-14 md:w-14 md:rounded-2xl">
                  <MessageSquare className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="mb-1 flex flex-wrap items-center gap-1 md:mb-2 md:gap-2">
                    <h3 className="font-heading text-sm font-semibold text-dark md:text-base">Avis Google</h3>
                    <Badge className="border-0 bg-green-500 px-2 py-0.5 text-xs text-white">+2 pts</Badge>
                    {googleReview && getStatusBadge(googleReview.status)}
                  </div>
                  {googleReview ? (
                    <div className="text-xs md:text-sm">
                      {googleReview.status === 'verified' ? (
                        <p className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          Votre avis a été vérifié. Merci!
                        </p>
                      ) : googleReview.status === 'pending' ? (
                        <p className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          Votre avis est en cours de vérification.
                        </p>
                      ) : (
                        <p className="text-red-600">Avis rejeté. Contactez-nous pour plus d&apos;informations.</p>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-2 md:space-y-3">
                      <p className="text-xs text-prestige-taupe md:text-sm">
                        Laissez un avis sur Google puis confirmez-le ici.
                      </p>
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <a
                          href={googleReviewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-green-300 bg-white px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50 sm:w-auto"
                        >
                          <ExternalLink className="h-4 w-4 shrink-0" />
                          <span className="truncate">Laisser un avis</span>
                        </a>
                        <Button
                          onClick={handleGoogleReviewSubmit}
                          disabled={submittingReview}
                          className="h-9 w-full bg-green-500 text-xs hover:bg-green-600 sm:w-auto"
                          data-testid="confirm-google-review"
                        >
                          {submittingReview ? 'Envoi...' : "J'ai laissé mon avis"}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-3 md:rounded-2xl md:p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-md md:h-14 md:w-14 md:rounded-2xl">
                  <UserCheck className="h-5 w-5 text-white md:h-7 md:w-7" />
                </div>
                <div className="min-w-0 flex-1 overflow-hidden">
                  <div className="mb-1 flex flex-wrap items-center gap-1 md:mb-2 md:gap-2">
                    <h3 className="font-heading text-sm font-semibold text-dark md:text-base">Client existant</h3>
                    <Badge className="border-0 bg-purple-500 px-2 py-0.5 text-xs text-white">+2 pts</Badge>
                    {existingClient && getStatusBadge(existingClient.status)}
                  </div>
                  {existingClient ? (
                    <div className="text-xs md:text-sm">
                      {existingClient.status === 'verified' ? (
                        <p className="flex items-center gap-2 text-green-600">
                          <CheckCircle2 className="h-4 w-4 shrink-0" />
                          Votre statut de client a été vérifié!
                        </p>
                      ) : existingClient.status === 'pending' ? (
                        <p className="flex items-center gap-2 text-yellow-600">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          Vérification en cours...
                        </p>
                      ) : (
                        <p className="text-red-600">
                          Non vérifié. Contactez-nous si vous pensez qu&apos;il s&apos;agit d&apos;une erreur.
                        </p>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleExistingClientSubmit} className="w-full space-y-2">
                      <p className="text-xs text-prestige-taupe md:text-sm">
                        Déjà client ? Confirmez votre identité.
                      </p>
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Input
                          value={existingClientForm.first_name}
                          onChange={(e) =>
                            setExistingClientForm((prev) => ({ ...prev, first_name: e.target.value }))
                          }
                          placeholder="Prénom"
                          required
                          className="h-9 text-sm"
                          data-testid="existing-client-firstname"
                        />
                        <Input
                          value={existingClientForm.last_name}
                          onChange={(e) =>
                            setExistingClientForm((prev) => ({ ...prev, last_name: e.target.value }))
                          }
                          placeholder="Nom"
                          required
                          className="h-9 text-sm"
                          data-testid="existing-client-lastname"
                        />
                        <Input
                          type="date"
                          value={existingClientForm.date_of_birth}
                          onChange={(e) =>
                            setExistingClientForm((prev) => ({ ...prev, date_of_birth: e.target.value }))
                          }
                          required
                          className="h-9 text-sm"
                          data-testid="existing-client-dob"
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={submittingClient}
                        className="h-9 bg-purple-500 text-xs md:text-sm hover:bg-purple-600"
                        data-testid="submit-existing-client"
                      >
                        {submittingClient ? 'Envoi...' : 'Vérifier mon statut'}
                      </Button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
          <div className="border-b border-prestige-beige bg-light/50 px-4 py-4 md:px-6">
            <h2 className="font-heading text-lg font-semibold text-dark md:text-xl flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Référer quelqu&apos;un
            </h2>
          </div>
          <div className="p-3 md:p-6">
            <form onSubmit={handleReferralSubmit} className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <div>
                  <Label htmlFor="dash_referred_name" className="text-sm">
                    Nom complet *
                  </Label>
                  <Input
                    id="dash_referred_name"
                    value={referralForm.referred_name}
                    onChange={(e) => setReferralForm((p) => ({ ...p, referred_name: e.target.value }))}
                    placeholder="Jean Tremblay"
                    required
                    className="h-9 text-sm"
                    data-testid="referral-name"
                  />
                </div>
                <div>
                  <Label htmlFor="dash_referred_email" className="text-sm">
                    Courriel *
                  </Label>
                  <Input
                    id="dash_referred_email"
                    type="email"
                    value={referralForm.referred_email}
                    onChange={(e) => setReferralForm((p) => ({ ...p, referred_email: e.target.value }))}
                    placeholder="jean@exemple.com"
                    required
                    className="h-9 text-sm"
                    data-testid="referral-email"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
                <div>
                  <Label htmlFor="dash_referred_phone" className="text-sm">
                    Téléphone (optionnel)
                  </Label>
                  <Input
                    id="dash_referred_phone"
                    type="tel"
                    value={referralForm.referred_phone}
                    onChange={(e) => setReferralForm((p) => ({ ...p, referred_phone: e.target.value }))}
                    placeholder="(514) 123-4567"
                    className="h-9 text-sm"
                    data-testid="referral-phone"
                  />
                </div>
                <div>
                  <Label htmlFor="dash_notes" className="text-sm">
                    Notes (optionnel)
                  </Label>
                  <Input
                    id="dash_notes"
                    value={referralForm.notes}
                    onChange={(e) => setReferralForm((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="Ex: Intéressé par l'assurance vie"
                    className="h-9 text-sm"
                    data-testid="referral-notes"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={submittingReferral}
                className="btn-primary h-10 text-sm"
                data-testid="submit-referral"
              >
                <Send className="mr-2 h-4 w-4" />
                {submittingReferral ? 'Envoi...' : 'Envoyer la référence'}
              </Button>
            </form>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
          <div className="border-b border-prestige-beige bg-light/50 px-4 py-4 md:px-6">
            <h2 className="font-heading text-lg font-semibold text-dark md:text-xl flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Mes références ({referrals.length})
            </h2>
          </div>
          <div className="p-3 md:p-6">
            {referrals.length === 0 ? (
              <p className="py-6 text-center text-sm text-prestige-taupe md:py-8">Aucune référence pour le moment.</p>
            ) : (
              <div className="space-y-2 md:space-y-3">
                {referrals.map((ref) => (
                  <div
                    key={ref.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-light p-3 transition-colors hover:bg-gray-100 md:p-4"
                    data-testid={`referral-item-${ref.id}`}
                  >
                    <div className="flex min-w-0 items-center gap-2 md:gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 md:h-10 md:w-10">
                        <span className="text-xs font-semibold text-primary md:text-sm">
                          {ref.referred_name.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-dark">{ref.referred_name}</p>
                        <p className="truncate text-xs text-prestige-taupe">{ref.referred_email}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-right">
                      {getStatusBadge(ref.status)}
                      <p className="mt-1 text-[10px] text-prestige-taupe md:text-xs">
                        {new Date(ref.created_at).toLocaleDateString('fr-CA')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-6 max-lg:order-first">
        <div className="rounded-2xl border border-prestige-beige bg-white p-4 shadow-ia md:p-6">
          <div className="mb-2 flex items-end gap-2">
            <span className="font-heading text-3xl font-bold text-primary tabular-nums">
              {referralStats?.total_points ?? 0}
            </span>
            <span className="pb-1 text-prestige-taupe">points</span>
          </div>
          <p className="text-xs text-prestige-taupe">Réf. qualifiées : {referralStats?.qualified_referrals ?? 0}</p>
        </div>
        <div className="rounded-2xl border border-prestige-beige bg-white p-4 shadow-ia md:p-6">
          <h3 className="mb-4 font-heading text-lg font-semibold text-dark flex items-center gap-2">
            <Trophy className="h-5 w-5 text-primary" />
            Paliers de remerciement
          </h3>
          <div className="space-y-2">
            {TIERS.map((tier) => {
              const isReached = (referralStats?.total_points ?? 0) >= tier.points;
              const TierIcon = tier.icon;
              return (
                <div
                  key={tier.name}
                  className={`flex items-center justify-between rounded-xl border p-3 transition-colors ${
                    isReached ? 'border-prestige-beige bg-light/80' : 'border-prestige-beige/50 bg-white'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {isReached ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />
                    ) : (
                      <TierIcon className="h-5 w-5 shrink-0 text-prestige-taupe" />
                    )}
                    <div className="min-w-0">
                      <span
                        className={`block truncate text-sm font-medium ${isReached ? 'text-dark' : 'text-prestige-taupe'}`}
                      >
                        {tier.name}
                      </span>
                      <p className="text-xs text-prestige-taupe">{tier.points} pts</p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 text-sm font-semibold ${isReached ? 'text-primary' : 'text-prestige-taupe'}`}
                  >
                    {tier.reward}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="mt-4 text-center text-xs text-prestige-taupe">Les paliers sont cumulatifs.</p>
        </div>
      </div>
    </div>
  );
};
