import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { UserContext } from "../organisms/UserInfoProvider"
import useModalStack from "@/hooks/useModalStack"

import { useResetRecoilState, useSetRecoilState } from "recoil"
import { authUser, routeDirectionValue } from "@/store"

import logoutService from "@/services/logoutService"

import Header from "../organisms/Header"
import SettingOverview from "../organisms/SettingOverview"
import ListUnitSkeleton from "../skeleton/ListUnitSkeleton"
import ListUnit from "../organisms/ListUnit"

const SettingPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { data: userData, isLoading } = useContext(UserContext);

  const resetAuthUserState = useResetRecoilState(authUser)

  const navigate = useNavigate()

  const { openModal, closeModal } = useModalStack()

  const { ChatHeader } = Header();
  const { UserLinkListUnit } = ListUnit()

  return (
    <>
      <div className="mt-[30px] mb-[10px]">
        <ChatHeader title={"설정"} />
      </div>
      <div className="px-[30px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        {!isLoading && userData
          ? <UserLinkListUnit data={userData.data} handleFunc={() => {
            setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
            navigate("/profile", { state: { direction: "next", id: userData.id } })
          }} />
          : <ListUnitSkeleton className="py-[10px]" />
        }
      </div>
      <div className="px-[30px] pt-[30px]">
        <SettingOverview />
      </div>

      <div className="absolute bottom-[100px] px-[30px] w-full">
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
                  navigate("/login", { state: { direction: "prev" } })
                  openModal("Toast", { message: "로그아웃 되었습니다." })
                }, 500)
              }
              ])
          }}
        >
          로그아웃
        </button>
      </div>
    </>
  )
}

export default SettingPage