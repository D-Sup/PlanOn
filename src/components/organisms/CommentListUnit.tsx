import { useState } from "react";

import ProfileAvatar from "../atoms/ProfileAvatar";

import formatDate from "@/utils/formatDate";
import getAccountId from "@/utils/getAccountId";

import IconHeart from "../../assets/images/icon-heart.svg?react";
import IconDot from "../../assets/images/icon-dot.svg?react";
import IconTrash from "../../assets/images/icon-trash.svg?react";

import { CommentMachinedType } from "@/services/commentService";

const CommentListUnit = ({ data, handleFunc }: { data: CommentMachinedType, handleFunc: (() => void)[] }): JSX.Element => {
  const { userId, userInfo, content, likedUsers, createdAt } = data

  const accountId = getAccountId()

  const isLike = likedUsers.includes(accountId);
  const commentPermission = accountId === userId;

  const heartCount = likedUsers.length;
  const [hearted, setHearted] = useState<boolean>(isLike);
  return (
    <li className="flex w-full h-[37px]" >
      <ProfileAvatar
        className="w-[37px] h-[37px]"
        src={userInfo.accountImage}
        alt="item-image"
      />
      <div className="ml-[10px]">
        <div className="flex items-center gap-[5px]">
          <p className="text-sm text-white inline">{userInfo.accountName}</p>
          <IconDot width={3} height={3} fill={"var(--gray-old)"} />
          {createdAt && <span className="text-xsm text-gray-old">{formatDate(createdAt, 9)}</span>}
          {commentPermission &&
            <button
              className="ml-[2px] flex flex-col items-center justify-center"
              onClick={() => {
                handleFunc[0]()
              }}
            >
              <IconTrash width={12} height={12} fill={"var(--red)"} />
            </button>
          }
        </div>
        <span className="block text-xsm text-white">{content}</span>
      </div>
      <button
        className="ml-auto flex flex-col items-center justify-center"
        onClick={() => {
          setHearted(Prev => !Prev)
          handleFunc[1]()
        }}
      >
        <IconHeart width={15} height={15} fill={hearted ? "#FB004D" : "var(--background)"} stroke={hearted ? "#FB004D" : "var(--gray-old)"} />
        {isLike ?
          <span className="text-xsm text-white">{hearted ? heartCount : heartCount - 1}</span> :
          <span className="text-xsm text-white">{hearted ? heartCount + 1 : heartCount}</span>
        }
      </button>
    </li>
  )
}

export default CommentListUnit;