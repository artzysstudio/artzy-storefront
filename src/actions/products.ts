// Removed use server to allow static export

import { api } from '@/lib/api';

export async function getAllProducts() {
  return await api.products.list();
}
