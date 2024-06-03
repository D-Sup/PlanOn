import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import ImageFrame from "./ImageFrame";

import getAccountId from "@/utils/getAccountId";

import formatDate from "@/utils/formatDate";
import { db } from "@/firebase/config";

import { MessagesType } from "@/types/messages.type";
import { Timestamp } from "firebase/firestore";

// { permission }: { permission: boolean }
const ChatMessageBox = ({ chatRoomId, data, previousCreatedAt, nextCreatedAt }: { chatRoomId: string, data: MessagesType, previousCreatedAt: Timestamp, nextCreatedAt: Timestamp | Date }) => {
  const messageRef = useRef<HTMLLIElement | null>(null); // 메시지 DOM 요소를 참조하기 위한 ref
  const { id, userId, text, photoURL, isRead, createdAt, isLocal } = data

  const { updateFieldObject } = useFirestoreUpdate("users")

  const navigate = useNavigate()

  const accountId = getAccountId()

  const isEqual = formatDate(createdAt, 8) !== formatDate(nextCreatedAt, 8)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !data.isRead && accountId !== userId) {
            db.collection(`chats/messages/message-${chatRoomId}`).doc(id).update({
              isRead: true,
            });
          }
        });
        if (isRead === false && userId !== accountId) {
          updateFieldObject(
            accountId,
            "chats",
            { id: chatRoomId },
            {
              unreadLength: 0,
            }
          )
        }
      },
      {
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (messageRef.current) {
      observer.observe(messageRef.current);
    }

    return () => {
      if (messageRef.current) {
        observer.unobserve(messageRef.current);
      }
    };
  }, [data]);

  return (
    <li className="flex flex-col" ref={messageRef}>
      {isLocal &&
        <p className="m-auto my-[30px] px-[20px] py-[10px] rounded-[5px] rounded-[5px] bg-input text-sm text-white text-center">상대방이 대화에서 나갔습니다.</p>
      }

      {formatDate(createdAt, 3) !== formatDate(previousCreatedAt, 3) &&
        <div className="my-[30px] w-full h-[1px] flex gap-[15px] items-center">
          <div className="w-full h-[1px] bg-gray-old"></div>
          <span className="shrink-0 text-xsm text-white">{formatDate(createdAt, 1)}</span>
          <div className="w-full h-[1px] bg-gray-old"></div>
        </div>
      }
      {userId === accountId ? (
        text ? (
          <div
            className="mb-[10px] mr-[10px] max-w-[80%] ml-auto flex items-end gap-[10px]"
          >
            {!isRead && <span className="text-xsm text-highlight">1</span>}
            {isEqual && <span className="text-nowrap text-xsm text-white">{formatDate(createdAt, 7)}</span>}
            {text.includes("http")
              ? <a href={text} className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-br-none bg-white text-sm text-blue-500 underline underline-offset-1" target="_blank">{text}</a>
              : <p className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-br-none bg-white text-sm text-black">{text}</p>
            }
          </div>
        ) : (
          photoURL &&
          <div className={`${isEqual ? "mb-[20px]" : "mb-[5px]"} ml-auto leading-none flex items-end gap-[10px]`}>
            {!isRead && <span className="text-xsm text-highlight">1</span>}
            {isEqual && <span className={"text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
            <ul className={`grid-cols-${photoURL.length <= 3 ? (photoURL.length % 3) === 0 ? 3 : (photoURL.length % 3) === 2 ? 2 : 1 : 3} w-[250px] grid gap-1 rounded-[100px]`}>
              {photoURL.map((url) => (
                <li className="relative w-full aspect-square bg-background rounded-[10px] overflow-hidden"
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate("/photo", { state: { direction: "up", photo: url } })
                  }}
                >
                  <ImageFrame src={url} alt={`photo-${url}`} className="w-full aspect-square object-cover" />
                </li>
              ))}
            </ul >
          </div>
        )
      ) : (
        text ? (
          <div
            className="mb-[10px] ml-[10px] max-w-[80%] flex items-end gap-[10px]"
          >
            {text.includes("http")
              ? <a href={text} className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-bl-none bg-input text-sm text-blue-500 underline underline-offset-1" target="_blank">{text}</a>
              : <p className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-bl-none bg-input text-sm text-white">{text}</p>
            }
            {isEqual && <span className={"text-nowrap text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
            {!isRead && <span className="text-xsm text-highlight">1</span>}
          </div>
        ) : (
          photoURL &&
          <div className={`${isEqual ? "mb-[20px]" : "mb-[5px]"} leading-none flex items-end gap-[10px]`}>
            <ul className={`grid-cols-${photoURL.length <= 3 ? (photoURL.length % 3) === 0 ? 3 : (photoURL.length % 3) === 2 ? 2 : 1 : 3} w-[250px] grid gap-1 rounded-[100px]`}>
              {photoURL.map((url) => (
                <li className="relative w-full aspect-square bg-background rounded-[10px] overflow-hidden"
                  onClick={() => {
                    window.scrollTo(0, 0)
                    navigate("/photo", { state: { direction: "up", photo: url } })
                  }}
                >
                  <ImageFrame src={url} alt={`photo-${url}`} className="w-full aspect-square object-cover" />
                </li>
              ))}
            </ul >
            {isEqual && <span className={"text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
            {!isRead && <span className="text-xsm text-highlight">1</span>}
          </div>
        )
      )}
    </li>

  )
}

export default ChatMessageBox