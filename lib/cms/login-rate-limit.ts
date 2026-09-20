import { createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { atomicWrite, CmsError, dataDir, locked } from './storage';
const windowMs = 15 * 60_000;
const maximumAttempts = 10;
type Entry = { count: number; until: number };
type State = Record<string, Entry>;
export function loginClient(request: Request): string {
  const address = request.headers.get('x-sisi-client-ip') || '';
  const signature = request.headers.get('x-sisi-client-signature') || '';
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (secret && isIP(address) && /^[a-f0-9]{64}$/.test(signature)) {
    const expected = createHmac('sha256', secret).update(`client-address:${address}`).digest();
    if (timingSafeEqual(expected, Buffer.from(signature, 'hex'))) return address;
  }
  // next dev does not use our custom HTTP server. Do not trust forwarded headers there.
  if (process.env.NODE_ENV === 'development') return 'local-development';
  throw new CmsError(
    'Login client verification is unavailable. Check the server and proxy configuration.',
    503,
  );
}
async function update(client: string, reset: boolean) {
  return locked('login', async () => {
    const file = path.join(dataDir(), 'login-clients.json');
    let state: State = {};
    try {
      state = JSON.parse(await fs.readFile(file, 'utf8'));
      if (
        !state ||
        typeof state !== 'object' ||
        Array.isArray(state) ||
        Object.entries(state).some(
          ([key, entry]) =>
            !/^[a-f0-9]{64}$/.test(key) ||
            !entry ||
            !Number.isInteger(entry.count) ||
            entry.count < 1 ||
            entry.count > maximumAttempts ||
            !Number.isFinite(entry.until),
        )
      )
        throw new Error('Invalid login limit state');
    } catch (e) {
      if ((e as NodeJS.ErrnoException).code !== 'ENOENT') throw e;
    }
    const now = Date.now();
    for (const [key, entry] of Object.entries(state)) if (entry.until <= now) delete state[key];
    const key = createHmac('sha256', process.env.ADMIN_SESSION_SECRET!)
      .update(`login-limit:${client}`)
      .digest('hex');
    if (reset) delete state[key];
    else {
      const entry = state[key] || { count: 0, until: now + windowMs };
      if (entry.count >= maximumAttempts) {
        const seconds = Math.max(1, Math.ceil((entry.until - now) / 1000));
        throw new CmsError(
          `Too many login attempts from this network. Try again in ${Math.ceil(seconds / 60)} minutes.`,
          429,
          seconds,
        );
      }
      // Bound disk usage. Normal operation only needs a handful of client entries.
      if (!state[key] && Object.keys(state).length >= 2048) {
        const oldest = Object.keys(state).reduce((a, b) =>
          state[a].until < state[b].until ? a : b,
        );
        delete state[oldest];
      }
      state[key] = { count: entry.count + 1, until: entry.until };
    }
    await atomicWrite(file, JSON.stringify(state));
  });
}
export const reserveLoginAttempt = (client: string) => update(client, false);
export const clearLoginAttempts = (client: string) => update(client, true);
