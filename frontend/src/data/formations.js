import { PiggyBank, Shield, Building2, CandlestickChart } from 'lucide-react';
import { AUDIENCE_PRIVE } from './services';
import { assembleFormation } from './apprendre/assemble';

import { module as celi } from './apprendre/modules/celi';
import { module as reerFerr } from './apprendre/modules/reer-ferr';
import { module as fondsPensions } from './apprendre/modules/fonds-pensions';
import { module as nonEnregistre } from './apprendre/modules/non-enregistre';
import { module as fondsUrgence } from './apprendre/modules/fonds-urgence';
import { module as reee } from './apprendre/modules/reee';
import { module as celiapp } from './apprendre/modules/celiapp';
import { module as retraitePublique } from './apprendre/modules/retraite-publique';
import { module as decaissementRetraite } from './apprendre/modules/decaissement-retraite';
import { module as actionsDividendes } from './apprendre/modules/actions-dividendes';
import { module as obligations } from './apprendre/modules/obligations';
import { module as fondsCommuns } from './apprendre/modules/fonds-communs';
import { module as fnb } from './apprendre/modules/fnb';
import { module as fondsDistincts } from './apprendre/modules/fonds-distincts';
import { module as cpgPglm } from './apprendre/modules/cpg-pglm';
import { module as assuranceVieTemporaire } from './apprendre/modules/assurance-vie-temporaire';
import { module as assuranceViePermanente } from './apprendre/modules/assurance-vie-permanente';
import { module as assuranceMaladieGrave } from './apprendre/modules/assurance-maladie-grave';
import { module as assuranceInvalidite } from './apprendre/modules/assurance-invalidite';
import { module as assuranceCollective } from './apprendre/modules/assurance-collective';
import { module as successionBases } from './apprendre/modules/succession-bases';
import { module as fiscaliteEpargneCorpo } from './apprendre/modules/fiscalite-epargne-corpo';
import { module as protectionsCorpo } from './apprendre/modules/protections-corpo';
import { module as conventionActionnaires } from './apprendre/modules/convention-actionnaires';
import { module as gelSuccessoral } from './apprendre/modules/gel-successoral';
import { module as vieCategorieActif } from './apprendre/modules/vie-categorie-actif';
import { module as mgProprietePartagee } from './apprendre/modules/mg-propriete-partagee';
import { module as pfiParticipative } from './apprendre/modules/pfi-participative';

export const FORMATION_CATEGORIES = {
  epargne: { id: 'epargne', label: 'Comptes et enveloppes', icon: PiggyBank },
  placements: { id: 'placements', label: 'Types de placements', icon: CandlestickChart },
  assurance: { id: 'assurance', label: 'Assurances personnelles', icon: Shield },
  corpo: { id: 'corpo', label: 'Entreprise et stratégies avancées', icon: Building2 },
};

const RAW_MODULES = [
  // Base — comptes / enveloppes
  fondsUrgence,
  celi,
  celiapp,
  reee,
  reerFerr,
  retraitePublique,
  fondsPensions,
  nonEnregistre,
  // Avancé — comptes
  decaissementRetraite,
  // Types de placements (classes d’actifs + véhicules)
  actionsDividendes,
  obligations,
  fondsCommuns,
  fnb,
  fondsDistincts,
  cpgPglm,
  // Base / intermédiaire — assurance
  assuranceCollective,
  assuranceVieTemporaire,
  assuranceViePermanente,
  assuranceMaladieGrave,
  assuranceInvalidite,
  successionBases,
  // Avancé — corpo / patrimoine
  fiscaliteEpargneCorpo,
  protectionsCorpo,
  conventionActionnaires,
  gelSuccessoral,
  vieCategorieActif,
  mgProprietePartagee,
  pfiParticipative,
];

/**
 * Modules « Apprendre » — contenus institutionnels (un fichier par sujet dans apprendre/modules).
 */
export const formations = RAW_MODULES.map(assembleFormation);

export function getFormationById(id) {
  return formations.find((f) => f.id === id) ?? null;
}

export function getFormationsForAudience(audience) {
  return formations.filter((f) => (f.audiences || []).includes(audience));
}

export function getApprendrePath(id) {
  return `/apprendre/${id}`;
}

export function getFormationsByCategory(audience) {
  const list = getFormationsForAudience(audience);
  const categoryOrder =
    audience === AUDIENCE_PRIVE
      ? ['corpo', 'assurance', 'epargne', 'placements']
      : ['epargne', 'placements', 'assurance', 'corpo'];
  const grouped = {};
  for (const catId of categoryOrder) {
    const cat = FORMATION_CATEGORIES[catId];
    if (!cat) continue;
    const items = list.filter((f) => f.category === cat.id);
    if (items.length) grouped[cat.id] = { ...cat, items };
  }
  return grouped;
}

export function getRelatedFormations(formation, audience, limit = 3) {
  const ids = formation.relatedFormationIds || [];
  const related = ids
    .map((id) => getFormationById(id))
    .filter(Boolean)
    .filter((f) => (f.audiences || []).includes(audience));
  if (related.length >= limit) return related.slice(0, limit);
  const extras = getFormationsForAudience(audience).filter(
    (f) => f.id !== formation.id && !ids.includes(f.id)
  );
  return [...related, ...extras].slice(0, limit);
}
