import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from '../functions/api/storefront/[[path]]';

const env = {
  ERP_API_BASE_URL: 'https://erp.example.test',
  ERP_API_TOKEN: 'server-only-token',
  STOREFRONT_PUBLIC_ORIGIN: 'https://www.artzysstudio.in',
};

function context(path: string) {
  return {
    request: new Request(`https://www.artzysstudio.in/api/storefront/${path}`),
    env,
    params: { path: path.split('/') },
  };
}

test('status checks the live ERP health endpoint', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    assert.equal(new Headers(init?.headers).get('authorization'), 'Bearer server-only-token');
    return Response.json({ status: 'ok' });
  };

  try {
    const response = await onRequest(context('status'));
    const payload = await response.json() as { connected: boolean };
    assert.equal(response.status, 200);
    assert.equal(payload.connected, true);
    assert.equal(requestedUrl, 'https://erp.example.test/api/health');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('categories use the deployed ERP route and remove inline image blobs', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (input) => {
    assert.equal(String(input), 'https://erp.example.test/api/categories');
    return Response.json({
      success: true,
      data: [
        { id: 'one', name: 'Wall Art', image_url: 'data:image/png;base64,large', banner_url: 'data:image/jpeg;base64,large' },
        { id: 'two', name: 'Gifts', image_url: 'https://media.artzysstudio.in/categories/gifts.webp' },
      ],
    });
  };

  try {
    const response = await onRequest(context('categories'));
    const payload = await response.json() as { data: Array<{ image_url: string | null; banner_url?: string | null }> };
    assert.equal(response.status, 200);
    assert.equal(payload.data[0].image_url, null);
    assert.equal(payload.data[0].banner_url, null);
    assert.equal(payload.data[1].image_url, 'https://media.artzysstudio.in/categories/gifts.webp');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('gift hampers use the dedicated published hamper feed', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  let requestedUrl = '';
  globalThis.fetch = async (input) => {
    requestedUrl = String(input);
    return Response.json({ success: true, data: [{ id: 'hamper-one', name: 'Celebration Hamper' }] });
  };

  try {
    const response = await onRequest(context('gift-hampers'));
    const payload = await response.json() as { data: Array<{ id: string }> };
    assert.equal(response.status, 200);
    assert.equal(requestedUrl, 'https://erp.example.test/api/storefront/gift-hampers');
    assert.equal(payload.data[0].id, 'hamper-one');
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test('Google sign-in always returns global customers to the production account page', async () => {
  const response = await onRequest(context('auth/google'));
  assert.equal(response.status, 302);
  const target = new URL(response.headers.get('location') ?? '');
  assert.equal(target.origin, 'https://erp.example.test');
  assert.equal(target.pathname, '/api/storefront/auth/google');
  assert.equal(target.searchParams.get('return_to'), 'https://www.artzysstudio.in/account/');
});

test('Google sign-in rejects an accidental localhost storefront configuration', async () => {
  const mock = context('auth/google');
  mock.env = { ...env, STOREFRONT_PUBLIC_ORIGIN: 'http://localhost:3000' };
  const response = await onRequest(mock);
  const target = new URL(response.headers.get('location') ?? '');
  assert.equal(target.searchParams.get('return_to'), 'https://www.artzysstudio.in/account/');
});

test('status fails closed when the ERP is unavailable', { concurrency: false }, async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => new Response('Unavailable', {
    status: 503,
    headers: { 'content-type': 'application/json' },
  });

  try {
    const response = await onRequest(context('status'));
    const payload = await response.json() as { configured: boolean; connected: boolean };
    assert.equal(response.status, 503);
    assert.equal(payload.configured, true);
    assert.equal(payload.connected, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
