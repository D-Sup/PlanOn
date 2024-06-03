import SettingCard from "../mocules/SettingCard";

import IconDarkmode from "../../assets/images/icon-darkmode.svg?react";
import IconAlert from "../../assets/images/icon-alert.svg?react";
import IconInfo from "../../assets/images/icon-info.svg?react";
import IconContact from "../../assets/images/icon-contact.svg?react";
import IconUnsubscribe from "../../assets/images/icon-unsubscribe.svg?react";

const SettingOverview = () => {
  return (
    <ul className="flex flex-col gap-[10px]">
      <SettingCard icon={IconDarkmode} name={"다크모드"} handleFunc={() => { }} hasSwitch={true} />
      <SettingCard icon={IconAlert} name={"알림"} handleFunc={() => { }} hasSwitch={true} />
      <SettingCard icon={IconInfo} name={"앱 튜토리얼"} handleFunc={() => { }} />
      <SettingCard icon={IconContact} name={"문의하기"} handleFunc={() => { }} />
      <SettingCard icon={IconUnsubscribe} name={"계정탈퇴"} handleFunc={() => { }} />
    </ul>
  )
}

export default SettingOverview