import { FormEvent } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Send } from 'lucide-react';
import { CONTACT_EMAIL, contactDetails } from '../utils/content';
import { fadeUp, stagger } from '../utils/motion';

export default function SectionContact() {
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="section-shell">
      <div className="container-tight space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold text-white">Contact</h2>
          <span className="text-xs uppercase tracking-[0.24em] text-white/50">Let’s talk</span>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="grid gap-6 rounded-2xl border border-white/5 bg-surface/80 p-6 shadow-surface lg:grid-cols-[1.1fr,1fr]"
        >
          <motion.form variants={fadeUp} className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm text-white/70">Name</label>
                <input
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-glow focus:outline-none"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-white/70">Email</label>
                <input
                  type="email"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-pulse focus:outline-none"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-white/70">What do you need?</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-glow focus:outline-none"
                placeholder="Website refresh, paid campaigns, social strategy..."
              />
            </div>
            <button type="submit" className="btn-primary">
              <Send size={16} /> Send Message
            </button>
          </motion.form>

          <motion.div variants={fadeUp} className="space-y-4">
            <div className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/80">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 text-glow" size={18} />
                <p>{contactDetails.address}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-pulse" size={18} />
                <p>
                  <span className="mr-1">Phone:</span>
                  <a
                    href="tel:+917595045107"
                    aria-label="Call Exacta Web Solution"
                    className="cursor-pointer transition-colors duration-200 hover:text-primaryNeon hover:underline"
                  >
                    7595 045 107
                  </a>
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Send className="text-white/70" size={18} />
                <p>
                  <span className="mr-1">{contactDetails.email}</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=Inquiry%20from%20Website&body=Hello%20Exacta%20Web%20Solution,`}
                    aria-label="Email Exacta Web Solution"
                    className="transition-colors duration-200 hover:text-primaryNeon cursor-pointer"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </p>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-black/50 shadow-card">
              <iframe
                title="Exacta Web Solution Map"
                src="https://www.google.com/maps?q=4/36A,+Chanditala+Lane,+Tollygunge,+Kolkata,+West+Bengal&output=embed"
                loading="lazy"
                allowFullScreen
                className="h-60 w-full"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
