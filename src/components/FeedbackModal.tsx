import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const closeTimerRef = useRef<number | null>(null);
  const [formState, setFormState] = useState({
    name: '',
    rating: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, []);

  useEffect(() => {
    if (!open) {
      clearCloseTimer();
      setIsSubmitting(false);
      setIsSubmitted(false);
      setSubmitError('');
    }
  }, [open]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting) return;

    const message = formState.message.trim();
    if (!message) {
      setSubmitError('Message is required.');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');
    setIsSubmitted(false);

    try {
      const ratingValue = formState.rating.trim();
      const parsedRating = ratingValue ? Number(ratingValue) : null;

      const { error } = await supabase.from('feedback').insert({
        name: formState.name.trim() || null,
        message,
        rating: Number.isFinite(parsedRating) ? parsedRating : null
      });

      if (error) {
        throw error;
      }

      setFormState({
        name: '',
        rating: '',
        message: ''
      });
      setIsSubmitted(true);
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 800);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
      setSubmitError('Could not send feedback. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <form className="mt-2" onSubmit={handleSubmit}>
            <p className="text-xs text-white/60">Pick a tag or drop a thought.</p>
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
              required
              className="mt-3 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white focus:border-primaryNeon focus:outline-none"
              rows={2}
              placeholder="Type feedback..."
              value={formState.message}
              onChange={(e) => {
                setFormState((prev) => ({ ...prev, message: e.target.value }));
                setSubmitError('');
                setIsSubmitted(false);
              }}
            />
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-3 w-full justify-center btn-primary disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Sending...' : 'Send'}
            </button>
            {isSubmitted && (
              <p className="mt-2 text-center text-xs text-emerald-300" role="status">
                Submitted successfully
              </p>
            )}
            {submitError && (
              <p className="mt-2 text-center text-xs text-red-300" role="alert">
                {submitError}
              </p>
            )}
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
