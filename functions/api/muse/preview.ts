type PreviewRequest = {
  kind: 'name-plate' | 'digital-art';
  style: string;
  palette: string;
  shape?: string;
  material?: string;
  purpose?: string;
};

type PreviewEnv = {
  AI: {
    run(model: '@cf/black-forest-labs/flux-1-schnell', input: { prompt: string; steps: number }): Promise<{ image: string }>;
  };
};

type FunctionContext = { request: Request; env: PreviewEnv };
type FunctionHandler = (context: FunctionContext) => Response | Promise<Response>;

const allowedKinds = new Set<PreviewRequest['kind']>(['name-plate', 'digital-art']);
const clean = (value: unknown, maximum = 80) => typeof value === 'string'
  ? value.replace(/[\r\n<>]/g, ' ').trim().slice(0, maximum)
  : '';

function parseRequest(value: unknown): PreviewRequest | null {
  if (!value || typeof value !== 'object') return null;
  const input = value as Record<string, unknown>;
  const kind = clean(input.kind, 24) as PreviewRequest['kind'];
  const style = clean(input.style);
  const palette = clean(input.palette);
  if (!allowedKinds.has(kind) || !style || !palette) return null;
  return {
    kind,
    style,
    palette,
    shape: clean(input.shape),
    material: clean(input.material),
    purpose: clean(input.purpose, 120),
  };
}

function promptFor(input: PreviewRequest): string {
  if (input.kind === 'name-plate') {
    return [
      'Premium editorial product concept photograph of one handcrafted Indian home name plate.',
      `Shape: ${input.shape || 'balanced rectangular plaque'}. Material impression: ${input.material || 'painted wood'}.`,
      `Art direction: ${input.style}. Colour palette: ${input.palette}.`,
      'The decorative artwork must stay around the outer border and corners.',
      'Keep a wide, calm, completely blank central panel for customer lettering to be added later.',
      'Front-facing view, entire plaque visible, warm natural light, refined Artzy Studio character, realistic material texture.',
      'No people, no hands, no brand logo, no watermark, no letters, no words, no numbers, no fake typography, no cropped edges.',
    ].join(' ');
  }
  return [
    'Premium custom-art concept mockup composed for an Indian home or thoughtful gift.',
    `Purpose: ${input.purpose || 'personal custom artwork'}. Art direction: ${input.style}. Palette: ${input.palette}.`,
    'Show one complete artwork with uncropped edges in a calm neutral presentation.',
    'Original studio-concept feeling, balanced composition, no shop listing, no price tag, no brand logo, no watermark, no letters or words.',
  ].join(' ');
}

const handlePost: FunctionHandler = async (context) => {
  const contentLength = Number(context.request.headers.get('content-length') || 0);
  const origin = context.request.headers.get('origin');
  const requestOrigin = new URL(context.request.url).origin;

  if (!origin || origin !== requestOrigin) {
    return Response.json({ error: 'Same-origin request required.' }, { status: 403 });
  }
  if (contentLength > 16_384) {
    return Response.json({ error: 'Preview brief is too large.' }, { status: 413 });
  }

  try {
    const input = parseRequest(await context.request.json());
    if (!input) return Response.json({ error: 'Choose a valid concept, style and palette.' }, { status: 400 });

    const result = await context.env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
      prompt: promptFor(input),
      steps: 6,
    });

    return Response.json({
      id: crypto.randomUUID(),
      image: `data:image/jpeg;base64,${result.image}`,
      label: 'AI-generated concept · not a production proof',
    }, {
      headers: {
        'Cache-Control': 'no-store, max-age=0',
        'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'",
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error(JSON.stringify({
      message: 'AI preview generation failed',
      error: error instanceof Error ? error.message : String(error),
      path: new URL(context.request.url).pathname,
    }));
    return Response.json({ error: 'The preview could not be generated right now. Please try again shortly.' }, { status: 503 });
  }
};

export const onRequest: FunctionHandler = async (context) => {
  if (context.request.method === 'POST') return handlePost(context);
  return new Response(null, { status: 405, headers: { Allow: 'POST' } });
};
