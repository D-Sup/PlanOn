interface CategorySliderProps {
  progress: number,
  handleProgress: (index: number) => void
}

const CategorySlider = ({ progress, handleProgress }: CategorySliderProps) => {

  return (
    <>
      <div>
        <button onClick={() => {
          handleProgress(1)
        }} className="w-1/3 h-[30px] text-md text-white">계정</button>
        <button onClick={() => {
          handleProgress(2)
        }} className="w-1/3 h-[30px] text-md text-white">장소</button>
        <button onClick={() => {
          handleProgress(3)
        }} className="w-1/3 h-[30px] text-md text-white">태그</button>
      </div>
      <div className="w-1/3 h-[2px] bg-white transition duration-300" style={{ transform: `translateX(calc(100% * ${progress - 1}))` }}></div>
    </>
  )
}

export default CategorySlider