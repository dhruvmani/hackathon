import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductCardSkeleton() {
  return (
    <Card className="flex flex-col overflow-hidden rounded-xl shadow-lg">
      <Skeleton className="aspect-square w-full" />
      <CardContent className="flex flex-col gap-3 p-5">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-10 w-full rounded-xl" />
      </CardContent>
    </Card>
  )
}
