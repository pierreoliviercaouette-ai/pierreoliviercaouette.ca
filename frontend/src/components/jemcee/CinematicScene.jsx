import { useEffect, useRef, useState } from 'react';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Scène cinématique sticky (modèle rallye) :
 * scroll → progress 0–1 → scrub vidéo + fade texte + barre de progression.
 */
export function CinematicScene({
  id,
  chapterLabel,
  title,
  description,
  bullets,
  videoSrc,
  posterSrc,
  align = 'left',
  scrollHeightVh = 320,
}) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingTimeRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    const onSeeked = () => {
      seekingRef.current = false;
      const pending = pendingTimeRef.current;
      if (
        pending != null &&
        Number.isFinite(video.duration) &&
        Math.abs(pending - video.currentTime) > 0.04
      ) {
        seekingRef.current = true;
        try {
          video.currentTime = pending;
        } catch {
          seekingRef.current = false;
        }
      }
    };

    video.addEventListener('seeked', onSeeked);
    return () => video.removeEventListener('seeked', onSeeked);
  }, []);

  useEffect(() => {
    if (reducedMotion) return undefined;

    const applyTime = (time) => {
      const video = videoRef.current;
      if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
      const clamped = Math.min(Math.max(time, 0), Math.max(video.duration - 0.05, 0));
      pendingTimeRef.current = clamped;
      if (seekingRef.current) return;
      seekingRef.current = true;
      try {
        video.currentTime = clamped;
      } catch {
        seekingRef.current = false;
      }
    };

    const update = () => {
      const el = sectionRef.current;
      const video = videoRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const p = scrolled / total;
      setProgress(p);
      if (video && Number.isFinite(video.duration)) {
        applyTime(p * video.duration);
      }
    };

    const onScroll = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [reducedMotion]);

  const contentOpacity = reducedMotion ? 1 : Math.min(1, Math.max(0, (progress - 0.08) / 0.22));
  const contentY = reducedMotion ? 0 : (1 - contentOpacity) * 40;
  const videoOpacity = reducedMotion ? 0.35 : 0.15 + progress * 0.55;
  const videoScale = reducedMotion ? 1 : 1.12 - progress * 0.12;
  const fromRight = align === 'right';

  return (
    <section
      id={id}
      ref={sectionRef}
      className="relative scroll-mt-0"
      style={{ minHeight: reducedMotion ? '100vh' : `${scrollHeightVh}vh` }}
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-dark">
        <div
          className="absolute inset-0"
          style={{
            opacity: videoOpacity,
            transform: `scale(${videoScale})`,
            transition: reducedMotion ? undefined : 'opacity 0.05s linear',
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
              'linear-gradient(135deg, rgba(1,35,63,0.92) 0%, rgba(1,35,63,0.55) 45%, rgba(6,77,217,0.28) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: fromRight
              ? 'linear-gradient(90deg, transparent 0%, rgba(1,35,63,0.15) 40%, rgba(1,35,63,0.82) 100%)'
              : 'linear-gradient(270deg, transparent 0%, rgba(1,35,63,0.15) 40%, rgba(1,35,63,0.82) 100%)',
          }}
        />

        <div className="pointer-events-none relative mx-auto flex h-full max-w-7xl items-end px-6 pb-16 md:items-center md:pb-0">
          <div
            className={`w-full max-w-2xl ${fromRight ? 'md:ml-auto md:text-right' : ''}`}
            style={{
              opacity: contentOpacity,
              transform: `translateY(${contentY}px)`,
            }}
          >
            <p className="font-heading text-sm tracking-[0.4em] text-secondary">{chapterLabel}</p>
            <h2 className="mt-3 font-heading text-5xl leading-[0.95] text-white md:text-7xl">
              {title}
            </h2>
            <p
              className={`mt-4 max-w-xl text-base text-white/70 md:text-lg ${
                fromRight ? 'md:ml-auto' : ''
              }`}
            >
              {description}
            </p>
            <ul className="mt-8 grid gap-3 md:mt-10">
              {bullets.map((bullet, index) => {
                const reveal = reducedMotion
                  ? 1
                  : Math.min(1, Math.max(0, (progress - (0.28 + index * 0.12)) / 0.14));
                const x = fromRight ? (1 - reveal) * 40 : (1 - reveal) * -40;
                return (
                  <li
                    key={bullet.title}
                    className="group flex items-start gap-4 border-l-2 border-secondary/60 bg-white/10 px-5 py-4 backdrop-blur-sm"
                    style={{
                      opacity: reveal,
                      transform: `translateX(${x}px)`,
                    }}
                  >
                    <span className="font-heading text-2xl text-secondary">{bullet.num}</span>
                    <span className="text-left">
                      <span className="block font-heading text-xl tracking-wide text-white">
                        {bullet.title}
                      </span>
                      <span className="mt-1 block text-sm text-white/65">{bullet.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-0 left-0 h-[3px] w-full bg-white/15">
          <div
            className="h-full origin-left bg-secondary"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </section>
  );
}
