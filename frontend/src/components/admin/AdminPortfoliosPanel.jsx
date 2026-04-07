import { useCallback, useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

export function AdminPortfoliosPanel({ onRefresh }) {
  const [modelPortfolios, setModelPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftsById, setDraftsById] = useState({});
  const [savingById, setSavingById] = useState({});
  const [asOfDate, setAsOfDate] = useState('');
  const [savingAsOfDate, setSavingAsOfDate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('model_portfolios')
      .select('id, key, name, ytd_2026, year_2025, annualized_3y, annualized_5y, as_of_date, display_order')
      .order('display_order', { ascending: true });

    if (error) {
      console.error(error);
      toast.error(error.message || 'Erreur chargement portefeuilles');
      setModelPortfolios([]);
      setLoading(false);
      return;
    }

    const portfolios = data || [];
    setModelPortfolios(portfolios);
    setAsOfDate(portfolios[0]?.as_of_date || '');
    setDraftsById(
      portfolios.reduce((acc, portfolio) => {
        acc[portfolio.id] = {
          name: portfolio.name || '',
          ytd_2026: portfolio.ytd_2026 ?? 0,
          year_2025: portfolio.year_2025 ?? 0,
          annualized_3y: portfolio.annualized_3y ?? 0,
          annualized_5y: portfolio.annualized_5y ?? 0,
        };
        return acc;
      }, {})
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toNumericOrZero = (value) => {
    const parsed = Number(value);
    return Number.isNaN(parsed) ? 0 : parsed;
  };

  const updateModelPortfolio = async (portfolioId) => {
    const draft = draftsById[portfolioId];
    if (!draft) return;

    try {
      setSavingById((prev) => ({ ...prev, [portfolioId]: true }));
      const { error } = await supabase
        .from('model_portfolios')
        .update({
          name: draft.name,
          ytd_2026: toNumericOrZero(draft.ytd_2026),
          year_2025: toNumericOrZero(draft.year_2025),
          annualized_3y: toNumericOrZero(draft.annualized_3y),
          annualized_5y: toNumericOrZero(draft.annualized_5y),
        })
        .eq('id', portfolioId);
      if (error) throw error;
      toast.success('Portefeuille sauvegarde');
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur mise a jour');
    } finally {
      setSavingById((prev) => ({ ...prev, [portfolioId]: false }));
    }
  };

  const updateAsOfDateForAll = async () => {
    if (!asOfDate) {
      toast.error('Selectionnez une date');
      return;
    }
    if (!modelPortfolios.length) return;

    try {
      setSavingAsOfDate(true);
      const ids = modelPortfolios.map((portfolio) => portfolio.id);
      const { error } = await supabase
        .from('model_portfolios')
        .update({ as_of_date: asOfDate })
        .in('id', ids);
      if (error) throw error;
      toast.success('Date de mise a jour appliquee a tous les portefeuilles');
      await load();
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur mise a jour date');
    } finally {
      setSavingAsOfDate(false);
    }
  };

  if (loading) {
    return <p className="text-prestige-taupe">Chargement...</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-dark">
        Portefeuilles modeles (saisie manuelle)
      </h3>

      <p className="text-xs text-prestige-taupe">
        Entrez manuellement les rendements AAJ, annee precedente, 3 ans annualise et 5 ans annualise pour chaque profil.
      </p>

      <div className="p-4 bg-light rounded-xl border border-prestige-beige">
        <div className="grid sm:grid-cols-[1fr_auto] gap-3 items-end">
          <div>
            <Label>Date de la derniere mise a jour des rendements</Label>
            <Input type="date" value={asOfDate} onChange={(e) => setAsOfDate(e.target.value)} />
          </div>
          <Button type="button" onClick={updateAsOfDateForAll} disabled={savingAsOfDate || !asOfDate}>
            {savingAsOfDate ? 'Sauvegarde...' : 'Appliquer a tous les portefeuilles'}
          </Button>
        </div>
      </div>

      {modelPortfolios.length === 0 ? (
        <p className="text-prestige-taupe text-center py-8">Aucun portefeuille trouve</p>
      ) : (
        <div className="space-y-3">
          {modelPortfolios.map((portfolio) => (
            <div key={portfolio.id} className="p-4 bg-light rounded-xl border border-prestige-beige">
              <div className="grid md:grid-cols-5 gap-3 items-end">
                <div>
                  <Label>Titre du portefeuille</Label>
                  <Input
                    value={draftsById[portfolio.id]?.name ?? ''}
                    onChange={(e) =>
                      setDraftsById((prev) => ({
                        ...prev,
                        [portfolio.id]: {
                          ...(prev[portfolio.id] || {}),
                          name: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Rendement AAJ (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={draftsById[portfolio.id]?.ytd_2026 ?? 0}
                    onChange={(e) =>
                      setDraftsById((prev) => ({
                        ...prev,
                        [portfolio.id]: {
                          ...(prev[portfolio.id] || {}),
                          ytd_2026: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Rendement annee precedente (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={draftsById[portfolio.id]?.year_2025 ?? 0}
                    onChange={(e) =>
                      setDraftsById((prev) => ({
                        ...prev,
                        [portfolio.id]: {
                          ...(prev[portfolio.id] || {}),
                          year_2025: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Rendement 3 ans annualise (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={draftsById[portfolio.id]?.annualized_3y ?? 0}
                    onChange={(e) =>
                      setDraftsById((prev) => ({
                        ...prev,
                        [portfolio.id]: {
                          ...(prev[portfolio.id] || {}),
                          annualized_3y: e.target.value,
                        },
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Rendement 5 ans annualise (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={draftsById[portfolio.id]?.annualized_5y ?? 0}
                    onChange={(e) =>
                      setDraftsById((prev) => ({
                        ...prev,
                        [portfolio.id]: {
                          ...(prev[portfolio.id] || {}),
                          annualized_5y: e.target.value,
                        },
                      }))
                    }
                  />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={() => updateModelPortfolio(portfolio.id)}
                  disabled={Boolean(savingById[portfolio.id])}
                >
                  {savingById[portfolio.id] ? 'Sauvegarde...' : 'Sauvegarder'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
