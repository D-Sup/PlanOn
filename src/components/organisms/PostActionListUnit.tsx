import { useState } from "react";

import formatDate from "@/utils/formatDate";
import getAccountId from "@/utils/getAccountId";

import IconHeart from "../../assets/images/icon-heart.svg?react";
import IconComment from "../../assets/images/icon-comment.svg?react";

import { PostsType } from "@/types/posts.type";

const PostActionListUnit = ({ data, handleFunc }: { data: PostsType, handleFunc: (() => void)[] }): JSX.Element => {

  const { likedUsers, comments, createdAt } = data
  const accountId = getAccountId()
  const isLike = likedUsers.includes(accountId);

  const heartCount = likedUsers.length;
  const [hearted, setHearted] = useState<boolean>(isLike);

  return (
    <div className="relative pl-[10px] pr-[20px] mt-[10px] flex items-center gap-[20px]">
      <button
        className="flex gap-[10px] items-center justify-center"
        type="button"
        onClick={() => {
          setHearted(Prev => !Prev)
          handleFunc[0]()
        }}
      >
        <IconHeart width={22} height={20} fill={hearted ? "#FB004D" : "var(--gray-heavy)"} stroke={hearted ? "#FB004D" : ""} />
        {isLike ?
          <span className='text-xsm text-white'>{hearted ? heartCount : heartCount - 1}</span> :
          <span className='text-xsm text-white'>{hearted ? heartCount + 1 : heartCount}</span>
        }
      </button>
      <button
        className="flex gap-[10px] items-center justify-center"
        type="button"
        onClick={() => {
          handleFunc[1]()
        }}
      >
        <IconComment width={20} height={20} fill={"var(--gray-heavy)"} />
        <span className='text-xsm text-white'>{comments.length}</span>
      </button>
      <span className="ml-auto text-sm text-gray-old">({formatDate(createdAt, 9)}) {formatDate(createdAt, 1)}</span>
    </div>
  )
}

export default PostActionListUnit;