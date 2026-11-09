import { useEffect, useState } from 'react';
import { trackEvent, trackRendezVousClick } from '../../lib/analytics';
import { BookingScheduleConfirm } from '../booking/BookingScheduleConfirm';
import { JemceeContactForm } from './JemceeContactForm';

/** Outlook Bookings (même widget que /rendez-vous). */
export const JEMCEE_OUTLOOK_BOOKING_URL =
  'https://bookings.cloud.microsoft/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/0drfXmMdmEyiJTIZAMypRw2?ismsaljsauthenabled';

export const JEMCEE_OPEN_BOOKING_EVENT = 'jemcee-open-booking';

/** Déclenche l’affichage du calendrier + scroll vers le haut de l’iframe. */
export function openJemceeBooking() {
  window.dispatchEvent(new CustomEvent(JEMCEE_OPEN_BOOKING_EVENT));
}

/**
 * Rencontre exploratoire embarquée dans la landing jemcee.
 * Calendrier Outlook ou formulaire de contact — au choix.
 * Le calendrier ne se charge qu’au clic — évite le vol de scroll
 * (focus iframe Outlook) pendant la séquence cinématique.
 */
export function JemceeBookingSection() {
  const [mode, setMode] = useState(null); // null | 'calendar' | 'form'
  const [pendingScroll, setPendingScroll] = useState(false);

  useEffect(() => {
    trackEvent('view_item', {
      item_category: 'appointment',
      item_id: 'jemcee_booking_section',
    });
  }, []);

  useEffect(() => {
    const onOpen = () => {
      setMode('calendar');
      setPendingScroll(true);
    };
    window.addEventListener(JEMCEE_OPEN_BOOKING_EVENT, onOpen);
    return () => window.removeEventListener(JEMCEE_OPEN_BOOKING_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!pendingScroll || mode !== 'calendar') return;

    const scrollToIframe = () => {
      const el = document.getElementById('jemcee-calendrier');
      if (!el) return false;
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return true;
    };

    let tries = 0;
    const tick = () => {
      if (scrollToIframe() || tries > 20) {
        setPendingScroll(false);
        return;
      }
      tries += 1;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [pendingScroll, mode]);

  const revealCalendar = () => {
    setMode('calendar');
    setPendingScroll(true);
    trackRendezVousClick('jemcee_booking_reveal');
  };

  const revealForm = () => {
    setMode('form');
    trackEvent('select_content', {
      content_type: 'lead_form',
      item_id: 'jemcee_contact_reveal',
    });
    requestAnimationFrame(() => {
      document.getElementById('jemcee-contact-panel')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });
  };

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
          30 minutes. Gratuit. Sans engagement. Choisissez un créneau, ou laissez un message si
          vous préférez.
        </p>

        {mode === null ? (
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={revealCalendar}
                className="inline-flex items-center px-8 py-4 font-heading text-lg tracking-widest transition hover:bg-secondary"
                style={{ backgroundColor: '#ffffff', color: '#01233f' }}
                data-testid="jemcee-booking-reveal"
              >
                AFFICHER LE CALENDRIER
              </button>
              <button
                type="button"
                onClick={revealForm}
                className="inline-flex items-center border border-white/40 bg-white/5 px-8 py-4 font-heading text-lg tracking-widest text-white transition hover:border-white hover:bg-white/10"
                data-testid="jemcee-contact-reveal"
              >
                REMPLIR UN FORMULAIRE
              </button>
            </div>
            <a
              href={JEMCEE_OUTLOOK_BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackRendezVousClick('jemcee_outlook_external')}
              className="inline-flex text-sm text-secondary hover:underline"
            >
              Ouvrir le calendrier dans un nouvel onglet
            </a>
          </div>
        ) : (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
            {mode === 'calendar' ? (
              <>
                <button
                  type="button"
                  onClick={revealForm}
                  className="text-sm text-secondary hover:underline"
                  data-testid="jemcee-switch-to-form"
                >
                  Préférer un formulaire de contact
                </button>
                <a
                  href={JEMCEE_OUTLOOK_BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackRendezVousClick('jemcee_outlook_external')}
                  className="text-sm text-secondary hover:underline"
                >
                  Ouvrir dans un nouvel onglet
                </a>
              </>
            ) : (
              <button
                type="button"
                onClick={revealCalendar}
                className="text-sm text-secondary hover:underline"
                data-testid="jemcee-switch-to-calendar"
              >
                Préférer le calendrier de rendez-vous
              </button>
            )}
          </div>
        )}
      </div>

      {mode === 'calendar' ? (
        <>
          <div
            id="jemcee-calendrier"
            className="mx-auto mt-10 w-full max-w-5xl scroll-mt-20 overflow-hidden border border-white/10 bg-white"
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
          <div className="mx-auto mt-2 max-w-xl">
            <BookingScheduleConfirm source="jemcee" variant="dark" />
          </div>
        </>
      ) : null}

      {mode === 'form' ? (
        <div
          id="jemcee-contact-panel"
          className="mx-auto mt-10 w-full max-w-xl scroll-mt-20"
          data-testid="jemcee-contact-panel"
        >
          <JemceeContactForm />
        </div>
      ) : null}
    </section>
  );
}
