import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="fixed bottom-20 right-6 z-40 w-80 rounded-2xl border border-white/8 bg-surface/95 p-4 shadow-card"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Quick feedback</p>
            <button onClick={onClose} aria-label="Close feedback" className="text-white/60 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="mt-2 text-xs text-white/60">Pick a tag or drop a thought.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {['Fast delivery', 'Premium design', 'Leads improved', 'Love the glow'].map((chip) => (
              <span
                key={chip}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80"
              >
                {chip}
              </span>
            ))}
          </div>
          <textarea
            className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primaryNeon focus:outline-none"
            rows={2}
            placeholder="Type feedback..."
          />
          <button className="mt-3 w-full justify-center btn-primary">Send</button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
