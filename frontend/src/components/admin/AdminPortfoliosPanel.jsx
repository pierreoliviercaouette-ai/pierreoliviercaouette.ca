import { useCallback, useEffect, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';

export function AdminPortfoliosPanel({ onRefresh }) {
  const [modelPortfolios, setModelPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nameDrafts, setNameDrafts] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('model_portfolios')
      .select('id, key, name, ytd_2026, year_2025, annualized_3y, annualized_5y, display_order')
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
    setNameDrafts(
      portfolios.reduce((acc, portfolio) => {
        acc[portfolio.id] = portfolio.name || '';
        return acc;
      }, {})
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateModelPortfolio = async (portfolioId, field, value) => {
    try {
      const numericFields = ['ytd_2026', 'year_2025', 'annualized_3y', 'annualized_5y'];
      const parsed = Number(value);
      const updateValue = numericFields.includes(field) ? (Number.isNaN(parsed) ? 0 : parsed) : value;
      const { error } = await supabase
        .from('model_portfolios')
        .update({ [field]: updateValue })
        .eq('id', portfolioId);
      if (error) throw error;
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur mise a jour');
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
                    value={nameDrafts[portfolio.id] ?? ''}
                    disabled={false}
                    readOnly={false}
                    onChange={(e) =>
                      setNameDrafts((prev) => ({
                        ...prev,
                        [portfolio.id]: e.target.value,
                      }))
                    }
                    onBlur={(e) => updateModelPortfolio(portfolio.id, 'name', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Rendement AAJ (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={portfolio.ytd_2026}
                    onBlur={(e) => updateModelPortfolio(portfolio.id, 'ytd_2026', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Rendement annee precedente (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={portfolio.year_2025}
                    onBlur={(e) => updateModelPortfolio(portfolio.id, 'year_2025', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Rendement 3 ans annualise (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={portfolio.annualized_3y}
                    onBlur={(e) => updateModelPortfolio(portfolio.id, 'annualized_3y', e.target.value)}
                  />
                </div>

                <div>
                  <Label>Rendement 5 ans annualise (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    defaultValue={portfolio.annualized_5y}
                    onBlur={(e) => updateModelPortfolio(portfolio.id, 'annualized_5y', e.target.value)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
