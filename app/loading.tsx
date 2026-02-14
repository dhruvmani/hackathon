import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 lg:px-8">
        <Skeleton className="mb-2 h-10 w-80" />
        <Skeleton className="mb-8 h-5 w-96" />
        <div className="flex flex-col gap-6 lg:flex-row">
          <Skeleton className="h-[500px] w-full shrink-0 rounded-xl lg:w-72" />
          <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-10 w-64 rounded-xl" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex flex-col overflow-hidden rounded-xl border shadow-lg">
                  <Skeleton className="aspect-square w-full" />
                  <div className="flex flex-col gap-3 p-5">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-3 w-24" />
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-10 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
