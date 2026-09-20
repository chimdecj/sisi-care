import { checkOrigin, logout } from '@/lib/cms/auth';
import { failure } from '@/lib/cms/http';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    await logout();
    return Response.json({ ok: true });
  } catch (e) {
    return failure(e);
  }
}
