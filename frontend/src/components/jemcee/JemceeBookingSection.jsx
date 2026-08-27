import { useEffect } from 'react';
import { trackEvent } from '../../lib/analytics';

/** Outlook Bookings (même widget que /rendez-vous). */
export const JEMCEE_OUTLOOK_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/';

/**
 * Rencontre exploratoire embarquée dans la landing jemcee.
 */
export function JemceeBookingSection() {
  useEffect(() => {
    trackEvent('view_item', {
      item_category: 'appointment',
      item_id: 'jemcee_booking_section',
    });
  }, []);

  return (
    <section
      id="reservation"
      className="relative scroll-mt-24 border-t border-white/10 px-4 py-16 md:px-6 md:py-24"
      style={{ backgroundColor: '#01101c' }}
      data-testid="jemcee-booking"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-heading text-sm tracking-[0.45em] text-secondary">
          RENCONTRE EXPLORATOIRE
        </p>
        <h2 className="mt-4 font-heading text-4xl leading-[0.95] text-white md:text-5xl">
          Réservez votre départ
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-base text-white/70">
          30 minutes. Gratuit. Sans engagement. Choisissez le créneau qui vous convient.
        </p>
        <a
          href={JEMCEE_OUTLOOK_BOOKING_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent('select_content', {
              content_type: 'cta',
              item_id: 'jemcee_outlook_external',
            })
          }
          className="mt-5 inline-flex text-sm text-secondary hover:underline"
        >
          Ouvrir le calendrier dans un nouvel onglet
        </a>
      </div>

      <div
        className="mx-auto mt-10 w-full max-w-5xl overflow-hidden border border-white/10 bg-white"
        data-testid="jemcee-booking-calendar"
      >
        <iframe
          src={JEMCEE_OUTLOOK_BOOKING_URL}
          className="block w-full"
          style={{ border: 0, height: 2200, overflow: 'hidden' }}
          title="Calendrier de rendez-vous · rencontre exploratoire"
          loading="lazy"
          scrolling="no"
          referrerPolicy="no-referrer-when-downgrade"
          allow="fullscreen"
        />
      </div>
    </section>
  );
}
