const RateIndicator = ({ rating, reviews, flexReverse = false }: { rating: number, reviews?: number, flexReverse?: boolean }) => {

  return (
    <div className={`flex gap-[10px] items-center ${flexReverse ? "flex-row-reverse justify-end" : ""}`}>
      <span className="text-sm text-gray-old leading-none">{rating ? rating.toFixed(1) : "0.0"}</span>
      <div className="relative w-max text-transparent text-stroke m-0">
        <div className="absolute z-10 flex top-0 left-0 overflow-hidden text-[#F5C652]" style={{ width: rating ? `${(rating / 5) * 100}%` : 0 }}>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
        <div className="z-0">
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
          <span>★</span>
        </div>
      </div>
      {reviews && <span className="text-sm text-gray-old leading-none">({reviews})</span>}
    </div>
  );
}

export default RateIndicator


