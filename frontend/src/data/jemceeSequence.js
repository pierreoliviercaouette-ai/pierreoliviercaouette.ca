/** Métadonnées scrub : vidéo utilisateur continue (10s). */
export const JEMCEE_SEQUENCE = {
  fps: 24,
  durationSec: 10,
  width: 1280,
  height: 720,
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  /** Fractions 0–1 alignées sur le parcours caméra de la vidéo source. */
  chapters: [
    { id: 'orbit', start: 0, end: 0.15 },
    { id: 'performance', start: 0.15, end: 0.4 },
    { id: 'securite', start: 0.4, end: 0.75 },
    { id: 'accompagnement', start: 0.75, end: 1 },
  ],
};
