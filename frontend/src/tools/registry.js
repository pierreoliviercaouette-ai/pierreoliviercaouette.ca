import { getCalculator } from '../utils/toolCalculators';
import { toolViews } from './views';

export function getToolView(slug) {
  return toolViews[slug] || null;
}

export function hasToolView(slug) {
  return Boolean(toolViews[slug]);
}

export function listToolSlugs() {
  return Object.keys(toolViews);
}

/**
 * Calcule résultats + présentation UI pour un slug.
 */
export function runTool(slug, values) {
  const view = getToolView(slug);
  const calculator = getCalculator(slug);
  if (!view || !calculator) {
    return { results: {}, presentation: { rows: [] } };
  }
  const results = calculator(values);
  const presentation = view.buildPresentation(results, values) || { rows: [] };
  return { results, presentation };
}

export { toolViews };
