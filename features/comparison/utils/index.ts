import type { Product, ChartDataPoint, RadarDataPoint } from "@/features/products/types"

export function findCheapest(products: Product[]): number | null {
  if (products.length === 0) return null
  return products.reduce((cheapest, p) =>
    p.price < cheapest.price ? p : cheapest
  ).id
}

export function findHighestRated(products: Product[]): number | null {
  if (products.length === 0) return null
  return products.reduce((best, p) =>
    p.rating > best.rating ? p : best
  ).id
}

export function findHighestDiscount(products: Product[]): number | null {
  if (products.length === 0) return null
  return products.reduce((best, p) =>
    p.discountPercentage > best.discountPercentage ? p : best
  ).id
}

export function buildBarChartData(products: Product[]): ChartDataPoint[] {
  return products.map((p) => ({
    name: p.title.length > 20 ? p.title.slice(0, 20) + "..." : p.title,
    price: p.price,
    discount: p.discountPercentage,
    rating: p.rating,
  }))
}

export function buildRadarChartData(products: Product[]): RadarDataPoint[] {
  const maxPrice = Math.max(...products.map((p) => p.price))
  const maxDiscount = Math.max(...products.map((p) => p.discountPercentage))

  const metrics = ["Price", "Discount", "Rating"]

  return metrics.map((metric) => {
    const point: RadarDataPoint = { metric }
    products.forEach((p) => {
      const shortName = p.title.length > 15 ? p.title.slice(0, 15) + "..." : p.title
      switch (metric) {
        case "Price":
          point[shortName] = maxPrice > 0 ? Math.round((p.price / maxPrice) * 100) : 0
          break
        case "Discount":
          point[shortName] = maxDiscount > 0 ? Math.round((p.discountPercentage / maxDiscount) * 100) : 0
          break
        case "Rating":
          point[shortName] = Math.round((p.rating / 5) * 100)
          break
      }
    })
    return point
  })
}

export function encodeComparisonUrl(ids: number[]): string {
  return `?ids=${ids.join(",")}`
}

export function decodeComparisonUrl(searchParams: string): number[] {
  if (!searchParams) return []
  return searchParams
    .split(",")
    .map(Number)
    .filter((n) => !isNaN(n) && n > 0)
}
