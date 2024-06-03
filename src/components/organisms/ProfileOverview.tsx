import { useState } from "react";
import { useNavigate } from "react-router-dom";

import useModalStack from "@/hooks/useModalStack";
import FollowService from "@/services/followService";

import FollowOverview from "./FollowOverview";
import ProfileAvatar from "../atoms/ProfileAvatar"

import getAccountId from "@/utils/getAccountId";

import { UsersType } from "@/types/users.type";

interface ProfileOverviewProps {
  data: UsersType,
  postLength: number
  isMyProfile: boolean,
  chatRoomId: string,
  isFirstChat: boolean
}

const ProfileOverview = ({ data, postLength, isMyProfile, chatRoomId, isFirstChat }: ProfileOverviewProps) => {

  const { accountImage, accountName, description, followers, followings, authorizationId } = data as UsersType;
  const accountId = getAccountId()

  const { openModal } = useModalStack();
  const { UpdateFollow } = FollowService()
  const { mutate } = UpdateFollow()

  const [followed, setFollowed] = useState<boolean>(followers.includes(accountId));

  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center">
      <ProfileAvatar
        className="w-[100px] h-[100px]"
        src={accountImage}
        alt="profile-image"
      />
      <h2 className="mt-[10px] mb-[5px] text-xlg text-white font-bold">{accountName}</h2>
      <p className="text-center text-sm text-gray-old reduce-words w-3/4">{description}</p>

      <div className="my-[20px] px-[30px] w-full flex gap-[20px]">
        <button
          className={`h-[37px] rounded-[5px]  text-md ${accountId === authorizationId ? "bg-input text-gray-old" : followed ? "bg-input text-gray-old" : "bg-white text-black"} ${accountId === authorizationId ? "w-full" : "w-8/12"}`}
          type="button"
          onClick={() => {
            setFollowed(Prev => !Prev)
            accountId === authorizationId
              ? navigate("/profile/update", { state: { direction: "next" } })
              : followed
                ? mutate({ type: "delete", id: authorizationId })
                : mutate({ type: "create", id: authorizationId })
          }}
        >
          {accountId === authorizationId ? "프로필 편집" : followed ? "팔로우 취소" : "팔로우"}
        </button>
        {accountId !== authorizationId &&
          <button
            onClick={() => { navigate("/chatroom", { state: { direction: "next", userInfo: data, id: chatRoomId, isFirstChat } }) }}
            className="w-4/12 h-[37px] rounded-[5px] bg-input text-md text-gray-old"
            type="button"
          >
            메시지
          </button>}
      </div>

      <ul className="w-full flex justify-evenly">
        <li className="text-center"
          onClick={() => {
            followers.length !== 0 && openModal("Popup", { component: FollowOverview, props: { data: followers, type: "followers", isMyProfile }, title: "팔로워" })
          }}>
          <strong className="block text-md text-white leading-none">{followers.length}</strong>
          <span className="block text-sm text-gray-old">팔로워</span>
        </li>
        <li className="text-center">
          <strong className="block text-md text-white leading-none">{postLength}</strong>
          <span className="block text-sm text-gray-old">게시물</span>
        </li>
        <li className="text-center"
          onClick={() => {
            followings.length !== 0 && openModal("Popup", { component: FollowOverview, props: { data: followings, type: "followings", isMyProfile }, title: "팔로잉" })
          }}>
          <strong className="block text-md text-white leading-none">{followings.length}</strong>
          <span className="block text-sm text-gray-old">팔로잉</span>
        </li>
      </ul>
    </div>
  )
}

export default ProfileOverview