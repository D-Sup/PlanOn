import { useEffect, useContext } from "react"
import { UserContext } from "../providers/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom"
import useDebounce from "@/hooks/useDebounce"

import useFirestoreCreate from "@/hooks/useFirestoreCreate"
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import useFirestoreDelete from "@/hooks/useFirestoreDelete";

import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil"
import { inputValue, routeDirectionValue } from "@/store"

import useModalStack from "@/hooks/useModalStack"

import UserService from "@/services/userService"

import ScrollRefreshContainer from "../appComponents/ScrollRefreshContainer"
import Header from "../organisms/Header"
import ChatMemberListUnit from "../organisms/ChatMemberListUnit"
import ListUnit from "../organisms/ListUnit"
import FixedTrigger from "../molecules/FixedTrigger"
import SearchBar from "../atoms/SearchBar"
import ListUnitSkeleton from "../skeleton/ListUnitSkeleton"

import getAccountId from "@/utils/getAccountId"

const ChatPage = () => {
  const inputValueState = useRecoilValue(inputValue);
  const resetInputValueState = useResetRecoilState(inputValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const { SearchUser } = UserService()
  const { data: userSearchData, isFetching: isUserFetching, refetch: refetchUser } = SearchUser()
  const { data: userData, isLoading, isFetching: isFetchingUserData, refetch } = useContext(UserContext);

  const { createSubcollection } = useFirestoreCreate("chats");
  const { updateFieldObject } = useFirestoreUpdate("users");
  const { deleteFieldObject } = useFirestoreDelete("users");
  const { deleteSubcollection } = useFirestoreDelete("chats");

  const { isInputDone, isFetching } = useDebounce(inputValueState, 500, isUserFetching);

  const { openModal, closeModal } = useModalStack();

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const pathname = location.pathname.split("/")[2]
    if (pathname && userData) {
      const chats = userData.data.chats;
      const chat = chats[chats.findIndex(chat => chat.id === pathname)]
      setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, "/chat"], data: [...Prev.data, {}] }))
      navigate("/chatroom", { state: { direction: "next", id: chat.id, userInfo: chat.userInfo.data, unreadLength: chat.unreadLength } })
    }
  }, [userData])

  useEffect(() => {
    if (isInputDone) {
      refetchUser()
    }
  }, [isInputDone])

  const accountId = getAccountId()

  const { ChatHeader } = Header()

  const { ChatJoinableMemberItem } = ListUnit()

  return (
    <ScrollRefreshContainer isLoading={isFetchingUserData} refetch={() => {
      resetInputValueState()
      refetch()
    }}>
      <FixedTrigger height={138} enableAnimation={false}>
        <div className="mt-[30px]">
          <ChatHeader title={"메시지"} />
        </div>

        <div className="mt-[10px] mb-[20px] px-[30px]">
          <SearchBar />
        </div>
      </FixedTrigger>

      <div className="flex flex-col gap-[20px] pt-[10px] px-[30px] w-full min-h-[calc(100dvh-218px)]">
        {isLoading && !inputValueState ? (
          Array(8).fill(0).map((_, index) => (
            <ListUnitSkeleton isNotBoxShadow={true} key={index} />
          ))
        ) : (
          <>
            {!inputValueState && userData?.data.chats.map((singleData) => (
              <>
                <ChatMemberListUnit data={singleData} handleFunc={[
                  () => {
                    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
                    navigate("/chatroom", { state: { direction: "next", id: singleData.id, userInfo: singleData.userInfo.data, unreadLength: singleData.unreadLength } })
                  },
                  () => {
                    openModal("Alert", "채팅방을 나가시겠습니까?", ["취소", "확인"],
                      [null, () => {
                        closeModal()
                        setTimeout(async () => {
                          if (singleData.isLocal) {
                            await Promise.all([
                              deleteFieldObject(accountId, "chats", { id: singleData.id }),
                              deleteSubcollection("messages", `message-${singleData.id}`)
                            ])
                            openModal("Toast", { message: "채팅방을 나갔습니다." });
                          } else {
                            await Promise.all([
                              deleteFieldObject(accountId, "chats", { id: singleData.id }),
                              updateFieldObject(singleData.userId, "chats", { id: singleData.id }, { isLocal: true, lastReceive: "상대방이 대화에서 나갔습니다.", lastMessageCreatedAt: new Date() }),
                              createSubcollection("messages", `message-${singleData.id}`, { isLocal: true })
                            ])
                            openModal("Toast", { message: "채팅방을 나갔습니다." });
                          }
                        }, 500)
                      }
                      ])
                  }
                ]} key={singleData.id} />
              </>
            ))}
            {userData?.data.chats.length === 0 && !inputValueState &&
              <span className="absolute-center text-nowrap text-md text-white">진행 중인 채팅이 없습니다.</span>
            }
          </>
        )}
        <>
          {isFetching && inputValueState ? (
            Array(8).fill(0).map((_, index) => (
              <ListUnitSkeleton isNotBoxShadow={true} key={index} />
            ))
          ) : (
            inputValueState && userSearchData?.map((singleData) => (
              <>
                {singleData.id !== accountId &&
                  <ChatJoinableMemberItem data={singleData.data} handleFunc={() => {
                    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
                    navigate(`/profile/${singleData.data.authorizationId}`, { state: { direction: "next" } })
                  }} key={singleData.id} />
                }
              </>
            ))
          )
          }
          {!isFetching && inputValueState && userSearchData?.length === 0 &&
            <span className="absolute-center text-nowrap text-md text-white">검색어와 일치하는 유저가 없습니다.</span>
          }
        </>
      </div>
    </ScrollRefreshContainer>

  )
}

export default ChatPage