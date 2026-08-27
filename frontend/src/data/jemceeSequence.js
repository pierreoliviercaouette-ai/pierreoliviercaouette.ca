/** Métadonnées scrub : vidéo utilisateur continue (9,2 s @ 48 fps, fin notes + chronomètre). */
export const JEMCEE_SEQUENCE = {
  fps: 48,
  durationSec: 9.15,
  width: 1280,
  height: 720,
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  /** Fractions 0–1 alignées sur le parcours caméra de la vidéo source. */
  chapters: [
    { id: 'orbit', start: 0, end: 0.12 },
    { id: 'performance', start: 0.12, end: 0.38 },
    { id: 'securite', start: 0.4, end: 0.64 },
    { id: 'accompagnement', start: 0.66, end: 0.84 },
  ],
};
