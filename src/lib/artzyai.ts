export type CreativeTool = 'caricature' | 'name_plate' | 'digital_art' | 'gift' | 'room_art' | 'custom_art';
export type CreativeState = 'introduction' | 'consent' | 'input' | 'reference_upload' | 'generating' | 'completed' | 'failed' | 'moderation_blocked' | 'credits_unavailable' | 'erp_unavailable' | 'studio_handoff';

export type CreativeJobRequest = {
  sourceApp: 'artzy-storefront';
  tool: CreativeTool;
  mode: 'preview' | 'edit' | 'premium';
  purpose: string;
  style: string;
  palette: string[];
  outputFormat: 'png' | 'jpeg' | 'webp';
  aspectRatio: '1:1' | '4:5' | '3:2' | '16:9';
  referenceAssetIds: string[];
  customerTextOverlay: string;
  storefrontContext: Record<string, string | number | boolean | null>;
  erpContext: Record<string, string | number | boolean | null>;
  consentId?: string;
};

export type CreativeJobResponse = {
  jobId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed' | 'moderation_blocked';
  modelTier: 'fast' | 'premium' | 'graphic';
  assetId?: string | null;
  previewUrl?: string | null;
  expiresAt: string;
  isAiConcept: true;
  customerMessage: string;
  failureCategory?: string | null;
  usage: { creditsUsed: number };
};

export function artzyGuestId(): string {
  const key = 'artzyai-storefront-guest';
  let value = sessionStorage.getItem(key);
  if (!value) { value = crypto.randomUUID(); sessionStorage.setItem(key, value); }
  return value;
}

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('X-Artzy-Guest-ID', artzyGuestId());
  const response = await fetch(`/api/artzyai/${path}`, { ...init, headers });
  const result = await response.json().catch(() => ({ error: 'ArtzyAI returned an incomplete response.' })) as T & { error?: string; category?: string };
  if (!response.ok) {
    const error = new Error(result.error || 'ArtzyAI is temporarily unavailable.') as Error & { category?: string };
    error.category = result.category;
    throw error;
  }
  return result;
}

export async function createConsent(input: Record<string, boolean | string>): Promise<{ consentId: string; expiresAt: string }> {
  return api('consents', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input) });
}

export async function uploadReference(file: File, consentId: string): Promise<{ assetId: string; expiresAt: string }> {
  const form = new FormData();
  form.append('image', file);
  form.append('consentId', consentId);
  return api('assets', { method: 'POST', body: form });
}

export async function createCreativeJob(input: CreativeJobRequest): Promise<CreativeJobResponse> {
  return api('jobs', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': crypto.randomUUID() }, body: JSON.stringify(input) });
}

export async function waitForCreativeJob(jobId: string, onProgress?: (message: string) => void): Promise<CreativeJobResponse> {
  const messages = ['Understanding your direction', 'Preparing the composition', 'Applying your Artzy palette', 'Creating your preview'];
  const started = Date.now();
  let index = 0;
  while (Date.now() - started < 120_000) {
    onProgress?.(messages[Math.min(index, messages.length - 1)]);
    const result = await api<CreativeJobResponse>(`jobs/${jobId}`);
    if (['completed', 'failed', 'moderation_blocked'].includes(result.status)) return result;
    index += 1;
    await new Promise(resolve => window.setTimeout(resolve, 2500));
  }
  throw new Error('The preview is taking longer than expected. Please retry shortly; no credit is charged without an asset.');
}

export async function deleteCreativeAsset(assetId: string): Promise<void> {
  await api(`assets/${assetId}`, { method: 'DELETE' });
}
