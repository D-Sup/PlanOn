import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import PostService from "@/services/postService";

import getAccountId from "@/utils/getAccountId";

import FixedTrigger from "../molecules/FixedTrigger";
import Header from "../organisms/Header";
import PostCard from "../organisms/PostCard";
import PostCardSkeleton from "../skeleton/PostCardSkeleton";

const PostDetailPage = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [routeDirectionValueState, setRouteDirectionValueState] = useRecoilState(routeDirectionValue)

  const { post, isReadOnly } = location.state || []

  const accountId = getAccountId()

  const { ReadPostSingle } = PostService()
  const { data, isLoading, refetch } = ReadPostSingle(post)

  useEffect(() => {
    refetch()
  }, [])

  const { DetailHeader, DownloadSuggestHeader } = Header()

  const goBack = () => {
    if (routeDirectionValueState.previousPageUrl.length === 0) {
      navigate("/post", { state: { direction: "prev" } })
    } else {
      setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
    }
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