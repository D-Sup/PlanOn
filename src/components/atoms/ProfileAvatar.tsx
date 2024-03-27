import React, { useState, useEffect } from "react";
import { Skeleton } from "../shadcnUIKit/skeleton";

import IconLogo from "../../assets/images/icon-logo.svg?react";

const ProfileAvatar = ({ src, className, alt, handleFunc }: {
  src: string | React.FunctionComponent<React.SVGProps<SVGSVGElement>>,
  className: string,
  alt: string,
  handleFunc?: () => void
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = typeof src === "string" && src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  const widthAndHeightPattern = /w-\[\d+px\]|h-\[\d+px\]/g;
  const widthAndHeight = className.match(widthAndHeightPattern);

  return (
    <div className={`${widthAndHeight !== null ? widthAndHeight.join(" ") : ""} relative rounded-full overflow-hidden bg-input`} onClick={handleFunc}>
      {typeof src !== "string"
        ? (
          <div className="absolute-center">
            {React.createElement(src, { width: "20", height: "20", fill: "var(--gray-old)" })}
          </div>
        ) : (
          src !== ""
            ? (
              <>
                {!isLoaded && <Skeleton className="min-w-full h-full rounded-full" />}
                <img
                  src={src}
                  alt={alt}
                  className={`${className} min-w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
                />
              </>
            )
            : <IconLogo fill={"var(--white)"} className="absolute-center w-1/3" />
        )
      }
    </div>
  )
}

export default ProfileAvatar;