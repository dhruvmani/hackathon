"use client"

import useSWR from "swr"
import type { Product } from "../types"

const PRODUCTS_URL = "https://dummyjson.com/products?limit=100"

interface DummyJSONResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

async function productsFetcher(url: string): Promise<Product[]> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`)
  }
  const data: DummyJSONResponse = await response.json()
  return data.products
}

export function useProducts() {
  const { data, error, isLoading, mutate } = useSWR<Product[]>(
    PRODUCTS_URL,
    productsFetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  )

  return {
    products: data ?? [],
    isLoading,
    isError: !!error,
    error,
    mutate,
  }
}
