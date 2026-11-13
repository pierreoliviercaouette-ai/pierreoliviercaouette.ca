import { campagneAdsLandings } from '../data/campagneAdsLandings';
import { module as celi } from '../data/apprendre/modules/celi';
import { module as reerFerr } from '../data/apprendre/modules/reer-ferr';
import { module as fondsPensions } from '../data/apprendre/modules/fonds-pensions';
import { module as nonEnregistre } from '../data/apprendre/modules/non-enregistre';
import { module as fondsUrgence } from '../data/apprendre/modules/fonds-urgence';
import { module as reee } from '../data/apprendre/modules/reee';
import { module as celiapp } from '../data/apprendre/modules/celiapp';
import { module as retraitePublique } from '../data/apprendre/modules/retraite-publique';
import { module as decaissementRetraite } from '../data/apprendre/modules/decaissement-retraite';
import { module as actionsDividendes } from '../data/apprendre/modules/actions-dividendes';
import { module as obligations } from '../data/apprendre/modules/obligations';
import { module as fondsCommuns } from '../data/apprendre/modules/fonds-communs';
import { module as fnb } from '../data/apprendre/modules/fnb';
import { module as fondsDistincts } from '../data/apprendre/modules/fonds-distincts';
import { module as cpgPglm } from '../data/apprendre/modules/cpg-pglm';
import { module as assuranceVieTemporaire } from '../data/apprendre/modules/assurance-vie-temporaire';
import { module as assuranceViePermanente } from '../data/apprendre/modules/assurance-vie-permanente';
import { module as assuranceMaladieGrave } from '../data/apprendre/modules/assurance-maladie-grave';
import { module as assuranceInvalidite } from '../data/apprendre/modules/assurance-invalidite';
import { module as assuranceCollective } from '../data/apprendre/modules/assurance-collective';
import { module as successionBases } from '../data/apprendre/modules/succession-bases';
import { module as fiscaliteEpargneCorpo } from '../data/apprendre/modules/fiscalite-epargne-corpo';
import { module as protectionsCorpo } from '../data/apprendre/modules/protections-corpo';
import { module as conventionActionnaires } from '../data/apprendre/modules/convention-actionnaires';
import { module as gelSuccessoral } from '../data/apprendre/modules/gel-successoral';
import { module as vieCategorieActif } from '../data/apprendre/modules/vie-categorie-actif';
import { module as mgProprietePartagee } from '../data/apprendre/modules/mg-propriete-partagee';
import { module as pfiParticipative } from '../data/apprendre/modules/pfi-participative';
import { services } from '../data/services';
import { seoLandings } from '../data/seoLandings';
import { staticSeoPages } from '../data/staticSeoPages';
import { apprendreDocumentTitle, markdownFileForPath } from './seoArtifacts';

const RAW_MODULES = [
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
];

function sectionTitle(heading) {
  return String(heading || '').replace(/^\d+\.\s+/, '');
}

function withDefaults(page) {
  const llms = page.llms !== false;
  return {
    sitemap: true,
    llms: true,
    ogType: 'website',
    changefreq: 'monthly',
    priority: '0.6',
    llmsSection: 'Pages principales',
    faq: [],
    sections: [],
    ...page,
    markdownFile: llms ? page.markdownFile || markdownFileForPath(page.path) : null,
    llmsBlurb: page.llmsBlurb || page.enBref || page.description,
  };
}

function moduleToPage(mod) {
  const path = `/apprendre/${mod.id}`;
  const sections = (mod.sections || []).map((section) => ({
    heading: sectionTitle(section.heading),
    paragraphs: section.paragraphs || [],
    bullets: section.bullets || [],
  }));
  if (mod.workedExample) {
    sections.push({
      heading: mod.workedExample.title || 'Exemple',
      paragraphs: [mod.workedExample.intro].filter(Boolean),
      bullets: (mod.workedExample.steps || []).map((step) =>
        step.detail ? `${step.label} — ${step.detail}` : step.label
      ),
    });
  }
  if (Array.isArray(mod.takeaways) && mod.takeaways.every((item) => typeof item === 'string')) {
    sections.push({ heading: 'À retenir', bullets: mod.takeaways });
  }
  return withDefaults({
    kind: 'article',
    path,
    title: apprendreDocumentTitle(mod.seoTitle),
    description: mod.seoDescription,
    h1: mod.title,
    enBref: mod.shortDescription,
    sections,
    facts: mod.keyFacts || [],
    sources: mod.sources || [],
    faq: [],
    schema: 'article',
    ogType: 'article',
    llmsSection: 'Apprendre',
    priority: '0.8',
    breadcrumb: [
      { name: 'Accueil', path: '/' },
      { name: 'Apprendre', path: '/apprendre' },
      { name: mod.title, path },
    ],
  });
}

function serviceToPage(service) {
  const path = `/services/${service.id}`;
  return withDefaults({
    kind: 'service',
    path,
    title: `${service.seoTitle} | Pierre-Olivier Caouette`,
    description: service.seoDescription,
    h1: service.title,
    enBref: service.shortDescription,
    serviceName: service.subtitle || service.title,
    sections: [
      { heading: 'C’est quoi ?', paragraphs: service.fullDescription || [] },
      { heading: 'Points clés', bullets: service.features || [] },
      { heading: 'Exemples', bullets: service.examples || [] },
      { heading: 'Approche', bullets: service.whyMe || [] },
    ],
    schema: 'service',
    llmsSection: 'Services',
    priority: '0.88',
    breadcrumb: [
      { name: 'Accueil', path: '/' },
      { name: 'Services', path: '/services' },
      { name: service.title, path },
    ],
  });
}

function landingToPage(landing) {
  return withDefaults({
    kind: 'landing',
    path: landing.path,
    title: landing.title,
    description: landing.description,
    h1: landing.h1,
    enBref: landing.enBref,
    sections: landing.sections,
    faq: landing.faqItems,
    llmsSection: 'Guides',
    priority: '0.85',
    breadcrumb: [
      { name: 'Accueil', path: '/' },
      { name: landing.h1, path: landing.path },
    ],
  });
}

function campagneToPage(item) {
  return withDefaults({
    kind: 'campagne',
    path: `/campagnes/${item.slug}`,
    title: item.seoTitle,
    description: item.seoDescription,
    h1: item.title,
    enBref: item.promise,
    sections: [
      { heading: 'En pratique', bullets: item.bullets || [] },
      ...(item.legalNote ? [{ heading: 'Note', paragraphs: [item.legalNote] }] : []),
    ],
    faq: item.faq || [],
    sitemap: false,
    llms: false,
    priority: '0.3',
    breadcrumb: [
      { name: 'Accueil', path: '/' },
      { name: item.title, path: `/campagnes/${item.slug}` },
    ],
  });
}

export function buildPublicSeoCatalog() {
  const pages = [
    ...staticSeoPages.map((page) => withDefaults({ ...page, kind: 'page' })),
    ...seoLandings.map(landingToPage),
    ...services.map(serviceToPage),
    ...RAW_MODULES.filter((mod) => (mod.audiences || []).includes('particulier')).map(moduleToPage),
    ...campagneAdsLandings.map(campagneToPage),
  ];
  const seen = new Set();
  for (const page of pages) {
    if (seen.has(page.path)) {
      throw new Error(`Chemin SEO en double : ${page.path}`);
    }
    seen.add(page.path);
  }
  return pages;
}
