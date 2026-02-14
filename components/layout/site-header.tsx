"use client"

import Link from "next/link"
import { Scale } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useComparison } from "@/features/comparison/hooks/use-comparison"

export function SiteHeader() {
  const { count } = useComparison()

  return (
    <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="font-serif text-xl font-bold tracking-wide text-foreground">
            CompareHub
          </span>
        </Link>

        <nav aria-label="Main navigation">
          <Link
            href="/compare"
            className="relative flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
          >
            <Scale className="h-4 w-4" aria-hidden="true" />
            <span>Compare</span>
            {count > 0 && (
              <Badge
                variant="secondary"
                className="ml-1 min-w-[1.25rem] justify-center px-1 text-xs"
              >
                {count}
              </Badge>
            )}
          </Link>
        </nav>
      </div>
    </header>
  )
}
