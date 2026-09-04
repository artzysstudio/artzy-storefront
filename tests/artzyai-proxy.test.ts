import assert from 'node:assert/strict';
import test from 'node:test';
import { onRequest } from '../functions/api/artzyai/[[path]]';

const publicOrigin = 'https://www.artzysstudio.in';

function context(origin: string) {
  let forwarded: Request | undefined;
  return {
    get forwarded() { return forwarded; },
    value: {
      request: new Request('https://artzy-storefront.pages.dev/api/artzyai/usage', {
        headers: { Origin: origin },
      }),
      env: {
        ARTZYAI_SERVICE_TOKEN: 'test-service-token',
        STOREFRONT_PUBLIC_ORIGIN: publicOrigin,
        ARTZYAI_BACKEND: {
          async fetch(request: RequestInfo | URL) {
            forwarded = request as Request;
            return Response.json({ jobId: 'job-test', status: 'queued' });
          },
        },
      },
      params: { path: 'usage' },
    },
  };
}

test('accepts the configured public storefront origin through the Pages router', async () => {
  const mock = context(publicOrigin);
  const response = await onRequest(mock.value);
  assert.equal(response.status, 200);
  assert.equal(mock.forwarded?.headers.get('X-ArtzyAI-Service-Key'), 'test-service-token');
});

test('rejects an untrusted cross-origin generation request', async () => {
  const mock = context('https://attacker.example');
  const response = await onRequest(mock.value);
  assert.equal(response.status, 403);
  assert.equal(mock.forwarded, undefined);
});
