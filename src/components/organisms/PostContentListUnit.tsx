import { useState, useEffect, useRef } from "react";

const PostContentListUnit = ({ data }: { data: string }): JSX.Element => {

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [showMoreButton, setShowMoreButton] = useState<boolean>(false);
  const contentAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const contentAreaRefCurrent = contentAreaRef.current;
    if (contentAreaRefCurrent) {
      contentAreaRefCurrent.clientHeight > 24 ?
        setShowMoreButton(true) :
        setShowMoreButton(false)
    }
  }, [])

  return (
    <>
      {data &&
        <div className={`pl-[10px] pr-[20px] mt-[10px] relative w-full flex text-base`} ref={contentAreaRef}>
          <span className={`${isExpanded ? "w-full" : showMoreButton ? "w-4/5 reduce-words" : "w-full"} text-md text-white`}>
            {data}
          </span>
          {showMoreButton && (
            <button className={`${isExpanded ? "hidden" : "block"} text-gray-600 absolute top-1.25 right-[20px]`} onClick={() => setIsExpanded((prev) => !prev)}>
              더보기
            </button>
          )}
        </div>
      }
    </>
  )
}

export default PostContentListUnit;