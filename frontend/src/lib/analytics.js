import { hasAnalyticsConsent } from './consent';

export const GA_MEASUREMENT_ID = 'G-CKGLFKD958';
export const POSTHOG_KEY = 'phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs';
export const POSTHOG_HOST = 'https://us.i.posthog.com';

const hasWindow = () => typeof window !== 'undefined';

const isGtagReady = () => hasWindow() && typeof window.gtag === 'function';

let analyticsBootstrapped = false;

const loadScript = (src, attrs = {}) =>
  new Promise((resolve, reject) => {
    if (!hasWindow()) {
      resolve(false);
      return;
    }
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    Object.entries(attrs).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });

const initGoogleAnalytics = async () => {
  if (!hasWindow()) return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== 'function') {
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };
  }
  await loadScript(`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`);
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID);
};

/** Inject PostHog using the same stub pattern as the former index.html snippet. */
const initPostHog = () => {
  if (!hasWindow() || window.__posthogInitialized) return;

  /* eslint-disable */
  !(function (t, e) {
    var o, n, p, r;
    e.__SV ||
      ((window.posthog = e),
      (e._i = []),
      (e.init = function (i, s, a) {
        function g(t, e) {
          var o = e.split('.');
          2 == o.length && ((t = t[o[0]]), (e = o[1])),
            (t[e] = function () {
              t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
            });
        }
        ((p = t.createElement('script')).type = 'text/javascript'),
          (p.crossOrigin = 'anonymous'),
          (p.async = !0),
          (p.src =
            s.api_host.replace('.i.posthog.com', '-assets.i.posthog.com') + '/static/array.js'),
          (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r);
        var u = e;
        for (
          void 0 !== a ? (u = e[a] = []) : (a = 'posthog'),
            u.people = u.people || [],
            u.toString = function (t) {
              var e = 'posthog';
              return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e;
            },
            u.people.toString = function () {
              return u.toString(1) + '.people';
            },
            o =
              'init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric'.split(
                ' '
              ),
            n = 0;
          n < o.length;
          n++
        )
          g(u, o[n]);
        e._i.push([i, s, a]);
      }),
      (e.__SV = 1));
  })(document, window.posthog || []);
  /* eslint-enable */

  window.posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: 'identified_only',
    session_recording: {
      recordCrossOriginIframes: true,
      capturePerformance: false,
    },
  });
  window.__posthogInitialized = true;
};

/**
 * Load GA + PostHog once after explicit consent.
 */
export const bootstrapAnalytics = async () => {
  if (!hasAnalyticsConsent() || analyticsBootstrapped) return false;
  analyticsBootstrapped = true;
  try {
    await initGoogleAnalytics();
    initPostHog();
    return true;
  } catch (error) {
    console.error('Analytics bootstrap failed:', error);
    analyticsBootstrapped = false;
    return false;
  }
};

export const trackPageView = (path, title = document?.title || '') => {
  if (!hasAnalyticsConsent() || !isGtagReady()) return;
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });
};

export const trackEvent = (eventName, params = {}) => {
  if (!hasAnalyticsConsent() || !isGtagReady()) return;
  window.gtag('event', eventName, params);
};

export const setAnalyticsUser = (user = null) => {
  if (!hasAnalyticsConsent() || !isGtagReady()) return;
  window.gtag('set', 'user_properties', {
    is_logged_in: Boolean(user),
    is_admin: Boolean(user?.is_admin),
  });
};
