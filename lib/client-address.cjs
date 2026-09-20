const { isIP } = require('node:net');
const { createHmac } = require('node:crypto');
function normalize(value) {
  if (typeof value !== 'string') return '';
  const ip = value.trim().toLowerCase();
  if (ip.startsWith('::ffff:') && isIP(ip.slice(7)) === 4) return ip.slice(7);
  if (isIP(ip) === 4) return ip;
  if (isIP(ip) === 6 && !ip.includes('%')) return new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  return '';
}
function clientAddress(req, trustedList = '') {
  const peer = normalize(req.socket.remoteAddress);
  const trusted = new Set(trustedList.split(',').map(normalize).filter(Boolean));
  if (!peer || !trusted.has(peer)) return peer;
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded !== 'string' || forwarded.length > 2048) return '';
  const hops = forwarded.split(',').map(normalize);
  if (!hops.length || hops.some((ip) => !ip)) return '';
  // Walk from the actual socket toward the client, ignoring only explicitly trusted proxies.
  for (let i = hops.length - 1; i >= 0; i--) if (!trusted.has(hops[i])) return hops[i];
  return hops[0];
}
function stampClientAddress(req) {
  delete req.headers['x-sisi-client-ip'];
  delete req.headers['x-sisi-client-signature'];
  const address = clientAddress(req, process.env.ADMIN_TRUSTED_PROXIES || '');
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!address || !secret) return;
  req.headers['x-sisi-client-ip'] = address;
  req.headers['x-sisi-client-signature'] = createHmac('sha256', secret)
    .update(`client-address:${address}`)
    .digest('hex');
}
module.exports = { clientAddress, stampClientAddress };
