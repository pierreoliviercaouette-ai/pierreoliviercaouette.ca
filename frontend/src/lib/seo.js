import { useEffect } from 'react';

export function useSeoMeta({ title, description, canonicalPath }) {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }

    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.pierreoliviercaouette.ca';
      link.setAttribute('href', `${origin}${canonicalPath}`);
    }
  }, [title, description, canonicalPath]);
}
