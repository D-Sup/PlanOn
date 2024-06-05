import { useEffect, useContext } from "react";
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";
import useScrollBottom from "@/hooks/useScrollBottom";

import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { postFormValue, isPostFormModifiedSelector, paginationValue, routeDirectionValue } from "@/store";
import { modalStack, isUnLockValue } from "@/store";

import PostService from "@/services/postService";

import FixedTrigger from "../mocules/FixedTrigger";
import Header from "../organisms/Header";
import PostCard from "../organisms/PostCard";
import PostCategory from "../organisms/PostCategory";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";

import getAccountId from "@/utils/getAccountId";

import Loader from "../organisms/Loader";

const PostPage = () => {

  const accountId = getAccountId()

  const { data: userData } = useContext(UserContext);

  const modalStackState = useRecoilValue(modalStack);
  const isUnLockValueState = useRecoilValue(isUnLockValue);
  const isPostFormModified = useRecoilValue(isPostFormModifiedSelector);
  const resetPostFormState = useResetRecoilState(postFormValue);
  const paginationValueState = useRecoilValue(paginationValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const currentCategory = paginationValueState.currentCategory

  const { isOpen } = modalStackState[modalStackState.length - 1];

  const { openModal, closeModal } = useModalStack();

  const location = useLocation()

  const { ReadPostAllPaged, ReadPostPaged } = PostService()
  const { data: postData, isFetching: isPostFetching, isLoading: isPostLoading, refetch: refectchPost } = ReadPostPaged()
  const { data: postAllData, isFetching: isPostAllFetching, isLoading: isPostAllLoading, refetch: refectchPostAll } = ReadPostAllPaged()

  const posts = currentCategory === "all-posts" ? postAllData : postData
  const isFetching = currentCategory === "all-posts" ? isPostAllFetching : isPostFetching
  const isLoading = currentCategory === "all-posts" ? isPostAllLoading : isPostLoading

  const filteredData = posts?.filter(singleData => singleData.data.authorizationId === accountId || singleData.data.private === false)

  const { FeedHeader } = Header();

  const navigate = useNavigate();

  const isBottom = useScrollBottom();

  useEffect(() => {
    if (isBottom && !isOpen) {
      if (currentCategory === "all-posts") {
        refectchPostAll()
      } else {
        refectchPost()
      }
    }
  }, [isBottom]);

  useEffect(() => {
    if (location.state?.direction === "") {
      if (currentCategory === "all-posts") {
        refectchPostAll()
      } else if (currentCategory === "following-posts") {
        refectchPost()
      }
    }
  }, [])

  // useEffect(() => {
  //   if (userData?.data.secureNumber !== undefined && userData?.data.secureNumber !== "") {
  //     if (!isUnLockValueState) {
  //       navigate("/security", { state: { direction: "up" } })
  //     }
  //   }
  // }, [userData])

  useEffect(() => {
    if (currentCategory === "all-posts" && paginationValueState.allPosts.lastVisible === null) {
      refectchPostAll()
    } else if (currentCategory === "following-posts" && paginationValueState.followingPosts.lastVisible === null) {
      refectchPost()
    }
  }, [paginationValueState])

  useEffect(() => {
    if (!filteredData) {
      if (currentCategory === "all-posts") {
        refectchPostAll()
      } else {
        refectchPost()
      }
    }
  }, [filteredData])


  return (
    <div className="relative">
      <FixedTrigger className="top-0" height={60} hasReachedTop={false}>
        <FeedHeader handleFunc={[
          () => {
            openModal(PostCategory, { isHeightAuto: true })
          },
          () => {
            setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
            navigate("/search", {
              state: { direction: "next" },
            })
          },
          () => {
            if (isPostFormModified) {
              openModal("Alert", "이전에 작성하던 내용이 있습니다.", ["새로 작성", "이어서 작성"], [
                () => {
                  closeModal()
                  resetPostFormState()
                  navigate("/post/update", {
                    state: { direction: "next" },
                  })
                },
                () => {
                  closeModal()
                  navigate("/post/update", {
                    state: { direction: "next" },
                  })
                }
              ])
            } else {
              navigate("/post/update", {
                state: { direction: "next" },
              })
            }
          }]} />
      </FixedTrigger>
      {isPostLoading || isPostAllLoading &&
        <PostCardSkeleton repeat={2} />
      }
      <div className="flex flex-col gap-[10px] bg-background-light">
        {filteredData?.map(singleData => (
          <PostCard data={singleData} key={singleData.id} />
        ))
        }
        {filteredData?.length === 0 &&
          <span className="absolute top-[200px] left-1/2 -translate-x-1/2 text-nowrap text-md text-white">게시물이 없습니다.</span>
        }
      </div>
      <div className={`fixed bottom-[80px] left-1/2 -translate-x-1/2 w-[150px] h-[80px] rounded-lg transition duration-300 backdrop-blur-sm ${isBottom && isFetching && !isLoading ? "opacity-1" : "opacity-0"}`} style={{ pointerEvents: "none" }}>
        <div className="absolute-center w-[100px]">
          <Loader />
        </div>
      </div>

    </div>
  )
}

export default PostPage
