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

/**
 * Scroll cinématique type Apple.
 * Piste haute + stage fixed en portal (pin fiable desktop).
 * Sur tactile : scrub plus léger + piste un peu plus courte.
 */
export function AppleCinematicScroll({
  videoSrc,
  posterSrc,
  scrollHeightVh = 720,
  chapters = [],
  intro,
  outro,
  children,
}) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const videoRef = useRef(null);
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingTimeRef = useRef(null);
  const seekWatchdogRef = useRef(0);
  const rafRef = useRef(0);
  const lastUiRef = useRef(-1);
  const touchRef = useRef(false);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [portalReady, setPortalReady] = useState(false);
  const [trackVh, setTrackVh] = useState(scrollHeightVh);

  useEffect(() => {
    const touch = isTouchPrimary();
    touchRef.current = touch;
    setReducedMotion(prefersReducedMotion());
    setPortalReady(true);
    setTrackVh(touch ? Math.min(scrollHeightVh, 520) : scrollHeightVh);
  }, [scrollHeightVh]);

  useEffect(() => {
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

    const onSeeked = () => {
      seekingRef.current = false;
      window.clearTimeout(seekWatchdogRef.current);
      const pending = pendingTimeRef.current;
      const threshold = touchRef.current ? 0.12 : 0.05;
      if (
        pending != null &&
        Number.isFinite(video.duration) &&
        Math.abs(pending - video.currentTime) > threshold
      ) {
        seekingRef.current = true;
        try {
          video.currentTime = pending;
        } catch {
          seekingRef.current = false;
        }
      }
    };

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    if (video.readyState >= 1) onLoaded();

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
      window.clearTimeout(seekWatchdogRef.current);
    };
  }, [videoSrc, portalReady]);

  useEffect(() => {
    const applyVideo = (p) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const t = p * Math.max(video.duration - 0.04, 0);
      pendingTimeRef.current = t;
      if (seekingRef.current) return;
      const minDelta = touchRef.current ? 0.1 : 0.04;
      if (Math.abs(video.currentTime - t) < minDelta) return;
      seekingRef.current = true;
      try {
        video.currentTime = t;
      } catch {
        seekingRef.current = false;
        return;
      }
      window.clearTimeout(seekWatchdogRef.current);
      seekWatchdogRef.current = window.setTimeout(() => {
        seekingRef.current = false;
      }, touchRef.current ? 280 : 180);
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
      const factor = reducedMotion ? 1 : touchRef.current ? 0.5 : 0.28;
      const next = prev + (target - prev) * factor;
      smoothRef.current = Math.abs(target - next) < 0.0008 ? target : next;
      applyVideo(smoothRef.current);

      const uiStep = touchRef.current ? 0.01 : 0.003;
      if (Math.abs(smoothRef.current - lastUiRef.current) > uiStep) {
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
  }, [reducedMotion, ready, portalReady]);

  const p = progress;
  const introOpacity = reducedMotion
    ? p < 0.14
      ? 1
      : 0
    : beatOpacity(p, 0, 0.02, 0.08, 0.15);
  const outroOpacity = reducedMotion
    ? p >= 0.9
      ? 1
      : 0
    : beatOpacity(p, 0.88, 0.93, 1, 1.05);
  const mediaScale = reducedMotion ? 1 : 1.05 - p * 0.04 + outroOpacity * 0.03;
  const mediaBrightness = reducedMotion ? 0.55 : 0.42 + p * 0.28 - outroOpacity * 0.18;

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
        // Critique mobile/PC : le calque ne doit jamais capturer le scroll
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
        <video
          ref={videoRef}
          className="pointer-events-none h-full w-full object-cover"
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

      {!ready && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-dark/90">
          <div className="h-1 w-36 overflow-hidden rounded-full bg-white/15">
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
        const opacity = reducedMotion
          ? p >= ch.start && p < ch.end
            ? 1
            : 0
          : beatOpacity(p, ch.start, ch.peakIn, ch.peakOut, ch.end);
        const fromRight = ch.align === 'right';
        return (
          <div
            key={ch.id}
            className="absolute inset-0 z-20 flex items-end px-6 pb-16 md:items-center md:pb-0"
            style={{
              opacity,
              transform: `translateY(${beatY(opacity)}px)`,
              visibility: opacity < 0.02 ? 'hidden' : 'visible',
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

  const heightVh = reducedMotion ? 100 : trackVh;

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
