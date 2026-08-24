type Env = Record<string, never>;

interface PagesContext {
  request: Request;
  env: Env;
  next: () => Promise<Response>;
}

const PUBLIC_HOSTS = new Set(['artzysstudio.in', 'www.artzysstudio.in']);

const launchPage = `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Artzy's Studio | Ecommerce launching soon</title>
<style>*{box-sizing:border-box}body{margin:0;min-height:100svh;display:grid;place-items:center;padding:20px;background:#f7efe5;color:#43352e;font-family:Arial,sans-serif}.card{width:min(680px,100%);padding:clamp(32px,7vw,68px);text-align:center;background:#fffaf4;border:1px solid #ddccc0;box-shadow:0 30px 80px #4931271c}.mark{width:76px;height:76px;display:grid;place-items:center;margin:auto;border:2px solid #b55257;border-radius:24px;color:#b55257;font:42px Georgia,serif}.status{margin:22px 0 12px;color:#a4474d;font-size:12px;font-weight:700;letter-spacing:.16em;text-transform:uppercase}h1{margin:0;font:400 clamp(48px,9vw,82px)/.96 Georgia,serif;letter-spacing:-.04em}h1 em{color:#b55257;font-weight:400}p{max-width:550px;margin:24px auto;color:#735e52;line-height:1.7}.actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px}.actions a{padding:14px 19px;border:1px solid #b55257;border-radius:999px;color:#943f44;font-size:13px;font-weight:700;text-decoration:none}.actions a:first-child{background:#b55257;color:white}.note{font-size:12px;color:#9a8579}</style></head>
<body><main class="card"><div class="mark" aria-hidden="true">✿</div><div class="status">Ecommerce launching soon</div><h1>Something artful<br><em>is almost here.</em></h1><p>We are preparing Artzy's Studio online—bringing original paintings, hand-painted products, digital art, personalised gifts and corporate gifting together in one thoughtful place.</p><div class="actions"><a href="https://wa.me/919158680722">WhatsApp the studio</a><a href="mailto:artzysstudio@gmail.com">artzysstudio@gmail.com</a></div><p class="note">Made by hand · Chosen by heart · Pune</p></main></body></html>`;

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const request = context.request;
  const url = new URL(request.url);
  const acceptsHtml = request.headers.get('accept')?.includes('text/html');

  if (!PUBLIC_HOSTS.has(url.hostname.toLowerCase()) || !acceptsHtml) {
    return context.next();
  }

  return new Response(launchPage, {
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  });
};
