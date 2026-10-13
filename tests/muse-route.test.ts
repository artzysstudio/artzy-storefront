import assert from "node:assert/strict";
import test from "node:test";
import { onRequestPost } from "../functions/api/muse";

test("forwards the current page, conversation and budget to private ArtzyAI", async () => {
  let forwarded: Request | undefined;
  const response = await onRequestPost({
    request: new Request("https://www.artzysstudio.in/api/muse", {
      method: "POST",
      headers: { Origin: "https://www.artzysstudio.in", "content-type": "application/json" },
      body: JSON.stringify({
        message: "1999/- is my budget",
        page: "/gifts/",
        language: "en",
        history: [{ role: "assistant", text: "Who is the gift for?" }],
      }),
    }),
    env: {
      ARTZYAI_SERVICE_TOKEN: "secret",
      ARTZYAI_BACKEND: {
        async fetch(input) {
          forwarded = input as Request;
          return Response.json({ reply: "₹1,999 noted. Who is the gift for?", mode: "ai" });
        },
      },
    },
  });

  assert.equal(response.status, 200);
  assert.equal(forwarded?.headers.get("X-ArtzyAI-Service-Key"), "secret");
  const requestBody = await forwarded?.json() as { message: string; page: string; history: Array<{ text: string }> };
  assert.equal(requestBody.message, "1999/- is my budget");
  assert.equal(requestBody.page, "/gifts/");
  assert.equal(requestBody.history[0].text, "Who is the gift for?");
});

test("rejects requests from an unrelated origin", async () => {
  const response = await onRequestPost({
    request: new Request("https://www.artzysstudio.in/api/muse", {
      method: "POST",
      headers: { Origin: "https://attacker.example", "content-type": "application/json" },
      body: JSON.stringify({ message: "hello" }),
    }),
    env: { ARTZYAI_SERVICE_TOKEN: "secret" },
  });
  assert.equal(response.status, 403);
});

test('suggested pieces receive trusted catalogue links, including zero sale-price fallback', async (t) => {
  t.mock.method(globalThis, 'fetch', async (input: RequestInfo | URL) => {
    if (String(input).includes('gift-hampers')) return Response.json([]);
    return Response.json([{ id: 'tray-1', name: 'Floral Tray', price: 899, sale_price: 0, quantity: 2, route_slug: 'floral-tray--tray-1' }, { id: 'sold', name: 'Sold Box', price: 599, quantity: 0 }]);
  });
  const response = await onRequestPost({
    request: new Request('https://www.artzysstudio.in/api/muse', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ message: 'Gift under 1500' }) }),
    env: { ERP_API_BASE_URL: 'https://erp.artzysstudio.in', ERP_API_TOKEN: 'test', ARTZYAI_SERVICE_TOKEN: 'test', ARTZYAI_BACKEND: { async fetch() { return Response.json({ reply: 'Try the Floral Tray. Sold Box is unavailable.' }); } } },
  });
  const result = await response.json();
  assert.deepEqual(result.products, [{ name: 'Floral Tray', price: 899, href: '/products/floral-tray--tray-1/' }]);
});
