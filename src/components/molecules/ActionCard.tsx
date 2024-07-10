import IconArrow from "../../assets/images/icon-arrow-right.svg?react";
import IconSubmit from "../../assets/images/icon-submit.svg?react";

interface ActionCardProps {
  className?: string,
  icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
  name: string,
  handleFunc: () => void,
  type?: "collect" | "share",
  color?: string
}

const ActionCard = ({ className, icon: Icon, name, handleFunc, type, color }: ActionCardProps) => {
  return (
    <button type="button" className={`px-[15px] w-full h-[50px] rounded-lg bg-input flex items-center justify-between ${className}`} onClick={handleFunc}>
      <div className="flex items-center gap-[15px]">
        <Icon width={15} height={15} fill={`var(--${color ? color : "white"})`} />
        <p className={`text-md text-${color ? color : "white"}`}>{name}</p>
      </div>
      {type === "collect" && <IconArrow width={15} height={12} fill={"var(--white)"} />}
      {type === "share" && <IconSubmit width={15} height={15} fill={"var(--white)"} />}
    </button>
  )
}

export default ActionCard