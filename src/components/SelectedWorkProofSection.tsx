import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { fadeUp, stagger, usePrefersReducedMotion } from '../utils/motion';

type CaseItem = {
  industry: string;
  metric: string;
  summary: string;
  detail: string;
};

const caseItems: CaseItem[] = [
  {
    industry: 'Social Media',
    metric: 'Social Media Growth',
    summary: 'Videos, posters & hashtags that build momentum.',
    detail: 'Campaign playbooks, calendar management, and trend-led edits to keep audiences engaged.'
  },
  {
    industry: 'Websites',
    metric: 'Custom Websites',
    summary: 'Tailored, modern sites built for your exact needs.',
    detail: 'Bespoke builds with responsive UX, clean code, and launch-ready tracking baked in.'
  },
  {
    industry: 'SEO + Marketing',
    metric: 'SEO & Performance',
    summary: 'SEO + marketing that uplifts ranking and traffic.',
    detail: 'Technical fixes, content sprints, and performance reporting to lift visibility and clicks.'
  }
];

const hoverGlow = '0 24px 62px rgba(0, 0, 0, 0.55), 0 0 42px rgba(109, 220, 255, 0.2)';

export default function SelectedWorkProofSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [activeCase, setActiveCase] = useState<number | null>(null);

  return (
    <section id="work" className="section-shell !pt-0 md:!pt-0 !pb-8 md:!pb-10">
      <div className="container-tight space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">Selected proof</p>
          <h2 className="text-2xl font-semibold text-white">Work That Delivered</h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {caseItems.map((item, index) => (
            <motion.button
              key={item.industry}
              type="button"
              variants={fadeUp}
              custom={index * 0.07}
              whileHover={
                prefersReducedMotion
                  ? undefined
                  : {
                      y: -5,
                      boxShadow: hoverGlow,
                      borderColor: 'rgba(109, 220, 255, 0.34)'
                    }
              }
              transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => setActiveCase(index)}
              className="rounded-3xl border border-white/10 bg-surface/80 p-6 text-left shadow-card backdrop-blur-lg"
            >
              <span className="text-xs uppercase tracking-[0.2em] text-white/55">{item.industry}</span>
              <p className="mt-3 text-3xl font-semibold text-white">{item.metric}</p>
              <p className="mt-3 text-sm text-white/68">{item.summary}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm text-primaryNeon">
                View details
                <ArrowUpRight size={15} />
              </span>
            </motion.button>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeCase !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
            onClick={() => setActiveCase(null)}
          >
            <motion.div
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
              animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              onClick={(event) => event.stopPropagation()}
              className="w-full max-w-xl rounded-3xl border border-white/10 bg-surface/95 p-6 shadow-card backdrop-blur-xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">{caseItems[activeCase].industry}</p>
                  <h3 className="text-2xl font-semibold text-white">{caseItems[activeCase].metric}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveCase(null)}
                  className="rounded-full border border-white/10 bg-white/5 p-2 text-white/70 transition hover:text-white"
                  aria-label="Close selected work detail"
                >
                  <X size={16} />
                </button>
              </div>
              <p className="mt-4 text-sm text-white/72">{caseItems[activeCase].detail}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
