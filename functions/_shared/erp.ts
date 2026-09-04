export interface StorefrontEnv {
  ERP_API_BASE_URL?: string;
  ERP_API_TOKEN?: string;
  ERP_HEALTH_PATH?: string;
  ERP_PRODUCTS_PATH?: string;
  ERP_CATEGORIES_PATH?: string;
  ERP_ORDER_PATH?: string;
  ERP_SHIPPING_PATH?: string;
  ERP_PAYMENT_INITIATE_PATH?: string;
  ERP_PAYMENT_VERIFY_PATH?: string;
  ERP_CUSTOMER_MAGIC_LINK_PATH?: string;
  ERP_CUSTOMER_GOOGLE_AUTH_URL?: string;
  ERP_CUSTOM_ORDER_PATH?: string;
  STOREFRONT_PUBLIC_ORIGIN?: string;
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
  const requestId = request.headers.get("x-request-id")?.slice(0, 128) || crypto.randomUUID();
  headers.set("x-storefront-request-id", requestId);
  const customerToken = request.headers.get("x-customer-token")?.trim();
  if (customerToken && customerToken.length <= 4_096) {
    headers.set("x-customer-token", customerToken);
  }

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
        "x-storefront-request-id": requestId,
        "cache-control":
          request.method === "GET"
            ? upstream.headers.get("cache-control") ??
              "public, max-age=60, s-maxage=300, stale-while-revalidate=900"
            : "no-store",
      },
    });
  } catch {
    return json({ success: false, error: "The ERP is temporarily unavailable." }, 502);
  }
}
