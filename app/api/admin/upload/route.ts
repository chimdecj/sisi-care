import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { checkOrigin, requireAdmin } from '@/lib/cms/auth';
import { failure, readBody } from '@/lib/cms/http';
import { CmsError, dataDir, locked } from '@/lib/cms/storage';
export const runtime = 'nodejs';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await requireAdmin();
    return await locked('upload', async () => {
      const input = await readBody(request, 10 * 1024 * 1024);
      let output: Buffer;
      try {
        const image = sharp(input, { limitInputPixels: 40_000_000, animated: false });
        const meta = await image.metadata();
        if (!['jpeg', 'png', 'webp'].includes(meta.format || '') || (meta.pages || 1) > 1)
          throw new Error('Unsupported image');
        output = await image
          .rotate()
          .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 82 })
          .toBuffer();
      } catch {
        throw new CmsError(
          'Upload a valid JPEG, PNG or WebP image, up to 10 MB and 40 megapixels.',
        );
      }
      const dir = path.join(dataDir(), 'uploads');
      await fs.mkdir(dir, { recursive: true, mode: 0o700 });
      const name = `${randomUUID()}.webp`;
      await fs.writeFile(path.join(dir, name), output, { flag: 'wx', mode: 0o600 });
      const dimensions = await sharp(output).metadata();
      return Response.json(
        { src: `/media/${name}`, width: dimensions.width, height: dimensions.height },
        { status: 201, headers: { 'Cache-Control': 'no-store' } },
      );
    });
  } catch (e) {
    return failure(e);
  }
}
