import { Skeleton } from "@/components/ui/skeleton"

export default function MarksImportLoading() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b px-4 py-5 lg:px-6">
        <Skeleton className="h-7 w-56" />
        <Skeleton className="mt-2 h-4 w-20 max-w-full" />
      </div>

      <div className="@container/main flex flex-1 flex-col gap-4 p-4 lg:p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 text-center">
          <Skeleton className="size-12 rounded-full" />
          <Skeleton className="mt-4 h-6 w-36" />
          <Skeleton className="mt-2 h-4 w-96 max-w-full" />
          <Skeleton className="mt-6 h-10 w-28 rounded-md" />
        </div>
      </div>
    </div>
  )
}
