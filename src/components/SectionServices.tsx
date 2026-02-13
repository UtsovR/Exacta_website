import { motion } from 'framer-motion';
import { services } from '../utils/content';
import { fadeUp, stagger } from '../utils/motion';
import { PenTool, Rocket, Sparkles, Target } from 'lucide-react';
import { MouseEvent } from 'react';

const iconMap = {
  Rocket,
  Sparkles,
  PenTool,
  Target
};

function handleTilt(event: MouseEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -6;
  const rotateY = ((x - centerX) / centerX) * 6;
  card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
}

function resetTilt(event: MouseEvent<HTMLDivElement>) {
  const card = event.currentTarget;
  card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
}

export default function SectionServices() {
  return (
    <section id="services" className="section-shell">
      <div className="container-tight space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">Services built to convert</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">4 focus areas</span>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          className="grid gap-5 md:grid-cols-2"
        >
          {services.map((service, idx) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap];
            return (
              <motion.div
                key={service.title}
                variants={fadeUp}
                custom={idx * 0.05}
                className="tilt-card group relative overflow-hidden rounded-2xl border border-white/8 bg-surface/80 p-6 shadow-card transition-all duration-300"
                onMouseMove={handleTilt}
                onMouseLeave={resetTilt}
              >
                <div className="absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{
                  background:
                    'radial-gradient(circle at 20% 20%, rgba(247,208,70,0.12), transparent 40%), radial-gradient(circle at 80% 20%, rgba(77,185,255,0.12), transparent 35%)'
                }} />
                <div className="relative flex items-center gap-4">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10">
                    <Icon className="text-glow" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{service.title}</h3>
                    <p className="text-sm text-white/70">{service.desc}</p>
                  </div>
                </div>
                <div className="relative mt-6 flex items-center justify-between text-sm text-white/70">
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.18em] text-pulse">
                    {service.metric}
                  </span>
                  <span className="text-xs text-white/60">Conversion-first</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
