import { useState, useEffect } from "react";
import { Skeleton } from "../shadcnUIKit/skeleton";

const ImageFrame = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setIsLoaded(true);
  }, [src]);

  return (
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
