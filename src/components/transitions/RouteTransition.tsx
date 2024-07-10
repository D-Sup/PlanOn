import React, { useEffect } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import { useRecoilState, useResetRecoilState } from "recoil";
import { routeDirectionValue, scrollPositionValue } from "@/store";
import { useNavigate } from "react-router-dom";

interface RouteState {
  pathname: string
  state: {
    direction: "next" | "prev" | "up" | "down" | "fade";
  },
}

interface RouteTransitionProps {
  location: RouteState,
  children: React.ReactNode
}

const RouteTransition = ({ location, children }: RouteTransitionProps) => {

  const [routeDirectionValueState, setRouteDirectionValueState] = useRecoilState(routeDirectionValue)
  const [scrollPositionValueState, setScrollPositionValueState] = useRecoilState(scrollPositionValue)
  const resetRouteDirectionValueState = useResetRecoilState(routeDirectionValue)

  const navigate = useNavigate()

  useEffect(() => {
    if (routeDirectionValueState.direction !== "") {
      const previousPageUrl = routeDirectionValueState.previousPageUrl
      const data = routeDirectionValueState.data
      if (previousPageUrl.length !== 0) {
        navigate(previousPageUrl[previousPageUrl.length - 1], { state: data[data.length - 1] ? JSON.parse(JSON.stringify(data[data.length - 1])) : {} })
      } else {
        navigate(-1)
      }

      if (data.length === 0 && previousPageUrl.length === 0) {
        setTimeout(() => resetRouteDirectionValueState(), 300)
      } else {
        setTimeout(() => setRouteDirectionValueState(Prev => ({
          ...Prev,
          previousPageUrl: Prev.previousPageUrl.filter((url) => (url !== previousPageUrl[previousPageUrl.length - 1])),
          data: Prev.data.filter((url) => (url !== data[data.length - 1])),
          direction: ""
        })), 300)
      }
    }
  }, [routeDirectionValueState])

  const pathToSave = [
    "/post",
    "/schedule",
    "/message",
    "/setting",
  ];

  const handleScroll = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop

    if (pathToSave.includes(location.pathname)) {
      setScrollPositionValueState(prev => ({
        ...prev,
        [location.pathname.slice(1)]: scrollTop
      }));
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0)
    setTimeout(() => {
      if (location.pathname === "/post" || location.pathname === "/schedule" || location.pathname === "/message" || location.pathname === "/setting") {
        window.scrollTo({
          top: (location.pathname === "/post" && scrollPositionValueState["post"] ||
            location.pathname === "/schedule" && scrollPositionValueState["schedule"] ||
            location.pathname === "/message" && scrollPositionValueState["message"] ||
            location.pathname === "/setting" && scrollPositionValueState["setting"]) || 0,
          behavior: "smooth"
        })
      }
    }, 350)
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [navigate]);


  return (
    <TransitionGroup
      childFactory={(child) => {
        return React.cloneElement(child, {
          classNames:
            routeDirectionValueState.direction !== "" ? (
              routeDirectionValueState.direction === "next" && "navigate-next" ||
              routeDirectionValueState.direction === "up" && "navigate-up" ||
              routeDirectionValueState.direction === "prev" && "navigate-prev" ||
              routeDirectionValueState.direction === "down" && "navigate-down" ||
              routeDirectionValueState.direction === "fade" && "navigate-fade"
            ) : (
              location.state?.direction === "next" && "navigate-next" ||
              location.state?.direction === "up" && "navigate-up" ||
              location.state?.direction === "prev" && "navigate-prev" ||
              location.state?.direction === "down" && "navigate-down" ||
              location.state?.direction === "fade" && "navigate-fade"
            )
        });
      }}
    >
      <CSSTransition
        key={location.pathname}
        timeout={300}
      >
        <div className="w-full overflow-x-clip">
          {children}
        </div>
      </CSSTransition>
    </TransitionGroup>
  );
};

export default RouteTransition;