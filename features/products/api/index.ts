"use server"

import { fetcher } from "@/lib/fetcher"
import type { Product } from "../types"

interface DummyJSONResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

export async function fetchAllProducts(): Promise<Product[]> {
  const data = await fetcher<DummyJSONResponse>("/products?limit=100")
  return data.products
}

export async function fetchProductById(id: number): Promise<Product> {
  return fetcher<Product>(`/products/${id}`)
}

export async function fetchProductsByIds(ids: number[]): Promise<Product[]> {
  const products = await Promise.all(ids.map((id) => fetchProductById(id)))
  return products
}
