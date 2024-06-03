import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import { lock, unlock } from "tua-body-scroll-lock"

import usePressingHandler from "@/hooks/usePressingHandler";
import ImageFrame from "../atoms/ImageFrame";

import IconPicture from "../../assets/images/icon-picture.svg?react";

const ImageSlider = ({ data, photos, ratio }: { data?: any, photos: string[], ratio: string }) => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(true);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [startTouchTime, setStartTouchTime] = useState<number>(0);
  const [isOnClick, setIsOnClick] = useState<boolean>(true);
  // const [isOpenMore, setIsOpenMore] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate()

  const { startPressing, stopPressing } = usePressingHandler(() => {
    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, data] }))
    navigate("/gallery", { state: { direction: "next", photos } }), 2000
  });

  const handleScrollLock = () => {
    isSwiping && lock();
    setIsSwiping(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    startPressing()
    setStartX(e.touches[0].clientX);
    setIsOnClick(true)
    setIsMoving(true);
    setStartTouchTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setIsOnClick(false)
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
        sliderRefCurrent.style.transform = `translateX(${currentIndex * -100 + transformPercentage}%)`;
      } else if (startX > currentX && subtract > 20) {
        sliderRefCurrent.style.transform = `translateX(${currentIndex * -100 - transformPercentage}%)`;
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    stopPressing()
    if (startX === null) return;
    const endX = e.changedTouches[0].clientX;
    const subtract = Math.abs(startX - endX);
    const sliderRefCurrent = sliderRef.current;
    const elapsedTime = Date.now() - startTouchTime;

    let transformPercentage: number = 0;
    if (sliderRefCurrent) {
      transformPercentage = (subtract / sliderRefCurrent.clientWidth) * 100;
    }

    if (
      (sliderRefCurrent && startX < endX && transformPercentage > 50) ||
      (sliderRefCurrent && startX < endX && elapsedTime < 1000)
    ) {
      setIsMoving(false)
      setCurrentIndex((Prev) => (Prev === 0 ? photos.length - 1 : Prev - 1));
    } else if (
      (sliderRefCurrent && startX > endX && transformPercentage > 50) ||
      (sliderRefCurrent && startX > endX && elapsedTime < 1000)
    ) {
      setIsMoving(false)
      setCurrentIndex((Prev) => (Prev + 1) % photos.length);
    } else {
      setIsMoving(false)
      if (sliderRef.current) {
        sliderRef.current.style.transform = `translateX(${currentIndex * -100}%)`;
      }
    }
    setStartX(null);
    setIsSwiping(true);
    unlock()
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${currentIndex * -100}%)`;
    }
  }, [currentIndex]);


  return (
    <div className="relative w-full" style={{ aspectRatio: ratio }}>
      <div
        className="photo-navigator h-full w-full flex flex-col items-center"
        onTouchStart={(e) => photos.length > 1 && handleTouchStart(e)}
        onTouchMove={(e) => photos.length > 1 && handleTouchMove(e)}
        onTouchEnd={(e) => photos.length > 1 && handleTouchEnd(e)}
      >
        <div className={`${isMoving ? "" : "transition-transform duration-300 ease-in-out relative"} flex h-full w-full`} ref={sliderRef}>
          {photos.includes("") ? (
            <div className="w-full flex-center bg-background-light">
              <IconPicture className="w-1/3 flex-center" fill={"var(--white)"} />
            </div>
          ) : (
            photos.map((photo, index) => (
              <ImageFrame
                key={index}
                src={photo}
                alt={`사진 ${index + 1}`}
                onClick={() => { }}
              // onClick={() => isOnClick && handleFunc()} 
              />
            ))
          )}
        </div>
        <span className="absolute right-[10px] bottom-[10px] px-[10px] py-[5px] flex-center rounded-full text-xsm text-white font-bold" style={{ backgroundColor: "rgba(0,0,0, 0.5)" }}>
          {currentIndex + 1} / {photos.length}
        </span>
      </div>
    </div>
  );

}

export default ImageSlider;