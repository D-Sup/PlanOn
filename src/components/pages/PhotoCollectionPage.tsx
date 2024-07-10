import { useLocation } from "react-router-dom"
import useModalStack from "@/hooks/useModalStack"
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import Header from "../organisms/Header"
import FixedTrigger from "../molecules/FixedTrigger"
import ImageFrame from "../atoms/ImageFrame"

const PhotoCollectionPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { openModal } = useModalStack()

  const { DetailHeader } = Header()

  const location = useLocation()

  const { photos } = location.state || {};

  return (
    <>
      <FixedTrigger className="top-0 w-full" height={40} enableAnimation={false}>
        <DetailHeader title={"사진"} handleFunc={() =>
          setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))} />
      </FixedTrigger>

      <ul className="m-auto grid grid-cols-2 gap-1">
        {photos?.map((photo: string) => (
          <li
            key={photo}
            className="relative aspect-square bg-background"
            onClick={() => {
              openModal("PhotoView", { photo })
            }}
          >
            <ImageFrame src={photo} alt={`photo-${photo}`} />
          </li>
        ))}
      </ul>
    </>
  )
}

export default PhotoCollectionPage