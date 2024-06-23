import { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";
import useFirestoreRead from "@/hooks/useFirestoreRead";
import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import PostService from "@/services/postService";

import ActionCard from "../mocules/ActionCard";

import getAccountId from "@/utils/getAccountId";

import IconEdit from "../../assets/images/icon-edit.svg?react";
import IconLink from "../../assets/images/icon-link.svg?react";
import IconTrash from "../../assets/images/icon-trash.svg?react";

import { PostMachinedType } from "@/services/postService";

interface PostActionOverviewProps {
  props: { data: PostMachinedType },
}

const PostActionOverview = ({ props }: PostActionOverviewProps) => {

  const data = props.data

  const { id, data: postData } = data

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const formattedAddress = useRef<HTMLInputElement>(null);

  const { readDocumentSingle: readDocumentUsers } = useFirestoreRead("users")
  const { readDocumentSingle: readDocumentHashTags } = useFirestoreRead("hashtags")
  const { openModal, closeModal, closeModalDirect } = useModalStack()

  const navigate = useNavigate()
  const location = useLocation()

  const { DeletePost } = PostService()
  const { mutate, isPending } = DeletePost(id,
    () => {
      closeModal()
      setTimeout(() => {
        if (location.pathname !== "/post") {
          navigate("/post", { state: { direction: "prev" } })
        }
        openModal("Toast", { message: "게시물 삭제를 완료했습니다." });
      }, 800)
    }, () => {
      closeModal()
      setTimeout(() => {
        if (location.pathname !== "/post") {
          navigate("/post", { state: { direction: "prev" } })
        }
        openModal("Toast", { message: "게시물 삭제를 실패했습니다." });
      }, 800)
    })

  if (isPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: false, message: "게시물 삭제 중..." });
    setIsFetching(false)
  }

  const accountId = getAccountId()

  const isMyPost = accountId === postData.authorizationId

  const handleCopyClipBoard = () => {
    if (formattedAddress.current) {
      closeModal()
      setTimeout(() => openModal("Toast", { message: "공유 링크 복사 완료" }), 500)
      formattedAddress.current.select();
      document.execCommand("copy");
    }
  };

  return (
    <div className="flex flex-col gap-[10px] px-[20px] pt-[20px] pb-[30px]">
      <input ref={formattedAddress} className="a11y-hidden" value={`https://plan-on.vercel.app/post/detail/readonly/${id}`} readOnly />
      <ActionCard icon={IconLink} name={"공유"} handleFunc={handleCopyClipBoard} type={"collect"} />
      {isMyPost &&
        <ActionCard icon={IconEdit} name={"수정"}
          handleFunc={async () => {
            closeModal()
            const [hashtags, usertags] = await Promise.all([
              Promise.all(postData.hashtags.map((hashtag) => readDocumentHashTags(hashtag))),
              Promise.all(postData.usertags.map((usertag) => readDocumentUsers(usertag)))
            ])
            if (hashtags && usertags) {
              setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
              navigate("/post/update", {
                state: {
                  direction: "next",
                  id: id,
                  data: {
                    scheduleId: postData.scheduleId,
                    private: postData.private,
                    hashtags,
                    usertags,
                    content: postData.content
                  }
                }
              })
            }
          }}
          type={"collect"}
        />
      }
      {isMyPost &&
        <ActionCard color="red" icon={IconTrash} name={"삭제"}
          handleFunc={() => {
            openModal("Alert", "게시물을 삭제하시겠습니까?", ["취소", "확인"],
              [null, () => {
                closeModalDirect()
                closeModal()
                setTimeout(() => mutate(), 400)
              }
              ])
          }}
        />}
    </div>
  )
}

export default PostActionOverview
