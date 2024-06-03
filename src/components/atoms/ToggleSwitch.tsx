import { useState } from "react"

const ToggleSwitch = () => {
  const [isOnSwitch, setIsOnSwitch] = useState<boolean>(false);

  return (
    <button
      className={`
        px-[3px] 
        flex 
        items-center 
        w-[52px] 
        h-[28px] 
        rounded-full  
        transition 
        duration-300 
        ${isOnSwitch ? "bg-white" : "bg-input"}
      `}
      onClick={() => setIsOnSwitch(Prev => !Prev)}
    >
      <div
        className=
        {`
          w-[22px] 
          h-[22px] 
          rounded-full 
          transition
          duration-300 
          ${isOnSwitch ? "bg-black translate-x-[110%]" : "bg-gray-old"}
        `}></div>
    </button>
  )
}

export default ToggleSwitch