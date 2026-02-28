import { FormEvent, useState } from 'react';
import { Lock, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface AdminLoginProps {
  notice?: string;
}

export default function AdminLogin({ notice = '' }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
    } catch (error) {
      console.error('Admin login failed:', error);
      setErrorMessage('Invalid email or password.');
    } finally {
      setIsSubmitting(false);
    }
  };

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

          {notice && (
            <p className="mb-4 rounded-lg border border-red-400/25 bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">
              {notice}
            </p>
          )}

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
