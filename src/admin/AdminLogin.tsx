import { FormEvent, useEffect, useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isCheckingAccess, setIsCheckingAccess] = useState(true);
  const navigate = useNavigate();

  const checkAdminAccess = async () => {
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Admin login failed to read session:', sessionError);
      return false;
    }

    const session = sessionData.session;
    if (!session) {
      return false;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', session.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Admin login failed to verify profile:', {
        userId: session.user.id,
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint
      });
      return false;
    }

    return Boolean(profile?.is_admin);
  };

  useEffect(() => {
    let active = true;

    const checkExistingAccess = async () => {
      const isAdmin = await checkAdminAccess();
      if (!active) return;

      if (isAdmin) {
        navigate('/admin/dashboard', { replace: true });
        return;
      }

      setIsCheckingAccess(false);
    };

    void checkExistingAccess();

    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (error) {
        throw error;
      }

      const isAdmin = await checkAdminAccess();
      if (!isAdmin) {
        await supabase.auth.signOut();
        setErrorMessage('Not authorized');
        return;
      }

      navigate('/admin/dashboard', { replace: true });
    } catch (error) {
      console.error('Admin login failed:', error);
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingAccess) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-base text-white">
        <div className="noise-layer" />
        <main className="container-tight relative z-10 flex min-h-screen items-center justify-center">
          <p className="text-sm text-white/65">Checking admin access...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-base text-white">
      <div className="noise-layer" />
      <main className="container-tight flex min-h-screen items-center justify-center py-10">
        <section className="w-full max-w-md rounded-2xl border border-white/10 bg-surface/90 p-7 shadow-card backdrop-blur-xl">
          <div className="mb-6 space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-white/55">Admin</p>
            <h1 className="text-2xl font-semibold text-white">Admin Login</h1>
            <p className="text-sm text-white/65">Sign in with your authorized account.</p>
          </div>

          <form className="space-y-3" onSubmit={handleSubmit}>
            <label className="block space-y-1">
              <span className="text-xs text-white/65">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-primaryNeon focus:outline-none"
                placeholder="admin@company.com"
              />
            </label>

            <label className="block space-y-1">
              <span className="text-xs text-white/65">Password</span>
              <input
                type="password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white focus:border-primaryNeon focus:outline-none"
                placeholder="Enter password"
              />
            </label>

            {errorMessage && (
              <p className="text-xs text-red-300" role="alert">
                {errorMessage}
              </p>
            )}

            <button type="submit" disabled={isSubmitting} className="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? (
                <>
                  <Lock size={16} /> Signing in...
                </>
              ) : (
                <>
                  <LogIn size={16} /> Sign in
                </>
              )}
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}
