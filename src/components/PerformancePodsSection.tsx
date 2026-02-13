import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Cog, TrendingUp, type LucideIcon } from 'lucide-react';
import { softEase, usePrefersReducedMotion } from '../utils/motion';

type FrameworkStep = {
  number: '01' | '02' | '03';
  title: string;
  oneLiner: string;
  bullets: [string, string, string, string];
  Icon: LucideIcon;
};

const frameworkSteps: FrameworkStep[] = [
  {
    number: '01',
    title: 'Strategy & Architecture',
    oneLiner: 'Clarity before execution.',
    bullets: ['Audience mapping', 'Offer positioning', 'Funnel blueprint', 'KPI definition'],
    Icon: Brain
  },
  {
    number: '02',
    title: 'Conversion Infrastructure',
    oneLiner: 'Assets built for action.',
    bullets: ['High-converting websites', 'Landing page systems', 'Creative production', 'Tracking integration'],
    Icon: Cog
  },
  {
    number: '03',
    title: 'Growth Acceleration',
    oneLiner: 'Data-driven scaling.',
    bullets: ['Paid media engine', 'Creative testing cycles', 'ROAS optimization', 'Growth refinement'],
    Icon: TrendingUp
  }
];

export default function PerformancePodsSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  return (
    <section id="platforms" className="section-shell !pt-0 md:!pt-0 !pb-8 md:!pb-10">
      <div className="container-tight space-y-8">
        <div className="max-w-2xl space-y-3">
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">Performance Framework</p>
          <h2 className="text-3xl font-semibold text-white md:text-[2.1rem]">From Strategy to Scale</h2>
          <p className="text-sm text-white !text-white md:text-base">A structured system engineered for growth.</p>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute left-[16.67%] right-[16.67%] top-6 hidden md:block">
            <span className="absolute inset-y-0 left-0 h-px w-full rounded-full bg-cyan-300/25 shadow-[0_0_8px_rgba(109,220,255,0.22)]" />
            <motion.span
              className="absolute inset-y-0 left-0 h-px w-full origin-left rounded-full bg-gradient-to-r from-cyan-300/70 via-yellow-300/95 to-cyan-300/70 shadow-[0_0_16px_rgba(250,204,21,0.45)] will-change-transform"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.05, ease: softEase }}
            >
              {!prefersReducedMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-yellow-300/70"
                  animate={{ opacity: [0.45, 0.75, 0.45] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </motion.span>
            {frameworkSteps.map((step, index) => (
              <motion.span
                key={`${step.number}-segment`}
                className="absolute top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-gradient-to-r from-cyan-300/75 via-yellow-300/90 to-cyan-300/75"
                style={{
                  left: index === 0 ? '0%' : index === 1 ? '39%' : '78%',
                  width: '22%'
                }}
                animate={{ opacity: hoveredStep === index ? 0.95 : 0.2 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: softEase }}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute bottom-7 left-5 top-8 md:hidden">
            <span className="absolute inset-y-0 left-0 w-px rounded-full bg-cyan-300/25 shadow-[0_0_8px_rgba(109,220,255,0.22)]" />
            <motion.span
              className="absolute inset-y-0 left-0 w-px origin-top rounded-full bg-gradient-to-b from-cyan-300/70 via-yellow-300/95 to-cyan-300/70 shadow-[0_0_16px_rgba(250,204,21,0.45)] will-change-transform"
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, amount: 0.28 }}
              transition={{ duration: prefersReducedMotion ? 0 : 1.05, ease: softEase }}
            >
              {!prefersReducedMotion && (
                <motion.span
                  className="absolute inset-0 rounded-full bg-yellow-300/70"
                  animate={{ opacity: [0.45, 0.75, 0.45] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
            </motion.span>
          </div>

          <div className="relative space-y-6 md:grid md:grid-cols-3 md:gap-5 md:space-y-0">
            {frameworkSteps.map((step, index) => {
              const Icon = step.Icon;

              return (
                <motion.article
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.24 }}
                  transition={{
                    duration: prefersReducedMotion ? 0 : 0.72,
                    delay: prefersReducedMotion ? 0 : index * 0.2,
                    ease: softEase
                  }}
                  whileHover={
                    prefersReducedMotion
                      ? undefined
                      : {
                          y: -8,
                          borderColor: 'rgba(250, 204, 21, 0.5)',
                          boxShadow: '0 26px 58px rgba(0, 0, 0, 0.55), 0 0 28px rgba(250, 204, 21, 0.14)'
                        }
                  }
                  onMouseEnter={() => setHoveredStep(index)}
                  onMouseLeave={() => setHoveredStep((current) => (current === index ? null : current))}
                  onFocusCapture={() => setHoveredStep(index)}
                  onBlurCapture={() => setHoveredStep((current) => (current === index ? null : current))}
                  className="relative rounded-2xl border border-white/10 bg-black/25 p-6 pl-12 shadow-xl backdrop-blur-md transition-all duration-300 will-change-transform md:pl-6 md:pt-14"
                >
                  <motion.span
                    initial={{
                      scale: 0.9,
                      opacity: 0.55,
                      boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.2)'
                    }}
                    whileInView={{
                      scale: 1,
                      opacity: 1,
                      boxShadow: '0 0 0 4px rgba(250, 204, 21, 0.2), 0 0 16px rgba(250, 204, 21, 0.75)'
                    }}
                    viewport={{ once: true, amount: 0.35 }}
                    transition={{
                      duration: prefersReducedMotion ? 0 : 0.45,
                      delay: prefersReducedMotion ? 0 : index * 0.2 + 0.18,
                      ease: softEase
                    }}
                    className="absolute left-5 top-8 inline-flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-yellow-300/70 bg-yellow-300/85 md:left-1/2 md:top-6"
                  />

                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">Step {step.number}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/35 bg-cyan-300/10">
                      <span className="absolute inset-0 rounded-xl bg-cyan-300/25 opacity-75 blur-[8px]" />
                      <Icon size={18} className="relative z-10 text-yellow-300" />
                    </span>
                    <h3 className="text-lg font-semibold text-white md:text-xl">{step.title}</h3>
                  </div>

                  <p className="mt-4 text-sm text-white/76">{step.oneLiner}</p>

                  <ul className="mt-5 space-y-2">
                    {step.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2 text-sm text-white/72">
                        <span className="mt-[2px] text-yellow-300/95">&bull;</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
