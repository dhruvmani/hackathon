import type { FilterState, Product } from "../types";

export function filterProducts(
  products: Product[],
  filters: Partial<FilterState>,
): Product[] {
  let result = [...products];

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower) ||
        p.brand?.toLowerCase().includes(searchLower),
    );
  }

  if (filters.category) {
    result = result.filter(
      (p) => p.category.toLowerCase() === filters.category!.toLowerCase(),
    );
  }

  if (filters.brand) {
    result = result.filter(
      (p) => p.brand?.toLowerCase() === filters.brand!.toLowerCase(),
    );
  }

  if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
    result = result.filter(
      (p) => p.price >= filters.minPrice! && p.price <= filters.maxPrice!,
    );
  }

  if (filters.minRating !== undefined && filters.minRating > 0) {
    result = result.filter((p) => p.rating >= filters.minRating!);
  }

  return result;
}

export function sortProducts(
  products: Product[],
  sortBy: FilterState["sortBy"],
): Product[] {
  const result = [...products];

  switch (sortBy) {
    case "price-asc":
      result.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      result.sort((a, b) => b.price - a.price);
      break;
    case "rating-desc":
      result.sort((a, b) => b.rating - a.rating);
      break;
    case "discount-desc":
      result.sort((a, b) => b.discountPercentage - a.discountPercentage);
      break;
    case "title-asc":
      result.sort((a, b) => a.title.localeCompare(b.title));
      break;
  }

  return result;
}

export function getUniqueCategories(products: Product[]): string[] {
  const categories = new Set(products.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getUniqueBrands(products: Product[]): string[] {
  const brands = new Set(products.filter((p) => p.brand).map((p) => p.brand));
  return Array.from(brands).sort();
}

export function getPriceRange(products: Product[]): {
  min: number;
  max: number;
} {
  if (products.length === 0) return { min: 0, max: 10000 };
  const prices = products.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}

export function paginateProducts<T>(
  items: T[],
  page: number,
  limit: number,
): {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
} {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = items.slice(offset, offset + limit);

  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasMore: page < totalPages,
    },
  };
}
