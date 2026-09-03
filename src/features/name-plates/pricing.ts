export type NamePlatePriceParts = {
  size: number;
  shape: number;
  painting: number;
  material: number;
  protection: number;
  mounting: number;
};

/** Deterministic storefront estimate. ERP remains authoritative at review. */
export function calculateNamePlateEstimate(parts: NamePlatePriceParts): number {
  const values = Object.values(parts);
  if (values.some((value) => !Number.isFinite(value) || value < 0)) throw new Error('Invalid name-plate price component.');
  return values.reduce((total, value) => total + value, 0);
}
