import LeftAndRightSlider from "../molecules/LeftAndRightSlider";
import ProfileCard from "../molecules/ProfileCard";

import formatDate from "@/utils/formatDate";

import IconExit from "../../assets/images/icon-exit.svg?react";

import { ChatsType } from "@/types/users.type";

const ChatMemberListUnit = ({ data, handleFunc }: { data: ChatsType, handleFunc: (() => void)[] }): JSX.Element => {
  const { userInfo, lastReceive, lastMessageCreatedAt, unreadLength } = data

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

export default ChatMemberListUnit;