import { ComparateurRendementsTool } from './ComparateurRendementsTool';
import { CeliappTool } from './CeliappTool';
import { HypothequeVieTool } from './HypothequeVieTool';
import { InvaliditeTool } from './InvaliditeTool';
import { RetraiteReerCeliTool } from './RetraiteReerCeliTool';
import { MaladieGraveTool } from './MaladieGraveTool';
import { ReeeTool } from './ReeeTool';
import { FondsUrgenceTool } from './FondsUrgenceTool';
import { CeliDroitsTool } from './CeliDroitsTool';
import { TropJeuneTool } from './TropJeuneTool';
import { CollectiveChecklistTool } from './CollectiveChecklistTool';
import { AutonomeChecklistTool } from './AutonomeChecklistTool';
import { PlanGlobalTool } from './PlanGlobalTool';
import { SuccessionChecklistTool } from './SuccessionChecklistTool';

/**
 * Mini-outils interactifs des landings /campagnes/:slug
 */
export const campagneAdsTools = {
  'comparateur-rendements': ComparateurRendementsTool,
  celiapp: CeliappTool,
  'hypotheque-assurance-vie': HypothequeVieTool,
  'assurance-invalidite': InvaliditeTool,
  'retraite-reer-celi': RetraiteReerCeliTool,
  'maladie-grave': MaladieGraveTool,
  reee: ReeeTool,
  'fonds-urgence': FondsUrgenceTool,
  'celi-droits': CeliDroitsTool,
  'trop-jeune-assurance': TropJeuneTool,
  'assurance-collective': CollectiveChecklistTool,
  'travailleur-autonome': AutonomeChecklistTool,
  'plan-global': PlanGlobalTool,
  'succession-bases': SuccessionChecklistTool,
};

export function getCampagneAdsTool(slug) {
  return campagneAdsTools[slug] || null;
}
