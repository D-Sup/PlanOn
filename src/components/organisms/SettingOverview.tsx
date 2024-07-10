import { useContext } from "react";
import { UserContext } from "../providers/UserInfoProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { routeDirectionValue, authUser } from "@/store";
import useModalStack from "@/hooks/useModalStack";

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";
import logoutService from "@/services/logoutService";

import FontOverView from "./FontOverView";
import SettingCard from "../molecules/SettingCard";

import { v4 as uuidv4 } from "uuid";
import { appAuth } from "@/firebase/config";

import IconDarkmode from "../../assets/images/icon-darkmode.svg?react";
import IconAlert from "../../assets/images/icon-alert.svg?react";
import IconLock from "../../assets/images/icon-lock.svg?react";
import IconInfo from "../../assets/images/icon-info.svg?react";
import IconContact from "../../assets/images/icon-contact.svg?react";
import IconUnsubscribe from "../../assets/images/icon-unsubscribe.svg?react";
import IconFont from "../../assets/images/icon-font.svg?react";

import NotificationPermission from "@/utils/notificationPermission";

const SettingOverview = () => {

  const { requestPermission } = NotificationPermission()

  const navigate = useNavigate()
  const location = useLocation()

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)
  const resetAuthUserState = useResetRecoilState(authUser)

  const { data: userData } = useContext(UserContext);

  const adminChat = userData?.data.chats[userData?.data.chats.findIndex((chat) => chat.userId === process.env.REACT_APP_Admin_ID)]

  const { updateField } = useFirestoreUpdate("users")
  const { deleteDocument } = useFirestoreDelete("users")

  const { openModal, closeModal } = useModalStack()

  const isFirstChat = userData && !userData.data.chats.some((chat) => chat.userId === process.env.REACT_APP_Admin_ID)

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

          <SettingCard
            icon={IconAlert}
            name={"알림"}
            isSafeUpdate={true}
            handleFunc={() => {
              requestPermission()
              if (userData.data.deviceToken !== "") {
                openModal("Toast", { message: "디바이스 설정에서 알림을 설정해주세요!" });
              }
            }}
            hasSwitch={true}
            isChecked={userData.data.isAlert}
          />

          <SettingCard
            icon={IconLock}
            name={"잠금설정"}
            isSafeUpdate={true}
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
            isChecked={!!userData.data.secureNumber} />

          <SettingCard icon={IconFont} name={"글씨체"} handleFunc={() => {
            openModal(FontOverView, { selectedFont: userData.data.selectedFont })
          }} />

          <SettingCard icon={IconInfo} name={"앱 소개"} handleFunc={() => {
            navigate("/tutorial", { state: { direction: "up" } })
          }} />

          <SettingCard icon={IconContact} name={"문의하기"} handleFunc={() => {
            setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
            navigate("/chatroom", {
              state: {
                direction: "next",
                userInfo: {
                  authorizationId: process.env.REACT_APP_Admin_ID,
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
                    resetAuthUserState()
                    navigate("/login", { state: { direction: "prev" } })
                    openModal("Toast", { message: "계정이 탈퇴되었습니다." })
                  }).catch(function () {
                    openModal("Toast", { message: "계정 탈퇴를 실패했습니다." })
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