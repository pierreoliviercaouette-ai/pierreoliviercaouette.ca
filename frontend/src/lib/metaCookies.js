/** Lit les cookies Meta (_fbp / _fbc) pour matching Conversions API. */

export function getMetaClickCookies() {
  if (typeof document === 'undefined') {
    return { fbp: null, fbc: null };
  }
  const raw = document.cookie || '';
  const map = Object.fromEntries(
    raw
      .split(';')
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => {
        const i = p.indexOf('=');
        if (i < 0) return [p, ''];
        return [p.slice(0, i), decodeURIComponent(p.slice(i + 1))];
      })
  );
  return {
    fbp: map._fbp || null,
    fbc: map._fbc || null,
  };
}
