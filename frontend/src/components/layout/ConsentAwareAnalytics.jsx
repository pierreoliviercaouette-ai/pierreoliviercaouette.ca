import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CONSENT_ACCEPTED, getConsent, subscribeConsent } from '../../lib/consent';
import { bootstrapAnalytics } from '../../lib/analytics';

/**
 * Vercel Web Analytics is cookieless → always on.
 * GA / PostHog / Meta Pixel boot only after cookie consent.
 */
export const ConsentAwareAnalytics = () => {
  const [allowed, setAllowed] = useState(() => getConsent() === CONSENT_ACCEPTED);

  useEffect(() => {
    if (allowed) {
      bootstrapAnalytics();
    }
    return subscribeConsent((next) => {
      const ok = next === CONSENT_ACCEPTED;
      setAllowed(ok);
      if (ok) bootstrapAnalytics();
    });
  }, [allowed]);

  return <Analytics />;
};
