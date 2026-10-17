import { Skeleton } from "@/components/ui/skeleton"

export default function StudentDetailLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-5 lg:px-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="mt-2 h-4 w-32 max-w-full" />
      </div>

      <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div className="grid items-start gap-4 lg:grid-cols-3">
          {/* Left Column: Student identity & attendance */}
          <div className="flex min-w-0 flex-col gap-4">
            <section className="bg-card ring-foreground/10 flex flex-col gap-4 rounded-lg p-5 ring-1">
              <div className="flex items-center gap-4">
                <Skeleton className="size-14 shrink-0 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-14 w-full rounded-lg" />
            </section>

            <section className="bg-card space-y-3 rounded-lg border p-4">
              <Skeleton className="h-5 w-28" />
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <Skeleton key={i} className="h-9 w-full rounded-md" />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Stats & Marks */}
          <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
            <div className="grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-24 rounded-lg border" />
              ))}
            </div>

            <section className="space-y-4">
              <Skeleton className="h-5 w-24" />
              <div className="overflow-hidden rounded-lg border">
                <Skeleton className="h-10 w-full rounded-none" />
                <div className="space-y-2 p-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
