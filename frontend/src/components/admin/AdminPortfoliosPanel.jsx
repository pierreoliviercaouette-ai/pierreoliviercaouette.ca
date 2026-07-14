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
import { applyFundFicheImports } from '../../lib/portfolioFicheImport';

export function AdminPortfoliosPanel({ onRefresh }) {
  const [modelPortfolios, setModelPortfolios] = useState([]);
  const [importLogs, setImportLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draftsById, setDraftsById] = useState({});
  const [savingById, setSavingById] = useState({});
  const [importing, setImporting] = useState(false);
  const [importingFiches, setImportingFiches] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const [ficheSummary, setFicheSummary] = useState(null);
  const fileInputRef = useRef(null);
  const ficheInputRef = useRef(null);

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
    setDraftsById(
      portfolios.reduce((acc, portfolio) => {
        acc[portfolio.id] = {
          name: portfolio.name || '',
        };
        return acc;
      }, {})
    );

    const { data: logs } = await supabase
      .from('portfolio_import_logs')
      .select('id, imported_at, filename, as_of_date, funds_updated, portfolios_updated, missing_codes, meta')
      .order('imported_at', { ascending: false })
      .limit(8);
    setImportLogs(logs || []);

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const updateModelPortfolio = async (portfolioId) => {
    const draft = draftsById[portfolioId];
    if (!draft) return;

    try {
      setSavingById((prev) => ({ ...prev, [portfolioId]: true }));
      const { error } = await supabase
        .from('model_portfolios')
        .update({
          name: draft.name,
        })
        .eq('id', portfolioId);
      if (error) throw error;
      toast.success('Titre sauvegarde');
      window.dispatchEvent(new Event('model-portfolios-updated'));
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur mise a jour');
    } finally {
      setSavingById((prev) => ({ ...prev, [portfolioId]: false }));
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
      const asOf = asOfDateFromFilename(file.name) || new Date().toISOString().slice(0, 10);
      const result = await applyPerformanceCsvImport(supabase, {
        funds,
        asOfDate: asOf,
        filename: file.name,
      });

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

  const handleFicheImport = async (event) => {
    const list = event.target.files;
    event.target.value = '';
    if (!list?.length) return;

    try {
      setImportingFiches(true);
      setFicheSummary(null);
      const files = Array.from(list);
      const result = await applyFundFicheImports(supabase, files);
      setFicheSummary(result);

      if (result.fundsUpdated > 0) {
        toast.success(
          `Fiches OK : ${result.fundsUpdated} fonds mis à jour (années civiles${
            result.results?.some((r) => r.pdfStored) ? ' + PDF' : ''
          })`
        );
        window.dispatchEvent(new Event('model-portfolios-updated'));
        await load();
        onRefresh?.();
      } else {
        const firstErr =
          result.results?.find((r) => !r.ok)?.error ||
          result.errors?.[0] ||
          'Aucune fiche importée';
        toast.error(firstErr);
      }
      if (result.fundsUpdated > 0 && result.errors?.length) {
        toast.message(`${result.errors.length} avertissement(s) — voir le résumé`);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Erreur import fiches PDF');
    } finally {
      setImportingFiches(false);
    }
  };

  if (loading) {
    return <p className="text-prestige-taupe">Chargement...</p>;
  }

  const asOfLabel = modelPortfolios[0]?.as_of_date || '—';

  return (
    <div className="space-y-4">
      <h3 className="font-heading text-xl font-semibold text-dark">Portefeuilles modeles</h3>

      <div className="p-4 bg-white rounded-xl border border-primary/20 space-y-3">
        <div>
          <p className="font-semibold text-dark">Importer performances (CSV iA)</p>
          <p className="text-xs text-prestige-taupe mt-1">
            Source unique de l&apos;affichage et de la date de référence : le nom du fichier CSV
            (ex. performance-fonds-2026_07_13…). La date n&apos;est plus modifiable manuellement,
            pour éviter un décalage avec les rendements.
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
            disabled={importing || importingFiches}
            data-testid="admin-import-performance-csv"
          >
            {importing ? 'Import en cours…' : 'Choisir un fichier CSV'}
          </Button>
          <p className="text-xs text-prestige-taupe">
            Date de référence actuelle : <span className="font-medium text-dark">{asOfLabel}</span>
          </p>
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

      <div className="p-4 bg-white rounded-xl border border-primary/20 space-y-3">
        <div>
          <p className="font-semibold text-dark">Importer fiches de fonds (PDF)</p>
          <p className="text-xs text-prestige-taupe mt-1">
            Extrait les rendements par année civile (Série Classique 75/75) pour la courbe de
            croissance, et dépose le PDF à jour pour le téléchargement public. Conservez le
            nom iA{' '}
            <span className="font-medium text-dark">Ecof-FUxxx.pdf</span> (ex. Ecof-FU021.pdf,
            Ecof-FU505p.pdf). Plusieurs fiches à la fois possibles.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={ficheInputRef}
            type="file"
            accept="application/pdf,.pdf"
            multiple
            className="hidden"
            onChange={handleFicheImport}
          />
          <Button
            type="button"
            onClick={() => ficheInputRef.current?.click()}
            disabled={importing || importingFiches}
            data-testid="admin-import-fund-fiches"
          >
            {importingFiches ? 'Analyse des PDF…' : 'Choisir des fiches PDF'}
          </Button>
        </div>
        {ficheSummary && (
          <div className="text-sm text-prestige-taupe space-y-1 border-t border-prestige-beige pt-3">
            <p>
              {ficheSummary.fundsUpdated} fonds maj · {ficheSummary.portfoliosUpdated}{' '}
              courbes recalculées
            </p>
            <ul className="list-disc pl-5 text-xs max-h-40 overflow-y-auto">
              {ficheSummary.results?.map((r) => (
                <li key={`${r.filename}-${r.fuCode || 'x'}`}>
                  {r.ok ? (
                    <>
                      <span className="font-medium text-dark">{r.fuCode}</span>
                      {' · '}
                      {r.yearCount} années
                      {r.years?.length ? ` (${r.years[0]}–${r.years[r.years.length - 1]})` : ''}
                      {r.pdfStored === false ? ' · PDF non stocké (bucket?)' : ''}
                    </>
                  ) : (
                    <span className="text-amber-700">
                      {r.filename}: {r.error}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {ficheSummary.errors?.length > 0 && (
              <ul className="list-disc pl-5 text-xs text-amber-700">
                {ficheSummary.errors.slice(0, 6).map((w) => (
                  <li key={w}>{w}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {importLogs.length > 0 && (
        <div className="p-4 bg-light rounded-xl border border-prestige-beige">
          <p className="font-semibold text-dark text-sm mb-2">Journal des imports récents</p>
          <ul className="space-y-1 text-xs text-prestige-taupe">
            {importLogs.map((log) => (
              <li key={log.id} className="flex flex-wrap gap-x-2">
                <span className="font-medium text-dark">
                  {log.imported_at
                    ? new Date(log.imported_at).toLocaleString('fr-CA')
                    : '—'}
                </span>
                <span>{log.meta?.source === 'fiche_pdf_import' ? 'fiches PDF' : log.filename || 'fichier'}</span>
                <span>as of {log.as_of_date || '—'}</span>
                <span>
                  {log.funds_updated ?? 0} fonds / {log.portfolios_updated ?? 0} portefeuilles
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {modelPortfolios.length === 0 ? (
        <p className="text-prestige-taupe text-center py-8">Aucun portefeuille trouve</p>
      ) : (
        <div className="space-y-3">
          {modelPortfolios.map((portfolio) => (
            <div key={portfolio.id} className="p-4 bg-light rounded-xl border border-prestige-beige">
              <div className="grid md:grid-cols-[1.2fr_repeat(4,minmax(0,1fr))_auto] gap-3 items-end">
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
                  <Label>AAJ (sync)</Label>
                  <Input type="text" readOnly value={portfolio.ytd_2026 ?? '—'} className="bg-white/60" />
                </div>
                <div>
                  <Label>Année préc. (sync)</Label>
                  <Input type="text" readOnly value={portfolio.year_2025 ?? '—'} className="bg-white/60" />
                </div>
                <div>
                  <Label>3 ans (sync)</Label>
                  <Input
                    type="text"
                    readOnly
                    value={portfolio.annualized_3y ?? '—'}
                    className="bg-white/60"
                  />
                </div>
                <div>
                  <Label>5 ans (sync)</Label>
                  <Input
                    type="text"
                    readOnly
                    value={portfolio.annualized_5y ?? '—'}
                    className="bg-white/60"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => updateModelPortfolio(portfolio.id)}
                  disabled={Boolean(savingById[portfolio.id])}
                >
                  {savingById[portfolio.id] ? '…' : 'Sauver titre'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
