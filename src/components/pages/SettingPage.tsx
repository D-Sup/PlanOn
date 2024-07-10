import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../providers/UserInfoProvider"
import useModalStack from "@/hooks/useModalStack"

import { useResetRecoilState, useSetRecoilState } from "recoil"
import { authUser, routeDirectionValue } from "@/store"

import logoutService from "@/services/logoutService"

import FixedTrigger from "../molecules/FixedTrigger"
import ScrollRefreshContainer from "../appComponents/ScrollRefreshContainer"
import Header from "../organisms/Header"
import SettingOverview from "../organisms/SettingOverview"
import ListUnitSkeleton from "../skeleton/ListUnitSkeleton"
import UserLinkListUnit from "../organisms/UserLinkListUnit"


const SettingPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { data: userData, isLoading, isFetching, refetch } = useContext(UserContext);

  const resetAuthUserState = useResetRecoilState(authUser)

  const navigate = useNavigate()

  const { openModal, closeModal } = useModalStack()


  const { ChatHeader } = Header();


  return (
    <ScrollRefreshContainer isLoading={isFetching} refetch={refetch}>
      <div className="min-h-[calc(100dvh-80px)]">
        <FixedTrigger height={80} enableAnimation={false}>
          <div className="mt-[30px] mb-[10px]">
            <ChatHeader title={"설정"} />
          </div>
        </FixedTrigger>
        <div className="px-[30px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
          {!isLoading && userData
            ? <UserLinkListUnit key={userData.id} data={userData.data} handleFunc={() => {
              setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
              navigate(`/profile/${userData.id}`, { state: { direction: "next" } })
            }} />
            : <ListUnitSkeleton className="py-[10px]" />
          }
        </div>
        <div className="px-[30px] py-[30px]">
          <SettingOverview />
        </div>

        <div className=" bottom-[100px] px-[30px] w-full">
          <button
            className="w-full h-[50px] rounded-md bg-input text-md text-red"
            type="button"
            onClick={() => {
              openModal("Alert", "로그아웃 하시겠습니까?", ["취소", "확인"],
                [null, () => {
                  closeModal()
                  setTimeout(() => {
                    logoutService()
                    resetAuthUserState()
                    setTimeout(() => {
                      openModal("Toast", { message: "로그아웃 되었습니다." })
                    }, 600)
                  }, 500)
                }
                ])
            }}
          >
            로그아웃
          </button>
          {/* } */}
        </div>
      </div>
    </ScrollRefreshContainer>
  )
}

export default SettingPage