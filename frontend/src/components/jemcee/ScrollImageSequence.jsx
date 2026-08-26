import { useCallback, useEffect, useRef, useState } from 'react';

function padFrame(index, digits = 4) {
  return String(index).padStart(digits, '0');
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Cinematic scroll-driven 24fps image sequence (sticky canvas scrub).
 * Frames are expected as `{framePathPrefix}0001.jpg` … zero-padded.
 */
export function ScrollImageSequence({
  frameCount,
  framePathPrefix,
  frameExt = 'jpg',
  frameDigits = 4,
  /** Scroll runway in viewport heights while the canvas stays sticky */
  scrollHeightVh = 320,
  className = '',
  onProgress,
  children,
}) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const framesRef = useRef([]);
  const frameIndexRef = useRef(0);
  const rafRef = useRef(0);
  const [ready, setReady] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  const drawFrame = useCallback((img) => {
    const canvas = canvasRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth;
    const cssH = canvas.clientHeight;
    const targetW = Math.round(cssW * dpr);
    const targetH = Math.round(cssH * dpr);
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    const scale = Math.max(targetW / img.naturalWidth, targetH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const dx = (targetW - drawW) / 2;
    const dy = (targetH - drawH) / 2;
    ctx.fillStyle = '#01233f';
    ctx.fillRect(0, 0, targetW, targetH);
    ctx.drawImage(img, dx, dy, drawW, drawH);
  }, []);

  useEffect(() => {
    setReducedMotion(prefersReducedMotion());
  }, []);

  useEffect(() => {
    let cancelled = false;
    const frames = new Array(frameCount);
    let loaded = 0;

    const loadOne = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          frames[i] = img;
          loaded += 1;
          if (!cancelled) setLoadProgress(loaded / frameCount);
          resolve();
        };
        img.onerror = () => {
          loaded += 1;
          if (!cancelled) setLoadProgress(loaded / frameCount);
          resolve();
        };
        img.src = `${framePathPrefix}${padFrame(i + 1, frameDigits)}.${frameExt}`;
      });

    const run = async () => {
      const concurrency = 6;
      let next = 0;
      const workers = Array.from({ length: concurrency }, async () => {
        while (next < frameCount) {
          const i = next;
          next += 1;
          await loadOne(i);
        }
      });
      await Promise.all(workers);
      if (cancelled) return;
      framesRef.current = frames;
      setReady(true);
      const first = frames.find(Boolean);
      if (first) drawFrame(first);
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [frameCount, framePathPrefix, frameExt, frameDigits, drawFrame]);

  useEffect(() => {
    if (!ready || reducedMotion) return undefined;

    const update = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const progress = total > 0 ? scrolled / total : 0;
      const index = Math.min(
        frameCount - 1,
        Math.max(0, Math.round(progress * (frameCount - 1)))
      );

      if (index !== frameIndexRef.current) {
        frameIndexRef.current = index;
        const img = framesRef.current[index];
        if (img) drawFrame(img);
      }
      onProgress?.(progress, index);
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
  }, [ready, reducedMotion, frameCount, drawFrame, onProgress]);

  useEffect(() => {
    if (!ready || !reducedMotion) return;
    const mid = framesRef.current[Math.floor(frameCount / 2)] || framesRef.current[0];
    if (mid) drawFrame(mid);
  }, [ready, reducedMotion, frameCount, drawFrame]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ height: reducedMotion ? '100vh' : `${scrollHeightVh}vh` }}
      data-testid="scroll-image-sequence"
    >
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-[#01233f]">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden />
        {!ready && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[#01233f] text-white">
            <div className="h-1 w-40 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full bg-secondary transition-[width] duration-200"
                style={{ width: `${Math.round(loadProgress * 100)}%` }}
              />
            </div>
            <p className="font-mono text-xs tracking-widest uppercase text-white/70">
              Chargement séquence
            </p>
          </div>
        )}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-[#01233f]/80 via-transparent to-[#01233f]/35" />
        <div className="absolute inset-0 z-20">{children}</div>
      </div>
    </div>
  );
}
