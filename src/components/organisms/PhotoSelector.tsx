import { useRef } from "react";

import useModalStack from "@/hooks/useModalStack";
import usePhotoUpload from "@/hooks/usePhotoUpload";
import { SetterOrUpdater } from "recoil";

import PhotoChecker from "./PhotoChecker";

import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";

import { PostFormValueType } from "@/store";

interface PhotoSelectorProps {
  postFormState: PostFormValueType,
  setPostFormState: SetterOrUpdater<PostFormValueType> | React.Dispatch<React.SetStateAction<PostFormValueType>>,
}
const PhotoSelector = ({ postFormState, setPostFormState }: PhotoSelectorProps) => {

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { isPhotoExtensionValid } = usePhotoUpload();
  const { openModal } = useModalStack();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const { isValid, fileArray, previewArray } = isPhotoExtensionValid(files)
      if (isValid) {
        setPostFormState(Prev => ({ ...Prev, photos: { checked: [], file: fileArray, preview: previewArray } }));
      } else {
        openModal("Alert", "유효하지 않은 파일입니다.", ["확인"], [null])
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // const handleCheckBox = (id: number) => {
  //   if (postFormState.photos.checked.length < 10 || postFormState.photos.checked.includes(id)) {
  //     setPostFormState(prev => {
  //       const checkedData = prev.photos.checked;
  //       return {
  //         ...prev,
  //         photos: {
  //           ...prev.photos,
  //           checked: checkedData.includes(id)
  //             ? checkedData.filter(item => item !== id)
  //             : [...checkedData, id],
  //         },
  //       };
  //     });
  //   } else {
  //     openModal("Alert", "최대 10장까지 선택가능합니다.", ["확인"], [null])
  //   }
  // };

  // const resetPhotos = () => {
  //   setPostFormState(Prev => ({
  //     ...Prev,
  //     photos: { checked: [], file: [], preview: [] },
  //   }));
  // }

  return (
    <>
      <div className="flex flex-col bg-background">
        {postFormState.photos?.preview.length === 0 ?
          (
            <div className="relative inline-block w-full min-h-[290px] rounded-[10px] text-center border-2 border-white">
              <div
                className="flex-center gap-[5px] cursor-pointer w-full h-full absolute-center"
                onClick={handleUploadClick}
              >
                <IconCirclePlus width={20} height={20} fill={"var(--white)"} />
                <label htmlFor="fileInput" className="a11y-hidden">fileInput</label>
                <input
                  ref={fileInputRef}
                  className="sr-only"
                  onChange={handleImageChange}
                  id="fileInput"
                  type="file"
                  accept="image/*"
                  multiple
                />
                <span className="text-lg text-white">사진추가</span>
              </div>
            </div>
          ) : (
            // <ul className="m-auto grid grid-cols-3 gap-1">
            //   <button className="relative aspect-square bg-white" type="button" onClick={resetPhotos}>
            //     <IconRecycle className="absolute-center" width={30} height={30} fill={"var(--black)"} />
            //   </button>
            //   {postFormState.photos.preview.map((image, index) => (
            //     <li key={index} className="relative aspect-square bg-background">
            //       <ImageFrame
            //         src={image}
            //         alt={`album-${index}`}
            //         className="aspect-square object-cover"
            //         onError={resetPhotos}
            //       />
            //       <CheckBox
            //         id={index}
            //         checkedBox={postFormState.photos.checked}
            //         checked={postFormState.photos.checked.includes(index)}
            //         handleFunc={handleCheckBox}
            //       />
            //     </li>
            //   ))}
            // </ul>
            <PhotoChecker photoState={postFormState} setPhotoState={setPostFormState} />
          )
        }
      </div>
    </>
  );
};

export default PhotoSelector;