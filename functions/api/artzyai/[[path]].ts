type Env = {
  ARTZYAI_API_ORIGIN?: string;
  ARTZYAI_SERVICE_TOKEN?: string;
  ARTZYAI_BACKEND?: { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
};

type Context = { request: Request; env: Env; params: { path?: string | string[] } };
const noStore = { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };
const allowed = [
  /^consents$/,
  /^assets$/,
  /^assets\/[a-f0-9-]{16,64}$/i,
  /^jobs$/,
  /^jobs\/[a-f0-9-]{16,64}$/i,
  /^jobs\/[a-f0-9-]{16,64}\/(variations|edit|approve-direction)$/i,
  /^usage$/,
];

export const onRequest = async ({ request, env, params }: Context): Promise<Response> => {
  const origin = request.headers.get('origin');
  if (origin && origin !== new URL(request.url).origin) return Response.json({ error: 'Same-origin request required.' }, { status: 403, headers: noStore });
  const path = (Array.isArray(params.path) ? params.path.join('/') : params.path || '').replace(/^\/+|\/+$/g, '');
  if (!allowed.some(pattern => pattern.test(path))) return Response.json({ error: 'ArtzyAI route not found.' }, { status: 404, headers: noStore });
  if (!env.ARTZYAI_SERVICE_TOKEN) return Response.json({ error: 'ArtzyAI is not configured yet.' }, { status: 503, headers: noStore });
  if (Number(request.headers.get('content-length') || 0) > 8_500_000) return Response.json({ error: 'The request is too large.' }, { status: 413, headers: noStore });
  const guestId = (request.headers.get('x-artzy-guest-id') || '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64);
  if (!guestId) return Response.json({ error: 'Refresh the page and try again.' }, { status: 400, headers: noStore });
  const target = `${(env.ARTZYAI_API_ORIGIN || 'https://artzyai.artzysstudio.in').replace(/\/$/, '')}/v1/creative/${path}`;
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  const idempotency = request.headers.get('idempotency-key');
  if (idempotency) headers.set('Idempotency-Key', idempotency.slice(0, 128));
  headers.set('X-ArtzyAI-Service-Key', env.ARTZYAI_SERVICE_TOKEN);
  headers.set('X-Artzy-Guest-ID', guestId);
  try {
    // A service binding keeps the storefront-to-ArtzyAI request inside
    // Cloudflare's network. Retain the HTTPS fallback for local development.
    const upstreamRequest = new Request(target, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    });
    const upstream = env.ARTZYAI_BACKEND
      ? await env.ARTZYAI_BACKEND.fetch(upstreamRequest)
      : await fetch(upstreamRequest);
    const responseHeaders = new Headers(noStore);
    responseHeaders.set('Content-Type', upstream.headers.get('content-type') || 'application/json; charset=utf-8');
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    console.error(JSON.stringify({ message: 'ArtzyAI proxy failed', path, error: error instanceof Error ? error.message : String(error) }));
    return Response.json({ error: 'ArtzyAI is temporarily unavailable. Your selections remain on this page.' }, { status: 503, headers: noStore });
  }
};
