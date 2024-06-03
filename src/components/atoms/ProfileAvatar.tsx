import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@radix-ui/react-avatar";
import Loader from "../organisms/Loader";

import IconLogo from "../../assets/images/icon-logo.svg?react";

const ProfileAvatar = ({ src, className, alt, handleFunc }: {
  src: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  className: string,
  alt: string,
  handleFunc?: () => void
}) => {

  const widthAndHeightPattern = /w-\[\d+px\]|h-\[\d+px\]/g;
  const widthAndHeight = className.match(widthAndHeightPattern);

  return (
    <div className={`${widthAndHeight !== null ? widthAndHeight.join(" ") : ""} relative rounded-full overflow-hidden bg-background-light`} onClick={handleFunc}>
      {typeof src !== "string"
        ? (
          <div className="absolute-center">
            {React.createElement(src, { width: "20", height: "20" })}
          </div>
        ) : (
          src !== ""
            ? <img src={src} className={`${className} rounded-full object-cover`} alt={alt} />
            : <IconLogo fill={"var(--white)"} className="absolute-center w-1/3" />
          // </div>
          //   <div className="relative w-[40px] h-[40px] rounded-full bg-background-light" onCl={handleFunc[0]}>
          // <Avatar onClick={handleFunc}>
          //   <AvatarImage src={src} className={`${className} rounded-full object-cover`} alt={alt} />
          //   <AvatarFallback>
          //     <div className="absolute-center w-[20px] h-[5px]">
          //       <Loader isSmallUse={true} />
          //     </div>
          //   </AvatarFallback>
          // </Avatar>
        )
      }
    </div>
  )
}

export default ProfileAvatar;