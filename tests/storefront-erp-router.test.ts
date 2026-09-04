import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from '../functions/api/storefront/[[path]]';

const env = {
  ERP_API_BASE_URL: 'https://erp.example.test',
  ERP_API_TOKEN: 'server-only-token',
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
        { id: 'one', name: 'Wall Art', image_url: 'data:image/png;base64,large' },
        { id: 'two', name: 'Gifts', image_url: 'https://media.artzysstudio.in/categories/gifts.webp' },
      ],
    });
  };

  try {
    const response = await onRequest(context('categories'));
    const payload = await response.json() as { data: Array<{ image_url: string | null }> };
    assert.equal(response.status, 200);
    assert.equal(payload.data[0].image_url, null);
    assert.equal(payload.data[1].image_url, 'https://media.artzysstudio.in/categories/gifts.webp');
  } finally {
    globalThis.fetch = originalFetch;
  }
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
