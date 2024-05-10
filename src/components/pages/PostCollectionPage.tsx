import { useNavigate, useLocation } from "react-router-dom"
import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import PostService from "@/services/postService"

import Header from "../organisms/Header"
import PhotoAlbum from "../organisms/PhotoAlbum"
import FixedTrigger from "../mocules/FixedTrigger"
import PhotoAlbumSkeleton from "../skeleton/PhotoAlbumSkeleton"

// import getAccountId from "@/utils/getAccountId"

import { ReadDocumentType } from "@/hooks/useFirestoreRead"
import { PostsType } from "@/types/posts.type"

const PostCollectionPage = () => {

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue);

  const { DetailHeader } = Header()

  const navigate = useNavigate()
  const location = useLocation()

  // const accountId = getAccountId()

  const { type, data, title } = location.state || {};

  const { ReadPostAllSearch } = PostService()
  const { data: postData, isLoading } = ReadPostAllSearch("id", data.taggedPostIds)

  // const filteredData = postData?.filter(singleData => singleData.data.authorizationId === accountId || singleData.data.private === false)

  const handleNavigate = (post: ReadDocumentType<PostsType>) => {
    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, { type, data, title }] }))
    navigate("/post/detail", { state: { direction: "next", post } })
  }

  const goBack = () => {
    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
  }

  return (
    <>
      <FixedTrigger className="w-full" height={40} enableAnimation={false}>
        <DetailHeader title={title} handleFunc={goBack} />
      </FixedTrigger>

      {isLoading && <PhotoAlbumSkeleton />}
      {postData && <PhotoAlbum data={postData} handleFunc={handleNavigate} />}
      {postData?.length === 0 &&
        <span className="absolute-center block text-center text-nowrap text-md text-white">관련 게시물이 없거나 비공개 게시물 입니다.</span>
      }
    </>
  )
}

export default PostCollectionPage