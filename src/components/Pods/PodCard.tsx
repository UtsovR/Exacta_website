import React from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { Pod } from '../../content/pods';
import { clampTilt, floatTransition, glowTransition, softEase, usePrefersReducedMotion } from '../../utils/motion';

type PodCardProps = {
  pod: Pod;
  variant?: 'main' | 'peek';
  showTag?: boolean;
  compact?: boolean;
};

export default function PodCard({
  pod,
  variant = 'main',
  showTag = true,
  compact = false
}: PodCardProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const tiltDisabled = prefersReducedMotion || variant === 'peek';

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);
  const scale = useMotionValue(1);

  const springCfg = { stiffness: 120, damping: 14, mass: 0.4 };
  const rX = useSpring(rotateX, springCfg);
  const rY = useSpring(rotateY, springCfg);
  const s = useSpring(scale, springCfg);

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (tiltDisabled) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateXdeg = clampTilt(((y - rect.height / 2) / rect.height) * -12, 6);
    const rotateYdeg = clampTilt(((x - rect.width / 2) / rect.width) * 12, 6);
    rotateX.set(rotateXdeg);
    rotateY.set(rotateYdeg);
  }

  function resetTilt() {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }

  function handleEnter() {
    if (tiltDisabled) return;
    scale.set(1.02);
  }

  const baseShadow = '0 18px 48px rgba(0,0,0,0.40), 0 0 0 1px rgba(255,255,255,0.06)';
  const glowShadow =
    '0 26px 64px rgba(0,0,0,0.50), 0 0 0 1px rgba(255,255,255,0.08), 0 0 35px rgba(109,220,255,0.18)';

  return (
    <motion.article
      className={`relative overflow-hidden rounded-3xl border ${
        variant === 'peek' ? 'border-white/8' : 'border-white/10'
      } ${variant === 'peek' ? 'bg-white/4' : 'bg-surface/80'} backdrop-blur-2xl`}
      style={{
        rotateX: tiltDisabled ? 0 : rX,
        rotateY: tiltDisabled ? 0 : rY,
        scale: tiltDisabled ? 1 : s,
        transformStyle: 'preserve-3d'
      }}
      initial={{ opacity: 0, y: 16 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: prefersReducedMotion || variant === 'peek' ? baseShadow : [baseShadow, glowShadow, baseShadow]
      }}
      transition={{
        duration: 0.8,
        ease: softEase,
        boxShadow: prefersReducedMotion || variant === 'peek' ? undefined : glowTransition,
        y: prefersReducedMotion ? undefined : floatTransition,
        opacity: { duration: 0.5 }
      }}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onPointerEnter={handleEnter}
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/4 via-transparent to-white/6 opacity-50" />
      {variant === 'main' && (
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/8" aria-hidden />
      )}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/6 via-transparent to-transparent opacity-60" />

      <div className={`relative flex flex-col gap-4 ${compact ? 'p-4' : 'p-5'}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2">
            {showTag && (
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-primaryNeon" />
                Performance Pods
              </span>
            )}
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold text-white ${compact ? 'text-lg' : 'text-xl'}`}>{pod.title}</h3>
              {variant === 'main' && <Sparkles size={16} className="text-primaryNeon" />}
            </div>
            <p className={`text-white/70 ${compact ? 'text-sm' : 'text-base'}`}>{pod.outcome}</p>
          </div>
          {variant === 'main' && (
            <span className="rounded-full bg-primaryNeon/15 px-3 py-1 text-[11px] font-semibold text-primaryNeon ring-1 ring-primaryNeon/30">
              {pod.bestFor}
            </span>
          )}
          {variant === 'peek' && (
            <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
              Next
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {pod.bullets.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur"
            >
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between text-sm text-white/60">
          <span className="inline-flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primaryNeon shadow-[0_0_18px_rgba(109,220,255,0.9)]" />
            Best for {pod.bestFor}
          </span>
          <span className="inline-flex items-center gap-1 text-white/55">
            <ArrowUpRight size={14} />
            Pod view
          </span>
        </div>
      </div>
    </motion.article>
  );
}
