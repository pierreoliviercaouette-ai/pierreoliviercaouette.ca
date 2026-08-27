/** Métadonnées scrub : séquence d’images (fluide) + vidéo fallback. */
export const JEMCEE_SEQUENCE = {
  fps: 30,
  durationSec: 9.15,
  width: 1280,
  height: 720,
  /** 236 @30fps (0–7.87s) + 112 @90fps (7.87s–fin) pour densifier le ch.03 */
  frameCount: 348,
  baseFrameCount: 236,
  denseSplit: 0.86,
  framesPath: '/jemcee/sequence/frames/frame-{}.jpg',
  videoSrc: '/jemcee/pillars-sequence.mp4',
  posterSrc: '/jemcee/engine-bay.jpg',
  /**
   * Fenêtres de scroll égales pour les 3 chapitres (hors intro / outro).
   * Chaque chapitre ≈ 26 % du scroll total.
   */
  chapters: [
    { id: 'orbit', start: 0, end: 0.1 },
    { id: 'performance', start: 0.1, end: 0.36 },
    { id: 'securite', start: 0.36, end: 0.62 },
    { id: 'accompagnement', start: 0.62, end: 0.88 },
  ],
  /**
   * Remap scroll → média : temps de lecture égal par chapitre,
   * tout en gardant le sync visuel (notes/chrono au ch.03).
   */
  scrollToMedia: [
    [0, 0],
    [0.1, 0.12],
    [0.36, 0.4],
    [0.62, 0.86],
    [0.88, 0.94],
    [1, 1],
  ],
};

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/** Interpol linear par morceaux scroll → média. */
export function mapScrollToMedia(scrollProgress, keypoints = JEMCEE_SEQUENCE.scrollToMedia) {
  const p = clamp01(scrollProgress);
  const pts = keypoints;
  for (let i = 0; i < pts.length - 1; i += 1) {
    const [s0, v0] = pts[i];
    const [s1, v1] = pts[i + 1];
    if (p >= s0 && p <= s1) {
      const t = (p - s0) / Math.max(s1 - s0, 0.0001);
      return v0 + (v1 - v0) * t;
    }
  }
  return p;
}

/**
 * Média → index de frame (densité plus élevée après denseSplit pour le ch.03).
 */
export function mediaToFrameIndex(
  mediaProgress,
  {
    frameCount = JEMCEE_SEQUENCE.frameCount,
    baseFrameCount = JEMCEE_SEQUENCE.baseFrameCount,
    denseSplit = JEMCEE_SEQUENCE.denseSplit,
  } = {}
) {
  const m = clamp01(mediaProgress);
  const denseCount = Math.max(1, frameCount - baseFrameCount);
  if (m <= denseSplit) {
    return Math.round((m / Math.max(denseSplit, 0.0001)) * (baseFrameCount - 1));
  }
  const t = (m - denseSplit) / Math.max(1 - denseSplit, 0.0001);
  return Math.min(frameCount - 1, baseFrameCount + Math.round(t * (denseCount - 1)));
}

/** Résout le chemin d’une frame 1-indexée. */
export function jemceeFrameSrc(index1, publicUrl = '') {
  const padded = String(index1).padStart(4, '0');
  const path = JEMCEE_SEQUENCE.framesPath.replace('{}', padded);
  return `${publicUrl || ''}${path}`;
}
