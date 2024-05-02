import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import useModalStack from "@/hooks/useModalStack"
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import ChatService from "@/services/chatService"

import Header from "../organisms/Header"
import FixedTrigger from "../mocules/FixedTrigger"
import ImageFrame from "../atoms/ImageFrame"
import Loader from "../organisms/Loader"

import formatDate from "@/utils/formatDate"

const PhotoHistoryCollectionPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { openModal } = useModalStack()

  const { DetailHeader } = Header()

  const location = useLocation()
  const { id } = location.state || {};

  const { ReadPhoto } = ChatService()
  const { data, isLoading, refetch } = ReadPhoto(id)

  const filteredData = data?.slice().sort((first, second) =>
    first?.data.createdAt?.seconds <= second?.data.createdAt?.seconds ? -1 : 1
  );

  useEffect(() => {
    refetch()
  }, [])

  if (isLoading) return (
    <div className="absolute-center w-[100px]">
      <Loader />
    </div>
  )


  return (
    <>
      <FixedTrigger className="top-0 w-full" height={40} enableAnimation={false}>
        <DetailHeader title={"모아보기"} handleFunc={() => setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))} />
      </FixedTrigger>

      {filteredData.map((singleData, index: number) => (
        <>
          {formatDate(singleData.data.createdAt, 3) !== formatDate(index === 0 ? new Date(0) : filteredData[index - 1].data.createdAt, 3) &&
            <div className="my-[30px] w-full h-[1px] flex gap-[15px] items-center">
              <div className="w-full h-[1px] bg-gray-old"></div>
              <span className="shrink-0 text-xsm text-white">{formatDate(singleData.data.createdAt, 1)}</span>
              <div className="w-full h-[1px] bg-gray-old"></div>
            </div>
          }
          {singleData.data.photoURL.map((photo) => (
            <li
              key={singleData.id}
              className="aspect-square inline-block bg-background w-1/3 align-top p-[4px]"
              onClick={() => {
                openModal("PhotoView", { photo })
              }}
            >
              <ImageFrame src={photo} alt={`photo-${index}`} />
            </li>
          ))}
        </>
      ))}
      {filteredData.length === 0 &&
        <span className="absolute-center text-nowrap text-md text-white">사진 기록이 없습니다.</span>
      }
    </>
  )
}

export default PhotoHistoryCollectionPage
