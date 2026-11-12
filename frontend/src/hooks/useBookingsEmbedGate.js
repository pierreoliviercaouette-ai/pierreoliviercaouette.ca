import { useEffect, useState } from 'react';

/** Délai max avant bascule formulaire (Microsoft down / hang). */
export const BOOKINGS_EMBED_TIMEOUT_MS = 30_000;

const PROBE_ATTEMPT_MS = 6_000;
const PROBE_RETRY_GAP_MS = 1_200;

/**
 * Probe no-cors : détecte ERR_CONNECTION_REFUSED / offline.
 * Succès opaque = l’hôte a répondu (même 4xx/5xx HTML).
 */
export async function probeBookingsReachable(url, timeoutMs = PROBE_ATTEMPT_MS) {
  if (!url || typeof fetch !== 'function') return false;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    await fetch(url, {
      method: 'GET',
      mode: 'no-cors',
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
      credentials: 'omit',
    });
    return true;
  } catch {
    return false;
  } finally {
    window.clearTimeout(timer);
  }
}

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

/**
 * Gate pour iframe Bookings :
 * - `loading` → sonde + attente
 * - `ready` → au moins une sonde OK (onLoad seul ne suffit pas : page erreur Chrome)
 * - `timedout` → refuse / hang → afficher le formulaire
 */
export function useBookingsEmbedGate(bookingUrl, {
  timeoutMs = BOOKINGS_EMBED_TIMEOUT_MS,
  extraProbeUrls = ['https://bookings.ms/'],
  onTimeout,
} = {}) {
  const [status, setStatus] = useState('loading'); // loading | ready | timedout

  useEffect(() => {
    let cancelled = false;
    const startedAt = Date.now();
    const urls = [bookingUrl, ...(extraProbeUrls || [])].filter(Boolean);

    const fail = (reason) => {
      if (cancelled) return;
      setStatus((prev) => {
        if (prev !== 'loading') return prev;
        onTimeout?.(reason);
        return 'timedout';
      });
    };

    const succeed = () => {
      if (cancelled) return;
      setStatus((prev) => (prev === 'loading' ? 'ready' : prev));
    };

    (async () => {
      while (!cancelled && Date.now() - startedAt < timeoutMs) {
        const results = await Promise.all(
          urls.map((url) => probeBookingsReachable(url, PROBE_ATTEMPT_MS))
        );
        if (cancelled) return;

        // Tous les hôtes critiques joignables → OK
        if (results.every(Boolean)) {
          succeed();
          return;
        }

        // Refus net (tous false très vite) : on retente jusqu’au timeout global
        const remaining = timeoutMs - (Date.now() - startedAt);
        if (remaining <= PROBE_RETRY_GAP_MS) break;
        await sleep(PROBE_RETRY_GAP_MS);
      }
      fail('probe_or_timeout');
    })();

    const hardTimer = window.setTimeout(() => fail('hard_timeout'), timeoutMs);

    return () => {
      cancelled = true;
      window.clearTimeout(hardTimer);
    };
  }, [bookingUrl, timeoutMs]); // eslint-disable-line react-hooks/exhaustive-deps -- onTimeout/extraProbeUrls stables en pratique

  const forceFallback = () => {
    setStatus('timedout');
    onTimeout?.('manual');
  };

  return {
    status,
    isLoading: status === 'loading',
    isReady: status === 'ready',
    showFallback: status === 'timedout',
    forceFallback,
  };
}
