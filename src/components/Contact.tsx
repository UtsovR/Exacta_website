import { motion } from 'framer-motion';
import { MapPin, Phone, Mail } from 'lucide-react';
import { contactDetails } from '../content/data';
import { fadeUp, stagger } from '../utils/motion';
import MapEmbed from './MapEmbed';

export default function Contact() {
  return (
    <section id="contact" className="section-shell !pt-0 !pb-0 md:!pt-0 md:!pb-0">
      <div className="container-tight space-y-6">
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.22em] text-white/55">Contact</p>
          <h2 className="text-2xl font-semibold text-white">Find and Reach Exacta</h2>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid gap-5 rounded-3xl border border-white/10 bg-surface/80 p-5 shadow-card backdrop-blur-lg md:p-7 lg:grid-cols-[0.95fr,1.05fr]"
        >
          <motion.div variants={fadeUp} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-lg font-semibold text-white">Exacta Web Solution</p>

            <div className="space-y-3 text-sm text-white/78">
              <p className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-primaryNeon" />
                <span>{contactDetails.address}</span>
              </p>
              <p className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-primaryNeon" />
                <span>
                  <span className="mr-1">Phone:</span>
                  <a
                    href="tel:+917595045107"
                    aria-label="Call Exacta Web Solution"
                    className="cursor-pointer transition-colors duration-200 hover:text-primaryNeon hover:underline"
                  >
                    7595 045 107
                  </a>
                </span>
              </p>
              <p className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-primaryNeon" />
                <span>{contactDetails.email}</span>
              </p>
            </div>

            <p className="text-xs uppercase tracking-[0.2em] text-white/50">
              Tap the map preview to expand and explore the location.
            </p>
          </motion.div>

          <motion.div variants={fadeUp}>
            <MapEmbed />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
