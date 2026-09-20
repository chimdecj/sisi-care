import { checkOrigin, requireAdmin } from '@/lib/cms/auth';
import { failure, jsonBody } from '@/lib/cms/http';
import { publish, readContent } from '@/lib/cms/storage';
export async function GET() {
  try {
    await requireAdmin();
    return Response.json(await readContent(), { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return failure(e);
  }
}
export async function PUT(request: Request) {
  try {
    checkOrigin(request);
    await requireAdmin();
    return Response.json(await publish(await jsonBody(request, 512_000)), {
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (e) {
    return failure(e);
  }
}
