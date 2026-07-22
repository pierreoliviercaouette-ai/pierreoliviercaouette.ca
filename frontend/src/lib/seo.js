import { useEffect } from 'react';

export const SITE_ORIGIN = 'https://www.pierreoliviercaouette.ca';

/** Image sociale / Google (1200×630), hébergée sur le domaine. */
export const DEFAULT_OG_IMAGE = `${SITE_ORIGIN}/seo/og-default.jpg`;
export const DEFAULT_OG_IMAGE_ALT =
  'Pierre-Olivier Caouette — Conseiller en sécurité financière à Victoriaville, Québec';
export const DEFAULT_OG_IMAGE_WIDTH = '1200';
export const DEFAULT_OG_IMAGE_HEIGHT = '630';

/** Portrait pour fiche Person / Knowledge Graph. */
export const PERSON_IMAGE = `${SITE_ORIGIN}/seo/portrait.jpg`;

function absoluteUrl(pathOrUrl) {
  if (!pathOrUrl) return DEFAULT_OG_IMAGE;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const origin =
    typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : SITE_ORIGIN;
  return `${origin}${pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`}`;
}

function upsertMeta(selector, attributes) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    Object.entries(attributes).forEach(([key, value]) => {
      if (key !== 'content') el.setAttribute(key, value);
    });
    document.head.appendChild(el);
  }
  if (attributes.content != null) {
    el.setAttribute('content', attributes.content);
  }
  return el;
}

function setNamedMeta(name, content) {
  if (content == null || content === '') return;
  upsertMeta(`meta[name="${name}"]`, { name, content });
}

function setPropertyMeta(property, content) {
  if (content == null || content === '') return;
  upsertMeta(`meta[property="${property}"]`, { property, content });
}

/**
 * Met à jour title, description, canonical, robots et balises Open Graph / Twitter.
 * Important pour les aperçus Google, Facebook, LinkedIn et iMessage.
 */
export function useSeoMeta({
  title,
  description,
  canonicalPath,
  noindex = false,
  image,
  imageAlt,
  type = 'website',
}) {
  useEffect(() => {
    const origin =
      typeof window !== 'undefined' && window.location?.origin
        ? window.location.origin
        : SITE_ORIGIN;
    const canonicalHref = canonicalPath ? `${origin}${canonicalPath}` : null;
    const ogImage = absoluteUrl(image || DEFAULT_OG_IMAGE);
    const ogAlt = imageAlt || DEFAULT_OG_IMAGE_ALT;

    if (title) {
      document.title = title;
      setPropertyMeta('og:title', title);
      setNamedMeta('twitter:title', title);
    }

    if (description) {
      setNamedMeta('description', description);
      setPropertyMeta('og:description', description);
      setNamedMeta('twitter:description', description);
    }

    setNamedMeta('twitter:card', 'summary_large_image');
    setPropertyMeta('og:type', type);
    setPropertyMeta('og:site_name', 'Pierre-Olivier Caouette');
    setPropertyMeta('og:locale', 'fr_CA');
    setPropertyMeta('og:image', ogImage);
    setPropertyMeta('og:image:secure_url', ogImage);
    setPropertyMeta('og:image:type', ogImage.endsWith('.png') ? 'image/png' : 'image/jpeg');
    setPropertyMeta('og:image:width', DEFAULT_OG_IMAGE_WIDTH);
    setPropertyMeta('og:image:height', DEFAULT_OG_IMAGE_HEIGHT);
    setPropertyMeta('og:image:alt', ogAlt);
    setNamedMeta('twitter:image', ogImage);
    setNamedMeta('twitter:image:alt', ogAlt);

    if (canonicalHref) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      link.setAttribute('href', canonicalHref);
      setPropertyMeta('og:url', canonicalHref);
    }

    let robots = document.querySelector('meta[name="robots"]');
    if (noindex) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.setAttribute('name', 'robots');
        document.head.appendChild(robots);
      }
      robots.setAttribute('content', 'noindex, nofollow');
    } else if (robots && robots.getAttribute('content') === 'noindex, nofollow') {
      robots.setAttribute(
        'content',
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
      );
    }

    return () => {
      if (noindex) {
        const currentRobots = document.querySelector('meta[name="robots"]');
        if (currentRobots && currentRobots.getAttribute('content') === 'noindex, nofollow') {
          currentRobots.setAttribute(
            'content',
            'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'
          );
        }
      }
    };
  }, [title, description, canonicalPath, noindex, image, imageAlt, type]);
}

export function useFaqSchema(faqItems = []) {
  useEffect(() => {
    if (!Array.isArray(faqItems) || faqItems.length === 0) return undefined;

    const existing = document.getElementById('faq-schema-jsonld');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.id = 'faq-schema-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: item.answer,
        },
      })),
    });
    document.head.appendChild(script);

    return () => {
      const current = document.getElementById('faq-schema-jsonld');
      if (current) current.remove();
    };
  }, [faqItems]);
}
