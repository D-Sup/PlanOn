import { useState, useEffect, useContext } from "react";
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";
import useScrollBottom from "@/hooks/useScrollBottom";

import { useRecoilState, useRecoilValue, useSetRecoilState, useResetRecoilState } from "recoil";
import { postFormValue, isPostFormModifiedSelector, paginationValue, routeDirectionValue } from "@/store";
import { modalStack } from "@/store";

import PostService from "@/services/postService";
import useFirestoreUpdate from "@/hooks/useFirestoreUpdate";

import ScrollRefreshContainer from "../organisms/ScrollRefreshContainer";
import Header from "../organisms/Header";
import PostCard from "../organisms/PostCard";
import PostCategory from "../organisms/PostCategory";
import Loader from "../organisms/Loader";
import FixedTrigger from "../mocules/FixedTrigger";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";

// import getAccountId from "@/utils/getAccountId";

import { PostFormValueType } from "@/store";

const PostPage = () => {

  const { data: userData } = useContext(UserContext);

  // const accountId = getAccountId()

  const modalStackState = useRecoilValue(modalStack);
  const isPostFormModified = useRecoilValue(isPostFormModifiedSelector);
  const resetPostFormState = useResetRecoilState(postFormValue);
  const [paginationValueState, setPaginationValueState] = useRecoilState(paginationValue);
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const currentCategory = paginationValueState.currentCategory

  const { isOpen } = modalStackState[modalStackState.length - 1];

  const { openModal, closeModal } = useModalStack();

  const location = useLocation()

  const [postFormState, setPostFormState] = useState<Pick<PostFormValueType, "hashtags">>({ hashtags: [{ id: "", data: {} }] });
  const [firstMount, setFirstMount] = useState<boolean>(true);

  const { ReadPostAllPaged, ReadPostFollowPaged, ReadPostLikePaged, ReadPostTagPaged } = PostService()
  const { data: postAllData, isFetching: isPostAllFetching, isLoading: isPostAllLoading, refetch: refetchPostAll, reset: resetPostAll } = ReadPostAllPaged()
  const { data: postFollowData, isFetching: isPostFollowFetching, isLoading: isPostFollowLoading, refetch: refetchPostFollow, reset: resetPostFollow } = ReadPostFollowPaged()
  const { data: postLikeData, isFetching: isPostLikeFetching, isLoading: isPostLikeLoading, refetch: refetchPostLike, reset: resetPostLike } = ReadPostLikePaged()
  const { data: postTagData, isFetching: isPostTagFetching, isLoading: isPostTagLoading, refetch: refetchPostTag, reset: resetPostTag } = ReadPostTagPaged(postFormState.hashtags.map(tag => tag.id))
  const { updateField } = useFirestoreUpdate("users")

  const posts =
    currentCategory === "all-posts" && postAllData ||
    currentCategory === "following-posts" && postFollowData ||
    currentCategory === "like-posts" && postLikeData ||
    currentCategory === "tag-posts" && postTagData || []

  const isFetching =
    currentCategory === "all-posts" && isPostAllFetching ||
    currentCategory === "following-posts" && isPostFollowFetching ||
    currentCategory === "like-posts" && isPostLikeFetching ||
    currentCategory === "tag-posts" && isPostTagFetching


  const isLoading =
    currentCategory === "all-posts" && isPostAllLoading ||
    currentCategory === "following-posts" && isPostFollowLoading ||
    currentCategory === "like-posts" && isPostLikeLoading ||
    currentCategory === "tag-posts" && isPostTagLoading

  // const filteredData = posts?.filter(singleData => singleData.data.authorizationId === accountId || singleData.data.private === false)

  const { FeedHeader } = Header();

  const navigate = useNavigate();

  const isBottom = useScrollBottom();

  useEffect(() => {
    setTimeout(() => setFirstMount(false), 5000)
  }, [])

  useEffect(() => {
    if (userData) {
      if (userData.data.filterTags.length !== 0) {
        setPostFormState({ hashtags: userData.data.filterTags.map(tag => ({ id: tag, data: {} })) })
      }
      if (currentCategory === "") {
        setPaginationValueState({
          currentCategory: userData?.data.selectedFilter,
          posts: {
            lastVisible: null,
            isDataEnd: false
          },
        })
      }
    }
  }, [userData])

  useEffect(() => {
    if (posts.length === 0) {
      if (currentCategory === "all-posts") {
        refetchPostAll()
      } else if (currentCategory === "following-posts") {
        refetchPostFollow()
      } else if (currentCategory === "like-posts") {
        refetchPostLike()
      } else if (currentCategory === "tag-posts" && postFormState.hashtags[0]?.id !== "") {
        refetchPostTag()
      }
    }
  }, [posts, postFormState])

  useEffect(() => {
    if (isBottom && !isOpen) {
      if (currentCategory === "all-posts") {
        refetchPostAll()
      } else if (currentCategory === "following-posts") {
        refetchPostFollow()
      } else if (currentCategory === "like-posts") {
        refetchPostLike()
      } else if (currentCategory === "tag-posts") {
        refetchPostTag()
      }
    }
  }, [isBottom]);

  useEffect(() => {
    if (paginationValueState.posts.lastVisible === null) {
      if (currentCategory === "all-posts") {
        resetPostAll()
      } else if (currentCategory === "following-posts") {
        resetPostFollow()
      } else if (currentCategory === "like-posts") {
        resetPostLike()
      } else if (currentCategory === "tag-posts") {
        resetPostTag()
      }
    }
  }, [paginationValueState])

  return (
    <ScrollRefreshContainer isLoading={isFetching} refetch={() => {
      setPaginationValueState({
        currentCategory,
        posts: {
          lastVisible: null,
          isDataEnd: false
        },
      })
    }}>
      <div className="relative">
        <FixedTrigger className="top-0" height={60} hasReachedTop={false}>
          <FeedHeader handleFunc={[
            () => {
              openModal(PostCategory, { isHeightAuto: true, postFormState, setPostFormState, handleFunc: () => { updateField(userData.id, { filterTags: postFormState.hashtags.map(tag => tag.id) }) } })
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
            },
            () => {
              setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
              navigate("/notification", {
                state: { direction: "next" },
              })
            },
          ]} />
        </FixedTrigger>
        {isLoading &&
          <PostCardSkeleton repeat={2} />
        }
        <div className="flex flex-col gap-[10px] bg-background-light" >
          {!isLoading && posts?.map(singleData => (
            <PostCard data={singleData} key={singleData.id} />
          ))
          }
          {!isLoading && posts?.length === 0 && !firstMount &&
            <div className="w-screen h-[calc(100dvh-140px)] bg-background">
              <span className="absolute-center text-nowrap text-md text-white">게시물이 없습니다.</span>
            </div>
          }
        </div>
        <div className={`fixed bottom-[80px] left-1/2 -translate-x-1/2 w-[150px] h-[80px] rounded-lg transition duration-300 backdrop-blur-sm ${isBottom && isFetching && !isLoading ? "opacity-1" : "opacity-0"}`} style={{ pointerEvents: "none" }}>
          <div className="absolute-center w-[100px]">
            <Loader />
          </div>
        </div>
      </div>
    </ScrollRefreshContainer>
  )
}

export default PostPage
