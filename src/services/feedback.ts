import { supabase } from '../lib/supabaseClient';

export type CreateFeedbackPayload = {
  name?: string | null;
  message: string;
  rating?: number | null;
  source?: string | null;
};

export async function createFeedback(payload: CreateFeedbackPayload) {
  const normalized = {
    name: payload.name?.trim() || null,
    message: payload.message.trim(),
    rating: typeof payload.rating === 'number' && Number.isFinite(payload.rating) ? payload.rating : null,
    source: payload.source?.trim() || 'website'
  };

  return supabase.from('feedback').insert([normalized]).select().single();
}

export async function listFeedbackForAdmin() {
  return supabase.from('feedback').select('*').order('created_at', { ascending: false });
}
