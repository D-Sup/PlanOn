import { useContext } from "react";
import { UserContext } from "./UserInfoProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import logoutService from "@/services/logoutService";

import useModalStack from "@/hooks/useModalStack";
import SettingCard from "../mocules/SettingCard";

import { v4 as uuidv4 } from "uuid";
import { appAuth } from "@/firebase/config";

import IconDarkmode from "../../assets/images/icon-darkmode.svg?react";
import IconAlert from "../../assets/images/icon-alert.svg?react";
import IconLock from "../../assets/images/icon-lock.svg?react";
import IconInfo from "../../assets/images/icon-info.svg?react";
import IconContact from "../../assets/images/icon-contact.svg?react";
import IconUnsubscribe from "../../assets/images/icon-unsubscribe.svg?react";

const SettingOverview = () => {

  const navigate = useNavigate()
  const location = useLocation()

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const { data: userData } = useContext(UserContext);

  const adminChat = userData?.data.chats[userData?.data.chats.findIndex((chat) => chat.userId === "sAksWjNPRfMt7PJ6IDtWM0Rnunt1")]

  const { updateField } = useFirestoreUpdate("users")
  const { deleteDocument } = useFirestoreDelete("users")

  const { openModal, closeModal } = useModalStack()

  const isFirstChat = userData && !userData.data.chats.some((chat) => chat.userId === "sAksWjNPRfMt7PJ6IDtWM0Rnunt1")

  const { updateOption } = location.state || {}

  return (
    <>
      {userData &&
        <ul className="flex flex-col gap-[10px]">

          <SettingCard
            icon={IconDarkmode}
            name={"다크모드"}
            hasSwitch={true}
            isChecked={userData.data.isDarkMode}
            handleFunc={() => {
              updateField(userData.id, { isDarkMode: !userData.data.isDarkMode })
              if (userData.data.isDarkMode) {
                document.querySelector("html").setAttribute("data-theme", "light");
              } else {
                document.querySelector("html").setAttribute("data-theme", "dark");
              }
            }} />

          <SettingCard icon={IconAlert} name={"알림"} handleFunc={() => { updateField(userData.id, { isAlert: !userData.data.isAlert }) }} hasSwitch={true} isChecked={userData.data.isAlert} />

          <SettingCard icon={IconLock} name={"잠금설정"}
            handleFunc={() => {
              if (userData.data.secureNumber !== "") {
                updateField(userData.id, {
                  secureNumber: ""
                })
              } else {
                navigate("/security", { state: { direction: "up", isSetPassword: true } })
              }
            }}
            hasSwitch={true}
            isChecked={updateOption || userData.data.secureNumber !== ""} />

          <SettingCard icon={IconInfo} name={"앱 튜토리얼"} handleFunc={() => {
            openModal("Toast", { type: "info", message: "아직 준비 중인 서비스입니다." })
          }} />

          <SettingCard icon={IconContact} name={"문의하기"} handleFunc={() => {
            setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
            navigate("/chatroom", {
              state: {
                direction: "next",
                userInfo: {
                  authorizationId: "sAksWjNPRfMt7PJ6IDtWM0Rnunt1",
                  accountName: "플랜온",
                  description: "최대한 신속하게 도와드리겠습니다.",
                  accountImage: ""
                },
                id: isFirstChat ? uuidv4() : adminChat.id,
                unreadLength: isFirstChat ? 0 : adminChat.unreadLength,
                isFirstChat
              }
            })
          }} />

          <SettingCard icon={IconUnsubscribe} name={"계정탈퇴"} handleFunc={() => {
            openModal("Alert", "정말로 계정을 탈퇴하시겠습니까?", ["취소", "탈퇴하기"],
              [null, () => {
                closeModal()
                setTimeout(async () => {
                  await deleteDocument(userData.id)
                  appAuth.currentUser.delete().then(async function () {
                    logoutService()
                    navigate("/login", { state: { direction: "prev" } })
                    openModal("Toast", { message: "계정이 삭제되었습니다." })
                  }).catch(function () {
                    openModal("Toast", { message: "계정이 삭제를 실패했습니다." })
                  });
                }, 500)
              }
              ])
          }} />

        </ul>
      }
    </>
  )
}

export default SettingOverview