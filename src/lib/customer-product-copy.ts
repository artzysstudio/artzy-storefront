/** Remove editorial instructions accidentally included in supplier descriptions. */
export function customerProductCopy(value: string | undefined): string | undefined {
  return value?.replace(/Please review the product image and confirm the material, dimensions and care instructions before publishing\.?/gi, '').trim() || undefined;
}
