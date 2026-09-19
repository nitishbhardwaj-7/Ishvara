import React, { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { isConfigured, supabase } from './api';
import { VideosPanel } from './VideosPanel';
import { SongsPanel } from './SongsPanel';

type AccessState = 'checking' | 'allowed' | 'denied';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'working' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const fail = (message: string) => {
    setError(message);
    setStatus('error');
  };

  const signInWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('working');
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) fail(error.message);
    // on success, onAuthStateChange in AdminApp takes over
  };

  const sendLink = async () => {
    if (!email.trim()) return fail('Enter your email first.');
    setStatus('working');
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { emailRedirectTo: window.location.href.split('#')[0], shouldCreateUser: false },
    });
    if (error) fail(error.message);
    else setStatus('sent');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <form onSubmit={signInWithPassword} className="w-full max-w-sm space-y-4 p-6 rounded-2xl bg-[#121212] border border-white/10">
        <div className="text-center">
          <div className="text-3xl text-[#D6A85F] font-serif">ॐ</div>
          <h1 className="text-lg font-semibold mt-1">Ishvara Admin</h1>
        </div>
        {status === 'sent' ? (
          <p className="text-sm text-emerald-300 text-center">Check your inbox for the sign-in link, then open it on this device.</p>
        ) : (
          <>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="field"
              autoComplete="username"
            />
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="field"
              autoComplete="current-password"
            />
            <button type="submit" disabled={status === 'working'} className="btn btn-primary w-full">
              {status === 'working' ? 'Signing in…' : 'Sign in'}
            </button>
            <button type="button" onClick={sendLink} disabled={status === 'working'} className="w-full text-xs text-neutral-400 hover:text-white">
              Or email me a one-time sign-in link
            </button>
            {status === 'error' && <p className="text-xs text-rose-400">{error}</p>}
          </>
        )}
      </form>
    </div>
  );
};

export const AdminApp: React.FC = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [access, setAccess] = useState<AccessState>('checking');
  const [tab, setTab] = useState<'videos' | 'songs'>('videos');

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data } = supabase.auth.onAuthStateChange((_evt, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    setAccess('checking');
    supabase
      .from('admins')
      .select('email')
      .maybeSingle()
      .then(({ data }) => setAccess(data ? 'allowed' : 'denied'));
  }, [session]);

  if (!isConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center text-sm text-neutral-300">
        Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY (see SETUP.md).
      </div>
    );
  }
  if (!ready) return null;
  if (!session) return <Login />;

  const signOut = () => supabase.auth.signOut();

  if (access !== 'allowed') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
        {access === 'checking' ? (
          <p className="text-sm text-neutral-400">Checking access…</p>
        ) : (
          <>
            <p className="text-sm text-neutral-300 max-w-sm">
              <strong>{session.user.email}</strong> is not an admin. Add it to the <code>admins</code> table in Supabase (see
              SETUP.md), then reload.
            </p>
            <button onClick={signOut} className="btn btn-ghost">
              Sign out
            </button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-[#0b0b0b]/95 backdrop-blur border-b border-white/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl text-[#D6A85F] font-serif">ॐ</span>
            <span className="font-semibold">Ishvara Admin</span>
          </div>
          <nav className="flex gap-1 bg-white/5 rounded-lg p-1">
            {(['videos', 'songs'] as const).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-1.5 rounded-md text-sm capitalize ${tab === t ? 'bg-[#D6A85F] text-black font-semibold' : 'text-neutral-300'}`}
              >
                {t}
              </button>
            ))}
          </nav>
          <button onClick={signOut} className="text-xs text-neutral-400 hover:text-white">
            Sign out
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-6">{tab === 'videos' ? <VideosPanel /> : <SongsPanel />}</main>
    </div>
  );
};
