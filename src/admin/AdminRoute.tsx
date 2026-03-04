import { useEffect, useState } from 'react';
import { LogOut } from 'lucide-react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

type GuardState = 'checking' | 'unauthenticated' | 'authorized' | 'forbidden';

export default function AdminRoute() {
  const [guardState, setGuardState] = useState<GuardState>('checking');
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;

      if (sessionError) {
        console.error('Admin guard failed to get session:', sessionError);
        setGuardState('unauthenticated');
        return;
      }

      const session = sessionData.session;
      if (!session) {
        setGuardState('unauthenticated');
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .maybeSingle();

      if (!active) return;

      if (profileError) {
        console.error('Admin guard failed to verify profile:', {
          userId: session.user.id,
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint
        });
      }

      if (profileError || !profile?.is_admin) {
        setGuardState('forbidden');
        return;
      }

      setGuardState('authorized');
    };

    void checkAccess();

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    try {
      await supabase.auth.signOut();
      setGuardState('unauthenticated');
    } finally {
      setIsSigningOut(false);
    }
  };

  if (guardState === 'checking') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-base text-white">
        <div className="noise-layer" />
        <main className="container-tight relative z-10 flex min-h-screen items-center justify-center">
          <p className="text-sm text-white/65">Checking admin access...</p>
        </main>
      </div>
    );
  }

  if (guardState === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  if (guardState === 'forbidden') {
    return (
      <div className="relative min-h-screen overflow-hidden bg-base text-white">
        <div className="noise-layer" />
        <main className="container-tight relative z-10 flex min-h-screen items-center justify-center py-10">
          <section className="w-full max-w-md rounded-2xl border border-white/10 bg-surface/90 p-7 text-center shadow-card backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Admin</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">Not authorized</h1>
            <p className="mt-2 text-sm text-white/65">Your account does not have admin access.</p>
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="btn-ghost mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut size={16} /> {isSigningOut ? 'Signing out...' : 'Sign out'}
            </button>
          </section>
        </main>
      </div>
    );
  }

  return <Outlet />;
}
