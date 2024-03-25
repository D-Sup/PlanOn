import { useState, useRef, useEffect, useContext } from "react";
import { UserContext } from "./UserInfoProvider";

import usePhotoUpload from "@/hooks/usePhotoUpload";
import useModalStack from "@/hooks/useModalStack";

import ProfileAvatar from "../atoms/ProfileAvatar";
import PhotoChecker from "./PhotoChecker";

import IconSubmit from "../../assets/images/icon-submit.svg?react";
import IconSendPhoto from "../../assets/images/icon-send-photo.svg?react";

import { PostFormValueType } from "@/store";

interface InteractiveInputProps {
  isCommentOnly?: boolean,
  inputValue: string,
  setInputValue: React.Dispatch<React.SetStateAction<string>>,
  photoState?: PostFormValueType,
  setPhotoState?: React.Dispatch<React.SetStateAction<PostFormValueType>>,
  handleFunc: () => void,
}

const InteractiveInput = ({ isCommentOnly = true, inputValue, setInputValue, photoState, setPhotoState, handleFunc }: InteractiveInputProps) => {

  const { data: userData, isLoading } = useContext(UserContext);

  const [isOpenPhotoChecker, setIsOpenPhotoChecker] = useState<boolean>(false);
  const [prevInpt, setPrevInpt] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const virtualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue === "") {
      setPrevInpt("")
      textareaRef.current.style.height = "auto";
    }
  }, [inputValue])

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setPrevInpt(inputValue)
  };

  useEffect(() => {
    const textareaRefCurrent = textareaRef.current
    const virtualRefCurrent = virtualRef.current
    if (textareaRefCurrent && virtualRefCurrent) {
      if (inputValue.length < prevInpt.length) {
        textareaRefCurrent.style.height = "auto";
      }
      const newHeight = textareaRefCurrent.scrollHeight;
      textareaRefCurrent.style.height = `${newHeight}px`;
      textareaRefCurrent.scrollTop = textareaRefCurrent.scrollHeight;
      virtualRefCurrent.style.minHeight = `${textareaRefCurrent.scrollHeight + 32 <= 117 ? textareaRefCurrent.scrollHeight + 32 : 117}px`;
    }
  }, [inputValue])



  const { isPhotoExtensionValid } = usePhotoUpload();
  const { openModal } = useModalStack();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const { isValid, fileArray, previewArray } = isPhotoExtensionValid(files)
      if (isValid && setPhotoState) {
        setPhotoState(Prev => ({ ...Prev, photos: { checked: [], file: fileArray, preview: previewArray } }));
        setIsOpenPhotoChecker(true)
      } else {
        openModal("Alert", "유효하지 않은 파일입니다.", ["확인"], [null])
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  }

  const handleUploadClick = () => {
    if (fileInputRef.current && !isCommentOnly) {
      fileInputRef.current.click();
    }
  };


  return (
    <>
      <div
        className={`fixed bottom-0 px-[15px] box-border py-4 flex items-end justify-between w-full bg-background transition duration-300`}
        style={{ transform: isOpenPhotoChecker && photoState && photoState.photos.file.length !== 0 ? "translateY(-200px)" : "translateY(0)" }}
      >
        {!isLoading && <ProfileAvatar
          handleFunc={handleUploadClick}
          className="w-[44px] h-[44px]"
          alt="self-profile"
          src={isCommentOnly ? userData?.data?.accountImage as string : IconSendPhoto} />}
        <div className="relative w-[calc(100%-60px)] flex items-center">
          <label htmlFor="interactive-input" className="a11y-hidden">interactive-input</label>
          <textarea
            rows={1}
            name="productInfo"
            id="interactive-input"
            value={inputValue}
            onChange={handleTextareaChange}
            placeholder="입력"
            className="py-[10px] pl-[15px] pr-[50px] w-full max-h-[85px] rounded-[10px] resize-none bg-input text-md text-base text-white overflow-y-scroll scroll-hide"
            style={{ transition: "height .3s" }}
            ref={textareaRef}
          />
          <button
            onClick={() => {
              textareaRef.current.focus()
              if ((inputValue.length !== 0 || photoState && photoState.photos.checked.length !== 0)) {
                handleFunc()
              }
            }
            }
            className="p-[10px] absolute bottom-[-18px] right-[5px] transform -translate-y-1/2"
          >
            <IconSubmit width={20} height={20} fill={inputValue.length > 0 || (photoState && photoState.photos.checked.length > 0) ? "var(--white)" : "var(--gray-heavy)"} />
          </button>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-[200px] overflow-x-scroll transition duration-300 bg-background" style={{ transform: isOpenPhotoChecker && photoState?.photos.file.length !== 0 ? "translateY(0)" : "translateY(100%)" }}>
        {isOpenPhotoChecker && photoState && setPhotoState && <PhotoChecker photoState={photoState} setPhotoState={setPhotoState} isGridAutoFlow={true} />}
      </div>
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
      <div className="w-full max-h-[85px]" ref={virtualRef}></div>
    </>
  )
}

export default InteractiveInput