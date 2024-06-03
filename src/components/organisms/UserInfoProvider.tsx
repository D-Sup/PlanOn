import { useRef, useEffect, createContext } from "react";
import useModalStack from "@/hooks/useModalStack"

import UserService from "@/services/userService";

import { db } from "@/firebase/config";
import getAccountId from "@/utils/getAccountId";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType, ChatsType } from "@/types/users.type";

interface UserContextType {
  data: ReadDocumentType<UsersType> | undefined;
  isLoading: boolean;
  refetch: () => void;
}

const UserContext = createContext<UserContextType>({
  data: undefined,
  isLoading: true,
  refetch: () => { }
});

const UserInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const { ReadUser } = UserService();
  const { data, isLoading, refetch } = ReadUser();

  const { openModal } = useModalStack()
  const accountId = getAccountId()

  const messagesRef = db.collection("users").doc(accountId)

  const queryRef = useRef(messagesRef)

  useEffect(() => {
    if (!queryRef?.current?.isEqual(messagesRef)) {
      queryRef.current = messagesRef
    }
  })

  useEffect(() => {
    if (accountId) {
      refetch()
    }
  }, [])

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
        refetch()
      }
    })

    return unsubscribe
  }, [queryRef])


  return (
    <UserContext.Provider value={{ data, isLoading, refetch }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserInfoProvider, UserContext };
