/** Métadonnées scrub : séquence d’images (fluide) + vidéo fallback. */
export const JEMCEE_SEQUENCE = {
  fps: 30,
  durationSec: 9.15,
  width: 1280,
  height: 720,
  frameCount: 274,
  framesPath: '/jemcee/sequence/frames/frame-{}.jpg',
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

/** Résout le chemin d’une frame 1-indexée. */
export function jemceeFrameSrc(index1, publicUrl = '') {
  const padded = String(index1).padStart(4, '0');
  const path = JEMCEE_SEQUENCE.framesPath.replace('{}', padded);
  return `${publicUrl || ''}${path}`;
}
