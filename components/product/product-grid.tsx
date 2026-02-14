"use client"

import { useMemo, useState, useCallback } from "react"
import { toast } from "sonner"
import { PackageOpen } from "lucide-react"
import { SearchInput } from "@/components/filters/search-input"
import { FilterPanel } from "@/components/filters/filter-panel"
import { ProductCard } from "./product-card"
import { ProductCardSkeleton } from "./product-card-skeleton"
import { useProducts } from "@/features/products/hooks/use-products"
import { useComparison } from "@/features/comparison/hooks/use-comparison"
import { filterProducts } from "@/features/products/utils"
import { DEFAULT_FILTER_STATE, COMPARISON_MAX } from "@/lib/constants"
import type { FilterState } from "@/features/products/types"

export function ProductGrid() {
  const { products, isLoading, isError } = useProducts()
  const { isSelected, toggle, count } = useComparison()
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTER_STATE,
  })

  const handleSearch = useCallback((search: string) => {
    setFilters((prev) => ({ ...prev, search }))
  }, [])

  const filteredProducts = useMemo(
    () => filterProducts(products, filters),
    [products, filters]
  )

  const handleToggleCompare = useCallback(
    (id: number) => {
      const wasSelected = isSelected(id)
      if (!wasSelected && count >= COMPARISON_MAX) {
        toast.error(`Maximum ${COMPARISON_MAX} products can be compared`)
        return
      }
      const result = toggle(id)
      if (result && "success" in result && result.success) {
        toast.success(
          wasSelected ? "Removed from comparison" : "Added to comparison"
        )
      }
    },
    [isSelected, toggle, count]
  )

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-12 text-center shadow-lg"
        role="alert"
      >
        <div className="rounded-full bg-destructive/10 p-4">
          <PackageOpen className="h-8 w-8 text-destructive" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">
          Failed to Load Products
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We could not fetch the product data. Please check your connection and try again.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 lg:flex-row">
      {/* Sidebar Filters */}
      <div className="w-full shrink-0 lg:w-72">
        <div className="sticky top-20">
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            products={products}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:max-w-md">
            <SearchInput onSearch={handleSearch} products={products} />
          </div>
          <p className="shrink-0 text-sm text-muted-foreground">
            {isLoading
              ? "Loading..."
              : `${filteredProducts.length} product${filteredProducts.length !== 1 ? "s" : ""} found`}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-12 text-center shadow-lg">
            <div className="rounded-full bg-muted p-4">
              <PackageOpen className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
            </div>
            <h2 className="font-serif text-xl font-bold text-foreground">
              No Products Found
            </h2>
            <p className="max-w-md text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isSelected={isSelected(product.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
