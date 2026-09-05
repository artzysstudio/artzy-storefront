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
