import { useState } from "react";

import LeftAndRightSlider from "../mocules/LeftAndRightSlider";
import ProfileCard from "../mocules/ProfileCard";
import ToggleButton from "../atoms/ToggleButton";
import ProfileAvatar from "../atoms/ProfileAvatar";

import formatDate from "@/utils/formatDate";
import getAccountId from "@/utils/getAccountId";

import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";
import IconHeart from "../../assets/images/icon-heart.svg?react";
import IconMoreVertical from "../../assets/images/icon-more-vertical.svg?react";
import IconArrow from "../../assets/images/icon-arrow-right.svg?react";
import IconMap from "../../assets/images/icon-map.svg?react";
import IconExit from "../../assets/images/icon-exit.svg?react";
import IconComment from "../../assets/images/icon-comment.svg?react";
import IconHash from "../../assets/images/icon-hash.svg?react";
import IconLocation from "../../assets/images/icon-location.svg?react";
import IconUser from "../../assets/images/icon-user.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { ChatsType, SearchHistoryType, UsersType } from "@/types/users.type";
import { HashtagsType } from "@/types/hashtags.type";

import { PostsType } from "@/types/posts.type";
import { SchedulesType } from "@/types/schedules.type";

// interface ListUnitTypes {
//   PostAuthorListUnit: ({ handleFunc }: { handleFunc: (() => void)[] }) => JSX.Element,
//   PostScheduleListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
//   PostContentListUnit: ({ data }: { data: any }) => JSX.Element,
//   PostActionListUnit: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element,
//   CommentListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
//   HashTagLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
//   HashTagPickerListUnit: ({ data, handleFunc }: { data: any, handleFunc: (boolean: boolean) => void }) => JSX.Element,
//   LocationLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
//   LocationDetailLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element,
//   UserTagPickerListUnit: ({ data, selected, handleFunc }: { data: any, selected: boolean, handleFunc: (id: string) => void }) => JSX.Element,
//   UserLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
//   ChatMemberListUnit: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element,
//   ChatJoinableMemberItem: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
// }

const ListUnit = () => {

  const PostScheduleListUnit = ({ data, handleFunc }: { data: PostsType & { scheduleInfo: SchedulesType }, handleFunc: () => void }): JSX.Element => {

    const { scheduleInfo } = data

    return (
      <>
        {scheduleInfo &&
          <div
            className="pl-[10px] pr-[20px] w-full h-[50px] flex items-center justify-between"
            style={{ boxShadow: "0 1px var(--gray-heavy)" }}
            onClick={handleFunc}
          >
            <div className="flex flex-col">
              <p className="text-md text-white">{scheduleInfo.scheduleName}</p>
              <span className="text-xsm text-gray-old">{`${formatDate(scheduleInfo.startTime, 2)} - ${formatDate(scheduleInfo.endTime, 3)}`}</span>
            </div>
            <IconArrow width={7} height={12} fill={"var(--white)"} className="mr-[10px]" />
          </div>
        }
      </>
    )
  }

  const PostHashtagListUnit = ({ data }: { data: string[] }): JSX.Element => {
    return (
      <>
        {data.length !== 0 &&
          <ul className="flex flex-wrap gap-[10px] mt-[10px] pb-[5px] px-[10px] w-screen overflow-y-scroll">
            {data.map((hashtag) => (
              <button key={hashtag} type="button">
                <span className="px-[15px] py-[5px] bg-white rounded-sm text-xsm text-black">{`# ${hashtag}`}</span>
              </button>
            ))}
          </ul>
        }
      </>
    )
  }

  const HashTagLinkListUnit = ({ data, handleFunc }: { data: ReadDocumentType<HashtagsType>, handleFunc: () => void }): JSX.Element => {
    const { id, data: hashTagData } = data

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <ProfileCard title={id} description={`게시물 ${hashTagData.taggedPostIds.length}`} src={IconHash} />
        <IconArrow width={7} height={12} fill={"var(--white)"} className="mr-[10px]" />
      </li>
    )
  }

  const HashTagPickerListUnit = ({ data, selected, handleFunc }: { data: ReadDocumentType<HashtagsType>, selected: boolean, handleFunc: (tag: ReadDocumentType<UsersType> | ReadDocumentType<HashtagsType>) => void }): JSX.Element => {
    const { id: hashtagId, data: tagSearchData } = data

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
      >
        <ProfileCard title={hashtagId} description={`게시물 ${tagSearchData.taggedPostIds.length}`} src={IconHash} />
        <ToggleButton options={["취소", "선택"]} selected={selected} handleFunc={() => handleFunc(data)} />
      </li>
    )
  }

  const LocationLinkListUnit = ({ data, handleFunc }: { data: SchedulesType, handleFunc: () => void }): JSX.Element => {
    const { scheduleLocation } = data

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <ProfileCard title={scheduleLocation.placeName} description={scheduleLocation.placeAddress} src={IconLocation} />
        <IconArrow width={7} height={12} fill={"var(--white)"} className="mr-[10px]" />
      </li>
    )
  }

  const LocationDetailLinkListUnit = ({ data, handleFunc }: { data: any, handleFunc: [(data: any) => void, (placeId: string) => void] }): JSX.Element => {
    const { name, formatted_address, place_id } = data;

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={() => handleFunc[0](data)}
      >
        <ProfileCard title={name} description={formatted_address} src={IconLocation} />
        <button type="button" onClick={(e) => {
          e.stopPropagation()
          handleFunc[1](place_id)
        }}>
          <IconMap width={14} height={14} fill={"var(--white)"} />
        </button>
      </li>
    )
  }

  const UserFollowListUnit = ({ data, followed, handleFunc }: { data: ReadDocumentType<UsersType>, followed: boolean, handleFunc: (() => void)[] }): JSX.Element => {
    const { data: userData } = data
    const { accountName, description, accountImage } = userData

    return (
      <li className="w-full flex items-center justify-between py-[10px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <ProfileCard title={accountName} description={description} src={accountImage} handleFunc={handleFunc[0]} />
        <ToggleButton options={["팔로잉", "팔로우"]} selected={followed} handleFunc={handleFunc[1]} />
      </li>
    )
  }

  const UserTagPickerListUnit = ({ data, selected, handleFunc }: { data: ReadDocumentType<UsersType>, selected: boolean, handleFunc: (tag: ReadDocumentType<UsersType> | ReadDocumentType<HashtagsType>) => void }): JSX.Element => {
    const { data: userData } = data
    const { accountName, description, accountImage } = userData

    return (
      <li className="w-full flex items-center justify-between py-[10px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <ProfileCard title={accountName} description={description} src={accountImage} />
        <ToggleButton options={["취소", "선택"]} selected={selected} handleFunc={() => handleFunc(data)} />
      </li>
    )
  }

  const HistoryUnit = ({ data, handleFunc }: { data: SearchHistoryType, handleFunc: (() => void)[] }): JSX.Element => {
    const { title, createdAt, type } = data

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc[0]}
      >
        <ProfileCard
          title={title}
          description={formatDate(createdAt, 9)}
          src={
            type === "usertag" && IconUser ||
            type === "location" && IconLocation ||
            type === "hashtag" && IconHash || ""
          } />
        <button type="button"
          onClick={(e) => {
            e.stopPropagation()
            handleFunc[1]()
          }}>
          <IconCircleX width={15} height={15} fill={"var(--white)"} className="mr-[10px]" />
        </button>
      </li>
    )
  }

  const ChatMemberListUnit = ({ data, handleFunc }: { data: ChatsType, handleFunc: (() => void)[] }): JSX.Element => {
    const { id, userId, userInfo, lastReceive, lastMessageCreatedAt, unreadLength } = data

    return (
      <LeftAndRightSlider className="max-w-full h-[34px]" moreAreaWidth={60}>
        <div className="flex items-center justify-between" onClick={handleFunc[0]}>
          {userInfo && <ProfileCard title={userInfo.data.accountName} description={lastReceive} src={userInfo.data.accountImage} />}
          <div className="h-[34px] flex items-end justify-start flex-col gap-[7px]">
            <span className="text-xsm text-gray-heavy leading-none">{formatDate(lastMessageCreatedAt, 9) === "오늘" ? formatDate(lastMessageCreatedAt, 7) : formatDate(lastMessageCreatedAt, 9)}</span>
            {unreadLength !== 0 &&
              <div className="px-[5px] py-[2px] min-w-[13px] h-[13px] rounded-full bg-white">
                <span className="block text-center text-[6px] font-bold text-black">{unreadLength > 100 ? "100+" : unreadLength}</span>
              </div>
            }
          </div>
        </div >
        <button className="absolute top-1/2 right-[-50px] -translate-y-1/2" type="button" onClick={handleFunc[1]}>
          <IconExit width={17} height={17} fill={"var(--red)"} />
        </button>
      </LeftAndRightSlider>
    )
  }

  const ChatJoinableMemberItem = ({ data, handleFunc }: { data: UsersType, handleFunc: () => void }): JSX.Element => {
    const { accountName, description, accountImage } = data

    return (
      <li className="w-full" onClick={handleFunc}>
        <ProfileCard title={accountName} description={description} src={accountImage} />
      </li>
    )
  }


  return { PostScheduleListUnit, PostHashtagListUnit, HashTagLinkListUnit, HashTagPickerListUnit, LocationLinkListUnit, LocationDetailLinkListUnit, UserFollowListUnit, UserTagPickerListUnit, HistoryUnit, ChatMemberListUnit, ChatJoinableMemberItem }
}

export default ListUnit