/**
 * Origine du site **public** (domaine réel), pas l’URL *.vercel.app des prévisualisations.
 * Définir dans Vercel : REACT_APP_PUBLIC_SITE_URL = https://www.pierreoliviercaouette.ca
 * (sans slash final). Sinon le lien copié utilise l’URL actuelle → risque de page login Vercel
 * si le déploiement a « Deployment Protection ».
 */
export function getPublicSiteOrigin() {
  const raw = process.env.REACT_APP_PUBLIC_SITE_URL;
  if (raw && String(raw).trim()) {
    let base = String(raw).trim().replace(/\/$/, '');
    if (!/^https?:\/\//i.test(base)) {
      base = `https://${base}`;
    }
    try {
      return new URL(base).origin;
    } catch {
      return base;
    }
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return '';
}

/** URL publique de consentement pour le parrainage (à partager). */
export function getReferralConsentUrl(referralCode) {
  if (!referralCode) return '';
  const origin = getPublicSiteOrigin();
  return `${origin}/referencement/consentement?ref=${encodeURIComponent(referralCode)}`;
}
