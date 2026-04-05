import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { computeReferralStats } from '../lib/referralStats';
import { getReferralConsentUrl } from '../lib/referralLink';
import { 
  User, Gift, Clock, Bell, Copy, CheckCircle2, Users, 
  ChevronRight, Trophy, Star, ArrowRight, Send, ExternalLink,
  MessageSquare, UserCheck, Crown, Calendar, AlertCircle, 
  TrendingUp, Sparkles, Award, Target
} from 'lucide-react';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from 'sonner';

const GOOGLE_REVIEW_LINK = 'https://g.page/r/CewlYHqUvuLyEAI/review';

// Tier configuration
const TIERS = [
  { points: 10, reward: '25 $', name: 'Bronze', icon: Trophy, color: 'text-orange-600', bg: 'bg-orange-100', gradient: 'from-orange-500 to-orange-600' },
  { points: 20, reward: '50 $', name: 'Argent', icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-100', gradient: 'from-gray-400 to-gray-500' },
  { points: 40, reward: '100 $', name: 'Or', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100', gradient: 'from-yellow-400 to-yellow-500' },
  { points: 75, reward: '250 $', name: 'Platine', icon: Star, color: 'text-cyan-500', bg: 'bg-cyan-100', gradient: 'from-cyan-400 to-cyan-500' },
  { points: 100, reward: 'Coffret VIP', name: 'VIP', icon: Crown, color: 'text-purple-500', bg: 'bg-purple-100', gradient: 'from-purple-500 to-purple-600' },
];

export const Profile = () => {
  const { user, loading: authLoading, notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [toolResults, setToolResults] = useState([]);
  const [referrals, setReferrals] = useState([]);
  const [referralStats, setReferralStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Google review state
  const [googleReview, setGoogleReview] = useState(null);
  const [googleReviewLink, setGoogleReviewLink] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Existing client state
  const [existingClient, setExistingClient] = useState(null);
  const [existingClientForm, setExistingClientForm] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: ''
  });
  const [submittingClient, setSubmittingClient] = useState(false);

  // Referral form
  const [referralForm, setReferralForm] = useState({
    referred_name: '',
    referred_email: '',
    referred_phone: '',
    notes: ''
  });
  const [submittingReferral, setSubmittingReferral] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate('/connexion');
      return;
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, authLoading, navigate]);

  const fetchData = async () => {
    try {
      const [tr, ref, gRev, exCl] = await Promise.all([
        supabase
          .from('tool_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.from('google_reviews').select('*').eq('user_id', user.id).maybeSingle(),
        supabase.from('existing_clients').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      if (tr.error) throw tr.error;
      if (ref.error) throw ref.error;
      if (gRev.error) throw gRev.error;
      if (exCl.error) throw exCl.error;

      const referralsList = ref.data || [];
      setToolResults(tr.data || []);
      setReferrals(referralsList);
      setReferralStats(
        computeReferralStats(referralsList, gRev.data || null, exCl.data || null)
      );
      setGoogleReview(gRev.data);
      setExistingClient(exCl.data);
      setGoogleReviewLink(GOOGLE_REVIEW_LINK);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = getReferralConsentUrl(user.referral_code);
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success('Lien copié!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReferralSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReferral(true);

    try {
      const { error } = await supabase.from('referrals').insert({
        referrer_id: user.id,
        referrer_code: user.referral_code,
        referred_email: referralForm.referred_email.trim().toLowerCase(),
        referred_name: referralForm.referred_name.trim(),
        referred_phone: referralForm.referred_phone?.trim() || null,
        notes: referralForm.notes?.trim() || null,
        status: 'pending'
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
    } catch (error) {
      toast.error(error.message || 'Erreur lors de l\'envoi');
    } finally {
      setSubmittingReferral(false);
    }
  };

  const handleGoogleReviewSubmit = async () => {
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('google_reviews').insert({
        user_id: user.id,
        status: 'pending'
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
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la soumission');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleExistingClientSubmit = async (e) => {
    e.preventDefault();
    setSubmittingClient(true);
    try {
      const { error } = await supabase.from('existing_clients').insert({
        user_id: user.id,
        first_name: existingClientForm.first_name.trim(),
        last_name: existingClientForm.last_name.trim(),
        date_of_birth: existingClientForm.date_of_birth,
        status: 'pending'
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
    } catch (error) {
      toast.error(error.message || 'Erreur lors de la soumission');
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

  const getCurrentTier = () => {
    if (!referralStats) return null;
    return TIERS.find(t => t.name === referralStats.current_tier?.name) || null;
  };

  const getNextTier = () => {
    if (!referralStats?.next_tier) return null;
    return TIERS.find(t => t.name === referralStats.next_tier?.name) || TIERS[0];
  };

  const getProgressToNextTier = () => {
    if (!referralStats) return 0;
    const currentPoints = referralStats.total_points;
    if (!referralStats.next_tier) return 100;
    const prevTierPoints = referralStats.current_tier ? referralStats.current_tier.threshold : 0;
    const nextTierPoints = referralStats.next_tier.threshold;
    const progress = ((currentPoints - prevTierPoints) / (nextTierPoints - prevTierPoints)) * 100;
    return Math.min(Math.max(progress, 0), 100);
  };

  if (authLoading) {
    return (
      <main className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-prestige-taupe">Chargement de votre profil...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const currentTier = getCurrentTier();
  const nextTier = getNextTier();

  return (
    <main className="pt-20 min-h-screen bg-gray-50" data-testid="profile-page">
      {/* Header - Enhanced */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        </div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />
        
        <div className="relative container-max px-4 md:px-8 py-12">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Avatar & Info */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-xl">
                  <span className="text-white font-heading font-bold text-3xl">
                    {user.first_name[0]}{user.last_name[0]}
                  </span>
                </div>
                {currentTier && (
                  <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-gradient-to-br ${currentTier.gradient} flex items-center justify-center shadow-lg`}>
                    <currentTier.icon className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div>
                <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-1">
                  {user.first_name} {user.last_name}
                </h1>
                <p className="text-white/70">{user.email}</p>
                <div className="flex items-center gap-2 mt-2">
                  {user.is_admin && (
                    <Badge className="bg-white/20 text-white border-white/30">Administrateur</Badge>
                  )}
                  {currentTier && (
                    <Badge className={`${currentTier.bg} ${currentTier.color} border-0`}>
                      {currentTier.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats Cards */}
            <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 lg:ml-auto lg:max-w-2xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 text-secondary" />
                </div>
                <p className="text-3xl font-bold text-white">{referralStats?.total_points || 0}</p>
                <p className="text-xs text-white/70">Points</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-blue-300" />
                </div>
                <p className="text-3xl font-bold text-white">{referralStats?.qualified_referrals || 0}</p>
                <p className="text-xs text-white/70">Références</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-green-300" />
                </div>
                <p className="text-3xl font-bold text-white">{nextTier?.points || '∞'}</p>
                <p className="text-xs text-white/70">Prochain palier</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                <div className="w-10 h-10 mx-auto rounded-xl bg-white/20 flex items-center justify-center mb-2">
                  <Award className="w-5 h-5 text-yellow-300" />
                </div>
                <p className="text-3xl font-bold text-white">{currentTier ? TIERS.indexOf(currentTier) + 1 : 0}</p>
                <p className="text-xs text-white/70">Paliers atteints</p>
              </div>
            </div>
          </div>
          
          {/* Progress Bar */}
          {nextTier && (
            <div className="mt-8 bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm">
                  {currentTier?.name || 'Départ'} → {nextTier.name}
                </span>
                <span className="text-white font-semibold">
                  {referralStats?.points_to_next_tier || 0} points restants
                </span>
              </div>
              <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-secondary to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${getProgressToNextTier()}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Tabs Content */}
      <section className="section-padding -mt-4">
        <div className="container-max">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-2xl p-1 shadow-lg mb-8">
              <TabsTrigger value="overview" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <User className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Aperçu</span>
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <Clock className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Historique</span>
              </TabsTrigger>
              <TabsTrigger value="referrals" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white">
                <Gift className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Points</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="rounded-xl data-[state=active]:bg-primary data-[state=active]:text-white relative">
                <Bell className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Notifications</span>
                {notifications.filter(n => !n.is_read).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.is_read).length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="space-y-6">
                {/* HERO REWARDS SECTION - PROMINENT */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-secondary via-amber-500 to-orange-500 p-1 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-transparent to-orange-600/20" />
                  <div className="relative bg-gradient-to-br from-dark/95 via-primary/95 to-dark/95 rounded-[22px] p-6 md:p-8">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
                    
                    <div className="relative grid lg:grid-cols-2 gap-8">
                      {/* Left: Current Progress */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-secondary to-yellow-400 flex items-center justify-center shadow-lg animate-pulse">
                            <Trophy className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">
                              Programme de récompenses
                            </h2>
                            <p className="text-white/70">Gagnez des récompenses en référant vos proches!</p>
                          </div>
                        </div>
                        
                        {/* Big Points Display */}
                        <div className="flex items-end gap-4 mb-6">
                          <div className="relative">
                            <span className="text-6xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-secondary via-yellow-400 to-secondary animate-gradient">
                              {referralStats?.total_points || 0}
                            </span>
                            <Sparkles className="absolute -top-2 -right-4 w-6 h-6 text-secondary animate-bounce" />
                          </div>
                          <span className="text-2xl text-white/60 mb-2">points</span>
                        </div>
                        
                        {/* Next Tier Progress */}
                        {nextTier && (
                          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <Target className="w-5 h-5 text-secondary" />
                                <span className="text-white font-medium">Prochain palier: {nextTier.name}</span>
                              </div>
                              <Badge className={`${nextTier.bg} ${nextTier.color} border-0 font-bold`}>
                                {nextTier.reward}
                              </Badge>
                            </div>
                            <div className="h-4 bg-white/20 rounded-full overflow-hidden mb-2">
                              <div 
                                className="h-full bg-gradient-to-r from-secondary via-yellow-400 to-secondary rounded-full transition-all duration-1000 relative overflow-hidden"
                                style={{ width: `${getProgressToNextTier()}%` }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                              </div>
                            </div>
                            <p className="text-white/80 text-sm text-center">
                              Plus que <span className="font-bold text-secondary">{referralStats?.points_to_next_tier || nextTier.points}</span> points pour débloquer!
                            </p>
                          </div>
                        )}
                        
                        {/* Quick CTA */}
                        <div className="flex flex-wrap gap-3 mt-6">
                          <button 
                            onClick={copyReferralLink}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-secondary to-yellow-400 rounded-xl text-dark font-bold hover:shadow-lg hover:scale-105 transition-all"
                            data-testid="hero-copy-link"
                          >
                            {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            {copied ? 'Lien copié!' : 'Copier mon lien'}
                          </button>
                          <button
                            onClick={() => setActiveTab('referrals')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border-2 border-secondary/50 rounded-xl text-white font-bold hover:bg-white/20 transition-all"
                          >
                            <Gift className="w-5 h-5" />
                            Gagner des points
                          </button>
                        </div>
                      </div>
                      
                      {/* Right: Tier Ladder */}
                      <div className="relative">
                        <h3 className="font-heading text-lg font-semibold text-white mb-4 flex items-center gap-2">
                          <Crown className="w-5 h-5 text-secondary" />
                          Paliers de récompenses
                        </h3>
                        <div className="space-y-2">
                          {TIERS.map((tier, index) => {
                            const isReached = referralStats?.total_points >= tier.points;
                            const isCurrent = currentTier?.name === tier.name;
                            const TierIcon = tier.icon;
                            return (
                              <div 
                                key={tier.name}
                                className={`relative flex items-center gap-4 p-3 rounded-xl transition-all ${
                                  isCurrent 
                                    ? 'bg-gradient-to-r from-secondary/30 to-yellow-400/20 border-2 border-secondary shadow-lg scale-105' 
                                    : isReached 
                                      ? 'bg-white/15 border border-white/30' 
                                      : 'bg-white/5 border border-white/10'
                                }`}
                              >
                                {isCurrent && (
                                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2 h-8 bg-secondary rounded-r-full" />
                                )}
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                  isReached 
                                    ? `bg-gradient-to-br ${tier.gradient} shadow-md` 
                                    : 'bg-white/10'
                                }`}>
                                  {isReached ? (
                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                  ) : (
                                    <TierIcon className={`w-5 h-5 ${tier.color} opacity-50`} />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-semibold ${isReached ? 'text-white' : 'text-white/50'}`}>
                                      {tier.name}
                                    </span>
                                    {isCurrent && (
                                      <Badge className="bg-secondary text-dark text-xs px-2 py-0">Actuel</Badge>
                                    )}
                                  </div>
                                  <span className="text-xs text-white/50">{tier.points} points requis</span>
                                </div>
                                <span className={`font-bold ${isReached ? 'text-secondary' : 'text-white/40'}`}>
                                  {tier.reward}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 3 Ways to Earn - Mobile Optimized */}
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  <div className="bg-gradient-to-r from-secondary to-yellow-500 p-3 md:p-4">
                    <h3 className="font-heading text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      3 façons de gagner des points
                    </h3>
                  </div>
                  
                  {/* Mobile: Horizontal scroll / Desktop: Grid */}
                  <div className="p-3 md:p-4">
                    {/* Mobile horizontal scroll */}
                    <div className="flex md:hidden gap-3 overflow-x-auto pb-2 snap-x snap-mandatory -mx-1 px-1">
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="flex-shrink-0 w-[280px] snap-start bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border-2 border-blue-200 active:scale-95 transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-md">
                            <Users className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-heading font-semibold text-dark">Référez quelqu'un</h4>
                            <p className="text-xs text-prestige-taupe">Partagez votre lien</p>
                          </div>
                          <Badge className="bg-blue-500 text-white border-0 text-xs px-2 py-1">+1 pt</Badge>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="flex-shrink-0 w-[280px] snap-start bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border-2 border-green-200 active:scale-95 transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                            <MessageSquare className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-heading font-semibold text-dark">Avis Google</h4>
                            <p className="text-xs text-prestige-taupe">Partagez votre avis</p>
                          </div>
                          <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-1">+2 pts</Badge>
                        </div>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="flex-shrink-0 w-[280px] snap-start bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200 active:scale-95 transition-transform"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                            <UserCheck className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 text-left">
                            <h4 className="font-heading font-semibold text-dark">Client existant</h4>
                            <p className="text-xs text-prestige-taupe">Confirmez votre statut</p>
                          </div>
                          <Badge className="bg-purple-500 text-white border-0 text-xs px-2 py-1">+2 pts</Badge>
                        </div>
                      </button>
                    </div>
                    
                    {/* Scroll indicator for mobile */}
                    <div className="flex md:hidden justify-center gap-1 mt-2">
                      <div className="w-8 h-1 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-1 bg-gray-300 rounded-full"></div>
                      <div className="w-2 h-1 bg-gray-300 rounded-full"></div>
                    </div>
                    
                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid md:grid-cols-3 gap-4">
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="group bg-gradient-to-br from-blue-50 to-white rounded-xl p-5 border-2 border-blue-100 hover:border-blue-300 hover:shadow-lg transition-all text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                          <Users className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-heading font-semibold text-dark mb-1">Référez quelqu'un</h4>
                        <p className="text-sm text-prestige-taupe mb-2">Partagez votre lien unique</p>
                        <Badge className="bg-blue-500 text-white border-0">+1 point par référence</Badge>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="group bg-gradient-to-br from-green-50 to-white rounded-xl p-5 border-2 border-green-100 hover:border-green-300 hover:shadow-lg transition-all text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-heading font-semibold text-dark mb-1">Avis Google</h4>
                        <p className="text-sm text-prestige-taupe mb-2">Partagez votre expérience</p>
                        <Badge className="bg-green-500 text-white border-0">+2 points</Badge>
                      </button>
                      
                      <button 
                        onClick={() => setActiveTab('referrals')}
                        className="group bg-gradient-to-br from-purple-50 to-white rounded-xl p-5 border-2 border-purple-100 hover:border-purple-300 hover:shadow-lg transition-all text-left"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md">
                          <UserCheck className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-heading font-semibold text-dark mb-1">Client existant</h4>
                        <p className="text-sm text-prestige-taupe mb-2">Confirmez votre statut</p>
                        <Badge className="bg-purple-500 text-white border-0">+2 points</Badge>
                      </button>
                    </div>
                  </div>
                </div>

                {/* User Info & Quick Actions */}
                <div className="grid lg:grid-cols-3 gap-6">
                  {/* User Info Card */}
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                      <div className="bg-gradient-to-r from-primary to-primary/80 p-4">
                        <h3 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Mes informations
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-6">
                          <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-100">
                              <span className="text-prestige-taupe">Nom complet</span>
                              <span className="font-medium text-dark">{user.first_name} {user.last_name}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                              <span className="text-prestige-taupe">Courriel</span>
                              <span className="font-medium text-dark">{user.email}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between py-3 border-b border-gray-100">
                              <span className="text-prestige-taupe">Téléphone</span>
                              <span className="font-medium text-dark">{user.phone || 'Non renseigné'}</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-gray-100">
                              <span className="text-prestige-taupe">Membre depuis</span>
                              <span className="font-medium text-dark">
                                {new Date(user.created_at).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-primary to-dark rounded-2xl p-6 text-white shadow-lg">
                      <h3 className="font-heading text-lg font-semibold mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-secondary" />
                        Accès rapide
                      </h3>
                      <div className="space-y-3">
                        <Link 
                          to="/outils"
                          className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          <TrendingUp className="w-5 h-5" />
                          <span className="text-sm">Outils financiers</span>
                        </Link>
                        <Link 
                          to="/rendez-vous"
                          className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
                        >
                          <Calendar className="w-5 h-5" />
                          <span className="text-sm">Prendre rendez-vous</span>
                        </Link>
                        <Link 
                          to="/referencement"
                          className="w-full flex items-center gap-3 p-3 bg-secondary/20 rounded-xl hover:bg-secondary/30 transition-colors border border-secondary/30"
                        >
                          <Gift className="w-5 h-5 text-secondary" />
                          <span className="text-sm">Détails du programme</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* History Tab */}
            <TabsContent value="history">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center justify-between">
                  <h3 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Historique des outils
                  </h3>
                  <Link to="/outils" className="text-white/80 hover:text-white text-sm flex items-center gap-1">
                    Voir les outils <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : toolResults.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Clock className="w-10 h-10 text-gray-300" />
                      </div>
                      <h4 className="font-heading text-lg font-semibold text-dark mb-2">Aucun résultat sauvegardé</h4>
                      <p className="text-prestige-taupe mb-6">Commencez à utiliser nos outils financiers pour voir votre historique ici.</p>
                      <Link to="/outils" className="btn-primary inline-flex items-center gap-2">
                        Découvrir les outils <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {toolResults.map((result) => (
                        <div 
                          key={result.id}
                          className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                          data-testid={`tool-result-${result.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-dark">{result.tool_name}</h4>
                              <p className="text-prestige-taupe text-sm mt-1">{result.summary}</p>
                            </div>
                            <span className="text-xs text-prestige-taupe bg-white px-2 py-1 rounded-lg">
                              {new Date(result.created_at).toLocaleDateString('fr-CA')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Points Tab */}
            <TabsContent value="referrals" className="overflow-hidden">
              <div className="grid lg:grid-cols-3 gap-4 md:gap-6 max-w-full overflow-hidden">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-4 md:space-y-6 min-w-0 overflow-hidden">
                  {/* Ways to Earn Points */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-secondary/90 to-secondary p-3 md:p-4">
                      <h3 className="font-heading text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        Gagnez des points
                      </h3>
                    </div>
                    <div className="p-3 md:p-6 space-y-3 md:space-y-4 overflow-hidden">
                      {/* 1. Referral Link */}
                      <div className="relative border-2 border-blue-200 rounded-xl md:rounded-2xl p-3 md:p-5 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <Users className="w-5 h-5 md:w-7 md:h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1 md:mb-2">
                              <h4 className="font-heading font-semibold text-dark text-sm md:text-base">Référez quelqu'un</h4>
                              <Badge className="bg-blue-500 text-white border-0 text-xs px-2 py-0.5">+1 pt/réf.</Badge>
                            </div>
                            <p className="text-xs md:text-sm text-prestige-taupe mb-2 md:mb-3">
                              Ce lien ouvre une page de consentement pour votre contact (coordonnées et accord écrit). Vous pouvez aussi saisir une référence ci-dessous.
                            </p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 min-w-0 p-2 md:p-3 bg-white rounded-lg md:rounded-xl font-mono text-[10px] md:text-xs truncate border border-gray-200 overflow-hidden">
                                {getReferralConsentUrl(user.referral_code)}
                              </div>
                              <Button 
                                onClick={copyReferralLink}
                                className="bg-blue-500 hover:bg-blue-600 h-8 w-8 md:h-10 md:w-10 p-0 flex-shrink-0"
                                data-testid="copy-referral-link"
                              >
                                {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2. Google Review */}
                      <div className="relative border-2 border-green-200 rounded-xl md:rounded-2xl p-3 md:p-5 bg-gradient-to-br from-green-50 to-white overflow-hidden">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <MessageSquare className="w-5 h-5 md:w-7 md:h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1 md:mb-2">
                              <h4 className="font-heading font-semibold text-dark text-sm md:text-base">Avis Google</h4>
                              <Badge className="bg-green-500 text-white border-0 text-xs px-2 py-0.5">+2 pts</Badge>
                              {googleReview && getStatusBadge(googleReview.status)}
                            </div>
                            
                            {googleReview ? (
                              <div className="text-xs md:text-sm">
                                {googleReview.status === 'verified' ? (
                                  <p className="text-green-600 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    Votre avis a été vérifié. Merci!
                                  </p>
                                ) : googleReview.status === 'pending' ? (
                                  <p className="text-yellow-600 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    Votre avis est en cours de vérification.
                                  </p>
                                ) : (
                                  <p className="text-red-600">Avis rejeté. Contactez-nous pour plus d'informations.</p>
                                )}
                              </div>
                            ) : (
                              <div className="space-y-2 md:space-y-3">
                                <p className="text-xs md:text-sm text-prestige-taupe">
                                  Laissez un avis sur Google puis confirmez-le ici.
                                </p>
                                <div className="flex flex-col gap-2">
                                  <a
                                    href={googleReviewLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-3 py-2 bg-white border-2 border-green-300 rounded-lg text-green-700 hover:bg-green-50 transition-colors text-xs font-medium w-full sm:w-auto"
                                  >
                                    <ExternalLink className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">Laisser un avis</span>
                                  </a>
                                  <Button
                                    onClick={handleGoogleReviewSubmit}
                                    disabled={submittingReview}
                                    className="bg-green-500 hover:bg-green-600 text-xs h-9 w-full sm:w-auto"
                                    data-testid="confirm-google-review"
                                  >
                                    {submittingReview ? 'Envoi...' : 'J\'ai laissé mon avis'}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 3. Existing Client */}
                      <div className="relative border-2 border-purple-200 rounded-xl md:rounded-2xl p-3 md:p-5 bg-gradient-to-br from-purple-50 to-white overflow-hidden">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                            <UserCheck className="w-5 h-5 md:w-7 md:h-7 text-white" />
                          </div>
                          <div className="flex-1 min-w-0 overflow-hidden">
                            <div className="flex flex-wrap items-center gap-1 md:gap-2 mb-1 md:mb-2">
                              <h4 className="font-heading font-semibold text-dark text-sm md:text-base">Client existant</h4>
                              <Badge className="bg-purple-500 text-white border-0 text-xs px-2 py-0.5">+2 pts</Badge>
                              {existingClient && getStatusBadge(existingClient.status)}
                            </div>
                            
                            {existingClient ? (
                              <div className="text-xs md:text-sm">
                                {existingClient.status === 'verified' ? (
                                  <p className="text-green-600 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                    Votre statut de client a été vérifié!
                                  </p>
                                ) : existingClient.status === 'pending' ? (
                                  <p className="text-yellow-600 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                    Vérification en cours...
                                  </p>
                                ) : (
                                  <p className="text-red-600">Non vérifié. Contactez-nous si vous pensez qu'il s'agit d'une erreur.</p>
                                )}
                              </div>
                            ) : (
                              <form onSubmit={handleExistingClientSubmit} className="space-y-2 w-full">
                                <p className="text-xs md:text-sm text-prestige-taupe">
                                  Êtes-vous déjà client? Confirmez votre identité.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                  <Input
                                    value={existingClientForm.first_name}
                                    onChange={(e) => setExistingClientForm(prev => ({ ...prev, first_name: e.target.value }))}
                                    placeholder="Prénom"
                                    required
                                    className="h-9 text-sm"
                                    data-testid="existing-client-firstname"
                                  />
                                  <Input
                                    value={existingClientForm.last_name}
                                    onChange={(e) => setExistingClientForm(prev => ({ ...prev, last_name: e.target.value }))}
                                    placeholder="Nom"
                                    required
                                    className="h-9 text-sm"
                                    data-testid="existing-client-lastname"
                                  />
                                  <Input
                                    type="date"
                                    value={existingClientForm.date_of_birth}
                                    onChange={(e) => setExistingClientForm(prev => ({ ...prev, date_of_birth: e.target.value }))}
                                    required
                                    className="h-9 text-sm"
                                    data-testid="existing-client-dob"
                                  />
                                </div>
                                <Button
                                  type="submit"
                                  disabled={submittingClient}
                                  className="bg-purple-500 hover:bg-purple-600 text-xs md:text-sm h-9"
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

                  {/* Referral Form */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-primary to-primary/80 p-3 md:p-4">
                      <h3 className="font-heading text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                        <Send className="w-5 h-5" />
                        Référer quelqu'un
                      </h3>
                    </div>
                    <div className="p-3 md:p-6">
                      <form onSubmit={handleReferralSubmit} className="space-y-3 md:space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <Label htmlFor="referred_name" className="text-sm">Nom complet *</Label>
                            <Input
                              id="referred_name"
                              value={referralForm.referred_name}
                              onChange={(e) => setReferralForm(prev => ({ ...prev, referred_name: e.target.value }))}
                              placeholder="Jean Tremblay"
                              required
                              className="h-9 text-sm"
                              data-testid="referral-name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="referred_email" className="text-sm">Courriel *</Label>
                            <Input
                              id="referred_email"
                              type="email"
                              value={referralForm.referred_email}
                              onChange={(e) => setReferralForm(prev => ({ ...prev, referred_email: e.target.value }))}
                              placeholder="jean@exemple.com"
                              required
                              className="h-9 text-sm"
                              data-testid="referral-email"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <Label htmlFor="referred_phone" className="text-sm">Téléphone (optionnel)</Label>
                            <Input
                              id="referred_phone"
                              type="tel"
                              value={referralForm.referred_phone}
                              onChange={(e) => setReferralForm(prev => ({ ...prev, referred_phone: e.target.value }))}
                              placeholder="(514) 123-4567"
                              className="h-9 text-sm"
                              data-testid="referral-phone"
                            />
                          </div>
                          <div>
                            <Label htmlFor="notes" className="text-sm">Notes (optionnel)</Label>
                            <Input
                              id="notes"
                              value={referralForm.notes}
                              onChange={(e) => setReferralForm(prev => ({ ...prev, notes: e.target.value }))}
                              placeholder="Ex: Intéressé par l'assurance vie"
                              className="h-9 text-sm"
                              data-testid="referral-notes"
                            />
                          </div>
                        </div>
                        <Button 
                          type="submit" 
                          disabled={submittingReferral}
                          className="btn-primary text-sm h-10"
                          data-testid="submit-referral"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {submittingReferral ? 'Envoi...' : 'Envoyer la référence'}
                        </Button>
                      </form>
                    </div>
                  </div>

                  {/* Referrals List */}
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-gray-700 to-gray-800 p-3 md:p-4">
                      <h3 className="font-heading text-lg md:text-xl font-semibold text-white flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Mes références ({referrals.length})
                      </h3>
                    </div>
                    <div className="p-3 md:p-6">
                      {referrals.length === 0 ? (
                        <p className="text-prestige-taupe text-center py-6 md:py-8 text-sm">
                          Aucune référence pour le moment. Partagez votre lien!
                        </p>
                      ) : (
                        <div className="space-y-2 md:space-y-3">
                          {referrals.map((ref) => (
                            <div 
                              key={ref.id}
                              className="flex items-center justify-between p-3 md:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors gap-2"
                              data-testid={`referral-item-${ref.id}`}
                            >
                              <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                  <span className="font-semibold text-primary text-xs md:text-sm">
                                    {ref.referred_name.split(' ').map(n => n[0]).join('')}
                                  </span>
                                </div>
                                <div className="min-w-0">
                                  <p className="font-medium text-dark text-sm truncate">{ref.referred_name}</p>
                                  <p className="text-xs text-prestige-taupe truncate">{ref.referred_email}</p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                {getStatusBadge(ref.status)}
                                <p className="text-[10px] md:text-xs text-prestige-taupe mt-1">
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

                {/* Sidebar - Hidden on mobile, shown on lg */}
                <div className="hidden lg:block space-y-6">
                  {/* Reward Tiers */}
                  <div className="bg-gradient-to-br from-dark via-primary to-dark rounded-2xl p-6 text-white shadow-lg overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/20 rounded-full blur-3xl" />
                    <h3 className="font-heading text-lg font-semibold mb-6 flex items-center gap-2 relative">
                      <Trophy className="w-5 h-5 text-secondary" />
                      Paliers de récompenses
                    </h3>
                    <div className="space-y-3 relative">
                      {TIERS.map((tier) => {
                        const isReached = referralStats?.total_points >= tier.points;
                        const TierIcon = tier.icon;
                        return (
                          <div 
                            key={tier.name}
                            className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                              isReached ? 'bg-white/20' : 'bg-white/5'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isReached ? (
                                <CheckCircle2 className="w-5 h-5 text-secondary" />
                              ) : (
                                <TierIcon className="w-5 h-5 text-white/50" />
                              )}
                              <div>
                                <span className={`text-sm font-medium ${isReached ? 'text-white' : 'text-white/60'}`}>
                                  {tier.name}
                                </span>
                                <p className="text-xs text-white/50">{tier.points} pts</p>
                              </div>
                            </div>
                            <span className={`font-semibold ${isReached ? 'text-secondary' : 'text-white/60'}`}>
                              {tier.reward}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-xs text-white/50 mt-4 text-center">
                      Les paliers sont cumulatifs!
                    </p>
                    <Link to="/referencement" className="inline-flex items-center gap-1 text-secondary text-sm mt-3 hover:underline w-full justify-center">
                      En savoir plus <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-primary/80 p-4 flex items-center justify-between">
                  <h3 className="font-heading text-xl font-semibold text-white flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Mes notifications
                  </h3>
                  {notifications.some(n => !n.is_read) && (
                    <Button 
                      variant="outline" 
                      onClick={markAllNotificationsRead}
                      className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                      data-testid="mark-all-read"
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <div className="p-6">
                  {notifications.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Bell className="w-10 h-10 text-gray-300" />
                      </div>
                      <h4 className="font-heading text-lg font-semibold text-dark mb-2">Aucune notification</h4>
                      <p className="text-prestige-taupe">Vos notifications apparaîtront ici.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-4 rounded-xl cursor-pointer transition-all ${
                            notif.is_read ? 'bg-gray-50 hover:bg-gray-100' : 'bg-blue-50 hover:bg-blue-100 border-l-4 border-primary'
                          }`}
                          onClick={() => markNotificationRead(notif.id)}
                          data-testid={`notification-${notif.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-dark">{notif.title}</p>
                              <p className="text-prestige-taupe text-sm mt-1">{notif.message}</p>
                            </div>
                            <div className="text-right flex-shrink-0 ml-4">
                              {!notif.is_read && (
                                <span className="inline-block w-2 h-2 bg-primary rounded-full mb-1" />
                              )}
                              <p className="text-xs text-prestige-taupe">
                                {new Date(notif.created_at).toLocaleDateString('fr-CA')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </main>
  );
};
