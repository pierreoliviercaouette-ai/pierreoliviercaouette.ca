import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Wrench, Clock, ChevronRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { hasToolView } from '../tools/registry';

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
        setTools(data || []);
      } catch (error) {
        console.error('Failed to fetch tools:', error);
        setTools([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  const visibleTools = useMemo(
    () => tools.filter((tool) => hasToolView(tool.slug)),
    [tools]
  );

  const toolsLabel =
    loading && tools.length === 0
      ? 'Chargement des outils...'
      : `${visibleTools.length} outil${visibleTools.length > 1 ? 's' : ''} disponible${
          visibleTools.length > 1 ? 's' : ''
        }`;

  return (
    <main className="min-h-screen bg-light" data-testid="tools-page">
      <PageHero badge="Outils" title="Outils financiers" description={toolsLabel}>
        {user ? (
          <Link
            to="/profil"
            className="group border-2 border-white/30 text-white rounded-full px-8 py-4 font-semibold hover:bg-white/10 hover:border-white/50 transition-all duration-300 inline-flex items-center justify-center gap-2 backdrop-blur-sm"
            data-testid="view-history-btn"
          >
            <Clock className="w-5 h-5" />
            Voir mon historique
          </Link>
        ) : null}
      </PageHero>

      <section className="section-padding">
        <div className="container-max">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse rounded-xl border border-prestige-beige bg-white p-6">
                  <div className="mb-4 h-5 w-2/3 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                </div>
              ))}
            </div>
          ) : visibleTools.length === 0 ? (
            <div className="py-16 text-center">
              <Wrench className="mx-auto mb-4 h-12 w-12 text-prestige-beige" />
              <h3 className="font-heading mb-2 text-xl font-semibold text-dark">
                Aucun outil disponible
              </h3>
              <p className="text-prestige-taupe">Les outils seront bientôt disponibles.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {visibleTools.map((tool) => (
                <button
                  key={tool.id}
                  type="button"
                  className="group rounded-xl border border-prestige-beige bg-white p-6 text-left transition-colors hover:border-primary/40 hover:bg-white"
                  onClick={() => navigate(`/outils/${tool.slug}`)}
                  data-testid={`tool-card-${tool.slug}`}
                >
                  <h3 className="font-heading mb-2 text-lg font-semibold text-dark">
                    {tool.name}
                  </h3>
                  <p className="mb-4 text-sm leading-relaxed text-prestige-taupe">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-all group-hover:gap-2">
                    Utiliser l&apos;outil <ChevronRight className="h-4 w-4" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};
