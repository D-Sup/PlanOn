import ProfileCard from "../molecules/ProfileCard";
import ToggleButton from "../atoms/ToggleButton";

import formatDate from "@/utils/formatDate";

import IconArrow from "../../assets/images/icon-arrow-right.svg?react";
import IconMap from "../../assets/images/icon-map.svg?react";
import IconHash from "../../assets/images/icon-hash.svg?react";
import IconLocation from "../../assets/images/icon-location.svg?react";
import IconUser from "../../assets/images/icon-user.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { SearchHistoryType, UsersType } from "@/types/users.type";
import { HashtagsType } from "@/types/hashtags.type";

import { PostsType } from "@/types/posts.type";
import { SchedulesType } from "@/types/schedules.type";
import { LocationsType } from "@/types/locations.type";

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
    const { id: hashtagId, data: hashtagData } = data

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
      >
        <ProfileCard title={hashtagId} description={`게시물 ${hashtagData.taggedPostIds.length}`} src={IconHash} />
        <ToggleButton options={["취소", "선택"]} selected={selected} handleFunc={() => handleFunc(data)} />
      </li>
    )
  }

  const LocationLinkListUnit = ({ data, handleFunc }: { data: ReadDocumentType<LocationsType>, handleFunc: () => void }): JSX.Element => {
    const { id: locationId, data: locationData } = data

    return (
      <li
        className="w-full flex items-center justify-between py-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <ProfileCard title={locationId} description={`게시물 ${locationData.taggedPostIds.length}`} src={IconLocation} />
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

  const ChatJoinableMemberItem = ({ data, handleFunc }: { data: UsersType, handleFunc: () => void }): JSX.Element => {
    const { accountName, description, accountImage } = data

    return (
      <li className="w-full" onClick={handleFunc}>
        <ProfileCard title={accountName} description={description} src={accountImage} />
      </li>
    )
  }


  return { PostScheduleListUnit, PostHashtagListUnit, HashTagLinkListUnit, HashTagPickerListUnit, LocationLinkListUnit, LocationDetailLinkListUnit, UserFollowListUnit, UserTagPickerListUnit, HistoryUnit, ChatJoinableMemberItem }
}

export default ListUnit