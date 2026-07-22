const CONSENT_KEY = 'cookie_consent_v1';
export const CONSENT_ACCEPTED = 'accepted';
export const CONSENT_REJECTED = 'rejected';

const CONSENT_CHANGE_EVENT = 'cookie-consent-change';

const hasWindow = () => typeof window !== 'undefined';

export const getConsent = () => {
  if (!hasWindow()) return null;
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    if (value === CONSENT_ACCEPTED || value === CONSENT_REJECTED) return value;
  } catch {
    // localStorage unavailable
  }
  return null;
};

export const hasAnalyticsConsent = () => getConsent() === CONSENT_ACCEPTED;

export const setConsent = (value) => {
  if (!hasWindow()) return;
  if (value !== CONSENT_ACCEPTED && value !== CONSENT_REJECTED) return;
  try {
    window.localStorage.setItem(CONSENT_KEY, value);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: value }));
};

export const clearConsent = () => {
  if (!hasWindow()) return;
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGE_EVENT, { detail: null }));
};

export const subscribeConsent = (listener) => {
  if (!hasWindow()) return () => {};
  const handler = (event) => listener(event.detail ?? getConsent());
  window.addEventListener(CONSENT_CHANGE_EVENT, handler);
  return () => window.removeEventListener(CONSENT_CHANGE_EVENT, handler);
};

export { CONSENT_KEY };
