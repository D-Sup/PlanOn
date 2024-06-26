import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import IconHome from "../../assets/images/icon-home.svg?react";
import IconClock from "../../assets/images/icon-clock.svg?react";
import IconMessage from "../../assets/images/icon-message.svg?react";
import IconSetting from "../../assets/images/icon-setting.svg?react";
import IconMap from "../../assets/images/icon-map.svg?react";

const NavigationMenu = () => {

  const showNavBarPaths = [
    "/post",
    "/schedule",
    "/chat",
    "/setting",
  ];

  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [firstClick, setFirstClick] = useState<boolean>(true);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const navigate = useNavigate();

  const menuItems = [
    { icon: IconHome, path: "/post" },
    { icon: IconClock, path: "/schedule" },
    { icon: IconMap, path: "/map" },
    { icon: IconMessage, path: "/chat" },
    { icon: IconSetting, path: "/setting" },
  ];

  const showNavBar = showNavBarPaths.includes(location.pathname);

  useEffect(() => {
    if (showNavBar) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }, [navigate])


  return (
    <>
      <ul className="fixed bottom-0 z-20 flex justify-evenly items-center w-screen h-[80px] bg-background transition duration-300" style={{ transform: showNavBar ? "translateY(0)" : "translateY(100%)" }} >
        {menuItems.map((item) => (
          <li
            key={item.path}
            className={`
            flex 
            justify-evenly 
            items-center 
            w-[50px] 
            h-[50px] 
            rounded-[10px] 
            transition 
            duration-300 
            ${location.pathname === item.path ? "bg-white" : "bg-background"}
          `}
            onClick={() => {
              if (item.path === "/post") {
                setFirstClick(true)
                if (firstClick) {
                  window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                  })
                }
              } else {
                setFirstClick(false)
              }
              item.path === "/map" && setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
              navigate(item.path, {
                state: { direction: "fade" },
              })
            }}
          >
            <item.icon width={20} height={20} fill={location.pathname === item.path ? "var(--black)" : "var(--white)"} />
          </li>
        ))}

      </ul>
      {isVisible &&
        <div className="w-screen min-h-[80px] bg-background transition duration-300"></div>
      }
    </>
  );
}

export default NavigationMenu;
