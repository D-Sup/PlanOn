import { useState, useEffect } from "react";

const useDebounce = (value: string, delay: number, fetching: boolean) => {
  const [isInputDone, setIsInputDone] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(fetching);
  const [timerId, setTimerId] = useState<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerId) {
      clearTimeout(timerId);
      setIsInputDone(false);
    }

    if (value) {
      setIsFetching(true);
      setTimerId(setTimeout(() => {
        setIsInputDone(true);
      }, delay));
    }
  }, [value, delay]);

  useEffect(() => {
    if (!fetching) {
      setIsFetching(false);
    }
  }, [fetching])

  return { isInputDone, isFetching };
}


export default useDebounce;
