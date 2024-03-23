import { useRef, useState } from "react";

import ImageFrame from "../atoms/ImageFrame";
import CheckBox from "../atoms/CheckBox";

import IconCirclePlus from "../../assets/images/icon-circle-plus.svg?react";
import IconRecycle from "../../assets/images/icon-recycle.svg?react";

const PhotoSelector = () => {

  const [postFormState, setPostFormState] = useState([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  }

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCheckBox = (id: number) => {
  };


  return (
    <div className="relative flex flex-col bg-background">
      {postFormState.photos.preview.length === 0 ?
        (
          <div className="relative inline-block w-full min-h-[300px] rounded-[10px] text-center border-2 border-white">
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
          <div className="relative">
            <ul className="m-auto grid grid-cols-3 gap-1">
              {postFormState.photos.preview.map((image, index) => (
                <li key={index} className="relative aspect-square bg-background">
                  <ImageFrame
                    src={image}
                    alt={`album-${index}`}
                    className="aspect-square object-cover"
                  />
                  <CheckBox
                    id={index}
                    checkedBox={postFormState.photos.checked}
                    checked={postFormState.photos.checked.includes(index)}
                    handleFunc={handleCheckBox}
                  />
                </li>
              ))}
            </ul>
          </div>
        )
      }
      {postFormState.photos.preview.length !== 0 &&
        <button
          className="fixed bottom-[30px] right-[40px] w-[40px] h-[40px] rounded-full"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
          type="button">
          <IconRecycle className="absolute-center" width={15} height={15} fill={"var(--black)"} />
        </button>
      }
    </div>
  );
};

export default PhotoSelector;