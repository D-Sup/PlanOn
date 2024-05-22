import { useContext } from "react"
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate } from "react-router-dom"

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import formatDate from "@/utils/formatDate"

import FixedTrigger from "../mocules/FixedTrigger"
import ScrollRefreshContainer from "../organisms/ScrollRefreshContainer"
import ProfileCard from "../mocules/ProfileCard"
import ListUnitSkeleton from "../skeleton/ListUnitSkeleton"

import IconArrow from "../../assets/images/icon-arrow-left.svg?react";


const NotificationPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { data: userData, isLoading, isFetching, refetch } = useContext(UserContext);

  const navigate = useNavigate()

  return (
    <ScrollRefreshContainer isLoading={isFetching} refetch={refetch}>
      <div className="min-h-[calc(100dvh-80px)]">
        <FixedTrigger height={80} enableAnimation={false}>
          <header className="mt-[30px] ml-[20px] mb-[10px] flex items-center w-screen min-h-[40px]">
            <button className="p-[10px]" type="button" onClick={() => {
              setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
            }}>
              <IconArrow width={7} height={12} fill={"var(--white)"} />
            </button>
            <h2 className="ml-[10px] text-white text-xlg font-bold">알림</h2>
          </header>
        </FixedTrigger>

        <div className="px-[30px]">
          {userData?.data.notificationHistory.slice().reverse().map((history) => (
            <li
              className="w-full flex flex-col justify-center justify-between py-[10px]"
              style={{ boxShadow: "0 1px var(--gray-heavy)" }}
              onClick={() => {
                setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
                if (history.type === "post" || history.type === "like" || history.type === "comment") {
                  navigate(`/post/detail/writable/${history.notificationUrl}`, { state: { direction: "next" } })
                } else if (history.type === "follow") {
                  navigate(`/profile/${history.notificationUrl}`, { state: { direction: "next" } })
                }
              }}
            >
              <ProfileCard
                title={history.title}
                description={history.body}
                src={history.icon}
              />
              <span className="ml-[44px] mt-[5px] text-sm text-gray-old">{formatDate(history.createdAt, 9)}</span>
            </li>
          ))}
          {isLoading && Array(8).fill(0).map((_, index) => (
            <li
              key={index}
              className="w-full flex flex-col justify-center justify-between py-[10px]"
              style={{ boxShadow: "0 1px var(--gray-heavy)" }}
            >
              <ListUnitSkeleton isNotBoxShadow={true} />
            </li>
          ))}

          {userData?.data.notificationHistory.length === 0 &&
            <span className="mt-[150px] block text-center text-nowrap text-md text-white">알림기록이 없습니다.</span>
          }
        </div>

      </div>
    </ScrollRefreshContainer>
  )
}

export default NotificationPage