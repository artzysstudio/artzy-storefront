const STOREFRONT_ORIGIN = "https://artzy-storefront.pages.dev";
const CANONICAL_ORIGIN = "https://www.artzysstudio.in";

function rewriteLocation(value: string): string {
  const location = new URL(value, STOREFRONT_ORIGIN);

  if (location.hostname === "artzy-storefront.pages.dev") {
    location.protocol = "https:";
    location.hostname = "www.artzysstudio.in";
    location.port = "";
  }

  return location.toString();
}

export default {
  async fetch(request: Request): Promise<Response> {
    const incoming = new URL(request.url);

    if (incoming.hostname === "artzysstudio.in") {
      const canonical = new URL(incoming.pathname + incoming.search, CANONICAL_ORIGIN);
      return Response.redirect(canonical.toString(), 308);
    }

    if (incoming.hostname !== "www.artzysstudio.in") {
      return new Response("Not found", { status: 404 });
    }

    const upstreamUrl = new URL(incoming.pathname + incoming.search, STOREFRONT_ORIGIN);
    const upstreamRequest = new Request(upstreamUrl, request);
    const upstreamResponse = await fetch(upstreamRequest);
    const headers = new Headers(upstreamResponse.headers);
    const location = headers.get("location");

    if (location) {
      headers.set("location", rewriteLocation(location));
    }

    headers.set("x-artzy-route", "storefront");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      statusText: upstreamResponse.statusText,
      headers,
    });
  },
};
