import { Skeleton } from "@/components/ui/skeleton"

export default function ClassBatchesLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-5 lg:px-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-32 max-w-full" />
      </div>

      <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {/* ClassTabs skeleton */}
        <div className="flex gap-2 border-b pb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>

        {/* Offering selector */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-64 rounded-md" />
        </div>

        {/* Batch cards grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="bg-card space-y-3 rounded-lg border p-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="h-4 w-36" />
              <div className="space-y-1.5 pt-2">
                <Skeleton className="h-8 w-full rounded-md" />
                <Skeleton className="h-8 w-full rounded-md" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
