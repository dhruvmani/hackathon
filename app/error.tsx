"use client"

import { useEffect } from "react"
import { AlertTriangle, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-destructive/10 p-6">
          <AlertTriangle
            className="h-10 w-10 text-destructive"
            aria-hidden="true"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-serif text-2xl font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="max-w-md text-sm text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page or come
            back later.
          </p>
        </div>
        <Button onClick={reset} className="rounded-xl" size="lg">
          <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
          Try Again
        </Button>
      </div>
    </div>
  )
}
