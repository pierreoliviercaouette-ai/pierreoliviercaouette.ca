/** Métadonnées vidéo scrub : référence utilisateur + fin copilote. */
export const JEMCEE_SEQUENCE = {
  fps: 24,
  durationSec: 12.5,
  width: 1280,
  height: 720,
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  /** Chapitres en fraction de la durée vidéo (0–1) */
  chapters: [
    { id: 'orbit', start: 0, end: 0.2 },
    { id: 'performance', start: 0.2, end: 0.45 },
    { id: 'securite', start: 0.45, end: 0.78 },
    { id: 'accompagnement', start: 0.78, end: 1 },
  ],
};
