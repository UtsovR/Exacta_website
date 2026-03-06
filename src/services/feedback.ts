import { debugSupabaseLog, supabase } from '../lib/supabaseClient';

export const FEEDBACK_TAG_OPTIONS = [
  'Fast delivery',
  'Premium design',
  'Leads improved',
  'Good support',
  'Creative work',
  'Easy communication'
] as const;

export type Feedback = {
  id: string;
  created_at: string;
  rating: number;
  tags: string[];
  review: string | null;
  status: string | null;
};

export type FeedbackInsertPayload = {
  rating: number;
  tags?: string[];
  review?: string | null;
  status?: string | null;
};

type FeedbackRecord = {
  id?: unknown;
  created_at?: unknown;
  rating?: unknown;
  tags?: unknown;
  review?: unknown;
  status?: unknown;
};

const FEEDBACK_SELECT = 'id, created_at, rating, tags, review, status';

function normalizeString(value: unknown) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeTags(value: unknown) {
  if (!Array.isArray(value)) return [];

  const seen = new Set<string>();

  return value
    .map((item) => String(item).trim())
    .filter(Boolean)
    .filter((item) => {
      const key = item.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function normalizeRating(value: unknown) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;

  const rounded = Math.round(parsed);
  return Math.max(0, Math.min(5, rounded));
}

function normalizeFeedbackRow(record: FeedbackRecord): Feedback {
  return {
    id: String(record.id ?? ''),
    created_at: typeof record.created_at === 'string' ? record.created_at : '',
    rating: normalizeRating(record.rating),
    tags: normalizeTags(record.tags),
    review: normalizeString(record.review),
    status: normalizeString(record.status)
  };
}

export function normalizeFeedbackInsertPayload(payload: FeedbackInsertPayload) {
  const rating = Number(payload.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('Please select a rating between 1 and 5.');
  }

  return {
    rating,
    tags: normalizeTags(payload.tags),
    review: normalizeString(payload.review),
    status: normalizeString(payload.status) ?? 'new'
  };
}

export async function createFeedback(payload: FeedbackInsertPayload) {
  const normalizedPayload = normalizeFeedbackInsertPayload(payload);

  debugSupabaseLog('Feedback submit payload', {
    table: 'feedback',
    payload: normalizedPayload
  });

  const { error } = await supabase.from('feedback').insert(normalizedPayload);

  debugSupabaseLog('Feedback submit result', {
    table: 'feedback',
    inserted: error ? null : normalizedPayload,
    error
  });

  if (error) {
    throw error;
  }

  return normalizedPayload;
}

export async function listFeedbackForAdmin() {
  const { data, error } = await supabase.from('feedback').select(FEEDBACK_SELECT).order('created_at', { ascending: false });

  debugSupabaseLog('Feedback admin fetch result', {
    table: 'feedback',
    count: Array.isArray(data) ? data.length : 0,
    error
  });

  return {
    data: Array.isArray(data) ? data.map((row) => normalizeFeedbackRow((row ?? {}) as FeedbackRecord)) : [],
    error
  };
}

export async function listFeaturedFeedback(limit = 6) {
  const { data, error } = await supabase
    .from('feedback')
    .select('rating, tags, review, created_at')
    .order('created_at', { ascending: false })
    .limit(limit);

  debugSupabaseLog('Feedback featured fetch result', {
    table: 'feedback',
    count: Array.isArray(data) ? data.length : 0,
    error
  });

  return {
    data: Array.isArray(data)
      ? data
          .map((row) =>
            normalizeFeedbackRow({
              ...((row ?? {}) as FeedbackRecord),
              id: '',
              status: null
            })
          )
          .filter((row) => Boolean(row.review))
      : [],
    error
  };
}
