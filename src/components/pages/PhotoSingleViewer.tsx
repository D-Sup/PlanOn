import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import ImageFrame from "../atoms/ImageFrame"
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

import { useLocation } from "react-router-dom"

const PhotoSingleViewer = () => {
  const location = useLocation()

  const { photo } = location.state || {}

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  return (
    <>
      <div className="w-full h-dvh flex-center bg-background">
        <button
          type="button"
          className="absolute z-10 top-[10px] right-[10px]"
          onClick={() => {
            setRouteDirectionValueState(Prev => ({ ...Prev, direction: "down" }))
          }}>
          <IconCircleX width={25} height={25} fill={"var(--white)"} />
        </button>
        <ImageFrame src={photo} alt={`photo-${photo}`} className="w-full aspect-square" />
      </div>
    </>
  )
}

export default PhotoSingleViewer