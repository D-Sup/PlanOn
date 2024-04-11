import { useSetRecoilState } from "recoil";
import { routeDirectionValue } from "@/store";

import ProfileCard from "../mocules/ProfileCard";

import IconArrow from "../../assets/images/icon-arrow-left.svg?react";
import IconMoreVertical from "../../assets/images/icon-more-vertical.svg?react";

import { UsersType } from "@/types/users.type";



const ChatRoomHeader = ({ data, handleFunc }: { data: UsersType, handleFunc: () => void }): JSX.Element => {
  const { accountName, description, accountImage } = data;
  const setRouteDirectionValueState = useSetRecoilState(routeDirectionValue)


  const goBack = () => {
    setRouteDirectionValueState(Prev => ({ ...Prev, direction: "prev" }))
  }
  return (
    <div className="pr-[10px] flex items-center w-screen min-h-[50px]" >
      <button className="mx-[10px] p-[10px]" type="button" onClick={goBack}>
        <IconArrow width={7} height={12} fill={"var(--white)"} />
      </button>
      <ProfileCard title={accountName} description={description} src={accountImage} />
      <button className="p-[20px] ml-auto" type="button" onClick={handleFunc}>
        <IconMoreVertical width={4} height={15} fill={"var(--white)"} />
      </button>
    </div>
  )
}

export default ChatRoomHeader;