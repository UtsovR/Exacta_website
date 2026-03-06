import { useCallback, useEffect, useMemo, useState } from 'react';
import { ClipboardList, LoaderCircle, LogOut, MessageSquareText, RefreshCw, Search, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getSupabaseErrorMessage, supabase } from '../lib/supabaseClient';
import { type Enquiry, listEnquiriesForAdmin } from '../services/enquiries';
import { type Feedback, listFeedbackForAdmin } from '../services/feedback';

type DashboardTab = 'enquiries' | 'feedback';

function formatDateTime(value: string) {
  if (!value) return '-';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

function normalizeSearchValue(value: string | null) {
  return value?.trim().toLowerCase() ?? '';
}

function matchesSearch(values: Array<string | null>, query: string) {
  if (!query) return true;
  return values.some((value) => normalizeSearchValue(value).includes(query));
}

function getStatusLabel(status: string | null) {
  return status?.trim() || 'new';
}

function getStatusTone(status: string | null) {
  const normalized = getStatusLabel(status).toLowerCase();

  if (normalized === 'reviewed') {
    return 'border-emerald-300/20 bg-emerald-300/10 text-emerald-200';
  }

  if (normalized === 'new') {
    return 'border-amber-300/20 bg-amber-300/10 text-amber-200';
  }

  return 'border-white/10 bg-white/5 text-white/75';
}

function StatCard({ label, value, helper }: { label: string; value: string; helper: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-[0_12px_35px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <p className="text-xs uppercase tracking-[0.18em] text-white/50">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-sm text-white/60">{helper}</p>
    </article>
  );
}

function FeedbackRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, index) => {
          const filled = index < rating;

          return (
            <Star
              key={`feedback-star-${rating}-${index}`}
              size={14}
              className={filled ? 'fill-amber-300 text-amber-300' : 'text-white/20'}
            />
          );
        })}
      </div>
      <span className="text-sm text-white/75">{rating}/5</span>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('enquiries');
  const [searchInput, setSearchInput] = useState('');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [isLoadingEnquiries, setIsLoadingEnquiries] = useState(true);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [enquiriesError, setEnquiriesError] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [authError, setAuthError] = useState('');

  const loadDashboard = useCallback(async (mode: 'initial' | 'refresh' = 'initial') => {
    if (mode === 'initial') {
      setIsLoadingEnquiries(true);
      setIsLoadingFeedback(true);
    } else {
      setIsRefreshing(true);
    }

    setEnquiriesError('');
    setFeedbackError('');

    try {
      const [enquiriesResult, feedbackResult] = await Promise.all([listEnquiriesForAdmin(), listFeedbackForAdmin()]);

      if (enquiriesResult.error) {
        console.error('Failed to load enquiries for admin dashboard', enquiriesResult.error);
        setEnquiriesError(
          getSupabaseErrorMessage(enquiriesResult.error, 'Could not load enquiries right now. Please refresh and try again.')
        );
        setEnquiries([]);
      } else {
        setEnquiries(enquiriesResult.data);
      }

      if (feedbackResult.error) {
        console.error('Failed to load feedback for admin dashboard', feedbackResult.error);
        setFeedbackError(
          getSupabaseErrorMessage(feedbackResult.error, 'Could not load feedback right now. Please refresh and try again.')
        );
        setFeedback([]);
      } else {
        setFeedback(feedbackResult.data);
      }
    } catch (error) {
      console.error('Admin dashboard refresh failed unexpectedly', error);
      const message = getSupabaseErrorMessage(error, 'Could not load dashboard data right now. Please refresh and try again.');
      setEnquiries([]);
      setFeedback([]);
      setEnquiriesError(message);
      setFeedbackError(message);
    } finally {
      setIsLoadingEnquiries(false);
      setIsLoadingFeedback(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadDashboard('initial');
  }, [loadDashboard]);

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setAuthError('');
    setIsLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      navigate('/admin/login', { replace: true });
    } catch (error) {
      console.error('Failed to sign out from admin dashboard', error);
      setAuthError(getSupabaseErrorMessage(error, 'Could not sign out right now. Please try again.'));
    } finally {
      setIsLoggingOut(false);
    }
  };

  const normalizedQuery = searchInput.trim().toLowerCase();

  const filteredEnquiries = useMemo(
    () =>
      enquiries.filter((entry) =>
        matchesSearch([entry.name, entry.email, entry.phone, entry.company, entry.service, entry.created_at], normalizedQuery)
      ),
    [enquiries, normalizedQuery]
  );

  const filteredFeedback = useMemo(
    () =>
      feedback.filter((entry) =>
        matchesSearch(
          [String(entry.rating), entry.review, entry.status, entry.created_at, ...entry.tags],
          normalizedQuery
        )
      ),
    [feedback, normalizedQuery]
  );

  const averageRating = useMemo(() => {
    if (feedback.length === 0) return '-';

    const total = feedback.reduce((sum, entry) => sum + entry.rating, 0);
    return (total / feedback.length).toFixed(1);
  }, [feedback]);

  const newFeedbackCount = useMemo(
    () => feedback.filter((entry) => getStatusLabel(entry.status).toLowerCase() === 'new').length,
    [feedback]
  );

  const activeError = activeTab === 'enquiries' ? enquiriesError : feedbackError;

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-white">
      <div className="noise-layer" />
      <main className="container-tight relative z-10 py-8">
        <section className="rounded-[28px] border border-white/10 bg-[linear-gradient(165deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] p-[1px] shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
          <div className="rounded-[27px] bg-[radial-gradient(circle_at_top_left,rgba(109,220,255,0.12),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(250,204,21,0.12),transparent_35%),rgba(11,13,20,0.94)] p-6 backdrop-blur-xl">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-[0.22em] text-white/50">Admin Dashboard</p>
                <h1 className="font-display text-2xl font-semibold text-white">Enquiries and Feedback</h1>
                <p className="max-w-2xl text-sm leading-relaxed text-white/65">
                  Latest submissions are loaded directly from Supabase with the same schema the public forms now use.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => void loadDashboard('refresh')}
                  disabled={isRefreshing || isLoadingEnquiries || isLoadingFeedback}
                  className="btn-ghost disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isRefreshing ? <LoaderCircle size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  {isRefreshing ? 'Refreshing...' : 'Refresh'}
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoggingOut}
                  className="btn-ghost disabled:cursor-not-allowed disabled:opacity-70"
                >
                  <LogOut size={16} />
                  {isLoggingOut ? 'Signing out...' : 'Sign out'}
                </button>
              </div>
            </div>

            {authError && (
              <p className="mt-4 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">
                {authError}
              </p>
            )}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <StatCard label="Enquiries" value={String(enquiries.length)} helper="Lead requests captured" />
              <StatCard label="Feedback" value={String(feedback.length)} helper="Client responses recorded" />
              <StatCard label="Avg. Rating" value={averageRating === '-' ? '-' : `${averageRating}/5`} helper={`${newFeedbackCount} marked as new`} />
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-white/10 bg-surface/90 p-6 shadow-card backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="inline-flex rounded-full border border-white/10 bg-white/[0.04] p-1">
              <button
                type="button"
                onClick={() => setActiveTab('enquiries')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  activeTab === 'enquiries'
                    ? 'bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.16)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <ClipboardList size={16} />
                Enquiries
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('feedback')}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition ${
                  activeTab === 'feedback'
                    ? 'bg-white text-slate-950 shadow-[0_12px_30px_rgba(255,255,255,0.16)]'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <MessageSquareText size={16} />
                Feedback
              </button>
            </div>

            <label className="relative w-full lg:max-w-sm">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={activeTab === 'enquiries' ? 'Search enquiries' : 'Search feedback'}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-10 pr-4 text-sm text-white placeholder:text-white/35 focus:border-primaryNeon focus:outline-none"
              />
            </label>
          </div>

          {activeError && (
            <div className="mt-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200" role="alert">
              {activeError}
            </div>
          )}

          {activeTab === 'enquiries' ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-white/50">
                    <tr>
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Phone</th>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Service</th>
                      <th className="px-4 py-3">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoadingEnquiries
                      ? Array.from({ length: 5 }, (_, index) => (
                          <tr key={`enquiry-loading-${index}`} className="border-t border-white/8">
                            {Array.from({ length: 6 }, (_, cellIndex) => (
                              <td key={`enquiry-loading-cell-${index}-${cellIndex}`} className="px-4 py-4">
                                <div className="h-3 animate-pulse rounded-full bg-white/12" />
                              </td>
                            ))}
                          </tr>
                        ))
                      : filteredEnquiries.length === 0
                        ? (
                          <tr className="border-t border-white/8">
                            <td colSpan={6} className="px-4 py-10 text-center text-sm text-white/55">
                              {normalizedQuery ? 'No enquiries matched your search.' : 'No enquiries found yet.'}
                            </td>
                          </tr>
                        )
                        : filteredEnquiries.map((entry) => (
                            <tr key={entry.id} className="border-t border-white/8 align-top">
                              <td className="px-4 py-4 text-white">{entry.name || '-'}</td>
                              <td className="px-4 py-4 text-white/85">{entry.email || '-'}</td>
                              <td className="px-4 py-4 text-white/85">{entry.phone || '-'}</td>
                              <td className="px-4 py-4 text-white/75">{entry.company || '-'}</td>
                              <td className="px-4 py-4 text-white/75">{entry.service || '-'}</td>
                              <td className="px-4 py-4 text-white/60">{formatDateTime(entry.created_at)}</td>
                            </tr>
                          ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {isLoadingFeedback
                ? Array.from({ length: 4 }, (_, index) => (
                    <article
                      key={`feedback-loading-${index}`}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
                    >
                      <div className="space-y-3 animate-pulse">
                        <div className="h-4 w-32 rounded-full bg-white/12" />
                        <div className="h-3 w-24 rounded-full bg-white/10" />
                        <div className="h-3 w-full rounded-full bg-white/12" />
                        <div className="h-3 w-4/5 rounded-full bg-white/10" />
                        <div className="flex gap-2">
                          <div className="h-8 w-20 rounded-full bg-white/10" />
                          <div className="h-8 w-24 rounded-full bg-white/10" />
                        </div>
                      </div>
                    </article>
                  ))
                : filteredFeedback.length === 0
                  ? (
                    <article className="md:col-span-2 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-10 text-center text-sm text-white/55">
                      {normalizedQuery ? 'No feedback entries matched your search.' : 'No feedback has been submitted yet.'}
                    </article>
                  )
                  : filteredFeedback.map((entry) => (
                      <article
                        key={entry.id}
                        className="rounded-2xl border border-white/10 bg-[linear-gradient(160deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.28)]"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="space-y-2">
                            <FeedbackRating rating={entry.rating} />
                            <p className="text-xs uppercase tracking-[0.18em] text-white/45">{formatDateTime(entry.created_at)}</p>
                          </div>
                          <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium capitalize ${getStatusTone(entry.status)}`}>
                            {getStatusLabel(entry.status)}
                          </span>
                        </div>

                        <p className="mt-4 min-h-[72px] text-sm leading-relaxed text-white/85">
                          {entry.review || 'No written review was provided.'}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2">
                          {entry.tags.length > 0 ? (
                            entry.tags.map((tag) => (
                              <span
                                key={`${entry.id}-${tag}`}
                                className="inline-flex rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs text-white/75"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="inline-flex rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs text-white/50">
                              No tags selected
                            </span>
                          )}
                        </div>
                      </article>
                    ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
