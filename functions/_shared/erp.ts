export interface StorefrontEnv {
  ERP_API_BASE_URL?: string;
  ERP_API_TOKEN?: string;
  ERP_PRODUCTS_PATH?: string;
  ERP_CATEGORIES_PATH?: string;
  ERP_ORDER_PATH?: string;
}

export interface PagesContext {
  request: Request;
  env: StorefrontEnv;
}

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store",
};

export function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: jsonHeaders });
}

export async function proxyErp(
  context: PagesContext,
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const { request, env } = context;
  if (!env.ERP_API_BASE_URL || !env.ERP_API_TOKEN) {
    return json(
      {
        success: false,
        code: "ERP_NOT_CONFIGURED",
        error: "The storefront ERP connection is not configured yet.",
      },
      503,
    );
  }

  let target: URL;
  try {
    const base = env.ERP_API_BASE_URL.endsWith("/")
      ? env.ERP_API_BASE_URL
      : `${env.ERP_API_BASE_URL}/`;
    target = new URL(path.replace(/^\//, ""), base);
  } catch {
    return json({ success: false, error: "Invalid ERP API configuration." }, 500);
  }

  const headers = new Headers(init.headers);
  headers.set("accept", "application/json");
  headers.set("authorization", `Bearer ${env.ERP_API_TOKEN}`);
  headers.set("x-storefront-origin", new URL(request.url).origin);

  try {
    const upstream = await fetch(target, { ...init, headers });
    if (!(upstream.headers.get("content-type") ?? "").includes("application/json")) {
      return json(
        { success: false, error: "The ERP returned an unexpected response." },
        502,
      );
    }
    return new Response(upstream.body, {
      status: upstream.status,
      headers: {
        ...jsonHeaders,
        "cache-control":
          request.method === "GET"
            ? "public, max-age=60, s-maxage=300, stale-while-revalidate=900"
            : "no-store",
      },
    });
  } catch {
    return json({ success: false, error: "The ERP is temporarily unavailable." }, 502);
  }
}
