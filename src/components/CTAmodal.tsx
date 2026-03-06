import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, LoaderCircle, X } from 'lucide-react';
import { getSupabaseErrorDetails, getSupabaseErrorMessage } from '../lib/supabaseClient';
import { createEnquiry } from '../services/enquiries';

interface CTAmodalProps {
  open: boolean;
  onClose: () => void;
}

type EnquiryFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  service: string;
};

type FieldErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

const initialFormState: EnquiryFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  service: 'Website & Development'
};

const SERVICE_OPTIONS = [
  'Website & Development',
  'Social Media Management',
  'Paid Ads / Lead Gen',
  'Design'
] as const;

export default function CTAmodal({ open, onClose }: CTAmodalProps) {
  const closeTimerRef = useRef<number | null>(null);
  const [formState, setFormState] = useState<EnquiryFormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
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
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && open) onClose();
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

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
      setFieldErrors({});
      setSubmitError('');
      setFormState(initialFormState);
    }
  }, [open]);

  const updateField = (field: keyof EnquiryFormState, value: string) => {
    setFormState((previous) => ({ ...previous, [field]: value }));
    setSubmitError('');
    setIsSubmitted(false);

    if (field === 'name' || field === 'email' || field === 'phone') {
      setFieldErrors((previous) => {
        if (!previous[field]) return previous;
        return { ...previous, [field]: '' };
      });
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting || isSubmitted) return;

    const name = formState.name.trim();
    const email = formState.email.trim();
    const phone = formState.phone.trim();
    const company = formState.company.trim();
    const service = formState.service.trim();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^[+]?[0-9\s-]+$/;
    const nextFieldErrors: FieldErrors = {};

    if (!name) {
      nextFieldErrors.name = 'Name is required.';
    }

    if (!email || !emailPattern.test(email)) {
      nextFieldErrors.email = 'Enter a valid email address.';
    }

    if (!phone) {
      nextFieldErrors.phone = 'Phone is required.';
    } else if (!phonePattern.test(phone)) {
      nextFieldErrors.phone = 'Phone can contain digits, spaces, +, and hyphens only.';
    }

    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setSubmitError('Please correct the highlighted fields.');
      return;
    }

    setIsSubmitting(true);
    setFieldErrors({});
    setSubmitError('');

    try {
      await createEnquiry({
        name,
        email,
        phone,
        company,
        service
      });

      setFormState(initialFormState);
      setIsSubmitted(true);
      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: unknown) {
      const uiMessage = getSupabaseErrorMessage(error, 'Submission failed. Please try again.');
      const errorDetails = getSupabaseErrorDetails(error);

      console.error('Enquiry submission failed', {
        table: 'enquiries',
        payload: {
          name,
          email,
          phone,
          company: company || null,
          service: service || null
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
            className="w-[440px] max-w-[92vw] rounded-[28px] border border-white/12 bg-[linear-gradient(160deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.55)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="rounded-[27px] bg-[radial-gradient(circle_at_top,rgba(109,220,255,0.13),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.12),transparent_30%),rgba(11,13,20,0.96)] p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/50">Book a call</p>
                  <h3 className="font-display text-xl font-semibold text-white">Free Growth Call</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/65">
                    Tell us what you need and we&apos;ll follow up with the right next step.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.05] text-white/60 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                  aria-label="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              <form className="mt-5 space-y-3" onSubmit={handleSubmit}>
                <input
                  required
                  placeholder="Name"
                  value={formState.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-primaryNeon focus:outline-none"
                />
                {fieldErrors.name && (
                  <p className="-mt-1 text-xs text-red-300" role="alert">
                    {fieldErrors.name}
                  </p>
                )}

                <input
                  type="email"
                  required
                  placeholder="Email"
                  value={formState.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-secondaryNeon focus:outline-none"
                />
                {fieldErrors.email && (
                  <p className="-mt-1 text-xs text-red-300" role="alert">
                    {fieldErrors.email}
                  </p>
                )}

                <input
                  type="tel"
                  required
                  placeholder="Phone number"
                  pattern="^[+]?[0-9\\s-]+$"
                  title="Use digits, spaces, +, and hyphens only"
                  value={formState.phone}
                  onChange={(event) => updateField('phone', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-secondaryNeon focus:outline-none"
                />
                {fieldErrors.phone && (
                  <p className="-mt-1 text-xs text-red-300" role="alert">
                    {fieldErrors.phone}
                  </p>
                )}

                <input
                  placeholder="Company / Website"
                  value={formState.company}
                  onChange={(event) => updateField('company', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white placeholder:text-white/35 focus:border-white/40 focus:outline-none"
                />

                <select
                  value={formState.service}
                  onChange={(event) => updateField('service', event.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 focus:border-primaryNeon focus:outline-none"
                >
                  {SERVICE_OPTIONS.map((option) => (
                    <option key={option} className="bg-surface" value={option}>
                      {option}
                    </option>
                  ))}
                </select>

                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Submitting...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle2 size={18} />
                      Submitted
                    </>
                  ) : (
                    'Book my slot'
                  )}
                </button>

                {isSubmitted && (
                  <p className="text-center text-xs text-emerald-300" role="status">
                    Submitted successfully. We&apos;ll reach out shortly.
                  </p>
                )}

                {submitError && (
                  <p className="text-center text-xs leading-relaxed text-red-300" role="alert">
                    {submitError}
                  </p>
                )}
              </form>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
