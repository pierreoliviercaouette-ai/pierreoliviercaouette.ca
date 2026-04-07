import { useCallback, useEffect, useMemo, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Upload, RefreshCw, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { parseFundFactsheetPdfFile } from '../../lib/fundSheetPdfImport';
import { recalculateAllModelPortfolios, upsertFundFromParsed } from '../../lib/portfolioRecalc';

export function AdminPortfoliosPanel({ onRefresh }) {
  const [modelPortfolios, setModelPortfolios] = useState([]);
  const [portfolioAsOfDate, setPortfolioAsOfDate] = useState('');
  const [portfolioPdfImporting, setPortfolioPdfImporting] = useState(false);

  const [funds, setFunds] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [selectedDefKey, setSelectedDefKey] = useState('prudent');
  const [effectiveFrom, setEffectiveFrom] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [holdingRows, setHoldingRows] = useState([{ fund_id: '', weight_pct: '' }]);

  const [fundPdfBusy, setFundPdfBusy] = useState(false);
  const [fundPreview, setFundPreview] = useState(null);
  const [recalcBusy, setRecalcBusy] = useState(false);

  const load = useCallback(async () => {
    const [mpRes, fRes, dRes] = await Promise.all([
      supabase.from('model_portfolios').select('*').order('display_order', { ascending: true }),
      supabase.from('funds').select('*').order('name', { ascending: true }),
      supabase.from('portfolio_definitions').select('*').order('display_order', { ascending: true }),
    ]);
    if (mpRes.error) console.warn(mpRes.error);
    else {
      const list = mpRes.data || [];
      setModelPortfolios(list);
      setPortfolioAsOfDate(list[0]?.as_of_date || '');
    }
    if (fRes.error) console.warn(fRes.error);
    else setFunds(fRes.data || []);
    if (dRes.error) console.warn(dRes.error);
    else setDefinitions(dRes.data || []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const selectedDef = useMemo(
    () => definitions.find((d) => d.key === selectedDefKey),
    [definitions, selectedDefKey]
  );

  const loadHoldingsForDef = useCallback(
    async (defId) => {
      if (!defId) return;
      const { data: effRows } = await supabase
        .from('portfolio_holdings')
        .select('effective_from')
        .eq('portfolio_definition_id', defId)
        .order('effective_from', { ascending: false })
        .limit(1);
      const eff = effRows?.[0]?.effective_from;
      if (!eff) {
        setHoldingRows([{ fund_id: '', weight_pct: '' }]);
        setEffectiveFrom(new Date().toISOString().slice(0, 10));
        return;
      }
      setEffectiveFrom(eff);
      const { data: holds } = await supabase
        .from('portfolio_holdings')
        .select('fund_id, weight_pct, sort_order')
        .eq('portfolio_definition_id', defId)
        .eq('effective_from', eff)
        .order('sort_order', { ascending: true });
      if (holds?.length) {
        setHoldingRows(
          holds.map((h) => ({
            fund_id: h.fund_id,
            weight_pct: String(h.weight_pct),
          }))
        );
      } else {
        setHoldingRows([{ fund_id: '', weight_pct: '' }]);
      }
    },
    []
  );

  useEffect(() => {
    if (selectedDef?.id) loadHoldingsForDef(selectedDef.id);
  }, [selectedDef?.id, loadHoldingsForDef]);

  const updateModelPortfolio = async (portfolioId, field, value) => {
    try {
      const updateValue =
        field === 'ytd_2026' || field === 'year_2025' ? Number(value || 0) : value;
      const { error } = await supabase
        .from('model_portfolios')
        .update({ [field]: updateValue })
        .eq('id', portfolioId);
      if (error) throw error;
      load();
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur');
    }
  };

  const savePortfolioAsOfDate = async () => {
    try {
      const { error } = await supabase
        .from('model_portfolios')
        .update({ as_of_date: portfolioAsOfDate })
        .neq('id', '00000000-0000-0000-0000-000000000000');
      if (error) throw error;
      toast.success('Date mise a jour');
      load();
      onRefresh?.();
    } catch (error) {
      toast.error(error.message || 'Erreur');
    }
  };

  const handleMorningstarPdfImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Veuillez choisir un fichier PDF.');
      event.target.value = '';
      return;
    }
    setPortfolioPdfImporting(true);
    try {
      const { extractTextFromPdfFile, parseMorningstarPortfolioPdf } = await import(
        '../../lib/morningstarPdfImport'
      );
      const text = await extractTextFromPdfFile(file);
      const parsed = parseMorningstarPortfolioPdf(text);
      const patch = {
        ytd_2026: parsed.ytd_2026,
        year_2025: parsed.year_2025,
      };
      if (parsed.asOfDate) {
        patch.as_of_date = parsed.asOfDate;
      }
      const { error } = await supabase.from('model_portfolios').update(patch).eq('key', parsed.key);
      if (error) throw error;
      toast.success(
        `Import reussi: ${parsed.key} — YTD ${parsed.ytd_2026.toFixed(2)} %, annee ${parsed.annualSourceYear} ${parsed.year_2025.toFixed(2)} %`
      );
      load();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Impossible d importer ce PDF.');
    } finally {
      setPortfolioPdfImporting(false);
      event.target.value = '';
    }
  };

  const handleFundPdf = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFundPdfBusy(true);
    setFundPreview(null);
    try {
      const parsed = await parseFundFactsheetPdfFile(file);
      setFundPreview(parsed);
      toast.message('Apercu pret — confirmez pour enregistrer.');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'PDF fonds illisible.');
    } finally {
      setFundPdfBusy(false);
      e.target.value = '';
    }
  };

  const confirmFundImport = async () => {
    if (!fundPreview) return;
    setFundPdfBusy(true);
    try {
      await upsertFundFromParsed(supabase, fundPreview);
      toast.success('Fonds enregistre et portefeuilles recalcules.');
      setFundPreview(null);
      await load();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erreur enregistrement.');
    } finally {
      setFundPdfBusy(false);
    }
  };

  const weightTotal = useMemo(() => {
    return holdingRows.reduce((s, r) => s + (parseFloat(r.weight_pct) || 0), 0);
  }, [holdingRows]);

  const saveHoldings = async () => {
    if (!selectedDef?.id) return;
    if (Math.abs(weightTotal - 100) > 0.02) {
      toast.error('La somme des ponderations doit etre 100 %. ');
      return;
    }
    const cleaned = holdingRows
      .filter((r) => r.fund_id && r.weight_pct !== '')
      .map((r, i) => ({
        portfolio_definition_id: selectedDef.id,
        fund_id: r.fund_id,
        weight_pct: Number(r.weight_pct),
        sort_order: i,
        effective_from: effectiveFrom,
      }));
    if (!cleaned.length) {
      toast.error('Ajoutez au moins une ligne de fonds.');
      return;
    }
    try {
      const { error: delErr } = await supabase
        .from('portfolio_holdings')
        .delete()
        .eq('portfolio_definition_id', selectedDef.id)
        .eq('effective_from', effectiveFrom);
      if (delErr) throw delErr;
      const { error: insErr } = await supabase.from('portfolio_holdings').insert(cleaned);
      if (insErr) throw insErr;
      toast.success('Composition enregistree.');
      await recalculateAllModelPortfolios(supabase);
      toast.success('Recalcul termine.');
      await load();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erreur sauvegarde.');
    }
  };

  const runRecalc = async () => {
    setRecalcBusy(true);
    try {
      const res = await recalculateAllModelPortfolios(supabase);
      toast.success(`Recalcul: ${res.count} portefeuille(s).`);
      await load();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erreur recalcul.');
    } finally {
      setRecalcBusy(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <h3 className="font-heading text-xl font-semibold text-dark">
          Portefeuilles modeles (moteur fonds)
        </h3>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
          disabled={recalcBusy}
          onClick={runRecalc}
        >
          <RefreshCw className={`w-4 h-4 ${recalcBusy ? 'animate-spin' : ''}`} />
          Recalculer tout
        </Button>
      </div>

      <div className="p-4 bg-light rounded-xl border border-prestige-beige">
        <p className="text-sm font-medium text-dark mb-2 flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Import PDF fiche de fonds
        </p>
        <p className="text-xs text-prestige-taupe mb-3">
          Extraction « Rend année civile » + AAJ. Les rendements mensuels sont reconstruits (geometrique) puis les
          portefeuilles sont recalcules.
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <input
            id="fund-pdf-import"
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            disabled={fundPdfBusy}
            onChange={handleFundPdf}
          />
          <Button
            type="button"
            variant="outline"
            disabled={fundPdfBusy}
            onClick={() => document.getElementById('fund-pdf-import')?.click()}
          >
            {fundPdfBusy ? 'Lecture...' : 'Choisir un PDF fonds'}
          </Button>
          {fundPreview && (
            <Button type="button" className="btn-primary" disabled={fundPdfBusy} onClick={confirmFundImport}>
              Confirmer import
            </Button>
          )}
        </div>
        {fundPreview && (
          <pre className="mt-3 text-xs bg-white p-3 rounded border overflow-auto max-h-48">
            {JSON.stringify(
              {
                fundName: fundPreview.fundName,
                externalCode: fundPreview.externalCode,
                ytdPct: fundPreview.ytdPct,
                asOfDate: fundPreview.asOfDate,
                years: Object.keys(fundPreview.annualByYear || {}).length,
              },
              null,
              2
            )}
          </pre>
        )}
      </div>

      <div className="p-4 bg-light rounded-xl border border-prestige-beige">
        <p className="text-sm font-medium text-dark mb-2 flex items-center gap-2">
          <PieChart className="w-4 h-4" />
          Composition par portefeuille
        </p>
        <div className="grid md:grid-cols-3 gap-3 mb-3">
          <div>
            <Label>Profil</Label>
            <select
              className="w-full mt-1 px-3 py-2 border border-prestige-beige rounded-lg bg-white"
              value={selectedDefKey}
              onChange={(e) => setSelectedDefKey(e.target.value)}
            >
              {definitions.map((d) => (
                <option key={d.id} value={d.key}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <Label>Date d effet</Label>
            <Input type="date" value={effectiveFrom} onChange={(e) => setEffectiveFrom(e.target.value)} />
          </div>
          <div className="flex items-end">
            <p className="text-sm">
              Total:{' '}
              <span className={Math.abs(weightTotal - 100) > 0.02 ? 'text-red-600 font-semibold' : 'text-green-700'}>
                {weightTotal.toFixed(2)} %
              </span>
            </p>
          </div>
        </div>
        <div className="space-y-2">
          {holdingRows.map((row, idx) => (
            <div key={idx} className="grid md:grid-cols-2 gap-2 items-end">
              <div>
                {idx === 0 && <Label>Fonds</Label>}
                <select
                  className="w-full mt-1 px-3 py-2 border border-prestige-beige rounded-lg bg-white"
                  value={row.fund_id}
                  onChange={(e) => {
                    const next = [...holdingRows];
                    next[idx] = { ...next[idx], fund_id: e.target.value };
                    setHoldingRows(next);
                  }}
                >
                  <option value="">— Choisir —</option>
                  {funds.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                      {f.external_code ? ` (${f.external_code})` : ''}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                {idx === 0 && <Label>Poids %</Label>}
                <Input
                  type="number"
                  step="0.01"
                  value={row.weight_pct}
                  onChange={(e) => {
                    const next = [...holdingRows];
                    next[idx] = { ...next[idx], weight_pct: e.target.value };
                    setHoldingRows(next);
                  }}
                />
              </div>
            </div>
          ))}
          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setHoldingRows([...holdingRows, { fund_id: '', weight_pct: '' }])}
            >
              Ajouter une ligne
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={saveHoldings}>
              Enregistrer composition
            </Button>
          </div>
        </div>
      </div>

      <div className="border-t border-prestige-beige pt-6">
        <h4 className="font-heading font-semibold text-dark mb-4">Saisie manuelle + PDF portefeuille (legacy)</h4>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-end gap-2">
            <div>
              <Label htmlFor="portfolio-as-of-date">Donnees au</Label>
              <Input
                id="portfolio-as-of-date"
                type="date"
                value={portfolioAsOfDate}
                onChange={(e) => setPortfolioAsOfDate(e.target.value)}
                className="w-[180px]"
              />
            </div>
            <Button onClick={savePortfolioAsOfDate} className="btn-primary">
              Enregistrer
            </Button>
          </div>
        </div>

        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200">
          <p className="text-sm font-medium text-dark mb-2">Import PDF rapport de portefeuille (Morningstar / iA)</p>
          <p className="text-xs text-prestige-taupe mb-3">
            Met a jour directement la table legacy `model_portfolios` pour un profil detecte.
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <input
              id="portfolio-pdf-import"
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              disabled={portfolioPdfImporting}
              onChange={handleMorningstarPdfImport}
            />
            <Button
              type="button"
              variant="outline"
              className="gap-2"
              disabled={portfolioPdfImporting}
              onClick={() => document.getElementById('portfolio-pdf-import')?.click()}
            >
              <Upload className="w-4 h-4" />
              {portfolioPdfImporting ? 'Import en cours...' : 'Importer un PDF portefeuille'}
            </Button>
          </div>
        </div>

        {modelPortfolios.length === 0 ? (
          <p className="text-prestige-taupe text-center py-8">Aucun portefeuille trouve</p>
        ) : (
          <div className="space-y-3">
            {modelPortfolios.map((portfolio) => (
              <div key={portfolio.id} className="p-4 bg-light rounded-xl">
                <div className="grid md:grid-cols-4 gap-3 items-end">
                  <div>
                    <Label>Profil</Label>
                    <Input value={portfolio.name} disabled />
                  </div>
                  <div>
                    <Label>Rendement 2026 (YTD)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue={portfolio.ytd_2026}
                      onBlur={(e) => updateModelPortfolio(portfolio.id, 'ytd_2026', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Derniere annee civile (affichage)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      defaultValue={portfolio.year_2025}
                      onBlur={(e) => updateModelPortfolio(portfolio.id, 'year_2025', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Lien detail</Label>
                    <Input
                      defaultValue={portfolio.href}
                      onBlur={(e) => updateModelPortfolio(portfolio.id, 'href', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
