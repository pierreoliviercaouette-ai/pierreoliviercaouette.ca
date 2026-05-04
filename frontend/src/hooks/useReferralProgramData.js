import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { computeReferralStats } from '../lib/referralStats';
import { getReferralConsentUrl } from '../lib/referralLink';
import { toast } from 'sonner';

const GOOGLE_REVIEW_LINK = 'https://g.page/r/CewlYHqUvuLyEAI/review';

/**
 * Données et actions du programme de recommandation (membre connecté).
 * Sans user : états vides, pas d’appel API.
 */
export function useReferralProgramData(user) {
  const [referrals, setReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(Boolean(user));
  const [copied, setCopied] = useState(false);
  const [googleReview, setGoogleReview] = useState(null);
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
  const [submittingReview, setSubmittingReview] = useState(false);
  const [referralSuccessTick, setReferralSuccessTick] = useState(0);

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
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
      console.error('useReferralProgramData:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    fetchData();
  }, [user, fetchData]);

  const copyReferralLink = useCallback(() => {
    if (!user?.referral_code) return;
    const link = getReferralConsentUrl(user.referral_code);
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié !');
    setTimeout(() => setCopied(false), 2000);
  }, [user?.referral_code]);

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
      toast.success('Référence envoyée !');
      setReferralForm({ referred_name: '', referred_email: '', referred_phone: '', notes: '' });
      setReferralSuccessTick((t) => t + 1);
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
      toast.success('Avis soumis ! Il sera vérifié sous peu.');
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
      toast.success('Vérification soumise !');
      setExistingClientForm({ first_name: '', last_name: '', date_of_birth: '' });
      fetchData();
    } catch (err) {
      toast.error(err.message || 'Erreur lors de la soumission');
    } finally {
      setSubmittingClient(false);
    }
  };

  if (!user) {
    return {
      loading: false,
      referralStats: null,
      referrals: [],
      copied: false,
      googleReview: null,
      existingClient: null,
      existingClientForm,
      setExistingClientForm,
      referralForm,
      setReferralForm,
      submittingClient: false,
      submittingReferral: false,
      submittingReview: false,
      copyReferralLink: () => {},
      handleReferralSubmit: (e) => e?.preventDefault?.(),
      handleGoogleReviewSubmit: () => {},
      handleExistingClientSubmit: (e) => e?.preventDefault?.(),
      fetchData: () => {},
      googleReviewLink: GOOGLE_REVIEW_LINK,
      referralSuccessTick: 0,
    };
  }

  return {
    loading,
    referralStats,
    referrals,
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
    fetchData,
    googleReviewLink: GOOGLE_REVIEW_LINK,
    referralSuccessTick,
  };
}
