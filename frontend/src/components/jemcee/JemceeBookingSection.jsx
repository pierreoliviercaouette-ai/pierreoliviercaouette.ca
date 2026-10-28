import { useEffect, useState } from 'react';
import { trackEvent } from '../../lib/analytics';

/** Outlook Bookings (même widget que /rendez-vous). */
export const JEMCEE_OUTLOOK_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/sHKjTMMLj0SBLVs0u-Mr5g2?ismsaljsauthenabled';

/**
 * Rencontre exploratoire embarquée dans la landing jemcee.
 * Le calendrier ne se charge qu’au clic — évite le vol de scroll
 * (focus iframe Outlook) pendant la séquence cinématique.
 */
export function JemceeBookingSection() {
  const [showCalendar, setShowCalendar] = useState(false);

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
      style={{ backgroundColor: '#01101c', overflowAnchor: 'none' }}
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

        {!showCalendar ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                setShowCalendar(true);
                trackEvent('select_content', {
                  content_type: 'cta',
                  item_id: 'jemcee_booking_reveal',
                });
              }}
              className="inline-flex items-center px-8 py-4 font-heading text-lg tracking-widest transition hover:bg-secondary"
              style={{ backgroundColor: '#ffffff', color: '#01233f' }}
              data-testid="jemcee-booking-reveal"
            >
              AFFICHER LE CALENDRIER
            </button>
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
              className="inline-flex text-sm text-secondary hover:underline"
            >
              Ouvrir dans un nouvel onglet
            </a>
          </div>
        ) : (
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
        )}
      </div>

      {showCalendar ? (
        <div
          className="mx-auto mt-10 w-full max-w-5xl overflow-hidden border border-white/10 bg-white"
          data-testid="jemcee-booking-calendar"
          style={{ overflowAnchor: 'none' }}
        >
          <iframe
            src={JEMCEE_OUTLOOK_BOOKING_URL}
            className="block w-full"
            style={{ border: 0, height: 2200, overflow: 'hidden' }}
            title="Calendrier de rendez-vous · rencontre exploratoire"
            scrolling="no"
            tabIndex={-1}
            referrerPolicy="no-referrer-when-downgrade"
            allow="fullscreen"
          />
        </div>
      ) : null}
    </section>
  );
}
