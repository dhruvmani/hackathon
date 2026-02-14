import { NextResponse } from "next/server";
import type { ProductsMetadata, Product } from "@/features/products/types";
import {
  getUniqueCategories,
  getUniqueBrands,
  getPriceRange,
} from "@/features/products/utils/server-utils";

const DUMMY_JSON_URL = "https://dummyjson.com/products?limit=100";

interface DummyJSONResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Cache the metadata in memory
let cachedMetadata: ProductsMetadata | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute

async function fetchMetadata(): Promise<ProductsMetadata> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedMetadata && now - cacheTimestamp < CACHE_DURATION) {
    return cachedMetadata;
  }

  // Fetch fresh data
  const response = await fetch(DUMMY_JSON_URL, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: DummyJSONResponse = await response.json();
  const products = data.products;

  cachedMetadata = {
    categories: getUniqueCategories(products),
    brands: getUniqueBrands(products),
    priceRange: getPriceRange(products),
  };
  cacheTimestamp = now;

  return cachedMetadata;
}

export async function GET() {
  try {
    const metadata = await fetchMetadata();
    return NextResponse.json(metadata);
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch metadata" },
      { status: 500 },
    );
  }
}
