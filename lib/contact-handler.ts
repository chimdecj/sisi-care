import 'server-only';
import { readContent } from './cms/storage';
import { createHash } from 'node:crypto';
import { sendContactEmail } from './contact-email';
import { verifyContactCaptcha } from './contact-captcha';
import { parseContactSubmission, type ContactSubmission } from './contact-submission';

const MAX_BODY_BYTES = 16_384;
const WINDOW_MS = 10 * 60 * 1000;

type Send = (submission: ContactSubmission) => Promise<'sent' | 'unconfigured'>;

function failure(status: number, code: string, headers?: Record<string, string>) {
  return Response.json(
    { ok: false, code },
    { status, headers: { 'Cache-Control': 'no-store', ...headers } },
  );
}

async function readBody(request: Request): Promise<string | null> {
  if (Number(request.headers.get('content-length')) > MAX_BODY_BYTES) return null;
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BODY_BYTES) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
    return Buffer.concat(chunks).toString('utf8');
  } finally {
    reader.releaseLock();
  }
}

export function createContactHandler(
  send: Send = sendContactEmail,
  now = Date.now,
  verify = verifyContactCaptcha,
) {
  // A small, bounded per-process limit. Hosting-level limits should also protect
  // production deployments that run multiple server instances.
  let windowEnd = 0;
  let total = 0;
  const attempts = new Map<string, number>();

  return async function POST(request: Request): Promise<Response> {
    const origin = request.headers.get('origin');
    const configuredOrigin = process.env.SITE_ORIGIN?.trim();
    const permitted = new Set<string>();
    if (configuredOrigin) {
      try {
        const url = new URL(configuredOrigin);
        if (url.origin === configuredOrigin && ['http:', 'https:'].includes(url.protocol)) {
          permitted.add(configuredOrigin);
        }
      } catch {
        /* Invalid configuration keeps the form unavailable. */
      }
    }
    if (process.env.NODE_ENV === 'development') {
      const port = new URL(request.url).port || '3000';
      permitted.add(`http://localhost:${port}`);
      permitted.add(`http://127.0.0.1:${port}`);
    }
    if (!permitted.size) return failure(503, 'FORM_UNAVAILABLE');
    if (!origin || !permitted.has(origin)) return failure(403, 'INVALID_ORIGIN');
    if (request.headers.get('content-type')?.split(';')[0].trim() !== 'application/json') {
      return failure(415, 'INVALID_CONTENT_TYPE');
    }

    let submission: ContactSubmission | null;
    let captchaToken: unknown;
    try {
      const body = await readBody(request);
      if (body === null) return failure(413, 'REQUEST_TOO_LARGE');
      const input = JSON.parse(body);
      submission = parseContactSubmission(input, (await readContent()).copy.contact);
      captchaToken = input?.captchaToken;
    } catch {
      return failure(400, 'INVALID_REQUEST');
    }
    if (!submission) return failure(400, 'INVALID_REQUEST');

    const timestamp = now();
    if (timestamp >= windowEnd) {
      windowEnd = timestamp + WINDOW_MS;
      total = 0;
      attempts.clear();
    }
    const key = createHash('sha256').update(submission.email.toLowerCase()).digest('hex');
    const count = attempts.get(key) ?? 0;
    if (count >= 3 || total >= 30) {
      return failure(429, 'RATE_LIMITED', {
        'Retry-After': String(Math.ceil((windowEnd - timestamp) / 1000)),
      });
    }
    // Reserve the attempt before awaiting SMTP so concurrent requests count too.
    attempts.set(key, count + 1);
    total += 1;

    const verification = await verify(captchaToken, origin);
    if (verification === 'unavailable') return failure(503, 'CAPTCHA_UNAVAILABLE');
    if (verification !== 'verified') return failure(400, 'INVALID_CAPTCHA');

    try {
      const result = await send(submission);
      if (result === 'unconfigured') {
        console.error('Contact email: SMTP environment settings are missing or invalid.');
        return failure(503, 'MAIL_UNAVAILABLE');
      }
      return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
    } catch {
      // Do not log visitor details, credentials, or the provider's error message.
      console.error('Contact email: SMTP delivery could not be confirmed.');
      return failure(502, 'SEND_FAILED');
    }
  };
}
