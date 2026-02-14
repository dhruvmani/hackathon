export const API_BASE_URL = "https://dummyjson.com"

export const COMPARISON_MIN = 2
export const COMPARISON_MAX = 5

export const DEBOUNCE_DELAY = 400

export const DEFAULT_FILTER_STATE = {
  search: "",
  category: "",
  brand: "",
  minPrice: 0,
  maxPrice: 10000,
  minRating: 0,
  sortBy: "title-asc" as const,
}

export const SORT_OPTIONS = [
  { value: "title-asc", label: "Name (A-Z)" },
  { value: "price-asc", label: "Price (Low to High)" },
  { value: "price-desc", label: "Price (High to Low)" },
  { value: "rating-desc", label: "Rating (Highest)" },
  { value: "discount-desc", label: "Discount (Highest)" },
] as const

export const COMPARISON_STORAGE_KEY = "comparehub-comparison-ids"
