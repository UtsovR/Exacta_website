import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import PodCard from './PodCard';
import { pods } from '../../content/pods';
import { usePrefersReducedMotion } from '../../utils/motion';

export default function PodStack() {
  const primaryPod = useMemo(() => pods.find((p) => p.id === 'conversion') ?? pods[0], []);
  const peekPod = useMemo(() => pods.find((p) => p.id === 'growth') ?? pods[1], []);

  const prefersReducedMotion = usePrefersReducedMotion();
  const stackRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start end', 'end start']
  });

  const dockY = useTransform(scrollYProgress, [0, 1], [0, -22]);
  const dockScale = useTransform(scrollYProgress, [0, 1], [1, 0.965]);

  return (
    <div ref={stackRef} className="relative" style={{ perspective: '1200px' }}>
      <div className="pointer-events-none absolute -inset-12 -z-10 bg-gradient-to-br from-primaryNeon/18 via-secondaryNeon/12 to-transparent blur-3xl" />
      <motion.div
        style={{
          y: prefersReducedMotion ? 0 : dockY,
          scale: prefersReducedMotion ? 1 : dockScale
        }}
        className="relative"
      >
        <PodCard pod={primaryPod} />
      </motion.div>

      <motion.div
        className="pointer-events-none absolute inset-x-8 top-8 -z-10"
        initial={{ opacity: 0, y: 14, scale: 0.98 }}
        animate={{ opacity: 0.9, y: 0, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.25, 1, 0.35, 1] }}
        style={{ filter: prefersReducedMotion ? 'blur(0.8px)' : 'blur(1.6px)' }}
      >
        <PodCard pod={peekPod} variant="peek" showTag={false} compact />
      </motion.div>
    </div>
  );
}
