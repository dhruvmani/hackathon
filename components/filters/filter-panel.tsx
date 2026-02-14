"use client"

import { useCallback, useMemo } from "react"
import { RotateCcw, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DEFAULT_FILTER_STATE, SORT_OPTIONS } from "@/lib/constants"
import {
  getUniqueCategories,
  getUniqueBrands,
  getPriceRange,
} from "@/features/products/utils"
import type { FilterState, Product } from "@/features/products/types"

interface FilterPanelProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  products: Product[]
}

export function FilterPanel({
  filters,
  onFiltersChange,
  products,
}: FilterPanelProps) {
  const categories = useMemo(() => getUniqueCategories(products), [products])
  const brands = useMemo(() => getUniqueBrands(products), [products])
  const priceRange = useMemo(() => getPriceRange(products), [products])

  const updateFilter = useCallback(
    <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
      onFiltersChange({ ...filters, [key]: value })
    },
    [filters, onFiltersChange]
  )

  const handleReset = useCallback(() => {
    onFiltersChange({
      ...DEFAULT_FILTER_STATE,
      maxPrice: priceRange.max,
    })
  }, [onFiltersChange, priceRange.max])

  return (
    <aside
      className="flex flex-col gap-6 rounded-xl border bg-card p-5 shadow-lg"
      aria-label="Product filters"
    >
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-lg font-bold text-foreground">Filters</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="mr-1 h-3 w-3" aria-hidden="true" />
          Reset
        </Button>
      </div>

      {/* Category */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="category-filter">
          Category
        </label>
        <Select
          value={filters.category || "all"}
          onValueChange={(v) => updateFilter("category", v === "all" ? "" : v)}
        >
          <SelectTrigger id="category-filter" className="rounded-xl">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Brand */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="brand-filter">
          Brand
        </label>
        <Select
          value={filters.brand || "all"}
          onValueChange={(v) => updateFilter("brand", v === "all" ? "" : v)}
        >
          <SelectTrigger id="brand-filter" className="rounded-xl">
            <SelectValue placeholder="All Brands" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {brands.map((brand) => (
              <SelectItem key={brand} value={brand}>
                {brand}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-foreground">
          Price Range
        </label>
        <div className="px-1">
          <Slider
            min={priceRange.min}
            max={priceRange.max}
            step={1}
            value={[filters.minPrice, filters.maxPrice || priceRange.max]}
            onValueChange={([min, max]) => {
              onFiltersChange({ ...filters, minPrice: min, maxPrice: max })
            }}
            aria-label="Price range"
          />
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>${filters.minPrice}</span>
          <span>${filters.maxPrice || priceRange.max}</span>
        </div>
      </div>

      {/* Rating */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground">
          Minimum Rating
        </label>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((rating) => (
            <button
              key={rating}
              onClick={() => updateFilter("minRating", rating)}
              className={`flex items-center gap-0.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-300 ${
                filters.minRating === rating
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
              aria-label={`Minimum ${rating} stars`}
              aria-pressed={filters.minRating === rating}
            >
              {rating === 0 ? (
                "All"
              ) : (
                <>
                  {rating}
                  <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Sort */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-foreground" htmlFor="sort-filter">
          Sort By
        </label>
        <Select
          value={filters.sortBy}
          onValueChange={(v) => updateFilter("sortBy", v as FilterState["sortBy"])}
        >
          <SelectTrigger id="sort-filter" className="rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </aside>
  )
}
