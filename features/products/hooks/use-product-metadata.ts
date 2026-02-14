"use client";

import { useState, useEffect } from "react";
import type { ProductsMetadata } from "../types";

interface UseProductMetadataReturn {
  metadata: ProductsMetadata | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

export function useProductMetadata(): UseProductMetadataReturn {
  const [metadata, setMetadata] = useState<ProductsMetadata | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setIsLoading(true);
        setIsError(false);
        setError(null);

        const response = await fetch("/api/products/metadata");

        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.statusText}`);
        }

        const data: ProductsMetadata = await response.json();
        setMetadata(data);
      } catch (err) {
        setIsError(true);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        console.error("Error fetching metadata:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetadata();
  }, []);

  return {
    metadata,
    isLoading,
    isError,
    error,
  };
}
