import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function clamp01(v) {
  return Math.min(1, Math.max(0, v));
}

/** Fenêtre Apple : fade-in → hold → fade-out */
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
 * Défilement cinématique type product page Apple :
 * une piste sticky longue, scrub vidéo amorti (lerp), beats de texte synchronisés.
 */
export function AppleCinematicScroll({
  videoSrc,
  posterSrc,
  scrollHeightVh = 520,
  chapters = [],
  intro,
  children,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const targetRef = useRef(0);
  const smoothRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingTimeRef = useRef(null);
  const rafRef = useRef(0);
  const lastUiRef = useRef(-1);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

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
      const pending = pendingTimeRef.current;
      if (
        pending != null &&
        Number.isFinite(video.duration) &&
        Math.abs(pending - video.currentTime) > 0.03
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
    };
  }, [videoSrc]);

  useEffect(() => {
    if (reducedMotion) {
      setProgress(0.2);
      return undefined;
    }

    const readTarget = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      targetRef.current = clamp01(-rect.top / total);
    };

    const applyVideo = (p) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const t = p * Math.max(video.duration - 0.05, 0);
      pendingTimeRef.current = t;
      if (seekingRef.current) return;
      seekingRef.current = true;
      try {
        video.currentTime = t;
      } catch {
        seekingRef.current = false;
      }
    };

    const tick = () => {
      readTarget();
      const target = targetRef.current;
      const prev = smoothRef.current;
      // Amortissement type Apple — suit le scroll sans saccades
      const next = prev + (target - prev) * 0.14;
      smoothRef.current = Math.abs(target - next) < 0.0004 ? target : next;
      applyVideo(smoothRef.current);

      if (Math.abs(smoothRef.current - lastUiRef.current) > 0.002) {
        lastUiRef.current = smoothRef.current;
        setProgress(smoothRef.current);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    readTarget();
    rafRef.current = requestAnimationFrame(tick);
    window.addEventListener('scroll', readTarget, { passive: true });
    window.addEventListener('resize', readTarget);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', readTarget);
      window.removeEventListener('resize', readTarget);
    };
  }, [reducedMotion, ready]);

  useEffect(() => {
    if (!ready || !reducedMotion) return;
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    try {
      video.currentTime = video.duration * 0.25;
    } catch {
      /* ignore */
    }
  }, [ready, reducedMotion]);

  const p = reducedMotion ? 0.22 : progress;
  const introOpacity = reducedMotion
    ? 1
    : beatOpacity(p, 0, 0.02, 0.08, 0.14);
  const mediaScale = reducedMotion ? 1 : 1.08 - p * 0.08;
  const mediaBrightness = reducedMotion ? 0.55 : 0.35 + p * 0.45;

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: reducedMotion ? '100vh' : `${scrollHeightVh}vh` }}
      data-testid="apple-cinematic-scroll"
    >
      {/* Ancres pour #performance / #securite / #accompagnement */}
      {!reducedMotion &&
        chapters.map((ch) => (
          <div
            key={`anchor-${ch.id}`}
            id={ch.id}
            className="pointer-events-none absolute left-0 h-px w-px"
            style={{ top: `${(ch.anchor ?? ch.start) * 100}%` }}
            aria-hidden
          />
        ))}

      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-dark">
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: `scale(${mediaScale})`,
            filter: `brightness(${mediaBrightness})`,
          }}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            src={videoSrc}
            poster={posterSrc}
            muted
            playsInline
            preload="auto"
            aria-hidden
          />
        </div>

        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(135deg, rgba(1,35,63,0.82) 0%, rgba(1,35,63,0.35) 48%, rgba(6,77,217,0.22) 100%)',
          }}
        />

        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-dark/90">
            <div className="h-1 w-36 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-1/2 animate-pulse bg-secondary" />
            </div>
          </div>
        )}

        {/* Intro hero */}
        {intro && (
          <div
            className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-center px-6 pt-20"
            style={{
              opacity: introOpacity,
              transform: `translateY(${beatY(introOpacity)}px)`,
              visibility: introOpacity < 0.02 ? 'hidden' : 'visible',
            }}
          >
            <div className="mx-auto w-full max-w-7xl">{intro(introOpacity)}</div>
          </div>
        )}

        {/* Chapitres */}
        {chapters.map((ch) => {
          const opacity = reducedMotion
            ? ch.id === chapters[0]?.id
              ? 1
              : 0
            : beatOpacity(p, ch.start, ch.peakIn, ch.peakOut, ch.end);
          const fromRight = ch.align === 'right';
          return (
            <div
              key={ch.id}
              className="pointer-events-none absolute inset-0 z-20 flex items-end px-6 pb-16 md:items-center md:pb-0"
              style={{
                opacity,
                transform: `translateY(${beatY(opacity)}px)`,
                visibility: opacity < 0.02 ? 'hidden' : 'visible',
              }}
            >
              <div
                className={`mx-auto w-full max-w-7xl ${
                  fromRight ? 'flex justify-end' : ''
                }`}
              >
                <div className={`w-full max-w-2xl ${fromRight ? 'md:text-right' : ''}`}>
                  <p className="font-heading text-sm tracking-[0.4em] text-secondary">
                    {ch.chapterLabel}
                  </p>
                  <h2 className="mt-3 font-heading text-5xl leading-[0.95] text-white md:text-7xl">
                    {ch.title}
                  </h2>
                  <p
                    className={`mt-4 max-w-xl text-base text-white/70 md:text-lg ${
                      fromRight ? 'md:ml-auto' : ''
                    }`}
                  >
                    {ch.description}
                  </p>
                  <ul className="mt-8 grid gap-3 md:mt-10">
                    {ch.bullets.map((bullet, index) => {
                      const local = reducedMotion
                        ? 1
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
                          className="flex items-start gap-4 border-l-2 border-secondary/60 bg-white/10 px-5 py-4 backdrop-blur-sm"
                          style={{
                            opacity: local,
                            transform: `translateX(${x}px)`,
                          }}
                        >
                          <span className="font-heading text-2xl text-secondary">
                            {bullet.num}
                          </span>
                          <span className="text-left">
                            <span className="block font-heading text-xl tracking-wide text-white">
                              {bullet.title}
                            </span>
                            <span className="mt-1 block text-sm text-white/65">
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

        {/* Barre de progression + hint */}
        <div className="pointer-events-none absolute bottom-0 left-0 z-30 h-[3px] w-full bg-white/10">
          <div
            className="h-full origin-left bg-secondary"
            style={{ transform: `scaleX(${p})` }}
          />
        </div>
        <p
          className="pointer-events-none absolute bottom-6 left-1/2 z-30 -translate-x-1/2 font-heading text-[11px] tracking-[0.35em] text-white/45"
          style={{ opacity: introOpacity > 0.4 ? introOpacity : 0 }}
        >
          DÉFILEZ
        </p>

        {typeof children === 'function' ? children(p) : children}
      </div>
    </section>
  );
}
