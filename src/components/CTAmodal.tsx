import { FormEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface CTAmodalProps {
  open: boolean;
  onClose: () => void;
}

type EnquiryFormState = {
  name: string;
  email: string;
  phone: string;
  company: string;
  need: string;
};

type FieldErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

const initialFormState: EnquiryFormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  need: 'Need: Web & Dev'
};

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
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onClose();
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
    }
  }, [open]);

  const updateField = (field: keyof EnquiryFormState, value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
    setSubmitError('');
    setIsSubmitted(false);

    if (field === 'name' || field === 'email' || field === 'phone') {
      setFieldErrors((prev) => {
        if (!prev[field]) return prev;
        return { ...prev, [field]: '' };
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isSubmitting || isSubmitted) return;

    const name = formState.name.trim();
    const email = formState.email.trim();
    const phone = formState.phone.trim();
    const company = formState.company.trim();
    const need = formState.need.trim();
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

    const payload = {
      name,
      email,
      phone,
      company: company || null,
      need: need || null,
      source: 'website'
    };

    try {
      const { data, error } = await supabase.from('enquiries').insert([payload]).select();

      if (error) {
        console.error('Supabase enquiry insert failed', {
          table: 'enquiries',
          payload,
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        });
        setSubmitError('Could not submit. Please try again.');
        return;
      }

      if (!data || data.length === 0) {
        setSubmitError('Could not submit. Please try again.');
        return;
      }

      setFormState(initialFormState);
      setIsSubmitted(true);
      clearCloseTimer();
      closeTimerRef.current = window.setTimeout(() => {
        onClose();
      }, 1200);
    } catch (error: unknown) {
      console.error('Unexpected enquiry submit failure', {
        table: 'enquiries',
        payload,
        error
      });
      setSubmitError('Could not submit. Please try again.');
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
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-primaryNeon focus:outline-none"
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
                onChange={(e) => updateField('email', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-secondaryNeon focus:outline-none"
              />
              {fieldErrors.email && (
                <p className="-mt-1 text-xs text-red-300" role="alert">
                  {fieldErrors.email}
                </p>
              )}
              <input
                type="tel"
                required
                placeholder="Enter your phone number"
                pattern="^[+]?[0-9\\s-]+$"
                title="Use digits, spaces, +, and hyphens only"
                value={formState.phone}
                onChange={(e) => updateField('phone', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-secondaryNeon focus:outline-none"
              />
              {fieldErrors.phone && (
                <p className="-mt-1 text-xs text-red-300" role="alert">
                  {fieldErrors.phone}
                </p>
              )}
              <input
                placeholder="Company / Website"
                value={formState.company}
                onChange={(e) => updateField('company', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white focus:border-white/40 focus:outline-none"
              />
              <select
                value={formState.need}
                onChange={(e) => updateField('need', e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-3 text-sm text-white/80 focus:border-primaryNeon focus:outline-none"
              >
                <option className="bg-surface">Need: Web & Dev</option>
                <option className="bg-surface">Need: Social Media</option>
                <option className="bg-surface">Need: Paid Ads / Lead Gen</option>
                <option className="bg-surface">Need: Design</option>
              </select>
              <button
                type="submit"
                disabled={isSubmitting || isSubmitted}
                className="btn-primary w-full justify-center text-base disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitted ? 'Submitted' : isSubmitting ? 'Submitting...' : 'Book my slot'}
              </button>
              {isSubmitted && (
                <p className="text-center text-xs text-emerald-300" role="status">
                  Submitted successfully
                </p>
              )}
              {submitError && (
                <p className="text-center text-xs text-red-300" role="alert">
                  {submitError}
                </p>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
