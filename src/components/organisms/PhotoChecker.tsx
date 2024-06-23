import useModalStack from "@/hooks/useModalStack";

import ImageFrame from "../atoms/ImageFrame";
import CheckBox from "../atoms/CheckBox";

import IconRecycle from "../../assets/images/icon-recycle.svg?react";

import { PostFormValueType } from "@/store";

interface PhotoChecker {
  isGridAutoFlow?: boolean
  photoState: PostFormValueType,
  setPhotoState: React.Dispatch<React.SetStateAction<PostFormValueType>>,
}

const PhotoChecker = ({ isGridAutoFlow, photoState, setPhotoState }: PhotoChecker) => {

  const { openModal } = useModalStack()

  const handleCheckBox = (id: number) => {
    if (photoState.photos.checked.length < 10 || photoState.photos.checked.includes(id)) {
      setPhotoState(prev => {
        const checkedData = prev.photos.checked;
        return {
          ...prev,
          photos: {
            ...prev.photos,
            checked: checkedData.includes(id)
              ? checkedData.filter(item => item !== id)
              : [...checkedData, id],
          },
        };
      });
    } else {
      openModal("Alert", "최대 10장까지 선택가능합니다.", ["확인"], [null])
    }
  };

  const resetPhotos = () => {
    setPhotoState(Prev => ({
      ...Prev,
      photos: { checked: [], file: [], preview: [] },
    }));
  }

  return (
    <ul className={`${isGridAutoFlow ? "grid-flow-col  overflow-x-scroll" : "grid-cols-3"} grid gap-1`}>
      <button className={`${isGridAutoFlow ? "w-[calc(100vw/2)] h-[200px]" : "aspect-square"} relative bg-white`} type="button" onClick={resetPhotos}>
        <IconRecycle className="absolute-center" width={30} height={30} fill={"var(--black)"} />
      </button>
      {photoState.photos.preview.map((image, index) => (
        <li key={image} className={`${isGridAutoFlow ? "w-[calc(100vw/2)] h-[200px]" : "aspect-square"} relative bg-background`}>
          <ImageFrame
            src={image}
            alt={`album-${index}`}
            className="aspect-square object-cover"
            onError={resetPhotos}
          />
          <CheckBox
            id={index}
            checkedBox={photoState.photos.checked}
            checked={photoState.photos.checked.includes(index)}
            handleFunc={handleCheckBox}
          />
        </li>
      ))}
    </ul>
  )
}

export default PhotoChecker