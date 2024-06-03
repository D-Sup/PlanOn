import { useState } from "react";
import { paginationValue } from "@/store"
import { useRecoilState } from "recoil"

interface PostCategoryProps {
  closeModal: () => void,
}

const PostCategory = ({ closeModal }: PostCategoryProps) => {
  const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue);
  const [selected, setSelected] = useState<"all-posts" | "following-posts">(paginationValueState.currentCategory);

  return (
    <>
      <span className="pb-[10px] text-white text-lg text-center" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>필터</span>
      <div className="flex gap-[10px] p-[20px]">
        <button className={`w-full min-h-[50px] rounded-lg bg-input text-md ${selected === "all-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("all-posts")
          setTimeout(() => setPaginationValueState(Prev => ({ ...Prev, currentCategory: "all-posts" })), 400)
        }}>모든 게시물</button>
        <button className={`w-full min-h-[50px] rounded-lg bg-input text-md ${selected === "following-posts" ? "bg-white text-black" : "bg-input text-white"}`} type="button" onClick={() => {
          closeModal()
          setSelected("following-posts")
          setTimeout(() => setPaginationValueState(Prev => ({ ...Prev, currentCategory: "following-posts" })), 400)
        }}>팔로잉</button>
      </div>
    </>
  )
}

export default PostCategory