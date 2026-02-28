import { useEffect, useMemo, useRef, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';
import AdminDashboard from './AdminDashboard';
import AdminLogin from './AdminLogin';
import { ADMIN_EMAILS } from './constants';

function normalizeEmail(email: string | null | undefined) {
  return email?.trim().toLowerCase() ?? '';
}

export default function AdminRoute() {
  const [session, setSession] = useState<Session | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [notice, setNotice] = useState('');

  const isSigningOutUnauthorized = useRef(false);

  const adminEmailSet = useMemo(() => {
    return new Set(ADMIN_EMAILS.map((email) => normalizeEmail(email)).filter(Boolean));
  }, []);

  useEffect(() => {
    let active = true;

    const applySession = async (nextSession: Session | null) => {
      if (!active) return;

      if (!nextSession) {
        setSession(null);
        return;
      }

      const email = normalizeEmail(nextSession.user.email);
      const isAuthorized = adminEmailSet.has(email);

      if (!isAuthorized) {
        setSession(null);
        setNotice('Not authorized');

        if (!isSigningOutUnauthorized.current) {
          isSigningOutUnauthorized.current = true;
          await supabase.auth.signOut();
          isSigningOutUnauthorized.current = false;
        }

        return;
      }

      setSession(nextSession);
      setNotice('');
    };

    const loadSession = async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error) {
        console.error('Failed to read auth session:', error);
      }

      await applySession(data.session);

      if (active) {
        setIsCheckingSession(false);
      }
    };

    void loadSession();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void applySession(nextSession).finally(() => {
        if (active) {
          setIsCheckingSession(false);
        }
      });
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [adminEmailSet]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  if (isCheckingSession) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-base text-white">
        <div className="noise-layer" />
        <main className="container-tight relative z-10 flex min-h-screen items-center justify-center">
          <p className="text-sm text-white/65">Checking admin access...</p>
        </main>
      </div>
    );
  }

  if (!session) {
    return <AdminLogin notice={notice} />;
  }

  return <AdminDashboard userEmail={session.user.email || 'admin'} onLogout={handleLogout} />;
}
