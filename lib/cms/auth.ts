import { reserveLoginAttempt, clearLoginAttempts } from './login-rate-limit';
import { cookies } from 'next/headers';
import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { atomicWrite, CmsError, dataDir } from './storage';
const derive = promisify(scrypt);
const cookieName = 'sisi_admin';
function config() {
  const {
    ADMIN_USERNAME: username,
    ADMIN_PASSWORD_HASH: hash,
    ADMIN_SESSION_SECRET: secret,
  } = process.env;
  if (
    !username ||
    !hash ||
    !/^scrypt:[a-f0-9]{32}:[a-f0-9]{128}$/.test(hash) ||
    !secret ||
    secret.length < 32
  )
    throw new CmsError('Admin login is not configured. Set the admin environment variables.', 503);
  return { username, hash, secret };
}
function digest(token: string) {
  const c = config();
  return createHmac('sha256', c.secret)
    .update(token + c.username + c.hash)
    .digest('hex');
}
async function session() {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir(), 'session.json'), 'utf8')) as {
      hash: string;
      expires: number;
    };
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw e;
  }
}
export async function isAdmin() {
  try {
    const token = (await cookies()).get(cookieName)?.value;
    if (!token || !/^[a-f0-9]{64}$/.test(token)) return false;
    const saved = await session();
    return !!saved && saved.expires > Date.now() && equal(saved.hash, digest(token));
  } catch {
    return false;
  }
}
export async function requireAdmin() {
  if (!(await isAdmin()))
    throw new CmsError('Please sign in again. Your edits remain on this screen.', 401);
}
function equal(a: string, b: string) {
  return timingSafeEqual(
    createHash('sha256').update(a).digest(),
    createHash('sha256').update(b).digest(),
  );
}
export function checkOrigin(request: Request) {
  const origin =
    process.env.SITE_ORIGIN ||
    (process.env.NODE_ENV !== 'production' ? new URL(request.url).origin : '');
  if (!origin || request.headers.get('origin') !== origin)
    throw new CmsError('This request did not come from the configured website.', 403);
}
export async function login(username: unknown, password: unknown, client: string) {
  const c = config();
  if (
    typeof username !== 'string' ||
    typeof password !== 'string' ||
    password.length > 256 ||
    username.length > 100
  )
    throw new CmsError('Invalid username or password.', 401);
  await reserveLoginAttempt(client);
  const [, salt, expected] = c.hash.split(':');
  const actual = (await derive(password, salt, 64)) as Buffer;
  if (!equal(username, c.username) || !timingSafeEqual(actual, Buffer.from(expected, 'hex')))
    throw new CmsError('Invalid username or password.', 401);
  await clearLoginAttempts(client);
  const token = randomBytes(32).toString('hex');
  await atomicWrite(
    path.join(dataDir(), 'session.json'),
    JSON.stringify({ hash: digest(token), expires: Date.now() + 8 * 3600_000 }),
  );
  (await cookies()).set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 8 * 3600,
  });
}
export async function logout() {
  if (await isAdmin()) await fs.rm(path.join(dataDir(), 'session.json'), { force: true });
  (await cookies()).delete(cookieName);
}
