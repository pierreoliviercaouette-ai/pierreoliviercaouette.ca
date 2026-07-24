import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft, Save, Clock, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { trackEvent } from '../lib/analytics';
import { ToolShell } from '../components/tools/ToolShell';
import { getToolView, hasToolView, runTool } from '../tools/registry';

export const ToolDetail = () => {
  const { slug } = useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resultSummary, setResultSummary] = useState('');
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [formValues, setFormValues] = useState({});

  const view = useMemo(() => getToolView(slug), [slug]);

  useEffect(() => {
    if (authLoading) return;

    const fetchTool = async () => {
      try {
        const { data, error } = await supabase
          .from('tools')
          .select('*')
          .eq('slug', slug)
          .eq('is_active', true)
          .maybeSingle();
        if (error) throw error;

        // Outil React enregistré même si la ligne DB manque (ex. pas encore seedé)
        if (!data && hasToolView(slug)) {
          setTool({
            id: null,
            name: view?.title || slug,
            description: view?.description || '',
            slug,
            is_active: true,
          });
          setFormValues({ ...(view?.defaults || {}) });
          return;
        }

        if (!data) {
          toast.error('Outil non trouvé');
          navigate('/outils');
          return;
        }

        if (!hasToolView(slug)) {
          toast.error('Cet outil n’est pas encore disponible dans la nouvelle interface.');
          navigate('/outils');
          return;
        }

        setTool(data);
        setFormValues({ ...(view?.defaults || {}) });
      } catch (error) {
        console.error('Failed to fetch tool:', error);
        toast.error('Outil non trouvé');
        navigate('/outils');
      } finally {
        setLoading(false);
      }
    };
    fetchTool();
  }, [slug, authLoading, navigate, view]);

  const { results, presentation } = useMemo(() => {
    if (!slug || !Object.keys(formValues).length) {
      return { results: {}, presentation: { rows: [] } };
    }
    return runTool(slug, formValues);
  }, [slug, formValues]);

  const handleChange = (id, value) => {
    setFormValues((prev) => {
      if (typeof view?.syncValues === 'function') {
        return view.syncValues(prev, id, value);
      }
      return { ...prev, [id]: value };
    });
  };

  const handleSaveResult = async () => {
    if (!user) {
      navigate('/connexion');
      return;
    }
    if (!tool?.id) {
      toast.error('Connexion à la base requise pour sauvegarder cet outil.');
      return;
    }
    if (!resultSummary.trim()) {
      toast.error('Veuillez entrer un résumé de vos résultats');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase.from('tool_results').insert({
        user_id: user.id,
        tool_id: tool.id,
        tool_name: tool.name,
        result_data: { ...formValues, ...results },
        summary: resultSummary,
      });
      if (error) throw error;

      trackEvent('save_tool_result', {
        tool_slug: slug,
        tool_name: tool.name,
      });
      toast.success('Résultat sauvegardé!');
      setShowSaveModal(false);
      setResultSummary('');
    } catch (error) {
      console.error('Failed to save result:', error);
      trackEvent('save_tool_result_error', { tool_slug: slug });
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-light">
        <div className="container-max px-4 md:px-8 py-8">
          <div className="animate-pulse">
            <div className="mb-4 h-8 w-1/4 rounded bg-gray-200" />
            <div className="h-96 rounded bg-gray-200" />
          </div>
        </div>
      </main>
    );
  }

  if (!tool || !view) return null;

  return (
    <main className="min-h-screen bg-light" data-testid="tool-detail-page">
      <section className="border-b border-prestige-beige bg-white py-6">
        <div className="container-max px-4 md:px-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <Link
                to="/outils"
                className="rounded-full p-2 transition-colors hover:bg-light"
                data-testid="back-to-tools"
              >
                <ArrowLeft className="h-5 w-5 text-dark" />
              </Link>
              <div>
                <h1 className="font-heading text-2xl font-bold text-dark">{tool.name}</h1>
                <p className="text-sm text-prestige-taupe">{tool.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <>
                  <Link
                    to="/profil"
                    className="btn-secondary inline-flex items-center gap-2 text-sm"
                  >
                    <Clock className="h-4 w-4" />
                    Historique
                  </Link>
                  <Button
                    onClick={() => setShowSaveModal(true)}
                    className="btn-primary text-sm"
                    data-testid="save-result-btn"
                    disabled={!tool.id}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Sauvegarder
                  </Button>
                </>
              ) : (
                <Link
                  to="/connexion"
                  className="btn-secondary inline-flex items-center gap-2 text-sm"
                >
                  Se connecter pour sauvegarder
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-8">
        <div className="container-max px-4 md:px-8">
          <ToolShell
            fields={view.fields}
            values={formValues}
            onChange={handleChange}
            presentation={presentation}
          />

          <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <p>
                <strong>Note :</strong> Les résultats sont fournis à titre indicatif seulement
                et ne constituent pas un conseil personnalisé. Les rendements passés ne
                garantissent pas les rendements futurs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {showSaveModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="font-heading mb-2 text-lg font-semibold text-dark">
              Sauvegarder mes résultats
            </h3>
            <p className="mb-4 text-sm text-prestige-taupe">
              Ajoutez un court résumé pour retrouver cette simulation dans votre profil.
            </p>
            <Label htmlFor="summary">Résumé</Label>
            <Textarea
              id="summary"
              value={resultSummary}
              onChange={(e) => setResultSummary(e.target.value)}
              rows={4}
              className="mt-1"
              placeholder="Ex. Simulation REER — cotisation 10 000 $"
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                Annuler
              </Button>
              <Button onClick={handleSaveResult} className="btn-primary" disabled={saving}>
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};
