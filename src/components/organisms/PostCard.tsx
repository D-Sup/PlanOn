import { useEffect, useContext } from "react";
import { UserContext } from "../providers/UserInfoProvider";
import { useNavigate, useLocation } from "react-router-dom";
import useModalStack from "@/hooks/useModalStack";

import { useSetRecoilState } from "recoil"
import { routeDirectionValue } from "@/store"

import ListUnit from "./ListUnit";
import PostAuthorListUnit from "./PostAuthorListUnit";
import CommentOverView from "./CommentOverView";
import PostActionOverview from "./PostActionOverview";
import ImageSlider from "../molecules/ImageSlider";
import PostContentListUnit from "./PostContentListUnit";
import PostActionListUnit from "./PostActionListUnit";
import TagUserOverview from "./TagUserOverview";

import LikeService from "@/services/likeService";

import getAccountId from "@/utils/getAccountId";

import { PostMachinedType } from "@/services/postService";

const PostCard = ({ data, isReadOnly }: { data: PostMachinedType, isReadOnly?: boolean }) => {

  const { data: userData } = useContext(UserContext);
  const { id, data: postData } = data
  const accountId = getAccountId()

  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)

  const navigate = useNavigate()
  const location = useLocation()

  const { PostScheduleListUnit, PostHashtagListUnit } = ListUnit();

  const { openModal, updateModal } = useModalStack()
  const { mutate } = LikeService()

  useEffect(() => {
    updateModal({ id, comments: postData.comments })
  }, [postData])

  return (
    <>
      {postData &&
        <div className="bg-background pt-[10px] pb-[20px]">
          <PostAuthorListUnit data={postData} handleFunc={[
            () => {
              if (location.pathname === "/post") {
                setRouteDirectionValueState(Prev => ({ ...Prev, previousPageUrl: [...Prev.previousPageUrl, location.pathname], data: [...Prev.data, {}] }))
                navigate(`/profile/${postData.authorizationId}`, { state: { direction: "next" } })
              }
            },
            () => {
              openModal("Popup", { component: TagUserOverview, props: postData.tagUserInfo, title: "태그된 유저" })
            },
            () => {
              openModal(PostActionOverview, { isHeightAuto: true, data })
            }
          ]} />
          <ImageSlider photos={postData.images} ratio={"16/16"} />
          {(postData.authorizationId === accountId || postData.private === false) &&
            <PostScheduleListUnit data={postData} handleFunc={() => {
              navigate("/schedule/detail", { state: { direction: "next", data: postData.scheduleInfo, isReadOnly: postData.authorizationId !== accountId } })
            }} />
          }
          <PostContentListUnit data={postData.content} />
          <PostHashtagListUnit data={postData.hashtags} />
          <PostActionListUnit data={postData} handleFunc={[
            () => {
              if (isReadOnly) {
                openModal("Toast", { type: "info", message: "회원만 이용 가능한 기능입니다." });
              } else {
                mutate({ target: "post", type: postData.likedUsers.includes(accountId) ? "delete" : "create", id, deviceToken: postData.userInfo.deviceToken, userData: userData.data, authorizationId: postData.authorizationId })
              }
            },
            () => {
              if (isReadOnly) {
                openModal("Toast", { type: "info", message: "회원만 이용 가능한 기능입니다." });
              } else {
                openModal(CommentOverView, { id, comments: postData.comments, deviceToken: postData.userInfo.deviceToken, authorizationId: postData.authorizationId })
              }
            }]} />
        </div >
      }
    </>
  )
}

export default PostCard

