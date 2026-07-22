import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { CONSENT_ACCEPTED, getConsent, subscribeConsent } from '../../lib/consent';
import { bootstrapAnalytics } from '../../lib/analytics';

/**
 * Boots third-party analytics only after cookie consent is accepted.
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

  if (!allowed) return null;
  return <Analytics />;
};
