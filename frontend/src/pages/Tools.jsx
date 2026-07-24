import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Wrench, Lock, ArrowRight, Clock, ChevronRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';

export const Tools = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false });
        if (error) throw error;
        const rows = data || [];
        // Anon RLS already filters to requires_auth=false; keep client filter for safety
        setTools(user ? rows : rows.filter((t) => t.requires_auth === false));
      } catch (error) {
        console.error('Failed to fetch tools:', error);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, [user]);

  const publicTools = tools.filter((t) => t.requires_auth === false);

  if (!user) {
    return (
      <main className="min-h-screen bg-light" data-testid="tools-page-public">
        <PageHero
          badge="Outils"
          title="Outils financiers"
          description="Certains outils sont libres d'accès. Connectez-vous pour débloquer toute la bibliothèque."
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {publicTools[0] && (
              <Link
                to={`/outils/${publicTools[0].slug}`}
                className="group bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-secondary hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg shadow-white/20"
              >
                Essayer le comparateur
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
            <Link
              to="/connexion"
              className="group border-2 border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
              data-testid="tools-login-cta"
            >
              <Lock className="w-5 h-5" />
              Se connecter
            </Link>
          </div>
        </PageHero>

        <section className="section-padding bg-white">
          <div className="container-max">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark text-center mb-4">
              Outils accessibles sans compte
            </h2>
            {loading ? (
              <p className="text-center text-prestige-taupe">Chargement…</p>
            ) : publicTools.length === 0 ? (
              <p className="text-center text-prestige-taupe mb-12">
                Aucun outil public pour le moment. Connectez-vous pour voir la bibliothèque membre.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {publicTools.map((tool) => (
                  <div
                    key={tool.id}
                    className="card-service cursor-pointer"
                    onClick={() => navigate(`/outils/${tool.slug}`)}
                    data-testid={`tool-card-${tool.slug}`}
                  >
                    <div className="w-14 h-14 rounded-2xl bg-light flex items-center justify-center mb-6">
                      <Wrench className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-dark mb-3">{tool.name}</h3>
                    <p className="text-prestige-taupe mb-4">{tool.description}</p>
                    <span className="inline-flex items-center gap-1 text-primary font-medium text-sm">
                      Utiliser l&apos;outil <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                ))}
              </div>
            )}

            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark text-center mb-12">
              Réservés aux membres
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Calculateur d'assurance vie", description: 'Estimez vos besoins en couverture' },
                { name: 'Comparateur REER vs CELI', description: "Comparez les options d'épargne" },
                { name: 'Calculateur hypothécaire', description: 'Estimez paiements et prime SCHL' },
              ].map((tool, index) => (
                <div key={index} className="card-service opacity-60">
                  <div className="w-14 h-14 rounded-2xl bg-light flex items-center justify-center mb-6">
                    <Wrench className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-dark mb-3">{tool.name}</h3>
                  <p className="text-prestige-taupe mb-4">{tool.description}</p>
                  <div className="flex items-center gap-2 text-prestige-taupe">
                    <Lock className="w-4 h-4" />
                    <span className="text-sm">Connexion requise</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    );
  }

  const toolsLabel =
    loading && tools.length === 0
      ? 'Chargement de vos outils...'
      : `${tools.length} outil${tools.length > 1 ? 's' : ''} disponible${tools.length > 1 ? 's' : ''}`;

  return (
    <main className="min-h-screen bg-light" data-testid="tools-page">
      <PageHero badge="Espace membre" title="Mes outils" description={toolsLabel}>
        <Link
          to="/profil"
          className="group border-2 border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
          data-testid="view-history-btn"
        >
          <Clock className="w-5 h-5" />
          Voir mon historique
        </Link>
      </PageHero>

      <section className="section-padding">
        <div className="container-max">
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-8 animate-pulse">
                  <div className="w-14 h-14 rounded-2xl bg-gray-200 mb-6" />
                  <div className="h-6 bg-gray-200 rounded mb-3 w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              ))}
            </div>
          ) : tools.length === 0 ? (
            <div className="text-center py-16">
              <Wrench className="w-16 h-16 mx-auto text-prestige-beige mb-4" />
              <h3 className="font-heading text-xl font-semibold text-dark mb-2">
                Aucun outil disponible
              </h3>
              <p className="text-prestige-taupe">
                Les outils seront bientôt disponibles.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <div
                  key={tool.id}
                  className="card-service cursor-pointer"
                  onClick={() => navigate(`/outils/${tool.slug}`)}
                  data-testid={`tool-card-${tool.slug}`}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                  <div className="w-14 h-14 rounded-2xl bg-light flex items-center justify-center mb-6 group-hover:bg-primary transition-colors duration-300">
                    <Wrench className="w-7 h-7 text-primary group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-dark mb-3">
                    {tool.name}
                  </h3>
                  <p className="text-prestige-taupe mb-4">{tool.description}</p>
                  {tool.requires_auth === false && (
                    <p className="text-xs text-blue-700 mb-2">Accessible sans connexion</p>
                  )}
                  <span className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Utiliser l&apos;outil <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
