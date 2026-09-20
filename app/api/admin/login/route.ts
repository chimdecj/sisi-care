import { loginClient } from '@/lib/cms/login-rate-limit';
import { checkOrigin, login } from '@/lib/cms/auth';
import { CmsError } from '@/lib/cms/storage';
import { failure, jsonBody } from '@/lib/cms/http';
export async function POST(request: Request) {
  try {
    checkOrigin(request);
    const data = await jsonBody(request, 4096);
    if (!data || typeof data !== 'object' || Array.isArray(data))
      throw new CmsError('Invalid login request.');
    await login(data.username, data.password, loginClient(request));
    return Response.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return failure(e);
  }
}
