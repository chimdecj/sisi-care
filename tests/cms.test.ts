import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtemp, readFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { createHmac } from 'node:crypto';
import { defaultContent, validateContent } from '../lib/cms/schema';
import { publish, readContent, dataDir } from '../lib/cms/storage';
import { loginClient, reserveLoginAttempt } from '../lib/cms/login-rate-limit';
import { checkOrigin } from '../lib/cms/auth';
import { parseContactSubmission } from '../lib/contact-submission';
import { clientAddress, stampClientAddress } from '../lib/client-address.cjs';

test('content validation preserves layout and only allows approved image paths', () => {
  assert.deepEqual(validateContent(defaultContent), defaultContent);
  const c = structuredClone(defaultContent);
  c.copy.home.services.pop();
  assert.throws(() => validateContent(c), /number of items/);
  const image = structuredClone(defaultContent);
  image.images['hero-home'].src = '/media/../../secret';
  assert.throws(() => validateContent(image), /Invalid photo/);
  const bad = structuredClone(defaultContent);
  bad.copy.contact.who[0] = 'x'.repeat(61);
  assert.throws(() => validateContent(bad), /Contact options/);
});

test('publishing persists a backup, rejects stale writes and missing images, and coordinates workers', async () => {
  const previous = process.env.CONTENT_DIR;
  const dir = await mkdtemp(path.join(tmpdir(), 'sisi-cms-test-'));
  process.env.CONTENT_DIR = dir;
  try {
    const initial = await readContent();
    initial.copy.home.title = 'Published care headline';
    const next = await publish(initial);
    assert.notEqual(next.version, initial.version);
    assert.equal((await readContent()).copy.home.title, 'Published care headline');
    assert.equal(
      JSON.parse(await readFile(path.join(dir, 'content.previous.json'), 'utf8')).version,
      'initial',
    );
    await assert.rejects(publish(initial), /another tab/);
    const missing = structuredClone(next);
    missing.images['hero-home'].src = '/media/00000000-0000-0000-0000-000000000001.webp';
    await assert.rejects(publish(missing), /photo is missing/);
    await mkdir(path.join(dir, 'content.lock'));
    await assert.rejects(publish(next), /operation is in progress/);
    assert.equal((await readContent()).version, next.version);
    await rm(path.join(dir, 'content.lock'), { recursive: true });
    const outcomes = await Promise.allSettled([publish(next), publish(next)]);
    assert.equal(outcomes.filter((r) => r.status === 'fulfilled').length, 1);
  } finally {
    if (previous === undefined) delete process.env.CONTENT_DIR;
    else process.env.CONTENT_DIR = previous;
    await rm(dir, { recursive: true, force: true });
  }
});

test('login identity ignores forged forwarding headers and signed headers are verified', () => {
  const secret = process.env.ADMIN_SESSION_SECRET;
  process.env.ADMIN_SESSION_SECRET = 'test-secret-with-more-than-thirty-two-characters';
  try {
    const request = {
      socket: { remoteAddress: '192.0.2.1' },
      headers: {
        'x-forwarded-for': '198.51.100.1',
        'x-sisi-client-ip': 'forged',
        'x-sisi-client-signature': 'forged',
      },
    };
    assert.equal(clientAddress(request), '192.0.2.1');
    stampClientAddress(request);
    assert.equal(request.headers['x-sisi-client-ip'], '192.0.2.1');
    assert.equal(
      loginClient(new Request('http://localhost', { headers: request.headers })),
      '192.0.2.1',
    );
    assert.equal(
      request.headers['x-sisi-client-signature'],
      createHmac('sha256', process.env.ADMIN_SESSION_SECRET)
        .update('client-address:192.0.2.1')
        .digest('hex'),
    );
  } finally {
    if (secret === undefined) delete process.env.ADMIN_SESSION_SECRET;
    else process.env.ADMIN_SESSION_SECRET = secret;
  }
});

test('login attempt limits persist on disk and origin checks reject cross-site writes', async () => {
  const previous = process.env.CONTENT_DIR;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const origin = process.env.SITE_ORIGIN;
  const dir = await mkdtemp(path.join(tmpdir(), 'sisi-cms-rate-'));
  process.env.CONTENT_DIR = dir;
  process.env.ADMIN_SESSION_SECRET = 'disposable-test-secret-at-least-32-characters';
  process.env.SITE_ORIGIN = 'https://sisicarewa.com';
  try {
    for (let i = 0; i < 10; i++) await reserveLoginAttempt('192.0.2.1');
    await assert.rejects(reserveLoginAttempt('192.0.2.1'), /Too many/);
    await reserveLoginAttempt('192.0.2.2');
    assert.throws(
      () =>
        checkOrigin(
          new Request('https://sisicarewa.com/api/admin/content/', {
            headers: { origin: 'https://other.example' },
          }),
        ),
      /configured website/,
    );
    checkOrigin(
      new Request('https://sisicarewa.com/api/admin/content/', {
        headers: { origin: 'https://sisicarewa.com' },
      }),
    );
    process.env.CONTENT_DIR = 'relative-data';
    assert.throws(dataDir, /absolute/);
  } finally {
    for (const [key, value] of Object.entries({
      CONTENT_DIR: previous,
      ADMIN_SESSION_SECRET: secret,
      SITE_ORIGIN: origin,
    })) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(dir, { recursive: true, force: true });
  }
});

test('contact submissions validate the published choices', () => {
  const choices = structuredClone(defaultContent.copy.contact);
  choices.who[0] = 'My own care';
  const form = {
    name: 'Visitor',
    phone: '2065551234',
    email: 'visitor@example.com',
    who: 'My own care',
    support: [],
    when: choices.when[0],
    message: '',
  };
  assert.ok(parseContactSubmission(form, choices));
  assert.equal(parseContactSubmission(form), null);
});
