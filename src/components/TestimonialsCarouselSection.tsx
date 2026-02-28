import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Layout, Sparkles, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { fadeUp, stagger, usePrefersReducedMotion } from '../utils/motion';

type Testimonial = {
  title: string;
  quote: string;
  name: string;
  chip: string;
  icon: 'Sparkles' | 'Layout' | 'TrendingUp';
};

type FeedbackRow = {
  name: string | null;
  email: string | null;
  rating: number | null;
  comment: string | null;
};

const fallbackTestimonials: Testimonial[] = [
  {
    title: 'Social Media Growth',
    quote: 'Reels + posters started bringing inquiries every week.',
    name: 'Owner, Local Brand',
    chip: 'More DM leads',
    icon: 'Sparkles'
  },
  {
    title: 'Custom Websites',
    quote: 'They built our website exactly as we wanted - fast and premium.',
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
  if (icon === 'Sparkles') {
    return <Sparkles size={18} className="text-yellow-200 drop-shadow-[0_0_10px_rgba(250,204,21,0.45)]" />;
  }

  if (icon === 'Layout') {
    return <Layout size={18} className="text-cyan-200 drop-shadow-[0_0_10px_rgba(109,220,255,0.4)]" />;
  }

  return <TrendingUp size={18} className="text-cyan-200 drop-shadow-[0_0_10px_rgba(109,220,255,0.4)]" />;
}

function toDisplayName(name: string | null, email: string | null) {
  const trimmedName = name?.trim();
  if (trimmedName) return trimmedName;

  const trimmedEmail = email?.trim();
  if (!trimmedEmail) return 'Anonymous Client';

  const [localPart] = trimmedEmail.split('@');
  return localPart || 'Anonymous Client';
}

function toChipText(rating: number | null) {
  if (typeof rating === 'number' && Number.isFinite(rating)) {
    return `${rating.toFixed(1)} rating`;
  }

  return 'Featured feedback';
}

function toIcon(rating: number | null, index: number): Testimonial['icon'] {
  if (typeof rating === 'number' && Number.isFinite(rating)) {
    if (rating >= 4.5) return 'Sparkles';
    if (rating >= 3.5) return 'Layout';
    return 'TrendingUp';
  }

  return index % 3 === 0 ? 'Sparkles' : index % 3 === 1 ? 'Layout' : 'TrendingUp';
}

export default function TestimonialsCarouselSection() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [featuredTestimonials, setFeaturedTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const loadFeaturedTestimonials = async () => {
      const { data, error } = await supabase
        .from('feedback')
        .select('name,email,rating,comment')
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

      if (!active) return;

      if (error) {
        console.error('Failed to load featured feedback:', error);
        setFeaturedTestimonials([]);
        setIsLoading(false);
        return;
      }

      const mapped = ((data as FeedbackRow[] | null) ?? [])
        .map((row, index): Testimonial | null => {
          const quote = row.comment?.trim() ?? '';
          if (!quote) return null;

          return {
            title: 'Client Feedback',
            quote,
            name: toDisplayName(row.name, row.email),
            chip: toChipText(row.rating),
            icon: toIcon(row.rating, index)
          };
        })
        .filter((item): item is Testimonial => item !== null);

      setFeaturedTestimonials(mapped);
      setIsLoading(false);
    };

    void loadFeaturedTestimonials();

    return () => {
      active = false;
    };
  }, []);

  const testimonials = featuredTestimonials.length > 0 ? featuredTestimonials : fallbackTestimonials;
  const shimmerCards = Array.from({ length: 3 });

  return (
    <section id="reviews" className="section-shell !pt-0 md:!pt-0 !pb-8 md:!pb-10">
      <div className="container-tight space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">Testimonials</p>
          <h2 className="text-2xl font-semibold text-white">What Clients Say</h2>
        </div>

        <motion.div
          variants={prefersReducedMotion ? undefined : stagger}
          initial={prefersReducedMotion ? undefined : 'hidden'}
          whileInView={prefersReducedMotion ? undefined : 'visible'}
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {isLoading
            ? shimmerCards.map((_, index) => (
                <article
                  key={`loading-card-${index}`}
                  className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/30 p-6 shadow-[0_18px_40px_rgba(0,0,0,0.55)] backdrop-blur-md"
                >
                  <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-20 bg-[radial-gradient(circle_at_20%_10%,rgba(109,220,255,0.25),transparent_45%),radial-gradient(circle_at_90%_70%,rgba(255,214,64,0.18),transparent_50%)]" />
                  <div className="relative z-10 animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="inline-flex h-10 w-10 rounded-xl border border-white/15 bg-white/10" />
                      <div className="space-y-2">
                        <div className="h-3 w-24 rounded bg-white/20" />
                        <div className="h-2 w-20 rounded bg-white/15" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full rounded bg-white/20" />
                      <div className="h-3 w-5/6 rounded bg-white/20" />
                      <div className="h-3 w-2/3 rounded bg-white/15" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-3 w-20 rounded bg-white/20" />
                        <div className="h-2 w-12 rounded bg-white/15" />
                      </div>
                      <div className="h-6 w-24 rounded-full bg-white/15" />
                    </div>
                  </div>
                </article>
              ))
            : testimonials.map((item, index) => (
                <motion.article
                  key={`${item.name}-${index}`}
                  variants={prefersReducedMotion ? undefined : fadeUp}
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

                  <p className="relative z-10 mt-4 text-base font-semibold leading-relaxed text-white/90">&ldquo;{item.quote}&rdquo;</p>

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
