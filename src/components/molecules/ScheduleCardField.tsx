import { useState, useRef, useEffect } from "react";

import IconArrowBottom from "../../assets/images/icon-arrow-bottom.svg?react";

interface ScheduleCardFieldProps {
  children: React.ReactNode,
  label: string,
  memoContent?: string,
}

const ScheduleCardField = ({ children, label, memoContent }: ScheduleCardFieldProps) => {

  const memoContentRef = useRef<HTMLDivElement | null>(null)
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (memoContentRef.current) {
      setHeight(isExpanded ? memoContentRef.current.scrollHeight : 0);
    }
  }, [isExpanded]);

  return (
    <div>
      <div className="flex gap-[15px]">
        <div className="flex-center flex-col max-w-[35px] min-w-[35px]"
          onClick={() => {
            setIsExpanded(!isExpanded)
          }}
        >
          <p className="font-bold text-white">{label.slice(1)}</p>
          <span className=" text-md text-white">{label.slice(0, 1)}</span>
          {memoContent &&
            <button
              className={`mt-[5px] relative min-w-[20px] min-h-[20px] bg-background-light rounded-full`}
              type="button"
              onClick={() => {
                setIsExpanded(!isExpanded)
              }}>
              <IconArrowBottom className={`absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 transition duration-300 ${isExpanded ? "rotate-180" : "rotate-0"}`} width={10} height={10} fill={"var(--white)"} />
            </button>
          }
        </div>
        {children}
      </div>
      {memoContent &&
        <div
          className="flex gap-[15px] items-center transition-all duration-300 overflow-hidden"
          style={{ height, opacity: isExpanded ? 1 : 0, marginTop: isExpanded ? "15px" : "0" }}
        >
          <div className="max-w-[35px] min-w-[35px]">
            <div className="flex flex-col items-center">
              <div className="outline-dashed outline-1 outline-white" style={{ height: height / 2 }}></div>
              <div className="my-[10px] w-[15px] h-[15px] rounded-full bg-highlight" style={{ boxShadow: "0 0 4px var(--highlight)" }}></div>
              <div className="outline-dashed outline-1 outline-white" style={{ height: height / 2 }}></div>
            </div>
          </div>
          <span className="text-md text-white" ref={memoContentRef}>{memoContent}</span>
        </div>
      }
    </div>
  );
};

export default ScheduleCardField;
