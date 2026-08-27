/** Métadonnées scrub : WRX → capot → habitacle → copilote passager. */
export const JEMCEE_SEQUENCE = {
  fps: 24,
  durationSec: 10,
  width: 1280,
  height: 720,
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  chapters: [
    { id: 'orbit', start: 0, end: 0.22 },
    { id: 'performance', start: 0.22, end: 0.5 },
    { id: 'securite', start: 0.5, end: 0.72 },
    { id: 'accompagnement', start: 0.72, end: 1 },
  ],
};
