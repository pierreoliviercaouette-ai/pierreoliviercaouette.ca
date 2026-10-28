import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const AUDIENCE_PARTICULIER = 'particulier';
export const AUDIENCE_PRIVE = 'prive';

const STORAGE_KEY = 'poc-audience-mode';

const AudienceModeContext = createContext({
  audience: AUDIENCE_PARTICULIER,
  isPrive: false,
  homePath: '/',
  setAudience: () => {},
});

function readStoredAudience() {
  if (typeof window === 'undefined') return AUDIENCE_PARTICULIER;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === AUDIENCE_PRIVE || stored === AUDIENCE_PARTICULIER) return stored;
  } catch {
    /* ignore */
  }
  return AUDIENCE_PARTICULIER;
}

function applyAudienceAttribute(audience) {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-audience', audience);
}

export function AudienceModeProvider({ children }) {
  const location = useLocation();
  const [audience, setAudienceState] = useState(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/';
    if (path === '/' || path.startsWith('/?')) return AUDIENCE_PARTICULIER;
    if (path.startsWith('/patrimoine')) return AUDIENCE_PRIVE;
    return readStoredAudience();
  });

  const setAudience = useCallback((next) => {
    const value = next === AUDIENCE_PRIVE ? AUDIENCE_PRIVE : AUDIENCE_PARTICULIER;
    setAudienceState(value);
    applyAudienceAttribute(value);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  }, []);

  // Routes d'accueil forcent le mode; le reste conserve le mode mémorisé
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') {
      setAudience(AUDIENCE_PARTICULIER);
      return;
    }
    if (path.startsWith('/patrimoine')) {
      setAudience(AUDIENCE_PRIVE);
    }
  }, [location.pathname, setAudience]);

  useEffect(() => {
    applyAudienceAttribute(audience);
  }, [audience]);

  const value = useMemo(
    () => ({
      audience,
      isPrive: audience === AUDIENCE_PRIVE,
      homePath: audience === AUDIENCE_PRIVE ? '/patrimoine' : '/',
      setAudience,
    }),
    [audience, setAudience]
  );

  return <AudienceModeContext.Provider value={value}>{children}</AudienceModeContext.Provider>;
}

export function useAudienceMode() {
  return useContext(AudienceModeContext);
}
