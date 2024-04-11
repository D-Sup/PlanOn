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


  return { PostAuthorListUnit }
}

export default ListUnit