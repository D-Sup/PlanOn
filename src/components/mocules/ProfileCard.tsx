import ProfileAvatar from "../atoms/ProfileAvatar"

interface ProfileCardProps {
  title: string,
  description: string,
  src: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  handleFunc?: () => void
}

const ProfileCard = ({ title, description, src, handleFunc }: ProfileCardProps): JSX.Element => {

  return (
    <div className="flex h-[34px]" onClick={handleFunc}>
      <ProfileAvatar
        className="w-[34px] h-[34px]"
        src={src}
        alt="item-image"
      />
      <div className="ml-[10px] flex flex-col justify-center">
        <p className="text-md text-white leading-none">{title}</p>
        <span className="mt-[3px] block text-xsm text-gray-old reduce-words w-[38vw]">{description}</span>
      </div>
    </div>
  )
}

export default ProfileCard