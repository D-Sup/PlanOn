import ListUnitSkeleton from "./ListUnitSkeleton"

interface ListSkeleton {
  className?: string,
  repeat: number
}

const ListSkeleton = ({ className, repeat }: ListSkeleton) => {
  return (
    <div className={className} >
      {Array(repeat).fill(0).map((_, index) => (
        <ListUnitSkeleton key={index} className="py-[10px]" />
      ))}
    </div>
  )
}
export default ListSkeleton