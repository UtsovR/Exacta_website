import type { Session } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

type AdminFailureReason = 'no_session' | 'not_admin';

export type RequireAdminResult =
  | { ok: true; session: Session }
  | { ok: false; reason: AdminFailureReason };

export async function getSession() {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Failed to get auth session:', error);
      return null;
    }

    return data.session ?? null;
  } catch (error) {
    console.error('Unexpected auth session error:', error);
    return null;
  }
}

export async function requireAdmin(): Promise<RequireAdminResult> {
  const session = await getSession();
  if (!session) {
    return { ok: false, reason: 'no_session' };
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Failed to verify admin profile:', error);
      return { ok: false, reason: 'not_admin' };
    }

    if (!data?.is_admin) {
      return { ok: false, reason: 'not_admin' };
    }

    return { ok: true, session };
  } catch (error) {
    console.error('Unexpected admin verification error:', error);
    return { ok: false, reason: 'not_admin' };
  }
}
