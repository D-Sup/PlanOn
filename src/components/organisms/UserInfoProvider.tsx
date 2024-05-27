import { useRef, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack"
import { useRecoilValue, useSetRecoilState } from "recoil";
import { isUnLockValue, routeDirectionValue } from "@/store";

import UserService from "@/services/userService";

import NotificationPermission from "@/utils/notificationPermission";
import { db } from "@/firebase/config";
import getAccountId from "@/utils/getAccountId";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType, ChatsType, NotificationHistoryType } from "@/types/users.type";

interface UserContextType {
  data: ReadDocumentType<UsersType> | undefined,
  isLoading: boolean,
  isFetching: boolean,
  refetch: () => void
}

const UserContext = createContext<UserContextType>({
  data: undefined,
  isLoading: true,
  isFetching: true,
  refetch: () => { }
});

const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const isUnLockValueState = useRecoilValue(isUnLockValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const { ReadUser } = UserService();
  const { data, isLoading, isFetching, refetch } = ReadUser();

  const navigate = useNavigate()
  const { openModal } = useModalStack()
  const { requestPermission } = NotificationPermission(true)

  const accountId = getAccountId()

  const messagesRef = db.collection("users").doc(accountId)

  const queryRef = useRef(messagesRef)

  useEffect(() => {
    if (accountId) {
      refetch()
    }
  }, [accountId])

  useEffect(() => {
    if (!queryRef?.current?.isEqual(messagesRef)) {
      queryRef.current = messagesRef
    }
  }, [messagesRef])

  useEffect(() => {
    if (!queryRef.current) {
      return
    }
    const unsubscribe = queryRef.current.onSnapshot(docSnapshot => {
      if (docSnapshot.exists) {
        const data = { ...docSnapshot.data() }
        data.chats.forEach((chat: ChatsType) => {
          if (new Date().getTime() - chat.lastMessageCreatedAt.toDate().getTime() < 1000 && chat.unreadLength > 0) {
            openModal("Toast", { type: "message", title: chat.userName, message: chat.lastReceive })
          }
        })
        data.notificationHistory.forEach((history: NotificationHistoryType) => {
          if (new Date().getTime() - history.createdAt.toDate().getTime() < 2000) {
            openModal("Toast", { type: "alert", message: history.title })
          }
        })
        refetch()
      }
    })

    return () => unsubscribe();
  }, [queryRef.current])

  useEffect(() => {
    if (data) {
      if (data.data.secureNumber !== undefined && data?.data.secureNumber !== "") {
        if (!isUnLockValueState) {
          setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
          navigate("/security", { state: { direction: "up" } })
        }
      }

      if (data.data.isDarkMode) {
        document.querySelector("html").setAttribute("data-theme", "dark");
      } else {
        document.querySelector("html").setAttribute("data-theme", "light");
      }

      if (data.data.isFirstEntry) {
        setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
        setTimeout(() => {
          navigate("/tutorial", { state: { direction: "up" } })
        }, 1000)
      }

      if (data.data.deviceToken) {
        setTimeout(() => {
          requestPermission()
        }, 1000)
      }
    }
  }, [data])

  const fontData = [
    { fontFamily: "var(--Pretendard-Regular)", fontName: "프리텐다드체" },
    { fontFamily: "var(--Ownglyph-meetme-Rg)", fontName: "밑미체" },
    { fontFamily: "var(--omyu-pretty)", fontName: "오뮤 다예쁨체" },
    { fontFamily: "var(--GangwonEdu-OTFBoldA)", fontName: "강원교육모두체" },
    { fontFamily: "var(--ONE-Mobile-POP)", fontName: "모바일POP체" },
    { fontFamily: "var(--HSSanTokki20-Regular)", fontName: "산토끼체" },
  ];


  return (
    <UserContext.Provider value={{ data, isLoading, isFetching, refetch }}>
      <div
        id="wrapper"
        className="flex flex-col bg-background w-screen h-dvh transition duration-300"
        style={{ fontFamily: fontData[fontData.findIndex((singleData) => singleData.fontName === data?.data.selectedFont)]?.fontFamily }}
      >
        {children}
      </div>
    </UserContext.Provider>
  );
};

export { UserInfoProvider, UserContext };
