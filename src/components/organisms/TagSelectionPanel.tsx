import ProfileAvatar from "../atoms/ProfileAvatar"

import IconCircleX from "../../assets/images/icon-circle-x.svg?react";
import IconHash from "../../assets/images/icon-hash.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";
import { HashtagsType } from "@/types/hashtags.type";

interface TagSelectionPanelProps {
  selectedTagData: undefined | ReadDocumentType<UsersType>[] | ReadDocumentType<HashtagsType>[],
  handleSelectTag: (tag: ReadDocumentType<UsersType> | ReadDocumentType<HashtagsType>) => void,
  handleSubmit: () => void,
}

const TagSelectionPanel = ({ selectedTagData, handleSelectTag, handleSubmit }: TagSelectionPanelProps) => {

  return (
    <>
      <div className={`fixed bottom-0 px-[30px] py-[15px] w-screen flex flex-col justify-between bg-background-light ${selectedTagData !== undefined && selectedTagData.length > 0 ? "h-[150px]" : "h-[94px]"}`} style={{ transition: ".3s" }}>
        <ul className="pt-[4px] pb-[10px] flex gap-[15px] overflow-x-scroll overflow-y-hidden">
          {selectedTagData?.map((singleSelectedTagData) => (
            <li key={singleSelectedTagData.id} className="relative w-[34px] text-center">
              <ProfileAvatar
                src={"accountName" in singleSelectedTagData.data ? singleSelectedTagData.data.accountImage : IconHash}
                className={"w-[34px] h-[34px]"}
                alt={"item-image"} />
              <span className="mt-[5px] w-[40px] text-xsm text-white reduce-words">
                {"accountName" in singleSelectedTagData.data
                  ? singleSelectedTagData.data.accountName
                  : singleSelectedTagData.id
                }
              </span>
              <button className="absolute -right-[4px] -top-[4px]" type="button">
                <IconCircleX onClick={() => handleSelectTag(singleSelectedTagData)} width={15} height={15} fill={"var(--white)"} />
              </button>
            </li>
          ))}
        </ul>
        <button className="w-full min-h-[50px] rounded-[5px] bg-white text-lg font-bold text-black" type="button" onClick={handleSubmit}>선택완료</button>
      </div>
      <div className={`w-screen bg-background ${selectedTagData !== undefined && selectedTagData.length > 0 ? "min-h-[150px]" : "min-h-[94px]"}`}></div>
    </>
  )
}

export default TagSelectionPanel