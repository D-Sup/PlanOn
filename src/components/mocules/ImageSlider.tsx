import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";
import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import { lock, unlock } from "tua-body-scroll-lock"

import ImageFrame from "../atoms/ImageFrame";

import IconPicture from "../../assets/images/icon-picture.svg?react";

const ImageSlider = ({ data, photos, ratio }: { data?: any, photos: string[], ratio: string }) => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState<boolean>(true);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [startTouchTime, setStartTouchTime] = useState<number>(0);
  const [lockScroll, setLockScroll] = useState<boolean>(false);

  const sliderRef = useRef<HTMLDivElement | null>(null);

  const navigate = useNavigate()

  const { openModal } = useModalStack()

  const handleScrollLock = () => {
    isSwiping && lock();
    setIsSwiping(false)
  }

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (photos.length < 2) return;
    if ("touches" in e) {
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    } else {
      setStartX(e.clientX);
      setStartY(e.clientY);
    }
    setIsMoving(true);
    setStartTouchTime(Date.now());
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
      sliderRefCurrent.style.transform = `translateX(${currentIndex * -100}%)`;
      return
    }

    if (sliderRefCurrent) {
      const transformPercentage = (subtractX / sliderRefCurrent.clientWidth) * 100;

      if (subtractX > 0) {
        handleScrollLock();
      }

      if (startX < currentX && subtractX > 20) {
        sliderRefCurrent.style.transform = `translateX(${currentIndex * -100 + transformPercentage}%)`;
      } else if (startX > currentX && subtractX > 20) {
        sliderRefCurrent.style.transform = `translateX(${currentIndex * -100 - transformPercentage}%)`;
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
    setStartY(null)
    setIsSwiping(true);
    unlock()
  };

  useEffect(() => {
    if (sliderRef.current) {
      sliderRef.current.style.transform = `translateX(${currentIndex * -100}%)`;
    }
  }, [currentIndex]);


  return (
    <div className="relative w-full" style={{ aspectRatio: ratio }} >
      <div className="absolute inset-0">
      </div>
      <div
        className="photo-navigator h-full w-full flex flex-col items-center"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onDoubleClick={() => {
          setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, data] }))
          if (photos.length === 1) {
            openModal("PhotoView", { photo: photos })
          } else {
            navigate("/gallery", { state: { direction: "next", photos } })
          }
        }}
      >
        <div className={`${isMoving ? "" : "transition-transform duration-300 ease-in-out relative"} flex h-full w-full`} ref={sliderRef}>
          {photos.includes("") ? (
            <div className="w-full flex-center bg-background-light">
              <IconPicture className="w-1/3 flex-center" fill={"var(--white)"} />
            </div>
          ) : (
            photos.map((photo) => (
              <ImageFrame
                key={photo}
                src={photo}
                alt={`사진 ${photo}`}
              />
            ))
          )}
        </div>
        <span className="absolute right-[10px] bottom-[10px] px-[10px] py-[5px] flex-center rounded-full text-xsm text-[#FFF] font-bold" style={{ backgroundColor: "rgba(0,0,0, 0.5)" }}>
          {currentIndex + 1} / {photos.length}
        </span>
      </div>
    </div>
  );
}

export default ImageSlider;
// export default React.memo(ImageSlider);