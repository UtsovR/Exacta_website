import { FormEvent, useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, LoaderCircle, Sparkles, Star, X } from 'lucide-react';
import {
  FEEDBACK_TAG_OPTIONS,
  createFeedback
} from '../services/feedback';
import { getSupabaseErrorDetails, getSupabaseErrorMessage } from '../lib/supabaseClient';

interface FeedbackModalProps {
  open: boolean;
  onClose: () => void;
}

const AUTO_CLOSE_DELAY_MS = 1500;
const REVIEW_CHARACTER_LIMIT = 600;

export default function FeedbackModal({ open, onClose }: FeedbackModalProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewText, setReviewText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (!open) {
      setRating(0);
      setHoverRating(0);
      setSelectedTags([]);
      setReviewText('');
      setIsSubmitting(false);
      setIsSubmitted(false);
      setSubmitError('');
    }
  }, [open]);

  useEffect(() => {
    if (!open || !isSubmitted) return;

    const timeoutId = window.setTimeout(() => {
      onClose();
    }, AUTO_CLOSE_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isSubmitted, onClose, open]);

  const activeRating = useMemo(() => hoverRating || rating, [hoverRating, rating]);

  const clearTransientState = () => {
    setSubmitError('');
    setIsSubmitted(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((previous) => {
      if (previous.includes(tag)) {
        return previous.filter((item) => item !== tag);
      }

      return [...previous, tag];
    });

    clearTransientState();
  };

  const handleClose = () => {
    if (isSubmitting) return;
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isSubmitted) return;

    if (rating < 1 || rating > 5) {
      setSubmitError('Please select a rating from 1 to 5 stars.');
      return;
    }

    const review = reviewText.trim();

    setIsSubmitting(true);
    setSubmitError('');
    setIsSubmitted(false);

    try {
      await createFeedback({
        rating,
        tags: selectedTags,
        review,
        status: 'new'
      });

      setRating(0);
      setHoverRating(0);
      setSelectedTags([]);
      setReviewText('');
      setIsSubmitted(true);
    } catch (error) {
      const uiMessage = getSupabaseErrorMessage(error, 'Feedback submission failed.');
      const errorDetails = getSupabaseErrorDetails(error);

      console.error('Feedback submission failed', {
        table: 'feedback',
        payload: {
          rating,
          tags: selectedTags,
          review,
          status: 'new'
        },
        error,
        errorDetails
      });

      setSubmitError(uiMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="feedback-dialog"
          role="dialog"
          aria-modal="false"
          aria-labelledby="feedback-title"
          initial={{ opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.98 }}
          transition={{ duration: 0.24, ease: 'easeOut' }}
          className="fixed inset-x-4 top-4 z-50 max-h-[calc(100dvh-2rem)] sm:left-auto sm:right-6 sm:top-1/2 sm:w-[392px] sm:max-w-[calc(100vw-3rem)] sm:-translate-y-1/2"
        >
          <div className="relative h-full max-h-[calc(100dvh-2rem)] overflow-hidden rounded-[28px] border border-white/12 bg-[linear-gradient(155deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02))] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="relative flex h-full max-h-[calc(100dvh-2rem-2px)] min-h-0 flex-col overflow-hidden rounded-[27px] bg-[radial-gradient(circle_at_top,rgba(109,220,255,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.14),transparent_28%),rgba(7,10,17,0.95)] p-3.5 backdrop-blur-2xl sm:p-4">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_30%,transparent_70%,rgba(255,255,255,0.05))]" />
              <div className="pointer-events-none absolute -left-14 top-10 h-28 w-28 rounded-full bg-primaryNeon/14 blur-3xl" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-32 w-32 rounded-full bg-yellow-300/10 blur-3xl" />

              <div className="relative z-10 flex min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 items-start justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/12 bg-white/[0.04] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/60">
                      <Sparkles size={11} className="text-primaryNeon" />
                      Feedback
                    </span>
                    <div>
                      <h2 id="feedback-title" className="font-display text-lg font-semibold text-white sm:text-[1.15rem]">
                        How did Exacta feel?
                      </h2>
                      <p className="mt-1.5 max-w-[29ch] text-[13px] leading-5 text-white/68">
                        Rate the experience, select what stood out, and leave a note if you want us to improve.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    aria-label="Close feedback"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={15} />
                  </button>
                </div>

                <form className="mt-4 flex min-h-0 flex-1 flex-col" onSubmit={handleSubmit}>
                  <div className="flex-1 space-y-3.5 overflow-y-auto pr-1">
                    <section className="rounded-[24px] border border-white/10 bg-black/20 p-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Your rating</p>
                          <p className="mt-1 text-[13px] text-white/70">Required before submitting</p>
                        </div>
                        <div className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-[13px] font-semibold text-white">
                          {rating > 0 ? `${rating}/5` : 'Pick 1-5'}
                        </div>
                      </div>

                      <div className="mt-3 flex flex-wrap items-center gap-1.5" onMouseLeave={() => setHoverRating(0)}>
                        {Array.from({ length: 5 }, (_, index) => {
                          const starValue = index + 1;
                          const highlighted = activeRating >= starValue;

                          return (
                            <button
                              key={starValue}
                              type="button"
                              aria-label={`Rate ${starValue} stars`}
                              aria-pressed={rating === starValue}
                              onClick={() => {
                                setRating(starValue);
                                clearTransientState();
                              }}
                              onMouseEnter={() => setHoverRating(starValue)}
                              className={`inline-flex h-9 w-9 items-center justify-center rounded-[18px] border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryNeon/60 sm:h-10 sm:w-10 ${
                                highlighted
                                  ? 'border-yellow-300/45 bg-yellow-300/12 text-yellow-200 shadow-[0_10px_24px_rgba(250,204,21,0.18)]'
                                  : 'border-white/10 bg-white/[0.04] text-white/30 hover:border-white/20 hover:text-white/70'
                              }`}
                            >
                              <Star size={18} className={highlighted ? 'fill-current' : ''} />
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    <section>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/45">What stood out?</p>
                          <p className="mt-1 text-[13px] text-white/65">Optional. Choose one or several highlights.</p>
                        </div>
                        <span className="text-xs text-white/45">{selectedTags.length} selected</span>
                      </div>

                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {FEEDBACK_TAG_OPTIONS.map((tag) => {
                          const selected = selectedTags.includes(tag);

                          return (
                            <button
                              key={tag}
                              type="button"
                              onClick={() => toggleTag(tag)}
                              aria-pressed={selected}
                              className={`max-w-full rounded-full border px-3 py-1.5 text-[13px] leading-tight transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primaryNeon/60 ${
                                selected
                                  ? 'border-primaryNeon/40 bg-primaryNeon/16 text-white shadow-[0_10px_28px_rgba(109,220,255,0.18)]'
                                  : 'border-white/10 bg-white/[0.04] text-white/72 hover:border-white/20 hover:bg-white/[0.06] hover:text-white'
                              }`}
                            >
                              {tag}
                            </button>
                          );
                        })}
                      </div>
                    </section>

                    <section>
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/45">Review</p>
                          <p className="mt-1 text-[13px] text-white/65">Optional, but useful if you want to add context.</p>
                        </div>
                        <span className="text-xs text-white/45">{reviewText.length}/{REVIEW_CHARACTER_LIMIT}</span>
                      </div>

                      <textarea
                        rows={3}
                        maxLength={REVIEW_CHARACTER_LIMIT}
                        value={reviewText}
                        placeholder="Write your feedback here..."
                        onChange={(event) => {
                          setReviewText(event.target.value);
                          clearTransientState();
                        }}
                        className="mt-2.5 min-h-[88px] max-h-[160px] w-full resize-none rounded-[20px] border border-white/10 bg-white/[0.05] px-3.5 py-3 text-sm leading-relaxed text-white placeholder:text-white/35 focus:border-primaryNeon/55 focus:outline-none focus:ring-2 focus:ring-primaryNeon/20 sm:min-h-[96px]"
                      />
                    </section>
                  </div>

                  <div className="mt-3 shrink-0 border-t border-white/10 pt-3">
                    <button
                      type="submit"
                      disabled={isSubmitting || isSubmitted}
                      className="btn-primary w-full justify-center text-sm disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <>
                          <LoaderCircle size={18} className="animate-spin" />
                          Sending feedback...
                        </>
                      ) : isSubmitted ? (
                        <>
                          <CheckCircle2 size={18} />
                          Submitted
                        </>
                      ) : (
                        'Submit feedback'
                      )}
                    </button>

                    <div className="mt-3 space-y-2">
                      {isSubmitted && (
                        <div
                          className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2.5 text-sm text-emerald-100"
                          role="status"
                        >
                          Feedback sent successfully. Closing this panel...
                        </div>
                      )}

                      {submitError && (
                        <div
                          className="rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm text-red-100"
                          role="alert"
                        >
                          {submitError}
                        </div>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
