import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { workTiles } from '../content/data';
import { fadeUp, stagger } from '../utils/motion';
import WorkModal from './WorkModal';

export default function Work() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="work" className="section-shell pt-4">
      <div className="container-tight space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">Featured work</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Compact & results-led</span>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {workTiles.map((item, idx) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              custom={idx * 0.05}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-surface/70 p-4 shadow-card"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-36 w-full rounded-xl object-cover"
                loading="lazy"
              />
              <div className="mt-3 flex items-center justify-between text-sm text-white/70">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-primaryNeon">
                  {item.category}
                </span>
                <span className="text-white">{item.metric}</span>
              </div>
              <p className="mt-3 text-lg font-semibold text-white">{item.title}</p>
              <p className="text-sm text-white/60">{item.summary}</p>
              <button
                className="mt-4 inline-flex items-center gap-2 text-sm text-primaryNeon hover:text-white"
                onClick={() => setActiveIndex(idx)}
              >
                View detail <ArrowUpRight size={16} />
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <WorkModal item={workTiles[activeIndex]} onClose={() => setActiveIndex(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
