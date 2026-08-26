/** Métadonnées vidéo scrub GP3R (fichier dans /public/jemcee/). */
export const JEMCEE_SEQUENCE = {
  fps: 24,
  durationSec: 4,
  width: 1280,
  height: 720,
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  /** Chapitres en fraction de la durée vidéo (0–1) */
  chapters: [
    { id: 'performance', start: 0, end: 0.4 },
    { id: 'securite', start: 0.4, end: 0.72 },
    { id: 'accompagnement', start: 0.72, end: 1 },
  ],
};
