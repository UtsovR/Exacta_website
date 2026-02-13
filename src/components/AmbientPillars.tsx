import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { usePrefersReducedMotion } from '../utils/motion';

const PILLAR_IMAGES = ['/Image_Assets/1.png', '/Image_Assets/2.png', '/Image_Assets/3.png'];

// Images live in public/Image_Assets (9:16). Update the strings above if you rename/move them.

export default function AmbientPillars() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scopeRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scopeRef,
    offset: ['start end', 'end start']
  });

  const yLeft = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [16, -18]);
  const yCenter = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [-10, 18]);
  const yRight = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? [0, 0] : [18, -14]);

  const pillars = [
    { position: 'left-[7%] md:left-[9%]', rotate: -2, y: yLeft },
    { position: 'left-1/2 -translate-x-1/2', rotate: 1.5, y: yCenter },
    { position: 'right-[7%] md:right-[9%]', rotate: 2.5, y: yRight }
  ];

  return (
    <div ref={scopeRef} className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/15 to-black/30" />

      <div className="relative mx-auto flex h-full w-full max-w-6xl items-start justify-center">
        {pillars.map((pillar, index) => (
          <motion.div
            key={index}
            style={{ y: prefersReducedMotion ? 0 : pillar.y, rotate: `${pillar.rotate}deg` }}
            className={`absolute top-8 sm:top-12 lg:top-14 h-[clamp(520px,70vh,820px)] w-[clamp(220px,24vw,320px)] origin-center opacity-[0.20] sm:opacity-[0.24] md:opacity-[0.28] lg:opacity-[0.32] ${pillar.position}`}
          >
            <div
              className="relative h-full w-full overflow-hidden rounded-3xl border border-white/8 shadow-[0_22px_48px_rgba(0,0,0,0.55),0_0_34px_rgba(109,220,255,0.08)]"
              style={{
                maskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 18%, black 82%, transparent)'
              }}
            >
              <img
                src={PILLAR_IMAGES[index]}
                alt=""
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover scale-[1.04] blur-[1px] md:blur-[2px] saturate-[1.05] contrast-[1.05] brightness-[0.92]"
                onError={() => console.warn('AmbientPillars failed to load image:', PILLAR_IMAGES[index])}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/10 to-black/30" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
