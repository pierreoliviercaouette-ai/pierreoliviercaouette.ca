import { useEffect, useState } from 'react';
import { DEFAULT_MODEL_PORTFOLIOS_AS_OF } from '../data/modelPortfolios';
import { formatIsoDateLabelFr } from '../lib/portfolioCompliance';
import {
  getAllIaPctByProfil,
  setLiveModelPortfolioReturns,
} from '../lib/modelPortfolioReturns';
import {
  buildWeightedPortfolioCards,
  loadPortfolioFundPerfMap,
} from '../lib/portfolioFundPerf';
import { supabase } from '../lib/supabaseClient';

/**
 * Charge les rendements pondérés iA (même source que /portefeuilles) et alimente le cache global.
 */
export function useModelPortfolioReturns() {
  const [ready, setReady] = useState(false);
  const [asOfLabel, setAsOfLabel] = useState(DEFAULT_MODEL_PORTFOLIOS_AS_OF);
  const [returnsByProfil, setReturnsByProfil] = useState(() => getAllIaPctByProfil());

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const { perfByCode, asOfIso, modelPortfolioRows } = await loadPortfolioFundPerfMap(supabase);
      const cards = buildWeightedPortfolioCards(perfByCode, modelPortfolioRows);
      const label = asOfIso
        ? formatIsoDateLabelFr(asOfIso) || asOfIso
        : DEFAULT_MODEL_PORTFOLIOS_AS_OF;

      if (cancelled) return;

      setLiveModelPortfolioReturns(cards, label);
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
