'use client';
import { useState } from 'react';
export function AdminLogin() {
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  return (
    <section className="admin-login">
      <span className="admin-kicker">SISI CARE · WEBSITE MANAGEMENT</span>
      <h1>Welcome back.</h1>
      <p>Sign in to update your page text and photos.</p>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError('');
          const data = new FormData(e.currentTarget);
          try {
            const response = await fetch('/api/admin/login/', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(Object.fromEntries(data)),
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            window.location.reload();
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Unable to sign in.');
            setBusy(false);
          }
        }}
      >
        <label>
          Username
          <input name="username" autoComplete="username" required maxLength={100} />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            required
            maxLength={256}
          />
        </label>
        {error && (
          <p role="alert" className="admin-error">
            {error}
          </p>
        )}
        <button className="admin-primary" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
