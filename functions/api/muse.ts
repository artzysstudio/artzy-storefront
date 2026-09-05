type MuseRole = "assistant" | "customer";

type MuseMessage = { role: MuseRole; text: string };
type MuseRequest = {
  message?: string;
  page?: string;
  language?: "en" | "hi" | "mr";
  history?: MuseMessage[];
};

type Env = {
  ARTZYAI_SERVICE_TOKEN?: string;
  ARTZYAI_BACKEND?: { fetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> };
  ARTZYAI_API_ORIGIN?: string;
  ERP_API_BASE_URL?: string;
  ERP_API_TOKEN?: string;
  ERP_PRODUCTS_PATH?: string;
  ERP_GIFT_HAMPERS_PATH?: string;
  STOREFRONT_PUBLIC_ORIGIN?: string;
};

type Context = { request: Request; env: Env };

const noStore = {
  "Cache-Control": "no-store, max-age=0",
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
};
const deviceCookieName = "artzy_creative_device";
const canonicalOrigins = ["https://www.artzysstudio.in", "https://artzysstudio.in"];

function json(payload: unknown, status = 200, cookie = ""): Response {
  const headers = new Headers(noStore);
  if (cookie) headers.append("Set-Cookie", cookie);
  return Response.json(payload, { status, headers });
}

function cleanText(value: unknown, limit: number): string {
  return typeof value === "string" ? value.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, limit) : "";
}

function allowedOrigin(request: Request, env: Env): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const allowed = new Set([new URL(request.url).origin, ...canonicalOrigins]);
  if (env.STOREFRONT_PUBLIC_ORIGIN) {
    try { allowed.add(new URL(env.STOREFRONT_PUBLIC_ORIGIN).origin); } catch { /* Ignore invalid optional configuration. */ }
  }
  return allowed.has(origin);
}

function deviceIdentity(request: Request): { id: string; cookie: string } {
  const raw = (request.headers.get("cookie") || "").split(";").map(value => value.trim())
    .find(value => value.startsWith(`${deviceCookieName}=`))?.slice(deviceCookieName.length + 1) || "";
  const existing = raw.replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
  const id = existing || crypto.randomUUID();
  return {
    id,
    cookie: existing ? "" : `${deviceCookieName}=${id}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000`,
  };
}

function findItems(payload: unknown): Array<Record<string, unknown>> {
  if (Array.isArray(payload)) return payload.filter(item => item && typeof item === "object") as Array<Record<string, unknown>>;
  if (!payload || typeof payload !== "object") return [];
  const record = payload as Record<string, unknown>;
  for (const key of ["data", "products", "items", "hampers", "giftHampers"]) {
    const found = findItems(record[key]);
    if (found.length) return found;
  }
  return [];
}

function compactItem(item: Record<string, unknown>): Record<string, string | number | boolean> | null {
  const name = cleanText(item.name || item.title || item.product_name, 100);
  if (!name) return null;
  const price = Number(item.sale_price ?? item.salePrice ?? item.price ?? item.unit_price ?? 0);
  const quantity = Number(item.stock_quantity ?? item.stockQuantity ?? item.quantity ?? 0);
  return {
    name,
    ...(Number.isFinite(price) && price > 0 ? { price } : {}),
    category: cleanText(item.category_name || item.category || item.type, 60),
    available: item.in_stock === true || item.available === true || quantity > 0,
    slug: cleanText(item.slug || item.id, 90),
  };
}

async function catalogue(env: Env): Promise<Array<Record<string, string | number | boolean>>> {
  if (!env.ERP_API_BASE_URL || !env.ERP_API_TOKEN) return [];
  const base = env.ERP_API_BASE_URL.endsWith("/") ? env.ERP_API_BASE_URL : `${env.ERP_API_BASE_URL}/`;
  const paths = [
    env.ERP_PRODUCTS_PATH || "/api/products/featured",
    env.ERP_GIFT_HAMPERS_PATH || "/api/storefront/gift-hampers",
  ];
  const responses = await Promise.all(paths.map(async path => {
    try {
      const response = await fetch(new URL(path.replace(/^\//, ""), base), {
        headers: { Accept: "application/json", Authorization: `Bearer ${env.ERP_API_TOKEN}` },
      });
      return response.ok ? await response.json() as unknown : null;
    } catch { return null; }
  }));
  return responses.flatMap(findItems).map(compactItem).filter((item): item is NonNullable<typeof item> => Boolean(item)).slice(0, 24);
}

export const onRequestPost = async ({ request, env }: Context): Promise<Response> => {
  if (!allowedOrigin(request, env)) return json({ error: "Same-origin request required." }, 403);
  if (!request.headers.get("content-type")?.includes("application/json")) return json({ error: "JSON body required." }, 415);
  if (Number(request.headers.get("content-length") || 0) > 24_000) return json({ error: "The message is too large." }, 413);

  let input: MuseRequest;
  try { input = await request.json() as MuseRequest; } catch { return json({ error: "Invalid message." }, 400); }
  const message = cleanText(input.message, 1_200);
  if (message.length < 1) return json({ error: "Please enter a question." }, 400);
  const history = Array.isArray(input.history) ? input.history.slice(-10).map(entry => ({
    role: entry.role === "customer" ? "customer" as const : "assistant" as const,
    text: cleanText(entry.text, 1_200),
  })).filter(entry => entry.text) : [];
  const page = cleanText(input.page, 160) || "/";
  const language = ["en", "hi", "mr"].includes(input.language || "") ? input.language : "en";
  const identity = deviceIdentity(request);
  if (!env.ARTZYAI_SERVICE_TOKEN) return json({ error: "Artzy Muse is temporarily unavailable." }, 503, identity.cookie);

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-ArtzyAI-Service-Key": env.ARTZYAI_SERVICE_TOKEN,
    "X-Artzy-Guest-ID": identity.id,
  });
  const customerToken = cleanText(request.headers.get("x-artzy-customer-token"), 4_096);
  if (customerToken && env.ERP_API_BASE_URL) {
    try {
      const identityResponse = await fetch(`${env.ERP_API_BASE_URL.replace(/\/$/, "")}/api/storefront/auth/me`, {
        headers: { Accept: "application/json", Authorization: `Bearer ${customerToken}` },
      });
      const customer = await identityResponse.json() as { user?: { id?: string }; id?: string };
      const customerId = String(customer.user?.id || customer.id || "").replace(/[^a-zA-Z0-9-]/g, "").slice(0, 64);
      if (identityResponse.ok && customerId) headers.set("X-Artzy-User-ID", customerId);
    } catch { /* Continue with the server-issued guest identity. */ }
  }
  const payload = JSON.stringify({ message, history, page, language, catalogue: await catalogue(env) });
  const target = `${(env.ARTZYAI_API_ORIGIN || "https://artzyai.artzysstudio.in").replace(/\/$/, "")}/v1/creative/muse`;

  try {
    const upstreamRequest = new Request(target, { method: "POST", headers, body: payload });
    const upstream = env.ARTZYAI_BACKEND ? await env.ARTZYAI_BACKEND.fetch(upstreamRequest) : await fetch(upstreamRequest);
    const result = await upstream.json().catch(() => ({ error: "Artzy Muse could not answer just now." })) as Record<string, unknown>;
    return json(result, upstream.ok ? 200 : upstream.status, identity.cookie);
  } catch {
    return json({ error: "Artzy Muse could not answer just now." }, 503, identity.cookie);
  }
};
