const GA_MEASUREMENT_ID = 'G-CKGLFKD958';

const hasWindow = () => typeof window !== 'undefined';

const isGtagReady = () => hasWindow() && typeof window.gtag === 'function';

export const trackPageView = (path, title = document?.title || '') => {
  if (!isGtagReady()) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!isGtagReady()) return;
  window.gtag('event', eventName, params);
};

export const setAnalyticsUser = (user = null) => {
  if (!isGtagReady()) return;
  window.gtag('set', 'user_properties', {
    is_logged_in: Boolean(user),
    is_admin: Boolean(user?.is_admin),
  });
};
