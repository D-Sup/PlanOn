import { useState, useEffect, useRef } from "react";

import LeftAndRightSlider from "../mocules/LeftAndRightSlider";
import ProfileCard from "../mocules/ProfileCard";
import ToggleButton from "../atoms/ToggleButton";
import ProfileAvatar from "../atoms/ProfileAvatar";

import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";
import IconHeart from "../../assets/images/icon-heart.svg?react";
import IconDot from "../../assets/images/icon-dot.svg?react";
import IconMoreVertical from "../../assets/images/icon-more-vertical.svg?react";
import IconArrow from "../../assets/images/icon-arrow-right.svg?react";
import IconMap from "../../assets/images/icon-map.svg?react";
import IconExit from "../../assets/images/icon-exit.svg?react";
import IconTrash from "../../assets/images/icon-trash.svg?react";
import IconComment from "../../assets/images/icon-comment.svg?react";

import iconLocation from "../../assets/images/icon-location.svg";
import iconHash from "../../assets/images/icon-hash.svg";

interface ListUnitTypes {
  PostAuthorListUnit: ({ handleFunc }: { handleFunc: (() => void)[] }) => JSX.Element,
  PostScheduleListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
  PostContentListUnit: ({ data }: { data: any }) => JSX.Element,
  PostActionListUnit: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element,
  CommentListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
  HashTagLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
  HashTagPickerListUnit: ({ data, handleFunc }: { data: any, handleFunc: (boolean: boolean) => void }) => JSX.Element,
  LocationLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
  LocationDetailLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element,
  LocationPickerListUnit: ({ data, handleFunc }: { data: any, handleFunc: (boolean: boolean) => void }) => JSX.Element,
  UserLinkListUnit: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element,
  ChatMemberListUnit: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element,
}

const ListUnit = (): ListUnitTypes => {

  const PostAuthorListUnit = ({ handleFunc }: { handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <div className="flex w-screen h-[40px] pl-[10px] pr-[20px] mb-[10px]">
        <ProfileAvatar
          className="w-[40px] h-[40px]"
          src="https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"
          alt="item-image"
          handleFunc={() => handleFunc[0]}
        />
        <div className="ml-[10px]">
          <p className="text-lg text-white button_reset">동섭</p>
          <div className="flex mt-[1px]">
            <IconCirclePlus width={15} height={15} fill={"var(--white)"} />
            {
              Array(3).fill(10).map(_ => (
                <div className="-ml-[3px]">
                  <ProfileAvatar
                    className="w-[15px] h-[15px] border-[1px] border-background-light"
                    src="https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"
                    alt="item-image"
                  />
                </div>
              ))
            }
          </div>
        </div>
        <button className="ml-auto" type="button" onClick={() => handleFunc[1]}>
          <IconMoreVertical width={4} height={15} fill={"var(--white)"} />
        </button>
      </div>
    )
  }

  const PostScheduleListUnit = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {
    return (
      <div
        className="pl-[10px] pr-[20px] w-full h-[50px] flex items-center justify-between"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <div className="flex flex-col">
          <p className="text-md text-white">인사동 투어</p>
          <span className="text-xsm text-gray-old">2024.3.21 - 3.22</span>
        </div>
        <IconArrow width={7} height={12} fill={"var(--white)"} />
      </div>
    )
  }

  const PostContentListUnit = ({ data }: { data: any }): JSX.Element => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [showMoreButton, setShowMoreButton] = useState<boolean>(false);
    const contentAreaRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      const contentAreaRefCurrent = contentAreaRef.current;
      if (contentAreaRefCurrent) {
        contentAreaRefCurrent.clientHeight > 24 ?
          setShowMoreButton(true) :
          setShowMoreButton(false)
      }
    }, [])

    return (
      <div className={`pl-[10px] pr-[20px] mt-[10px] relative w-full flex text-base`} ref={contentAreaRef}>
        <span className={`${isExpanded ? "w-full" : showMoreButton ? "w-4/5 reduce-words" : "w-full"} text-md text-white`}>
          {"가나다라마바사가나다라마바사"}
        </span>
        {showMoreButton && (
          <button className={`${isExpanded ? "hidden" : "block"} text-gray-600 absolute top-1.25 right-[20px]`} onClick={() => setIsExpanded((prev) => !prev)}>
            더보기
          </button>
        )}
      </div>
    )
  }

  const PostActionListUnit = ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }): JSX.Element => {

    const isLike = true;

    const heartCount = 30;
    const [hearted, setHearted] = useState<boolean>(true);


    return (
      <div className="pl-[10px] pr-[20px] pt-[10px] flex items-center gap-[20px]">
        <button
          className="flex gap-[10px] items-center justify-center"
          type="button"
          onClick={() => {
            setHearted(Prev => !Prev)
            handleFunc[0]()
          }}
        >
          <IconHeart width={22} height={20} fill={hearted ? "#FB004D" : "var(--gray-heavy)"} stroke={hearted ? "#FB004D" : ""} />
          {isLike ?
            <span className='text-xsm text-white'>{hearted ? heartCount : heartCount - 1}</span> :
            <span className='text-xsm text-white'>{hearted ? heartCount + 1 : heartCount}</span>
          }
        </button>
        <button
          className="flex gap-[10px] items-center justify-center"
          type="button"
          onClick={() => {
            handleFunc[1]()
          }}
        >
          <IconComment width={20} height={20} fill={"var(--gray-heavy)"} />
          <span className='text-xsm text-white'>{4}</span>
        </button>
        <span className="ml-auto text-sm text-gray-old">2024.3.24</span>
      </div>
    )
  }

  const CommentListUnit = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {
    const isLike = true;
    const commentPermission = false;
    const heartCount = 30;
    const [hearted, setHearted] = useState<boolean>(true);
    return (
      <li key={""} className="flex w-screen h-[37px]" >
        <ProfileAvatar
          className="w-[37px] h-[37px]"
          src="https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"
          alt="item-image"
        />
        <div className="ml-[10px]">
          <div className="flex items-center gap-[5px]">
            <p className="text-sm text-white inline">동섭</p>
            <IconDot width={3} height={3} fill={"var(--gray-old)"} />
            <span className="text-xsm text-gray-old">3일전</span>
          </div>
          <span className="block text-xsm text-white">안녕하세요?</span>
        </div>
        {commentPermission ? (
          <button
            className="ml-auto flex flex-col items-center justify-center"
            onClick={() => {
              setHearted(Prev => !Prev)
              handleFunc()
            }}
          >
            <IconTrash width={14} height={13} fill={"var(--gray-heavy)"} />
          </button>
        ) : (
          <button
            className="ml-auto flex flex-col items-center justify-center"
            onClick={() => {
              setHearted(Prev => !Prev)
              handleFunc()
            }}
          >
            <IconHeart width={14} height={13} fill={hearted ? "#FB004D" : "var(--background)"} stroke={hearted ? "#FB004D" : "var(--gray-old)"} />
            {isLike ?
              <span className='text-xsm'>{hearted ? heartCount : heartCount - 1}</span> :
              <span className='text-xsm'>{hearted ? heartCount + 1 : heartCount}</span>
            }
          </button>
        )}
      </li>
    )
  }

  const HashTagLinkListUnit = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {
    return (
      <li
        key={""}
        className="w-screen flex items-center justify-between pb-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <ProfileCard title={"1박2일"} description={"게시물 500"} src={iconHash} />
        <IconArrow width={7} height={12} fill={"var(--white)"} />
      </li>
    )
  }

  const HashTagPickerListUnit = ({ data, handleFunc }: { data: any, handleFunc: (boolean: boolean) => void }): JSX.Element => {
    return (
      <li
        className="w-screen flex items-center justify-between pb-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
      >
        <ProfileCard title={"1박2일"} description={"게시물 500"} src={iconHash} />
        <ToggleButton handleFunc={handleFunc} />
      </li>
    )
  }

  const LocationLinkListUnit = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {
    return (
      <li
        key={""}
        className="w-screen flex items-center justify-between pb-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <ProfileCard title={"1박2일"} description={"게시물 500"} src={iconLocation} />
        <IconArrow width={7} height={12} fill={"var(--white)"} />
      </li>
    )
  }

  const LocationDetailLinkListUnit = ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <li
        key={""}
        className="w-screen flex items-center justify-between pb-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={() => handleFunc[0]}
      >
        <ProfileCard title={"1박2일"} description={"게시물 500"} src={iconLocation} />
        <button type="button" onClick={() => handleFunc[1]}>
          <IconMap width={14} height={14} fill={"var(--white)"} />
        </button>
      </li>
    )
  }

  const LocationPickerListUnit = ({ data, handleFunc }: { data: any, handleFunc: (boolean: boolean) => void }): JSX.Element => {
    return (
      <li key={""} className="w-screen flex items-center justify-between pb-[10px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <ProfileCard title={"1박2일"} description={"자양로 117"} src={iconLocation} />
        <ToggleButton handleFunc={handleFunc} />
      </li>
    )
  }

  const UserLinkListUnit = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {
    return (
      <li
        key={""}
        className="w-screen flex items-center justify-between pb-[10px]"
        style={{ boxShadow: "0 1px var(--gray-heavy)" }}
        onClick={handleFunc}
      >
        <ProfileCard title={"동섭"} description={"안녕하세요?"} src={"https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"} />
        <IconArrow width={7} height={12} fill={"var(--white)"} />
      </li>
    )
  }
  const ChatMemberListUnit = ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }): JSX.Element => {

    return (
      <LeftAndRightSlider key={0} className="h-[34px]" moreAreaWidth={50}>
        <div className="w-screen flex items-center justify-between" onClick={() => handleFunc[0]}>
          <ProfileCard title={"동섭"} description={"1박 2일"} src={"https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"} />
          <div className="h-[34px] flex items-start justify-start flex-col gap-[7px]">
            <span className="text-xsm text-gray-heavy leading-none">3일 전</span>
            <div className="px-[5px] py-[2px] min-w-[13px] h-[13px] rounded-full bg-white">
              <span className="block text-center text-[6px] font-bold text-black">300+</span>
            </div>
          </div>
        </div >
        <button className="absolute top-1/2 right-[15px] -translate-y-1/2" type="button" onClick={() => handleFunc[1]}>
          <IconExit width={17} height={17} fill={"var(--red)"} />
        </button>
      </LeftAndRightSlider>
    )
  }


  return { PostAuthorListUnit, PostScheduleListUnit, PostContentListUnit, PostActionListUnit, CommentListUnit, HashTagLinkListUnit, HashTagPickerListUnit, LocationLinkListUnit, LocationDetailLinkListUnit, LocationPickerListUnit, UserLinkListUnit, ChatMemberListUnit }
}

export default ListUnit