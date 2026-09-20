import { promises as fs } from 'node:fs';
import path from 'node:path';
import { dataDir } from '@/lib/cms/storage';
import { uploadName } from '@/lib/cms/schema';
export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!uploadName.test(name)) return new Response('Not found', { status: 404 });
  try {
    const data = await fs.readFile(path.join(dataDir(), 'uploads', name));
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': 'image/webp',
        'Content-Length': String(data.length),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (e) {
    return new Response('Image unavailable', {
      status: (e as NodeJS.ErrnoException).code === 'ENOENT' ? 404 : 503,
    });
  }
}
