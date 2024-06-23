import { useState, useContext } from "react";
import { UserContext } from "../organisms/UserInfoProvider"
import { paginationValue } from "@/store"
import { useRecoilState } from "recoil"

import useModalStack from "@/hooks/useModalStack";

import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";

import ToggleTagList from "./ToggleTagList";

import IconAll from "../../assets/images/icon-all.svg?react";
import IconUser from "../../assets/images/icon-user.svg?react";
import IconHeart from "../../assets/images/icon-fill-heart.svg?react";
import IconHash from "../../assets/images/icon-hash.svg?react";

import { PostFormValueType } from "@/store";

interface PostCategoryProps {
  closeModal: () => void,
  props: {
    postFormState: Pick<PostFormValueType, "hashtags">,
    setPostFormState: React.Dispatch<React.SetStateAction<Pick<PostFormValueType, "hashtags">>>
  }
}

const PostCategory = ({ closeModal, props }: PostCategoryProps) => {
  const { data: userData } = useContext(UserContext);

  const { updateField } = useFirestoreUpdate("users")

  const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue);
  const postFormState = props.postFormState
  const setPostFormState = props.setPostFormState

  const [selected, setSelected] = useState<"all-posts" | "following-posts" | "like-posts" | "tag-posts" | "">(paginationValueState.currentCategory);

  const { openModal } = useModalStack()

  const resetPosts = (currentCategory: "all-posts" | "following-posts" | "like-posts" | "tag-posts") => {
    setPaginationValueState({
      currentCategory,
      posts: {
        lastVisible: null,
        isDataEnd: false
      },
    })
    updateField(userData.id, { selectedFilter: currentCategory })
  }

  return (
    <>
      <span className="pb-[10px] text-white text-lg text-center" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>필터</span>

      <div className="grid grid-cols-2 gap-[2px] p-[20px]">
        <button className={`flex-center flex-col gap-[10px] w-full min-h-[130px] rounded-tl-lg bg-input text-md ${selected === "all-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("all-posts")
          setTimeout(() => resetPosts("all-posts"), 400)
        }}
        >
          <IconAll width={15} height={15} fill={`var(--${selected === "all-posts" ? "black" : "white"})`} />
          모든 게시물
        </button>
        <button className={`flex-center flex-col gap-[10px] w-full min-h-[130px] rounded-tr-lg bg-input text-md ${selected === "following-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("following-posts")
          setTimeout(() => resetPosts("following-posts"), 400)
        }}
        >
          <IconUser width={15} height={15} fill={`var(--${selected === "following-posts" ? "black" : "white"})`} />
          팔로잉
        </button>
        <button className={`flex-center flex-col gap-[10px] w-full min-h-[130px] rounded-bl-lg bg-input text-md ${selected === "like-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("like-posts")
          setTimeout(() => resetPosts("like-posts"), 400)
        }}
        >
          <IconHeart width={15} height={15} fill={`var(--${selected === "like-posts" ? "black" : "white"})`} />
          좋아요
        </button>
        <button className={`flex-center flex-col gap-[10px] w-full min-h-[130px] rounded-br-lg bg-input text-md ${selected === "tag-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setTimeout(() => {
            openModal(ToggleTagList, {
              type: "hashtagSearch",
              postFormState,
              setPostFormState,
              handleFunc: (hashtags: Pick<PostFormValueType, "hashtags">) => {
                resetPosts("tag-posts")
                updateField(userData.id, { filterTags: hashtags.hashtags.map(tag => tag.id) })
              }
            })
          }, 500)
        }}
        >
          <IconHash width={15} height={15} fill={`var(--${selected === "tag-posts" ? "black" : "white"})`} />
          해시태그
        </button>
      </div>
    </>
  )
}

export default PostCategory