import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import ChatService from "@/services/chatService"

import Header from "../organisms/Header"
import FixedTrigger from "../mocules/FixedTrigger"
import ImageFrame from "../atoms/ImageFrame"
import Loader from "../organisms/Loader"

import formatDate from "@/utils/formatDate"

const LinkHistoryCollectionPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { DetailHeader } = Header()

  const location = useLocation()
  const { id } = location.state || {};

  const { ReadLink } = ChatService()
  const { data, isLoading, refetch } = ReadLink(id)

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
      <div className="p-[10px]">
        {filteredData.map(({ data: singleData }, index: number) => (
          <>
            {formatDate(singleData.createdAt, 3) !== formatDate(index === 0 ? new Date(0) : filteredData[index - 1].data.createdAt, 3) &&
              <div className="my-[30px] w-full h-[1px] flex gap-[15px] items-center">
                <div className="w-full h-[1px] bg-gray-old"></div>
                <span className="shrink-0 text-xsm text-white">{formatDate(singleData.createdAt, 1)}</span>
                <div className="w-full h-[1px] bg-gray-old"></div>
              </div>
            }
            <a
              key={singleData.id}
              href={singleData.link.url}
              className="aspect-square bg-background inline-block w-1/2 p-[8px] align-top"
              target="_blank"
            >
              <div className="h-1/2 rounded-t-md overflow-hidden">
                {singleData.link.image &&
                  <ImageFrame src={singleData.link.image} alt={`photo-${index}`} />
                }
              </div>

              <div className={`min-h-[50%] p-[10px] bg-input flex flex-col justify-center text-white ${singleData.link.image ? "rounded-b-md" : "rounded-md"}`}>
                <strong className="text-md break-all">{singleData.link.title ? singleData.link.title : singleData.link.url}</strong>
                <span className="text-xsm text-blue-500 break-all reduce-words">{singleData.link.url}</span>
                <span className="text-xsm text-gray-old break-all">{singleData.link.description}</span>
              </div>
            </a>
          </>
        ))}
        {filteredData.length === 0 &&
          <span className="absolute-center text-nowrap text-md text-white">링크 기록이 없습니다.</span>
        }
      </div>
    </>
  )
}

export default LinkHistoryCollectionPage
