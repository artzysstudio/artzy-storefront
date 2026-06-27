'use server';

import { api } from '@/lib/api';

export async function getAllProducts() {
  return await api.products.list();
}
