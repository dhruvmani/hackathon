"use client"

import { useState } from "react"
import Link from "next/link"
import { X, ChevronRight, Scale, Trash2 } from "lucide-react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useComparison } from "@/features/comparison/hooks/use-comparison"
import { COMPARISON_MIN } from "@/lib/constants"
import type { Product } from "@/features/products/types"

async function fetchProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return []
  const responses = await Promise.all(
    ids.map((id) =>
      fetch(`https://dummyjson.com/products/${id}`).then((r) => r.json())
    )
  )
  return responses
}

export function ComparisonDrawer() {
  const { ids, count, remove, clear } = useComparison()
  const [isOpen, setIsOpen] = useState(false)

  const { data: products, isLoading } = useSWR(
    ids.length > 0 ? ["comparison-products", ...ids] : null,
    () => fetchProductsByIds(ids),
    { revalidateOnFocus: false }
  )

  if (count === 0) return null

  return (
    <>
      {/* Floating Compare Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
        aria-label={`Open comparison drawer. ${count} items selected.`}
      >
        <Scale className="h-5 w-5" aria-hidden="true" />
        <span>Compare</span>
        <Badge variant="secondary" className="ml-1 min-w-[1.25rem] justify-center px-1.5">
          {count}
        </Badge>
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="font-serif text-lg">
              Comparison List
            </SheetTitle>
            <SheetDescription>
              {count < COMPARISON_MIN
                ? `Add at least ${COMPARISON_MIN - count} more product${COMPARISON_MIN - count !== 1 ? "s" : ""} to compare`
                : `${count} products selected for comparison`}
            </SheetDescription>
          </SheetHeader>

          <div className="flex flex-1 flex-col gap-3 overflow-y-auto py-4">
            {isLoading ? (
              Array.from({ length: count }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 rounded-xl border p-3">
                  <Skeleton className="h-14 w-14 shrink-0 rounded-lg" />
                  <div className="flex flex-1 flex-col gap-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))
            ) : (
              products?.map((product) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5 overflow-hidden">
                    <span className="truncate text-sm font-medium text-foreground">
                      {product.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ${product.price.toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="shrink-0 rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    aria-label={`Remove ${product.title} from comparison`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-2 border-t pt-4">
            {count >= COMPARISON_MIN && (
              <Link href={`/compare?ids=${ids.join(",")}`} onClick={() => setIsOpen(false)}>
                <Button className="w-full rounded-xl bg-primary text-primary-foreground">
                  Compare {count} Products
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </Link>
            )}
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={clear}
            >
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
              Clear All
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
