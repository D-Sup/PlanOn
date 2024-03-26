import { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@radix-ui/react-avatar";
import Loader from "../organisms/Loader";
import { Skeleton } from "../shadcnUIKit/skeleton";

const ImageFrame = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
    // <Avatar className="min-w-full">
    //   <AvatarImage {...props} className="w-screen h-full object-cover" />
    //   <AvatarFallback>
    //     <div className="absolute-center w-[100px] h-[30px]">
    //       <Loader />
    //     </div>
    //   </AvatarFallback>
    // </Avatar>
    <div className="relative min-w-full h-full">
      {!isLoaded && (
        <Skeleton className="min-w-full h-full rounded-none" />
      )}
      <img
        src={src}
        alt={alt}
        {...props}
        className={`min-w-full w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
}

export default ImageFrame;
