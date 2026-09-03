import {
  json,
  proxyErp,
  type PagesContext,
} from "../../_shared/erp";

interface RouteContext extends PagesContext {
  params: { path?: string | string[] };
}

function routeName(context: RouteContext): string {
  const path = context.params.path;
  return Array.isArray(path) ? path.join("/") : path ?? "";
}

export const onRequest = async (context: RouteContext) => {
  const route = routeName(context);
  const method = context.request.method.toUpperCase();

  if (route === "status" && method === "GET") {
    return json({
      success: true,
      configured: Boolean(
        context.env.ERP_API_BASE_URL && context.env.ERP_API_TOKEN,
      ),
    });
  }

  if (route === "products" && method === "GET") {
    const url = new URL(context.request.url);
    const path = context.env.ERP_PRODUCTS_PATH ?? "/api/storefront/products";
    return proxyErp(context, `${path}${url.search}`);
  }

  if (route === "categories" && method === "GET") {
    return proxyErp(
      context,
      context.env.ERP_CATEGORIES_PATH ?? "/api/storefront/categories",
    );
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
    if (!context.env.ERP_CUSTOMER_GOOGLE_AUTH_URL) {
      return json({ success: false, code: "GOOGLE_AUTH_NOT_CONFIGURED", error: "Google sign-in is not configured yet. Continue as a guest or use email." }, 503);
    }
    const target = new URL(context.env.ERP_CUSTOMER_GOOGLE_AUTH_URL);
    target.searchParams.set("return_to", `${new URL(context.request.url).origin}/account/`);
    return Response.redirect(target, 302);
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
    let payload: { type?: string; status?: string; spellingConfirmed?: boolean; pincode?: string; configuration?: { exactWording?: { main?: string } } };
    try { payload = JSON.parse(body); } catch { return json({ success: false, error: "Invalid custom-order request." }, 400); }
    if (payload.type !== "custom_name_plate" || payload.status !== "awaiting_studio_review" || payload.spellingConfirmed !== true || !payload.configuration?.exactWording?.main?.trim() || !/^\d{6}$/.test(payload.pincode ?? "")) {
      return json({ success: false, error: "Exact wording, spelling confirmation and a valid delivery PIN code are required." }, 400);
    }
    return proxyErp(context, context.env.ERP_CUSTOM_ORDER_PATH ?? "/api/storefront/custom-orders", {
      method: "POST", headers: { "content-type": "application/json" }, body,
    });
  }

  return json({ success: false, error: "Storefront endpoint not found." }, 404);
};
