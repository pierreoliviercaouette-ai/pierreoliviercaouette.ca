import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  CONSENT_ACCEPTED,
  CONSENT_REJECTED,
  getConsent,
  setConsent,
  subscribeConsent,
} from '../../lib/consent';
import { bootstrapAnalytics } from '../../lib/analytics';

export const CookieConsentBanner = () => {
  const [consent, setConsentState] = useState(() => getConsent());

  useEffect(() => {
    if (consent === CONSENT_ACCEPTED) {
      bootstrapAnalytics();
    }
    return subscribeConsent((next) => {
      setConsentState(next);
      if (next === CONSENT_ACCEPTED) {
        bootstrapAnalytics();
      }
    });
  }, [consent]);

  if (consent === CONSENT_ACCEPTED || consent === CONSENT_REJECTED) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] border-t border-prestige-beige bg-white/95 p-4 backdrop-blur-md md:p-5"
      role="dialog"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      data-testid="cookie-consent-banner"
    >
      <div className="container-max flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl space-y-1">
          <p id="cookie-consent-title" className="font-heading text-base font-semibold text-dark">
            Témoins et analytique
          </p>
          <p id="cookie-consent-desc" className="text-sm leading-relaxed text-slate-600">
            Nous utilisons des témoins et des outils d’analyse (Google Analytics, PostHog, Vercel
            Analytics) pour comprendre l’utilisation du site. Vous pouvez accepter ou refuser.
            Détails dans la{' '}
            <Link to="/confidentialite" className="font-medium text-primary underline-offset-2 hover:underline">
              politique de confidentialité
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            className="inline-flex min-h-[44px] items-center justify-center rounded-full border-2 border-dark/15 px-6 py-2.5 text-sm font-semibold text-dark transition-colors hover:border-dark/30 hover:bg-light"
            onClick={() => setConsent(CONSENT_REJECTED)}
            data-testid="cookie-consent-reject"
          >
            Refuser
          </button>
          <button
            type="button"
            className="btn-primary inline-flex min-h-[44px] items-center justify-center px-6 py-2.5 text-sm"
            onClick={() => setConsent(CONSENT_ACCEPTED)}
            data-testid="cookie-consent-accept"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
};
