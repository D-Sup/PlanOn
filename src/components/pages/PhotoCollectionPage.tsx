import { useNavigate, useLocation } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import Header from "../organisms/Header"
import FixedTrigger from "../mocules/FixedTrigger"
import ImageFrame from "../atoms/ImageFrame"

const PhotoCollectionPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { DetailHeader } = Header()

  const navigate = useNavigate()
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
              window.scrollTo(0, 0)
              setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, { photos }] }))
              navigate("/photo", { state: { direction: "up", photo } })
            }}
          >
            <ImageFrame src={photo} alt={`photo-${photo}`} className="w-full aspect-square object-cover" />
          </li>
        ))}
      </ul>
    </>
  )
}

export default PhotoCollectionPage