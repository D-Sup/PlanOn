
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

  return { SearchHeaderForModal, MapViewHeaderForModal, MapViewHeader, SearchHeader, FeedHeader }

}

export default Header