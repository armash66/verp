import { Skeleton } from "@/components/ui/skeleton"

export default function ClassResultsLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-5 lg:px-6">
        <Skeleton className="h-7 w-52" />
        <Skeleton className="mt-2 h-4 w-32 max-w-full" />
      </div>

      <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
        {/* ClassTabs skeleton */}
        <div className="flex gap-2 border-b pb-2">
          {Array.from({ length: 5 }, (_, i) => (
            <Skeleton key={i} className="h-8 w-24 rounded-md" />
          ))}
        </div>

        {/* Search & Export bar */}
        <div className="flex items-center justify-between gap-2">
          <Skeleton className="h-9 w-64 rounded-md" />
          <Skeleton className="h-9 w-24 rounded-md" />
        </div>

        {/* Results table */}
        <div className="overflow-hidden rounded-lg border">
          <Skeleton className="h-12 w-full rounded-none" />
          <div className="divide-y">
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-44" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-14" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
