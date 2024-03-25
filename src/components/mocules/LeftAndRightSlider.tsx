import { useState, useRef } from "react";
import { lock, unlock } from "tua-body-scroll-lock"

interface LeftAndRightSliderProps {
  children: React.ReactNode,
  className: string,
  moreAreaWidth: number,
  isSlideEnabled?: boolean,
}

const LeftAndRightSlider = ({ children, className, moreAreaWidth, isSlideEnabled = true }: LeftAndRightSliderProps) => {

  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(true);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isOpenMore, setIsOpenMore] = useState<boolean>(false);
  // const [isOnClick, setIsOnClick] = useState<boolean>(true);

  const sliderRef = useRef<HTMLLIElement | null>(null);

  const handleScrollLock = () => {
    isSwiping && lock();
    setIsSwiping(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSlideEnabled) {
      setStartX(e.touches[0].clientX);
      // setIsOnClick(true)
      setIsMoving(true)
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    // setIsOnClick(false)
    if (startX === null) return;
    const currentX = e.touches[0].clientX;
    const subtract = Math.abs(startX - currentX);

    const sliderRefCurrent = sliderRef.current;
    if (sliderRefCurrent) {
      const transformPercentage = (subtract / sliderRefCurrent.clientWidth) * 100;

      if (subtract > 20) {
        handleScrollLock();
      }

      if (startX < currentX && subtract > 20) {
        sliderRefCurrent.style.transform = `translateX(${isOpenMore ? `calc(${transformPercentage}% - ${moreAreaWidth}px)` : `${transformPercentage}%`})`;
      } else if (startX > currentX && subtract > 20) {
        sliderRefCurrent.style.transform = `translateX(-${transformPercentage}%)`;
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const subtract = Math.abs(startX - endX);
    const sliderRefCurrent = sliderRef.current;

    if (sliderRefCurrent && startX < endX && subtract > 20) {
      setIsMoving(false)
      setIsOpenMore(false)
      sliderRefCurrent.style.transform = `translateX(0%)`;

    } else if (sliderRefCurrent && startX > endX && subtract > 20) {
      setIsMoving(false)
      setIsOpenMore(true)
      sliderRefCurrent.style.transform = `translateX(-${moreAreaWidth}px)`;
    } else {
      if (sliderRefCurrent) {
        setIsMoving(false)
        sliderRefCurrent.style.transform = `translateX(0%)`;
      }
    }
    setStartX(null);
    setIsSwiping(true);
    unlock()
  };


  return (
    <li
      className={`relative ${isMoving ? "" : "transition duration-300"} ${className}`}
      style={{ width: `calc(100vw + ${moreAreaWidth}px)` }}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchEnd={(e) => {
        // isOnClick && handleFunc && handleFunc()
        handleTouchEnd(e)
      }}
      ref={sliderRef}
    >
      {children}
    </li>
  )
}

export default LeftAndRightSlider;