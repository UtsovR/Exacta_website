import { motion } from 'framer-motion';
import { platforms } from '../content/data';
import { fadeUp, stagger } from '../utils/motion';

export default function Platforms() {
  return (
    <section id="platforms" className="section-shell pt-2">
      <div className="container-tight space-y-5">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">Platforms managed</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Where your customers are</span>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
        >
          {platforms.map((platform, idx) => (
            <motion.div
              key={platform.name}
              variants={fadeUp}
              custom={idx * 0.04}
              whileHover={{ y: -3, boxShadow: '0 14px 40px rgba(109,220,255,0.25)' }}
              className="flex items-center gap-3 rounded-full border border-white/10 bg-surface/70 px-4 py-3 text-sm text-white/80"
            >
              <platform.icon size={16} className="text-primaryNeon" />
              {platform.name}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
