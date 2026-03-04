import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { LogOut, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type EnquiryRow = {
  id: number | string;
  created_at: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  need: string | null;
};

const PAGE_SIZE = 20;

function formatDate(value: string | null) {
  if (!value) return '-';

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;

  return parsed.toLocaleString();
}

function getSearchFilter(rawQuery: string) {
  const query = rawQuery.trim();
  if (!query) return '';

  // Supabase OR filter syntax uses commas as delimiters.
  const normalized = query.replace(/,/g, ' ');
  return `name.ilike.%${normalized}%,email.ilike.%${normalized}%,phone.ilike.%${normalized}%`;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const requestIdRef = useRef(0);

  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const fetchEnquiries = useCallback(async (start: number, reset: boolean, query: string) => {
    const requestId = ++requestIdRef.current;

    if (reset) {
      setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }

    setErrorMessage('');

    try {
      const filter = getSearchFilter(query);
      let request = supabase.from('enquiries').select('*', { count: 'exact' }).order('created_at', { ascending: false });

      if (filter) {
        request = request.or(filter);
      }

      const { data, error, count } = await request.range(start, start + PAGE_SIZE - 1);

      if (requestId !== requestIdRef.current) return;

      if (error) {
        throw error;
      }

      const rows = (data as EnquiryRow[] | null) ?? [];
      const nextOffset = start + rows.length;

      if (reset) {
        setEnquiries(rows);
      } else {
        setEnquiries((prev) => [...prev, ...rows]);
      }

      setOffset(nextOffset);
      if (typeof count === 'number') {
        setHasMore(nextOffset < count);
      } else {
        setHasMore(rows.length === PAGE_SIZE);
      }
    } catch (error) {
      if (requestId !== requestIdRef.current) return;

      console.error('Failed to fetch enquiries:', error);
      setErrorMessage('Could not load enquiries right now.');
      if (reset) {
        setEnquiries([]);
        setOffset(0);
        setHasMore(false);
      }
    } finally {
      if (requestId !== requestIdRef.current) return;

      if (reset) {
        setIsLoading(false);
      } else {
        setIsLoadingMore(false);
      }
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearchTerm(searchInput.trim());
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [searchInput]);

  useEffect(() => {
    void fetchEnquiries(0, true, searchTerm);
  }, [fetchEnquiries, searchTerm]);

  const handleLoadMore = async () => {
    if (isLoadingMore || isLoading || !hasMore) return;
    await fetchEnquiries(offset, false, searchTerm);
  };

  const handleSignOut = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);
    try {
      await supabase.auth.signOut();
      navigate('/admin/login', { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const tableRows = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 4 }).map((_, index) => (
        <tr key={`loading-row-${index}`} className="border-b border-white/8 last:border-b-0">
          {Array.from({ length: 6 }).map((__, columnIndex) => (
            <td key={`loading-cell-${index}-${columnIndex}`} className="px-3 py-3">
              <div className="h-3 animate-pulse rounded bg-white/15" />
            </td>
          ))}
        </tr>
      ));
    }

    if (enquiries.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="px-3 py-8 text-center text-sm text-white/60">
            No enquiries found.
          </td>
        </tr>
      );
    }

    return enquiries.map((row) => (
      <tr key={row.id} className="border-b border-white/8 last:border-b-0">
        <td className="px-3 py-3 text-white">{row.name?.trim() || '-'}</td>
        <td className="px-3 py-3 text-white/85">{row.email?.trim() || '-'}</td>
        <td className="px-3 py-3 text-white/85">{row.phone?.trim() || '-'}</td>
        <td className="px-3 py-3 text-white/80">{row.company?.trim() || '-'}</td>
        <td className="max-w-[380px] px-3 py-3 text-white/80">{row.need?.trim() || '-'}</td>
        <td className="px-3 py-3 text-white/75">{formatDate(row.created_at)}</td>
      </tr>
    ));
  }, [enquiries, isLoading]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-white">
      <div className="noise-layer" />
      <main className="container-tight relative z-10 py-8">
        <section className="rounded-2xl border border-white/10 bg-surface/90 p-5 shadow-card backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-white/55">Admin Dashboard</p>
              <h1 className="mt-2 text-xl font-semibold text-white">Enquiries</h1>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isLoggingOut}
              className="btn-ghost self-start disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={16} /> {isLoggingOut ? 'Signing out...' : 'Sign out'}
            </button>
          </div>
        </section>

        <section className="mt-5 rounded-2xl border border-white/10 bg-surface/90 p-6 shadow-card backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <label className="relative w-full md:max-w-sm">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search by name, email, or phone"
                className="w-full rounded-lg border border-white/10 bg-white/5 py-2 pl-9 pr-3 text-sm text-white focus:border-primaryNeon focus:outline-none"
              />
            </label>
          </div>

          {errorMessage && (
            <p className="mb-3 rounded-lg border border-red-400/20 bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">
              {errorMessage}
            </p>
          )}

          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-white/5 text-xs uppercase tracking-[0.12em] text-white/60">
                <tr>
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Phone</th>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Need</th>
                  <th className="px-3 py-3">Created At</th>
                </tr>
              </thead>
              <tbody>{tableRows}</tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-center">
            {hasMore ? (
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore || isLoading}
                className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm text-white/85 transition hover:border-white/35 hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isLoadingMore ? 'Loading...' : 'Load more'}
              </button>
            ) : (
              !isLoading &&
              enquiries.length > 0 && <p className="text-xs text-white/55">No more enquiries to load.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
