import { NextRequest, NextResponse } from "next/server";
import type {
  Product,
  PaginatedResponse,
  ProductsQueryParams,
} from "@/features/products/types";
import {
  filterProducts,
  sortProducts,
  paginateProducts,
} from "@/features/products/utils/server-utils";

const DUMMY_JSON_URL = "https://dummyjson.com/products?limit=100";
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

interface DummyJSONResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

// Cache the products in memory (in production, use Redis or similar)
let cachedProducts: Product[] | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 60000; // 1 minute

async function fetchAllProducts(): Promise<Product[]> {
  const now = Date.now();

  // Return cached data if still valid
  if (cachedProducts && now - cacheTimestamp < CACHE_DURATION) {
    return cachedProducts;
  }

  // Fetch fresh data
  const response = await fetch(DUMMY_JSON_URL, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.statusText}`);
  }

  const data: DummyJSONResponse = await response.json();
  cachedProducts = data.products;
  cacheTimestamp = now;

  return data.products;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params: ProductsQueryParams = {
      page: parseInt(searchParams.get("page") || String(DEFAULT_PAGE)),
      limit: parseInt(searchParams.get("limit") || String(DEFAULT_LIMIT)),
      search: searchParams.get("search") || undefined,
      category: searchParams.get("category") || undefined,
      brand: searchParams.get("brand") || undefined,
      minPrice: searchParams.get("minPrice")
        ? parseFloat(searchParams.get("minPrice")!)
        : undefined,
      maxPrice: searchParams.get("maxPrice")
        ? parseFloat(searchParams.get("maxPrice")!)
        : undefined,
      minRating: searchParams.get("minRating")
        ? parseFloat(searchParams.get("minRating")!)
        : undefined,
      sortBy:
        (searchParams.get("sortBy") as ProductsQueryParams["sortBy"]) ||
        "title-asc",
    };

    // Fetch all products
    const allProducts = await fetchAllProducts();

    // Apply filters
    let filteredProducts = filterProducts(allProducts, params);

    // Apply sorting
    filteredProducts = sortProducts(filteredProducts, params.sortBy!);

    // Apply pagination
    const paginatedResult = paginateProducts(
      filteredProducts,
      params.page!,
      params.limit!,
    );

    const response: PaginatedResponse = {
      products: paginatedResult.data,
      pagination: paginatedResult.pagination,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
