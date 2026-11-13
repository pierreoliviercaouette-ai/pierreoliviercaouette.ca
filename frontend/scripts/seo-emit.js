import fs from 'node:fs';
import path from 'node:path';
import { buildPublicSeoCatalog } from '../src/lib/seoCatalog';
import { buildLlmsTxt, buildMarkdown, buildSitemapXml, patchIndexHtml } from '../src/lib/seoArtifacts';

function writeTextSet(dir, catalog, lastmod) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'sitemap.xml'), buildSitemapXml(catalog, lastmod), 'utf8');
  fs.writeFileSync(path.join(dir, 'llms.txt'), buildLlmsTxt(catalog), 'utf8');
  const contenu = path.join(dir, 'contenu');
  fs.mkdirSync(contenu, { recursive: true });
  const keep = new Set();
  for (const page of catalog) {
    if (!page.markdownFile) continue;
    keep.add(page.markdownFile);
    fs.writeFileSync(path.join(contenu, page.markdownFile), buildMarkdown(page), 'utf8');
  }
  for (const name of fs.readdirSync(contenu)) {
    if (name.endsWith('.md') && !keep.has(name)) {
      fs.unlinkSync(path.join(contenu, name));
    }
  }
}

function routeHtmlPath(buildDir, routePath) {
  if (routePath === '/') return path.join(buildDir, 'index.html');
  return path.join(buildDir, routePath.replace(/^\//, ''), 'index.html');
}

export function generate({ shell, publicDir, buildDir, lastmod } = {}) {
  const root = path.join(__dirname, '..');
  const pub = publicDir || path.join(root, 'public');
  const build = buildDir || path.join(root, 'build');
  const catalog = buildPublicSeoCatalog();
  const date = lastmod || new Date().toISOString().slice(0, 10);

  writeTextSet(pub, catalog, date);

  const buildIndex = path.join(build, 'index.html');
  const html =
    shell || (fs.existsSync(buildIndex) ? fs.readFileSync(buildIndex, 'utf8') : null);
  if (!html) {
    console.log('SEO: sitemap, llms.txt et markdown écrits dans public/. HTML de routes ignoré (pas de build).');
    return catalog;
  }

  writeTextSet(build, catalog, date);
  for (const page of catalog) {
    const target = routeHtmlPath(build, page.path);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, patchIndexHtml(html, page), 'utf8');
  }
  console.log(`SEO: ${catalog.length} pages HTML, sitemap et llms.txt.`);
  return catalog;
}
