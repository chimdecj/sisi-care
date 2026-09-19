import 'server-only';

export async function verifyContactCaptcha(
  token: unknown,
  origin: string,
): Promise<'verified' | 'invalid' | 'unavailable'> {
  const secret = process.env.RECAPTCHA_SECRET_KEY?.trim();
  if (!secret) return 'unavailable';
  if (typeof token !== 'string' || !token || token.length > 4096) return 'invalid';
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) return 'unavailable';
    const result = await response.json();
    return result.success === true && result.hostname === new URL(origin).hostname
      ? 'verified'
      : 'invalid';
  } catch {
    return 'unavailable';
  }
}
