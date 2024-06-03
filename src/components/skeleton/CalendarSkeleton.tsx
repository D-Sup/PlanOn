import { Skeleton } from "../shadcnUIKit/skeleton"

const CalendarSkeleton = () => {
  return (
    <>
      <div className="fixed top-[30px] px-[30px] min-h-[450px] max-h-[450px] w-full">
        <div className="flex gap-[5px]">
          <Skeleton className="w-[120px] h-[40px]" />
          <Skeleton className="w-[90px] h-[40px]" />
        </div>

        <ul className="grid grid-cols-7 mt-[30px] leading-6 text-center text-gray">
          {Array(7).fill(0).map((_, index) =>
            <Skeleton className="m-auto w-[35px] h-[24px]" key={index} />
          )}
        </ul>
        <div className="grid grid-cols-7 mt-2 text-sm">
          {Array(35).fill(0).map((_, index) =>
            <div className="m-auto w-[45px] h-[58px]">
              <Skeleton className="mx-auto mt-[5px] w-[30px] h-[30px] rounded-full" key={index} />
            </div>
          )}
        </div>
      </div>
      <div className="w-screen min-h-[450px] max-h-[450px]"></div>
    </>
  )
}

export default CalendarSkeleton