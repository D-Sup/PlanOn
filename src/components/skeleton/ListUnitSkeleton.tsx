import { Skeleton } from "../shadcnUIKit/skeleton"

const ListUnitSkeleton = ({ className, isNotBoxShadow }: { className?: string, isNotBoxShadow?: boolean }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`} style={{ boxShadow: isNotBoxShadow ? "" : "0 1px var(--gray-heavy)" }}>
      <Skeleton className="min-w-[34px] min-h-[34px] rounded-full" />
      <div className="space-y-[6px] w-full">
        <Skeleton className="h-[12px] w-1/3" />
        <Skeleton className="h-[10px] w-2/4" />
      </div>
    </div>
  )
}

export default ListUnitSkeleton