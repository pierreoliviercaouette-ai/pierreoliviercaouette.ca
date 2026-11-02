import { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { BookingScheduleConfirm } from '../components/booking/BookingScheduleConfirm';
import { CAMPAGNE_BOOKING_URL, CAMPAGNE_RDV_PATH } from '../lib/booking';
import { trackEvent, trackRendezVousClick } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

/**
 * Page RDV dédiée aux landings Meta Ads : iframe Bookings campagne uniquement.
 */
export function CampagneAppointment() {
  useSeoMeta({
    title: 'Réserver 15 minutes | Conseiller en sécurité financière',
    description:
      'Choisissez un créneau pour une consultation gratuite et sans engagement.',
    canonicalPath: CAMPAGNE_RDV_PATH,
  });

  useEffect(() => {
    trackEvent('view_item', {
      item_category: 'appointment',
      item_id: 'campagne_booking_page',
    });
  }, []);

  return (
    <main className="min-h-screen bg-light" data-testid="campagne-appointment-page">
      <PageHero
        badge="Rendez-vous"
        title="Réserver 15 minutes"
        description="Consultation gratuite et sans engagement. Choisissez le moment qui vous convient."
        minHeightClass="min-h-[28vh] md:min-h-[32vh]"
      />

      <section className="pt-6 md:pt-8 pb-12 md:pb-16">
        <div className="container-max px-4 md:px-8 text-center mb-6">
          <a
            href={CAMPAGNE_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackRendezVousClick('campagne_booking_external')}
            className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
          >
            Ouvrir dans un nouvel onglet
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        <div
          className="w-full h-[2400px] bg-white border-y border-prestige-beige/60 overflow-hidden"
          data-testid="campagne-booking-calendar"
        >
          <iframe
            src={CAMPAGNE_BOOKING_URL}
            className="block w-full h-full"
            style={{ border: 0, overflow: 'hidden' }}
            title="Calendrier de rendez-vous — campagne"
            loading="eager"
            scrolling="no"
            referrerPolicy="no-referrer-when-downgrade"
            allow="fullscreen"
          />
        </div>

        <div className="container-max px-4 md:px-8">
          <BookingScheduleConfirm source="campagne_rendez_vous" />
        </div>
      </section>
    </main>
  );
}
