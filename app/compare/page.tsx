"use client"

import { useEffect, useState, useCallback, Suspense, lazy } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import useSWR from "swr"
import {
  ArrowLeft,
  FileDown,
  Share2,
  Scale,
  Copy,
  Check,
} from "lucide-react"
import { toast } from "sonner"
import { SiteHeader } from "@/components/layout/site-header"
import { ComparisonTable } from "@/components/comparison/comparison-table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { useComparison } from "@/features/comparison/hooks/use-comparison"
import { decodeComparisonUrl } from "@/features/comparison/utils"
import {
  exportToPdf,
  generateShareableUrl,
} from "@/features/comparison/utils/export"
import { COMPARISON_MIN } from "@/lib/constants"
import type { Product } from "@/features/products/types"

const PriceBarChart = lazy(() =>
  import("@/components/charts/price-bar-chart").then((m) => ({
    default: m.PriceBarChart,
  }))
)

const ComparisonRadarChart = lazy(() =>
  import("@/components/charts/comparison-radar-chart").then((m) => ({
    default: m.ComparisonRadarChart,
  }))
)

async function fetchProductsByIds(ids: number[]): Promise<Product[]> {
  if (ids.length === 0) return []
  const responses = await Promise.all(
    ids.map(async (id) => {
      const r = await fetch(`https://dummyjson.com/products/${id}`)
      if (!r.ok) throw new Error(`Failed to fetch product ${id}`)
      const product: Product = await r.json()
      return product
    })
  )
  return responses
}

function CompareContent() {
  const searchParams = useSearchParams()
  const { ids: storedIds, remove, clear } = useComparison()
  const [copied, setCopied] = useState(false)

  const urlIds = searchParams.get("ids")
  const idsToUse =
    urlIds && urlIds.length > 0 ? decodeComparisonUrl(urlIds) : storedIds

  const { data: products, isLoading, error } = useSWR(
    idsToUse.length > 0 ? ["compare-products", ...idsToUse] : null,
    () => fetchProductsByIds(idsToUse),
    { revalidateOnFocus: false }
  )

  const handleRemove = useCallback(
    (id: number) => {
      remove(id)
      toast.success("Product removed from comparison")
    },
    [remove]
  )

  const handleExportPdf = useCallback(async () => {
    if (!products || products.length === 0) return
    try {
      await exportToPdf(products)
      toast.success("PDF exported successfully")
    } catch {
      toast.error("Failed to export PDF")
    }
  }, [products])

  const handleShare = useCallback(() => {
    const url = generateShareableUrl(idsToUse)
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("Shareable link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }, [idsToUse])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full rounded-xl" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Skeleton className="h-80 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-12 text-center shadow-lg"
        role="alert"
      >
        <div className="rounded-full bg-destructive/10 p-4">
          <Scale className="h-8 w-8 text-destructive" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">
          Failed to Load Comparison
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          We could not load the comparison data. Please try again.
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Back to Products
          </Button>
        </Link>
      </div>
    )
  }

  if (!products || products.length < COMPARISON_MIN) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl border bg-card p-12 text-center shadow-lg">
        <div className="rounded-full bg-muted p-4">
          <Scale className="h-8 w-8 text-muted-foreground" aria-hidden="true" />
        </div>
        <h2 className="font-serif text-xl font-bold text-foreground">
          Not Enough Products
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          You need at least {COMPARISON_MIN} products to compare. Go back and
          add more items to your comparison list.
        </p>
        <Link href="/">
          <Button variant="outline" className="rounded-xl">
            <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            Browse Products
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-balance font-serif text-2xl font-bold tracking-tight text-foreground lg:text-3xl">
              Product Comparison
            </h1>
            <Badge variant="secondary">{products.length} items</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Side-by-side analysis with highlighted best values
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={handleShare}
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {copied ? "Copied" : "Share"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="rounded-xl"
            onClick={handleExportPdf}
          >
            <FileDown className="mr-2 h-4 w-4" aria-hidden="true" />
            Export PDF
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => {
              clear()
              toast.success("Comparison cleared")
            }}
          >
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <ComparisonTable products={products} onRemove={handleRemove} />

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Suspense
          fallback={<Skeleton className="h-80 rounded-xl" />}
        >
          <PriceBarChart products={products} />
        </Suspense>
        <Suspense
          fallback={<Skeleton className="h-80 rounded-xl" />}
        >
          <ComparisonRadarChart products={products} />
        </Suspense>
      </div>
    </div>
  )
}

export default function ComparePage() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm" className="rounded-xl">
              <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
              Back to Products
            </Button>
          </Link>
        </div>
        {mounted ? (
          <Suspense
            fallback={
              <div className="flex flex-col gap-6">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
            }
          >
            <CompareContent />
          </Suspense>
        ) : (
          <div className="flex flex-col gap-6">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-96 w-full rounded-xl" />
          </div>
        )}
      </main>
    </div>
  )
}
