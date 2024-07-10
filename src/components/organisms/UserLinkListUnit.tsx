import ProfileCard from "../molecules/ProfileCard";

import IconArrow from "../../assets/images/icon-arrow-right.svg?react";

import { UsersType } from "@/types/users.type";

const UserLinkListUnit = ({ data, handleFunc }: { data: UsersType, handleFunc: () => void }): JSX.Element => {
  const { accountName, accountImage, description } = data
  return (

    <li
      className="w-full flex items-center justify-between py-[10px]"
      style={{ boxShadow: "0 1px var(--gray-heavy)" }}
      onClick={handleFunc}
    >
      <ProfileCard title={accountName} description={description} src={accountImage} />
      <IconArrow width={7} height={12} fill={"var(--white)"} className="mr-[10px]" />
    </li>
  )
}

export default UserLinkListUnit;