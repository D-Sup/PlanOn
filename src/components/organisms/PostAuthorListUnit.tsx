import ProfileAvatar from "../atoms/ProfileAvatar";

import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";
import IconMoreVertical from "../../assets/images/icon-more-vertical.svg?react";
import IconLock from "../../assets/images/icon-lock.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";
import { PostsType } from "@/types/posts.type";


const PostAuthorListUnit = ({ data, handleFunc }: { data: PostsType & { userInfo: UsersType, tagUserInfo: ReadDocumentType<UsersType>[] }, handleFunc: (() => void)[] }): JSX.Element => {
  const { userInfo, usertags, private: isPrivate } = data

  return (
    <div className="flex items-center w-full h-[40px] pl-[10px] pr-[20px] mb-[10px]">

      {/* {isPrivate === true && <IconLock width={15} height={15} fill={"var(--gray-old)"} className="mr-[10px]" />} */}

      <ProfileAvatar
        className="w-[40px] h-[40px]"
        src={userInfo?.accountImage || ""}
        alt="item-image"
        handleFunc={handleFunc[0]}
      />

      <div className="ml-[10px] display flex flex-col justify-center">
        <div className="flex">
          <p className="text-lg text-white button_reset" onClick={handleFunc[0]}>{userInfo?.accountName}</p>
          {isPrivate === true && <IconLock width={15} height={15} fill={"var(--gray-old)"} className="ml-[10px] mt-[3px]" />}
        </div>
        {usertags.length !== 0 &&
          <div className="flex mt-[1px] ml-[3px]" onClick={handleFunc[1]}>
            {
              data.tagUserInfo?.map((tagUser, index: number) => (
                <div className="-ml-[3px]" key={index}>
                  <ProfileAvatar
                    className="w-[15px] h-[15px] border-[1px] border-background-light"
                    src={tagUser.data.accountImage}
                    alt="item-image"
                  />
                </div>
              ))
            }
            <IconCirclePlus width={15} height={15} fill={"var(--white)"} className="relative -ml-[3px]" />
          </div>}
      </div>

      <button className="ml-auto" type="button" onClick={handleFunc[2]}>
        <IconMoreVertical width={4} height={15} fill={"var(--white)"} />
      </button>
    </div>
  )
}

export default PostAuthorListUnit;