import { useState } from "react";

import IconHome from "../../assets/images/icon-home.svg?react";
import IconClock from "../../assets/images/icon-clock.svg?react";
import IconMessage from "../../assets/images/icon-message.svg?react";
import IconSetting from "../../assets/images/icon-setting.svg?react";

const NavigationMenu = () => {

  const [current, setCurrent] = useState<number>(0);

  const icons = [IconHome, IconClock, IconMessage, IconSetting];

  return (
    <>
      <ul className="fixed bottom-0 flex justify-evenly items-center w-screen h-[80px] bg-background">

        {icons.map((Icon, index) => (
          <li
            key={index}
            className={`
            flex 
            justify-evenly 
            items-center 
            w-[50px] 
            h-[50px] 
            rounded-[10px] 
            transition 
            duration-300 
            ${current === index ? "bg-highlight" : "bg-background"}
          `}
            onClick={() => setCurrent(index)}
          >
            <Icon width={22} height={22} fill={current === index ? "var(--black)" : "var(--white)"} />
          </li>
        ))}

      </ul>
      <div className="w-screen min-h-[80px] bg-background"></div>
    </>
  );
}

export default NavigationMenu;