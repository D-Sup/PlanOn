import { useState, useEffect, useRef } from "react";

interface FixedTriggerProps {
  children: React.ReactNode,
  height: number,
  className?: string,
  hasReachedTop?: boolean,
  enableAnimation?: boolean,
  threshold?: number
}

const FixedTrigger = ({ children, className, height, hasReachedTop = true, enableAnimation = true, threshold = 0 }: FixedTriggerProps) => {

  const [hide, setHide] = useState<boolean>(true);

  const lastScrollTop = useRef<number>(0);
  const scrollUpStart = useRef<number>(0);

  useEffect(() => {
    const scrollTopBy = () => {
      if (window.scrollY > threshold) {
        setHide(false);
      } else {
        setHide(true);
      }
    }

    const scrollBy = () => {
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      if (currentScroll > lastScrollTop.current) {
        setHide(false);
        scrollUpStart.current = currentScroll;
      } else {
        if (scrollUpStart.current - currentScroll > threshold) {
          setHide(true);
        }
      }
      lastScrollTop.current = currentScroll <= 0 ? 0 : currentScroll;
    };

    if (enableAnimation) {
      window.addEventListener("scroll", hasReachedTop ? scrollTopBy : scrollBy);
      return () => {
        window.removeEventListener("scroll", hasReachedTop ? scrollTopBy : scrollBy);
      };
    }
  }, [enableAnimation]);


  return (
    <>
      <div
        className={`fixed z-10 bg-background ${enableAnimation ? "transition-transform" : ""} duration-300 ${hide ? "translate-y-0" : "-translate-y-full"} ${className}`}
      >
        {children}
      </div>
      <div className={`w-screen bg-background`} style={{ minHeight: `${height}px` }}></div>
    </>
  );
};

export default FixedTrigger;
