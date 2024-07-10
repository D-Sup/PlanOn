import { useEffect, useRef } from "react";
import useModalStack from "@/hooks/useModalStack";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";
import ImageFrame from "../atoms/ImageFrame";

import getAccountId from "@/utils/getAccountId";

import formatDate from "@/utils/formatDate";
import { db } from "@/firebase/config";

import { MessagesType } from "@/types/messages.type";
import { Timestamp } from "firebase/firestore";

const ChatMessageBox = ({ chatRoomId, data, previousCreatedAt, nextCreatedAt }: { chatRoomId: string, data: MessagesType, previousCreatedAt: Timestamp, nextCreatedAt: Timestamp | Date }) => {
  const messageRef = useRef<HTMLLIElement | null>(null);
  const { id, userId, text, photoURL, link, isRead, createdAt, isLocal } = data

  // const [isRead, setIsRead] = useState<boolean>()

  const { openModal } = useModalStack()

  const { updateFieldObject } = useFirestoreUpdate("users")

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
        <>
          {text &&
            <div
              className="mb-[10px] mr-[10px] max-w-[80%] ml-auto flex items-end gap-[10px]"
            >
              {!isRead && <span className="text-xsm text-highlight">1</span>}
              {isEqual && <span className="text-nowrap text-xsm text-white">{formatDate(createdAt, 7)}</span>}
              {text.includes("http")
                ? <a href={text} className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-br-none bg-white text-sm text-blue-500 underline underline-offset-1 break-all" target="_blank">{text}</a>
                : <p className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-br-none bg-white text-sm text-black">{text}</p>
              }
            </div>
          }

          {photoURL &&
            <div className="mb-[20px] mr-[10px] ml-auto leading-none flex items-end gap-[10px]">
              {!isRead && <span className="text-xsm text-highlight">1</span>}
              {isEqual && <span className={"text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
              <ul className={`grid-cols-${photoURL.length <= 3 ? (photoURL.length % 3) === 0 ? 3 : (photoURL.length % 3) === 2 ? 2 : 1 : 3} w-[250px] grid gap-1 rounded-[100px]`}>
                {photoURL.map((url) => (
                  <li className="relative w-full aspect-square bg-background rounded-[10px] overflow-hidden"
                    onClick={() => {
                      openModal("PhotoView", { photo: url })
                    }}
                  >
                    <ImageFrame src={url} alt={`photo-${url}`} />
                  </li>
                ))}
              </ul >
            </div>
          }

          {link && link.title &&
            <div className="mb-[10px] flex items-end gap-[10px]">
              {isEqual && <span className={"ml-auto inline-block text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
              <a
                href={link.url}
                className={`${!isEqual && "ml-auto"} relative mr-[10px] w-1/2 bg-background`}
                target="_blank"
              >
                {link.image &&
                  <div className="h-[120px] rounded-t-md overflow-hidden">
                    <ImageFrame src={link.image} alt={link.url} />
                  </div>
                }
                <div className={`p-[10px] bg-input flex flex-col justify-center text-white ${link.image ? "rounded-b-md" : "rounded-md"}`}>
                  <strong className="text-md break-all">{link.title}</strong>
                  <span className="text-xsm text-blue-500 break-all reduce-words">{link.url}</span>
                  <span className="text-xsm text-gray-old break-all">{link.description}</span>
                </div>
              </a>
            </div>
          }
        </>
      ) : (
        <>
          {text &&
            <div
              className="mb-[10px] ml-[10px] max-w-[80%] flex items-end gap-[10px]"
            >
              {text.includes("http")
                ? <a href={text} className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-bl-none bg-input text-sm text-blue-500 underline underline-offset-1 break-all" target="_blank">{text}</a>
                : <p className="inline-block px-[10px] py-[8px] rounded-[5px] rounded-bl-none bg-input text-sm text-white">{text}</p>
              }
              {isEqual && <span className={"text-nowrap text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
              {!isRead && <span className="text-xsm text-highlight">1</span>}
            </div>
          }

          {photoURL &&
            <div className="mb-[20px] ml-[10px] leading-none flex items-end gap-[10px]">
              <ul className={`grid-cols-${photoURL.length <= 3 ? (photoURL.length % 3) === 0 ? 3 : (photoURL.length % 3) === 2 ? 2 : 1 : 3} w-[250px] grid gap-1 rounded-[100px]`}>
                {photoURL.map((url) => (
                  <li className="relative w-full aspect-square bg-background rounded-[10px] overflow-hidden"
                    onClick={() => {
                      openModal("PhotoView", { photo: url })
                    }}
                  >
                    <ImageFrame src={url} alt={`photo-${url}`} />
                  </li>
                ))}
              </ul >
              {isEqual && <span className={"text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
              {!isRead && <span className="text-xsm text-highlight">1</span>}
            </div>
          }

          {link && link.title &&
            <div className="mb-[10px] flex items-end gap-[10px]">
              <a
                href={link.url}
                className={`${!isEqual && "mr-auto"} ml-[10px] w-1/2 aspect-square relative bg-background`}
                target="_blank"
              >
                {link.image &&
                  <div className="h-[120px] rounded-t-md overflow-hidden">
                    <ImageFrame src={link.image} alt={link.url} />
                  </div>
                }
                <div className={`p-[10px] bg-input flex flex-col justify-center text-white ${link.image ? "rounded-b-md" : "rounded-md"}`}>
                  <strong className="text-md break-all">{link.title}</strong>
                  <span className="text-xsm text-blue-500 break-all reduce-words">{link.url}</span>
                  <span className="text-xsm text-gray-old break-all">{link.description}</span>
                </div>
              </a>
              {isEqual && <span className={"mr-auto inline-block text-xsm text-white"}>{formatDate(createdAt, 7)}</span>}
            </div>
          }
        </>
      )}
    </li>

  )
}

export default ChatMessageBox