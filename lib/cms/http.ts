import { CmsError } from './storage';
export async function readBody(request: Request, limit: number) {
  if (Number(request.headers.get('content-length')) > limit)
    throw new CmsError('File or request is too large.', 413);
  const reader = request.body?.getReader();
  if (!reader) throw new CmsError('Missing request body.');
  const parts: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.length;
      if (length > limit) {
        await reader.cancel();
        throw new CmsError('File or request is too large.', 413);
      }
      parts.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(parts);
}
export function failure(error: unknown) {
  if (error instanceof CmsError)
    return Response.json(
      { error: error.message },
      {
        status: error.status,
        headers: {
          'Cache-Control': 'no-store',
          ...(error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : {}),
        },
      },
    );
  console.error('CMS operation failed', error instanceof Error ? error.message : 'Unknown error');
  return Response.json(
    {
      error:
        'Unable to complete this operation. Your changes have not been confirmed. Try again or check server storage.',
    },
    { status: 500 },
  );
}
export async function jsonBody(request: Request, limit: number) {
  const body = await readBody(request, limit);
  try {
    return JSON.parse(body.toString('utf8'));
  } catch {
    throw new CmsError('Invalid request.');
  }
}
