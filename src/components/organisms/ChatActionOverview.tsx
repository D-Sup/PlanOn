import { useContext } from "react"
import { UserContext } from "../organisms/UserInfoProvider"

import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";

import useModalStack from "@/hooks/useModalStack";

import ActionCard from "../mocules/ActionCard";

import getAccountId from "@/utils/getAccountId";

import IconPhoto from "../../assets/images/icon-photo.svg?react";
import IconLink from "../../assets/images/icon-link.svg?react";
// import IconCalendar from "../../assets/images/icon-calendar.svg?react";
// import IconRoulette from "../../assets/images/icon-roulette.svg?react";

interface ChatActionOverviewProps {
  closeModal: () => void,
  props: {
    id: string,
    handleFunc: (type: "gallery" | "link") => void
  }
}

const ChatActionOverview = ({ closeModal, props }: ChatActionOverviewProps) => {
  const { data } = useContext(UserContext);

  const accountId = getAccountId();

  const { openModal, closeModalDirect } = useModalStack()

  const { createSubcollection } = useFirestoreCreate("chats");
  const { updateFieldObject } = useFirestoreUpdate("users")
  const { deleteFieldObject } = useFirestoreDelete("users");
  const { deleteSubcollection } = useFirestoreDelete("chats");

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)


  return (
    <div className="pt-[20px] px-[20px] pb-[30px]">
      <div className="flex flex-col gap-[20px]" >
        <div className="flex flex-col gap-[10px]">
          <h3 className="text-md text-white mb-[5px]">모아보기</h3>
          <ActionCard icon={IconPhoto} name={"사진"} handleFunc={() => {
            closeModal()
            setTimeout(() => {
              window.scrollTo(0, 0)
              props.handleFunc("gallery")
            }, 400)
          }} type={"collect"} />
          <ActionCard icon={IconLink} name={"링크"} handleFunc={() => {
            closeModal()
            setTimeout(() => {
              window.scrollTo(0, 0)
              props.handleFunc("link")
            }, 400)
          }} type={"collect"} />
        </div>

        {/* <div className="flex flex-col gap-[10px]">
        <h3 className="text-md text-white">이벤트</h3>
        <div className="flex flex-col gap-[10px]">
          <ActionCard icon={IconCalendar} name={"일정 공유"} handleFunc={() => { }} type={"share"} />
          <ActionCard icon={IconRoulette} name={"룰렛 돌리기"} handleFunc={() => { }} type={"share"} />
        </div>
      </div> */}

        <button
          className="w-full h-[50px] rounded-md bg-gray-heavy text-md text-red"
          type="button"
          onClick={
            () => {
              if (data) {
                const currentChat = data?.data.chats.filter(chat => chat.id === props.id)[0]
                openModal("Alert", "채팅방을 나가시겠습니까?", ["취소", "확인"],
                  [null, () => {
                    closeModalDirect()
                    setTimeout(() => closeModal(), 0)
                    setTimeout(async () => {
                      if (currentChat.isLocal) {
                        await Promise.all([
                          deleteFieldObject(accountId, "chats", { id: currentChat.id }),
                          deleteSubcollection("messages", `message-${currentChat.id}`)
                        ])
                        setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
                        openModal("Toast", { message: "채팅방을 나갔습니다." });
                      } else {
                        await Promise.all([
                          deleteFieldObject(accountId, "chats", { id: currentChat.id }),
                          updateFieldObject(currentChat.userId, "chats", { id: currentChat.id }, { isLocal: true, lastReceive: "상대방이 대화에서 나갔습니다.", lastMessageCreatedAt: new Date() }),
                          createSubcollection("messages", `message-${currentChat.id}`, { isLocal: true })
                        ])
                        setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
                        openModal("Toast", { message: "채팅방을 나갔습니다." });
                      }
                    }, 800)
                  }
                  ])
              }
            }

          }
        >
          채팅방 나가기
        </button>
      </div>
    </div>
  )
}

export default ChatActionOverview