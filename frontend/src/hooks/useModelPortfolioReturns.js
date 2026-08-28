import { useEffect, useState } from 'react';
import { DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../data/modelPortfolios';
import { formatIsoDateLabelFr } from '../lib/portfolioCompliance';
import {
  getAllIaPctByProfil,
  setLiveFromModelPortfolioRows,
} from '../lib/modelPortfolioReturns';
import { loadModelPortfolioKpiRows } from '../lib/portfolioFundPerf';
import { supabase } from '../lib/supabaseClient';

/**
 * Charge les KPI sync model_portfolios (même source que l’admin) pour comparateur / jemcee.
 */
export function useModelPortfolioReturns() {
  const [ready, setReady] = useState(false);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [returnsByProfil, setReturnsByProfil] = useState(() => getAllIaPctByProfil());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { rows, asOfIso } = await loadModelPortfolioKpiRows(supabase);
      const label = asOfIso
        ? formatIsoDateLabelFr(asOfIso) || asOfIso
        : DEFAULT_MODEL_PORTFOLIOS_AS_OF;

      if (cancelled) return;

      if (rows.length) {
        setLiveFromModelPortfolioRows(rows, label);
      }

      setReturnsByProfil(getAllIaPctByProfil());
      setAsOfLabel(label);
      setReady(true);
    };

    load();

    const onUpdate = () => {
      load();
    };
    window.addEventListener('model-portfolios-updated', onUpdate);
    return () => {
      cancelled = true;
      window.removeEventListener('model-portfolios-updated', onUpdate);
    };
  }, []);

  const getIaPct = (profil) => returnsByProfil[profil] ?? getAllIaPctByProfil()[profil];

  return { ready, asOfLabel, returnsByProfil, getIaPct };
}
