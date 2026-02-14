"use client"

import { SiteHeader } from "@/components/layout/site-header"
import { ProductGrid } from "@/components/product/product-grid"
import { ComparisonDrawer } from "@/components/comparison/comparison-drawer"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="mb-8 flex flex-col gap-2">
          <h1 className="text-balance font-serif text-3xl font-bold tracking-tight text-foreground lg:text-4xl">
            Discover & Compare Products
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            Browse our curated collection, filter by your preferences, and compare up to 5 products side by side.
          </p>
        </div>
        <ProductGrid />
      </main>
      <ComparisonDrawer />
    </div>
  )
}
