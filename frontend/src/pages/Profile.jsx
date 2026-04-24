import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import {
  User,
  Gift,
  Clock,
  Bell,
  ChevronRight,
  ArrowRight,
  Calendar,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { PageHero } from '../components/layout/PageHero';
import { useSeoMeta } from '../lib/seo';
import { useReferralProgramData } from '../hooks/useReferralProgramData';
import { ReferralMemberActions } from '../components/referral/ReferralMemberActions';

function ProfileReferralProgramActions({ user }) {
  const program = useReferralProgramData(user);
  return (
    <div
      className="overflow-hidden rounded-2xl border border-prestige-beige bg-white p-6 shadow-ia md:p-8"
      data-testid="profile-referral-actions"
    >
      <h3 className="font-heading text-lg font-semibold text-dark md:text-xl">Soumissions au programme</h3>
      <p className="mt-1 text-sm text-prestige-taupe">
        Règles et tableau des paliers :{' '}
        <Link to="/recommandations" className="font-medium text-primary hover:underline">
          page Recommandations
        </Link>
        . Ci-dessous : votre lien, avis Google, client existant, références et suivi.
      </p>
      <div className="mt-6">
        <ReferralMemberActions user={user} program={program} hideReferralLinkCard={false} />
      </div>
    </div>
  );
}

export const Profile = () => {
  const { user, loading: authLoading, notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
  useSeoMeta({
    title: 'Mon profil | Espace membre',
    description: 'Historique de vos outils, notifications, et raccourci vers le programme de recommandations.',
    canonicalPath: '/profil',
  });
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [toolResults, setToolResults] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const tr = await supabase
        .from('tool_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100);
      if (tr.error) throw tr.error;
      setToolResults(tr.data || []);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <main className="pt-20 min-h-screen bg-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-prestige-taupe">Chargement de votre profil...</p>
        </div>
      </main>
    );
  }

  if (!user) return null;

  const unreadNotif = notifications.filter((n) => !n.is_read).length;

  return (
    <main className="pt-20 min-h-screen bg-light" data-testid="profile-page">
      <PageHero
        badge="Espace membre"
        title={`Bonjour, ${user.first_name}`}
        description="Vos outils, vos notifications, et l’accès à votre programme de recommandations."
        minHeightClass="min-h-[42vh] md:min-h-[48vh]"
      />

      <div className="relative z-20 container-max -mt-14 px-4 pb-2 md:-mt-[4.25rem] md:px-8">
        <div className="rounded-2xl border border-prestige-beige bg-white p-6 shadow-ia md:p-8">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-prestige-beige bg-light shadow-sm md:h-24 md:w-24">
                <span className="font-heading text-2xl font-bold text-primary md:text-3xl">
                  {(user.first_name?.[0] || '').toUpperCase()}
                  {(user.last_name?.[0] || '').toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-heading text-xl font-bold text-dark md:text-2xl">
                  {user.first_name} {user.last_name}
                </p>
                <p className="mt-1 text-sm text-prestige-taupe">{user.email}</p>
                {user.is_admin && (
                  <Badge variant="secondary" className="mt-3 bg-primary/10 text-primary border-primary/20">
                    Administrateur
                  </Badge>
                )}
              </div>
            </div>

            <div className="grid w-full max-w-2xl flex-1 grid-cols-1 gap-3 sm:grid-cols-3 lg:ml-auto">
              <div className="rounded-xl border border-prestige-beige bg-light/80 p-4 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-prestige-beige bg-white">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-dark tabular-nums md:text-3xl">{toolResults.length}</p>
                <p className="text-xs text-prestige-taupe">Résultats d&apos;outils</p>
              </div>
              <div className="rounded-xl border border-prestige-beige bg-light/80 p-4 text-center">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-prestige-beige bg-white">
                  <Bell className="h-4 w-4 text-primary" />
                </div>
                <p className="text-2xl font-bold text-dark tabular-nums md:text-3xl">{unreadNotif}</p>
                <p className="text-xs text-prestige-taupe">Notifications non lues</p>
              </div>
              <Link
                to="/recommandations"
                className="flex flex-col items-center justify-center rounded-xl border-2 border-primary/25 bg-primary/5 p-4 text-center transition-colors hover:bg-primary/10"
              >
                <Gift className="mb-1 h-6 w-6 text-primary" />
                <span className="text-sm font-semibold text-primary">Recommandations</span>
                <span className="text-xs text-prestige-taupe">Règles, paliers, solde</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section className="section-padding bg-light pt-6 md:pt-8">
        <div className="container-max">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8 grid w-full grid-cols-1 gap-1 rounded-2xl border border-prestige-beige bg-white/90 p-1.5 shadow-ia sm:grid-cols-3">
              <TabsTrigger
                value="overview"
                className="rounded-xl text-prestige-taupe data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <User className="mr-2 h-4 w-4" />
                Aperçu
              </TabsTrigger>
              <TabsTrigger
                value="history"
                className="rounded-xl text-prestige-taupe data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Clock className="mr-2 h-4 w-4" />
                Historique
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="relative rounded-xl text-prestige-taupe data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                <Bell className="mr-2 h-4 w-4" />
                Notifications
                {unreadNotif > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadNotif}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="space-y-6">
                <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-gradient-to-br from-primary/5 to-light shadow-ia">
                  <div className="p-6 md:p-8 md:flex md:items-center md:justify-between md:gap-8">
                    <div className="mb-4 flex items-start gap-4 md:mb-0">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-prestige-beige bg-white">
                        <Sparkles className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-heading text-xl font-bold text-dark md:text-2xl">Programme de recommandations</h2>
                        <p className="mt-1 text-sm text-prestige-taupe">
                          La page Recommandations résume les points et les paliers. Les soumissions (lien, avis, références) se font
                          dans le bloc ci-dessous.
                        </p>
                      </div>
                    </div>
                    <Link
                      to="/recommandations"
                      className="inline-flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-semibold text-white shadow-ia hover:opacity-95 sm:w-auto"
                    >
                      Ouvrir le programme
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                <ProfileReferralProgramActions user={user} />

                <div className="grid gap-6 lg:grid-cols-3">
                  <div className="lg:col-span-2">
                    <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
                      <div className="border-b border-prestige-beige bg-light/50 px-6 py-4">
                        <h3 className="font-heading text-xl font-semibold text-dark flex items-center gap-2">
                          <User className="h-5 w-5 text-primary" />
                          Mes informations
                        </h3>
                      </div>
                      <div className="p-6">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div className="space-y-4">
                            <div className="flex justify-between border-b border-prestige-beige py-3">
                              <span className="text-prestige-taupe">Nom</span>
                              <span className="font-medium text-dark">
                                {user.first_name} {user.last_name}
                              </span>
                            </div>
                            <div className="flex justify-between border-b border-prestige-beige py-3">
                              <span className="text-prestige-taupe">Courriel</span>
                              <span className="font-medium text-dark">{user.email}</span>
                            </div>
                          </div>
                          <div className="space-y-4">
                            <div className="flex justify-between border-b border-prestige-beige py-3">
                              <span className="text-prestige-taupe">Téléphone</span>
                              <span className="font-medium text-dark">{user.phone || '—'}</span>
                            </div>
                            <div className="flex justify-between border-b border-prestige-beige py-3">
                              <span className="text-prestige-taupe">Membre depuis</span>
                              <span className="font-medium text-dark">
                                {new Date(user.created_at).toLocaleDateString('fr-CA', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="rounded-2xl border border-prestige-beige bg-white p-6 shadow-ia">
                      <h3 className="mb-4 font-heading text-lg font-semibold text-dark">Accès rapide</h3>
                      <div className="space-y-2">
                        <Link
                          to="/outils"
                          className="flex w-full items-center gap-3 rounded-xl border border-prestige-beige bg-light/50 p-3 text-sm text-dark transition-colors hover:border-primary/30"
                        >
                          <TrendingUp className="h-5 w-5 shrink-0 text-primary" />
                          Outils financiers
                        </Link>
                        <Link
                          to="/rendez-vous"
                          className="flex w-full items-center gap-3 rounded-xl border border-prestige-beige bg-light/50 p-3 text-sm text-dark transition-colors hover:border-primary/30"
                        >
                          <Calendar className="h-5 w-5 shrink-0 text-primary" />
                          Prendre rendez-vous
                        </Link>
                        <Link
                          to="/recommandations"
                          className="flex w-full items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
                        >
                          <Gift className="h-5 w-5 shrink-0" />
                          Programme de recommandations
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="history">
              <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
                <div className="flex items-center justify-between gap-4 border-b border-prestige-beige bg-light/50 px-6 py-4">
                  <h3 className="font-heading text-xl font-semibold text-dark flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Historique des outils
                  </h3>
                  <Link to="/outils" className="flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                    Voir les outils <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
                <div className="p-6">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-100" />
                      ))}
                    </div>
                  ) : toolResults.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <Clock className="h-10 w-10 text-gray-300" />
                      </div>
                      <h4 className="mb-2 font-heading text-lg font-semibold text-dark">Aucun résultat sauvegardé</h4>
                      <p className="mb-6 text-prestige-taupe">Utilisez les outils pour voir l’historique ici.</p>
                      <Link to="/outils" className="btn-primary inline-flex items-center gap-2">
                        Découvrir les outils <ArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {toolResults.map((result) => (
                        <div
                          key={result.id}
                          className="rounded-xl bg-light p-4 transition-colors hover:bg-gray-100"
                          data-testid={`tool-result-${result.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-dark">{result.tool_name}</h4>
                              <p className="mt-1 text-sm text-prestige-taupe">{result.summary}</p>
                            </div>
                            <span className="rounded-lg bg-white px-2 py-1 text-xs text-prestige-taupe">
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

            <TabsContent value="notifications">
              <div className="overflow-hidden rounded-2xl border border-prestige-beige bg-white shadow-ia">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-prestige-beige bg-light/50 px-6 py-4">
                  <h3 className="font-heading text-xl font-semibold text-dark flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    Mes notifications
                  </h3>
                  {notifications.some((n) => !n.is_read) && (
                    <Button
                      variant="outline"
                      onClick={markAllNotificationsRead}
                      className="border-prestige-beige text-dark hover:bg-light"
                      data-testid="mark-all-read"
                    >
                      Tout marquer comme lu
                    </Button>
                  )}
                </div>
                <div className="p-6">
                  {notifications.length === 0 ? (
                    <div className="py-16 text-center">
                      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                        <Bell className="h-10 w-10 text-gray-300" />
                      </div>
                      <h4 className="mb-2 font-heading text-lg font-semibold text-dark">Aucune notification</h4>
                      <p className="text-prestige-taupe">Vos notifications apparaîtront ici.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`cursor-pointer rounded-xl p-4 transition-all ${
                            notif.is_read
                              ? 'bg-light hover:bg-gray-100'
                              : 'border-l-4 border-primary bg-blue-50 hover:bg-blue-100'
                          }`}
                          onClick={() => markNotificationRead(notif.id)}
                          data-testid={`notification-${notif.id}`}
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold text-dark">{notif.title}</p>
                              <p className="mt-1 text-sm text-prestige-taupe">{notif.message}</p>
                            </div>
                            <div className="ml-4 flex-shrink-0 text-right">
                              {!notif.is_read && <span className="mb-1 inline-block h-2 w-2 rounded-full bg-primary" />}
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
