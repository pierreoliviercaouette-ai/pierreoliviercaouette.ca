import { calculateAssuranceVie } from '../../utils/toolCalculators';

export function computeLifeNeeds(needs = {}) {
  return calculateAssuranceVie(needs);
}

export function computeDisabilityGap(needs = {}) {
  const revenu = parseFloat(needs.invalidite_revenu) || 0;
  const targetPct = (parseFloat(needs.invalidite_remplacement_pct) || 60) / 100;
  const collectivePct = (parseFloat(needs.invalidite_collective_pct) || 0) / 100;
  const cible = revenu * targetPct;
  const collective = revenu * collectivePct;
  const trou = Math.max(0, cible - collective);
  return {
    revenu_mensuel: revenu,
    cible_mensuelle: cible,
    collective_mensuelle: collective,
    trou_mensuel: trou,
    trou_annuel: trou * 12,
  };
}

export function computeCriticalIllnessGap(needs = {}) {
  const cible = parseFloat(needs.maladie_grave_cible) || 0;
  return {
    capital_cible: cible,
  };
}
