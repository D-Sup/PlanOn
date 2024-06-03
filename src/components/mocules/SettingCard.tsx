import { useState } from "react";

import { Switch } from "../shadcnUIKit/switch"

interface SettingCardProps {
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string,
  handleFunc: () => void,
  hasSwitch?: boolean
}

const SettingCard = ({ icon: Icon, name, handleFunc, hasSwitch = false }: SettingCardProps) => {

  const [isSwitchOn, setIsSwitchOn] = useState(false);

  return (
    <li className="w-full h-[30px] flex justify-between" style={{ boxShadow: "0 1px var(--gray-heavy)" }} onClick={handleFunc}>
      <div className="pl-[8px] flex gap-[16px]">
        <Icon width={20} height={20} fill={"var(--white)"} />
        <p className="text-md text-white">{name}</p>
      </div>
      {hasSwitch &&
        <Switch checked={isSwitchOn} onCheckedChange={setIsSwitchOn} />}
    </li>

  )
}

export default SettingCard