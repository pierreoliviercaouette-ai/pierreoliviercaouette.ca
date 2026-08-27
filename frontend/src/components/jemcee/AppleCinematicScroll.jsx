import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Vrai tactile (téléphone/tablette), pas un PC avec écran tactile. */
function isTouchPrimary() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: none) and (pointer: coarse)').matches;
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

function beatOpacity(progress, start, peakIn, peakOut, end) {
  if (progress < start || progress > end) return 0;
  if (progress < peakIn) return clamp01((progress - start) / Math.max(peakIn - start, 0.001));
  if (progress > peakOut) return clamp01(1 - (progress - peakOut) / Math.max(end - peakOut, 0.001));
  return 1;
}

function beatY(opacity) {
  return (1 - opacity) * 36;
}

function frameUrl(pattern, index1, publicUrl = '') {
  const padded = String(index1).padStart(4, '0');
  return `${publicUrl || ''}${pattern.replace('{}', padded)}`;
}

/** Dessine une image en cover ou contain dans le canvas. */
function drawFitted(ctx, img, cw, ch, mode) {
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  if (!iw || !ih || !cw || !ch) return;
  const scale =
    mode === 'contain' ? Math.min(cw / iw, ch / ih) : Math.max(cw / iw, ch / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = '#01233f';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

/**
 * Scroll cinématique type Apple.
 * Scrub via séquence d’images → canvas (fluide) ; vidéo en fallback.
 */
export function AppleCinematicScroll({
  videoSrc,
  posterSrc,
  framesPath,
  frameCount = 0,
  scrollHeightVh = 720,
  chapters = [],
  intro,
  outro,
  children,
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const framesRef = useRef([]);
  const lastFrameRef = useRef(-1);
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const rafRef = useRef(0);
  const lastUiRef = useRef(-1);
  const touchRef = useRef(false);
  const useFramesRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [trackVh, setTrackVh] = useState(scrollHeightVh);
  const [isTouch, setIsTouch] = useState(false);
  const [framesReady, setFramesReady] = useState(false);

  useEffect(() => {
    const touch = isTouchPrimary();
    touchRef.current = touch;
    setIsTouch(touch);
    setReducedMotion(prefersReducedMotion());
    setPortalReady(true);
    setTrackVh(touch ? Math.min(scrollHeightVh, 780) : scrollHeightVh);
    // Afficher l’UI immédiatement (frames/vidéo suivent en arrière-plan)
    setReady(true);
  }, [scrollHeightVh]);

  // Précharge la séquence d’images (priorité aux premières frames)
  useEffect(() => {
    if (!framesPath || frameCount < 2) return undefined;

    const publicUrl = process.env.PUBLIC_URL || '';
    const images = new Array(frameCount);
    let loaded = 0;
    let cancelled = false;
    const minReady = Math.min(24, frameCount);

    const mark = () => {
      loaded += 1;
      if (!cancelled && loaded >= minReady && !useFramesRef.current) {
        useFramesRef.current = true;
        setFramesReady(true);
        setReady(true);
      }
      if (!cancelled && loaded >= frameCount) {
        framesRef.current = images;
      }
    };

    for (let i = 1; i <= frameCount; i += 1) {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        images[i - 1] = img;
        framesRef.current = images;
        mark();
      };
      img.onerror = mark;
      img.src = frameUrl(framesPath, i, publicUrl);
    }

    return () => {
      cancelled = true;
    };
  }, [framesPath, frameCount]);

  // Fallback vidéo si pas de frames
  useEffect(() => {
    if (framesPath && frameCount >= 2) return undefined;
    const video = videoRef.current;
    if (!video) return undefined;

    const onLoaded = () => {
      setReady(true);
      video.pause();
      try {
        video.currentTime = 0;
      } catch {
        /* ignore */
      }
    };

    video.addEventListener('loadedmetadata', onLoaded);
    if (video.readyState >= 1) onLoaded();
    return () => video.removeEventListener('loadedmetadata', onLoaded);
  }, [videoSrc, portalReady, framesPath, frameCount]);

  useEffect(() => {
    const drawFrame = (p) => {
      const canvas = canvasRef.current;
      if (!canvas || !useFramesRef.current || frameCount < 2) return;
      const idx = Math.min(frameCount - 1, Math.max(0, Math.round(p * (frameCount - 1))));
      if (idx === lastFrameRef.current) return;
      let img = framesRef.current[idx];
      if (!img || !img.complete) {
        // Frame pas encore chargée : plus proche disponible
        for (let d = 1; d < 12; d += 1) {
          const a = framesRef.current[idx - d];
          const b = framesRef.current[idx + d];
          if (a?.complete) {
            img = a;
            break;
          }
          if (b?.complete) {
            img = b;
            break;
          }
        }
      }
      if (!img || !img.complete) return;
      const ctx = canvas.getContext('2d', { alpha: false });
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const cw = Math.max(1, Math.round(rect.width * dpr));
      const ch = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
      }
      drawFitted(ctx, img, cw, ch, touchRef.current ? 'contain' : 'cover');
      // Ne fige l’index que si la frame exacte est dispo (sinon on réessaiera)
      if (img === framesRef.current[idx]) lastFrameRef.current = idx;
    };

    const applyVideoFallback = (p) => {
      if (useFramesRef.current) return;
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const t = p * Math.max(video.duration - 0.04, 0);
      if (Math.abs(video.currentTime - t) < 0.02) return;
      try {
        if (typeof video.fastSeek === 'function') video.fastSeek(t);
        else video.currentTime = t;
      } catch {
        /* ignore */
      }
    };

    const syncPin = () => {
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;

      const rect = track.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = Math.max(track.offsetHeight - vh, 1);

      let mode = 'before';
      let p = 0;
      let top = Math.max(rect.top, 0);

      if (rect.top <= 0 && rect.bottom > vh) {
        mode = 'active';
        top = 0;
        p = clamp01(-rect.top / total);
      } else if (rect.bottom <= vh) {
        mode = 'after';
        top = rect.bottom - vh;
        p = 1;
      } else {
        mode = 'before';
        top = rect.top;
        p = 0;
      }

      targetRef.current = p;
      stage.style.top = `${top}px`;
      stage.dataset.pinMode = mode;

      let exitFade = 1;
      if (mode === 'after') {
        exitFade = clamp01(1 + top / (vh * 0.55));
      }
      const offscreen =
        (mode === 'before' && rect.top >= vh) || (mode === 'after' && exitFade < 0.02);
      stage.style.visibility = offscreen ? 'hidden' : 'visible';
      stage.style.opacity = offscreen ? '0' : String(exitFade);
    };

    const tick = () => {
      syncPin();
      const target = targetRef.current;
      const prev = smoothRef.current;
      // Suivi serré du scroll = sensation fluide (pas de “trainé” vidéo)
      const factor = reducedMotion ? 1 : 0.72;
      const next = prev + (target - prev) * factor;
      smoothRef.current = Math.abs(target - next) < 0.0004 ? target : next;

      drawFrame(smoothRef.current);
      applyVideoFallback(smoothRef.current);

      if (Math.abs(smoothRef.current - lastUiRef.current) > 0.004 || lastUiRef.current < 0) {
        lastUiRef.current = smoothRef.current;
        setProgress(smoothRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    syncPin();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('scroll', syncPin, { passive: true });
    window.addEventListener('resize', syncPin);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', syncPin);
      window.removeEventListener('resize', syncPin);
    };
  }, [reducedMotion, ready, portalReady, framesReady, frameCount]);

  const p = progress;
  const introOpacity = reducedMotion
    ? p < 0.12
      ? 1
      : 0
    : // Visible dès le premier pixel (peakIn = 0), puis fade-out
      beatOpacity(p, 0, 0, 0.08, 0.16);
  const outroOpacity = reducedMotion
    ? p >= 0.95
      ? 1
      : 0
    : beatOpacity(p, 0.94, 0.96, 1, 1.05);
  const chapterGate = 1 - clamp01(outroOpacity * 1.35);
  const mediaScale = reducedMotion ? 1 : isTouch ? 1 : 1.05 - p * 0.04 + outroOpacity * 0.03;
  const mediaBrightness = reducedMotion
    ? 0.75
    : 0.55 + p * 0.2 - outroOpacity * 0.18;

  const stage = (
    <div
      ref={stageRef}
      className="overflow-hidden bg-dark"
      style={{
        position: 'fixed',
        left: 0,
        right: 0,
        top: 0,
        width: '100%',
        height: '100svh',
        zIndex: 40,
        pointerEvents: 'none',
        touchAction: 'pan-y',
      }}
      data-testid="apple-cinematic-stage"
      data-progress={p.toFixed(3)}
    >
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: `scale(${mediaScale})`,
          filter: `brightness(${mediaBrightness})`,
        }}
      >
        <canvas
          ref={canvasRef}
          className={`pointer-events-none h-full w-full ${framesReady ? 'block' : 'hidden'}`}
          aria-hidden
        />
        <video
          ref={videoRef}
          className={`pointer-events-none h-full w-full ${
            framesReady ? 'hidden' : isTouch ? 'object-contain object-center' : 'object-cover'
          }`}
          src={videoSrc}
          poster={posterSrc}
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          aria-hidden
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(135deg, rgba(1,35,63,0.82) 0%, rgba(1,35,63,0.35) 48%, rgba(6,77,217,0.22) 100%)',
          opacity: 1 - outroOpacity * 0.35,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(ellipse 80% 70% at 50% 55%, rgba(1,35,63,0.15) 0%, rgba(1,35,63,0.78) 72%, rgba(1,20,40,0.92) 100%)',
          opacity: outroOpacity,
        }}
      />

      {/* Chargement discret : ne masque jamais l’intro */}
      {!ready && (
        <div className="pointer-events-none absolute bottom-16 left-1/2 z-30 -translate-x-1/2">
          <div className="h-1 w-28 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-1/2 animate-pulse bg-secondary" />
          </div>
        </div>
      )}

      {intro && (
        <div
          className="absolute inset-0 z-20 flex flex-col justify-center px-6 pt-20"
          style={{
            opacity: introOpacity,
            transform: `translateY(${beatY(introOpacity)}px)`,
            visibility: introOpacity < 0.02 ? 'hidden' : 'visible',
          }}
        >
          <div className="mx-auto w-full max-w-7xl">{intro(introOpacity)}</div>
        </div>
      )}

      {chapters.map((ch) => {
        const opacity =
          chapterGate *
          (reducedMotion
            ? p >= ch.start && p < ch.end
              ? 1
              : 0
            : beatOpacity(p, ch.start, ch.peakIn, ch.peakOut, ch.end));
        const fromRight = ch.align === 'right';
        return (
          <div
            key={ch.id}
            className="absolute inset-0 z-20 flex items-end px-6 pb-16 md:items-center md:pb-0"
            style={{
              opacity,
              transform: `translateY(${beatY(opacity)}px)`,
              visibility: opacity < 0.02 ? 'hidden' : 'visible',
              pointerEvents: 'none',
            }}
          >
            <div className={`mx-auto w-full max-w-7xl ${fromRight ? 'flex justify-end' : ''}`}>
              <div className={`w-full max-w-2xl ${fromRight ? 'md:text-right' : ''}`}>
                <p className="font-heading text-sm tracking-[0.4em] text-secondary">
                  {ch.chapterLabel}
                </p>
                <h2 className="mt-3 font-heading text-4xl leading-[0.95] text-white sm:text-5xl md:text-7xl">
                  {ch.title}
                </h2>
                <p
                  className={`mt-4 max-w-xl text-sm text-white/70 sm:text-base md:text-lg ${
                    fromRight ? 'md:ml-auto' : ''
                  }`}
                >
                  {ch.description}
                </p>
                <ul className="mt-6 grid gap-2.5 sm:mt-8 sm:gap-3 md:mt-10">
                  {ch.bullets.map((bullet, index) => {
                    const local = reducedMotion
                      ? opacity
                      : beatOpacity(
                          p,
                          ch.start + 0.04 + index * 0.035,
                          ch.start + 0.07 + index * 0.035,
                          ch.peakOut,
                          ch.end
                        );
                    const x = fromRight ? (1 - local) * 48 : (1 - local) * -48;
                    return (
                      <li
                        key={bullet.title}
                        className="flex items-start gap-3 border-l-2 border-secondary/60 bg-white/10 px-4 py-3 backdrop-blur-sm sm:gap-4 sm:px-5 sm:py-4"
                        style={{
                          opacity: local,
                          transform: `translateX(${x}px)`,
                        }}
                      >
                        <span className="font-heading text-xl text-secondary sm:text-2xl">
                          {bullet.num}
                        </span>
                        <span className="text-left">
                          <span className="block font-heading text-lg tracking-wide text-white sm:text-xl">
                            {bullet.title}
                          </span>
                          <span className="mt-1 block text-xs text-white/65 sm:text-sm">
                            {bullet.text}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        );
      })}

      {outro && (
        <div
          className="absolute inset-0 z-[25] flex flex-col items-center justify-center px-6 text-center"
          style={{
            opacity: outroOpacity,
            transform: `translateY(${(1 - outroOpacity) * 28}px) scale(${0.96 + outroOpacity * 0.04})`,
            visibility: outroOpacity < 0.02 ? 'hidden' : 'visible',
            pointerEvents: 'none',
          }}
        >
          <div className="mx-auto w-full max-w-3xl">{outro(outroOpacity)}</div>
        </div>
      )}

      <div className="absolute bottom-0 left-0 z-30 h-[3px] w-full bg-white/10">
        <div className="h-full origin-left bg-secondary" style={{ transform: `scaleX(${p})` }} />
      </div>
      <p
        className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 font-heading text-[11px] tracking-[0.35em] text-white/45"
        style={{ opacity: introOpacity > 0.4 ? introOpacity : 0 }}
      >
        DÉFILEZ
      </p>

      {typeof children === 'function' ? children(p) : children}
    </div>
  );

  const heightVh = trackVh;

  return (
    <>
      <section
        ref={trackRef}
        className="relative w-full"
        style={{ height: `${heightVh}vh` }}
        data-testid="apple-cinematic-scroll"
        aria-label="Séquence cinématique"
      >
        {chapters.map((ch) => (
          <div
            key={`anchor-${ch.id}`}
            id={ch.id}
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `${(ch.anchor ?? ch.start) * 100}%` }}
            aria-hidden
          />
        ))}
      </section>

      {portalReady ? createPortal(stage, document.body) : null}
    </>
  );
}
