import { useState, useEffect } from "react";

const useScrollBottom = (): boolean => {
  const [isBottom, setIsBottom] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const clientHeight = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      setIsBottom(scrollTop + clientHeight + 50 >= scrollHeight);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isBottom;
}

export default useScrollBottom;