import { motion } from 'framer-motion';
import { usePrefersReducedMotion } from '../utils/motion';

export default function FinalCTASection({ onCTA }: { onCTA: () => void }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="final-cta" className="section-shell !pt-0 md:!pt-0 !pb-8 md:!pb-10">
      <div className="container-tight">
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-gradient-to-r from-[#0b1220]/80 via-[#0a0f1a]/70 to-[#0b1220]/80 p-6 text-center shadow-[0_0_40px_rgba(255,215,0,0.08)] backdrop-blur-md md:p-8"
        >
          <h2 className="text-3xl font-semibold tracking-tight text-white/90 md:text-3xl">
            Ready to turn attention into action?
          </h2>
          <button
            type="button"
            onClick={onCTA}
            className="mx-auto mt-6 inline-flex items-center justify-center rounded-full bg-yellow-400 px-8 py-3 text-base font-semibold text-black shadow-[0_0_20px_rgba(255,215,0,0.35)] transition duration-200 hover:bg-yellow-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Get Free Strategy Call
          </button>
        </motion.div>
      </div>
    </section>
  );
}
