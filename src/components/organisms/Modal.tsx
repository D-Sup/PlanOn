import { useState, useRef } from "react";

interface ModalProps {
  isOpen: boolean,
  props?: { isHeightAuto: boolean }
  closeModal: () => void,
  isScrolledToTop: boolean,
  children: React.ReactNode
}

const Modal = ({ isOpen, props, closeModal, isScrolledToTop, children }: ModalProps) => {

  const [startY, setStartY] = useState<number | null>(null);
  const [isMoving, setIsMoving] = useState<boolean>(false);
  const [isOpenMore, setIsOpenMore] = useState<boolean>(false);
  const [startTouchTime, setStartTouchTime] = useState<number>(0);

  const backdropRef = useRef<HTMLDivElement | null>(null);
  const sliderRef = useRef<HTMLDivElement | null>(null);

  const isHeightAuto = props?.isHeightAuto;

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    if ("touches" in e) {
      setStartY(e.touches[0].clientY);
    } else {
      setStartY(e.clientY);
    }

    setIsMoving(true);
    setStartTouchTime(Date.now());
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (isHeightAuto || startY === null) return;

    let currentY: number
    if ("touches" in e) {
      currentY = e.touches[0].clientY;
    } else {
      currentY = e.clientY;
    }
    const subtract = Math.abs(startY - currentY);
    const sliderRefCurrent = sliderRef.current;

    if (sliderRefCurrent && backdropRef.current) {
      const transformPercentage = (subtract / sliderRefCurrent.clientWidth) * 100;
      if (startY < currentY && !isOpenMore) {
        sliderRefCurrent.style.transform = `translateY(${transformPercentage}%)`;
        backdropRef.current.style.opacity = "0";
      } else if (startY < currentY && isOpenMore) {
        sliderRefCurrent.style.height = `calc(100% - ${subtract}px)`;
      } else if (startY > currentY && isOpenMore) {
        sliderRefCurrent.style.height = "100%";
      }
      else if (startY > currentY) {
        sliderRefCurrent.style.height = `calc(75% + ${subtract}px)`;
      }
    }
  }

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (isHeightAuto || startY === null) return;
    let endY: number
    if ("changedTouches" in e) {
      endY = e.changedTouches[0].clientY;
    } else {
      endY = e.clientY;
    }

    const subtract = Math.abs(startY - endY);
    const sliderRefCurrent = sliderRef.current;
    const elapsedTime = Date.now() - startTouchTime;

    let transformPercentage: number = 0;
    if (sliderRefCurrent) {
      transformPercentage = (subtract / sliderRefCurrent.clientWidth) * 100;
    }

    if (sliderRefCurrent) {
      if (startY < endY && !isOpenMore && elapsedTime < 100) {
        setIsMoving(false);
        closeModal();
      } else if (startY < endY && !isOpenMore && transformPercentage > 75 / 2) {
        setIsMoving(false);
        closeModal();
      } else if (backdropRef.current && startY < endY) {
        setIsMoving(false);
        setIsOpenMore(false)
        sliderRefCurrent.style.transform = `translateY(0%)`;
        backdropRef.current.style.opacity = "1";
      } else if (backdropRef.current && startY > endY) {
        setIsMoving(false);
        setIsOpenMore(true)
        sliderRefCurrent.style.transform = `translateY(0%)`;
        backdropRef.current.style.opacity = "1";
      } else {
        sliderRefCurrent.style.transform = `translateY(0%)`;
      }
      setStartY(null);
    }
  }


  return (
    <div className="z-40 fixed left-0 top-0 h-full w-screen">
      <div
        className={`z-50 absolute bottom-0 w-full rounded-t-[10px] bg-background flex flex-col items-center transform ${isOpen ? "ease-out" : "ease-in"}`} style={{
          transform: `${isOpen ? "translateY(0%)" : "translateY(100%)"}`,
          transition: `${isMoving ? "" : ".4s"}`,
          height: `${isHeightAuto ? "auto" : isOpenMore ? "100%" : "75%"}`,
        }}
        ref={sliderRef}
      >
        <div className="pt-[35px] w-full h-full"
          onClick={() => setIsMoving(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleTouchStart}
          onMouseMove={handleTouchMove}
          onMouseUp={handleTouchEnd}
        >
          <div className="absolute top-[15px] left-1/2 -translate-x-1/2 w-[30px] h-[5px] bg-gray-old rounded-full m-auto"></div>
          <div
            className="w-full h-full flex flex-col overflow-y-scroll"
            onTouchStart={(e) => {
              e.stopPropagation()
              if (isScrolledToTop) {
                handleTouchStart(e)
              }
            }}
            onTouchMove={(e) => {
              e.stopPropagation()
              if (startY === null || isScrolledToTop === false) return;

              const currentY = e.touches[0].clientY;
              const subtract = Math.abs(startY - currentY);
              const sliderRefCurrent = sliderRef.current;

              if (sliderRefCurrent && backdropRef.current) {
                const transformPercentage = (subtract / sliderRefCurrent.clientWidth) * 100;
                if (startY < currentY && !isOpenMore && isScrolledToTop) {
                  sliderRefCurrent.style.transform = `translateY(${transformPercentage}%)`;
                  backdropRef.current.style.opacity = "0";
                } else if (startY < currentY && isOpenMore) {
                  sliderRefCurrent.style.height = `calc(100% - ${subtract}px)`;
                }
              }
            }}
            onTouchEnd={(e) => {
              e.stopPropagation()
              if (startY === null || isScrolledToTop === false) return;

              const endX = e.changedTouches[0].clientY;
              const subtract = Math.abs(startY - endX);
              const sliderRefCurrent = sliderRef.current;
              const elapsedTime = Date.now() - startTouchTime;

              let transformPercentage: number = 0;
              if (sliderRefCurrent) {
                transformPercentage = (subtract / sliderRefCurrent.clientWidth) * 100;
              }

              if (sliderRefCurrent) {
                if (startY < endX && !isOpenMore && subtract > 20 && elapsedTime < 100) {
                  setIsMoving(false);
                  closeModal();
                } else if (startY < endX && !isOpenMore && transformPercentage > 75 / 2) {
                  setIsMoving(false);
                  closeModal();
                } else if (backdropRef.current && startY < endX) {
                  setIsMoving(false);
                  setIsOpenMore(false)
                  sliderRefCurrent.style.transform = `translateY(0%)`;
                  backdropRef.current.style.opacity = "1";
                } else {
                  sliderRefCurrent.style.transform = `translateY(0%)`;
                }
                setStartY(null);
              }
            }}
          >
            {children}
          </div>
        </div>
      </div >
      <div
        className={`z-40 absolute top-0 left-0 h-dvh w-screen backdrop-blur-sm ${isOpen ? "ease-out" : "ease-in"}`}
        style={{
          background: "rgba(255,255,255, .1)",
          opacity: `${isOpen ? 1 : 0}`,
          transition: ".4s",
        }}
        ref={backdropRef}
        onClick={(e) => {
          e.stopPropagation()
          setIsMoving(false);
          closeModal()
        }}
      >
      </div >
    </div>
  );

}

export default Modal