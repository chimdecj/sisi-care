import 'server-only';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { defaultContent, validateContent, type Content } from './schema';
export class CmsError extends Error {
  constructor(
    message: string,
    public status = 400,
    public retryAfter?: number,
  ) {
    super(message);
  }
}
export function dataDir() {
  const configured = process.env.CONTENT_DIR;
  if (!configured && process.env.NODE_ENV === 'production')
    throw new CmsError('CONTENT_DIR must be configured before using the editor.', 503);
  const dir = configured ? path.resolve(configured) : path.resolve(process.cwd(), '.local-content');
  if (configured && !path.isAbsolute(configured))
    throw new CmsError('CONTENT_DIR must be an absolute private path.', 503);
  if (
    process.env.NODE_ENV === 'production' &&
    (dir === process.cwd() ||
      dir.startsWith(process.cwd() + path.sep) ||
      dir.split(path.sep).includes('public_html'))
  )
    throw new CmsError('CONTENT_DIR must be outside the application and public_html.', 503);
  return dir;
}
export async function atomicWrite(file: string, data: string) {
  await fs.mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
  const temp = `${file}.${randomUUID()}.tmp`;
  try {
    const handle = await fs.open(temp, 'wx', 0o600);
    try {
      await handle.writeFile(data);
      await handle.sync();
    } finally {
      await handle.close();
    }
    await fs.rename(temp, file);
  } finally {
    await fs.rm(temp, { force: true });
  }
}
export async function locked<T>(name: string, fn: () => Promise<T>): Promise<T> {
  const lock = path.join(dataDir(), `${name}.lock`);
  await fs.mkdir(dataDir(), { recursive: true, mode: 0o700 });
  try {
    await fs.mkdir(lock);
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'EEXIST')
      throw new CmsError('Another operation is in progress. Try again shortly.', 409);
    throw e;
  }
  try {
    return await fn();
  } finally {
    await fs.rmdir(lock);
  }
}
export async function readContent(): Promise<Content> {
  if (!process.env.CONTENT_DIR && process.env.NODE_ENV === 'production')
    return structuredClone(defaultContent);
  try {
    return validateContent(
      JSON.parse(await fs.readFile(path.join(dataDir(), 'content.json'), 'utf8')),
    );
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === 'ENOENT') return structuredClone(defaultContent);
    throw e;
  }
}
export async function publish(value: unknown) {
  let content: Content;
  try {
    content = validateContent(value);
  } catch (e) {
    throw new CmsError((e as Error).message);
  }
  return locked('content', async () => {
    const current = await readContent();
    if (current.version !== content.version)
      throw new CmsError(
        'Content changed in another tab. Copy your edits, then reload before publishing.',
        409,
      );
    for (const img of Object.values(content.images))
      if (img.src.startsWith('/media/')) {
        try {
          await fs.access(path.join(dataDir(), 'uploads', img.src.slice(7)));
        } catch {
          throw new CmsError('A photo is missing. Upload it again.');
        }
      }
    const next = { ...content, version: randomUUID() };
    await atomicWrite(
      path.join(dataDir(), 'content.previous.json'),
      JSON.stringify(current, null, 2),
    );
    await atomicWrite(path.join(dataDir(), 'content.json'), JSON.stringify(next, null, 2));
    return next;
  });
}
