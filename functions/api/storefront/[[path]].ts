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

  return json({ success: false, error: "Storefront endpoint not found." }, 404);
};
