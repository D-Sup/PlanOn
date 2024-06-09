import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "../organisms/UserInfoProvider";
import { useLocation, useNavigate } from "react-router-dom";

import useModalStack from "@/hooks/useModalStack";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import usePhotoUpload from "@/hooks/usePhotoUpload";

import ChatActionOverview from "../organisms/ChatActionOverview";
import InteractiveInput from "../organisms/InteractiveInput"
import Header from "../organisms/Header";
import FixedTrigger from "../mocules/FixedTrigger";
import ChatMessageBox from "../atoms/ChatMessageBox"

import { db } from "@/firebase/config";
import getAccountId from "@/utils/getAccountId";

import { MessagesType } from "@/types/messages.type";
import { PostFormValueType } from "@/store";
import { postFormValueDefault } from "@/store";

const ChatRoomPage = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const { id, userInfo, isFirstChat } = location.state || {}

  const { data: myInfo } = useContext(UserContext);

  const [inputValue, setInputValue] = useState<string>("");
  const [docs, setDocs] = useState<MessagesType[]>([])
  const [firstMount, setFirstMount] = useState<boolean>(true)
  const [photoState, setPhotoState] = useState<PostFormValueType>(postFormValueDefault)
  const { createFieldObject } = useFirestoreCreate("users")
  const { updateFieldObject } = useFirestoreUpdate("users")


  const { photoUpload } = usePhotoUpload()

  const { openModal, closeModal } = useModalStack()

  const accountId = getAccountId()

  const { ChatRoomHeader } = Header()

  const messagesRef = db.collection(`chats/messages/message-${id}`)

  const queryRef = useRef(messagesRef.limit(1000))

  useEffect(() => {
    if (!queryRef?.current?.isEqual(messagesRef)) {
      queryRef.current = messagesRef
    }
  })

  useEffect(() => {
    if (!queryRef.current) {
      return
    }
    const unsubscribe = queryRef.current.onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as MessagesType[]
      setDocs(data)
    })

    return unsubscribe
  }, [queryRef])

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
      setFirstMount(false)
    }, 350)
  }, []);


  useEffect(() => {
    if (!firstMount) {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    }
  }, [docs]);


  const handleSubmit = async () => {
    let uploadedPhotos
    if (inputValue || photoState.photos.checked.length !== 0) {
      if (photoState.photos.checked.length !== 0) {
        openModal("Loading", { isLoader: true, message: "전송 중 ..." });
        uploadedPhotos = await photoUpload("chats", photoState.photos.checked.map(index => photoState.photos.file[index]))
        setPhotoState(postFormValueDefault)
      }
    }
    const now = new Date()
    if (uploadedPhotos) {
      messagesRef.add({
        userId: accountId,
        photoURL: uploadedPhotos,
        isRead: false,
        createdAt: now,
      });
    } else {
      messagesRef.add({
        userId: accountId,
        text: inputValue,
        isRead: false,
        createdAt: now,
      });
    }
    if (isFirstChat) {
      await Promise.all([
        createFieldObject(
          accountId,
          "chats",
          {
            id,
            userId: userInfo.authorizationId,
            lastReceive: uploadedPhotos ? "사진" : inputValue,
            lastMessageCreatedAt: now,
            unreadLength: 0,
            isLocal: false,
          }
        ),
        createFieldObject(
          userInfo.authorizationId,
          "chats",
          {
            id,
            userId: accountId,
            userName: myInfo?.data.accountName,
            lastReceive: uploadedPhotos ? "사진" : inputValue,
            lastMessageCreatedAt: now,
            unreadLength: docs.filter(message => !message.isRead).length + 1,
            isLocal: false,
          }
        )
      ])
      setInputValue("");
      if (uploadedPhotos) {
        closeModal()
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          })
        }, 500)
      }
      const { ...newState } = location.state;
      navigate("/chatroom", { state: { ...newState, isFirstChat: false }, replace: true });
    } else {
      await Promise.all([
        updateFieldObject(
          accountId,
          "chats",
          { id },
          {
            lastReceive: uploadedPhotos ? "사진" : inputValue,
            lastMessageCreatedAt: now,
          }
        ),
        updateFieldObject(
          userInfo.authorizationId,
          "chats",
          { id },
          {
            userName: myInfo?.data.accountName,
            lastReceive: uploadedPhotos ? "사진" : inputValue,
            lastMessageCreatedAt: now,
            unreadLength: docs.filter(message => !message.isRead).length + 1,
          }
        )
      ])
      setInputValue("");
      if (uploadedPhotos) {
        closeModal()
        setTimeout(() => {
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          })
        }, 500)
      }
    }
  }

  const handleNavigate = () => {
    navigate("/chatroom/gallery", { state: { direction: "next", data: docs } })
  }


  return (
    <>
      <FixedTrigger className="top-0" height={50} enableAnimation={false}>
        <div style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
          <ChatRoomHeader
            data={userInfo}
            handleFunc={() => {
              openModal(ChatActionOverview, { isHeightAuto: true, handleFunc: handleNavigate, id })
            }} />
        </div>
      </FixedTrigger>
      <div className="mt-[20px]">
        {(() => {
          const sortedMessages = docs?.sort((first, second) =>
            first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
          );
          return sortedMessages.map((message, index) => (
            <ChatMessageBox
              chatRoomId={id}
              key={message.id}
              data={message}
              previousCreatedAt={
                sortedMessages[
                  index === 0
                    ? index
                    : index - 1
                ].createdAt}
              nextCreatedAt={
                index === sortedMessages.length - 1
                  ? new Date(0)
                  : sortedMessages[index + 1].createdAt
              }
            />
          ));
        })()}
      </div>
      <InteractiveInput inputValue={inputValue} setInputValue={setInputValue} photoState={photoState} setPhotoState={setPhotoState} handleFunc={handleSubmit} isCommentOnly={false} />
    </>
  );
}

export default ChatRoomPage