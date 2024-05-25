import { Skeleton } from "../shadcnUIKit/skeleton"

const PhotoAlbumSkeleton = () => {
  return (
    <div className="m-auto grid grid-cols-3 gap-1">
      {Array(15).fill(0).map((_, index) => (
        <Skeleton className="relative aspect-square rounded-none" key={index} />
      ))}
    </div>
  )
}

export default PhotoAlbumSkeleton