import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '../components/layout/PageHero';
import { BookingScheduleConfirm } from '../components/booking/BookingScheduleConfirm';
import { CampagneLeadForm } from '../components/campagne/CampagneLeadForm';
import { CAMPAGNE_BOOKING_URL, CAMPAGNE_RDV_PATH } from '../lib/booking';
import { useBookingsEmbedGate } from '../hooks/useBookingsEmbedGate';
import { trackEvent, trackRendezVousClick } from '../lib/analytics';
import { useSeoMeta } from '../lib/seo';

function campagneSlugFromSearch(search) {
  const params = new URLSearchParams(
    typeof search === 'string' ? search.replace(/^\?/, '') : ''
  );
  const content = params.get('utm_content') || '';
  const fromContent = content.replace(/_landing$/i, '').trim();
  return fromContent || 'campagne';
}

/**
 * Page RDV dédiée aux landings Meta Ads : iframe Bookings campagne.
 * Probe réseau + timeout 30 s → formulaire si Microsoft refuse / ne répond pas.
 * (onLoad seul est insuffisant : ERR_CONNECTION_REFUSED charge une page d’erreur.)
 */
export function CampagneAppointment() {
  const location = useLocation();
  const slug = useMemo(
    () => campagneSlugFromSearch(location.search),
    [location.search]
  );

  const { isLoading, showFallback, forceFallback } = useBookingsEmbedGate(
    CAMPAGNE_BOOKING_URL,
    {
      onTimeout: (reason) => {
        trackEvent('select_content', {
          content_type: 'booking_fallback',
          item_id: 'campagne_booking_iframe_timeout',
          item_variant: slug,
          method: reason || 'timeout',
        });
      },
    }
  );

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
        description={
          showFallback
            ? 'Le calendrier Microsoft est inaccessible. Laisse tes coordonnées — je te rappelle pour caler le créneau.'
            : 'Consultation gratuite et sans engagement. Choisissez le moment qui vous convient.'
        }
        minHeightClass="min-h-[28vh] md:min-h-[32vh]"
      />

      <section className="pt-6 md:pt-8 pb-12 md:pb-16">
        {showFallback ? (
          <div
            className="container-max mx-auto max-w-lg px-4 md:px-8"
            data-testid="campagne-booking-fallback"
          >
            <p className="mb-6 text-center text-sm leading-relaxed text-prestige-taupe">
              Tu peux aussi{' '}
              <a
                href={CAMPAGNE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackRendezVousClick('campagne_booking_external_fallback')}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                réessayer le calendrier dans un nouvel onglet
              </a>
              .
            </p>
            <CampagneLeadForm
              slug={slug}
              subjectDefault={`Campagne ${slug} — rappel RDV (calendrier indisponible)`}
              messagePlaceholder="Ex. : dispo en fin de journée, ou un créneau préféré…"
              submitLabel="Demander un rappel"
              successTitle="Demande reçue"
              successBody="Merci. Je te rappelle rapidement pour caler les 15 minutes."
              title="Je te rappelle pour caler le RDV"
              subline="Sans calendrier Microsoft — laisse ton cell, je te recontacte."
              requireCompany={false}
              requireMessage={false}
              phoneHint="Idéal pour le rappel"
              trustLine="Tes infos servent uniquement au rappel. Contenu éducatif — pas un conseil personnalisé. CSF · Victoriaville."
            />
          </div>
        ) : (
          <>
            <div className="container-max mb-6 px-4 text-center md:px-8">
              <a
                href={CAMPAGNE_BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackRendezVousClick('campagne_booking_external')}
                className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
              >
                Ouvrir dans un nouvel onglet
                <ArrowRight className="h-4 w-4" />
              </a>
              {isLoading ? (
                <p
                  className="mt-3 text-xs text-prestige-taupe"
                  data-testid="campagne-booking-loading-hint"
                >
                  Vérification du calendrier Microsoft…
                </p>
              ) : null}
              <p className="mt-3 text-xs text-prestige-taupe">
                Le calendrier ne charge pas ?{' '}
                <button
                  type="button"
                  onClick={forceFallback}
                  className="font-medium text-primary underline-offset-2 hover:underline"
                  data-testid="campagne-booking-force-fallback"
                >
                  Laisse tes coordonnées
                </button>
              </p>
            </div>

            <div
              className="h-[2400px] w-full overflow-hidden border-y border-prestige-beige/60 bg-white"
              data-testid="campagne-booking-calendar"
            >
              <iframe
                src={CAMPAGNE_BOOKING_URL}
                className="block h-full w-full"
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
          </>
        )}
      </section>
    </main>
  );
}
