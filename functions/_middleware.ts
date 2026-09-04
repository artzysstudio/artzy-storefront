type Env = Record<string, never>;

interface PagesContext {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const url = new URL(context.request.url);

  if (
    url.pathname === "/artzy-world/preview-app" ||
    url.pathname.startsWith("/artzy-world/preview-app/")
  ) {
    const target = new URL("/artzy-world/preview/", url.origin);
    const source = url.searchParams.get("source");

    if (source && /^[a-z0-9_-]{1,64}$/i.test(source)) {
      target.searchParams.set("source", source);
    }

    return Response.redirect(target, 308);
  }

  return context.next();
};
