import { useRef, useState, useEffect, useContext } from "react";
import { UserContext } from "../organisms/UserInfoProvider";
import { useLocation, useNavigate } from "react-router-dom";

import { useRecoilValue, useSetRecoilState } from "recoil";
import { modalStack, routeDirectionValue } from "@/store";
import useModalStack from "@/hooks/useModalStack";
import useFirestoreCreate from "@/hooks/useFirestoreCreate";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import usePhotoUpload from "@/hooks/usePhotoUpload";
import useScrollTop from "@/hooks/useScrollTop";
import useScrollBottom from "@/hooks/useScrollBottom";

import extractMetaTagService from "@/services/extractMetaTagService";
import notificationService from "@/services/notificationService";

import ChatActionOverview from "../organisms/ChatActionOverview";
import InteractiveInput from "../organisms/InteractiveInput"
import ChatRoomHeader from "../organisms/ChatRoomHeader";
import FixedTrigger from "../mocules/FixedTrigger";
import ChatMessageBox from "../atoms/ChatMessageBox"

import { produce } from "immer"
import { db } from "@/firebase/config";
import { DocumentData } from "firebase/firestore";
import getAccountId from "@/utils/getAccountId";
import { v4 as uuidv4 } from "uuid";

import { MessagesType } from "@/types/messages.type";
import { PostFormValueType } from "@/store";
import { postFormValueDefault } from "@/store";

const ChatRoomPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const navigate = useNavigate()
  const location = useLocation()
  const { id, userInfo, unreadLength, isFirstChat, docs: previousDocs, lastVisible: previousLastVisible, isDataEnd: previousIsDataEnd } = location.state || {}

  const { data: myInfo } = useContext(UserContext);

  const modalStackState = useRecoilValue(modalStack);

  const { isOpen } = modalStackState[modalStackState.length - 1];

  const [firstMount, setFirstMount] = useState<boolean>(previousDocs ? false : true);
  const [inputValue, setInputValue] = useState<string>("");
  const [docs, setDocs] = useState<MessagesType[]>(previousDocs || [])
  const [scrollPosition, setScrollPosition] = useState<number>(0)
  const [photoState, setPhotoState] = useState<PostFormValueType>(postFormValueDefault)
  const [lastVisible, setLastVisible] = useState<null | DocumentData>(previousLastVisible || null);
  const [isDataEnd, setIsDataEnd] = useState<boolean>(previousIsDataEnd || false);

  const { createFieldObject } = useFirestoreCreate("users")
  const { updateFieldObject } = useFirestoreUpdate("users")

  const queryRef = useRef(null);

  const { photoUpload } = usePhotoUpload()

  const { openModal, closeModal } = useModalStack()

  const isTop = useScrollTop()
  const isBottom = useScrollBottom()

  const accountId = getAccountId()

  const messagesRef = db.collection(`chats/messages/message-${id}`)

  const removeDuplicates = (docs: MessagesType[]) => {
    return docs.reduce((acc, current) => {
      const result = acc.find(item => item.id === current.id);
      if (!result) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);
  };

  useEffect(() => {
    if (!queryRef.current?.isEqual(messagesRef)) {
      queryRef.current = messagesRef.orderBy("createdAt", "desc").limit(firstMount ? unreadLength <= 20 ? 20 : unreadLength : 1);
    }
  }, [messagesRef]);

  useEffect(() => {
    if (!queryRef.current) {
      return;
    }

    const unsubscribe = queryRef.current.onSnapshot(querySnapshot => {
      const data = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      })) as MessagesType[];

      const isRead = data[0].isRead
      if (isRead === true) {
        setDocs(prevDocs => (
          prevDocs.map(doc => ({
            ...doc,
            isRead: true
          }))
        ));
      }

      setDocs(prevDocs => {
        const newDocs = [...prevDocs, ...data];
        return removeDuplicates(newDocs);
      });
      firstMount && setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1])
      setTimeout(() => setFirstMount(false), 500)
    });

    return () => unsubscribe();
  }, [queryRef.current]);


  const loadMoreMessages = async () => {

    const query = messagesRef.orderBy("createdAt", "desc").startAfter(lastVisible).limit(20);

    const documentSnapshots = await query.get();
    const newMessages = documentSnapshots.docs.map(doc => ({
      ...doc.data(),
      id: doc.id,
    })) as MessagesType[];

    if (newMessages.length > 0) {
      setDocs(prevDocs => {
        const newDocs = [...newMessages, ...prevDocs];
        return removeDuplicates(newDocs);
      })
      const lastDocs = documentSnapshots.docs[documentSnapshots.docs.length - 1]
      setLastVisible(lastDocs);
      setScrollPosition(document.body.scrollHeight)
      setFirstMount(false)
    } else {
      setIsDataEnd(true)
    }
  };

  useEffect(() => {
    if (scrollPosition !== 0) {
      const newScrollHeight = document.body.scrollHeight;

      window.scrollTo({
        top: newScrollHeight - scrollPosition,
        behavior: "auto"
      });

      setScrollPosition(0);
    }
  }, [scrollPosition]);

  useEffect(() => {
    if (!firstMount && isTop && !isOpen && !isDataEnd) {
      loadMoreMessages();
    }
  }, [isTop]);

  useEffect(() => {
    if (isBottom)
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
  }, [docs]);

  useEffect(() => {
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    }, 500)
  }, []);

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
      await messagesRef.add({
        id: uuidv4(),
        userId: accountId,
        photoURL: uploadedPhotos,
        isRead: false,
        createdAt: now,
      });
      notificationService(
        userInfo.deviceToken,
        `chat/${id}`,
        "회원님에게 메시지를 보냈습니다.",
        `${myInfo?.data.accountName}: (사진)`,
        `${myInfo?.data.accountImage}`
      )
      setInputValue("");
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    } else {
      await messagesRef.add({
        id: uuidv4(),
        userId: accountId,
        text: inputValue,
        isRead: false,
        createdAt: now,
      });
      notificationService(
        userInfo.deviceToken,
        `chat/${id}`,
        "회원님에게 메시지를 보냈습니다.",
        `${myInfo?.data.accountName}: ${inputValue}`,
        `${myInfo?.data.accountImage}`
      )
      setInputValue("");
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth"
      })
    }

    if (inputValue.includes("http")) {
      try {
        const result = await extractMetaTagService(inputValue);
        if (result) {
          const { title, image, description } = result;
          await messagesRef.add({
            id: uuidv4(),
            userId: accountId,
            link: {
              url: inputValue,
              title,
              image,
              description
            },
            isRead: false,
            createdAt: new Date(now.getTime() + 1000),
          });
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth"
          });
        }
      } catch (error) {
        await messagesRef.add({
          id: uuidv4(),
          userId: accountId,
          link: {
            url: inputValue
          },
          isRead: false,
          createdAt: new Date(now.getTime() + 1000),
        });
      }
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
      if (uploadedPhotos) {
        closeModal()
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
      if (uploadedPhotos) {
        closeModal()
      }
    }
  }

  const handleNavigate = (type: "gallery" | "link") => {
    setRouteDirectionValueState(prev =>
      produce(prev, draft => {
        draft.previousPageUrl.push(location.pathname);
        draft.data.push({ id, userInfo, unreadLength, isFirstChat, docs, lastVisible, isDataEnd });
      })
    );
    navigate(`/chatroom/${type}`, { state: { direction: "next", id } })
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

          const sortedMessages = docs?.slice().sort((first, second) =>
            first?.createdAt?.seconds <= second?.createdAt?.seconds ? -1 : 1
          );
          return sortedMessages?.map((message, index) => (
            <ChatMessageBox
              chatRoomId={id}
              key={index}
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