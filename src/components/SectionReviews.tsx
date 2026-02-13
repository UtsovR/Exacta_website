import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { testimonials } from '../utils/content';
import { fadeUp } from '../utils/motion';

export default function SectionReviews() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setIndex((prev) => (prev + 1) % testimonials.length), 4800);
    return () => clearInterval(timer);
  }, []);

  const testimonial = testimonials[index];

  return (
    <section id="reviews" className="section-shell">
      <div className="container-tight">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">Customer reviews</h2>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Star className="text-glow" size={16} /> 4.9/5 overall
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-surface/80 p-6 shadow-surface">
          <AnimatePresence mode="wait">
            <motion.div
              key={testimonial.name}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 text-glow">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star
                    key={idx}
                    size={18}
                    className={idx < Math.round(testimonial.rating) ? 'fill-glow/60 text-glow' : 'text-white/30'}
                  />
                ))}
                <span className="text-sm text-white/60">{testimonial.rating.toFixed(1)}</span>
              </div>
              <p className="text-xl font-semibold text-white">“{testimonial.quote}”</p>
              <p className="text-sm text-white/60">
                {testimonial.name} · {testimonial.role}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex items-center gap-3 text-sm text-white/60">
            {testimonials.map((t, i) => (
              <button
                key={t.name}
                onClick={() => setIndex(i)}
                className={`h-2.5 w-2.5 rounded-full transition ${
                  i === index ? 'bg-gradient-to-r from-glow to-pulse shadow-neon' : 'bg-white/20'
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
