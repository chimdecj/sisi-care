// Read the password interactively without echoing it or putting it in shell history.
const { randomBytes, scryptSync } = require('node:crypto');
if (!process.stdin.isTTY) {
  console.error('Run this in an interactive terminal.');
  process.exit(1);
}
process.stdout.write('New admin password (at least 12 characters): ');
process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
process.stdin.resume();
let password = '';
process.stdin.on('data', (chunk) => {
  for (const ch of chunk) {
    if (ch === '\u0003') {
      process.stdin.setRawMode(false);
      process.exit(1);
    }
    if (ch === '\r' || ch === '\n') {
      process.stdin.setRawMode(false);
      process.stdin.pause();
      if (password.length < 12 || password.length > 256) {
        console.error('\nUse 12–256 characters.');
        process.exit(1);
      }
      const salt = randomBytes(16).toString('hex');
      console.log(
        '\nADMIN_PASSWORD_HASH=scrypt:' +
          salt +
          ':' +
          scryptSync(password, salt, 64).toString('hex'),
      );
      console.log('ADMIN_SESSION_SECRET=' + randomBytes(32).toString('hex'));
      process.exit(0);
    }
    if (ch === '\u007f') password = password.slice(0, -1);
    else password += ch;
  }
});
