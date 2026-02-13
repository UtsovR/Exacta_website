import { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { services } from '../content/data';
import { fadeUp, stagger } from '../utils/motion';

function handleTilt(event: MouseEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -5;
  const rotateY = ((x - centerX) / centerX) * 5;
  card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
}

function resetTilt(event: MouseEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
}

export default function Expertise() {
  return (
    <section id="expertise" className="section-shell">
      <div className="container-tight space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">Expertise</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Sharp & compact</span>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-4 md:grid-cols-2"
        >
          {services.map((service, idx) => (
            <motion.div
              key={service.title}
              variants={fadeUp}
              custom={idx * 0.05}
              className="tilt-card group relative overflow-hidden rounded-2xl border border-white/8 bg-surface/70 p-5 shadow-card"
              onMouseMove={handleTilt}
              onMouseLeave={resetTilt}
            >
              <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{
                background:
                  'radial-gradient(circle at 20% 20%, rgba(109,220,255,0.14), transparent 40%), radial-gradient(circle at 80% 20%, rgba(156,107,255,0.12), transparent 40%)'
              }} />
              <div className="relative flex items-start gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                  <service.icon className="text-primaryNeon" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-white">{service.title}</p>
                  <p className="text-sm text-white/60">{service.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
