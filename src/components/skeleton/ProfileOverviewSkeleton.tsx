import { Skeleton } from "../shadcnUIKit/skeleton"

const ProfileOverviewSkeleton = () => {
  return (
    <div className="w-full flex-col flex-center">
      <Skeleton className="w-[100px] h-[100px] rounded-full" />
      <div className="flex-center mt-[10px] mb-[5px] h-[30px]">
        <Skeleton className="w-[100px] h-[20px]" />
      </div>
      <Skeleton className="w-[150px] h-[15px]" />
      <div className="my-[20px] w-full px-[30px]">
        <Skeleton className="w-full h-[37px]" />
      </div>
      <div className="flex justify-evenly w-full ">
        <Skeleton className="w-[32px] h-[32px]" />
        <Skeleton className="w-[32px] h-[32px]" />
        <Skeleton className="w-[32px] h-[32px]" />
      </div>
    </div>
  )
}

export default ProfileOverviewSkeleton