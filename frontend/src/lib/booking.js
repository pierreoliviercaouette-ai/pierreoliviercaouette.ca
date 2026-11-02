/** Outlook Bookings (iframe embarquée sur /rendez-vous). */

export const OUTLOOK_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/';

/**
 * Bookings dédié aux landings Meta Ads (/campagnes/* → /rendez-vous/campagne).
 * Service Microsoft Bookings spécifique (lien direct).
 */
export const CAMPAGNE_BOOKING_URL =
  'https://bookings.cloud.microsoft/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/s/ZLbz0RzYm0y0fzJRPcuIEg2?ismsaljsauthenabled';

export const CAMPAGNE_RDV_PATH = '/rendez-vous/campagne';

/**
 * Confirmation explicite après réservation dans l’iframe Outlook
 * (seul moyen de tirer Schedule sans accès Automate/Graph).
 */
export const BOOKING_THANKS_PATH = '/rendez-vous/merci';
export const BOOKING_THANKS_URL = `https://www.pierreoliviercaouette.ca${BOOKING_THANKS_PATH}`;
