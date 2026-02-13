import { FormEvent, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

interface CTAmodalProps {
  open: boolean;
  onClose: () => void;
}

export default function CTAmodal({ open, onClose }: CTAmodalProps) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    need: 'Need: Web & Dev'
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const submission = { ...formState };
    void submission;
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 10, opacity: 0 }}
            className="w-[420px] max-w-[92vw] rounded-2xl border border-white/10 bg-surface/95 p-6 shadow-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-white/50">Book a call</p>
                <h3 className="text-xl font-semibold text-white">Free Growth Call</h3>
              </div>
              <button onClick={onClose} className="text-white/60 hover:text-white" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>
            <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
              <input
                required
                placeholder="Name"
                value={formState.name}
                onChange={(e) => setFormState((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-primaryNeon focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="Email"
                value={formState.email}
                onChange={(e) => setFormState((prev) => ({ ...prev, email: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-secondaryNeon focus:outline-none"
              />
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                pattern="^[+]?[0-9\\s-]+$"
                title="Use digits, spaces, +, and hyphens only"
                value={formState.phone}
                onChange={(e) => setFormState((prev) => ({ ...prev, phone: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-secondaryNeon focus:outline-none"
              />
              <input
                placeholder="Company / Website"
                value={formState.company}
                onChange={(e) => setFormState((prev) => ({ ...prev, company: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-white/40 focus:outline-none"
              />
              <select
                value={formState.need}
                onChange={(e) => setFormState((prev) => ({ ...prev, need: e.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 focus:border-primaryNeon focus:outline-none"
              >
                <option className="bg-surface">Need: Web & Dev</option>
                <option className="bg-surface">Need: Social Media</option>
                <option className="bg-surface">Need: Paid Ads / Lead Gen</option>
                <option className="bg-surface">Need: Design</option>
              </select>
              <button type="submit" className="btn-primary w-full justify-center text-base">
                Book my slot
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
