import { useCallback, useEffect, useMemo, useState } from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Upload, RefreshCw, PieChart } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '../../lib/supabaseClient';
import { IA_ALLOWED_FUND_FILENAME, parseFundFactsheetPdfFile } from '../../lib/fundSheetPdfImport';
import {
  persistManualFundCivilYear,
  persistManualFundYtd,
  recalculateAllModelPortfolios,
  upsertFundFromParsed,
} from '../../lib/portfolioRecalc';

export function AdminPortfoliosPanel({ onRefresh }) {
  const [funds, setFunds] = useState([]);
  const [definitions, setDefinitions] = useState([]);
  const [selectedDefKey, setSelectedDefKey] = useState('prudent');
  const [effectiveFrom, setEffectiveFrom] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [holdingRows, setHoldingRows] = useState([{ fund_id: '', weight_pct: '' }]);

  const [fundPdfBusy, setFundPdfBusy] = useState(false);
  const [fundPreview, setFundPreview] = useState(null);
  const [manualFundId, setManualFundId] = useState('');
  const [manualYtdPct, setManualYtdPct] = useState('');
  const [manualAsOfDate, setManualAsOfDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [manualPrevYear, setManualPrevYear] = useState(() => String(new Date().getFullYear() - 1));
  const [manualPrevYearPct, setManualPrevYearPct] = useState('');
  const [manualBusy, setManualBusy] = useState(false);
  const [recalcBusy, setRecalcBusy] = useState(false);

  const load = useCallback(async () => {
    const [fRes, dRes] = await Promise.all([
      supabase.from('funds').select('*').order('name', { ascending: true }),
      supabase.from('portfolio_definitions').select('*').order('display_order', { ascending: true }),
    ]);
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

  const saveManualFundYtd = async () => {
    if (!manualFundId) {
      toast.error('Choisissez un fonds.');
      return;
    }
    if (manualYtdPct === '' || Number.isNaN(Number(manualYtdPct))) {
      toast.error('Entrez un rendement AAJ valide.');
      return;
    }
    if (!manualAsOfDate) {
      toast.error('Choisissez une date AAJ.');
      return;
    }
    setManualBusy(true);
    try {
      await persistManualFundYtd(supabase, manualFundId, Number(manualYtdPct), manualAsOfDate);
      toast.success('AAJ manuel enregistre et portefeuilles recalcules.');
      await load();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erreur enregistrement AAJ manuel.');
    } finally {
      setManualBusy(false);
    }
  };

  const saveManualFundPrevYear = async () => {
    if (!manualFundId) {
      toast.error('Choisissez un fonds.');
      return;
    }
    if (!manualPrevYear || Number.isNaN(Number(manualPrevYear))) {
      toast.error('Entrez une annee valide.');
      return;
    }
    if (manualPrevYearPct === '' || Number.isNaN(Number(manualPrevYearPct))) {
      toast.error('Entrez un rendement annuel valide.');
      return;
    }
    setManualBusy(true);
    try {
      await persistManualFundCivilYear(
        supabase,
        manualFundId,
        Number(manualPrevYear),
        Number(manualPrevYearPct)
      );
      toast.success('Rendement annuel enregistre et portefeuilles recalcules.');
      await load();
      onRefresh?.();
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Erreur enregistrement rendement annuel.');
    } finally {
      setManualBusy(false);
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
        <p className="text-xs text-prestige-taupe mb-3">
          Fichiers autorises: <span className="font-semibold">ecof...pdf</span> (ex: {IA_ALLOWED_FUND_FILENAME})
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
                sectorCount: (fundPreview.sectorAllocation || []).length,
                geographicCount: (fundPreview.geographicAllocation || []).length,
              },
              null,
              2
            )}
          </pre>
        )}
      </div>

      <div className="p-4 bg-light rounded-xl border border-prestige-beige">
        <p className="text-sm font-medium text-dark mb-2">Saisie manuelle AAJ par fonds</p>
        <p className="text-xs text-prestige-taupe mb-3">
          Permet d entrer le rendement depuis le 1er janvier pour un fonds sans PDF.
        </p>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <Label>Fonds</Label>
            <select
              className="w-full mt-1 px-3 py-2 border border-prestige-beige rounded-lg bg-white"
              value={manualFundId}
              onChange={(e) => setManualFundId(e.target.value)}
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
            <Label>Date AAJ</Label>
            <Input type="date" value={manualAsOfDate} onChange={(e) => setManualAsOfDate(e.target.value)} />
          </div>
          <div>
            <Label>Rendement AAJ (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={manualYtdPct}
              onChange={(e) => setManualYtdPct(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3">
          <Button type="button" variant="outline" disabled={manualBusy} onClick={saveManualFundYtd}>
            {manualBusy ? 'Enregistrement...' : 'Enregistrer AAJ manuel'}
          </Button>
        </div>
      </div>

      <div className="p-4 bg-light rounded-xl border border-prestige-beige">
        <p className="text-sm font-medium text-dark mb-2">Saisie manuelle annee civile par fonds</p>
        <p className="text-xs text-prestige-taupe mb-3">
          Permet d entrer/modifier le rendement d une annee complete (ex: annee derniere).
        </p>
        <div className="grid md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2">
            <Label>Fonds</Label>
            <select
              className="w-full mt-1 px-3 py-2 border border-prestige-beige rounded-lg bg-white"
              value={manualFundId}
              onChange={(e) => setManualFundId(e.target.value)}
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
            <Label>Annee</Label>
            <Input
              type="number"
              min="2000"
              max="2100"
              value={manualPrevYear}
              onChange={(e) => setManualPrevYear(e.target.value)}
            />
          </div>
          <div>
            <Label>Rendement annuel (%)</Label>
            <Input
              type="number"
              step="0.01"
              value={manualPrevYearPct}
              onChange={(e) => setManualPrevYearPct(e.target.value)}
            />
          </div>
        </div>
        <div className="mt-3">
          <Button type="button" variant="outline" disabled={manualBusy} onClick={saveManualFundPrevYear}>
            {manualBusy ? 'Enregistrement...' : 'Enregistrer annee civile'}
          </Button>
        </div>
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
    </div>
  );
}
