/** Outlook Bookings (iframe embarquée sur /rendez-vous). */

export const OUTLOOK_BOOKING_URL =
  'https://outlook.office.com/book/PierreOlivierCaouetteiAGroupefinancier@ia.ca/';

/**
 * Confirmation explicite après réservation dans l’iframe Outlook
 * (seul moyen de tirer Schedule sans accès Automate/Graph).
 */
export const BOOKING_THANKS_PATH = '/rendez-vous/merci';
export const BOOKING_THANKS_URL = `https://www.pierreoliviercaouette.ca${BOOKING_THANKS_PATH}`;
