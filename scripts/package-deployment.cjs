const { mkdirSync } = require('node:fs');
const { spawnSync } = require('node:child_process');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
mkdirSync(path.join(root, 'dist'), { recursive: true });
// Source-only allowlist: install dependencies and build on the Linux host.
const files = [
  'app',
  'components',
  'lib',
  'public',
  'scripts/package-deployment.cjs',
  'scripts/admin-password.cjs',
  'package.json',
  'package-lock.json',
  'next.config.ts',
  'tsconfig.json',
  'postcss.config.mjs',
  'server.js',
  '.env.example',
  'DEPLOYMENT.md',
  'CONTENT-EDITOR.md',
];
const result = spawnSync(
  'tar',
  [
    '--exclude=.DS_Store',
    '--exclude=._*',
    '--exclude=.env.local',
    '--exclude=.env.production*',
    '-czf',
    'dist/sisi-care-namecheap.tar.gz',
    ...files,
  ],
  { cwd: root, stdio: 'inherit', env: { ...process.env, COPYFILE_DISABLE: '1' } },
);
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status || 1);
console.log(
  'Created dist/sisi-care-namecheap.tar.gz (source and blank environment template; no credentials, local dependencies, or build).',
);
