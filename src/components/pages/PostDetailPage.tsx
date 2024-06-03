import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import PostService from "@/services/postService";

import getAccountId from "@/utils/getAccountId";

import FixedTrigger from "../mocules/FixedTrigger";
import Header from "../organisms/Header";
import PostCard from "../organisms/PostCard";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";

const PostDetailPage = () => {

  const location = useLocation()
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const { post, isReadOnly } = location.state || []

  const accountId = getAccountId()

  const { ReadPostSingle } = PostService()
  const { data, isLoading, refetch } = ReadPostSingle(post)

  useEffect(() => {
    refetch()
  }, [])

  const { DetailHeader, DownloadSuggestHeader } = Header()

  const goBack = () => {
    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
  }

  return (
    <>
      {isReadOnly && !accountId &&
        <DownloadSuggestHeader />
      }
      <FixedTrigger className="top-0" height={40} enableAnimation={false}>
        {!isReadOnly && <DetailHeader title={"게시물 상세"} handleFunc={goBack} />}
      </FixedTrigger>
      {isLoading && <PostCardSkeleton repeat={1} />}
      {data && <PostCard data={data} isReadOnly={isReadOnly} />}
    </>
  )
}

export default PostDetailPage