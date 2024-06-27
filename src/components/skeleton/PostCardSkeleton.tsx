import { Skeleton } from "../shadcnUIKit/skeleton"

const PostCardSkeleton = ({ repeat }: { repeat: number }) => {
  return (
    <div className="flex flex-col gap-[10px] bg-background-light">
      {Array(repeat).fill(0).map((_, index) => (
        <div className="pt-[10px] pb-[20px] bg-background" key={index}>
          <div className="flex w-full h-[40px] pl-[10px] pr-[20px] mb-[10px]">
            <div className={`flex items-center space-x-[10px] `}  >
              <Skeleton className="min-w-[40px] min-h-[40px] rounded-full" />
              <div className="space-y-[8px] w-full">
                <Skeleton className="h-[12px] w-[100px]" />
                <Skeleton className="h-[10px] w-[50px]" />
              </div>
            </div>
          </div>
          <Skeleton className="w-full rounded-none" style={{ aspectRatio: "16/16" }} />
          <div className={`pl-[10px] pr-[20px] mt-[10px] w-full flex`}>
            <div className="flex-center h-[24px]">
              <Skeleton className={`w-[150px] h-[15px]`}>
              </Skeleton>
            </div>
          </div>
          <div className="pl-[10px] pr-[20px] mt-[10px] flex items-center gap-[20px]">
            <Skeleton className="w-[38px] h-[20px]" />
            <Skeleton className="w-[38px] h-[20px]" />
            <Skeleton className="ml-auto w-[100px] h-[20px]" />
          </div>
        </div >
      ))
      }
    </div>


  )
}

export default PostCardSkeleton