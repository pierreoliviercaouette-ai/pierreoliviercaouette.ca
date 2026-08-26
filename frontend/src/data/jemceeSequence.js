/** Métadonnées vidéo scrub showroom → moteur → habitacle → copilote. */
export const JEMCEE_SEQUENCE = {
  fps: 24,
  durationSec: 10,
  width: 1280,
  height: 720,
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  /** Chapitres en fraction de la durée vidéo (0–1) */
  chapters: [
    { id: 'orbit', start: 0, end: 0.22 },
    { id: 'performance', start: 0.22, end: 0.44 },
    { id: 'securite', start: 0.44, end: 0.66 },
    { id: 'accompagnement', start: 0.66, end: 1 },
  ],
};
