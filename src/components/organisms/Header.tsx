import { useNavigate } from "react-router-dom";

import SearchBar from "../atoms/SearchBar";
import ProfileCard from "../molecules/ProfileCard";

import IconArrow from "../../assets/images/icon-arrow-left.svg?react";
import IconArrowBottom from "../../assets/images/icon-arrow-bottom.svg?react";
import IconLogo from "../../assets/images/icon-logo.svg?react";
import IconPlus from "../../assets/images/icon-plus.svg?react";
import IconCircleX from "../../assets/images/icon-circle-x.svg?react";
import IconLocation from "../../assets/images/icon-location.svg?react";
import IconAlert from "../../assets/images/icon-alert.svg?react";

const Header = () => {
  // const SearchHeaderForModal = (): JSX.Element => {
  //   return (
  //     <header className="px-[30px] flex justify-center gap-[15px] w-screen min-h-[58px] ">
  //       <SearchBar />
  //     </header>
  //   )
  // }

  const MapViewHeaderForModal = ({ data, handleFunc }: { data: any, handleFunc: () => void }): JSX.Element => {

    return (
      <div className="w-full flex items-center justify-between pb-[10px]" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <ProfileCard title={data?.name || "위치정보없음"} description={data?.formatted_address || "위치정보없음"} src={IconLocation} />
        <button type="button" onClick={handleFunc}>
          <IconCircleX width={20} height={20} fill={"var(--gray-old)"} />
        </button>
      </div>
    )
  }

  const MapViewHeader = ({ handleFunc }: { handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="pl-[15px] pr-[15px] flex items-center justify-center gap-[15px] w-screen min-h-[58px]">
        <button className="relative min-w-[38px] min-h-[38px] bg-input rounded-[10px] shadow-lg" type="button" onClick={handleFunc[0]}>
          <IconArrow className="absolute-center" width={7} height={12} fill={"var(--white)"} />
        </button>
        <div className="w-full" onFocus={handleFunc[1]}>
          <SearchBar />
        </div>
      </header>
    )
  }

  // const SearchHeader = (): JSX.Element => {
  //   return (
  //     <header className="pl-[15px] pr-[15px] flex items-center justify-center gap-[15px] w-screen min-h-[58px]">
  //       <SearchBar />
  //       <button type="button" onClick={goBack}>
  //         <p className="w-[30px] text-md text-white">취소</p>
  //       </button>
  //     </header>
  //   )
  // }

  const FeedHeader = ({ handleFunc }: { handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="flex items-center justify-evenly w-screen min-h-[60px] bg-background-light">
        <button className="relative p-[10px]" type="button" onClick={handleFunc[0]}>
          <IconLogo fill={"var(--white)"} width={25} height={25} />
          <IconArrowBottom width={8} height={8} fill={"var(--white)"} className="absolute bottom-[7px] right-[2px]" />
        </button>
        <div className="ml-[10px] w-3/5">
          <SearchBar height={35} handleFunc={handleFunc[1]} />
        </div>
        <div className="flex-center">
          <button className="p-[10px]" type="button" onClick={handleFunc[2]}>
            <IconPlus width={15} height={15} fill={"var(--white)"} />
          </button>
          <button className="p-[10px]" type="button" onClick={handleFunc[3]}>
            <IconAlert width={17} height={17} fill={"var(--white)"} />
          </button>
        </div>
      </header>
    )
  }

  const ChatHeader = ({ title }: { title: string }): JSX.Element => {
    return (
      <header className="flex items-center w-screen min-h-[40px]">
        <h2 className="ml-[30px] text-white text-xlg font-bold">{title}</h2>
      </header>
    )
  }



  const DetailHeader = ({ title, handleFunc }: { title: string, handleFunc: () => void }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px] bg-background" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <button className="p-[10px] absolute left-[20px]" type="button" onClick={handleFunc}>
          <IconArrow width={7} height={12} fill={"var(--white)"} />
        </button>
        <h2 className="text-lg text-white">{title}</h2>
      </header>
    )
  }

  const ProfileUpdateHeader = ({ isRequired, handleFunc }: { isRequired: boolean, handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px] bg-background" style={{ boxShadow: "0 1px var(--gray-heavy)" }}>
        <button className="p-[10px] absolute left-[20px]" type="button" onClick={handleFunc[0]}>
          <IconArrow width={7} height={12} fill={"var(--white)"} />
        </button>
        <h2 className="text-lg text-white">프로필 편집</h2>
        <button className="absolute right-[30px]" type="button" onClick={() => isRequired && handleFunc[1]()}>
          <p className={`text-md font-bold ${isRequired ? "text-red" : "text-gray-heavy"}`}>완료</p>
        </button>
      </header>
    )
  }

  const WritePostHeader = ({ title, isRequired, handleFunc }: { title: string, isRequired: boolean, handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px]">
        <button className="p-[10px] absolute left-[20px]" type="button" onClick={handleFunc[0]}>
          <IconArrow width={7} height={12} fill={"var(--white)"} />
        </button>
        <h2 className="text-xlg text-white font-bold">{title}</h2>
        <button className="absolute right-[30px]" type="button" onClick={() => isRequired && handleFunc[1]()}>
          <p className={`text-md font-bold ${isRequired ? "text-red" : "text-gray-heavy"}`}>다음</p>
        </button>
      </header>

    )
  }

  const ManageSchedulesHeader = ({ isRequired, isEdit, title, handleFunc }: { isRequired: boolean, isEdit: string, title: string, handleFunc: (() => void)[] }): JSX.Element => {
    return (
      <header className="relative flex-center w-screen min-h-[40px]">
        <button className="absolute left-[30px]" type="button" onClick={handleFunc[0]}>
          <p className="text-md text-red">취소</p>
        </button>
        <h2 className="text-xlg text-white font-bold">{title}</h2>
        <button className="absolute right-[30px]" type="button" onClick={() => isRequired && handleFunc[1]()}>
          <p className={`text-md font-bold ${isRequired ? "text-red" : "text-gray-heavy"}`}>{isEdit}</p>
        </button>
      </header>
    )
  }

  const DownloadSuggestHeader = (): JSX.Element => {
    const navigate = useNavigate()

    return (
      <header className="z-30 fixed top-0 px-[10px] flex items-center justify-between w-screen min-h-[50px] bg-black">
        <div className="flex items-center gap-[10px]">
          <div className="bg-input p-[5px] rounded-[5px]">
            <IconLogo fill={"var(--white)"} width={20} height={20} />
          </div>
          <span className="text-sm text-white">플랜온 앱 추가하고 <span className="text-sm text-red">더 많은 기능 이용하기</span></span>

        </div>
        <button
          className="px-[10px] py-[5px] bg-white text-black text-sm rounded-[5px]"
          type="button"
          onClick={() => {
            navigate("/download", { state: { direction: "fade" } })
          }}
        >
          앱으로 열기
        </button>
      </header>
    )
  }

  return { MapViewHeaderForModal, MapViewHeader, FeedHeader, ChatHeader, DetailHeader, ProfileUpdateHeader, WritePostHeader, ManageSchedulesHeader, DownloadSuggestHeader }

}

export default Header