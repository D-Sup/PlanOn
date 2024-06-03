const Loader = ({ isSmallUse, color = "white" }: { isSmallUse?: boolean, color?: string }) => {
  return (
    <>
      {isSmallUse ? (
        <div className="flex-center gap-[calc(100%/3)] -translate-y-[3px]">
          <div className={`w-[10%] aspect-square rounded-full bg-${color} animate-bounce-sm-1`}></div>
          <div className={`w-[10%] aspect-square rounded-full bg-${color} animate-bounce-sm-2`}></div>
          <div className={`w-[10%] aspect-square rounded-full bg-${color} animate-bounce-sm-3`}></div>
        </div>
      ) : (
        <div className="flex-center gap-[calc(100%/3)] -translate-y-[15px]">
          <div className={`w-[10%] aspect-square rounded-full bg-${color} animate-bounce-1`}></div>
          <div className={`w-[10%] aspect-square rounded-full bg-${color} animate-bounce-2`}></div>
          <div className={`w-[10%] aspect-square rounded-full bg-${color} animate-bounce-3`}></div>
        </div>
      )}
    </>
  )
}
export default Loader
