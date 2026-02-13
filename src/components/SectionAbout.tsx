import { motion } from 'framer-motion';
import { aboutCopy } from '../utils/content';
import { fadeUp, stagger } from '../utils/motion';

export default function SectionAbout() {
  return (
    <section id="about" className="section-shell">
      <div className="container-tight">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">About. Mission. Expertise.</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Compact view</span>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          className="grid gap-6 rounded-2xl border border-white/5 bg-surface/80 p-6 shadow-surface md:grid-cols-3"
        >
          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-sm uppercase tracking-[0.18em] text-glow">About</p>
            <p className="text-base text-white/75">{aboutCopy.about}</p>
          </motion.div>

          <motion.div variants={fadeUp} id="expertise" className="space-y-3">
            <p className="text-sm uppercase tracking-[0.18em] text-pulse">Our Expertise</p>
            <div className="flex flex-wrap gap-2">
              {aboutCopy.expertise.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/80"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-2">
            <p className="text-sm uppercase tracking-[0.18em] text-glow">Our Mission</p>
            <p className="text-base text-white/75">{aboutCopy.mission}</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
