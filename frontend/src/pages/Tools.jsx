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
    if (!user) {
      setTools([]);
      setLoading(false);
      return;
    }
    const fetchTools = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTools(data || []);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, [user]);

  if (!user) {
    return (
      <main className="min-h-screen bg-light" data-testid="tools-page-locked">
        <PageHero
          badge="Espace membre"
          title="Outils financiers"
          description="Accédez à une bibliothèque d'outils pour simuler, calculer et planifier vos décisions financières."
        >
          <Link
            to="/connexion"
            className="group bg-white text-primary rounded-full px-8 py-4 font-semibold hover:bg-secondary hover:text-white transition-all duration-300 inline-flex items-center justify-center gap-2 shadow-lg shadow-white/20"
            data-testid="tools-login-cta"
          >
            <Lock className="w-5 h-5" />
            Se connecter
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </PageHero>

        {/* Preview Section */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark text-center mb-12">
              Aperçu des outils disponibles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: "Calculateur d'assurance vie", description: 'Estimez vos besoins en couverture' },
                { name: 'Comparateur REER vs CELI', description: "Comparez les options d'épargne" },
                { name: 'Calculateur hypothécaire', description: 'Estimez paiements et prime SCHL' },
              ].map((tool, index) => (
                <div 
                  key={index}
                  className="card-service opacity-60"
                >
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

      {/* Tools Grid */}
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
                  
                  <span className="inline-flex items-center gap-1 text-primary font-medium text-sm group-hover:gap-2 transition-all">
                    Utiliser l'outil <ChevronRight className="w-4 h-4" />
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
