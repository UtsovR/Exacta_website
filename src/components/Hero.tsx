import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { heroCopy } from '../content/data';
import { fadeUp, stagger, usePrefersReducedMotion } from '../utils/motion';

export default function Hero({ onCTA }: { onCTA: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [isReady, setIsReady] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const shouldPlay = !prefersReducedMotion;

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          /* ignore autoplay blocks to keep UX silent */
        });
      }
    } else {
      video.pause();
    }
  }, [shouldPlay]);

  return (
    <section id="hero" className="relative isolate min-h-[86vh] overflow-hidden bg-base md:min-h-[88vh]">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
            isReady ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay={shouldPlay}
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setIsReady(true)}
          onLoadedData={() => setIsReady(true)}
          onError={(event) => {
            console.error('Hero video failed to load', event);
            setIsReady(true);
          }}
          aria-hidden
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-3 bg-gradient-to-b from-transparent to-[#05070c] md:h-4 lg:h-5"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-[-1px] h-24 bg-gradient-to-b from-[rgba(5,7,12,0)] via-[rgba(5,7,12,0.65)] to-[rgba(5,7,12,1)] sm:h-28 md:h-32 lg:h-40"
          aria-hidden
        />
      </div>

      <div className="container-tight relative z-10 flex min-h-[86vh] items-center pb-12 pt-8 md:min-h-[88vh] md:pb-14 md:pt-10">
        <motion.div variants={stagger} initial="hidden" animate="visible" className="w-full max-w-3xl">
          <motion.div
            variants={fadeUp}
            className="space-y-4 rounded-3xl border border-white/10 bg-black/35 p-8 shadow-card backdrop-blur-lg"
          >
            <h1 className="font-display text-4xl font-semibold leading-tight text-white sm:text-5xl lg:text-6xl">
              {heroCopy.headline}
            </h1>
            <p className="max-w-2xl text-lg text-white/75">{heroCopy.sub}</p>

            <div className="flex flex-wrap gap-3 pt-1">
              <button className="btn-primary" onClick={onCTA}>
                Get Free Strategy Call
              </button>
              <a href="#work" className="btn-ghost">
                View Our Work
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-white/65">
              {heroCopy.trust.map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 backdrop-blur-sm"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primaryNeon" />
                  {item}
                </span>
              ))}
            </div>

          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
