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


  return { PostAuthorListUnit, PostScheduleListUnit, PostContentListUnit, PostActionListUnit, CommentListUnit }
}

export default ListUnit