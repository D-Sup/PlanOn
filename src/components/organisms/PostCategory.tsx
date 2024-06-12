import { useState } from "react";
import { paginationValue } from "@/store"
import { useRecoilState } from "recoil"

import IconAll from "../../assets/images/icon-all.svg?react";
import IconUser from "../../assets/images/icon-user.svg?react";
import IconHeart from "../../assets/images/icon-fill-heart.svg?react";

interface PostCategoryProps {
  closeModal: () => void,
}

const PostCategory = ({ closeModal }: PostCategoryProps) => {
  const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue);
  const [selected, setSelected] = useState<"all-posts" | "following-posts" | "like-posts">(paginationValueState.currentCategory);

  const resetPosts = (currentCategory: "all-posts" | "following-posts" | "like-posts") => {
    setPaginationValueState({
      currentCategory,
      allPosts: {
        lastVisible: null,
        isDataEnd: false
      },
      followingPosts: {
        lastVisible: null,
        isDataEnd: false
      },
      likePosts: {
        lastVisible: null,
        isDataEnd: false
      }
    })
  }

  return (
    <>
      <span className="pb-[10px] text-white text-lg text-center" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>필터</span>
      <div className="flex gap-[2px] p-[20px]">

        <button className={`flex-center flex-col gap-[10px] w-full min-h-[100px] rounded-l-lg bg-input text-md ${selected === "all-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("all-posts")
          // setTimeout(() => resetPosts("all-posts"), 400)
          setTimeout(() => setPaginationValueState(Prev => ({ ...Prev, currentCategory: "all-posts" })), 400)
        }}
        >
          <IconAll width={20} height={20} fill={`var(--${selected === "all-posts" ? "black" : "white"})`} />
          모든 게시물
        </button>
        <button className={`flex-center flex-col gap-[10px] w-full min-h-[50px] bg-input text-md ${selected === "following-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("following-posts")
          // setTimeout(() => resetPosts("following-posts"), 400)
          setTimeout(() => setPaginationValueState(Prev => ({ ...Prev, currentCategory: "following-posts" })), 400)
        }}
        >
          <IconUser width={20} height={20} fill={`var(--${selected === "following-posts" ? "black" : "white"})`} />
          팔로잉
        </button>
        <button className={`flex-center flex-col gap-[10px] w-full min-h-[50px] rounded-r-lg bg-input text-md ${selected === "like-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("like-posts")
          // setTimeout(() => resetPosts("like-posts"), 400)
          setTimeout(() => setPaginationValueState(Prev => ({ ...Prev, currentCategory: "like-posts" })), 400)
        }}
        >
          <IconHeart width={20} height={20} fill={`var(--${selected === "like-posts" ? "black" : "white"})`} />
          좋아요
        </button>
      </div>
    </>
  )
}

export default PostCategory