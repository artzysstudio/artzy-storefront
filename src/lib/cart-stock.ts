export type StockLimit = number | null | undefined;

export function normaliseStockLimit(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const quantity = Number(value);
  if (!Number.isFinite(quantity)) return null;
  return Math.max(0, Math.floor(quantity));
}

export function clampCartQuantity(requested: number, stock: StockLimit): number {
  const quantity = Math.max(0, Math.floor(Number(requested) || 0));
  const limit = normaliseStockLimit(stock);
  return limit === null ? quantity : Math.min(quantity, limit);
}

export function remainingStock(stock: StockLimit, quantityInBag: number): number | null {
  const limit = normaliseStockLimit(stock);
  return limit === null ? null : Math.max(0, limit - Math.max(0, quantityInBag));
}
