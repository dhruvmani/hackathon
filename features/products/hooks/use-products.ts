"use client";

import { useState, useEffect, useCallback } from "react";
import type { Product, PaginatedResponse, FilterState } from "../types";

const DEFAULT_LIMIT = 20;

interface UseProductsParams extends Partial<FilterState> {
  enabled?: boolean;
}

interface UseProductsReturn {
  products: Product[];
  isLoading: boolean;
  isLoadingMore: boolean;
  isError: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
  refetch: () => void;
  totalCount: number;
}

export function useProducts(params: UseProductsParams = {}): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const { enabled = true, ...filters } = params;

  const buildQueryString = useCallback(
    (currentPage: number) => {
      const queryParams = new URLSearchParams();
      queryParams.set("page", currentPage.toString());
      queryParams.set("limit", DEFAULT_LIMIT.toString());

      if (filters.search) queryParams.set("search", filters.search);
      if (filters.category) queryParams.set("category", filters.category);
      if (filters.brand) queryParams.set("brand", filters.brand);
      if (filters.minPrice !== undefined)
        queryParams.set("minPrice", filters.minPrice.toString());
      if (filters.maxPrice !== undefined)
        queryParams.set("maxPrice", filters.maxPrice.toString());
      if (filters.minRating !== undefined)
        queryParams.set("minRating", filters.minRating.toString());
      if (filters.sortBy) queryParams.set("sortBy", filters.sortBy);

      return queryParams.toString();
    },
    [filters],
  );

  const fetchProducts = useCallback(
    async (currentPage: number, append: boolean = false) => {
      if (!enabled) return;

      try {
        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
          setIsError(false);
          setError(null);
        }

        const queryString = buildQueryString(currentPage);
        const response = await fetch(`/api/products?${queryString}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data: PaginatedResponse = await response.json();

        if (append) {
          setProducts((prev) => [...prev, ...data.products]);
        } else {
          setProducts(data.products);
        }

        setHasMore(data.pagination.hasMore);
        setTotalCount(data.pagination.total);
        setPage(currentPage);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [enabled, buildQueryString],
  );

  // Reset and fetch when filters change
  useEffect(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, false);
  }, [
    filters.search,
    filters.category,
    filters.brand,
    filters.minPrice,
    filters.maxPrice,
    filters.minRating,
    filters.sortBy,
  ]);

  const loadMore = useCallback(() => {
    if (!isLoadingMore && hasMore) {
      fetchProducts(page + 1, true);
    }
  }, [page, hasMore, isLoadingMore, fetchProducts]);

  const refetch = useCallback(() => {
    setPage(1);
    setProducts([]);
    fetchProducts(1, false);
  }, [fetchProducts]);

  return {
    products,
    isLoading,
    isLoadingMore,
    isError,
    error,
    hasMore,
    loadMore,
    refetch,
    totalCount,
  };
}
