import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@radix-ui/react-avatar";
import Loader from "../organisms/Loader";

const ImageFrame = ({ ...props }) => {

  return (
    <Avatar className=" min-w-full">
      <AvatarImage {...props} className="w-screen h-full object-cover" />
      <AvatarFallback>
        <div className="absolute-center w-[100px] h-[30px]">
          <Loader />
        </div>
      </AvatarFallback>
    </Avatar>
  )
}

export default ImageFrame;