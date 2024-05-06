import { useEffect, useContext } from "react"
import { UserContext } from "../organisms/UserInfoProvider"
import { useNavigate, useLocation } from "react-router-dom"
import { useRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import Header from "../organisms/Header"
import ProfileOverview from "../organisms/ProfileOverview"
import PhotoAlbum from "../organisms/PhotoAlbum"
import FixedTrigger from "../mocules/FixedTrigger"
import ProfileOverviewSkeleton from "../skeleton/ProfileOverviewSkeleton"
import PhotoAlbumSkeleton from "../skeleton/PhotoAlbumSkeleton"

import getAccountId from "@/utils/getAccountId"
import { v4 as uuidv4 } from "uuid";

import UserService from "@/services/userService"
import PostService from "@/services/postService"

import { ReadDocumentType } from "@/hooks/useFirestoreRead"
import { PostsType } from "@/types/posts.type"

const ProfilePage = () => {

  const [routeDirectionValueState, setRouteDirectionValueState] = useRecoilState(routeDirectionValue)

  const navigate = useNavigate()
  const location = useLocation()

  const accountId = getAccountId()
  const id = location.pathname.split("/")[2]

  const { ReadOtherUser } = UserService()
  const { ReadPostAll, ReadPostAllOther } = PostService()

  const { data: userData, isLoading: isUserLoading } = useContext(UserContext);
  const { data: postData, isLoading: isPostLoading, refetch: refetchPost } = ReadPostAll()

  const { data: otherUserData, isLoading: isOtherUserLoading, refetch: refetchOtherUser } = ReadOtherUser(id)
  const { data: otherPostData, isLoading: isOtherPostLoading, refetch: refetchOtherPost } = ReadPostAllOther(id)

  const fetchUserData = accountId === id ? userData : otherUserData
  const fetchPostData = accountId === id ? postData : otherPostData

  const isFirstChat = fetchUserData && userData && !userData.data.chats.some((chat) => chat.userId === fetchUserData.data.authorizationId)

  const goBack = () => {
    if (routeDirectionValueState.previousPageUrl.length === 0) {
      navigate("/post", { state: { direction: "prev" } })
    } else {
      setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
    }
  }

  useEffect(() => {
    if (accountId !== id) {
      refetchOtherUser()
      refetchOtherPost()
    } else {
      refetchPost()
    }
  }, [])

  const { DetailHeader } = Header()

  const handleNavigate = (post: ReadDocumentType<PostsType>) => {
    setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, { id }] }))
    navigate("/post/detail", { state: { direction: "next", post } })
  }

  const filteredData = fetchPostData?.
    // filter(singleData => singleData.data.authorizationId === accountId || singleData.data.private === false).
    sort((first, second) => first.data.createdAt.seconds >= second.data.createdAt.seconds ? -1 : 1)

  return (
    <>
      <FixedTrigger className="w-full" height={40} enableAnimation={false}>
        <DetailHeader title={"프로필"} handleFunc={goBack} />
      </FixedTrigger>
      <div className="my-[20px] ">
        {isOtherUserLoading && isOtherPostLoading &&
          <ProfileOverviewSkeleton />
        }
        {isUserLoading && isPostLoading &&
          <ProfileOverviewSkeleton />
        }
        {fetchUserData && fetchPostData &&
          <ProfileOverview
            myInfo={userData?.data}
            data={fetchUserData.data}
            postLength={fetchPostData.length}
            isMyProfile={accountId === id}
            chatRoomId={isFirstChat
              ? uuidv4()
              : userData?.data.chats[userData?.data.chats.findIndex((chat) => chat.userId === fetchUserData.data.authorizationId)].id || ""
            }
            isFirstChat={!!isFirstChat}
          />
        }
      </div>
      {isOtherUserLoading && isOtherPostLoading &&
        <PhotoAlbumSkeleton />
      }
      {isUserLoading && isPostLoading &&
        <PhotoAlbumSkeleton />
      }
      {filteredData && <PhotoAlbum data={filteredData} handleFunc={handleNavigate} />}
      {filteredData?.length === 0 &&
        <span className="mt-[100px] block text-center text-nowrap text-md text-white">게시물이 없거나 비공개 게시물 입니다.</span>
      }
    </>
  )
}

export default ProfilePage