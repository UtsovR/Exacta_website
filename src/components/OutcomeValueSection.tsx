import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { Rocket, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { softEase, usePrefersReducedMotion } from '../utils/motion';

type OutcomeItem = {
  title: string;
  description: string;
  Icon: LucideIcon;
};

const outcomes: OutcomeItem[] = [
  {
    title: 'Convert More Visitors',
    description: 'Conversion-first pages & funnels.',
    Icon: TrendingUp
  },
  {
    title: 'Generate Quality Leads',
    description: 'High-intent leads, consistently.',
    Icon: Target
  },
  {
    title: 'Build Brand Momentum',
    description: 'Creative that compounds weekly.',
    Icon: Rocket
  }
];

const baseCardShadow = '0 16px 36px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.06)';
const activeCardShadow =
  '0 22px 48px rgba(0,0,0,0.44), 0 0 18px rgba(109,220,255,0.24), 0 0 14px rgba(250,204,21,0.16), inset 0 1px 0 rgba(255,255,255,0.12)';

function sectionHeaderVariants(prefersReducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: softEase }
    }
  };
}

function stripVariants(prefersReducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, filter: prefersReducedMotion ? 'blur(0px)' : 'blur(8px)' },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      transition: { duration: prefersReducedMotion ? 0 : 0.5, delay: prefersReducedMotion ? 0 : 0.08, ease: softEase }
    }
  };
}

function cardsStaggerVariants(prefersReducedMotion: boolean): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : 0.14,
        delayChildren: prefersReducedMotion ? 0 : 0.1
      }
    }
  };
}

function cardVariants(prefersReducedMotion: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReducedMotion ? 0 : 0.55, ease: softEase }
    }
  };
}

export default function OutcomeValueSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeCard, setActiveCard] = useState<number | null>(null);

  return (
    <section id="expertise" className="section-shell !pb-8 md:!pb-10">
      <div className="container-tight space-y-7">
        <motion.div
          variants={sectionHeaderVariants(prefersReducedMotion)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          className="space-y-2"
        >
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">Outcome-focused execution</p>
          <h2 className="text-2xl font-semibold text-white">What We Help You Achieve</h2>
        </motion.div>

        <motion.div
          variants={stripVariants(prefersReducedMotion)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.24 }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(10,14,22,0.35)] p-4 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-[12px] md:p-6 md:backdrop-blur-[14px]"
        >
          <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/14 via-white/6 to-transparent" />

          <motion.div variants={cardsStaggerVariants(prefersReducedMotion)} className="relative grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {outcomes.map((outcome, index) => {
              const isActive = activeCard === index;
              const isDimmed = activeCard !== null && !isActive;
              const Icon = outcome.Icon;

              return (
                <motion.article
                  key={outcome.title}
                  variants={cardVariants(prefersReducedMotion)}
                  onHoverStart={() => setActiveCard(index)}
                  onHoverEnd={() => setActiveCard((current) => (current === index ? null : current))}
                  onFocusCapture={() => setActiveCard(index)}
                  onBlurCapture={() => setActiveCard((current) => (current === index ? null : current))}
                  tabIndex={0}
                  animate={
                    prefersReducedMotion
                      ? {
                          opacity: isDimmed ? 0.75 : 1,
                          borderColor: isActive ? 'rgba(109, 220, 255, 0.38)' : 'rgba(255, 255, 255, 0.1)',
                          boxShadow: isActive ? activeCardShadow : baseCardShadow
                        }
                      : {
                          opacity: isDimmed ? 0.75 : 1,
                          y: isActive ? -6 : 0,
                          scale: isActive ? 1.01 : 1,
                          borderColor: isActive ? 'rgba(109, 220, 255, 0.38)' : 'rgba(255, 255, 255, 0.1)',
                          backgroundColor: isActive ? 'rgba(10, 15, 24, 0.52)' : 'rgba(8, 12, 18, 0.35)',
                          boxShadow: isActive ? activeCardShadow : baseCardShadow
                        }
                  }
                  transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: softEase }}
                  className="focus-ring relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,12,18,0.35)] p-6 backdrop-blur-[12px] will-change-transform md:rounded-3xl md:backdrop-blur-[14px]"
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/12 via-white/4 to-transparent" />
                  <div className="pointer-events-none absolute inset-x-6 top-0 h-px">
                    <span className="absolute inset-x-0 h-px bg-cyan-300/70 shadow-[0_0_12px_rgba(109,220,255,0.52)]" />
                    <motion.span
                      className="absolute left-0 h-px w-11 bg-yellow-300/85 shadow-[0_0_10px_rgba(250,204,21,0.6)]"
                      animate={{ opacity: isActive ? 1 : 0.75 }}
                      transition={{ duration: prefersReducedMotion ? 0 : 0.22, ease: softEase }}
                    />
                  </div>

                  <div className="relative z-10 flex items-start gap-3">
                    <span className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/12 shadow-[0_0_14px_rgba(109,220,255,0.2)]">
                      <span className="pointer-events-none absolute right-[7px] top-[7px] h-1.5 w-1.5 rounded-full bg-yellow-300/90 shadow-[0_0_10px_rgba(250,204,21,0.55)]" />
                      <Icon size={22} className="text-cyan-200 drop-shadow-[0_0_8px_rgba(109,220,255,0.35)]" />
                    </span>

                    <div className="space-y-2">
                      <p className="text-xl font-semibold text-white">{outcome.title}</p>
                      <p className="text-sm text-white/72">{outcome.description}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
