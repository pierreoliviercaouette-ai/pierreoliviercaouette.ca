import {
  Briefcase,
  Building2,
  CandlestickChart,
  FileText,
  Heart,
  Home,
  Landmark,
  Layers,
  LifeBuoy,
  LineChart,
  PiggyBank,
  Scale,
  Shield,
  Snowflake,
  TrendingUp,
  Umbrella,
  Users,
  Wallet,
} from 'lucide-react';
import { AUDIENCE_PARTICULIER, AUDIENCE_PRIVE } from '../services';

const ICON_BY_ID = {
  celi: Wallet,
  'reer-ferr': PiggyBank,
  'fonds-pensions': Landmark,
  'non-enregistre': Scale,
  'fonds-urgence': LifeBuoy,
  reee: Users,
  celiapp: Home,
  'retraite-publique': Landmark,
  'decaissement-retraite': Layers,
  'actions-dividendes': TrendingUp,
  obligations: Landmark,
  'fonds-communs': Layers,
  fnb: CandlestickChart,
  'fonds-distincts': Shield,
  'cpg-pglm': LineChart,
  'assurance-vie-temporaire': Shield,
  'assurance-vie-permanente': Landmark,
  'assurance-maladie-grave': Heart,
  'assurance-invalidite': Umbrella,
  'assurance-collective': Shield,
  'succession-bases': FileText,
  'fiscalite-epargne-corpo': Scale,
  'protections-corpo': Briefcase,
  'convention-actionnaires': Briefcase,
  'gel-successoral': Snowflake,
  'vie-categorie-actif': Landmark,
  'mg-propriete-partagee': Heart,
  'pfi-participative': Building2,
};

const AUDIENCE_MAP = {
  particulier: AUDIENCE_PARTICULIER,
  prive: AUDIENCE_PRIVE,
};

/** Convertit un module agent → objet formation consommé par l’UI. */
export function assembleFormation(mod) {
  if (!mod?.id) throw new Error('Module Apprendre invalide: id manquant');
  return {
    id: mod.id,
    audiences: (mod.audiences || []).map((a) => AUDIENCE_MAP[a] || a),
    category: mod.category,
    icon: ICON_BY_ID[mod.id] || Shield,
    title: mod.title,
    subtitle: mod.subtitle,
    shortDescription: mod.shortDescription,
    readMinutes: mod.readMinutes,
    keyFacts: mod.keyFacts || [],
    sections: mod.sections || [],
    workedExample: mod.workedExample || null,
    timeline: mod.timeline || null,
    takeaways: mod.takeaways || [],
    quiz: mod.quiz || null,
    sources: mod.sources || [],
    relatedServiceIds: mod.relatedServiceIds || [],
    relatedFormationIds: mod.relatedFormationIds || [],
    seoTitle: mod.seoTitle,
    seoDescription: mod.seoDescription,
  };
}

export function assembleDiagrams(mods) {
  const diagrams = {};
  const exampleDiagrams = {};
  for (const mod of mods) {
    if (mod.diagram) diagrams[mod.id] = mod.diagram;
    if (mod.exampleDiagram) exampleDiagrams[mod.id] = mod.exampleDiagram;
  }
  return { diagrams, exampleDiagrams };
}
