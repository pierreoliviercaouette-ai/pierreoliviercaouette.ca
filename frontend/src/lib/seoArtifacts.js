import { SITE_ORIGIN } from '../data/seoCopy';

const LLMS_SECTION_ORDER = ['Pages principales', 'Guides', 'Services', 'Apprendre'];

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function escapeXml(value) {
  return escapeHtml(value);
}

export function absoluteSiteUrl(routePath) {
  if (!routePath || routePath === '/') return `${SITE_ORIGIN}/`;
  return `${SITE_ORIGIN}${routePath.startsWith('/') ? routePath : `/${routePath}`}`;
}

export function apprendreDocumentTitle(seoTitle) {
  const base = String(seoTitle || 'Apprendre')
    .replace(/\s*\|\s*Apprendre\s*$/i, '')
    .trim();
  return `${base} | Apprendre`;
}

export function markdownFileForPath(routePath) {
  if (!routePath || routePath === '/') return 'accueil.md';
  return `${routePath.replace(/^\//, '').replace(/\//g, '-')}.md`;
}

export function joinArticleBody(sections, lead) {
  const parts = [];
  if (lead) parts.push(String(lead));
  for (const section of sections || []) {
    if (section.heading) parts.push(String(section.heading));
    for (const paragraph of section.paragraphs || []) parts.push(String(paragraph));
    for (const bullet of section.bullets || []) parts.push(String(bullet));
  }
  return parts.join('\n\n');
}

function sourceLabel(source) {
  if (!source) return '';
  if (typeof source === 'string') return source;
  return source.name || source.label || source.title || 'Source';
}

function sourceUrl(source) {
  if (!source || typeof source === 'string') return '';
  return source.url || source.href || '';
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: (items || []).map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteSiteUrl(item.path),
    })),
  };
}

export function faqPageSchema(faqItems) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: (faqItems || []).map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function articleSchema({ headline, description, path, articleBody }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    inLanguage: 'fr-CA',
    mainEntityOfPage: absoluteSiteUrl(path),
    author: { '@id': `${SITE_ORIGIN}/#person` },
    publisher: { '@id': `${SITE_ORIGIN}/#business` },
  };
  if (articleBody) data.articleBody = articleBody;
  return data;
}

export function serviceSchema({ name, description, path }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: absoluteSiteUrl(path),
    provider: { '@id': `${SITE_ORIGIN}/#business` },
    areaServed: { '@type': 'AdministrativeArea', name: 'Québec' },
  };
}

export function jsonLdForPage(page) {
  const blocks = [];
  if (page.breadcrumb?.length) blocks.push(breadcrumbSchema(page.breadcrumb));
  if (page.schema === 'article') {
    blocks.push(
      articleSchema({
        headline: page.h1,
        description: page.description,
        path: page.path,
        articleBody: joinArticleBody(page.sections, page.enBref),
      })
    );
  }
  if (page.schema === 'service') {
    blocks.push(
      serviceSchema({
        name: page.serviceName || page.h1,
        description: page.description,
        path: page.path,
      })
    );
  }
  if (page.faq?.length) blocks.push(faqPageSchema(page.faq));
  return blocks;
}

export function buildMarkdown(page) {
  const lines = [`# ${page.h1}`, ''];
  if (page.description) lines.push(page.description, '');
  if (page.enBref) lines.push('## En bref', '', page.enBref, '');
  for (const section of page.sections || []) {
    if (section.heading) lines.push(`## ${section.heading}`, '');
    for (const paragraph of section.paragraphs || []) lines.push(paragraph, '');
    for (const bullet of section.bullets || []) lines.push(`- ${bullet}`);
    if (section.bullets?.length) lines.push('');
    for (const link of section.links || []) {
      lines.push(`- [${link.label}](${absoluteSiteUrl(link.href)})`);
    }
    if (section.links?.length) lines.push('');
  }
  if (page.facts?.length) {
    lines.push('## Repères', '');
    for (const fact of page.facts) {
      lines.push(`- **${fact.label}** : ${fact.value}`);
    }
    lines.push('');
  }
  if (page.faq?.length) {
    lines.push('## Questions fréquentes', '');
    for (const item of page.faq) {
      lines.push(`### ${item.question}`, '', item.answer, '');
    }
  }
  if (page.sources?.length) {
    lines.push('## Sources', '');
    for (const source of page.sources) {
      const label = sourceLabel(source);
      const url = sourceUrl(source);
      lines.push(url ? `- [${label}](${url})` : `- ${label}`);
    }
    lines.push('');
  }
  lines.push(
    `Page : ${absoluteSiteUrl(page.path)}`,
    '',
    'Contenu éducatif publié par Pierre-Olivier Caouette, conseiller en sécurité financière. Ne constitue pas un conseil personnalisé.'
  );
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n')}\n`;
}

export function buildLlmsTxt(pages) {
  const cited = (pages || []).filter((page) => page.llms);
  const groups = new Map();
  for (const page of cited) {
    const key = page.llmsSection || 'Pages principales';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(page);
  }
  const ordered = [
    ...LLMS_SECTION_ORDER.filter((key) => groups.has(key)),
    ...[...groups.keys()].filter((key) => !LLMS_SECTION_ORDER.includes(key)),
  ];
  const lines = [
    '# Pierre-Olivier Caouette',
    '',
    '> Conseiller en sécurité financière à Victoriaville (Québec). Assurance vie, épargne, retraite et planification. Le contenu est éducatif et ne constitue pas un conseil personnalisé.',
    '',
  ];
  for (const section of ordered) {
    lines.push(`## ${section}`, '');
    for (const page of groups.get(section)) {
      const file = page.markdownFile || markdownFileForPath(page.path);
      const href = `${SITE_ORIGIN}/contenu/${file}`;
      const blurb = (page.llmsBlurb || page.description || '').replace(/\s+/g, ' ').trim();
      lines.push(`- [${page.h1}](${href}): ${blurb}`);
    }
    lines.push('');
  }
  return lines.join('\n').trimEnd() + '\n';
}

export function buildSitemapXml(pages, lastmod) {
  const urls = (pages || []).filter((page) => page.sitemap);
  const body = urls
    .map((page) => {
      const loc = escapeXml(absoluteSiteUrl(page.path));
      return [
        '  <url>',
        `    <loc>${loc}</loc>`,
        `    <lastmod>${lastmod}</lastmod>`,
        `    <changefreq>${page.changefreq || 'monthly'}</changefreq>`,
        `    <priority>${page.priority || '0.6'}</priority>`,
        '  </url>',
      ].join('\n');
    })
    .join('\n');
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    body,
    '</urlset>',
    '',
  ].join('\n');
}

function replaceTagContent(html, pattern, content) {
  return html.replace(pattern, (match) =>
    match.replace(/content="[^"]*"/, `content="${escapeHtml(content)}"`)
  );
}

export function buildNoscript(page) {
  const parts = [`<h1>${escapeHtml(page.h1)}</h1>`];
  if (page.enBref) parts.push(`<p>${escapeHtml(page.enBref)}</p>`);
  for (const section of page.sections || []) {
    if (section.heading) parts.push(`<h2>${escapeHtml(section.heading)}</h2>`);
    for (const paragraph of section.paragraphs || []) {
      parts.push(`<p>${escapeHtml(paragraph)}</p>`);
    }
    if (section.bullets?.length) {
      parts.push('<ul>');
      for (const bullet of section.bullets) parts.push(`<li>${escapeHtml(bullet)}</li>`);
      parts.push('</ul>');
    }
  }
  if (page.faq?.length) {
    parts.push('<h2>Questions fréquentes</h2>');
    for (const item of page.faq) {
      parts.push(`<h3>${escapeHtml(item.question)}</h3>`);
      parts.push(`<p>${escapeHtml(item.answer)}</p>`);
    }
  }
  parts.push(
    '<p>Pierre-Olivier Caouette, conseiller en sécurité financière à Victoriaville — <a href="mailto:p-o.caouette@agc.ia.ca">p-o.caouette@agc.ia.ca</a>, <a href="tel:+18198061164">819 806-1164</a>.</p>'
  );
  return parts.join('\n');
}

export function patchIndexHtml(html, page) {
  let next = html;
  const canonical = absoluteSiteUrl(page.path);
  next = next.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);
  next = replaceTagContent(next, /<meta\s+name="description"[\s\S]*?\/>/i, page.description);
  next = next.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"/,
    `<link rel="canonical" href="${canonical}"`
  );
  next = replaceTagContent(next, /<meta\s+property="og:title"[\s\S]*?\/>/i, page.title);
  next = replaceTagContent(next, /<meta\s+property="og:description"[\s\S]*?\/>/i, page.description);
  next = replaceTagContent(next, /<meta\s+property="og:url"[\s\S]*?\/>/i, canonical);
  next = replaceTagContent(next, /<meta\s+property="og:type"[\s\S]*?\/>/i, page.ogType || 'website');
  next = replaceTagContent(next, /<meta\s+name="twitter:title"[\s\S]*?\/>/i, page.title);
  next = replaceTagContent(next, /<meta\s+name="twitter:description"[\s\S]*?\/>/i, page.description);
  if (page.image) {
    next = replaceTagContent(next, /<meta\s+property="og:image"[\s\S]*?\/>/i, page.image);
    next = replaceTagContent(next, /<meta\s+property="og:image:secure_url"[\s\S]*?\/>/i, page.image);
    next = replaceTagContent(next, /<meta\s+name="twitter:image"[\s\S]*?\/>/i, page.image);
  }
  if (page.imageAlt) {
    next = replaceTagContent(next, /<meta\s+property="og:image:alt"[\s\S]*?\/>/i, page.imageAlt);
    next = replaceTagContent(next, /<meta\s+name="twitter:image:alt"[\s\S]*?\/>/i, page.imageAlt);
  }
  const extras = [];
  if (page.markdownFile) {
    extras.push(
      `<link rel="alternate" type="text/markdown" href="${SITE_ORIGIN}/contenu/${page.markdownFile}" title="${escapeHtml(page.h1)}" />`
    );
  }
  for (const block of jsonLdForPage(page)) {
    extras.push(
      `<script type="application/ld+json">${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`
    );
  }
  if (extras.length) {
    next = next.replace('</head>', `${extras.join('\n')}\n</head>`);
  }
  next = next.replace(/<noscript>[\s\S]*?<\/noscript>/, `<noscript>\n${buildNoscript(page)}\n</noscript>`);
  return next;
}
