type Env = {
  ARTZYAI_API_ORIGIN?: string;
  ARTZYAI_SERVICE_TOKEN?: string;
  ARTZYAI_BACKEND?: { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
  ERP_API_BASE_URL?: string;
  STOREFRONT_PUBLIC_ORIGIN?: string;
};

type Context = { request: Request; env: Env; params: { path?: string | string[] } };
const noStore = { 'Cache-Control': 'no-store, max-age=0', 'X-Content-Type-Options': 'nosniff' };
const deviceCookieName = 'artzy_creative_device';
const productionStorefrontOrigins = [
  'https://www.artzysstudio.in',
  'https://artzysstudio.in',
];
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
  // Pages may expose the internal pages.dev origin to a Function even when
  // the browser is on the public custom domain. Keep the two canonical Artzy
  // origins explicit so legitimate builder requests never depend on an
  // optional dashboard variable, while still rejecting every other origin.
  const allowedOrigins = new Set([new URL(request.url).origin, ...productionStorefrontOrigins]);
  if (env.STOREFRONT_PUBLIC_ORIGIN) {
    try { allowedOrigins.add(new URL(env.STOREFRONT_PUBLIC_ORIGIN).origin); } catch { /* Ignore invalid optional configuration. */ }
  }
  if (origin && !allowedOrigins.has(origin)) return Response.json({ error: 'Same-origin request required.' }, { status: 403, headers: noStore });
  const path = (Array.isArray(params.path) ? params.path.join('/') : params.path || '').replace(/^\/+|\/+$/g, '');
  if (!allowed.some(pattern => pattern.test(path))) return Response.json({ error: 'ArtzyAI route not found.' }, { status: 404, headers: noStore });
  if (!env.ARTZYAI_SERVICE_TOKEN) return Response.json({ error: 'ArtzyAI is not configured yet.' }, { status: 503, headers: noStore });
  if (Number(request.headers.get('content-length') || 0) > 8_500_000) return Response.json({ error: 'The request is too large.' }, { status: 413, headers: noStore });
  const cookieValue = (request.headers.get('cookie') || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${deviceCookieName}=`))?.slice(deviceCookieName.length + 1);
  const existingDevice = (cookieValue || '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64);
  const guestId = existingDevice || crypto.randomUUID();
  const setDeviceCookie = !existingDevice ? `${deviceCookieName}=${guestId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000` : '';
  // The bound Worker receives this request directly; an internal hostname
  // avoids re-entering the public custom-domain route. The hostname is not
  // resolved when a Service binding handles the request.
  const upstreamOrigin = env.ARTZYAI_BACKEND
    ? 'https://artzyai-backend.internal'
    : (env.ARTZYAI_API_ORIGIN || 'https://artzyai.artzysstudio.in').replace(/\/$/, '');
  const target = `${upstreamOrigin}/v1/creative/${path}`;
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  const idempotency = request.headers.get('idempotency-key');
  if (idempotency) headers.set('Idempotency-Key', idempotency.slice(0, 128));
  headers.set('X-ArtzyAI-Service-Key', env.ARTZYAI_SERVICE_TOKEN);
  headers.set('X-Artzy-Guest-ID', guestId);
  const customerToken = (request.headers.get('x-artzy-customer-token') || '').trim().slice(0, 4096);
  if (customerToken && env.ERP_API_BASE_URL) {
    try {
      const customerResponse = await fetch(`${env.ERP_API_BASE_URL.replace(/\/$/, '')}/storefront/auth/me`, { headers: { Authorization: `Bearer ${customerToken}`, Accept: 'application/json' } });
      const customer = await customerResponse.json() as { user?: { id?: string }; id?: string };
      const customerId = String(customer.user?.id || customer.id || '').replace(/[^a-zA-Z0-9-]/g, '').slice(0, 64);
      if (customerResponse.ok && customerId) headers.set('X-Artzy-User-ID', customerId);
    } catch { /* A failed ERP identity check safely falls back to the server-issued device identity. */ }
  }
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
    if (setDeviceCookie) responseHeaders.append('Set-Cookie', setDeviceCookie);
    // Insufficient preview credits are an expected customer-facing state, not
    // a broken network resource. Preserve the structured error for the client
    // while returning a successful transport response to avoid a noisy 402 in
    // the browser console.
    if (upstream.status === 402) {
      const payload = await upstream.json().catch(() => ({
        error: 'ArtzyAI preview credits are currently unavailable. Your choices remain here; please ask the studio for help.',
      })) as Record<string, unknown>;
      return Response.json({ ...payload, category: payload.category || 'credits_unavailable' }, { status: 200, headers: responseHeaders });
    }
    return new Response(upstream.body, { status: upstream.status, headers: responseHeaders });
  } catch (error) {
    console.error(JSON.stringify({ message: 'ArtzyAI proxy failed', path, error: error instanceof Error ? error.message : String(error) }));
    const responseHeaders = new Headers(noStore);
    if (setDeviceCookie) responseHeaders.append('Set-Cookie', setDeviceCookie);
    return Response.json({ error: 'ArtzyAI is temporarily unavailable. Your selections remain on this page.' }, { status: 503, headers: responseHeaders });
  }
};
