import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";
import useScrollBottom from "@/hooks/useScrollBottom";

import { useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { postFormValue, isPostFormModifiedSelector, paginationValue, routeDirectionValue } from "@/store";
import { modalStack } from "@/store";

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

  const modalStackState = useRecoilValue(modalStack);
  const isPostFormModified = useRecoilValue(isPostFormModifiedSelector);
  const resetPostFormState = useResetRecoilState(postFormValue);
  const paginationValueState = useRecoilValue(paginationValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const currentCategory = paginationValueState.currentCategory

  const { isOpen } = modalStackState[modalStackState.length - 1];

  const { openModal, closeModal } = useModalStack();

  const location = useLocation()

  const { ReadPostAllPaged, ReadPostFollowPaged, ReadPostLikePaged } = PostService()
  const { data: postAllData, isFetching: isPostAllFetching, isLoading: isPostAllLoading, refetch: refectchPostAll } = ReadPostAllPaged()
  const { data: postFollowData, isFetching: isPostFollowFetching, isLoading: isPostFollowLoading, refetch: refectchPostFollow } = ReadPostFollowPaged()
  const { data: postLikeData, isFetching: isPostLikeFetching, isLoading: isPostLikeLoading, refetch: refectchPostLike } = ReadPostLikePaged()

  const posts =
    currentCategory === "all-posts" && postAllData ||
    currentCategory === "following-posts" && postFollowData ||
    currentCategory === "like-posts" && postLikeData || []

  const isFetching =
    currentCategory === "all-posts" && isPostAllFetching ||
    currentCategory === "following-posts" && isPostFollowFetching ||
    currentCategory === "like-posts" && isPostLikeFetching || false

  const isLoading =
    currentCategory === "all-posts" && isPostAllLoading ||
    currentCategory === "following-posts" && isPostFollowLoading ||
    currentCategory === "like-posts" && isPostLikeLoading || false

  const filteredData = posts?.filter(singleData => singleData.data.authorizationId === accountId || singleData.data.private === false)

  const { FeedHeader } = Header();

  const navigate = useNavigate();

  const isBottom = useScrollBottom();

  useEffect(() => {
    if (isBottom && !isOpen) {
      if (currentCategory === "all-posts") {
        refectchPostAll()
      } else if (currentCategory === "following-posts") {
        refectchPostFollow()
      } else if (currentCategory === "like-posts") {
        refectchPostLike()
      }
    }
  }, [isBottom]);

  useEffect(() => {
    if (currentCategory === "all-posts" && paginationValueState.allPosts.lastVisible === null) {
      refectchPostAll()
    } else if (currentCategory === "following-posts" && paginationValueState.followingPosts.lastVisible === null) {
      refectchPostFollow()
    } else if (currentCategory === "like-posts" && paginationValueState.likePosts.lastVisible === null) {
      refectchPostLike()
    }
  }, [paginationValueState])

  // useEffect(() => {
  //   if (currentCategory === "all-posts") {
  //     refectchPostAll()
  //   } else if (currentCategory === "following-posts") {
  //     refectchPostFollow()
  //   } else if (currentCategory === "like-posts") {
  //     refectchPostLike()
  //   }
  // }, [currentCategory])

  // useEffect(() => {
  //   if (!filteredData) {
  //     if (currentCategory === "all-posts") {
  //       refectchPostAll()
  //     } else if (currentCategory === "following-posts") {
  //       refectchPostFollow()
  //     } else if (currentCategory === "like-posts") {
  //       refectchPostLike()
  //     }
  //   }
  // }, [filteredData])


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
      {isPostAllLoading || isPostFollowLoading || isPostLikeLoading &&
        <PostCardSkeleton repeat={2} />
      }
      <div className="flex flex-col gap-[10px] bg-background-light" >
        {!isPostAllLoading && !isPostFollowLoading && !isPostLikeLoading && filteredData?.map(singleData => (
          <PostCard data={singleData} key={singleData.id} />
        ))
        }
        {!isPostAllLoading && !isPostFollowLoading && !isPostLikeLoading && filteredData?.length === 0 &&
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
