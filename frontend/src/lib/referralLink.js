/** URL publique de consentement pour le parrainage (à partager). */
export function getReferralConsentUrl(referralCode) {
  if (!referralCode) return '';
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  return `${origin}/referencement/consentement?ref=${encodeURIComponent(referralCode)}`;
}
