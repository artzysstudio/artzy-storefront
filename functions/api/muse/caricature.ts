type Env = { AI: { run(model: string, input: Record<string, unknown>): Promise<ReadableStream<Uint8Array>> } };
type Context = { request: Request; env: Env };
const clean = (value: unknown, maximum: number) => typeof value === "string" ? value.replace(/[<>\r\n]/g, " ").trim().slice(0, maximum) : "";

export const onRequest = async ({ request, env }: Context): Promise<Response> => {
  if (request.method !== "POST") return new Response(null, { status: 405, headers: { Allow: "POST" } });
  const origin = request.headers.get("origin");
  if (!origin || origin !== new URL(request.url).origin) return Response.json({ error: "Same-origin request required." }, { status: 403 });
  if (Number(request.headers.get("content-length") || 0) > 2_500_000) return Response.json({ error: "The prepared photo is too large. Try a smaller image." }, { status: 413 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const image = clean(body.image_b64, 2_400_000), style = clean(body.style, 60), occasion = clean(body.occasion, 60), details = clean(body.details, 240);
    if (!image || !style || !occasion || !/^[A-Za-z0-9+/=]+$/.test(image)) return Response.json({ error: "Add a valid photo and choose your direction." }, { status: 400 });
    const output = await env.AI.run("@cf/runwayml/stable-diffusion-v1-5-img2img", {
      image_b64: image,
      prompt: `Respectful personalised Indian caricature portrait based closely on the supplied photograph. Preserve the number of people, recognisable facial structure, skin tone, hairstyle, clothing colours and pose. Occasion: ${occasion}. Art direction: ${style}. Personal story cues: ${details || "warm personal gift"}. Refined hand-painted watercolour and ink finish, expressive and joyful but never grotesque, complete heads and shoulders, balanced warm cream background, accurate anatomy, no text, no logo, no watermark.`,
      negative_prompt: "grotesque, offensive, distorted face, changed ethnicity, extra people, duplicate person, missing face, cropped head, malformed hands, text, logo, watermark", width: 768, height: 768, num_steps: 20, strength: 0.58, guidance: 8,
    });
    return new Response(output, { headers: { "Content-Type": "image/png", "Cache-Control": "no-store, max-age=0", "X-Content-Type-Options": "nosniff", "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'" } });
  } catch (error) {
    console.error(JSON.stringify({ message: "Caricature preview failed", error: error instanceof Error ? error.message : String(error) }));
    return Response.json({ error: "The caricature concept could not be generated right now. Please try again." }, { status: 503, headers: { "Cache-Control": "no-store" } });
  }
};
