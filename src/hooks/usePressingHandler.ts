import { useState, useEffect } from "react";

const usePressingHandler = (action: () => void, delay: number = 500) => {
  const [isPressing, setIsPressing] = useState<boolean>(false);

  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout> | null = null;
    
    if (isPressing) {
      timerId = setTimeout(() => {
        action()
      }, delay);
    } else {
      if (timerId) {
        clearTimeout(timerId);
      }
    }

    return () => {
      if (timerId) {
        clearTimeout(timerId);
      }
    };
  }, [isPressing, delay]);

  const startPressing = () => setIsPressing(true);
  const stopPressing = () => setIsPressing(false);
  

  return { startPressing, stopPressing };
};

export default usePressingHandler;

