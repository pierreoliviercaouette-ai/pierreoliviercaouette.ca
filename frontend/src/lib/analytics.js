import { hasAnalyticsConsent } from './consent';

export const GA_MEASUREMENT_ID = 'G-CKGLFKD958';
export const POSTHOG_KEY = 'phc_xAvL2Iq4tFmANRE7kzbKwaSqp1HJjN7x48s3vr0CMjs';
export const POSTHOG_HOST = 'https://us.i.posthog.com';
export const META_PIXEL_ID = '1157851050245521';

const hasWindow = () => typeof window !== 'undefined';

const isGtagReady = () => hasWindow() && typeof window.gtag === 'function';
const isFbqReady = () => hasWindow() && typeof window.fbq === 'function';

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

/** Meta Pixel — same stub as Meta Events Manager snippet; only after consent. */
const initMetaPixel = () => {
  if (!hasWindow() || window.__metaPixelInitialized) return;

  /* eslint-disable */
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = '2.0';
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */

  window.fbq('init', META_PIXEL_ID);
  window.fbq('track', 'PageView');

  if (!document.getElementById('meta-pixel-noscript')) {
    const noscript = document.createElement('noscript');
    noscript.id = 'meta-pixel-noscript';
    const img = document.createElement('img');
    img.height = 1;
    img.width = 1;
    img.style.display = 'none';
    img.alt = '';
    img.src = `https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`;
    noscript.appendChild(img);
    document.body.appendChild(noscript);
  }

  window.__metaPixelInitialized = true;
};

const trackMetaFromAppEvent = (eventName, params = {}) => {
  if (!isFbqReady()) return;

  // Conversion principale : formulaire de contact envoyé
  if (eventName === 'generate_lead') {
    window.fbq('track', 'Lead', {
      content_name: params.method || 'contact_form',
      content_category: 'contact',
    });
    return;
  }

  // Conversion : confirmation RDV (page /rendez-vous/merci — iframe Outlook non lisible)
  if (eventName === 'schedule') {
    window.fbq('track', 'Schedule', {
      content_name: params.method || 'booking_self_confirm',
      content_category: params.source || 'appointment',
    });
    return;
  }

  if (eventName === 'view_item') {
    window.fbq('track', 'ViewContent', {
      content_name: params.item_id || undefined,
      content_category: params.item_category || undefined,
      content_ids: params.item_id ? [String(params.item_id)] : undefined,
      content_type: 'product',
    });
    return;
  }

  if (eventName === 'select_content') {
    const itemId = String(params.item_id || '');
    const isRdvIntent =
      itemId.includes('_rdv') ||
      itemId.includes('outlook') ||
      itemId.includes('rendez_vous') ||
      itemId.includes('booking');
    if (isRdvIntent) {
      // Intention (pas encore une réservation confirmée)
      window.fbq('track', 'InitiateCheckout', {
        content_name: itemId || undefined,
        content_category: params.content_type || undefined,
      });
    }
    return;
  }

  if (eventName === 'contact_click') {
    window.fbq('track', 'Contact', {
      content_name: params.channel || undefined,
      content_category: params.source || undefined,
    });
  }
};

/**
 * Load GA + PostHog + Meta Pixel once after explicit consent.
 */
export const bootstrapAnalytics = async () => {
  if (!hasAnalyticsConsent() || analyticsBootstrapped) return false;
  analyticsBootstrapped = true;
  try {
    await initGoogleAnalytics();
    initPostHog();
    initMetaPixel();
    return true;
  } catch (error) {
    console.error('Analytics bootstrap failed:', error);
    analyticsBootstrapped = false;
    return false;
  }
};

export const trackPageView = (path, title = document?.title || '') => {
  if (!hasAnalyticsConsent()) return;
  if (isGtagReady()) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: path,
      page_title: title,
    });
  }
  if (isFbqReady()) {
    window.fbq('track', 'PageView');
  }
};

export const trackEvent = (eventName, params = {}) => {
  if (!hasAnalyticsConsent()) return;
  if (isGtagReady()) {
    window.gtag('event', eventName, params);
  }
  trackMetaFromAppEvent(eventName, params);
};

export const setAnalyticsUser = (user = null) => {
  if (!hasAnalyticsConsent() || !isGtagReady()) return;
  window.gtag('set', 'user_properties', {
    is_logged_in: Boolean(user),
    is_admin: Boolean(user?.is_admin),
  });
};
