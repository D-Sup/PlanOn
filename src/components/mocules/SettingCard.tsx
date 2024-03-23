import { useState } from "react";

import { Switch } from "../shadcnUIKit/switch"

interface SettingCardProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string,
  handleFunc: () => void,
  hasSwitch?: boolean
  isChecked?: boolean,
  isSafeUpdate?: boolean
}

const SettingCard = ({ icon: Icon, name, handleFunc, hasSwitch, isChecked, isSafeUpdate }: SettingCardProps) => {

  const [isSwitchOn, setIsSwitchOn] = useState(isChecked);

  return (
    <li className="w-full h-[30px] flex justify-between" style={{ boxShadow: "0 1px var(--gray-heavy)" }} onClick={() => !hasSwitch && handleFunc()}>
      <div className="pl-[8px] flex gap-[16px]">
        <Icon width={20} height={20} fill={"var(--white)"} />
        <p className="text-md text-white">{name}</p>
      </div>
      {hasSwitch &&
        <Switch checked={isSafeUpdate ? isChecked : isSwitchOn} onCheckedChange={setIsSwitchOn} onClick={handleFunc} />}
    </li>

  )
}

export default SettingCard