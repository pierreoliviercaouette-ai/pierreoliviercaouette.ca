import { useCallback, useEffect, useRef, useState } from 'react';

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Cinematic scroll-driven video scrub (sticky full-viewport).
 * Maps document scroll progress → video.currentTime.
 */
export function ScrollVideoScrub({
  src,
  poster,
  scrollHeightVh = 300,
  className = '',
  onProgress,
  children,
}) {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const rafRef = useRef(0);
  const seekingRef = useRef(false);
  const pendingTimeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  const applyTime = useCallback((time) => {
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

    video.addEventListener('loadedmetadata', onLoaded);
    video.addEventListener('seeked', onSeeked);
    if (video.readyState >= 1) onLoaded();

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded);
      video.removeEventListener('seeked', onSeeked);
    };
  }, []);

  useEffect(() => {
    if (!ready || reducedMotion) return undefined;

    const update = () => {
      const el = containerRef.current;
      const video = videoRef.current;
      if (!el || !video || !Number.isFinite(video.duration) || video.duration <= 0) return;

      const rect = el.getBoundingClientRect();
      const total = Math.max(el.offsetHeight - window.innerHeight, 1);
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const progress = scrolled / total;

      applyTime(progress * video.duration);
      onProgress?.(progress, progress * video.duration);
    };

    const onScrollOrResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [ready, reducedMotion, applyTime, onProgress]);

  useEffect(() => {
    if (!ready || !reducedMotion) return;
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration)) return;
    try {
      video.currentTime = video.duration * 0.35;
    } catch {
      /* ignore */
    }
  }, [ready, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: reducedMotion ? '100vh' : `${scrollHeightVh}vh` }}
      data-testid="scroll-video-scrub"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#01233f]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          src={src}
          poster={poster}
          muted
          playsInline
          preload="auto"
          aria-hidden
        />

        {!ready && (
          <div className="pointer-events-none absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 bg-[#01233f]/90 text-white">
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
              <div className="h-full w-1/2 animate-pulse bg-secondary" />
            </div>
            <p className="font-mono text-xs tracking-widest uppercase text-white/70">
              Chargement vidéo
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-[#01233f]/85 via-[#01233f]/15 to-[#01233f]/45" />

        {/* pointer-events-none ici : le scroll document reste libre; les CTA remettent auto */}
        <div className="pointer-events-none absolute inset-0 z-20">{children}</div>
      </div>
    </div>
  );
}
