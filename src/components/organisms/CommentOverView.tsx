import { useEffect, useState } from "react"
import useModalStack from "@/hooks/useModalStack";

import CommentService from "@/services/commentService";

import Loader from "./Loader";
import CommentListUnit from "./CommentListUnit";
import InteractiveInput from "./InteractiveInput";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../shadcnUIKit/select";

import LikeService from "@/services/likeService";

import getAccountId from "@/utils/getAccountId";
import { v4 as uuidv4 } from "uuid";

import { CommentsType } from "@/types/posts.type";

interface CommentOverViewProps {
  props: { id: string, comments: CommentsType[] },
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void
}

const CommentOverView = ({ props, handleScroll }: CommentOverViewProps) => {

  const [inputValue, setInputValue] = useState<string>("");
  const [sortOption, setSortOption] = useState<"desc" | "asc">("desc");

  const accountId = getAccountId()

  const { id, comments } = props

  const { openModal, closeModalDirect } = useModalStack()

  const { UpdateComment, ReadComment } = CommentService()
  const { data, isLoading, refetch } = ReadComment(comments)
  const { mutate: mutateLike } = LikeService();
  const { mutate: mutateUpdateComment } = UpdateComment()

  const filteredData = data?.slice().sort((first, second) => {
    if ("seconds" in first.createdAt && "seconds" in second.createdAt) {
      if (sortOption === "desc") {
        return first.createdAt.seconds <= second.createdAt.seconds ? 1 : -1;
      } else {
        return first.createdAt.seconds >= second.createdAt.seconds ? 1 : -1;
      }
    }
    return 0;
  });

  useEffect(() => {
    if (comments.length !== data?.length) {
      refetch()
    }
  }, [props])

  if (isLoading) return (
    <div className="absolute-center w-[100px]">
      <Loader />
    </div>
  )

  return (
    <>
      <div className="pb-[10px] text-center" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <span className="text-md text-white">댓글</span>
      </div>

      <div className="absolute top-[15px] right-[3px] h-[70px] ">
        <Select
          onValueChange={(newValue: "desc" | "asc") => {
            setSortOption(newValue)
          }}
          value={sortOption}
        >
          <SelectTrigger className="text-sm bg-background">
          </SelectTrigger>
          <SelectContent className="text-sm">
            <SelectItem key={"desc"} value={"desc"}>최신순</SelectItem>
            <SelectItem key={"asc"} value={"asc"}>오래된순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-[20px] pt-[15px] px-[15px] overflow-y-scroll" onScroll={handleScroll}>
        {
          filteredData.map((comment) => (
            <CommentListUnit key={comment.id} data={comment} handleFunc={[
              () => {
                openModal("Alert", "댓글을 삭제하시겠습니까?", ["취소", "확인"],
                  [null, () => {
                    closeModalDirect()
                    mutateUpdateComment({
                      type: "delete",
                      id,
                      comment
                    })
                  }
                  ])
              },
              () => {
                mutateLike({
                  target: "comment", type: "update", id, comment: {
                    id: comment.id,
                    likedUsers: comment.likedUsers.includes(accountId)
                      ? comment.likedUsers.filter((id: string) => id !== accountId)
                      : [...comment.likedUsers, accountId],
                  }
                })
              }
            ]
            }
            />
          ))
        }
        {data?.length === 0 &&
          <span className="absolute-center text-nowrap text-md text-white">댓글이 없습니다.</span>
        }
      </div>
      <InteractiveInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleFunc={() => {
          mutateUpdateComment({
            type: "create",
            id,
            comment: {
              id: uuidv4(),
              content: inputValue,
              createdAt: new Date(),
              likedUsers: [],
              userId: accountId
            }
          })
          setInputValue("")
        }} />
    </>
  )
}

export default CommentOverView