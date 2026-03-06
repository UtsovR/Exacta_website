import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import FeedbackModal from './FeedbackModal';

interface FeedbackButtonProps {
  open: boolean;
  onToggle: () => void;
}

export default function FeedbackButton({ open, onToggle }: FeedbackButtonProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) onToggle();
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onToggle]);

  return (
    <>
      <motion.button
        type="button"
        aria-controls="feedback-dialog"
        aria-expanded={open}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-yellow-500/40 bg-[#facc15] px-4 py-3 text-sm font-semibold text-black shadow-[0_8px_20px_rgba(250,204,21,0.25)] backdrop-blur-md hover:bg-[#eab308] hover:shadow-[0_12px_28px_rgba(250,204,21,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15]/40 focus-visible:ring-offset-0"
        onClick={onToggle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
      >
        <MessageCircle size={18} /> Feedback
      </motion.button>

      <FeedbackModal open={open} onClose={onToggle} />
    </>
  );
}
