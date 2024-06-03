import { useNavigate, useLocation } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import Header from "../organisms/Header"
import FixedTrigger from "../mocules/FixedTrigger"
import ImageFrame from "../atoms/ImageFrame"

import formatDate from "@/utils/formatDate"

import { MessagesType } from "@/types/messages.type"

const PhotoHistoryCollectionPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { DetailHeader } = Header()

  const navigate = useNavigate()
  const location = useLocation()

  const { data } = location.state || {};

  const filteredData = data.filter((singleData: MessagesType) => "photoURL" in singleData)


  return (
    <>
      <FixedTrigger className="top-0 w-full" height={40} enableAnimation={false}>
        <DetailHeader title={"모아보기"} handleFunc={() => setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))} />
      </FixedTrigger>

      {filteredData.map((singleData: MessagesType, index: number) => (
        <>
          {formatDate(singleData.createdAt, 3) !== formatDate(index === 0 ? new Date(0) : filteredData[index - 1].createdAt, 3) &&
            <div className="my-[30px] w-full h-[1px] flex gap-[15px] items-center">
              <div className="w-full h-[1px] bg-gray-old"></div>
              <span className="shrink-0 text-xsm text-white">{formatDate(singleData.createdAt, 1)}</span>
              <div className="w-full h-[1px] bg-gray-old"></div>
            </div>
          }

          <ul className="m-auto grid grid-cols-3 gap-1" key={index}>
            {singleData.photoURL.map((photo) => (
              <li
                className="relative aspect-square bg-background"
                onClick={() => {
                  window.scrollTo(0, 0)
                  navigate("/photo", { state: { direction: "up", photo } })
                }}
              >
                <ImageFrame src={photo} alt={`photo-${index}`} className="aspect-square object-cover" />
              </li>
            ))}
          </ul>
        </>
      ))}
    </>
  )
}

export default PhotoHistoryCollectionPage
