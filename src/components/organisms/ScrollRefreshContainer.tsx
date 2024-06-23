import { useState, useEffect, useRef } from "react"
import useScrollTop from "@/hooks/useScrollTop"

import Loader from "./Loader"

interface ScrollRefreshContainerProps {
  children: React.ReactNode,
  isLoading: boolean,
  refetch: () => void
}

const ScrollRefreshContainer = ({ children, isLoading, refetch }: ScrollRefreshContainerProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isRefresh, setIsRefresh] = useState<boolean>(false);
  const [startY, setStartY] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);

  const isTop = useScrollTop()

  const scrollTop = window.scrollY || document.documentElement.scrollTop;


  const refreshRef = useRef<HTMLDivElement | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if (scrollTop !== 0 && !isTop) return;
    if ("touches" in e) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(e.clientY);
    }
    setIsVisible(true)
    setIsMoving(true);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (scrollTop !== 0 && !isTop || startY === null) return;
    let currentY: number
    if ("touches" in e) {
      currentY = e.touches[0].clientY;
    } else {
      currentY = e.clientY;
    }
    const subtract = Math.abs(startY - currentY);
    const refreshRefCurrent = refreshRef.current;


    if (refreshRefCurrent) {
      const transformPercentage = (subtract / refreshRefCurrent.clientWidth) * 100;
      if (startY < currentY) {
        refreshRefCurrent.style.transform = `translate(-50%, ${transformPercentage <= 120 ? transformPercentage : 120}%)`;
      } else if (startY > currentY) {
        refreshRefCurrent.style.transform = `translate(-50%, ${-transformPercentage <= 0 ? 0 : transformPercentage}%)`;
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (scrollTop !== 0 && !isTop || startY === null) return;
    let endY: number
    if ("changedTouches" in e) {
      endY = e.changedTouches[0].clientY;
    } else {
      endY = e.clientY;
    }
    const subtract = Math.abs(startY - endY);

    const refreshRefCurrent = refreshRef.current;

    let transformPercentage: number = 0;
    if (refreshRefCurrent) {
      transformPercentage = (subtract / refreshRefCurrent.clientWidth) * 100;
    }
    if (refreshRefCurrent && startY < endY && transformPercentage > 50) {
      setIsMoving(false)
      setIsRefresh(true)
      setTimeout(() => {
        refreshRefCurrent.style.transform = "translate(-50%, 120%)";
        refetch()
      }, 0)
    } else {
      setIsMoving(false)
      setTimeout(() => {
        refreshRefCurrent.style.transform = "translate(-50%, 0%)";
      }, 0)
    }
    setStartY(null)
  };

  useEffect(() => {
    if (!isLoading) {
      refreshRef.current.style.transform = "translate(-50%, 0%)";
      setTimeout(() => {
        setIsVisible(false)
        setIsRefresh(false)
      }, 300)
    }
  }, [isLoading])

  return (
    <div
      className="w-full h-full"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseMove={handleTouchMove}
      onMouseUp={handleTouchEnd}
    >
      <div className={`${isMoving ? "" : "transition-transform duration-300 ease-in-out"} ${isVisible ? "opacity-100" : "opacity-0"} h-[50px] w-[100px] rounded-lg bg-white fixed left-1/2 top-[-50px] z-50`} ref={refreshRef}>
        <div className={`absolute-center w-[50px] transition duration-100 ${isRefresh ? "opacity-100" : "opacity-0"}`}>
          <Loader isSmallUse={true} color={"black"} />
        </div>
      </div>
      {children}
    </div >
  );
}

export default ScrollRefreshContainer