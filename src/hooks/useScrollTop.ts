import { useState, useEffect } from "react";

const useScrollTop = (): boolean => {
  const [isTop, setIsTop] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsTop(scrollTop <= 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isTop;
}

export default useScrollTop;