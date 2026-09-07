/** Return a trustworthy ERP modification date, or omit it when it is unsafe. */
export function validErpLastModified(value: string | undefined, now = new Date()): Date | undefined {
  if (!value) return undefined;
  const parsed = new Date(value);
  if (!Number.isFinite(parsed.getTime()) || parsed.getTime() > now.getTime()) return undefined;
  return parsed;
}
