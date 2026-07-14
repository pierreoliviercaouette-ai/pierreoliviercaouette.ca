import { useCallback, useEffect, useRef, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import {
  applyPerformanceCsvImport,
  asOfDateFromFilename,
  parsePerformanceFundsCsv,
} from '../../lib/portfolioCsvImport';

export function AdminPortfoliosPanel({ onRefresh }) {
  const [modelPortfolios, setModelPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftsById, setDraftsById] = useState({});
  const [savingById, setSavingById] = useState({});
  const [asOfDate, setAsOfDate] = useState('');
  const [savingAsOfDate, setSavingAsOfDate] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const fileInputRef = useRef(null);

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
      window.dispatchEvent(new Event('model-portfolios-updated'));
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
      window.dispatchEvent(new Event('model-portfolios-updated'));
      await load();
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur mise a jour date');
    } finally {
      setSavingAsOfDate(false);
    }
  };

  const handleCsvImport = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    try {
      setImporting(true);
      setImportSummary(null);
      const text = await file.text();
      const { funds, warnings } = parsePerformanceFundsCsv(text);
      const asOf = asOfDateFromFilename(file.name) || asOfDate || new Date().toISOString().slice(0, 10);
      const result = await applyPerformanceCsvImport(supabase, { funds, asOfDate: asOf });

      setImportSummary({
        filename: file.name,
        asOf,
        fundsParsed: funds.length,
        fundsUpdated: result.fundsUpdated,
        portfoliosUpdated: result.portfoliosUpdated,
        portfolios: result.portfolios,
        missingCodes: result.missingCodes,
        warnings: [...warnings, ...result.fundErrors, ...result.portfolioErrors],
      });

      if (result.portfoliosUpdated > 0) {
        toast.success(
          `Import OK : ${result.fundsUpdated} fonds, ${result.portfoliosUpdated} portefeuilles recalculés`
        );
        window.dispatchEvent(new Event('model-portfolios-updated'));
        setAsOfDate(asOf);
        await load();
        onRefresh?.();
      } else {
        toast.error('Import terminé sans mise à jour de portefeuille');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Erreur import CSV');
    } finally {
      setImporting(false);
    }
  };

  if (loading) {
    return <p className="text-prestige-taupe">Chargement...</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-dark">Portefeuilles modeles</h3>

      <div className="p-4 bg-white rounded-xl border border-primary/20 space-y-3">
        <div>
          <p className="font-semibold text-dark">Importer performances (CSV iA)</p>
          <p className="text-xs text-prestige-taupe mt-1">
            Déposez un fichier <code className="text-xs">performance-fonds-….csv</code>. Les
            rendements des fonds sont enregistrés, puis les 5 portefeuilles sont recalculés en
            pondération (AAJ, année précédente, 3 ans, 5 ans).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={handleCsvImport}
          />
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            data-testid="admin-import-performance-csv"
          >
            {importing ? 'Import en cours…' : 'Choisir un fichier CSV'}
          </Button>
        </div>
        {importSummary && (
          <div className="text-sm text-prestige-taupe space-y-1 border-t border-prestige-beige pt-3">
            <p>
              <span className="font-medium text-dark">{importSummary.filename}</span>
              {' · '}données au {importSummary.asOf}
            </p>
            <p>
              {importSummary.fundsParsed} fonds lus · {importSummary.fundsUpdated} fonds maj ·{' '}
              {importSummary.portfoliosUpdated} portefeuilles maj
            </p>
            {importSummary.missingCodes?.length > 0 && (
              <p className="text-amber-700">
                Codes sans rendement dans le CSV (exclus du pondéré) :{' '}
                {importSummary.missingCodes.join(', ')}
              </p>
            )}
            {importSummary.warnings?.length > 0 && (
              <ul className="list-disc pl-5 text-xs">
                {importSummary.warnings.slice(0, 8).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <p className="text-xs text-prestige-taupe">
        Secours : saisie manuelle des rendements AAJ, année précédente, 3 ans et 5 ans annualisés.
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
