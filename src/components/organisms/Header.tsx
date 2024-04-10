
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

  return { SearchHeaderForModal }

}

export default Header