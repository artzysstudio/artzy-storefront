import {
  json,
  proxyErp,
  type PagesContext,
} from "../../_shared/erp";

interface RouteContext extends PagesContext {
  params: { path?: string | string[] };
}

const CANONICAL_STOREFRONT_ORIGIN = "https://www.artzysstudio.in";

function customerReturnOrigin(context: RouteContext): string {
  const configured = context.env.STOREFRONT_PUBLIC_ORIGIN?.trim();
  if (configured) {
    try {
      const url = new URL(configured);
      if (url.protocol === "https:" && !["localhost", "127.0.0.1"].includes(url.hostname)) {
        return url.origin;
      }
    } catch { /* Fall through to the public storefront. */ }
  }
  return CANONICAL_STOREFRONT_ORIGIN;
}

function routeName(context: RouteContext): string {
  const path = context.params.path;
  return Array.isArray(path) ? path.join("/") : path ?? "";
}

export const onRequest = async (context: RouteContext) => {
  const route = routeName(context);
  const method = context.request.method.toUpperCase();

  if (route === "status" && method === "GET") {
    const configured = Boolean(context.env.ERP_API_BASE_URL && context.env.ERP_API_TOKEN);
    if (!configured) {
      return json({ success: false, configured: false, connected: false }, 503);
    }

    const health = await proxyErp(
      context,
      context.env.ERP_HEALTH_PATH ?? "/api/health",
    );
    if (!health.ok) {
      return json({ success: false, configured: true, connected: false }, 503);
    }

    return json({
      success: true,
      configured: true,
      connected: true,
      capabilities: {
        catalogue: true,
        categories: true,
        shipping: true,
        payments: true,
        customOrders: true,
        customerMagicLink: true,
        customerGoogleSignIn: true,
      },
    });
  }

  if (route === "products" && method === "GET") {
    const url = new URL(context.request.url);
    const path = context.env.ERP_PRODUCTS_PATH ?? "/api/products/featured";
    return proxyErp(context, `${path}${url.search}`);
  }

  if (route === "gift-hampers" && method === "GET") {
    const url = new URL(context.request.url);
    const path = context.env.ERP_GIFT_HAMPERS_PATH ?? "/api/storefront/gift-hampers";
    return proxyErp(context, `${path}${url.search}`);
  }

  if (route === "categories" && method === "GET") {
    const response = await proxyErp(
      context,
      context.env.ERP_CATEGORIES_PATH ?? "/api/categories",
    );
    if (!response.ok) return response;

    const payload = await response.json() as {
      success?: boolean;
      data?: Array<Record<string, unknown>>;
    } | Array<Record<string, unknown>>;
    const categories = Array.isArray(payload) ? payload : payload.data ?? [];

    return json({
      success: true,
      data: categories.map((category) => ({
        ...category,
        // The ERP currently includes large base64 category images. Product
        // media belongs on media.artzysstudio.in, so do not transfer inline
        // image blobs on every category request.
        image_url:
          typeof category.image_url === "string" &&
          !category.image_url.startsWith("data:")
            ? category.image_url
            : null,
        banner_url:
          typeof category.banner_url === "string" &&
          !category.banner_url.startsWith("data:")
            ? category.banner_url
            : null,
      })),
    });
  }

  if (route === "auth/magic-link" && method === "POST") {
    if (!(context.request.headers.get("content-type") ?? "").includes("application/json")) {
      return json({ success: false, error: "JSON body required." }, 415);
    }
    const body = await context.request.text();
    if (body.length > 4_000) return json({ success: false, error: "Sign-in request is too large." }, 413);
    let payload: { email?: string };
    try {
      payload = JSON.parse(body);
    } catch {
      return json({ success: false, error: "Invalid sign-in request." }, 400);
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email ?? "")) {
      return json({ success: false, error: "Enter a valid email address." }, 400);
    }
    return proxyErp(
      context,
      context.env.ERP_CUSTOMER_MAGIC_LINK_PATH ?? "/api/storefront/auth/magic-link",
      { method: "POST", headers: { "content-type": "application/json" }, body },
    );
  }

  if (route === "auth/google" && method === "GET") {
    if (!context.env.ERP_API_BASE_URL) return json({ success: false, error: "Customer sign-in is temporarily unavailable." }, 503);
    const target = new URL(
      context.env.ERP_CUSTOMER_GOOGLE_AUTH_URL ??
        "/api/storefront/auth/google",
      context.env.ERP_API_BASE_URL,
    );
    target.searchParams.set("return_to", `${customerReturnOrigin(context)}/account/`);
    return Response.redirect(target, 302);
  }

  if (route === "auth/me" && method === "GET") {
    return proxyErp(context, "/api/storefront/auth/me");
  }

  if (route === "shipping/quote" && method === "POST") {
    if (!(context.request.headers.get("content-type") ?? "").includes("application/json")) {
      return json({ success: false, error: "JSON body required." }, 415);
    }
    const body = await context.request.text();
    if (body.length > 16_000) return json({ success: false, error: "Shipping request is too large." }, 413);
    let payload: { items?: unknown[]; pincode?: string };
    try {
      payload = JSON.parse(body);
    } catch {
      return json({ success: false, error: "Invalid shipping request." }, 400);
    }
    if (!Array.isArray(payload.items) || !/^\d{6}$/.test(payload.pincode ?? "")) {
      return json({ success: false, error: "A valid cart and 6-digit PIN code are required." }, 400);
    }

    const confirmationRequired = () => json({
      success: true,
      pincode: payload.pincode,
      subtotal: 0,
      defaultService: "economical",
      options: [],
      requiresStudioConfirmation: true,
      message: "Courier availability, delivery time and shipping cost must be confirmed by Artzy's Studio for this PIN code.",
    });

    if (!context.env.ERP_API_BASE_URL || !context.env.ERP_API_TOKEN) return confirmationRequired();
    const upstream = await proxyErp(
      context,
      context.env.ERP_SHIPPING_PATH ?? "/api/commerce/shipping/calculate",
      { method: "POST", headers: { "content-type": "application/json" }, body },
    );
    return upstream.ok ? upstream : confirmationRequired();
  }

  if ((route === "payment/initiate" || route === "payment/verify") && method === "POST") {
    if (!(context.request.headers.get("content-type") ?? "").includes("application/json")) {
      return json({ success: false, error: "JSON body required." }, 415);
    }
    const body = await context.request.text();
    if (body.length > 96_000) return json({ success: false, error: "Payment request is too large." }, 413);
    try {
      JSON.parse(body);
    } catch {
      return json({ success: false, error: "Invalid payment request." }, 400);
    }
    const path = route === "payment/initiate"
      ? context.env.ERP_PAYMENT_INITIATE_PATH ?? "/api/commerce/payment/initiate"
      : context.env.ERP_PAYMENT_VERIFY_PATH ?? "/api/commerce/payment/verify";
    return proxyErp(context, path, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
    });
  }

  if (route === "orders" && method === "POST") {
    if (
      !(context.request.headers.get("content-type") ?? "").includes(
        "application/json",
      )
    ) {
      return json({ success: false, error: "JSON body required." }, 415);
    }
    const body = await context.request.text();
    if (body.length > 64_000) {
      return json({ success: false, error: "Order request is too large." }, 413);
    }
    return proxyErp(
      context,
      context.env.ERP_ORDER_PATH ?? "/api/storefront/orders",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
      },
    );
  }

  if (route === "custom-orders" && method === "POST") {
    if (!(context.request.headers.get("content-type") ?? "").includes("application/json")) {
      return json({ success: false, error: "JSON body required." }, 415);
    }
    const body = await context.request.text();
    if (body.length > 96_000) return json({ success: false, error: "Custom-order request is too large." }, 413);
    let payload: {
      type?: string;
      status?: string;
      spellingConfirmed?: boolean;
      pincode?: string;
      configuration?: Record<string, unknown> & { exactWording?: { main?: string } };
      consent?: { processing?: boolean; aiGeneration?: boolean; studioHandoff?: boolean };
      artzyAiAssetId?: string | null;
    };
    try { payload = JSON.parse(body); } catch { return json({ success: false, error: "Invalid custom-order request." }, 400); }
    if (payload.status !== "awaiting_studio_review") return json({ success: false, error: "A valid studio-review status is required." }, 400);
    const configuration = payload.configuration ?? {};
    if (payload.type === "custom_name_plate") {
      if (payload.spellingConfirmed !== true || !payload.configuration?.exactWording?.main?.trim() || !/^\d{6}$/.test(payload.pincode ?? "")) return json({ success: false, error: "Exact wording, spelling confirmation and a valid delivery PIN code are required." }, 400);
    } else if (payload.type === "custom_digital_art") {
      if (!configuration.purpose || !configuration.artDirection || !configuration.dimensions || !configuration.finish) return json({ success: false, error: "Purpose, art direction, dimensions and finish are required." }, 400);
    } else if (payload.type === "custom_caricature") {
      if (!configuration.subjects || !configuration.caricatureType || !configuration.style || !configuration.occasion || !configuration.finish || payload.consent?.studioHandoff !== true) return json({ success: false, error: "Subjects, type, style, occasion, finish and studio-handoff permission are required." }, 400);
      if (payload.artzyAiAssetId && (payload.consent?.processing !== true || payload.consent?.aiGeneration !== true)) return json({ success: false, error: "AI processing consent is required for an attached ArtzyAI concept." }, 400);
    } else {
      return json({ success: false, error: "Unsupported custom-order type." }, 400);
    }
    return proxyErp(context, context.env.ERP_CUSTOM_ORDER_PATH ?? "/api/storefront/custom-orders", {
      method: "POST", headers: { "content-type": "application/json" }, body,
    });
  }

  return json({ success: false, error: "Storefront endpoint not found." }, 404);
};
