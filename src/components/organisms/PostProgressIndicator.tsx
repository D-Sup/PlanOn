import { Fragment } from "react/jsx-runtime";

const PostProgressIndicator = ({ progress }: { progress: number }) => {

  const steps = [
    { progressCheck: 0, description: "사진선택" },
    { progressCheck: 1, description: "일정선택" },
    { progressCheck: 2, description: "내용선택" }
  ];

  return (
    <div className="pb-[25px] px-[8px] flex items-center">
      {steps.map((step, index) => (
        <Fragment key={index}>
          <div
            className={`relative h-[30px] w-[30px] rounded-full transition duration-300 border text-md text-center ${progress >= step.progressCheck ? "text-highlight border-highlight" : "text-gray-heavy border-gray-heavy"}`}
            style={{ backgroundColor: progress >= step.progressCheck ? "rgba(211,255,99,0.2)" : "rgba(64, 64, 64, 0.2)" }}
          >
            <span className={`absolute-center transition duration-300 text-md ${progress >= step.progressCheck ? "text-highlight" : "text-gray-heavy"}`}>{step.progressCheck + 1}</span>
            <p className={`absolute whitespace-nowrap -left-[7px] -bottom-[25px] text-sm leading-none ${progress >= step.progressCheck ? "text-white" : "text-gray-heavy"}`}>{step.description}</p>
          </div>
          {index < steps.length - 1 && (
            <div className={`h-[1px] flex-grow transition duration-300 ${progress > step.progressCheck ? "bg-highlight" : "bg-gray-heavy"}`}></div>
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default PostProgressIndicator;