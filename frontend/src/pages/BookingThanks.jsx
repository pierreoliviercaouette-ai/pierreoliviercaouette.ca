import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowRight, CalendarCheck } from 'lucide-react';
import { trackEvent } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

const SCHEDULE_SESSION_KEY = 'meta_schedule_tracked_v1';

/**
 * Confirmation explicite après réservation Outlook (iframe non lisible).
 * Déclenche l’événement Meta Schedule.
 */
export const BookingThanks = () => {
  const [params] = useSearchParams();
  const source = params.get('source') || 'rendez_vous';

  useSeoMeta({
    title: 'Rendez-vous confirmé | Pierre-Olivier Caouette',
    description: 'Merci — votre rendez-vous est enregistré.',
    canonicalPath: '/rendez-vous/merci',
    noindex: true,
  });

  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    try {
      if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SCHEDULE_SESSION_KEY)) {
        return;
      }
      sessionStorage?.setItem(SCHEDULE_SESSION_KEY, '1');
    } catch {
      // ignore
    }
    trackEvent('schedule', {
      method: 'booking_self_confirm',
      source,
    });
  }, [source]);

  return (
    <main
      className="flex min-h-screen items-center justify-center bg-light"
      data-testid="booking-thanks-page"
    >
      <div className="mx-4 max-w-md text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <CalendarCheck className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="mb-4 font-heading text-3xl font-bold text-dark">Merci — c&apos;est noté</h1>
        <p className="mb-8 text-prestige-taupe">
          Votre confirmation est enregistrée. Vous devriez aussi recevoir un courriel Outlook
          Bookings. À bientôt.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Retour à l&apos;accueil
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/rendez-vous"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            Retour au calendrier
          </Link>
        </div>
      </div>
    </main>
  );
};
