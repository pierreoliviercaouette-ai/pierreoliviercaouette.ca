import { module as celi } from './apprendre/modules/celi';
import { module as reerFerr } from './apprendre/modules/reer-ferr';
import { module as fondsPensions } from './apprendre/modules/fonds-pensions';
import { module as nonEnregistre } from './apprendre/modules/non-enregistre';
import { module as fondsUrgence } from './apprendre/modules/fonds-urgence';
import { module as reee } from './apprendre/modules/reee';
import { module as celiapp } from './apprendre/modules/celiapp';
import { module as retraitePublique } from './apprendre/modules/retraite-publique';
import { module as decaissementRetraite } from './apprendre/modules/decaissement-retraite';
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
import { module as actionsDividendes } from './apprendre/modules/actions-dividendes';
import { module as obligations } from './apprendre/modules/obligations';
import { module as fondsCommuns } from './apprendre/modules/fonds-communs';
import { module as fnb } from './apprendre/modules/fnb';
import { module as fondsDistincts } from './apprendre/modules/fonds-distincts';
import { module as cpgPglm } from './apprendre/modules/cpg-pglm';
import { assembleDiagrams } from './apprendre/assemble';

const { diagrams, exampleDiagrams } = assembleDiagrams([
  fondsUrgence,
  celi,
  celiapp,
  reee,
  reerFerr,
  retraitePublique,
  fondsPensions,
  nonEnregistre,
  decaissementRetraite,
  actionsDividendes,
  obligations,
  fondsCommuns,
  fnb,
  fondsDistincts,
  cpgPglm,
  assuranceCollective,
  assuranceVieTemporaire,
  assuranceViePermanente,
  assuranceMaladieGrave,
  assuranceInvalidite,
  successionBases,
  fiscaliteEpargneCorpo,
  protectionsCorpo,
  conventionActionnaires,
  gelSuccessoral,
  vieCategorieActif,
  mgProprietePartagee,
  pfiParticipative,
]);

export const formationDiagrams = diagrams;
export const formationExampleDiagrams = exampleDiagrams;

export function getFormationDiagram(id) {
  return formationDiagrams[id] || null;
}

export function getFormationExampleDiagram(id) {
  return formationExampleDiagrams[id] || null;
}
