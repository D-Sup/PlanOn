import { useEffect, useState } from "react";

const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    currentWidth: window.innerWidth,
    currentHeight: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        currentWidth: window.innerWidth,
        currentHeight: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize