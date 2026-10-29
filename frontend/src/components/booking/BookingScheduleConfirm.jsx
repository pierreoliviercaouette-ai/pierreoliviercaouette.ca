import { Link } from 'react-router-dom';
import { CalendarCheck } from 'lucide-react';
import { BOOKING_THANKS_PATH } from '../../lib/booking';
import { trackEvent } from '../../lib/analytics';

/**
 * Outlook Bookings est une iframe cross-origin : le site ne peut pas savoir
 * si la réservation est terminée. Ce CTA demande une confirmation explicite
 * et envoie vers /rendez-vous/merci (événement Meta Schedule).
 */
export function BookingScheduleConfirm({
  source = 'rendez_vous',
  variant = 'light',
}) {
  const merciPath = `${BOOKING_THANKS_PATH}?source=${encodeURIComponent(source)}`;
  const isDark = variant === 'dark';

  return (
    <div
      className={
        isDark
          ? 'mt-8 rounded-xl border border-white/15 bg-white/5 px-5 py-5 text-center'
          : 'mt-8 rounded-2xl border border-prestige-beige bg-white px-5 py-6 text-center shadow-ia'
      }
      data-testid="booking-schedule-confirm"
    >
      <div
        className={
          isDark
            ? 'mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-secondary/20'
            : 'mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-primary/10'
        }
      >
        <CalendarCheck className={isDark ? 'h-5 w-5 text-secondary' : 'h-5 w-5 text-primary'} />
      </div>
      <p className={isDark ? 'text-base font-semibold text-white' : 'text-base font-semibold text-dark'}>
        Réservation terminée dans le calendrier ?
      </p>
      <p className={isDark ? 'mt-1 text-sm text-white/65' : 'mt-1 text-sm text-prestige-taupe'}>
        Cliquez ici pour confirmer — ça nous permet de mesurer les prises de rendez-vous.
      </p>
      <Link
        to={merciPath}
        onClick={() =>
          trackEvent('select_content', {
            content_type: 'cta',
            item_id: `booking_confirm_${source}`,
          })
        }
        className={
          isDark
            ? 'mt-4 inline-flex items-center justify-center px-6 py-3 font-heading text-sm tracking-wide transition hover:opacity-90'
            : 'btn-primary mt-4 inline-flex items-center justify-center px-6 py-2.5 text-sm'
        }
        style={isDark ? { backgroundColor: '#ffffff', color: '#01233f' } : undefined}
        data-testid="booking-schedule-confirm-cta"
      >
        Oui, j&apos;ai réservé
      </Link>
    </div>
  );
}
