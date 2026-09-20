// Run after npm run build; uses disposable credentials and a private temporary directory.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { mkdtemp, rm, readFile, writeFile } = require('node:fs/promises');
const { tmpdir } = require('node:os');
const path = require('node:path');
const { randomBytes, scryptSync } = require('node:crypto');

(async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'sisi-admin-live-'));
  const port = process.env.CMS_TEST_PORT || '3194';
  const base = `http://127.0.0.1:${port}`;
  const password = randomBytes(20).toString('hex');
  const salt = randomBytes(16).toString('hex');
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    PORT: port,
    CONTENT_DIR: dir,
    SITE_ORIGIN: base,
    ADMIN_USERNAME: 'test-admin',
    ADMIN_PASSWORD_HASH: `scrypt:${salt}:${scryptSync(password, salt, 64).toString('hex')}`,
    ADMIN_SESSION_SECRET: randomBytes(32).toString('hex'),
    ADMIN_TRUSTED_PROXIES: '',
  };
  let server,
    output = '',
    cookie = '';
  async function start() {
    server = spawn(process.execPath, ['server.js'], { env, stdio: ['ignore', 'pipe', 'pipe'] });
    server.stdout.on('data', (chunk) => {
      output += chunk;
    });
    server.stderr.on('data', (chunk) => {
      output += chunk;
    });
    for (let n = 0; n < 100; n++) {
      if (server.exitCode !== null) throw new Error(`Server exited: ${output}`);
      try {
        const r = await fetch(base + '/admin/');
        if (r.status === 200) return;
      } catch {}
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    throw new Error(`Startup timed out: ${output}`);
  }
  async function stop() {
    if (!server || server.exitCode !== null) return;
    const exited = new Promise((resolve) => server.once('exit', resolve));
    server.kill('SIGTERM');
    await exited;
  }
  async function request(route, method = 'GET', body, extra = {}) {
    return fetch(base + route, {
      method,
      headers: {
        Origin: base,
        ...(cookie ? { Cookie: cookie } : {}),
        ...(body ? { 'Content-Type': 'application/json' } : {}),
        ...extra,
      },
      ...(body
        ? { body: typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body) }
        : {}),
    });
  }
  try {
    await start();
    assert.equal((await request('/api/admin/content/')).status, 401);
    assert.equal((await request('/api/admin/upload/', 'POST', 'bad')).status, 401);
    assert.equal(
      (
        await request(
          '/api/admin/login/',
          'POST',
          { username: 'test-admin', password },
          { Origin: 'https://other.example' },
        )
      ).status,
      403,
    );
    assert.equal(
      (await request('/api/admin/login/', 'POST', { username: 'test-admin', password: 'wrong' }))
        .status,
      401,
    );
    const login = await request('/api/admin/login/', 'POST', { username: 'test-admin', password });
    assert.equal(login.status, 200);
    const setCookie = login.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /Secure/i);
    assert.match(setCookie, /SameSite=strict/i);
    cookie = setCookie.split(';')[0];
    assert.match(await (await request('/admin/')).text(), /Content editor/);
    const current = await (await request('/api/admin/content/')).json();
    const original = structuredClone(current);
    for (const key of ['home', 'care', 'about', 'careers', 'contact'])
      current.copy[key].eyebrow = `Published ${key} smoke check`;
    current.copy.contact.who[0] = 'My own care';
    current.careDetails[0].title = 'Published service check';
    assert.equal(
      (await request('/api/admin/content/', 'PUT', current, { Origin: 'https://other.example' }))
        .status,
      403,
    );
    assert.equal(
      (await request('/api/admin/upload/', 'POST', '<svg/>', { 'Content-Type': 'image/svg+xml' }))
        .status,
      400,
    );
    const image = await readFile('public/images/enhenced-new/careers-hero-asia.jpg');
    const upload = await request('/api/admin/upload/', 'POST', image, {
      'Content-Type': 'image/jpeg',
    });
    assert.equal(upload.status, 201);
    const photo = await upload.json();
    assert.ok(photo.width > 0 && photo.height > 0);
    current.images['hero-careers'] = photo;
    const published = await request('/api/admin/content/', 'PUT', current);
    assert.equal(published.status, 200);
    const saved = await published.json();
    assert.notEqual(saved.version, current.version);
    assert.equal((await request('/api/admin/content/', 'PUT', original)).status, 409);
    for (const [section, url] of [
      ['home', '/'],
      ['care', '/in-home-care/'],
      ['about', '/about/'],
      ['careers', '/careers/'],
      ['contact', '/contact/'],
    ]) {
      const response = await request(url);
      assert.equal(response.status, 200);
      assert.ok((await response.text()).includes(`Published ${section} smoke check`), section);
    }
    const media = await request(photo.src + '/');
    assert.equal(media.status, 200);
    assert.equal(media.headers.get('content-type'), 'image/webp');
    await stop();
    await start();
    assert.equal((await (await request('/api/admin/content/')).json()).version, saved.version);
    assert.ok(
      (await (await request('/careers/')).text()).includes('Published careers smoke check'),
    );
    const session = JSON.parse(await readFile(path.join(dir, 'session.json'), 'utf8'));
    await writeFile(path.join(dir, 'session.json'), JSON.stringify({ ...session, expires: 0 }));
    assert.equal((await request('/api/admin/content/')).status, 401);
    const again = await request('/api/admin/login/', 'POST', { username: 'test-admin', password });
    cookie = again.headers.get('set-cookie').split(';')[0];
    assert.equal((await request('/api/admin/logout/', 'POST')).status, 200);
    assert.equal((await request('/api/admin/content/')).status, 401);
    console.log(
      'PASS: authentication, secure cookie, origin protection, upload validation, all five dynamic pages, stale-write protection, image serving, restart persistence, expiry, and logout.',
    );
  } finally {
    await stop();
    await rm(dir, { recursive: true, force: true });
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
