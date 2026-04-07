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
      <main className="pt-20 min-h-screen" data-testid="tools-page-locked">
        <PageHero
          badge="Espace membre"
          title="Outils financiers"
          description="Accedez a une bibliotheque d outils pour simuler, calculer et planifier vos decisions financieres."
        />
        <section className="bg-primary py-2">
          <div className="container-max text-center">
            <Link
              to="/connexion"
              className="inline-flex items-center gap-2 text-white font-medium hover:text-secondary transition-colors"
              data-testid="tools-login-cta"
            >
              <Lock className="w-4 h-4" />
              Se connecter pour debloquer les outils
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* Preview Section */}
        <section className="section-padding bg-white">
          <div className="container-max">
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-dark text-center mb-12">
              Aperçu des outils disponibles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: 'Calculateur d\'assurance vie', description: 'Estimez vos besoins en couverture' },
                { name: 'Simulateur REER vs CELI', description: 'Comparez les options d\'épargne' },
                { name: 'Calculateur de retraite', description: 'Projetez vos revenus de retraite' },
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

  return (
    <main className="pt-20 min-h-screen bg-light" data-testid="tools-page">
      {/* Header */}
      <section className="bg-white border-b border-prestige-beige py-8">
        <div className="container-max px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="font-heading text-3xl font-bold text-dark">
                Mes outils
              </h1>
              <p className="text-prestige-taupe">
                {tools.length} outil{tools.length > 1 ? 's' : ''} disponible{tools.length > 1 ? 's' : ''}
              </p>
            </div>
            <Link 
              to="/profil" 
              className="btn-secondary inline-flex items-center gap-2"
              data-testid="view-history-btn"
            >
              <Clock className="w-4 h-4" />
              Voir mon historique
            </Link>
          </div>
        </div>
      </section>

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
