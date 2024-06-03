import { Skeleton } from "../shadcnUIKit/skeleton"

const ScheduleOverviewSkeleton = ({ isScheduleSelectable }: { isScheduleSelectable?: boolean }) => {
  return (
    <div>
      {isScheduleSelectable ? (
        <div className="flex gap-[5px] pb-[15px]">
          <Skeleton className="w-[120px] h-[40px]" />
          <Skeleton className="w-[90px] h-[40px]" />
        </div>
      ) : (
        <div className="flex items-center h-[54px]">
          <Skeleton className="h-[20px] w-[150px]" />
        </div>
      )}
      <div className="flex flex-col gap-[15px]">
        {Array(isScheduleSelectable ? 4 : 2).fill(0).map((_, index) => (
          <div className="flex gap-[15px]" key={index}>
            <div className="flex-center flex-col max-w-[35px] min-w-[35px]">
              <Skeleton className="h-[70px] w-[35px]" />
            </div>
            <Skeleton className="h-[70px] w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

export default ScheduleOverviewSkeleton