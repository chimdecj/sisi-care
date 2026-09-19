import assert from 'node:assert/strict';
import { afterEach, beforeEach, mock, test } from 'node:test';
import nodemailer from 'nodemailer';
import { contact } from '../lib/content';
import { createContactHandler } from '../lib/contact-handler';
import { sendContactEmail } from '../lib/contact-email';
import { contactMessage, parseContactSubmission } from '../lib/contact-submission';

const valid = {
  name: 'Test Visitor',
  phone: '(206) 555-0123',
  email: 'visitor@example.com',
  who: 'Parent',
  support: ['Companion Care'],
  when: 'Planning ahead',
  message: 'Please contact me about care.\nThank you.',
  website: '',
  captchaToken: 'valid-token',
};
const environment: Record<string, string | undefined> = process.env;
const keys = [
  'NODE_ENV',
  'SITE_ORIGIN',
  'SMTP_HOST',
  'SMTP_PORT',
  'SMTP_SECURE',
  'SMTP_USER',
  'SMTP_PASSWORD',
  'SMTP_FROM',
  'CONTACT_TO',
  'RECAPTCHA_SECRET_KEY',
];
const originalEnvironment = new Map(keys.map((key) => [key, environment[key]]));
beforeEach(() => {
  for (const key of keys) delete environment[key];
  environment.NODE_ENV = 'production';
  environment.SITE_ORIGIN = 'https://sisicare.example';
  environment.RECAPTCHA_SECRET_KEY = 'test-secret';
});
afterEach(() => {
  mock.restoreAll();
  for (const [key, value] of originalEnvironment) {
    if (value === undefined) delete environment[key];
    else environment[key] = value;
  }
});

function handler(send?: Parameters<typeof createContactHandler>[0], now = Date.now) {
  return createContactHandler(send, now, async () => 'verified');
}

function request(body: unknown = valid, headers: Record<string, string> = {}) {
  return new Request('https://sisicare.example/api/contact/', {
    method: 'POST',
    headers: {
      Origin: 'https://sisicare.example',
      'Content-Type': 'application/json',
      ...headers,
    },
    body: typeof body === 'string' ? body : JSON.stringify(body),
  });
}

function sender() {
  return mock.fn(async () => 'sent' as const);
}

test('accepts current form choices and optional empty message/support', () => {
  const parsed = parseContactSubmission({ ...valid, name: '  Test Visitor  ' });
  assert.equal(parsed?.name, 'Test Visitor');
  assert.equal(parsed?.message, valid.message);
  assert.ok(parseContactSubmission({ ...valid, support: [], message: '' }));
  assert.equal(parseContactSubmission([]), null);
});

test('rejects invalid fields, header injection, honeypots, and oversized text', () => {
  for (const fields of [
    { name: '' },
    { name: 'x'.repeat(101) },
    { phone: '123' },
    { phone: 'call me please' },
    { email: 'invalid' },
    { email: 'a@example.com\r\nBcc: victim@example.com' },
    { email: 'one@example.com,two@example.com' },
    { name: 'Someone\r\nBcc: other@example.com' },
    { who: 'Unrecognized option' },
    { when: 'Unrecognized option' },
    { support: ['Unknown care'] },
    { support: 'Companion Care' },
    { support: ['Companion Care', 'Companion Care'] },
    { website: 'https://spam.example' },
    { message: 'x'.repeat(1501) },
  ])
    assert.equal(parseContactSubmission({ ...valid, ...fields }), null);
});

test('email text contains the submitted care details without interpreting markup', () => {
  const parsed = parseContactSubmission({ ...valid, message: '<script>text only</script>' });
  assert.ok(parsed);
  const text = contactMessage(parsed);
  assert.ok(text.includes('Phone: (206) 555-0123'));
  assert.ok(text.includes('Support requested: Companion Care'));
  assert.ok(text.includes('Timing: Planning ahead'));
  assert.ok(text.includes('<script>text only</script>'));
});

test('valid request waits for delivery confirmation before reporting success', async () => {
  let finish!: (result: 'sent') => void;
  const send = mock.fn(
    () =>
      new Promise<'sent'>((resolve) => {
        finish = resolve;
      }),
  );
  const post = handler(send);
  const pending = post(request());
  let resolved = false;
  void pending.then(() => {
    resolved = true;
  });
  await new Promise((resolve) => setImmediate(resolve));
  assert.equal(send.mock.callCount(), 1);
  assert.equal(resolved, false);
  finish('sent');
  const response = await pending;
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true });
  assert.equal(response.headers.get('cache-control'), 'no-store');
});

test('rejects cross-site and missing origins without invoking SMTP', async () => {
  const send = sender();
  const post = handler(send);
  assert.equal((await post(request(valid, { Origin: 'https://other.example' }))).status, 403);
  const missing = request();
  missing.headers.delete('Origin');
  assert.equal((await post(missing)).status, 403);
  assert.equal(send.mock.callCount(), 0);
});

test('rejects non-JSON, malformed JSON, and bot fields without sending', async () => {
  const send = sender();
  const post = handler(send);
  assert.equal((await post(request(valid, { 'Content-Type': 'text/plain' }))).status, 415);
  assert.equal((await post(request('{'))).status, 400);
  assert.equal((await post(request({ ...valid, website: 'spam' }))).status, 400);
  assert.equal(send.mock.callCount(), 0);
});

test('caps actual request bytes even with an absent or dishonest length header', async () => {
  const send = sender();
  const post = handler(send);
  const oversized = JSON.stringify({ ...valid, message: 'x'.repeat(17_000) });
  assert.equal((await post(request(oversized))).status, 413);
  assert.equal((await post(request(oversized, { 'Content-Length': '1' }))).status, 413);
  assert.equal((await post(request(valid, { 'Content-Length': '17000' }))).status, 413);
  assert.equal(send.mock.callCount(), 0);
});

test('limits concurrent attempts for the same sender and expires the window', async () => {
  const send = sender();
  let time = 0;
  const post = handler(send, () => time);
  const responses = await Promise.all(Array.from({ length: 4 }, () => post(request())));
  assert.deepEqual(
    responses.map((response) => response.status),
    [200, 200, 200, 429],
  );
  assert.equal(responses[3].headers.get('retry-after'), '600');
  assert.equal(send.mock.callCount(), 3);
  time = 600_001;
  assert.equal((await post(request())).status, 200);
});

test('caps total per-process submissions across different sender addresses', async () => {
  const send = sender();
  const post = handler(send);
  for (let index = 0; index < 30; index++) {
    assert.equal(
      (await post(request({ ...valid, email: `visitor${index}@example.com` }))).status,
      200,
    );
  }
  assert.equal((await post(request({ ...valid, email: 'new@example.com' }))).status, 429);
  assert.equal(send.mock.callCount(), 30);
});

test('missing settings and SMTP failures never return success or expose secrets', async () => {
  mock.method(console, 'error', () => undefined);
  const unavailable = handler(async () => 'unconfigured');
  const response = await unavailable(request());
  assert.equal(response.status, 503);
  assert.deepEqual(await response.json(), { ok: false, code: 'MAIL_UNAVAILABLE' });
  const failing = handler(async () => {
    throw new Error('private-password-and-content');
  });
  const failed = await failing(request());
  assert.equal(failed.status, 502);
  assert.deepEqual(await failed.json(), { ok: false, code: 'SEND_FAILED' });
  assert.ok(
    !JSON.stringify(
      (console.error as unknown as { mock: { calls: unknown[] } }).mock.calls,
    ).includes('private-password-and-content'),
  );
});

test('Gmail configuration remains unavailable until sender and password are provided', async () => {
  delete process.env.SMTP_USER;
  delete process.env.SMTP_PASSWORD;
  const transport = mock.method(nodemailer, 'createTransport', () => {
    throw new Error('Must not connect');
  });
  assert.equal(await sendContactEmail(valid), 'unconfigured');
  process.env.SMTP_USER = 'sender@gmail.com';
  assert.equal(await sendContactEmail(valid), 'unconfigured');
  assert.equal(transport.mock.callCount(), 0);
});

test('SMTP uses TLS, fixed recipient, authenticated sender, and visitor Reply-To', async () => {
  process.env.SMTP_USER = 'sender@gmail.com';
  process.env.SMTP_PASSWORD = 'abcd efgh ijkl mnop';
  const sendMail = mock.fn(async () => ({ accepted: [contact.email], rejected: [] }));
  const close = mock.fn();
  const create = mock.method(nodemailer, 'createTransport', (() => ({
    sendMail,
    close,
  })) as unknown as typeof nodemailer.createTransport);
  const post = handler();
  assert.equal(
    (await post(request({ ...valid, to: 'attacker@example.com', from: 'spoof@example.com' })))
      .status,
    200,
  );
  const settings = create.mock.calls[0].arguments[0] as unknown as Record<string, unknown>;
  assert.equal(settings.host, 'smtp.gmail.com');
  assert.equal(settings.port, 465);
  assert.equal(settings.secure, true);
  assert.deepEqual(settings.auth, { user: 'sender@gmail.com', pass: 'abcdefghijklmnop' });
  const mail = sendMail.mock.calls[0].arguments as unknown as [
    { from: unknown; to: unknown; replyTo: unknown; text: string; html?: string },
  ];
  assert.deepEqual(mail[0].from, { name: 'Sisi Care website', address: 'sender@gmail.com' });
  assert.deepEqual(mail[0].to, { name: 'Sisi Care', address: contact.email });
  assert.deepEqual(mail[0].replyTo, { name: valid.name, address: valid.email });
  assert.equal(mail[0].html, undefined);
  assert.ok(mail[0].text.includes(valid.message));
  assert.equal(close.mock.callCount(), 1);
});

test('SMTP rejection is treated as failure and the transport is closed', async () => {
  process.env.SMTP_USER = 'sender@gmail.com';
  process.env.SMTP_PASSWORD = 'abcdefghijklmnop';
  const close = mock.fn();
  mock.method(nodemailer, 'createTransport', (() => ({
    sendMail: async () => ({ accepted: [], rejected: [contact.email] }),
    close,
  })) as unknown as typeof nodemailer.createTransport);
  await assert.rejects(sendContactEmail(valid));
  assert.equal(close.mock.callCount(), 1);
});

test('production requires an explicit site origin, including behind a local proxy', async () => {
  const send = sender();
  const post = handler(send);
  delete process.env.SITE_ORIGIN;
  assert.equal((await post(request())).status, 503);
  process.env.SITE_ORIGIN = 'https://sisicare.example/';
  assert.equal((await post(request())).status, 503);
  process.env.SITE_ORIGIN = 'https://sisicare.example';
  const proxied = new Request('http://localhost:3000/api/contact/', {
    method: 'POST',
    headers: { origin: 'https://sisicare.example', 'content-type': 'application/json' },
    body: JSON.stringify(valid),
  });
  assert.equal((await post(proxied)).status, 200);
  environment.NODE_ENV = 'development';
  const local = new Request('http://localhost:3001/api/contact/', {
    method: 'POST',
    headers: { origin: 'http://localhost:3001', 'content-type': 'application/json' },
    body: JSON.stringify(valid),
  });
  assert.equal((await post(local)).status, 200);
});

test('CAPTCHA failures, expired tokens, and wrong hostnames prevent SMTP', async () => {
  const send = sender();
  for (const providerResult of [
    { success: false },
    { success: true, hostname: 'other.example' },
    {},
  ]) {
    mock.method(globalThis, 'fetch', async () => Response.json(providerResult));
    const post = createContactHandler(send);
    assert.equal((await post(request())).status, 400);
    mock.restoreAll();
  }
  mock.method(globalThis, 'fetch', async () => {
    throw new Error('Must not fetch without token');
  });
  assert.equal(
    (await createContactHandler(send)(request({ ...valid, captchaToken: '' }))).status,
    400,
  );
  assert.equal(
    (await createContactHandler(send)(request({ ...valid, captchaToken: 'x'.repeat(4097) })))
      .status,
    400,
  );
  delete process.env.RECAPTCHA_SECRET_KEY;
  assert.equal((await createContactHandler(send)(request())).status, 503);
  assert.equal(send.mock.callCount(), 0);
});

test('CAPTCHA provider errors and timeouts fail closed', async () => {
  const send = sender();
  mock.method(globalThis, 'fetch', async () => {
    throw new DOMException('Timed out', 'TimeoutError');
  });
  assert.equal((await createContactHandler(send)(request())).status, 503);
  mock.restoreAll();
  mock.method(globalThis, 'fetch', async () => new Response('', { status: 500 }));
  assert.equal((await createContactHandler(send)(request())).status, 503);
  assert.equal(send.mock.callCount(), 0);
});

test('valid CAPTCHA is verified with Google before SMTP is called', async () => {
  const send = sender();
  const fetchMock = mock.method(
    globalThis,
    'fetch',
    async (url: Parameters<typeof fetch>[0], options?: RequestInit) => {
      assert.equal(send.mock.callCount(), 0);
      assert.equal(url, 'https://www.google.com/recaptcha/api/siteverify');
      assert.equal(options?.method, 'POST');
      const body = options?.body as URLSearchParams;
      assert.equal(body.get('secret'), 'test-secret');
      assert.equal(body.get('response'), 'valid-token');
      assert.equal(options?.cache, 'no-store');
      assert.ok(options?.signal);
      return Response.json({ success: true, hostname: 'sisicare.example' });
    },
  );
  assert.equal((await createContactHandler(send)(request())).status, 200);
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.equal(send.mock.callCount(), 1);
});

test('SMTP supports the reference settings and requires TLS for port 587', async () => {
  process.env.SMTP_USER = 'sender@gmail.com';
  process.env.SMTP_PASSWORD = 'abcdefghijklmnop';
  process.env.SMTP_FROM = 'alias@gmail.com';
  process.env.CONTACT_TO = 'business@example.com';
  process.env.SMTP_PORT = '587';
  process.env.SMTP_SECURE = 'false';
  const sendMail = mock.fn(async () => ({ accepted: ['business@example.com'], rejected: [] }));
  const create = mock.method(nodemailer, 'createTransport', (() => ({
    sendMail,
    close: () => {},
  })) as unknown as typeof nodemailer.createTransport);
  assert.equal(await sendContactEmail(valid), 'sent');
  const settings = create.mock.calls[0].arguments[0] as unknown as Record<string, unknown>;
  assert.equal(settings.port, 587);
  assert.equal(settings.secure, false);
  assert.equal(settings.requireTLS, true);
  const mail = sendMail.mock.calls[0].arguments as unknown as [{ from: unknown; to: unknown }];
  assert.deepEqual(mail[0].from, { name: 'Sisi Care website', address: 'alias@gmail.com' });
  assert.deepEqual(mail[0].to, { name: 'Sisi Care', address: 'business@example.com' });
});
