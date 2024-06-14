import { useState, useEffect } from "react";

import { useRecoilValue, SetterOrUpdater } from "recoil";
import { inputValue } from "@/store";
import useDebounce from "@/hooks/useDebounce";

import UserService from "@/services/userService";
import HashtagService from "@/services/hashtagService";

import { produce } from "immer";
import getAccountId from "@/utils/getAccountId";

import FixedTrigger from "../mocules/FixedTrigger";

import ListUnit from "./ListUnit";
import TagSelectionPanel from "./TagSelectionPanel";
import ProfileCard from "../mocules/ProfileCard";
import ToggleButton from "../atoms/ToggleButton";
import SearchBar from "../atoms/SearchBar";
import ListSkeleton from "../skeleton/ListSkeleton";

import IconHash from "../../assets/images/icon-hash.svg?react";

import { ReadDocumentType } from "@/hooks/useFirestoreRead";
import { UsersType } from "@/types/users.type";
import { HashtagsType } from "@/types/hashtags.type";
import { PostFormValueType } from "@/store";

interface ToggleTagListProps {
  closeModal: () => void,
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void,
  props: {
    type: "userSearch" | "hashtagSearch",
    postFormState: PostFormValueType,
    setPostFormState: SetterOrUpdater<PostFormValueType> | React.Dispatch<React.SetStateAction<PostFormValueType>>,
    handleFunc: (hashtags: Pick<PostFormValueType, "hashtags">) => void
  }
}

const ToggleTagList = ({ closeModal, handleScroll, props }: ToggleTagListProps) => {

  const accountId = getAccountId()

  const inputValueState = useRecoilValue(inputValue);
  const postFormState = props.postFormState
  const setPostFormState = props.setPostFormState

  const [prePostFormState, setPrePostFormState] = useState(postFormState);

  const { UserTagPickerListUnit, HashTagPickerListUnit } = ListUnit();

  const { SearchUser } = UserService()
  const { data: userSearchData, isFetching: isUserFetching, refetch: refetchUser } = SearchUser()

  const { SearchHashTag } = HashtagService()
  const { data: tagSearchData, isFetching: isTagFetching, refetch: refetchTag } = SearchHashTag()

  const { isInputDone, isFetching } = useDebounce(inputValueState, 500, props.type === "userSearch" ? isUserFetching : isTagFetching);

  const handleSelectTag = (tag: ReadDocumentType<UsersType> | ReadDocumentType<HashtagsType> | { id: string, data: { createTag: boolean } }) => {
    setPrePostFormState(
      produce(draft => {
        if (props.type === "userSearch") {
          const index = draft.usertags.findIndex(usertag => usertag.id === tag.id);
          index !== -1 ? draft.usertags.splice(index, 1) : draft.usertags.push(tag as ReadDocumentType<UsersType>);
        } else {
          const index = draft.hashtags.findIndex(hashtag => hashtag.id === tag.id);
          index !== -1 ? draft.hashtags.splice(index, 1) : draft.hashtags.push(tag as ReadDocumentType<HashtagsType>);
        }
      })
    );
  }

  const handleSubmit = () => {
    setPostFormState(
      produce(draft => {
        if (props.type === "userSearch") {
          draft.usertags = prePostFormState.usertags
        } else {
          draft.hashtags = prePostFormState.hashtags;
        }
      })
    )
    closeModal()
    props.handleFunc && setTimeout(() => props.handleFunc(prePostFormState), 500)
  }

  useEffect(() => {
    if (isInputDone) {
      if (props.type === "userSearch") {
        refetchUser()
      } else if (props.type === "hashtagSearch") {
        refetchTag()
      }
    }
  }, [isInputDone])


  return (
    <>
      <FixedTrigger height={58} className="border-b-[1px] border-gray-heavy" enableAnimation={false}>
        <header className="px-[30px] flex justify-center gap-[15px] w-screen min-h-[58px] ">
          <SearchBar />
        </header>
      </FixedTrigger>

      {isFetching && inputValueState ?
        (
          <ListSkeleton className="py-[10px] px-[30px]" repeat={4} />
        ) : (
          <div className="py-[10px] px-[30px] overflow-y-scroll" onScroll={handleScroll}>
            {props.type === "userSearch" && inputValueState && userSearchData?.map((singleUserData) => (
              accountId !== singleUserData.data.authorizationId &&
              <UserTagPickerListUnit key={singleUserData.id} data={singleUserData} selected={prePostFormState.usertags.some(item => item.id === singleUserData.id)} handleFunc={handleSelectTag} />
            ))}
            {props.type === "userSearch" && inputValueState && userSearchData?.length === 0 &&
              <span className="absolute-center text-nowrap text-md text-white">검색어와 일치하는 유저가 없습니다.</span>
            }
            {props.type === "hashtagSearch" && inputValueState &&
              <>
                {(tagSearchData?.some(singleUserData => singleUserData.id !== inputValueState) || tagSearchData?.length === 0) &&
                  <li
                    className="w-full flex items-center justify-between py-[10px]"
                    style={{ boxShadow: "0 1px var(--gray-heavy)" }}
                  >
                    <ProfileCard title={inputValueState} description={"태그 생성"} src={IconHash} />
                    <ToggleButton options={["취소", "선택"]} selected={prePostFormState.hashtags.some(item => item.id === inputValueState)} handleFunc={() => handleSelectTag({ id: inputValueState, data: { createTag: true } })} />
                  </li>
                }
                {
                  tagSearchData?.map((singleUserData) => (
                    <HashTagPickerListUnit key={singleUserData.id} data={singleUserData} selected={prePostFormState.hashtags.some(item => item.id === singleUserData.id)} handleFunc={handleSelectTag} />
                  ))}
              </>
            }
          </div>
        )
      }

      {props.type === "userSearch" &&
        <TagSelectionPanel selectedTagData={prePostFormState.usertags} handleSelectTag={handleSelectTag} handleSubmit={handleSubmit} />
      }
      {props.type === "hashtagSearch" &&
        <TagSelectionPanel selectedTagData={prePostFormState.hashtags} handleSelectTag={handleSelectTag} handleSubmit={handleSubmit} />
      }
    </>
  )
}

export default ToggleTagList