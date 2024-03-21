
import { useNavigate } from "react-router-dom";

import SearchBar from "../atoms/SearchBar";
import ProfileCard from "../mocules/ProfileCard";

import IconArrow from "../../assets/images/icon-arrow-left.svg?react";
import IconSearch from "../../assets/images/icon-search.svg?react";
import IconPlus from "../../assets/images/icon-plus.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";
import iconLocation from "../../assets/images/icon-location.svg";
import IconMoreVertical from "../../assets/images/icon-more-vertical.svg?react";

interface HeaderTypes {
  SearchHeaderForModal: () => JSX.Element;
  MapViewHeaderForModal: ({ data, handleFunc }: { data: any, handleFunc: () => void }) => JSX.Element;
  MapViewHeader: () => JSX.Element;
  SearchHeader: () => JSX.Element;
  FeedHeader: ({ handleFunc }: { handleFunc: (() => void)[] }) => JSX.Element;
  ChatHeader: () => JSX.Element;
  ChatRoomHeader: ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }) => JSX.Element;
  PostDetailHeader: ({ title }: { title: string }) => JSX.Element;
  WritePostHeader: ({ isRequired, handleFunc }: { isRequired: boolean, handleFunc: (() => void)[] }) => JSX.Element;
  ManageSchedulesHeader: ({ title, handleFunc }: { title: string, handleFunc: () => void }) => JSX.Element;
}

const Header = (): HeaderTypes => {
  const isRequired = false;
  const isEdit = false;

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1)
  }

  const SearchHeaderForModal = (): JSX.Element => {
    return (
      <header className="pl-[30px] pr-[30px] flex justify-center gap-[15px] w-screen min-h-[58px]">
        <SearchBar />
      </header>
    )
  }

  const MapViewHeaderForModal = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {
    return (
      <div className="w-screen flex items-center justify-between pb-[10px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <ProfileCard title={"1박2일"} description={"게시물 500"} src={iconLocation} />
        <button type="button" onClick={handleFunc}>
          <IconCircleX width={20} height={20} fill={"var(--gray-old)"} />
        </button>
      </div>
    )
  }

  const MapViewHeader = (): JSX.Element => {
    return (
      <header className="pl-[15px] pr-[15px] flex items-center justify-center gap-[15px] w-screen min-h-[58px]">
        <button className="relative min-w-[38px] min-h-[38px] bg-input rounded-[10px]" type="button" onClick={goBack}>
          <IconArrow className="absolute-center" width={7} height={12} fill={"var(--white)"} />
        </button>
        <SearchBar />
      </header>
    )
  }

  const SearchHeader = (): JSX.Element => {
    return (
      <header className="pl-[15px] pr-[15px] flex items-center justify-center gap-[15px] w-screen min-h-[58px]">
        <SearchBar />
        <button type="button" onClick={goBack}>
          <p className="w-[30px] text-md">취소</p>
        </button>
      </header>
    )
  }

  const FeedHeader = ({ handleFunc }: { handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="flex items-center w-screen min-h-[40px]">
        <button className="p-[10px] absolute right-[50px]" type="button" onClick={handleFunc[0]}>
          <IconSearch width={15} height={15} fill={"var(--white)"} />
        </button>
        <button className="p-[10px] absolute right-[10px]" type="button" onClick={handleFunc[1]}>
          <IconPlus width={15} height={15} fill={"var(--white)"} />
        </button>
      </header>
    )
  }

  const ChatHeader = (): JSX.Element => {
    return (
      <header className="flex items-center w-screen min-h-[40px]">
        <h2 className="ml-[30px] text-white text-xlg font-bold">메시지</h2>
      </header>
    )
  }

  const ChatRoomHeader = ({ data, handleFunc }: { data: any, handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <div className="px-[30px] flex items-center w-screen min-h-[50px]" >
        <button className="mr-[20px]" type="button" onClick={goBack}>
          <IconArrow width={7} height={12} fill={"var(--white)"} />
        </button>
        <ProfileCard title={"동섭"} description={"안녕하세요?"} src={"https://cdn.pixabay.com/photo/2018/08/14/13/23/ocean-3605547_1280.jpg"} handleFunc={handleFunc[0]} />
        <button className="ml-auto" type="button" onClick={() => handleFunc[1]}>
          <IconMoreVertical width={4} height={15} fill={"var(--white)"} />
        </button>
      </div>
    )
  }

  const PostDetailHeader = ({ title }: { title: string }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px]">
        <button className="p-[10px] absolute left-[20px]" type="button" onClick={goBack}>
          <IconArrow width={7} height={12} fill={"var(--white)"} />
        </button>
        <h2 className="text-lg text-white">1박2일</h2>
      </header>
    )
  }

  const WritePostHeader = ({ isRequired, handleFunc }: { isRequired: boolean, handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px]">
        <button className="p-[10px] absolute left-[20px]" type="button" onClick={handleFunc[0]}>
          <IconArrow width={7} height={12} fill={"var(--white)"} />
        </button>
        <h2 className="text-xlg text-white font-bold">게시물 작성</h2>
        <button className="absolute right-[30px]" type="button" onClick={handleFunc[1]}>
          <p className={`text-md font-bold ${isRequired ? "text-red" : "text-gray-heavy"}`}>다음</p>
        </button>
      </header>

    )
  }

  const ManageSchedulesHeader = ({ title, handleFunc }: { title: string, handleFunc: () => void }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px]">
        <button className="absolute left-[30px]" type="button" onClick={goBack}>
          <p className="text-md text-red">취소</p>
        </button>
        <h2 className="text-xlg text-white font-bold">{title}</h2>
        <button className="absolute right-[30px]" type="button" onClick={handleFunc}>
          <p className={`text-md font-bold ${isRequired ? "text-red" : "text-gray-heavy"}`}>{isEdit ? "수정" : "추가"}</p>
        </button>
      </header>
    )
  }

  return { SearchHeaderForModal, MapViewHeaderForModal, MapViewHeader, SearchHeader, FeedHeader, ChatHeader, ChatRoomHeader, PostDetailHeader, WritePostHeader, ManageSchedulesHeader }

}

export default Header