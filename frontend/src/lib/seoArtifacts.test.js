import fs from 'fs';
import path from 'path';
import { buildPublicSeoCatalog } from './seoCatalog';
import { buildLlmsTxt, buildSitemapXml, patchIndexHtml } from './seoArtifacts';

const LANDING_PATHS = [
  '/conseiller-financier-victoriaville',
  '/recommander-conseiller-financier',
  '/assurance-vie-victoriaville',
  '/assurance-invalidite-quebec',
  '/planification-financiere-quebec',
];

test('le sitemap et llms.txt citent les pages publiques et excluent le privé', () => {
  const catalog = buildPublicSeoCatalog();
  const sitemap = buildSitemapXml(catalog, '2026-11-12');
  const llms = buildLlmsTxt(catalog);

  expect(sitemap).toContain('https://www.pierreoliviercaouette.ca/apprendre/celi');
  expect(llms).toContain('/contenu/apprendre-celi.md');

  for (const routePath of LANDING_PATHS) {
    expect(sitemap).toContain(`https://www.pierreoliviercaouette.ca${routePath}`);
    expect(llms).toContain(`/contenu${routePath}.md`);
  }

  expect(sitemap).not.toContain('gel-successoral');
  expect(llms).not.toContain('gel-successoral');
  expect(sitemap).not.toContain('/outils/budget-mensuel');
  expect(llms).not.toContain('budget-mensuel');
  expect(sitemap).not.toContain('/campagnes/');

  const landings = catalog.filter((page) => page.kind === 'landing');
  expect(landings).toHaveLength(5);
  for (const landing of landings) {
    expect(landing.faq.length).toBeGreaterThanOrEqual(3);
  }
});

test('le HTML statique garde #root vide et pose un canonical propre', () => {
  const catalog = buildPublicSeoCatalog();
  const shell = fs.readFileSync(path.join(__dirname, '../../public/index.html'), 'utf8');
  const article = catalog.find((page) => page.path === '/apprendre/celi');
  const landing = catalog.find((page) => page.path === '/assurance-vie-victoriaville');

  const articleHtml = patchIndexHtml(shell, article);
  expect(articleHtml).toContain(
    '<link rel="canonical" href="https://www.pierreoliviercaouette.ca/apprendre/celi"'
  );
  expect(articleHtml).toContain('rel="alternate" type="text/markdown"');
  expect(articleHtml).toContain('"@type":"Article"');
  expect(articleHtml).toContain('<div id="root"></div>');
  expect(articleHtml).toContain('<h1>');
  expect(articleHtml).not.toMatch(/<div id="root">\s*<h1>/);

  const landingHtml = patchIndexHtml(shell, landing);
  expect(landingHtml).toContain('"@type":"FAQPage"');
  expect(landingHtml).toContain('Questions fréquentes');
  expect(landingHtml).not.toContain('https://www.pierreoliviercaouette.ca/" />');
});
