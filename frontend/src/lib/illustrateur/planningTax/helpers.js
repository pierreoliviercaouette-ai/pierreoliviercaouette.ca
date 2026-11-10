import { DEFAULT_TAX_RATES } from '../investmentPlanningService';

export function buildEntityMap(entities = []) {
  const map = {};
  for (const e of entities) {
    if (e?.id) map[e.id] = e;
  }
  return map;
}

export function getMarginalRate(entity, fallbackType = 'personnel') {
  const raw = parseFloat(entity?.marginalTaxRate);
  if (Number.isFinite(raw) && raw >= 0) return raw / 100;
  const t = entity?.type || fallbackType;
  return (DEFAULT_TAX_RATES[t] ?? DEFAULT_TAX_RATES.personnel) / 100;
}

export function getAssetAcb(asset) {
  const explicit = parseFloat(asset?.acb);
  if (Number.isFinite(explicit) && explicit >= 0) return explicit;
  const tracked = parseFloat(asset?._acb);
  if (Number.isFinite(tracked) && tracked >= 0) return tracked;
  return parseFloat(asset?.currentBalance) || 0;
}

export function ensureAssetAcb(asset) {
  if (asset._acb == null || !Number.isFinite(parseFloat(asset._acb))) {
    asset._acb = getAssetAcb(asset);
  }
  return asset._acb;
}
