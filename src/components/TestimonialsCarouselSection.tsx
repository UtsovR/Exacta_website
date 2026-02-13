import { motion } from 'framer-motion';
import { Layout, Sparkles, TrendingUp } from 'lucide-react';
import { fadeUp, stagger, usePrefersReducedMotion } from '../utils/motion';

type Testimonial = {
  title: string;
  quote: string;
  name: string;
  chip: string;
  icon: 'Sparkles' | 'Layout' | 'TrendingUp';
};

const testimonials: Testimonial[] = [
  {
    title: 'Social Media Growth',
    quote: 'Reels + posters started bringing inquiries every week.',
    name: 'Owner, Local Brand',
    chip: 'More DM leads',
    icon: 'Sparkles'
  },
  {
    title: 'Custom Websites',
    quote: 'They built our website exactly as we wanted — fast and premium.',
    name: 'Founder, Service Business',
    chip: 'Faster conversions',
    icon: 'Layout'
  },
  {
    title: 'SEO & Marketing',
    quote: 'Our Google visibility improved and calls started coming in.',
    name: 'Owner, Small Business',
    chip: 'Better ranking',
    icon: 'TrendingUp'
  }
];

function IconFor({ icon }: { icon: Testimonial['icon'] }) {
  if (icon === 'Sparkles') return <Sparkles size={18} className="text-yellow-200 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]" />;
  if (icon === 'Layout') return <Layout size={18} className="text-cyan-200 drop-shadow-[0_0_10px_rgba(109,220,255,0.4)]" />;
  return <TrendingUp size={18} className="text-cyan-200 drop-shadow-[0_0_10px_rgba(109,220,255,0.4)]" />;
}

export default function TestimonialsCarouselSection() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section id="reviews" className="section-shell !pt-0 md:!pt-0 !pb-8 md:!pb-10">
      <div className="container-tight space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">Testimonials</p>
          <h2 className="text-2xl font-semibold text-white">What Clients Say</h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((item, index) => (
            <motion.article
              key={item.title}
              variants={fadeUp}
              custom={index * 0.08}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_22px_55px_rgba(0,0,0,0.60)]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 bg-[radial-gradient(circle_at_20%_10%,rgba(109,220,255,0.25),transparent_45%),radial-gradient(circle_at_90%_70%,rgba(255,214,64,0.18),transparent_50%)]" />

              <div className="relative z-10 flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-white/5 shadow-[0_0_14px_rgba(109,220,255,0.2)]">
                  <IconFor icon={item.icon} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/55">Testimonial</p>
                </div>
              </div>

              <p className="relative z-10 mt-4 text-base font-semibold leading-relaxed text-white/90">“{item.quote}”</p>

              <div className="relative z-10 mt-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm text-white/80">{item.name}</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/55">Client</p>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-primaryNeon" />
                  {item.chip}
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
