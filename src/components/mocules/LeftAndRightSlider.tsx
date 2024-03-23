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
  const [startY, setStartY] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(true);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isOpenMore, setIsOpenMore] = useState<boolean>(false);
  const [lockScroll, setLockScroll] = useState<boolean>(false);

  const sliderRef = useRef<HTMLLIElement | null>(null);

  const handleScrollLock = () => {
    isSwiping && lock();
    setIsSwiping(false)
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (isSlideEnabled) {
      if ("touches" in e) {
        setStartX(e.touches[0].clientX);
        setStartY(e.touches[0].clientY);
      } else {
        setStartX(e.clientX);
        setStartY(e.clientY);
      }
      setIsMoving(true)
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null || startY === null) return;
    let currentX: number
    let currentY: number
    if ("touches" in e) {
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
    } else {
      currentX = e.clientX;
      currentY = e.clientY;
    }
    const subtractX = Math.abs(startX - currentX);
    const subtractY = Math.abs(startY - currentY);
    const sliderRefCurrent = sliderRef.current;


    if (subtractX < 100 && subtractY > 100) {
      setLockScroll(true)
      sliderRefCurrent.style.transform = `translateX(0%)`;
      return
    }

    if (sliderRefCurrent) {
      const transformPercentage = (subtractX / sliderRefCurrent.clientWidth) * 100;

      if (subtractX > 0) {
        handleScrollLock();
      }

      if (startX < currentX && subtractX > 20) {
        sliderRefCurrent.style.transform = `translateX(${isOpenMore ? `calc(${transformPercentage}% - ${moreAreaWidth}px)` : `${transformPercentage}%`})`;
      } else if (startX > currentX && subtractX > 20) {
        sliderRefCurrent.style.transform = `translateX(-${transformPercentage}%)`;
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (startX === null || startY === null) return;
    let endX: number
    if ("changedTouches" in e) {
      endX = e.changedTouches[0].clientX;
    } else {
      endX = e.clientX;
    }
    const subtract = Math.abs(startX - endX);

    if (subtract < 100 && lockScroll) {
      setLockScroll(false)
      setStartX(null);
      setStartY(null)
      setIsSwiping(true);
      unlock()
      return
    }
    const sliderRefCurrent = sliderRef.current;

    if (sliderRefCurrent && startX < endX && subtract > 20) {
      setIsMoving(false)
      setIsOpenMore(false)
      sliderRefCurrent.style.transform = `translateX(0%)`;

    } else if (sliderRefCurrent && startX > endX && subtract > 20) {
      setIsMoving(false)
      setIsOpenMore(true)
      sliderRefCurrent.style.transform = `translateX(-${moreAreaWidth}px)`;
    }
    setStartX(null);
    setStartY(null)
    setIsSwiping(true);
    unlock()
  };


  return (
    <li
      className={`relative ${isMoving ? "" : "transition duration-300"} ${className}`}
      style={{ width: `calc(100% + ${moreAreaWidth}px)` }}
      onTouchStart={(e) => handleTouchStart(e)}
      onTouchMove={(e) => handleTouchMove(e)}
      onTouchEnd={(e) => handleTouchEnd(e)}
      onMouseDown={(e) => handleTouchStart(e)}
      onMouseMove={(e) => handleTouchMove(e)}
      onMouseUp={(e) => handleTouchEnd(e)}
      ref={sliderRef}
    >
      {children}
    </li>
  )
}

export default LeftAndRightSlider;