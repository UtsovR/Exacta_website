import { Variants } from 'framer-motion';
import { useEffect, useState } from 'react';

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
  })
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({ opacity: 1, transition: { delay, duration: 0.6 } })
};

export const springIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: (delay = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay, type: 'spring', stiffness: 90, damping: 14 }
  })
};

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1
    }
  }
};

export const softEase = [0.22, 1, 0.36, 1];

export const floatTransition = {
  duration: 8,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: [0.45, 0, 0.25, 1]
};

export const glowTransition = {
  duration: 6.5,
  repeat: Infinity,
  repeatType: 'mirror' as const,
  ease: 'easeInOut' as const
};

export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const handler = () => setPrefers(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return prefers;
}

export function clampTilt(value: number, max: number) {
  return Math.min(Math.max(value, -max), max);
}
