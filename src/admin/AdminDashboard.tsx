import { useCallback, useEffect, useState } from 'react';
import { LogOut, Star, Users } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { ENQUIRY_STATUS_OPTIONS, type EnquiryStatus } from './constants';

interface AdminDashboardProps {
  userEmail: string;
  onLogout: () => Promise<void>;
}

type EnquiryRow = {
  id: number | string;
  created_at: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  need: string | null;
  company_website: string | null;
  status: EnquiryStatus | null;
};

type FeedbackRow = {
  id: number | string;
  created_at: string | null;
  name: string | null;
  email: string | null;
  rating: number | null;
  comment: string | null;
  is_featured: boolean | null;
};

function formatDate(value: string | null) {
  if (!value) return '-';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
}

function formatNameOrEmail(name: string | null, email: string | null) {
  const trimmedName = name?.trim();
  if (trimmedName) return trimmedName;

  const trimmedEmail = email?.trim();
  if (trimmedEmail) return trimmedEmail;

  return 'Anonymous';
}

function renderLoadingRows(columns: number) {
  return Array.from({ length: 4 }).map((_, index) => (
    <tr key={`loading-row-${index}`} className="border-b border-white/8 last:border-b-0">
      {Array.from({ length: columns }).map((__, columnIndex) => (
        <td key={`loading-cell-${index}-${columnIndex}`} className="px-3 py-3">
          <div className="h-3 animate-pulse rounded bg-white/15" />
        </td>
      ))}
    </tr>
  ));
}

export default function AdminDashboard({ userEmail, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'enquiries' | 'feedback'>('enquiries');

  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [feedback, setFeedback] = useState<FeedbackRow[]>([]);

  const [enquiriesLoading, setEnquiriesLoading] = useState(true);
  const [feedbackLoading, setFeedbackLoading] = useState(true);

  const [enquiriesError, setEnquiriesError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');

  const [updatingEnquiryId, setUpdatingEnquiryId] = useState<number | string | null>(null);
  const [togglingFeedbackId, setTogglingFeedbackId] = useState<number | string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadEnquiries = useCallback(async () => {
    setEnquiriesLoading(true);
    setEnquiriesError('');

    try {
      const { data, error } = await supabase
        .from('enquiries')
        .select('id,created_at,name,email,phone,need,company_website,status')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setEnquiries((data as EnquiryRow[] | null) ?? []);
    } catch (error) {
      console.error('Failed to load enquiries:', error);
      setEnquiriesError('Could not load enquiries.');
    } finally {
      setEnquiriesLoading(false);
    }
  }, []);

  const loadFeedback = useCallback(async () => {
    setFeedbackLoading(true);
    setFeedbackError('');

    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('id,created_at,name,email,rating,comment,is_featured')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setFeedback((data as FeedbackRow[] | null) ?? []);
    } catch (error) {
      console.error('Failed to load feedback:', error);
      setFeedbackError('Could not load feedback.');
    } finally {
      setFeedbackLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.all([loadEnquiries(), loadFeedback()]);
  }, [loadEnquiries, loadFeedback]);

  const handleEnquiryStatusChange = async (id: number | string, nextStatus: EnquiryStatus) => {
    setUpdatingEnquiryId(id);
    setEnquiriesError('');

    try {
      const { error } = await supabase.from('enquiries').update({ status: nextStatus }).eq('id', id);

      if (error) {
        throw error;
      }

      setEnquiries((previous) =>
        previous.map((row) => (row.id === id ? { ...row, status: nextStatus } : row))
      );
    } catch (error) {
      console.error('Failed to update enquiry status:', error);
      setEnquiriesError('Could not update status.');
    } finally {
      setUpdatingEnquiryId(null);
    }
  };

  const handleFeedbackToggle = async (id: number | string, currentValue: boolean | null) => {
    setTogglingFeedbackId(id);
    setFeedbackError('');

    const nextValue = !currentValue;

    try {
      const { error } = await supabase.from('feedback').update({ is_featured: nextValue }).eq('id', id);

      if (error) {
        throw error;
      }

      setFeedback((previous) =>
        previous.map((row) => (row.id === id ? { ...row, is_featured: nextValue } : row))
      );
    } catch (error) {
      console.error('Failed to toggle featured feedback:', error);
      setFeedbackError('Could not update featured state.');
    } finally {
      setTogglingFeedbackId(null);
    }
  };

  const handleLogoutClick = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await onLogout();
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-white">
      <div className="noise-layer" />
      <main className="container-tight relative z-10 py-8">
        <section className="rounded-2xl border border-white/10 bg-surface/90 p-6 shadow-card backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Admin Panel</p>
              <h1 className="mt-1 text-2xl font-semibold text-white">Dashboard</h1>
              <p className="mt-1 text-sm text-white/65">Signed in as {userEmail}</p>
            </div>

            <button
              type="button"
              onClick={handleLogoutClick}
              disabled={isLoggingOut}
              className="btn-ghost self-start disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={16} /> {isLoggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-surface/90 p-6 shadow-card backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('enquiries')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'enquiries'
                  ? 'bg-white text-black'
                  : 'border border-white/15 bg-white/5 text-white/80 hover:border-white/30'
              }`}
            >
              <Users size={16} /> Enquiries
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('feedback')}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition ${
                activeTab === 'feedback'
                  ? 'bg-white text-black'
                  : 'border border-white/15 bg-white/5 text-white/80 hover:border-white/30'
              }`}
            >
              <Star size={16} /> Feedback
            </button>
          </div>

          {activeTab === 'enquiries' ? (
            <div className="space-y-3">
              {enquiriesError && (
                <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">
                  {enquiriesError}
                </p>
              )}

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-white/60">
                    <tr>
                      <th className="px-3 py-3">Created</th>
                      <th className="px-3 py-3">Name</th>
                      <th className="px-3 py-3">Email</th>
                      <th className="px-3 py-3">Phone</th>
                      <th className="px-3 py-3">Need</th>
                      <th className="px-3 py-3">Company / Website</th>
                      <th className="px-3 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiriesLoading ? (
                      renderLoadingRows(7)
                    ) : enquiries.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-3 py-6 text-center text-sm text-white/60">
                          No enquiries yet.
                        </td>
                      </tr>
                    ) : (
                      enquiries.map((row) => (
                        <tr key={row.id} className="border-b border-white/8 last:border-b-0">
                          <td className="px-3 py-3 text-white/75">{formatDate(row.created_at)}</td>
                          <td className="px-3 py-3 text-white">{row.name || '-'}</td>
                          <td className="px-3 py-3 text-white/80">{row.email || '-'}</td>
                          <td className="px-3 py-3 text-white/80">{row.phone || '-'}</td>
                          <td className="px-3 py-3 text-white/80">{row.need || '-'}</td>
                          <td className="px-3 py-3 text-white/80">{row.company_website || '-'}</td>
                          <td className="px-3 py-3">
                            <select
                              value={row.status || 'new'}
                              onChange={(event) =>
                                handleEnquiryStatusChange(row.id, event.target.value as EnquiryStatus)
                              }
                              disabled={updatingEnquiryId === row.id}
                              className="rounded-md border border-white/15 bg-black/40 px-2 py-1 text-xs text-white focus:border-primaryNeon focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {ENQUIRY_STATUS_OPTIONS.map((status) => (
                                <option key={status} value={status} className="bg-surface text-white">
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {feedbackError && (
                <p className="rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">
                  {feedbackError}
                </p>
              )}

              <div className="overflow-x-auto rounded-xl border border-white/10">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-white/60">
                    <tr>
                      <th className="px-3 py-3">Created</th>
                      <th className="px-3 py-3">Name / Email</th>
                      <th className="px-3 py-3">Rating</th>
                      <th className="px-3 py-3">Comment</th>
                      <th className="px-3 py-3">Featured</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackLoading ? (
                      renderLoadingRows(5)
                    ) : feedback.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-3 py-6 text-center text-sm text-white/60">
                          No feedback yet.
                        </td>
                      </tr>
                    ) : (
                      feedback.map((row) => (
                        <tr key={row.id} className="border-b border-white/8 last:border-b-0">
                          <td className="px-3 py-3 text-white/75">{formatDate(row.created_at)}</td>
                          <td className="px-3 py-3 text-white/80">{formatNameOrEmail(row.name, row.email)}</td>
                          <td className="px-3 py-3 text-white/80">{row.rating ?? '-'}</td>
                          <td className="max-w-[420px] px-3 py-3 text-white/85">{row.comment || '-'}</td>
                          <td className="px-3 py-3">
                            <button
                              type="button"
                              onClick={() => handleFeedbackToggle(row.id, row.is_featured)}
                              disabled={togglingFeedbackId === row.id}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-70 ${
                                row.is_featured
                                  ? 'border border-green-400/30 bg-green-400/15 text-green-200'
                                  : 'border border-white/20 bg-white/5 text-white/80 hover:border-white/35'
                              }`}
                            >
                              {row.is_featured ? 'Featured' : 'Not featured'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
