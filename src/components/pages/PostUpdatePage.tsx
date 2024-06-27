import { useState, useContext } from "react";
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import { useRecoilValue, useRecoilState, useResetRecoilState } from "recoil";
import { postFormValue } from "@/store";
import { isPostFormModifiedSelector, routeDirectionValue } from "@/store";

import FixedTrigger from "../mocules/FixedTrigger";
import SlideTransition from "../organisms/SlideTransition";

import Header from "../organisms/Header";
import PostForm from "../organisms/PostForm";
import PhotoSelector from "../organisms/PhotoSelector";
import ScheduleOverview from "../organisms/ScheduleOverview";
import PostProgressIndicator from "../organisms/PostProgressIndicator";

import PostService from "@/services/postService";
import { PostFormValueType } from "@/store";

const PostUpdatePage = () => {

  const { data: userData } = useContext(UserContext);

  const location = useLocation()
  const editData = location.state?.data as PostFormValueType;

  const navigate = useNavigate();

  const [postFormState, setPostFormState] = useRecoilState(postFormValue);
  const [updatePostFormState, setUpdatePostFormState] = useState(editData);
  const resetPostFormState = useResetRecoilState(postFormValue);
  const isPostFormModified = useRecoilValue(isPostFormModifiedSelector);
  const [routeDirectionValueState, setRouteDirectionValueState] = useRecoilState(routeDirectionValue);
  const [progress, setProgress] = useState<number>(routeDirectionValueState.direction !== "" || editData ? 1 : 0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isFetching, setIsFetching] = useState<boolean>(true);

  const postState = editData ? updatePostFormState : postFormState
  const setPostState = editData ? setUpdatePostFormState : setPostFormState

  const steps = [
    { progressCheck: 0, description: "사진선택" },
    { progressCheck: 1, description: "일정선택" },
    { progressCheck: 2, description: "내용선택" },
  ];

  const { WritePostHeader } = Header();

  const { openModal, closeModal, closeModalDirect } = useModalStack()
  const { CreatePost, UpdatePost } = PostService();

  const { mutate: mutateUpdatePost, isPending: isUpdatePostPending } = UpdatePost(
    location.state?.id,
    postState,
    () => {
      closeModal()
      setTimeout(() => {
        openModal("Toast", { message: "게시물이 수정되었습니다." });
      }, 800)
      navigate("/post", {
        state: { direction: "prev" },
      })
    },
    () => {
      closeModal();
      setTimeout(() => {
        openModal("Alert", "게시물 수정을 실패했습니다.", ["확인"], [null])
      }, 800)
      navigate("/post", {
        state: { direction: "prev" },
      })
    }
  )

  const { mutate: mutateCreatePost, isPending: isCreatePostPending } = CreatePost(
    userData.data,
    () => {
      closeModal()
      setTimeout(() => {
        openModal("Toast", { message: "업로드를 완료했습니다." });
      }, 800)
      navigate("/post", {
        state: { direction: "prev" },
      })
      resetPostFormState()
    },
    () => {
      closeModal();
      setTimeout(() => {
        openModal("Alert", "이미지 업로드를 실패했습니다.", ["확인"], [null])
      }, 800)
      setDirection("prev")
      setProgress(0)
      setPostFormState(Prev => ({
        ...Prev,
        photos: { checked: [], file: [], preview: [] },
      }));
    }
  )

  const handlePreviousProgress = () => {
    if (progress === 1 && !editData) {
      setDirection("prev");
      setProgress((progress - 1));
    } else if (progress === 2) {
      setDirection("prev");
      setProgress((progress - 1));
    } else if (progress === 0 && isPostFormModified) {
      openModal("Alert", "임시저장을 하시겠습니까?", ["삭제", "확인"],
        [
          () => {
            closeModal()
            navigate("/post", {
              state: { direction: "prev" },
            })
            resetPostFormState()
          },
          () => {
            closeModal()
            navigate("/post", {
              state: { direction: "prev" },
            })
          }
        ])
    } else if (progress === 1 && editData) {
      openModal("Alert", "사진은 수정이 불가능합니다.", ["그만하기", "이어서 수정하기"],
        [
          () => {
            closeModal()
            setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
          },
          null
        ])
    } else {
      navigate("/post", {
        state: { direction: "prev" },
      })
    }
  };

  const handleNextProgress = () => {
    if (progress < 2) {
      setDirection("next");
      setProgress((progress + 1));
    } else {
      openModal("Alert", `${editData ? "수정" : "작성"}을 완료하시겠습니까?`, ["취소", "확인"], [null, () => {
        editData ? mutateUpdatePost() : mutateCreatePost()
      }]);
    }
  };

  if (isUpdatePostPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: true, message: "게시물 수정 중 ..." });
    setIsFetching(false)
  }

  if (isCreatePostPending && isFetching) {
    closeModalDirect()
    openModal("Loading", { isLoader: true, message: "업로드 중 ..." });
    setIsFetching(false)
  }

  return (
    <>
      <FixedTrigger className="z-20 top-0" height={155} enableAnimation={false}>
        <WritePostHeader title={editData ? "게시물 수정" : "게시물 작성"} isRequired={progress === 0 ? editData || postFormState.photos?.checked.length !== 0 ? true : false : true} handleFunc={[handlePreviousProgress, handleNextProgress]} />
        <div className="mx-[30px] my-[30px]">
          <PostProgressIndicator progress={progress} steps={steps} />
        </div>
      </FixedTrigger>

      <SlideTransition className="px-[30px] pb-[20px]" progress={progress} direction={direction} >
        {progress === 0 && <PhotoSelector postFormState={postState} setPostFormState={setPostState} />}
        {progress === 1 && <ScheduleOverview postFormState={postState} setPostFormState={setPostState} isSlideEnabled={false} onAddress={false} editData={editData} />}
        {progress === 2 && <PostForm postFormState={postState} setPostFormState={setPostState} />}
      </SlideTransition>
    </>
  )
}

export default PostUpdatePage

